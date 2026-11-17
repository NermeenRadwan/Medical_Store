import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, PricingTier, ProductWithDetails } from '@/src/types/database';
import { multiplyBundlePriceFils } from '@/src/utils/currency';

export interface AppliedPromoCode {
  code: string;
  discountPercent: number;
}

export const VALID_PROMO_CODES: Record<string, number> = {
  PROMO50: 50,
};

interface CartContextValue {
  items: CartItem[];
  totalBundleItems: number;
  totalActualPacks: number;
  subtotalFils: number;
  discountFils: number;
  grandTotalFils: number;
  appliedPromo: AppliedPromoCode | null;
  applyPromoCode: (
    code: string
  ) => { success: boolean; discountPercent?: number; reason?: 'invalid' | 'already_applied' };
  removePromoCode: () => void;
  addToCart: (product: ProductWithDetails, tier: PricingTier, bundleQuantity?: number) => boolean;
  updateBundleQuantity: (lineKey: string, nextQuantity: number) => boolean;
  removeItem: (lineKey: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = 'ncg-medical-cart-v1';
const PROMO_STORAGE_KEY = 'ncg-medical-promo-v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(
        (item) =>
          item &&
          typeof item.lineKey === 'string' &&
          typeof item.productId === 'string' &&
          typeof item.pricingTierId === 'string' &&
          Number.isInteger(item.bundleQuantity) &&
          item.bundleQuantity > 0 &&
          Number.isInteger(item.unitsPerBundle) &&
          item.unitsPerBundle > 0 &&
          typeof item.bundlePrice === 'number' &&
          item.bundlePrice > 0
      );
    } catch {
      return [];
    }
  });

  const [appliedPromo, setAppliedPromo] = useState<AppliedPromoCode | null>(() => {
    try {
      const raw = localStorage.getItem(PROMO_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.code === 'string' &&
        typeof parsed.discountPercent === 'number' &&
        VALID_PROMO_CODES[parsed.code.toUpperCase()] === parsed.discountPercent
      ) {
        return {
          code: parsed.code.toUpperCase(),
          discountPercent: parsed.discountPercent,
        };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  useEffect(() => {
    try {
      if (appliedPromo) {
        localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem(PROMO_STORAGE_KEY);
      }
    } catch {
      // Ignore storage quota errors
    }
  }, [appliedPromo]);

  const addToCart = (
    product: ProductWithDetails,
    tier: PricingTier,
    bundleQuantity = 1
  ): boolean => {
    if (!Number.isInteger(bundleQuantity) || bundleQuantity <= 0) {
      return false;
    }

    const lineKey = `${product.id}::${tier.id}`;

    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.lineKey === lineKey);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          bundleQuantity: updated[existingIndex].bundleQuantity + bundleQuantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          lineKey,
          productId: product.id,
          productName: product.name,
          productImage: product.image_url,
          brandName: product.brand?.name ?? '',
          categoryName: product.category?.name ?? '',
          pricingTierId: tier.id,
          unitsPerBundle: tier.units_per_bundle,
          bundlePrice: tier.bundle_price,
          bundleQuantity,
        },
      ];
    });

    return true;
  };

  const updateBundleQuantity = (lineKey: string, nextQuantity: number): boolean => {
    if (!Number.isInteger(nextQuantity) || nextQuantity <= 0) {
      return false;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.lineKey === lineKey ? { ...item, bundleQuantity: nextQuantity } : item
      )
    );
    return true;
  };

  const removeItem = (lineKey: string) => {
    setItems((prev) => prev.filter((item) => item.lineKey !== lineKey));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const applyPromoCode = (
    code: string
  ): { success: boolean; discountPercent?: number; reason?: 'invalid' | 'already_applied' } => {
    const normalized = code.trim().toUpperCase();
    if (!normalized || !(normalized in VALID_PROMO_CODES)) {
      return { success: false, reason: 'invalid' };
    }

    if (appliedPromo?.code === normalized) {
      return { success: false, reason: 'already_applied' };
    }

    const discountPercent = VALID_PROMO_CODES[normalized];
    const newPromo = { code: normalized, discountPercent };
    setAppliedPromo(newPromo);
    return { success: true, discountPercent };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  const totals = useMemo(() => {
    const rawTotals = items.reduce(
      (acc, item) => {
        acc.totalBundleItems += item.bundleQuantity;
        acc.totalActualPacks += item.unitsPerBundle * item.bundleQuantity;
        acc.subtotalFils += multiplyBundlePriceFils(item.bundlePrice, item.bundleQuantity);
        return acc;
      },
      { totalBundleItems: 0, totalActualPacks: 0, subtotalFils: 0 }
    );

    const discountPercent = appliedPromo?.discountPercent ?? 0;
    const discountFils =
      discountPercent > 0 && rawTotals.subtotalFils > 0
        ? Math.round((rawTotals.subtotalFils * discountPercent) / 100)
        : 0;

    const grandTotalFils = Math.max(0, rawTotals.subtotalFils - discountFils);

    return {
      totalBundleItems: rawTotals.totalBundleItems,
      totalActualPacks: rawTotals.totalActualPacks,
      subtotalFils: rawTotals.subtotalFils,
      discountFils,
      grandTotalFils,
    };
  }, [items, appliedPromo]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalBundleItems: totals.totalBundleItems,
        totalActualPacks: totals.totalActualPacks,
        subtotalFils: totals.subtotalFils,
        discountFils: totals.discountFils,
        grandTotalFils: totals.grandTotalFils,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        addToCart,
        updateBundleQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
