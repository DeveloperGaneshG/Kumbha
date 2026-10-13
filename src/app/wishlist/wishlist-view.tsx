"use client";

import Link from "next/link";
import { useLocalList, WISHLIST_KEY } from "@/components/local-list";
import { ProductImage } from "@/components/product-image";
import { HeartIcon } from "@/components/icons";
import { btn } from "@/components/ui";
import { formatINR } from "@/lib/money";

type Item = { slug: string; name: string; image: string | null; price: number; icon: string; category: string };

export function WishlistView({ products }: { products: Item[] }) {
  const { items, toggle } = useLocalList(WISHLIST_KEY);
  const saved = items.map((s) => products.find((p) => p.slug === s)).filter((p): p is Item => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="mt-8 rounded-2xl bg-surface px-6 py-16 text-center">
        <HeartIcon size={40} className="mx-auto text-faint" />
        <p className="mt-4 text-lg font-semibold">No saved items yet</p>
        <p className="mt-1 text-muted">Tap the heart on any product to keep it here for later.</p>
        <Link href="/" className={`${btn.primary} mt-6`}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
      {saved.map((p) => (
        <li key={p.slug}>
          <Link href={`/p/${p.slug}`} className="group block">
            <ProductImage src={p.image} alt={p.name} fallbackIcon={p.icon} className="aspect-square w-full rounded-xl" />
            <p className="mt-3 text-sm text-muted">{p.category}</p>
            <p className="line-clamp-2 font-semibold group-hover:underline">{p.name}</p>
            <p className="mt-1 font-bold">{formatINR(p.price)}</p>
          </Link>
          <button type="button" onClick={() => toggle(p.slug)} className="mt-2 text-sm font-semibold text-muted hover:text-sale">
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
