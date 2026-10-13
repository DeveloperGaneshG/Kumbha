import type { Metadata } from "next";
import { searchProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const results = await searchProducts(q);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <form className="max-w-xl">
        <input
          name="q"
          defaultValue={q}
          autoFocus
          placeholder="Search pots, idols, toys, bricks… (English or తెలుగు)"
          className="w-full rounded-full border border-clay-300 bg-white px-5 py-3 outline-none focus:border-clay-500"
        />
      </form>
      {q && (
        <p className="mt-6 text-clay-700">
          {results.length} result{results.length === 1 ? "" : "s"} for “{q}”
        </p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
