import { MODES, type SellingMode } from "./selling-modes";
import type { CategoryRules } from "./category-template";

export type PriceTier = { minQty: number; unitPrice: number };

/** Unit price after bulk tiers (highest tier the quantity qualifies for). */
export function unitPriceFor(basePrice: number, quantity: number, tiers: PriceTier[] = []): number {
  const applicable = tiers.filter((t) => quantity >= t.minQty).sort((a, b) => b.minQty - a.minQty);
  return applicable[0]?.unitPrice ?? basePrice;
}

/** Packaging fee for fragile goods: ₹40 per piece, capped at ₹600 per order. */
export function packagingFee(fragile: boolean, totalPieces: number): number {
  if (!fragile) return 0;
  return Math.min(totalPieces * 4000, 60000);
}

/**
 * GST on a GST-inclusive price (Indian retail prices are usually inclusive).
 * Returns the tax component contained in the amount.
 */
export function gstComponent(inclusiveAmount: number, gstRatePercent: number): number {
  return Math.round(inclusiveAmount - inclusiveAmount / (1 + gstRatePercent / 100));
}

export type CartLine = {
  unitPrice: number;
  quantity: number;
  gstRate: number;
  tiers?: PriceTier[];
};

export type Totals = {
  subtotal: number;
  packagingFee: number;
  deliveryFee: number;
  taxTotal: number;
  total: number;
  payNow: number;
  payLater: number;
};

export function computeTotals(opts: {
  lines: CartLine[];
  mode: SellingMode;
  rules?: CategoryRules;
  deliveryFee?: number;
  campaignDiscountPc?: number;
}): Totals {
  const { lines, mode, rules = {}, deliveryFee = 0, campaignDiscountPc = 0 } = opts;
  let subtotal = 0;
  let taxTotal = 0;
  let pieces = 0;
  for (const l of lines) {
    const unit = unitPriceFor(l.unitPrice, l.quantity, l.tiers);
    const discounted = Math.round(unit * (1 - campaignDiscountPc / 100));
    const lineTotal = discounted * l.quantity;
    subtotal += lineTotal;
    taxTotal += gstComponent(lineTotal, l.gstRate);
    pieces += l.quantity;
  }
  const pack = packagingFee(Boolean(rules.fragile), pieces);
  const total = subtotal + pack + deliveryFee;
  const advancePc = rules.advancePercent ?? MODES[mode].defaultAdvancePercent;
  const payNow = Math.round((total * advancePc) / 100);
  return { subtotal, packagingFee: pack, deliveryFee, taxTotal, total, payNow, payLater: total - payNow };
}
