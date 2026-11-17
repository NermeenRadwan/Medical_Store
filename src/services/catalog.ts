import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import type { Brand, Category, PricingTier, ProductWithDetails } from '@/src/types/database';

export interface StorefrontCatalogData {
  products: ProductWithDetails[];
  brands: Brand[];
  categories: Category[];
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super('لم يتم ربط قاعدة بيانات Supabase بعد. يرجى إضافة بيانات الاتصال للمتابعة.');
    this.name = 'SupabaseNotConfiguredError';
  }
}

export async function fetchStorefrontCatalog(): Promise<StorefrontCatalogData> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseNotConfiguredError();
  }

  const [brandsRes, categoriesRes, productsRes] = await Promise.all([
    supabase.from('brands').select('id, name, created_at').order('name', { ascending: true }),
    supabase.from('categories').select('id, name, created_at').order('name', { ascending: true }),
    supabase
      .from('products')
      .select(
        `
        id,
        name,
        description,
        image_url,
        brand_id,
        category_id,
        created_at,
        updated_at,
        brand:brands(id, name, created_at),
        category:categories(id, name, created_at),
        pricing_tiers(id, product_id, units_per_bundle, bundle_price, created_at)
      `
      )
      .order('created_at', { ascending: true }),
  ]);

  if (brandsRes.error) throw new Error(brandsRes.error.message);
  if (categoriesRes.error) throw new Error(categoriesRes.error.message);
  if (productsRes.error) throw new Error(productsRes.error.message);

  const products: ProductWithDetails[] = (productsRes.data ?? []).map((row: Record<string, unknown>) => {
    const rawTiers = Array.isArray(row.pricing_tiers) ? (row.pricing_tiers as PricingTier[]) : [];
    const sortedTiers = [...rawTiers]
      .map((tier) => ({
        ...tier,
        units_per_bundle: Number(tier.units_per_bundle),
        bundle_price: Number(tier.bundle_price),
      }))
      .sort((a, b) => a.units_per_bundle - b.units_per_bundle);

    const rawBrand = Array.isArray(row.brand) ? row.brand[0] : row.brand;
    const rawCategory = Array.isArray(row.category) ? row.category[0] : row.category;

    return {
      id: String(row.id),
      name: String(row.name),
      description: row.description ? String(row.description) : null,
      image_url: row.image_url ? String(row.image_url) : null,
      brand_id: String(row.brand_id),
      category_id: String(row.category_id),
      created_at: String(row.created_at),
      updated_at: String(row.updated_at),
      brand: (rawBrand as Brand | null) ?? null,
      category: (rawCategory as Category | null) ?? null,
      pricing_tiers: sortedTiers,
    };
  });

  return {
    products,
    brands: (brandsRes.data ?? []) as Brand[],
    categories: (categoriesRes.data ?? []) as Category[],
  };
}

export async function fetchProductById(productId: string): Promise<ProductWithDetails | null> {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseNotConfiguredError();
  }

  const { data, error } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      description,
      image_url,
      brand_id,
      category_id,
      created_at,
      updated_at,
      brand:brands(id, name, created_at),
      category:categories(id, name, created_at),
      pricing_tiers(id, product_id, units_per_bundle, bundle_price, created_at)
    `
    )
    .eq('id', productId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) return null;

  const row = data as Record<string, unknown>;
  const rawTiers = Array.isArray(row.pricing_tiers) ? (row.pricing_tiers as PricingTier[]) : [];
  const sortedTiers = [...rawTiers]
    .map((tier) => ({
      ...tier,
      units_per_bundle: Number(tier.units_per_bundle),
      bundle_price: Number(tier.bundle_price),
    }))
    .sort((a, b) => a.units_per_bundle - b.units_per_bundle);

  const rawBrand = Array.isArray(row.brand) ? row.brand[0] : row.brand;
  const rawCategory = Array.isArray(row.category) ? row.category[0] : row.category;

  return {
    id: String(row.id),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    image_url: row.image_url ? String(row.image_url) : null,
    brand_id: String(row.brand_id),
    category_id: String(row.category_id),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
    brand: (rawBrand as Brand | null) ?? null,
    category: (rawCategory as Category | null) ?? null,
    pricing_tiers: sortedTiers,
  };
}

