"use client";

/**
 * Cart kept in localStorage. Lines are grouped by selling mode at checkout,
 * because a pre-booked idol and a shipped matka are separate orders
 * (different payment split, date and fulfilment).
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { SellingMode } from "@/lib/selling-modes";
import type { PriceTier } from "@/lib/pricing";
import type { CategoryRules } from "@/lib/category-template";

export type CartItem = {
  sku: string;
  productSlug: string;
  name: string;
  image?: string;
  icon?: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
  gstRate: number;
  mode: SellingMode;
  tiers: PriceTier[];
  rules: CategoryRules;
  scheduledFor?: string;
  customization?: Record<string, string>;
  /** A combo sold at a set price (links to /combos) */
  isBundle?: boolean;
};

export type CartExtras = { giftWrap: boolean; giftMessage: string };

type Ctx = {
  items: CartItem[];
  extras: CartExtras;
  add: (item: CartItem | CartItem[]) => void;
  setQty: (sku: string, mode: SellingMode, qty: number) => void;
  remove: (sku: string, mode: SellingMode) => void;
  setExtras: (e: Partial<CartExtras>) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "kumbha-cart-v2";
const EMPTY_EXTRAS: CartExtras = { giftWrap: false, giftMessage: "" };

const same = (a: CartItem, b: { sku: string; mode: SellingMode }) => a.sku === b.sku && a.mode === b.mode;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [extras, setExtrasState] = useState<CartExtras>(EMPTY_EXTRAS);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { items: CartItem[]; extras: CartExtras };
        // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once on mount
        setItems(saved.items ?? []);
        setExtrasState({ ...EMPTY_EXTRAS, ...saved.extras });
      }
    } catch {
      /* storage unavailable — cart stays in memory */
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, extras }));
    } catch {
      /* ignore */
    }
  }, [items, extras]);

  const add = useCallback((incoming: CartItem | CartItem[]) => {
    const list = Array.isArray(incoming) ? incoming : [incoming];
    setItems((cur) => {
      let next = cur;
      for (const item of list) {
        const existing = next.find((i) => same(i, item));
        next = existing
          ? next.map((i) => (i === existing ? { ...i, quantity: i.quantity + item.quantity, scheduledFor: item.scheduledFor ?? i.scheduledFor } : i))
          : [...next, item];
      }
      return next;
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      items,
      extras,
      count: items.reduce((n, i) => n + i.quantity, 0),
      add,
      setQty: (sku, mode, qty) =>
        setItems((cur) => (qty <= 0 ? cur.filter((i) => !same(i, { sku, mode })) : cur.map((i) => (same(i, { sku, mode }) ? { ...i, quantity: qty } : i)))),
      remove: (sku, mode) => setItems((cur) => cur.filter((i) => !same(i, { sku, mode }))),
      setExtras: (e) => setExtrasState((cur) => ({ ...cur, ...e })),
      clear: () => {
        setItems([]);
        setExtrasState(EMPTY_EXTRAS);
      },
    }),
    [items, extras, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
