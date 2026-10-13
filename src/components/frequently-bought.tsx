"use client";

/** "Frequently bought together": tick items, see the live total, add all in one go. */
import { useState } from "react";
import Link from "next/link";
import { useCart, type CartItem } from "./cart";
import { ProductImage } from "./product-image";
import { formatINR } from "@/lib/money";
import { btn } from "./ui";
import { CheckIcon } from "./icons";

export type FbtItem = Omit<CartItem, "quantity"> & { isMain?: boolean };

export function FrequentlyBought({ items }: { items: FbtItem[] }) {
  const { add } = useCart();
  const [selected, setSelected] = useState<string[]>(items.map((i) => i.sku));
  const [added, setAdded] = useState(false);
  const chosen = items.filter((i) => selected.includes(i.sku));
  const total = chosen.reduce((s, i) => s + i.unitPrice, 0);

  return (
    <div className="rounded-2xl border border-line p-6">
      <h2 className="text-xl font-bold">Frequently bought together</h2>
      <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-center">
        <ul className="flex flex-1 flex-wrap items-center gap-3">
          {items.map((i, idx) => (
            <li key={i.sku} className="flex items-center gap-3">
              {idx > 0 && (
                <span aria-hidden className="text-2xl text-faint">
                  +
                </span>
              )}
              <Link href={`/p/${i.productSlug}`} className={`block w-28 transition-opacity ${selected.includes(i.sku) ? "" : "opacity-40"}`}>
                <ProductImage src={i.image} alt={i.name} width={240} fallbackIcon={i.icon} className="aspect-square w-full rounded-lg" />
              </Link>
            </li>
          ))}
        </ul>
        <div className="lg:w-80">
          <ul className="space-y-2">
            {items.map((i) => (
              <li key={i.sku}>
                <label className="flex cursor-pointer items-start gap-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(i.sku)}
                    onChange={(e) => setSelected(e.target.checked ? [...selected, i.sku] : selected.filter((s) => s !== i.sku))}
                    className="mt-0.5 h-4 w-4 accent-[var(--brand)]"
                  />
                  <span className="flex-1">
                    {i.isMain && <span className="font-semibold">This item: </span>}
                    {i.name} <span className="text-muted">· {i.variantName}</span>
                  </span>
                  <span className="font-semibold">{formatINR(i.unitPrice)}</span>
                </label>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg">
            Total: <span className="font-extrabold">{formatINR(total)}</span>
          </p>
          {added ? (
            <Link href="/cart" className={`${btn.secondary} mt-3 w-full`}>
              <CheckIcon size={18} /> Added — view cart
            </Link>
          ) : (
            <button
              type="button"
              disabled={chosen.length === 0}
              onClick={() => {
                add(chosen.map((c) => ({ ...c, isMain: undefined, quantity: 1 })));
                setAdded(true);
              }}
              className={`${btn.primary} mt-3 w-full`}
            >
              Add {chosen.length === items.length ? "all" : chosen.length} to cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
