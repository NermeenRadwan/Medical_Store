import { supabase, isSupabaseConfigured } from '@/src/lib/supabase';
import { SupabaseNotConfiguredError } from '@/src/services/catalog';

export interface PricingTierInput {
  units_per_bundle: number;
  bundle_price: number;
}

export interface SaveProductInput {
  id?: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  brand_id: string;
  category_id: string;
  tiers: PricingTierInput[];
}

function ensureSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new SupabaseNotConfiguredError();
  }
  return supabase;
}

export async function saveProductWithTiers(input: SaveProductInput): Promise<string> {
  const client = ensureSupabase();

  const { data, error } = await client.rpc('save_product_with_tiers', {
    p_product_id: input.id ?? null,
    p_name: input.name.trim(),
    p_description: input.description?.trim() || null,
    p_image_url: input.image_url?.trim() || null,
    p_brand_id: input.brand_id,
    p_category_id: input.category_id,
    p_tiers: input.tiers.map((tier) => ({
      units_per_bundle: tier.units_per_bundle,
      bundle_price: Number(tier.bundle_price.toFixed(3)),
    })),
  });

  if (error) throw new Error(error.message);
  return String(data);
}

export async function deleteProductById(productId: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('products').delete().eq('id', productId);
  if (error) throw new Error(error.message);
}

export async function uploadProductImage(file: File): Promise<string> {
  const client = ensureSupabase();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const filePath = `products/${safeName}`;

  const { error: uploadError } = await client.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = client.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function createBrand(name: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('brands').insert({ name: name.trim() });
  if (error) throw new Error(error.message);
}

export async function updateBrand(id: string, name: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('brands').update({ name: name.trim() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBrand(id: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('brands').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createCategory(name: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('categories').insert({ name: name.trim() });
  if (error) throw new Error(error.message);
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('categories').update({ name: name.trim() }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string): Promise<void> {
  const client = ensureSupabase();
  const { error } = await client.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
