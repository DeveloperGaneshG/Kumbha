import type { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/catalog";
import { QuoteForm } from "./quote-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Request a quote" };

type Props = { searchParams: Promise<{ product?: string; qty?: string }> };

export default async function QuotePage({ searchParams }: Props) {
  const { product, qty } = await searchParams;
  // Any product whose modes include QUOTE can be requested here — across all categories
  const cats = (await listCategories()).filter((c) => c.sellingModes.includes("QUOTE") && !c.parentSlug);
  const products = (await Promise.all(cats.map((c) => listProducts(c.slug))))
    .flat()
    .filter((p) => p.sellingModes.includes("QUOTE"))
    .map((p) => ({ slug: p.slug, name: p.name, unit: p.unit, group: p.category.name }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">Request a quote</h1>
      <p className="mt-2 text-muted">
        Bulk pots for your nursery, a pandal idol, return gifts for 200 guests or bricks for your site — tell us what you need and we&apos;ll reply on
        WhatsApp within a few hours.
      </p>
      <QuoteForm products={products} initialProduct={product} initialQty={qty ? Number(qty) : undefined} />
    </div>
  );
}
