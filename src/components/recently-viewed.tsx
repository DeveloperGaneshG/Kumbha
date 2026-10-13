"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocalList, RECENT_KEY } from "./local-list";
import { ProductImage } from "./product-image";
import { formatINR } from "@/lib/money";

export type MiniProduct = { slug: string; name: string; image: string | null; price: number; icon: string };

/** Records a product view. Render once on the product page. */
export function TrackView({ slug }: { slug: string }) {
  const { push } = useLocalList(RECENT_KEY);
  useEffect(() => push(slug), [slug, push]);
  return null;
}

/** Shows recently viewed products, using a lookup of all products passed from the server. */
export function RecentlyViewed({ catalog, exclude }: { catalog: MiniProduct[]; exclude?: string }) {
  const { items } = useLocalList(RECENT_KEY);
  const list = items
    .filter((s) => s !== exclude)
    .map((s) => catalog.find((p) => p.slug === s))
    .filter((p): p is MiniProduct => Boolean(p))
    .slice(0, 8);
  if (list.length === 0) return null;
  return (
    <section className="mx-auto mt-16 max-w-7xl px-4">
      <h2 className="mb-5 text-2xl font-bold">Recently viewed</h2>
      <ul className="scroller -mx-4 flex gap-4 overflow-x-auto px-4">
        {list.map((p) => (
          <li key={p.slug} className="w-36 shrink-0 sm:w-44">
            <Link href={`/p/${p.slug}`} className="group block">
              <ProductImage src={p.image} alt={p.name} width={300} fallbackIcon={p.icon} className="aspect-square w-full rounded-lg" />
              <p className="mt-2 line-clamp-1 text-sm font-medium group-hover:underline">{p.name}</p>
              <p className="text-sm text-muted">{formatINR(p.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
