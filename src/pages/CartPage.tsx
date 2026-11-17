import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog';
import {
  formatBundleLabel,
  formatKWD,
  formatKWDFromFils,
  multiplyBundlePriceFils,
} from '@/src/utils/currency';

export function CartPage() {
  const {
    items,
    totalBundleItems,
    totalActualPacks,
    subtotalFils,
    discountFils,
    grandTotalFils,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    updateBundleQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { language, isRTL, t } = useLanguage();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  const handleQuantityChange = (lineKey: string, nextQty: number) => {
    if (!Number.isInteger(nextQty) || nextQty < 1) {
      toast.error(t.cart.invalidQtyToast);
      return;
    }
    updateBundleQuantity(lineKey, nextQty);
  };

  const handleRemoveItem = (lineKey: string) => {
    removeItem(lineKey);
    toast.success(t.cart.removedToast);
  };

  const handleConfirmClear = () => {
    clearCart();
    setConfirmClearOpen(false);
    toast.success(t.cart.clearedToast);
  };

  const handleApplyPromo = (e: FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromoCode(promoInput);
    if (res.success) {
      toast.success(
        t.cart.promoAppliedToast(promoInput.trim().toUpperCase(), res.discountPercent ?? 50)
      );
      setPromoInput('');
    } else if (res.reason === 'already_applied') {
      toast.info(t.cart.promoAlreadyAppliedToast);
    } else {
      toast.error(t.cart.promoInvalidToast);
    }
  };

  const handleRemovePromo = () => {
    removePromoCode();
    toast.info(t.cart.promoRemovedToast);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.cart.pageTitle}
          </h1>
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1">
            {t.cart.pageSubtitle}
          </p>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#25343A]/70 dark:text-[#9AB2B8] font-mono-num">
              {t.cart.itemsLinesCount(items.length)}
            </span>
            <button
              type="button"
              onClick={() => setConfirmClearOpen(true)}
              className="h-10 px-3.5 rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>{t.cart.clearCart}</span>
            </button>
          </div>
        )}
      </div>

      {/* Empty Cart State */}
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-10 sm:p-14 text-center max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-8 h-8 stroke-[1.75]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-2 leading-relaxed">
            {t.cart.emptyDesc}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="h-11 px-6 rounded-lg bg-[#267C78] hover:bg-[#1F6966] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <BackArrow className="w-4 h-4" aria-hidden="true" />
              <span>{t.cart.continueShopping}</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Cart Lines + Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <p className="text-xs sm:text-sm text-[#267C78] dark:text-[#63C2BC] font-medium">
              {t.cart.independentNote}
            </p>

            {items.map((item) => {
              const lineTotalFils = multiplyBundlePriceFils(
                item.bundlePrice,
                item.bundleQuantity
              );
              const actualPacks = item.unitsPerBundle * item.bundleQuantity;
              const bundleLabel = formatBundleLabel(item.unitsPerBundle, language);

              return (
                <article
                  key={item.lineKey}
                  className="rounded-xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5"
                >
                  {/* Product Thumbnail */}
                  <Link
                    to={`/products/${item.productId}`}
                    className="w-full sm:w-28 h-44 sm:h-28 rounded-xl overflow-hidden border border-slate-100 dark:border-[#1D353C] shrink-0 block"
                  >
                    <MedicalImage
                      src={item.productImage}
                      alt={item.productName}
                      containerClassName="w-full h-full"
                    />
                  </Link>

                  {/* Line Details */}
                  <div className="flex-1 min-w-0 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-xs text-[#267C78] dark:text-[#63C2BC] font-medium mb-1">
                          <span>{item.brandName || t.product.defaultBrand}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#25343A]/70 dark:text-[#9AB2B8]">
                            {item.categoryName || t.product.defaultCategory}
                          </span>
                        </div>

                        <h2 className="font-display text-base sm:text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] leading-snug">
                          <Link
                            to={`/products/${item.productId}`}
                            className="hover:text-[#267C78] dark:hover:text-[#63C2BC] transition-colors"
                          >
                            {item.productName}
                          </Link>
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.lineKey)}
                        aria-label={`${t.cart.removeItem}: ${item.productName}`}
                        className="h-9 px-2.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 inline-flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                        <span>{t.cart.removeItem}</span>
                      </button>
                    </div>

                    {/* Bundle Specs Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-[#1D353C] text-xs">
                      <div>
                        <span className="text-[#25343A]/65 dark:text-[#9AB2B8] block">
                          {t.cart.selectedOffer}
                        </span>
                        <span className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                          {bundleLabel}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#25343A]/65 dark:text-[#9AB2B8] block">
                          {t.cart.unitsPerBundle}
                        </span>
                        <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                          {item.unitsPerBundle}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#25343A]/65 dark:text-[#9AB2B8] block">
                          {t.cart.pricePerBundle}
                        </span>
                        <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                          {formatKWD(item.bundlePrice, language)}
                        </span>
                      </div>

                      <div>
                        <span className="text-[#25343A]/65 dark:text-[#9AB2B8] block">
                          {t.cart.actualPacksCount}
                        </span>
                        <span className="font-mono-num font-bold text-[#267C78] dark:text-[#63C2BC]">
                          {actualPacks} {t.product.packWord(actualPacks)}
                        </span>
                      </div>
                    </div>

                    {/* Stepper + Line Total */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-medium text-[#25343A]/75 dark:text-[#9AB2B8]">
                          {t.cart.bundlesCount}:
                        </span>
                        <div className="inline-flex items-center rounded-lg border border-slate-200 dark:border-[#213B43] bg-[#F5F7F8] dark:bg-[#0B1518] p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.lineKey, item.bundleQuantity - 1)
                            }
                            disabled={item.bundleQuantity <= 1}
                            aria-label={t.cart.decreaseQtyAria}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-white dark:hover:bg-[#172B31] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            min={1}
                            step={1}
                            value={item.bundleQuantity}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (Number.isInteger(val) && val >= 1) {
                                handleQuantityChange(item.lineKey, val);
                              }
                            }}
                            aria-label={t.cart.qtyInputAria}
                            className="w-12 h-8 text-center bg-transparent font-mono-num text-sm font-bold text-[#123B45] dark:text-[#ECF3F4] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item.lineKey, item.bundleQuantity + 1)
                            }
                            aria-label={t.cart.increaseQtyAria}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-[#123B45] dark:text-[#ECF3F4] hover:bg-white dark:hover:bg-[#172B31] transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="text-xs text-[#25343A]/65 dark:text-[#9AB2B8] block">
                          {t.cart.lineTotal}
                        </span>
                        <span className="font-mono-num text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
                          {formatKWDFromFils(lineTotalFils, language)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Order Summary Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 flex flex-col gap-5">
            <h2 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] pb-3 border-b border-slate-100 dark:border-[#1D353C]">
              {t.cart.summaryTitle}
            </h2>

            {/* Promo Code Section */}
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#2A4B55] p-3.5 bg-[#FAFBFB] dark:bg-[#0E1A1E]">
              <label
                htmlFor="promo-input"
                className="block text-xs font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-2"
              >
                <span className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#267C78] dark:text-[#63C2BC]" aria-hidden="true" />
                  <span>{t.cart.promoCodeLabel}</span>
                </span>
              </label>

              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#E8F4F1] dark:bg-[#172B31] border border-[#267C78]/30">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-[#267C78] dark:text-[#63C2BC] shrink-0" />
                    <div className="truncate">
                      <span className="font-mono font-bold text-xs text-[#123B45] dark:text-[#ECF3F4] tracking-wider">
                        {appliedPromo.code}
                      </span>
                      <span className="text-[11px] text-[#267C78] dark:text-[#63C2BC] font-bold ms-2">
                        (-{appliedPromo.discountPercent}%)
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="p-1 rounded-md text-red-500 hover:text-red-700 dark:text-red-400 hover:bg-white/70 dark:hover:bg-[#0B1518]/70 transition-colors cursor-pointer shrink-0"
                    title={t.cart.removePromoBtn}
                    aria-label={t.cart.removePromoBtn}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    id="promo-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder={t.cart.promoCodePlaceholder}
                    className="flex-1 min-w-0 h-9 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#0B1518] text-xs uppercase font-medium text-[#123B45] dark:text-[#ECF3F4] placeholder:normal-case placeholder:text-slate-400 focus:outline-none focus:border-[#267C78] focus:ring-1 focus:ring-[#267C78]"
                  />
                  <button
                    type="submit"
                    disabled={!promoInput.trim()}
                    className="h-9 px-3.5 rounded-lg bg-[#123B45] dark:bg-[#267C78] hover:opacity-95 disabled:opacity-40 text-white text-xs font-semibold shrink-0 transition-opacity cursor-pointer"
                  >
                    {t.cart.applyPromoBtn}
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#25343A]/75 dark:text-[#9AB2B8]">
                  {t.cart.totalBundles}
                </span>
                <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                  {totalBundleItems}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#25343A]/75 dark:text-[#9AB2B8]">
                  {t.cart.totalPacks}
                </span>
                <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                  {totalActualPacks} {t.product.packWord(totalActualPacks)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#25343A]/75 dark:text-[#9AB2B8]">
                  {t.cart.subtotal}
                </span>
                <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                  {formatKWDFromFils(subtotalFils, language)}
                </span>
              </div>

              {appliedPromo && discountFils > 0 && (
                <div className="flex items-center justify-between text-[#267C78] dark:text-[#63C2BC]">
                  <span className="font-medium text-xs sm:text-sm">
                    {t.cart.discountLabel(appliedPromo.discountPercent)}
                  </span>
                  <span className="font-mono-num font-bold">
                    -{formatKWDFromFils(discountFils, language)}
                  </span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#1D353C] flex items-center justify-between">
              <div>
                <span className="font-display text-base font-bold text-[#123B45] dark:text-[#ECF3F4] block">
                  {t.cart.grandTotal}
                </span>
                {appliedPromo && (
                  <span className="text-[11px] text-[#267C78] dark:text-[#63C2BC] font-semibold">
                    ({appliedPromo.code}: -{appliedPromo.discountPercent}%)
                  </span>
                )}
              </div>
              <div className="text-end">
                {appliedPromo && discountFils > 0 && (
                  <span className="block text-xs line-through text-slate-400 font-mono-num">
                    {formatKWDFromFils(subtotalFils, language)}
                  </span>
                )}
                <span className="font-mono-num text-2xl font-bold text-[#267C78] dark:text-[#63C2BC]">
                  {formatKWDFromFils(grandTotalFils, language)}
                </span>
              </div>
            </div>

            <Link
              to="/"
              className="mt-1 w-full h-11 px-4 rounded-xl border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-[#123B45] dark:text-[#ECF3F4] text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <BackArrow className="w-4 h-4" aria-hidden="true" />
              <span>{t.cart.continueShopping}</span>
            </Link>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        title={t.cart.confirmClearTitle}
        description={t.cart.confirmClearDesc}
        confirmLabel={t.cart.confirmClearBtn}
        cancelLabel={t.cart.cancelBtn}
        onConfirm={handleConfirmClear}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
