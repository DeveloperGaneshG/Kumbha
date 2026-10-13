"use client";

/**
 * The buy box. It renders differently per selling mode — this one component
 * serves every category, driven by the product's modes and its category rules.
 */
import { useState } from "react";
import Link from "next/link";
import { MODES, type SellingMode } from "@/lib/selling-modes";
import { computeTotals, unitPriceFor, type PriceTier } from "@/lib/pricing";
import type { CategoryRules } from "@/lib/category-template";
import { formatINR } from "@/lib/money";
import { useCart } from "./cart";
import { whatsappLink } from "./whatsapp";

type Props = {
  slug: string;
  name: string;
  unit: string;
  gstRate: number;
  modes: SellingMode[];
  rules: CategoryRules;
  tiers: PriceTier[];
  variants: { sku: string; name: string; price: number; stock: number; capacity: number | null }[];
};

const minDate = (leadDays = 2) => {
  const d = new Date();
  d.setDate(d.getDate() + leadDays);
  return d.toISOString().slice(0, 10);
};

export function ProductActions(p: Props) {
  const { add } = useCart();
  const [mode, setMode] = useState<SellingMode>(p.modes[0]);
  const [sku, setSku] = useState(p.variants[0]?.sku);
  const [qty, setQty] = useState(p.rules.minOrderQty ?? 1);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [added, setAdded] = useState(false);

  const variant = p.variants.find((v) => v.sku === sku) ?? p.variants[0];
  if (!variant || !mode) return null;
  const def = MODES[mode];
  const unit = unitPriceFor(variant.price, qty, p.tiers);
  const totals = computeTotals({ lines: [{ unitPrice: variant.price, quantity: qty, gstRate: p.gstRate, tiers: p.tiers }], mode, rules: p.rules });
  const isMadeToOrder = mode === "PRE_BOOK" || mode === "MADE_TO_ORDER";
  const outOfStock = !isMadeToOrder && def.usesCart && mode !== "PICKUP" && variant.stock <= 0;
  const needsDate = def.needsDate && def.usesCart;

  const addToCart = () => {
    add({
      sku: variant.sku,
      productSlug: p.slug,
      name: p.name,
      variantName: variant.name,
      unitPrice: variant.price,
      quantity: qty,
      gstRate: p.gstRate,
      mode,
      tiers: p.tiers,
      rules: p.rules,
      scheduledFor: date || undefined,
      customization: note ? { note } : undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-5 rounded-2xl border border-clay-200 bg-white p-5">
      {p.modes.length > 1 && (
        <div role="tablist" className="flex flex-wrap gap-2">
          {p.modes.map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={m === mode}
              onClick={() => setMode(m)}
              className={`rounded-full px-3 py-1.5 text-sm ${m === mode ? "bg-clay-600 text-white" : "bg-clay-100 text-clay-700"}`}
            >
              {MODES[m].label}
            </button>
          ))}
        </div>
      )}
      <p className="text-sm text-clay-700">{def.description}</p>

      {p.variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-semibold">Option</p>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <button
                key={v.sku}
                onClick={() => setSku(v.sku)}
                className={`rounded-lg border px-3 py-2 text-sm ${v.sku === variant.sku ? "border-clay-600 bg-clay-50 font-semibold" : "border-clay-200"}`}
              >
                {v.name}
                {mode !== "CATALOG_ONLY" && <span className="block text-xs text-clay-600">{formatINR(v.price)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {mode !== "CATALOG_ONLY" && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="qty">
            Quantity ({p.unit})
          </label>
          <input
            id="qty"
            type="number"
            min={p.rules.minOrderQty ?? 1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            className="w-24 rounded-lg border border-clay-200 px-3 py-1.5"
          />
        </div>
      )}

      {needsDate && (
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold" htmlFor="date">
            {mode === "PRE_BOOK" ? "Festival / pickup date" : mode === "PICKUP" ? "Pickup date" : "Delivery date"}
          </label>
          <input
            id="date"
            type="date"
            min={minDate(mode === "PRE_BOOK" ? p.rules.leadTimeDays ?? 7 : 1)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-clay-200 px-3 py-1.5"
          />
        </div>
      )}

      {mode === "MADE_TO_ORDER" && (
        <textarea
          placeholder="Customisation: name to paint, colour, size notes…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-lg border border-clay-200 px-3 py-2 text-sm"
          rows={2}
        />
      )}

      {def.usesCart && (
        <div className="rounded-xl bg-clay-50 p-4 text-sm">
          <div className="flex justify-between">
            <span>
              {formatINR(unit)} × {qty}
              {unit < variant.price && <span className="ml-2 text-leaf">bulk price</span>}
            </span>
            <span>{formatINR(totals.subtotal)}</span>
          </div>
          {totals.packagingFee > 0 && (
            <div className="flex justify-between text-clay-600">
              <span>Safe packaging (fragile)</span>
              <span>{formatINR(totals.packagingFee)}</span>
            </div>
          )}
          <div className="mt-2 flex justify-between border-t border-clay-200 pt-2 text-base font-semibold">
            <span>{totals.payLater > 0 ? "Pay now" : "Total"}</span>
            <span>{formatINR(totals.payNow || totals.total)}</span>
          </div>
          {totals.payLater > 0 && (
            <p className="text-clay-600">
              {totals.payNow > 0 ? `Balance ${formatINR(totals.payLater)} on ${mode === "PRE_BOOK" ? "pickup" : "delivery"}` : `Pay ${formatINR(totals.total)} at the store`}
            </p>
          )}
          <p className="mt-1 text-xs text-clay-500">Prices include {p.gstRate}% GST</p>
        </div>
      )}

      {p.tiers.length > 0 && mode !== "CATALOG_ONLY" && (
        <div className="text-sm">
          <p className="font-semibold">Bulk pricing</p>
          <ul className="text-clay-700">
            {p.tiers.map((t) => (
              <li key={t.minQty}>
                {t.minQty}+ {p.unit}: {formatINR(t.unitPrice)} each
              </li>
            ))}
          </ul>
        </div>
      )}

      {def.usesCart ? (
        <button
          onClick={addToCart}
          disabled={outOfStock || (needsDate && !date)}
          className="w-full rounded-full bg-clay-600 py-3 font-semibold text-white transition hover:bg-clay-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {added ? "✓ Added to cart" : outOfStock ? "Out of stock" : needsDate && !date ? "Pick a date to continue" : def.cta}
        </button>
      ) : mode === "QUOTE" ? (
        <Link href={`/quote?product=${p.slug}&qty=${qty}`} className="block w-full rounded-full bg-slate-build py-3 text-center font-semibold text-white">
          {def.cta}
        </Link>
      ) : (
        <a
          href={whatsappLink(`Hi, I'd like to know about "${p.name}" (${variant.name}). Is it available?`)}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-[#25d366] py-3 text-center font-semibold text-white"
        >
          {def.cta}
        </a>
      )}
      {isMadeToOrder && variant.capacity !== null && <p className="text-center text-xs text-clay-600">Limited to {variant.capacity} this season</p>}
    </div>
  );
}
