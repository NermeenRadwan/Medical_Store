import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import type { PricingTier, ProductWithDetails } from '@/src/types/database';
import { formatBundleLabel, formatKWD } from '@/src/utils/currency';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import { cn } from '@/src/utils/cn';

interface ProductCardProps {
  product: ProductWithDetails;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { language, isRTL, t } = useLanguage();
  const tiers = product.pricing_tiers;
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[0]?.id ?? '');

  useEffect(() => {
    if (tiers.length > 0 && !tiers.some((tItem) => tItem.id === selectedTierId)) {
      setSelectedTierId(tiers[0].id);
    }
  }, [tiers, selectedTierId]);

  const selectedTier: PricingTier | undefined =
    tiers.find((tItem) => tItem.id === selectedTierId) ?? tiers[0];

  const handleQuickAdd = () => {
    if (!selectedTier) {
      toast.error(t.product.noValidTierToast);
      return;
    }
    const added = addToCart(product, selectedTier, 1);
    if (added) {
      toast.success(t.product.addedToastTitle, {
        description: t.product.addedToastDesc(
          product.name,
          formatBundleLabel(selectedTier.units_per_bundle, language),
          formatKWD(selectedTier.bundle_price, language)
        ),
      });
    }
  };

  return (
    <article className="group rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:hover:border-[#267C78]/70">
      {/* Studio Product Image */}
      <Link
        to={`/products/${product.id}`}
        className="block relative aspect-square bg-[#E8F4F1] dark:bg-[#172B31] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#267C78]"
      >
        <MedicalImage
          src={product.image_url}
          alt={product.name}
          containerClassName="w-full h-full"
          className="transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        {/* Clean unboxed metadata (Zero-Pill discipline) */}
        <div className="flex items-center gap-2 text-xs font-medium text-[#267C78] dark:text-[#63C2BC]">
          <span>{product.brand?.name ?? t.product.defaultBrand}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-[#2E4D57]">
            ·
          </span>
          <span className="text-[#25343A]/70 dark:text-[#9AB2B8]">
            {product.category?.name ?? t.product.defaultCategory}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] leading-snug line-clamp-2">
          <Link
            to={`/products/${product.id}`}
            className="hover:text-[#267C78] dark:hover:text-[#63C2BC] transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        {/* Short Description */}
        {product.description && (
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Dynamic Pricing Tiers Selector */}
        <div className="mt-1 pt-3 border-t border-slate-100 dark:border-[#1D353C]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#25343A]/80 dark:text-[#9AB2B8]">
              {t.product.chooseOffer}
            </span>
            <span className="text-xs text-[#25343A]/60 dark:text-[#9AB2B8]/80 font-mono-num">
              {tiers.length === 1 ? t.product.oneOffer : t.product.offersCount(tiers.length)}
            </span>
          </div>

          {tiers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {tiers.map((tier) => {
                const isSelected = selectedTier?.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      'w-full px-3 py-2.5 rounded-lg border text-start flex items-center justify-between gap-2 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]',
                      isSelected
                        ? 'border-[#267C78] bg-[#E8F4F1]/75 dark:bg-[#172B31] text-[#123B45] dark:text-[#ECF3F4]'
                        : 'border-slate-200 dark:border-[#213B43] bg-[#F5F7F8]/60 dark:bg-[#0D1A1E] text-[#25343A] dark:text-[#9AB2B8] hover:border-[#267C78]/50'
                    )}
                  >
                    <span className="flex items-center gap-2 text-sm font-medium min-w-0">
                      <span
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center shrink-0',
                          isSelected
                            ? 'border-[#267C78] bg-[#267C78] text-white'
                            : 'border-slate-300 dark:border-[#2E4D57]'
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="truncate">
                        {formatBundleLabel(tier.units_per_bundle, language)}
                      </span>
                    </span>

                    <span className="font-mono-num text-sm font-bold text-[#123B45] dark:text-[#ECF3F4] whitespace-nowrap shrink-0">
                      {formatKWD(tier.bundle_price, language)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-amber-700 dark:text-amber-400 py-2">
              {t.product.noTiers}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-3 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!selectedTier}
            className="flex-1 h-11 px-4 rounded-lg bg-[#267C78] hover:bg-[#1F6966] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{t.product.addToCart}</span>
          </button>

          <Link
            to={`/products/${product.id}`}
            className="h-11 px-3.5 rounded-lg border border-slate-200 dark:border-[#213B43] hover:border-[#123B45] dark:hover:border-[#63C2BC] text-[#123B45] dark:text-[#ECF3F4] text-sm font-medium flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#267C78]"
          >
            <span>{t.product.details}</span>
            {isRTL ? (
              <ArrowLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            )}
          </Link>
        </div>
      </div>
    </article>
  );
}
