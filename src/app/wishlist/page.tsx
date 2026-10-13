import type { Metadata } from "next";
import { allProducts, fromPrice } from "@/lib/catalog";
import { WishlistView } from "./wishlist-view";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Saved items" };

export default async function WishlistPage() {
  const products = (await allProducts()).map((p) => ({
    slug: p.slug,
    name: p.name,
    image: p.images[0] ?? null,
    price: fromPrice(p),
    icon: p.category.emoji,
    category: p.category.name,
  }));
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Saved items</h1>
      <WishlistView products={products} />
    </div>
  );
}
