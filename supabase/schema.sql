-- =============================================================================
-- National Care Group (مجموعة العناية الوطنية)
-- Medical E-Commerce Platform - Secure Supabase Schema, Auth Roles, RLS & Seed
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. User Profiles & Role-Based Access Control (Admin / Customer)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Automatically create a 'customer' profile whenever a new Supabase Auth user is created.
-- Users can NEVER assign themselves the 'admin' role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'customer')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Guard against any non-superuser/client attempt to escalate role in profiles
CREATE OR REPLACE FUNCTION public.prevent_role_self_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND auth.uid() IS NOT NULL THEN
    RAISE EXCEPTION 'Only database administrators can change user roles';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_self_escalation();

-- Helper function to verify verified admin role in RLS & RPCs
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
  );
$$;

-- -----------------------------------------------------------------------------
-- 2. Catalog Tables
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  units_per_bundle INTEGER NOT NULL CHECK (units_per_bundle > 0),
  bundle_price NUMERIC(12, 3) NOT NULL CHECK (bundle_price > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast filtering & lookups
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_product_id ON public.pricing_tiers(product_id);

-- Auto-update updated_at timestamp on products
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Transactional RPC for creating or updating a product with its pricing tiers atomically (Admin only)
CREATE OR REPLACE FUNCTION public.save_product_with_tiers(
  p_product_id UUID,
  p_name TEXT,
  p_description TEXT,
  p_image_url TEXT,
  p_brand_id UUID,
  p_category_id UUID,
  p_tiers JSONB
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_product_id UUID;
  v_tier JSONB;
  v_units INTEGER;
  v_price NUMERIC(12, 3);
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Admin privileges required';
  END IF;

  IF p_name IS NULL OR btrim(p_name) = '' THEN
    RAISE EXCEPTION 'Product name is required';
  END IF;

  IF p_tiers IS NULL OR jsonb_array_length(p_tiers) = 0 THEN
    RAISE EXCEPTION 'At least one pricing tier is required';
  END IF;

  IF p_product_id IS NULL THEN
    INSERT INTO public.products (name, description, image_url, brand_id, category_id)
    VALUES (btrim(p_name), p_description, p_image_url, p_brand_id, p_category_id)
    RETURNING id INTO v_product_id;
  ELSE
    UPDATE public.products
    SET
      name = btrim(p_name),
      description = p_description,
      image_url = p_image_url,
      brand_id = p_brand_id,
      category_id = p_category_id
    WHERE id = p_product_id
    RETURNING id INTO v_product_id;

    IF v_product_id IS NULL THEN
      RAISE EXCEPTION 'Product not found';
    END IF;

    DELETE FROM public.pricing_tiers WHERE product_id = v_product_id;
  END IF;

  FOR v_tier IN SELECT * FROM jsonb_array_elements(p_tiers)
  LOOP
    v_units := (v_tier->>'units_per_bundle')::INTEGER;
    v_price := (v_tier->>'bundle_price')::NUMERIC(12, 3);

    IF v_units IS NULL OR v_units <= 0 THEN
      RAISE EXCEPTION 'units_per_bundle must be a positive integer';
    END IF;

    IF v_price IS NULL OR v_price <= 0 THEN
      RAISE EXCEPTION 'bundle_price must be greater than zero';
    END IF;

    INSERT INTO public.pricing_tiers (product_id, units_per_bundle, bundle_price)
    VALUES (v_product_id, v_units, v_price);
  END LOOP;

  RETURN v_product_id;
END;
$$;

-- -----------------------------------------------------------------------------
-- 3. Row Level Security (RLS) Policies
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only read their own profile; cannot self-insert/update/delete admin role
DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Public Read Access for Storefront Catalog
DROP POLICY IF EXISTS "Public read brands" ON public.brands;
CREATE POLICY "Public read brands"
  ON public.brands FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read categories" ON public.categories;
CREATE POLICY "Public read categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read products" ON public.products;
CREATE POLICY "Public read products"
  ON public.products FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Public read pricing_tiers" ON public.pricing_tiers;
CREATE POLICY "Public read pricing_tiers"
  ON public.pricing_tiers FOR SELECT
  USING (true);

-- Admin-Only Write Access (INSERT / UPDATE / DELETE)
DROP POLICY IF EXISTS "Admin insert brands" ON public.brands;
CREATE POLICY "Admin insert brands"
  ON public.brands FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update brands" ON public.brands;
CREATE POLICY "Admin update brands"
  ON public.brands FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete brands" ON public.brands;
CREATE POLICY "Admin delete brands"
  ON public.brands FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin insert categories" ON public.categories;
CREATE POLICY "Admin insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update categories" ON public.categories;
CREATE POLICY "Admin update categories"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete categories" ON public.categories;
CREATE POLICY "Admin delete categories"
  ON public.categories FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin insert products" ON public.products;
CREATE POLICY "Admin insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update products" ON public.products;
CREATE POLICY "Admin update products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete products" ON public.products;
CREATE POLICY "Admin delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admin insert pricing_tiers" ON public.pricing_tiers;
CREATE POLICY "Admin insert pricing_tiers"
  ON public.pricing_tiers FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update pricing_tiers" ON public.pricing_tiers;
CREATE POLICY "Admin update pricing_tiers"
  ON public.pricing_tiers FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete pricing_tiers" ON public.pricing_tiers;
CREATE POLICY "Admin delete pricing_tiers"
  ON public.pricing_tiers FOR DELETE
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. Storage Bucket & Admin-Only Upload/Delete Policies
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
CREATE POLICY "Public read product-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin upload product-images" ON storage.objects;
CREATE POLICY "Admin upload product-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin update product-images" ON storage.objects;
CREATE POLICY "Admin update product-images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin delete product-images" ON storage.objects;
CREATE POLICY "Admin delete product-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. Initial Sample Data (Idempotent — only inserts if not already present)
--    A. Digital Thermometer: 1 offer (1 pack = 3.750 KWD)
--    B. Surgical Masks: 2 offers (1 pack = 2.250 KWD, 4 packs = 8.000 KWD)
--    C. Blood Glucose Test Strips: 3 offers (1 pack = 5.500, 4 packs = 19.500, 12 packs = 55.000 KWD)
-- -----------------------------------------------------------------------------
INSERT INTO public.brands (id, name) VALUES
  ('11111111-1111-4111-8111-111111111101', 'MedCare'),
  ('11111111-1111-4111-8111-111111111102', 'HealthPro')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.categories (id, name) VALUES
  ('22222222-2222-4222-8222-222222222201', 'المستلزمات الطبية · Medical Supplies'),
  ('22222222-2222-4222-8222-222222222202', 'أجهزة التشخيص · Diagnostic Equipment')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, description, image_url, brand_id, category_id) VALUES
  (
    '33333333-3333-4333-8333-333333333301',
    'Digital Thermometer · ميزان حرارة رقمي طبي',
    'ميزان حرارة رقمي عالي الدقة بشاشة LCD واضحة ورأس مرن، مناسب للاستخدام المنزلي والعيادات الطبية. High-precision digital medical thermometer with clear LCD readout.',
    '/assets/aistudio/a_48065c40.jpg',
    '11111111-1111-4111-8111-111111111102',
    '22222222-2222-4222-8222-222222222202'
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    'Surgical Masks · كمامات طبية جراحية (50 كمامة)',
    'كمامات طبية جراحية 3 طبقات بكفاءة ترشيح عالية ≥ 98% مع حلقات أذن مريحة. 3-ply disposable surgical face masks (50 masks per pack) for clinical and home protection.',
    '/assets/aistudio/b_17e3433c.jpg',
    '11111111-1111-4111-8111-111111111101',
    '22222222-2222-4222-8222-222222222201'
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    'Blood Glucose Test Strips · شرائط قياس السكر في الدم',
    'شرائط قياس الجلوكوز في الدم دقيقة وسريعة النتائج بعينة دم صغيرة (50 شريطاً للعبوة). Accurate blood glucose test strips compatible with GlucoSafe meters.',
    '/assets/aistudio/c_31a907e2.jpg',
    '11111111-1111-4111-8111-111111111102',
    '22222222-2222-4222-8222-222222222202'
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pricing_tiers (id, product_id, units_per_bundle, bundle_price) VALUES
  -- Product A: Digital Thermometer (1 offer: 1 pack = 3.750 KWD)
  ('44444444-4444-4444-8444-444444444401', '33333333-3333-4333-8333-333333333301', 1, 3.750),

  -- Product B: Surgical Masks (2 offers: 1 pack = 2.250 KWD, 4 packs = 8.000 KWD)
  ('44444444-4444-4444-8444-444444444402', '33333333-3333-4333-8333-333333333302', 1, 2.250),
  ('44444444-4444-4444-8444-444444444403', '33333333-3333-4333-8333-333333333302', 4, 8.000),

  -- Product C: Blood Glucose Test Strips (3 offers: 1 pack = 5.500, 4 packs = 19.500, 12 packs = 55.000 KWD)
  ('44444444-4444-4444-8444-444444444404', '33333333-3333-4333-8333-333333333303', 1, 5.500),
  ('44444444-4444-4444-8444-444444444405', '33333333-3333-4333-8333-333333333303', 4, 19.500),
  ('44444444-4444-4444-8444-444444444406', '33333333-3333-4333-8333-333333333303', 12, 55.000)
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- HOW TO PROMOTE YOUR FIRST ADMIN USER (Run in Supabase SQL Editor AFTER creating
-- the user in Authentication -> Users):
--
--   UPDATE public.profiles
--   SET role = 'admin'
--   WHERE email = 'YOUR_ADMIN_EMAIL@example.com';
-- =============================================================================
