import type { Language } from '@/src/i18n/translations';

/**
 * Precise KWD (Kuwaiti Dinar) financial arithmetic using integer fils (1 KWD = 1000 fils).
 * Prevents floating-point rounding drift across bundle multipliers and cart totals.
 */

export function toFils(kwdAmount: number | string): number {
  const num = typeof kwdAmount === 'string' ? parseFloat(kwdAmount) : kwdAmount;
  if (!Number.isFinite(num) || num < 0) return 0;
  return Math.round(num * 1000);
}

export function fromFils(fils: number): number {
  return fils / 1000;
}

export function multiplyBundlePriceFils(bundlePrice: number | string, bundleQuantity: number): number {
  const safeQty = Number.isInteger(bundleQuantity) && bundleQuantity > 0 ? bundleQuantity : 0;
  return toFils(bundlePrice) * safeQty;
}

function formatKWDNumeric(fils: number): string {
  const safeFils = Number.isFinite(fils) && fils >= 0 ? Math.round(fils) : 0;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
    useGrouping: false,
  }).format(safeFils / 1000);
}

export function formatKWD(kwdAmount: number | string, language: Language = 'ar'): string {
  const fils = toFils(kwdAmount);
  const formatted = formatKWDNumeric(fils);
  return language === 'en' ? `${formatted} KWD` : `${formatted} د.ك`;
}

export function formatKWDFromFils(fils: number, language: Language = 'ar'): string {
  const formatted = formatKWDNumeric(fils);
  return language === 'en' ? `${formatted} KWD` : `${formatted} د.ك`;
}

export function formatBundleLabel(unitsPerBundle: number, language: Language = 'ar'): string {
  if (language === 'en') {
    return unitsPerBundle === 1 ? '1 Pack' : `${unitsPerBundle} Packs`;
  }
  if (unitsPerBundle === 1) return 'عبوة واحدة';
  if (unitsPerBundle === 2) return 'عبوتان';
  if (unitsPerBundle >= 3 && unitsPerBundle <= 10) return `${unitsPerBundle} عبوات`;
  return `${unitsPerBundle} عبوة`;
}
