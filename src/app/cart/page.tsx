"use client";

import Link from "next/link";
import { useCart, type CartItem } from "@/components/cart";
import { ProductImage } from "@/components/product-image";
import { computeTotals } from "@/lib/pricing";
import { MODES, type SellingMode } from "@/lib/selling-modes";
import { formatINR } from "@/lib/money";
import { store } from "@/config/store";
import { whatsappLink } from "@/components/whatsapp";
import { btn } from "@/components/ui";
import { CartIcon, ChatIcon, ShieldIcon } from "@/components/icons";

const totalsFor = (i: CartItem) =>
  computeTotals({ lines: [{ unitPrice: i.unitPrice, quantity: i.quantity, gstRate: i.gstRate, tiers: i.tiers }], mode: i.mode, rules: i.rules });

export default function CartPage() {
  const { items, setQty, remove, clear } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <CartIcon size={44} className="mx-auto text-faint" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-1 text-muted">Find something handmade for the season.</p>
        <Link href="/" className={`${btn.primary} mt-6`}>
          Start shopping
        </Link>
      </div>
    );
  }

  // Each selling mode becomes its own order (different payment split and fulfilment)
  const groups = new Map<SellingMode, CartItem[]>();
  for (const i of items) groups.set(i.mode, [...(groups.get(i.mode) ?? []), i]);

  const all = items.map(totalsFor);
  const subtotal = all.reduce((s, t) => s + t.subtotal, 0);
  const packing = all.reduce((s, t) => s + t.packagingFee, 0);
  const grand = all.reduce((s, t) => s + t.total, 0);
  const payNow = all.reduce((s, t) => s + t.payNow, 0);
  const toFree = store.freeShippingAbove - subtotal;

  const orderText = [
    `Hi ${store.name}! I'd like to order:`,
    ...items.map((i) => `• ${i.name} (${i.variantName}) × ${i.quantity} — ${MODES[i.mode].label}${i.scheduledFor ? ` on ${i.scheduledFor}` : ""}`),
    `Total: ${formatINR(grand)}`,
  ].join("\n");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Your cart</h1>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          {[...groups.entries()].map(([mode, list]) => (
            <section key={mode} aria-label={MODES[mode].label}>
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <h2 className="text-lg font-bold">{MODES[mode].label}</h2>
                <p className="text-sm text-muted">{MODES[mode].description}</p>
              </div>
              <ul className="divide-y divide-line">
                {list.map((i) => {
                  const t = totalsFor(i);
                  return (
                    <li key={`${i.sku}-${i.mode}`} className="flex gap-4 py-5">
                      <Link href={`/p/${i.productSlug}`} className="shrink-0">
                        <ProductImage src={i.image} alt={i.name} width={200} fallbackIcon={i.icon} className="h-24 w-24 rounded-lg" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex justify-between gap-4">
                          <div className="min-w-0">
                            <Link href={`/p/${i.productSlug}`} className="font-semibold hover:underline">
                              {i.name}
                            </Link>
                            <p className="text-sm text-muted">
                              {i.variantName}
                              {i.scheduledFor && ` · ${new Date(i.scheduledFor).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                            </p>
                            {i.customization?.note && <p className="text-sm text-muted">“{i.customization.note}”</p>}
                          </div>
                          <p className="shrink-0 font-bold">{formatINR(t.subtotal)}</p>
                        </div>
                        <div className="mt-auto flex items-center gap-4 pt-3">
                          <div className="flex items-center rounded-lg border border-line">
                            <button type="button" onClick={() => setQty(i.sku, i.mode, i.quantity - 1)} className="px-3 py-1.5" aria-label={`Decrease ${i.name}`}>
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-semibold" aria-live="polite">
                              {i.quantity}
                            </span>
                            <button type="button" onClick={() => setQty(i.sku, i.mode, i.quantity + 1)} className="px-3 py-1.5" aria-label={`Increase ${i.name}`}>
                              +
                            </button>
                          </div>
                          <button type="button" onClick={() => remove(i.sku, i.mode)} className="text-sm font-semibold text-muted hover:text-sale">
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <button type="button" onClick={clear} className="text-sm font-semibold text-muted hover:text-ink">
            Empty cart
          </button>
        </div>

        <aside className="h-fit rounded-2xl border border-line p-6 lg:sticky lg:top-32">
          <h2 className="text-lg font-bold">Order summary</h2>
          {toFree > 0 ? (
            <div className="mt-4">
              <p className="text-sm">
                Add <strong>{formatINR(toFree)}</strong> more for free local delivery
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface">
                <div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (subtotal / store.freeShippingAbove) * 100)}%` }} />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm font-semibold text-success">You get free local delivery</p>
          )}
          <dl className="mt-5 space-y-2 text-[15px]">
            <div className="flex justify-between">
              <dt className="text-muted">Items</dt>
              <dd>{formatINR(subtotal)}</dd>
            </div>
            {packing > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Breakage-safe packing</dt>
                <dd>{formatINR(packing)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="text-muted">At checkout</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatINR(grand)}</dd>
            </div>
            {payNow !== grand && (
              <div className="flex justify-between font-semibold text-brand">
                <dt>Pay now (advance)</dt>
                <dd>{formatINR(payNow)}</dd>
              </div>
            )}
          </dl>
          <div className="mt-6 space-y-3">
            {/* Online payment (Razorpay UPI/cards) is the next build step — see docs/ROADMAP.md */}
            <button type="button" disabled className={`${btn.primary} w-full`} title="Coming soon">
              Pay online — coming soon
            </button>
            {store.features.whatsappOrdering && (
              <a href={whatsappLink(orderText)} target="_blank" rel="noopener noreferrer" className={`${btn.whatsapp} w-full`}>
                <ChatIcon size={20} /> Place order on WhatsApp
              </a>
            )}
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted">
            <ShieldIcon size={18} /> Prices include GST. Breakage replaced free.
          </p>
        </aside>
      </div>
    </div>
  );
}
