import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Banknote,
  CheckCircle2,
  CreditCard,
  Home,
  Loader2,
  Lock,
  Package,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/src/context/CartContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { MedicalImage } from '@/src/components/ui/MedicalImage';
import {
  formatBundleLabel,
  formatKWDFromFils,
  multiplyBundlePriceFils,
} from '@/src/utils/currency';
import type { CartItem } from '@/src/types/database';
import { cn } from '@/src/utils/cn';

interface ConfirmedOrder {
  orderRef: string;
  orderDate: string;
  customer: {
    fullName: string;
    phone: string;
    address: string;
  };
  paymentMethod: 'cash' | 'visa';
  items: CartItem[];
  totalBundleItems: number;
  totalActualPacks: number;
  subtotalFils: number;
  discountFils: number;
  grandTotalFils: number;
  promoCode?: string;
}

export function CheckoutPage() {
  const {
    items,
    totalBundleItems,
    totalActualPacks,
    subtotalFils,
    discountFils,
    grandTotalFils,
    appliedPromo,
    clearCart,
  } = useCart();
  const { language, isRTL, t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'visa'>('cash');

  // Dummy test values for Visa simulation (never collected or stored)
  const [cardholder, setCardholder] = useState('Dr. Jane Doe');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  const [formErrors, setFormErrors] = useState<{
    fullName?: string;
    phone?: string;
    address?: string;
    cardholder?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
  }>({});

  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;
  const ForwardArrow = isRTL ? ArrowLeft : ArrowRight;

  const validateForm = (): boolean => {
    const errors: typeof formErrors = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = t.checkout.valFullName;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      errors.phone = t.checkout.valPhone;
    }

    if (!address.trim() || address.trim().length < 5) {
      errors.address = t.checkout.valAddress;
    }

    if (paymentMethod === 'visa') {
      if (!cardholder.trim()) {
        errors.cardholder = t.checkout.valCardholder;
      }
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 12) {
        errors.cardNumber = t.checkout.valCardNumber;
      }
      if (!cardExpiry.trim()) {
        errors.cardExpiry = t.checkout.valCardExpiry;
      }
      if (!cardCvv.trim() || cardCvv.length < 3) {
        errors.cardCvv = t.checkout.valCardCvv;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(isRTL ? 'يرجى تصحيح الأخطاء في النموذج' : 'Please check required form fields');
      return;
    }

    setSubmitting(true);

    // Simulate realistic frontend processing delay
    setTimeout(() => {
      const orderRef = `#NCG-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-KW' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const orderData: ConfirmedOrder = {
        orderRef,
        orderDate,
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        paymentMethod,
        items: [...items],
        totalBundleItems,
        totalActualPacks,
        subtotalFils,
        discountFils,
        grandTotalFils,
        promoCode: appliedPromo?.code,
      };

      setConfirmedOrder(orderData);
      clearCart();
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success(t.checkout.orderConfirmedTitle);
    }, 600);
  };

  // State A: Order Confirmation View
  if (confirmedOrder) {
    return (
      <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 sm:p-10 shadow-sm">
          {/* Header Badge & Title */}
          <div className="text-center pb-8 border-b border-slate-100 dark:border-[#1D353C]">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 stroke-[2.2]" aria-hidden="true" />
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.checkout.orderConfirmedTitle}
            </h1>
            <p className="text-sm text-[#25343A]/80 dark:text-[#9AB2B8] mt-2 max-w-lg mx-auto">
              {t.checkout.orderConfirmedSubtitle}
            </p>

            {/* Clear Simulation Notice */}
            <div className="mt-4 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs sm:text-sm text-amber-800 dark:text-amber-300 max-w-xl mx-auto flex items-start gap-2.5 text-start">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{t.checkout.demoNotice}</span>
            </div>
          </div>

          {/* Key Reference Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-100 dark:border-[#1D353C] text-xs sm:text-sm">
            <div>
              <span className="text-[#25343A]/60 dark:text-[#9AB2B8] block mb-1">
                {t.checkout.orderRef}
              </span>
              <span className="font-mono font-bold text-[#123B45] dark:text-[#ECF3F4]">
                {confirmedOrder.orderRef}
              </span>
            </div>

            <div>
              <span className="text-[#25343A]/60 dark:text-[#9AB2B8] block mb-1">
                {t.checkout.orderDate}
              </span>
              <span className="font-medium text-[#123B45] dark:text-[#ECF3F4]">
                {confirmedOrder.orderDate}
              </span>
            </div>

            <div>
              <span className="text-[#25343A]/60 dark:text-[#9AB2B8] block mb-1">
                {t.checkout.selectedPayment}
              </span>
              <span className="font-semibold text-[#267C78] dark:text-[#63C2BC]">
                {confirmedOrder.paymentMethod === 'cash'
                  ? t.checkout.paymentCash
                  : t.checkout.paymentVisa}
              </span>
            </div>

            <div>
              <span className="text-[#25343A]/60 dark:text-[#9AB2B8] block mb-1">
                {t.cart.grandTotal}
              </span>
              <span className="font-mono-num font-bold text-base text-[#123B45] dark:text-[#ECF3F4]">
                {formatKWDFromFils(confirmedOrder.grandTotalFils, language)}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info */}
          <div className="py-6 border-b border-slate-100 dark:border-[#1D353C] space-y-2 text-sm">
            <h2 className="font-display font-bold text-base text-[#123B45] dark:text-[#ECF3F4]">
              📍 {t.checkout.deliverTo}
            </h2>
            <div className="rounded-xl bg-[#F5F7F8] dark:bg-[#0B1518] p-4 text-xs sm:text-sm space-y-1 text-[#25343A] dark:text-[#ECF3F4]">
              <p className="font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                {confirmedOrder.customer.fullName} · {confirmedOrder.customer.phone}
              </p>
              <p className="text-[#25343A]/80 dark:text-[#9AB2B8]">
                {confirmedOrder.customer.address}
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="py-6 border-b border-slate-100 dark:border-[#1D353C]">
            <h2 className="font-display font-bold text-base text-[#123B45] dark:text-[#ECF3F4] mb-3">
              📦 {t.checkout.orderSummaryTitle}
            </h2>
            <div className="divide-y divide-slate-100 dark:divide-[#1D353C]">
              {confirmedOrder.items.map((item) => {
                const lineTotal = multiplyBundlePriceFils(item.bundlePrice, item.bundleQuantity);
                const actualPacks = item.unitsPerBundle * item.bundleQuantity;
                const bundleLabel = formatBundleLabel(item.unitsPerBundle, language);

                return (
                  <div
                    key={item.lineKey}
                    className="py-3 flex items-center justify-between gap-4 text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-[#213B43] bg-[#E8F4F1] dark:bg-[#172B31] shrink-0">
                        <MedicalImage
                          src={item.productImage}
                          alt={item.productName}
                          containerClassName="w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#123B45] dark:text-[#ECF3F4] truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8]">
                          {bundleLabel} × {item.bundleQuantity} ({actualPacks}{' '}
                          {t.product.packWord(actualPacks)})
                        </p>
                      </div>
                    </div>

                    <div className="font-mono-num font-bold text-end shrink-0 text-[#123B45] dark:text-[#ECF3F4]">
                      {formatKWDFromFils(lineTotal, language)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#1D353C] space-y-2 text-sm">
              <div className="flex justify-between text-[#25343A]/75 dark:text-[#9AB2B8]">
                <span>{t.cart.subtotal}</span>
                <span className="font-mono-num">
                  {formatKWDFromFils(confirmedOrder.subtotalFils, language)}
                </span>
              </div>
              {confirmedOrder.discountFils > 0 && (
                <div className="flex justify-between text-[#267C78] dark:text-[#63C2BC] font-medium">
                  <span>{t.checkout.orderSummaryTitle} ({confirmedOrder.promoCode})</span>
                  <span className="font-mono-num">
                    -{formatKWDFromFils(confirmedOrder.discountFils, language)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100 dark:border-[#1D353C] text-[#123B45] dark:text-[#ECF3F4]">
                <span>{t.cart.grandTotal}</span>
                <span className="font-mono-num text-xl text-[#267C78] dark:text-[#63C2BC]">
                  {formatKWDFromFils(confirmedOrder.grandTotalFils, language)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="w-full sm:w-auto h-12 px-8 rounded-xl bg-[#267C78] hover:bg-[#1F6966] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>{t.checkout.backToHome}</span>
            </Link>

            <Link
              to="/products"
              className="w-full sm:w-auto h-12 px-6 rounded-xl border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-[#123B45] dark:text-[#ECF3F4] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="w-4 h-4" aria-hidden="true" />
              <span>{t.checkout.browseMoreProducts}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State B: Empty Cart State (when visiting /checkout directly with 0 items)
  if (items.length === 0) {
    return (
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-8 sm:p-12 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F4F1] dark:bg-[#172B31] text-[#267C78] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
            {t.checkout.cartEmptyTitle}
          </h1>
          <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-2 leading-relaxed max-w-md mx-auto">
            {t.checkout.cartEmptyDesc}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/products"
              className="h-11 px-6 rounded-xl bg-[#267C78] hover:bg-[#1F6966] text-white text-sm font-bold inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <BackArrow className="w-4 h-4" />
              <span>{t.checkout.startShopping}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State C: Active Checkout Form + Order Review Split
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-[#25343A]/70 dark:text-[#9AB2B8]">
        <Link
          to="/"
          className="hover:text-[#267C78] dark:hover:text-[#ECF3F4] transition-colors"
        >
          {t.products.breadcrumbHome}
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to="/cart"
          className="hover:text-[#267C78] dark:hover:text-[#ECF3F4] transition-colors"
        >
          {t.nav.cart}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-[#123B45] dark:text-[#ECF3F4] font-medium">
          {t.checkout.pageTitle}
        </span>
      </nav>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#123B45] dark:text-[#ECF3F4]">
          {t.checkout.pageTitle}
        </h1>
        <p className="text-sm text-[#25343A]/75 dark:text-[#9AB2B8] mt-1">
          {t.checkout.pageSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Customer & Delivery Information */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4] pb-3 border-b border-slate-100 dark:border-[#1D353C]">
              👤 {t.checkout.customerInfoTitle}
            </h2>

            <div>
              <label
                htmlFor="checkout-name"
                className="block text-xs font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1.5"
              >
                {t.checkout.fullNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (formErrors.fullName) setFormErrors((prev) => ({ ...prev, fullName: undefined }));
                }}
                placeholder={t.checkout.fullNamePlaceholder}
                className={cn(
                  'w-full h-11 px-3.5 rounded-lg border text-sm text-[#25343A] dark:text-[#ECF3F4] bg-[#F5F7F8] dark:bg-[#0B1518] focus:outline-none focus:ring-1',
                  formErrors.fullName
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-[#213B43] focus:border-[#267C78] focus:ring-[#267C78]'
                )}
              />
              {formErrors.fullName && (
                <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-phone"
                className="block text-xs font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1.5"
              >
                {t.checkout.phoneLabel} <span className="text-red-500">*</span>
              </label>
              <input
                id="checkout-phone"
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                placeholder={t.checkout.phonePlaceholder}
                className={cn(
                  'w-full h-11 px-3.5 rounded-lg border text-sm text-[#25343A] dark:text-[#ECF3F4] bg-[#F5F7F8] dark:bg-[#0B1518] focus:outline-none focus:ring-1',
                  formErrors.phone
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-[#213B43] focus:border-[#267C78] focus:ring-[#267C78]'
                )}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="checkout-address"
                className="block text-xs font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1.5"
              >
                {t.checkout.addressLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="checkout-address"
                rows={3}
                required
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: undefined }));
                }}
                placeholder={t.checkout.addressPlaceholder}
                className={cn(
                  'w-full p-3.5 rounded-lg border text-sm text-[#25343A] dark:text-[#ECF3F4] bg-[#F5F7F8] dark:bg-[#0B1518] focus:outline-none focus:ring-1 resize-none',
                  formErrors.address
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-200 dark:border-[#213B43] focus:border-[#267C78] focus:ring-[#267C78]'
                )}
              />
              {formErrors.address && (
                <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>
              )}
            </div>
          </div>

          {/* Card 2: Payment Method */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h2 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
                💳 {t.checkout.paymentMethodTitle}
              </h2>
              <p className="text-xs text-[#25343A]/75 dark:text-[#9AB2B8] mt-0.5">
                {t.checkout.paymentMethodSubtitle}
              </p>
            </div>

            {/* Payment Method Selector Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#1D353C]">
              {/* Option A: Cash on Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={cn(
                  'p-4 rounded-xl border text-start flex flex-col gap-2 transition-all cursor-pointer',
                  paymentMethod === 'cash'
                    ? 'border-[#267C78] bg-[#E8F4F1]/60 dark:bg-[#172B31] ring-1 ring-[#267C78]'
                    : 'border-slate-200 dark:border-[#213B43] bg-[#F5F7F8]/50 dark:bg-[#0B1518] hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <span
                    className={cn(
                      'w-4 h-4 rounded-full border flex items-center justify-center',
                      paymentMethod === 'cash'
                        ? 'border-[#267C78] bg-[#267C78]'
                        : 'border-slate-300 dark:border-[#2E4D57]'
                    )}
                  >
                    {paymentMethod === 'cash' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#123B45] dark:text-[#ECF3F4] block">
                    {t.checkout.paymentCash}
                  </span>
                  <span className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8] mt-0.5 block leading-relaxed">
                    {t.checkout.paymentCashDesc}
                  </span>
                </div>
              </button>

              {/* Option B: Visa Demo */}
              <button
                type="button"
                onClick={() => setPaymentMethod('visa')}
                className={cn(
                  'p-4 rounded-xl border text-start flex flex-col gap-2 transition-all cursor-pointer',
                  paymentMethod === 'visa'
                    ? 'border-[#267C78] bg-[#E8F4F1]/60 dark:bg-[#172B31] ring-1 ring-[#267C78]'
                    : 'border-slate-200 dark:border-[#213B43] bg-[#F5F7F8]/50 dark:bg-[#0B1518] hover:border-slate-300'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300">
                      {t.checkout.visaDemoBadge}
                    </span>
                    <span
                      className={cn(
                        'w-4 h-4 rounded-full border flex items-center justify-center',
                        paymentMethod === 'visa'
                          ? 'border-[#267C78] bg-[#267C78]'
                          : 'border-slate-300 dark:border-[#2E4D57]'
                      )}
                    >
                      {paymentMethod === 'visa' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="font-bold text-sm text-[#123B45] dark:text-[#ECF3F4] block">
                    {t.checkout.paymentVisa}
                  </span>
                  <span className="text-xs text-[#25343A]/70 dark:text-[#9AB2B8] mt-0.5 block leading-relaxed">
                    {t.checkout.paymentVisaDesc}
                  </span>
                </div>
              </button>
            </div>

            {/* Visa Simulated Card Form (when Visa is chosen) */}
            {paymentMethod === 'visa' && (
              <div className="mt-2 p-4 rounded-xl bg-[#FAFBFB] dark:bg-[#0E1A1E] border border-dashed border-amber-300 dark:border-amber-800/60 flex flex-col gap-3.5">
                <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{t.checkout.visaNotice}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="cardholder"
                      className="block text-[11px] font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1"
                    >
                      {t.checkout.cardholderLabel}
                    </label>
                    <input
                      id="cardholder"
                      type="text"
                      value={cardholder}
                      onChange={(e) => setCardholder(e.target.value)}
                      placeholder={t.checkout.cardholderPlaceholder}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#0B1518] text-xs font-medium text-[#123B45] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="card-number"
                      className="block text-[11px] font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1"
                    >
                      {t.checkout.cardNumberLabel}
                    </label>
                    <input
                      id="card-number"
                      type="text"
                      dir="ltr"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder={t.checkout.cardNumberPlaceholder}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#0B1518] text-xs font-mono text-[#123B45] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="card-expiry"
                      className="block text-[11px] font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1"
                    >
                      {t.checkout.cardExpiryLabel}
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      dir="ltr"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder={t.checkout.cardExpiryPlaceholder}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#0B1518] text-xs font-mono text-[#123B45] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="card-cvv"
                      className="block text-[11px] font-semibold text-[#123B45] dark:text-[#ECF3F4] mb-1"
                    >
                      {t.checkout.cardCvvLabel}
                    </label>
                    <input
                      id="card-cvv"
                      type="password"
                      dir="ltr"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder={t.checkout.cardCvvPlaceholder}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#213B43] bg-white dark:bg-[#0B1518] text-xs font-mono text-[#123B45] dark:text-[#ECF3F4] focus:outline-none focus:border-[#267C78]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Confirmation Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#267C78] hover:bg-[#1F6966] disabled:opacity-50 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.checkout.processing}</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {paymentMethod === 'cash'
                    ? t.checkout.confirmOrderCash
                    : t.checkout.confirmOrderVisa}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Order Summary Column */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 rounded-2xl border border-slate-200/80 dark:border-[#213B43] bg-white dark:bg-[#112126] p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#1D353C]">
            <h2 className="font-display text-lg font-bold text-[#123B45] dark:text-[#ECF3F4]">
              {t.checkout.orderSummaryTitle}
            </h2>
            <span className="text-xs text-[#267C78] dark:text-[#63C2BC] font-semibold font-mono-num">
              {t.checkout.itemsCount(items.length)}
            </span>
          </div>

          {/* Items Thumbnail List */}
          <div className="divide-y divide-slate-100 dark:divide-[#1D353C] max-h-64 overflow-y-auto pe-1">
            {items.map((item) => {
              const lineTotal = multiplyBundlePriceFils(item.bundlePrice, item.bundleQuantity);
              const actualPacks = item.unitsPerBundle * item.bundleQuantity;
              const bundleLabel = formatBundleLabel(item.unitsPerBundle, language);

              return (
                <div
                  key={item.lineKey}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-100 dark:border-[#1D353C] bg-[#E8F4F1] dark:bg-[#172B31] shrink-0">
                      <MedicalImage
                        src={item.productImage}
                        alt={item.productName}
                        containerClassName="w-full h-full"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#123B45] dark:text-[#ECF3F4] truncate">
                        {item.productName}
                      </p>
                      <p className="text-[#25343A]/70 dark:text-[#9AB2B8]">
                        {bundleLabel} × {item.bundleQuantity} ({actualPacks}{' '}
                        {t.product.packWord(actualPacks)})
                      </p>
                    </div>
                  </div>

                  <span className="font-mono-num font-bold text-[#123B45] dark:text-[#ECF3F4] shrink-0">
                    {formatKWDFromFils(lineTotal, language)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Financial Breakdown */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#1D353C] space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[#25343A]/75 dark:text-[#9AB2B8] text-xs sm:text-sm">
                {t.cart.totalBundles}
              </span>
              <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                {totalBundleItems}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#25343A]/75 dark:text-[#9AB2B8] text-xs sm:text-sm">
                {t.cart.totalPacks}
              </span>
              <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                {totalActualPacks} {t.product.packWord(totalActualPacks)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#25343A]/75 dark:text-[#9AB2B8] text-xs sm:text-sm">
                {t.cart.subtotal}
              </span>
              <span className="font-mono-num font-semibold text-[#123B45] dark:text-[#ECF3F4]">
                {formatKWDFromFils(subtotalFils, language)}
              </span>
            </div>

            {appliedPromo && discountFils > 0 && (
              <div className="flex items-center justify-between text-[#267C78] dark:text-[#63C2BC]">
                <span className="text-xs sm:text-sm font-medium">
                  {t.cart.discountLabel(appliedPromo.discountPercent)}
                </span>
                <span className="font-mono-num font-bold">
                  -{formatKWDFromFils(discountFils, language)}
                </span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#1D353C] flex items-center justify-between">
            <div>
              <span className="font-display text-base font-bold text-[#123B45] dark:text-[#ECF3F4] block">
                {t.cart.grandTotal}
              </span>
              {appliedPromo && (
                <span className="text-[11px] text-[#267C78] dark:text-[#63C2BC] font-medium">
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
            to="/cart"
            className="mt-1 w-full h-10 px-4 rounded-xl border border-slate-200 dark:border-[#213B43] hover:border-[#267C78] text-[#123B45] dark:text-[#ECF3F4] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <BackArrow className="w-3.5 h-3.5" />
            <span>{isRTL ? 'العودة لتعديل السلة' : 'Back to Cart'}</span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
