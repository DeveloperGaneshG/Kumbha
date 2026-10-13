"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { CheckIcon } from "./icons";
import { btn } from "./ui";

/** Adds a combo to the cart as one line at the combo price. */
export function AddBundleButton({ slug, name, price, image, summary }: { slug: string; name: string; price: number; image: string; summary: string }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  if (added) {
    return (
      <Link href="/cart" className={btn.secondary}>
        <CheckIcon size={18} /> Added — view cart
      </Link>
    );
  }
  return (
    <button
      type="button"
      className={btn.primary}
      onClick={() => {
        add({
          sku: `COMBO-${slug}`,
          productSlug: slug,
          name,
          image,
          icon: "🎁",
          variantName: summary,
          unitPrice: price,
          quantity: 1,
          gstRate: 12,
          mode: "SHIP_TO_HOME",
          tiers: [],
          rules: { fragile: true },
          isBundle: true,
        });
        setAdded(true);
      }}
    >
      Add combo to cart
    </button>
  );
}
