import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  Database,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import {
  fetchStorefrontCatalog,
  SupabaseNotConfiguredError,
} from '@/src/services/catalog';
import type { Brand, Category, ProductWithDetails } from '@/src/types/database';
import { ProductCard } from '@/src/components/storefront/ProductCard';
import { ProductCardSkeleton } from '@/src/components/storefront/ProductCardSkeleton';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import { useLanguage } from '@/src/context/LanguageContext';
import { cn } from '@/src/utils/cn';

export function HomePage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSupabaseSetup, setNeedsSupabaseSetup] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsSupabaseSetup(false);
    try {
      const data = await fetchStorefrontCatalog();
      setProducts(data.products);
      setBrands(data.brands);
      setCategories(data.categories);
    } catch (err) {
      if (err instanceof SupabaseNotConfiguredError) {
        setNeedsSupabaseSetup(true);
      } else {
        setError(err instanceof Error ? err.message : '__FALLBACK__');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((product) => {
      const matchesBrand =
        selectedBrandId === 'all' || product.brand_id === selectedBrandId;
      const matchesCategory =
        selectedCategoryId === 'all' || product.category_id === selectedCategoryId;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description?.toLowerCase().includes(query) ?? false) ||
        (product.brand?.name.toLowerCase().includes(query) ?? false) ||
        (product.category?.name.toLowerCase().includes(query) ?? false);

      return matchesBrand && matchesCategory && matchesQuery;
    });
  }, [products, searchQuery, selectedBrandId, selectedCategoryId]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedBrandId !== 'all' ||
    selectedCategoryId !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrandId('all');
    setSelectedCategoryId('all');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Hero Copy Column */}
          <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-center gap-5 bg-[#123B45] text-white">
            <p className="text-xs sm:text-sm font-medium text-[#9EE0DA] tracking-wide">
              {t.home.kicker}
            </p>

            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[2.65rem] font-bold leading-[1.25] text-white"
              style={{ textWrap: 'balance' }}
            >
              {t.home.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {t.home.heroSubtitle}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="h-12 px-6 rounded-lg bg-[#267C78] hover:bg-[#2F938E] text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{t.home.shopNow}</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Hero Imagery Column */}
          <div className="lg:col-span-6 min-h-[260px] sm:min-h-[340px] lg:min-h-[420px] relative">
            <MedicalImage
              src="/assets/aistudio/hero_89ea1219.jpg"
              alt={t.brand.heroAlt}
              lazy={false}
              containerClassName="w-full h-full"
              className="w-full h-full object-cover object-left"
            />
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.home.catalogTitle}
            </h2>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1">
              {t.home.catalogSubtitle}
            </p>
          </div>

          {!loading && !needsSupabaseSetup && !error && (
            <div className="text-sm text-[#25343A]/70 dark:text-[#9AB2B8] font-mono-num">
              {t.home.resultsCount(filteredProducts.length, products.length)}
            </div>
          )}
        </div>

        {/* Search & Filters Panel */}
        <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-4 sm:p-5 mb-8 flex flex-col gap-4">
          {/* Search Input + Clear Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-slate-400 dark:text-[#9AB2B8] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                aria-label={t.home.searchAria}
                className="w-full h-11 ps-10 pe-10 rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] text-sm text-[#25343A] dark:text-[#ECF3F4] placeholder:text-slate-400 dark:placeholder:text-[#9AB2B8]/60 focus:outline-none focus:border-[#267C78] focus:ring-1 focus:ring-[#267C78]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label={t.home.clearSearchAria}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#25343A] dark:hover:text-[#ECF3F4] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-11 px-4 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-sm font-medium text-[#123B45] dark:text-[#ECF3F4] flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>{t.home.clearFilters}</span>
              </button>
            )}
          </div>

          {/* Dynamic Category & Brand Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-[#1D353C]">
            {/* Category Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#25343A]/75 dark:text-[#9AB2B8]">
                {t.home.categoryFilterLabel}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId('all')}
                  aria-pressed={selectedCategoryId === 'all'}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                    selectedCategoryId === 'all'
                      ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                      : 'bg-[#F5F7F8] dark:bg-[#0D1A1E] text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31]'
                  )}
                >
                  {t.home.allCategories}
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    aria-pressed={selectedCategoryId === category.id}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                      selectedCategoryId === category.id
                        ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                        : 'bg-[#F5F7F8] dark:bg-[#0D1A1E] text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31]'
                    )}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-[#25343A]/75 dark:text-[#9AB2B8]">
                {t.home.brandFilterLabel}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedBrandId('all')}
                  aria-pressed={selectedBrandId === 'all'}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                    selectedBrandId === 'all'
                      ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                      : 'bg-[#F5F7F8] dark:bg-[#0D1A1E] text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31]'
                  )}
                >
                  {t.home.allBrands}
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() => setSelectedBrandId(brand.id)}
                    aria-pressed={selectedBrandId === brand.id}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap',
                      selectedBrandId === brand.id
                        ? 'bg-[#123B45] dark:bg-[#267C78] text-white'
                        : 'bg-[#F5F7F8] dark:bg-[#0D1A1E] text-[#25343A] dark:text-[#9AB2B8] hover:bg-[#E8F4F1] dark:hover:bg-[#172B31]'
                    )}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Supabase Setup Required State */}
        {needsSupabaseSetup ? (
          <div className="rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] p-8 sm:p-10 text-center max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.home.supabaseTitle}
            </h3>
            <p className="text-sm text-[#25343A]/80 dark:text-[#9AB2B8] mt-2 leading-relaxed">
              {t.home.supabaseDesc}
            </p>
            <div className="mt-5 p-4 rounded-xl bg-[#F5F7F8] dark:bg-[#0B1518] text-start text-xs sm:text-sm text-[#25343A] dark:text-[#9AB2B8] space-y-1.5">
              <p className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                {t.home.supabaseStepsTitle}
              </p>
              <p>{t.home.supabaseStep1}</p>
              <p>{t.home.supabaseStep2}</p>
            </div>
          </div>
        ) : error ? (
          /* Database Error State */
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#112126] p-8 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.home.errorTitle}
            </h3>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1.5" dir="ltr">
              {error === '__FALLBACK__' ? t.errors.loadCatalogFallback : error}
            </p>
            <button
              type="button"
              onClick={loadCatalog}
              className="mt-5 h-10 px-5 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>{t.home.retry}</span>
            </button>
          </div>
        ) : loading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty Results State */
          <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-10 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" aria-hidden="true" />
            </div>
            <h3 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.home.emptyTitle}
            </h3>
            <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1.5">
              {t.home.emptyDesc}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 h-10 px-5 rounded-lg bg-[#267C78] hover:bg-[#1F6966] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>{t.home.showAllProducts}</span>
              </button>
            )}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
