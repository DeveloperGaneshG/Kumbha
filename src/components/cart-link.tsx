"use client";

import Link from "next/link";
import { useCart } from "./cart";

export function CartLink() {
  const { count } = useCart();
  return (
    <Link href="/cart" className="relative rounded-full border border-clay-200 bg-white px-3 py-1.5 text-sm" aria-label={`Cart, ${count} items`}>
      🛒
      {count > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-kumkum px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
