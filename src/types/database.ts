export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface PricingTier {
  id: string;
  product_id: string;
  units_per_bundle: number;
  bundle_price: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  brand_id: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductWithDetails extends Product {
  brand: Brand | null;
  category: Category | null;
  pricing_tiers: PricingTier[];
}

export interface CartItem {
  /** Composite key: `${productId}::${pricingTierId}` to keep different offers separate */
  lineKey: string;
  productId: string;
  productName: string;
  productImage: string | null;
  brandName: string;
  categoryName: string;
  pricingTierId: string;
  unitsPerBundle: number;
  bundlePrice: number;
  bundleQuantity: number;
}
