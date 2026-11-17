import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Minus,
  PackageCheck,
  Plus,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchProductById,
  SupabaseNotConfiguredError,
} from '@/src/services/catalog';
import type { PricingTier, ProductWithDetails } from '@/src/types/database';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import {
  formatBundleLabel,
  formatKWD,
  formatKWDFromFils,
  multiplyBundlePriceFils,
} from '@/src/utils/currency';
import { cn } from '@/src/utils/cn';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { language, isRTL, t } = useLanguage();

  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsSupabaseSetup, setNeedsSupabaseSetup] = useState(false);

  const [selectedTierId, setSelectedTierId] = useState<string>('');
  const [bundleQuantity, setBundleQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const loadProduct = useCallback(async () => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setNeedsSupabaseSetup(false);
    try {
      const result = await fetchProductById(id);
      setProduct(result);
      if (result && result.pricing_tiers.length > 0) {
        setSelectedTierId(result.pricing_tiers[0].id);
      } else {
        setSelectedTierId('');
      }
      setBundleQuantity(1);
      setJustAdded(false);
    } catch (err) {
      if (err instanceof SupabaseNotConfiguredError) {
        setNeedsSupabaseSetup(true);
      } else {
        setError(err instanceof Error ? err.message : '__FALLBACK__');
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const selectedTier: PricingTier | undefined = useMemo(() => {
    if (!product || product.pricing_tiers.length === 0) return undefined;
    return (
      product.pricing_tiers.find((tier) => tier.id === selectedTierId) ??
      product.pricing_tiers[0]
    );
  }, [product, selectedTierId]);

  const totalFils = useMemo(() => {
    if (!selectedTier) return 0;
    return multiplyBundlePriceFils(selectedTier.bundle_price, bundleQuantity);
  }, [selectedTier, bundleQuantity]);

  const totalActualPacks = useMemo(() => {
    if (!selectedTier) return 0;
    return selectedTier.units_per_bundle * bundleQuantity;
  }, [selectedTier, bundleQuantity]);

  const handleDecrease = () => {
    setBundleQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    setBundleQuantity((prev) => prev + 1);
  };

  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.trim();
    if (raw === '') return;
    const parsed = Number(raw);
    if (Number.isInteger(parsed) && parsed >= 1) {
      setBundleQuantity(parsed);
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedTier) {
      toast.error(t.product.noValidTierToast);
      return;
    }

    if (!Number.isInteger(bundleQuantity) || bundleQuantity < 1) {
      toast.error(t.product.invalidQuantityToast);
      return;
    }

    const ok = addToCart(product, selectedTier, bundleQuantity);
    if (ok) {
      setJustAdded(true);
      toast.success(t.product.addedToastTitle, {
        description: t.product.addedDetailToastDesc(
          bundleQuantity,
          formatBundleLabel(selectedTier.units_per_bundle, language),
          formatKWDFromFils(totalFils, language)
        ),
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="h-5 w-48 rounded bg-slate-200 dark:bg-[#1D353C] animate-pulse mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 aspect-square rounded-2xl bg-[#E8F4F1] dark:bg-[#172B31] animate-pulse" />
          <div className="lg:col-span-6 rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 sm:p-8 space-y-4 animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-200 dark:bg-[#1D353C]" />
            <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-[#1D353C]" />
            <div className="h-20 w-full rounded bg-slate-100 dark:bg-[#172B31]" />
            <div className="h-28 w-full rounded-xl bg-slate-100 dark:bg-[#172B31]" />
            <div className="h-12 w-full rounded-lg bg-slate-200 dark:bg-[#1D353C]" />
          </div>
        </div>
      </div>
    );
  }

  if (needsSupabaseSetup) {
    return (
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-4">
            <Database className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-display text-xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.home.supabaseTitle}
          </h1>
          <p className="text-sm text-[#25343A]/80 dark:text-[#9AB2B8] mt-2 leading-relaxed">
            {t.product.supabaseRequiredDesc}
          </p>
          <Link
            to="/"
            className="mt-6 h-11 px-5 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white text-sm font-medium inline-flex items-center gap-2"
          >
            <BackArrow className="w-4 h-4" aria-hidden="true" />
            <span>{t.product.backToStore}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-12">
        <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-[#112126] p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h1 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.product.loadErrorTitle}
          </h1>
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1.5" dir="ltr">
            {error === '__FALLBACK__' ? t.errors.loadProductFallback : error}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={loadProduct}
              className="h-10 px-5 rounded-lg bg-[#267C78] text-white text-sm font-medium inline-flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>{t.home.retry}</span>
            </button>
            <Link
              to="/"
              className="h-10 px-5 rounded-lg border border-slate-200 dark:border-[#213B43] text-sm font-medium inline-flex items-center gap-2"
            >
              <span>{t.product.backToStore}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-14">
        <div className="rounded-2xl border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#112126] p-8 text-center">
          <h1 className="font-display text-xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.product.notFoundTitle}
          </h1>
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-2">
            {t.product.notFoundDesc}
          </p>
          <Link
            to="/"
            className="mt-6 h-11 px-5 rounded-lg bg-[#123B45] dark:bg-[#267C78] text-white text-sm font-medium inline-flex items-center gap-2"
          >
            <BackArrow className="w-4 h-4" aria-hidden="true" />
            <span>{t.product.backToCatalog}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label={t.product.breadcrumbAria}
        className="mb-6 flex items-center gap-2 text-sm text-[#25343A]/70 dark:text-[#9AB2B8]"
      >
        <Link
          to="/"
          className="hover:text-[#267C78] dark:hover:text-[#ECF3F4] transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <BackArrow className="w-4 h-4" aria-hidden="true" />
          <span>{t.product.breadcrumbCatalog}</span>
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#123B45] dark:text-[#ECF3F4] font-medium truncate">
          {product.name}
        </span>
      </nav>

      {/* Main Product Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Product Image Column */}
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-[#213B43] bg-[#E8F4F1] dark:bg-[#172B31] aspect-square">
            <MedicalImage
              src={product.image_url}
              alt={product.name}
              lazy={false}
              containerClassName="w-full h-full"
            />
          </div>
        </div>

        {/* Contiguous Purchase & Pricing Module */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 sm:p-8 flex flex-col gap-6">
          {/* Clean Unboxed Metadata */}
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#267C78] dark:text-[#63C2BC]">
              <span>🏷️ {product.brand?.name ?? t.product.defaultBrand}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-[#2E4D57]">
                ·
              </span>
              <span className="text-[#25343A]/75 dark:text-[#9AB2B8]">
                📂 {product.category?.name ?? t.product.defaultCategory}
              </span>
            </div>

            <h1
              className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4] leading-snug"
              style={{ textWrap: 'balance' }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p className="text-sm sm:text-base text-[#25343A]/80 dark:text-[#9AB2B8] leading-relaxed pt-1">
                {product.description}
              </p>
            )}
          </div>

          {/* Pricing Tiers Selector */}
          <div className="pt-5 border-t border-slate-100 dark:border-[#1D353C] flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-[#123B45] dark:text-[#ECF3F4]">
                📦 {t.product.chooseOffer}
              </h2>
              <span className="text-xs text-[#25343A]/65 dark:text-[#9AB2B8] font-mono-num">
                {product.pricing_tiers.length === 1
                  ? t.product.availableOffersOne
                  : t.product.availableOffersMany(product.pricing_tiers.length)}
              </span>
            </div>

            <p className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
              {t.product.offerExplain}
            </p>

            {product.pricing_tiers.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 mt-1">
                {product.pricing_tiers.map((tier) => {
                  const isSelected = selectedTier?.id === tier.id;
                  const bundleLabel = formatBundleLabel(tier.units_per_bundle, language);
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => {
                        setSelectedTierId(tier.id);
                        setJustAdded(false);
                      }}
                      aria-pressed={isSelected}
                      className={cn(
                        'w-full p-4 rounded-xl border text-start flex items-center justify-between gap-4 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]',
                        isSelected
                          ? 'border-[#267C78] bg-[#E8F4F1]/80 dark:bg-[#172B31] text-[#123B45] dark:text-[#ECF3F4]'
                          : 'border-slate-200 dark:border-[#213B43] bg-[#F5F7F8]/60 dark:bg-[#0B1518] text-[#25343A] dark:text-[#9AB2B8] hover:border-[#267C78]/60'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={cn(
                            'w-5 h-5 rounded-full border flex items-center justify-center shrink-0',
                            isSelected
                              ? 'border-[#267C78] bg-[#267C78] text-white'
                              : 'border-slate-300 dark:border-[#2E4D57]'
                          )}
                          aria-hidden="true"
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-base font-bold">
                            {t.product.bundleTitle(bundleLabel)}
                          </span>
                          <span className="text-xs text-[#25343A]/65 dark:text-[#9AB2B8]">
                            {t.product.bundleContains(tier.units_per_bundle)}
                          </span>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <span className="font-mono-num text-base sm:text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] block">
                          {formatKWD(tier.bundle_price, language)}
                        </span>
                        <span className="text-[11px] text-[#267C78] dark:text-[#63C2BC]">
                          {t.product.bundlePriceLabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                {t.product.noTiers}
              </div>
            )}
          </div>

          {/* Quantity Selector & Live Price Calculation */}
          {selectedTier && (
            <div className="pt-5 border-t border-slate-100 dark:border-[#1D353C] flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <label
                    htmlFor="bundle-quantity-input"
                    className="block text-sm font-bold text-[#123B45] dark:text-[#ECF3F4]"
                  >
                    {t.product.quantityLabel}
                  </label>
                  <p className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8] mt-0.5">
                    {t.product.actualPacksLabel}{' '}
                    <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                      {totalActualPacks}
                    </span>{' '}
                    {t.product.packWord(totalActualPacks)}
                  </p>
                </div>

                {/* Stepper Controls */}
                <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] p-1 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleDecrease}
                    disabled={bundleQuantity <= 1}
                    aria-label={t.product.decreaseQtyAria}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-white dark:hover:bg-[#172B31] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    id="bundle-quantity-input"
                    type="number"
                    min={1}
                    step={1}
                    value={bundleQuantity}
                    onChange={handleQuantityInputChange}
                    aria-label={t.product.qtyInputAria}
                    className="w-16 h-10 text-center bg-transparent font-mono-num text-base font-bold text-[#123B45] dark:text-[#ECF3F4] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    onClick={handleIncrease}
                    aria-label={t.product.increaseQtyAria}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-white dark:hover:bg-[#172B31] transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Calculated Price Box */}
              <div className="rounded-xl bg-[#E8F4F1]/80 dark:bg-[#172B31] border border-[#267C78]/25 dark:border-[#267C78]/40 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#123B45] dark:text-[#ECF3F4]">
                    {t.product.calculatedTotalLabel(
                      bundleQuantity,
                      formatKWD(selectedTier.bundle_price, language)
                    )}
                  </span>
                  <span className="font-mono-num text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
                    {formatKWDFromFils(totalFils, language)}
                  </span>
                </div>
                <p className="text-xs text-[#25343A]/75 dark:text-[#9AB2B8]">
                  {t.product.autoPriceNote}
                </p>
              </div>

              {/* Primary Add to Cart & Post-Add Navigation */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full h-12 px-6 rounded-xl bg-[#267C78] hover:bg-[#1F6966] text-white font-semibold text-base flex items-center justify-center gap-2.5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]"
                >
                  <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                  <span>{t.product.addOfferToCart}</span>
                </button>

                {justAdded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <Link
                      to="/cart"
                      className="h-11 px-4 rounded-lg bg-[#123B45] dark:bg-[#1E4F5C] hover:opacity-95 text-white text-sm font-medium flex items-center justify-center gap-2 transition-opacity"
                    >
                      <PackageCheck className="w-4 h-4" aria-hidden="true" />
                      <span>{t.product.viewCart}</span>
                    </Link>
                    <Link
                      to="/"
                      className="h-11 px-4 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-[#123B45] dark:text-[#ECF3F4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <BackArrow className="w-4 h-4" aria-hidden="true" />
                      <span>{t.product.continueShopping}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
