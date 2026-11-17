import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Database,
  Layers,
  RefreshCw,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import {
  fetchStorefrontCatalog,
  SupabaseNotConfiguredError,
} from '@/src/services/catalog';
import type { ProductWithDetails } from '@/src/types/database';
import { ProductCardSkeleton } from '@/src/components/storefront/ProductCardSkeleton';
import { ProductCarousel } from '@/src/components/storefront/ProductCarousel';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import { useLanguage } from '@/src/context/LanguageContext';

export function HomePage() {
  const { isRTL, t } = useLanguage();
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSupabaseSetup, setNeedsSupabaseSetup] = useState(false);

  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsSupabaseSetup(false);
    try {
      const data = await fetchStorefrontCatalog();
      setProducts(data.products);
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

  const scrollToCarousel = () => {
    const el = document.getElementById('featured-carousel');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] grid grid-cols-1 lg:grid-cols-12 items-stretch shadow-sm">
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
                onClick={scrollToCarousel}
                className="h-12 px-6 rounded-lg bg-[#267C78] hover:bg-[#2F938E] text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{t.home.shopNow}</span>
                <ArrowDown className="w-4 h-4" aria-hidden="true" />
              </button>

              <Link
                to="/products"
                className="h-12 px-5 rounded-lg border border-white/30 hover:border-white text-white font-medium text-sm sm:text-base flex items-center gap-2 transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>{t.home.viewAllProducts}</span>
                <ForwardArrow className="w-4 h-4" aria-hidden="true" />
              </Link>
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

      {/* Trust Badges Strip */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] dark:text-[#63C2BC] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#123B45] dark:text-[#ECF3F4]">
                {t.home.badgeQuality}
              </h3>
              <p className="text-xs text-[#25343A]/75 dark:text-[#9AB2B8] mt-1 leading-relaxed">
                {t.home.badgeQualityDesc}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] dark:text-[#63C2BC] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#123B45] dark:text-[#ECF3F4]">
                {t.home.badgeBundles}
              </h3>
              <p className="text-xs text-[#25343A]/75 dark:text-[#9AB2B8] mt-1 leading-relaxed">
                {t.home.badgeBundlesDesc}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] dark:text-[#63C2BC] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#123B45] dark:text-[#ECF3F4]">
                {t.home.badgeDelivery}
              </h3>
              <p className="text-xs text-[#25343A]/75 dark:text-[#9AB2B8] mt-1 leading-relaxed">
                {t.home.badgeDeliveryDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Carousel Section */}
      <div id="featured-carousel">
        {needsSupabaseSetup ? (
          <div className="max-w-[720px] mx-auto px-4 py-12">
            <div className="rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] p-8 sm:p-10 text-center">
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
          </div>
        ) : error ? (
          <div className="max-w-[640px] mx-auto px-4 py-12">
            <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#112126] p-8 text-center">
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
          </div>
        ) : loading ? (
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        ) : (
          <ProductCarousel products={products} />
        )}
      </div>

      {/* Bottom CTA Banner */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="rounded-2xl border border-[#267C78]/30 bg-gradient-to-br from-[#123B45] to-[#0A2329] text-white p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center md:text-start">
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
              {t.products.pageTitle}
            </h2>
            <p className="text-sm sm:text-base text-white/80 mt-2">
              {t.products.pageSubtitle}
            </p>
          </div>
          <Link
            to="/products"
            className="h-12 px-7 rounded-xl bg-[#267C78] hover:bg-[#2FB0A9] text-white text-sm sm:text-base font-bold flex items-center gap-2.5 transition-colors whitespace-nowrap shadow-lg cursor-pointer"
          >
            <span>{t.home.viewAllProducts}</span>
            <ForwardArrow className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
