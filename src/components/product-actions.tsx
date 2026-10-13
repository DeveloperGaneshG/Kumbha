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
import type { VariantView } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { useCart } from "./cart";
import { whatsappLink } from "./whatsapp";
import { Price, btn } from "./ui";
import { CheckIcon, ChatIcon } from "./icons";

type Props = {
  slug: string;
  name: string;
  image?: string;
  icon?: string;
  unit: string;
  gstRate: number;
  modes: SellingMode[];
  rules: CategoryRules;
  tiers: PriceTier[];
  variants: VariantView[];
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
  const tracksStock = def.usesCart && !isMadeToOrder && mode !== "PICKUP";
  const outOfStock = tracksStock && variant.stock <= 0;
  const lowStock = tracksStock && variant.stock > 0 && variant.stock <= 10;
  const needsDate = def.needsDate && def.usesCart;
  const catalogOnly = mode === "CATALOG_ONLY";

  const addToCart = () => {
    add({
      sku: variant.sku,
      productSlug: p.slug,
      name: p.name,
      image: p.image,
      icon: p.icon,
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
    setTimeout(() => setAdded(false), 2500);
  };

  const label = "mb-2 block text-sm font-semibold";

  return (
    <div className="space-y-6">
      {!catalogOnly && (
        <div>
          <Price price={unit} mrp={variant.mrp && unit === variant.price ? variant.mrp : null} size="lg" />
          <p className="mt-1 text-sm text-muted">
            {p.unit !== "piece" && `per ${p.unit} · `}Inclusive of {p.gstRate}% GST
            {unit < variant.price && <span className="ml-2 font-semibold text-success">Bulk price applied</span>}
          </p>
        </div>
      )}

      {p.modes.length > 1 && (
        <div>
          <span className={label}>How would you like it?</span>
          <div role="radiogroup" className="grid grid-cols-2 gap-2">
            {p.modes.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={m === mode}
                onClick={() => setMode(m)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${m === mode ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}
              >
                <span className="block font-semibold">{MODES[m].label}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted">{def.description}</p>
        </div>
      )}

      {p.variants.length > 1 && (
        <div>
          <span className={label}>
            Option: <span className="font-normal text-muted">{variant.name}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <button
                key={v.sku}
                type="button"
                onClick={() => setSku(v.sku)}
                aria-pressed={v.sku === variant.sku}
                className={`min-w-20 rounded-lg border px-3 py-2 text-sm transition-colors ${v.sku === variant.sku ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink"}`}
              >
                <span className="block font-semibold">{v.name}</span>
                {!catalogOnly && <span className="block text-xs text-muted">{formatINR(v.price)}</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {!catalogOnly && (
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className={label} htmlFor="qty">
              Quantity
            </label>
            <div className="flex items-center rounded-lg border border-line">
              <button type="button" onClick={() => setQty(Math.max(p.rules.minOrderQty ?? 1, qty - 1))} className="px-3.5 py-2 text-lg" aria-label="Decrease quantity">
                −
              </button>
              <input
                id="qty"
                type="number"
                min={p.rules.minOrderQty ?? 1}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                className="w-14 border-x border-line py-2 text-center font-semibold [appearance:textfield]"
              />
              <button type="button" onClick={() => setQty(qty + 1)} className="px-3.5 py-2 text-lg" aria-label="Increase quantity">
                +
              </button>
            </div>
          </div>
          {needsDate && (
            <div className="flex-1">
              <label className={label} htmlFor="date">
                {mode === "PRE_BOOK" ? "Pickup date" : mode === "PICKUP" ? "Pickup date" : "Delivery date"}
              </label>
              <input
                id="date"
                type="date"
                min={minDate(mode === "PRE_BOOK" ? p.rules.leadTimeDays ?? 7 : 1)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2"
              />
            </div>
          )}
        </div>
      )}

      {mode === "MADE_TO_ORDER" && (
        <div>
          <label className={label} htmlFor="note">
            Customisation
          </label>
          <textarea
            id="note"
            placeholder="Name to paint, colours, size notes…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full rounded-lg border border-line px-3 py-2"
            rows={2}
          />
        </div>
      )}

      {def.usesCart && (totals.packagingFee > 0 || totals.payLater > 0 || qty > 1) && (
        <dl className="space-y-1.5 rounded-xl bg-surface p-4 text-sm">
          <div className="flex justify-between">
            <dt>
              {formatINR(unit)} × {qty}
            </dt>
            <dd>{formatINR(totals.subtotal)}</dd>
          </div>
          {totals.packagingFee > 0 && (
            <div className="flex justify-between text-muted">
              <dt>Breakage-safe packing</dt>
              <dd>{formatINR(totals.packagingFee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
            <dt>{totals.payLater > 0 && totals.payNow > 0 ? "Pay now" : "Total"}</dt>
            <dd>{formatINR(totals.payNow || totals.total)}</dd>
          </div>
          {totals.payLater > 0 && (
            <p className="text-muted">
              {totals.payNow > 0 ? `Balance ${formatINR(totals.payLater)} at ${mode === "PRE_BOOK" ? "pickup" : "delivery"}` : `Pay ${formatINR(totals.total)} at the store`}
            </p>
          )}
        </dl>
      )}

      {(lowStock || outOfStock) && <p className={`text-sm font-semibold ${outOfStock ? "text-sale" : "text-accent"}`}>{outOfStock ? "Out of stock" : `Only ${variant.stock} left`}</p>}
      {isMadeToOrder && variant.capacity !== null && <p className="text-sm text-muted">Limited to {variant.capacity} this season — book early.</p>}

      {def.usesCart ? (
        <div className="space-y-2">
          <button type="button" onClick={addToCart} disabled={outOfStock || (needsDate && !date)} className={`${btn.primary} w-full py-3.5 text-base`}>
            {added ? (
              <>
                <CheckIcon size={20} /> Added to cart
              </>
            ) : outOfStock ? (
              "Out of stock"
            ) : needsDate && !date ? (
              "Choose a date to continue"
            ) : (
              def.cta
            )}
          </button>
          {added && (
            <Link href="/cart" className="block text-center text-sm font-semibold text-brand hover:underline">
              View cart and checkout
            </Link>
          )}
        </div>
      ) : mode === "QUOTE" ? (
        <Link href={`/quote?product=${p.slug}&qty=${qty}`} className={`${btn.primary} w-full py-3.5 text-base`}>
          {def.cta}
        </Link>
      ) : (
        <a
          href={whatsappLink(`Hi, I'd like to know about "${p.name}" (${variant.name}). Is it available?`)}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btn.whatsapp} w-full py-3.5 text-base`}
        >
          <ChatIcon size={20} /> {def.cta}
        </a>
      )}

      {p.tiers.length > 0 && !catalogOnly && (
        <div className="rounded-xl border border-dashed border-line p-4 text-sm">
          <p className="font-semibold">Buying in bulk?</p>
          <ul className="mt-1.5 space-y-1 text-muted">
            {p.tiers.map((t) => (
              <li key={t.minQty}>
                {t.minQty}+ {p.unit === "piece" ? "pieces" : p.unit}: <span className="font-semibold text-ink">{formatINR(t.unitPrice)}</span> each
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
