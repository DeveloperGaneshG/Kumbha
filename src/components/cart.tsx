"use client";

/**
 * Minimal cart kept in localStorage. Lines are grouped by selling mode at
 * checkout, because a pre-booked idol and a shipped matka are separate orders
 * (different payment split, date and fulfilment).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SellingMode } from "@/lib/selling-modes";
import type { PriceTier } from "@/lib/pricing";
import type { CategoryRules } from "@/lib/category-template";

export type CartItem = {
  sku: string;
  productSlug: string;
  name: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  gstRate: number;
  mode: SellingMode;
  tiers: PriceTier[];
  rules: CategoryRules;
  scheduledFor?: string;
  customization?: Record<string, string>;
};

type Ctx = {
  items: CartItem[];
  add: (item: CartItem) => void;
  setQty: (sku: string, mode: SellingMode, qty: number) => void;
  remove: (sku: string, mode: SellingMode) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "kumbha-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      add: (item) => {
        const existing = items.find((i) => i.sku === item.sku && i.mode === item.mode);
        persist(
          existing
            ? items.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity, scheduledFor: item.scheduledFor ?? i.scheduledFor } : i))
            : [...items, item],
        );
      },
      setQty: (sku, mode, qty) =>
        persist(qty <= 0 ? items.filter((i) => !(i.sku === sku && i.mode === mode)) : items.map((i) => (i.sku === sku && i.mode === mode ? { ...i, quantity: qty } : i))),
      remove: (sku, mode) => persist(items.filter((i) => !(i.sku === sku && i.mode === mode))),
      clear: () => persist([]),
    }),
    [items, persist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
