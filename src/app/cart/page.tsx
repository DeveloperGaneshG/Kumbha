"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/components/cart";
import { computeTotals } from "@/lib/pricing";
import { MODES, type SellingMode } from "@/lib/selling-modes";
import { formatINR } from "@/lib/money";
import { whatsappLink } from "@/components/whatsapp";

const totalsFor = (i: CartItem) =>
  computeTotals({ lines: [{ unitPrice: i.unitPrice, quantity: i.quantity, gstRate: i.gstRate, tiers: i.tiers }], mode: i.mode, rules: i.rules });

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-6xl">🛒</p>
        <h1 className="mt-4 text-3xl">Your cart is empty</h1>
        <Link href="/" className="mt-6 inline-block rounded-full bg-clay-600 px-6 py-2.5 font-semibold text-white">
          Start shopping
        </Link>
      </div>
    );
  }

  // Each selling mode becomes its own order (different payment split and fulfilment)
  const groups = new Map<SellingMode, CartItem[]>();
  for (const i of items) groups.set(i.mode, [...(groups.get(i.mode) ?? []), i]);

  const all = items.map(totalsFor);
  const grand = all.reduce((s, t) => s + t.total, 0);
  const payNow = all.reduce((s, t) => s + t.payNow, 0);

  const orderText = [
    "Hi! I'd like to place this order:",
    ...items.map((i) => `• ${i.name} (${i.variantName}) × ${i.quantity} — ${MODES[i.mode].label}${i.scheduledFor ? ` on ${i.scheduledFor}` : ""}`),
    `Total: ${formatINR(grand)}`,
  ].join("\n");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl">Your cart</h1>
      <div className="mt-8 space-y-8">
        {[...groups.entries()].map(([mode, list]) => (
          <section key={mode} className="rounded-2xl border border-clay-200 bg-white">
            <header className="flex items-center justify-between border-b border-clay-200 px-5 py-3">
              <p className="font-semibold">{MODES[mode].label}</p>
              <p className="text-sm text-clay-600">{MODES[mode].description}</p>
            </header>
            <ul className="divide-y divide-clay-100">
              {list.map((i) => {
                const t = totalsFor(i);
                return (
                  <li key={`${i.sku}-${i.mode}`} className="flex flex-wrap items-center gap-4 px-5 py-4">
                    <div className="flex-1">
                      <Link href={`/p/${i.productSlug}`} className="font-medium hover:underline">
                        {i.name}
                      </Link>
                      <p className="text-sm text-clay-600">
                        {i.variantName}
                        {i.scheduledFor && ` · ${i.scheduledFor}`}
                        {i.customization?.note && ` · “${i.customization.note}”`}
                      </p>
                    </div>
                    <input
                      type="number"
                      min={0}
                      value={i.quantity}
                      onChange={(e) => setQty(i.sku, i.mode, Number(e.target.value))}
                      className="w-20 rounded-lg border border-clay-200 px-2 py-1"
                      aria-label="Quantity"
                    />
                    <div className="w-28 text-right">
                      <p className="font-semibold">{formatINR(t.total)}</p>
                      {t.packagingFee > 0 && <p className="text-xs text-clay-600">incl. packing {formatINR(t.packagingFee)}</p>}
                    </div>
                    <button onClick={() => remove(i.sku, i.mode)} className="text-clay-500" aria-label={`Remove ${i.name}`}>
                      ✕
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-clay-100 p-6">
        <div className="flex justify-between text-lg">
          <span>Total</span>
          <span className="font-semibold">{formatINR(grand)}</span>
        </div>
        {payNow !== grand && (
          <div className="flex justify-between text-clay-700">
            <span>Pay now (advance)</span>
            <span>{formatINR(payNow)}</span>
          </div>
        )}
        <p className="mt-1 text-xs text-clay-600">Delivery charges are calculated at checkout from your pincode.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {/* Online payment (Razorpay UPI/cards) is the next build step — see docs/ROADMAP.md */}
          <button disabled className="flex-1 rounded-full bg-clay-600 py-3 font-semibold text-white opacity-50" title="Coming soon">
            Pay online (coming soon)
          </button>
          <a
            href={whatsappLink(orderText)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-full bg-[#25d366] py-3 text-center font-semibold text-white"
          >
            Order on WhatsApp
          </a>
        </div>
        <button onClick={clear} className="mt-4 text-sm text-clay-600 underline">
          Clear cart
        </button>
      </div>
    </div>
  );
}
