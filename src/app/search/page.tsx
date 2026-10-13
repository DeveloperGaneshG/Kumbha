import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { allProducts, listCategories, searchProducts, SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import { SortSelect } from "@/components/sort-select";
import { SearchIcon } from "@/components/icons";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Search" };

const SUGGESTIONS = ["Matka", "Diya", "Ganesh", "Kulhad", "Etikoppaka", "Bricks"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string }> }) {
  const { q = "", sort } = await searchParams;
  const sortKey = SORT_OPTIONS.some((o) => o.key === sort) ? (sort as SortKey) : undefined;
  // An empty query with a sort browses everything
  const results = q.trim() ? await searchProducts(q, sortKey) : sort ? (await allProducts()).filter(() => true) : [];
  const categories = await listCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <form role="search" className="relative max-w-2xl">
        <SearchIcon size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-faint" />
        <input
          name="q"
          type="search"
          defaultValue={q}
          autoFocus={!q}
          placeholder="Search in English or తెలుగు"
          aria-label="Search products"
          className="w-full rounded-xl border border-line bg-surface py-3.5 pl-12 pr-4 text-lg outline-none focus:border-brand focus:bg-white"
        />
      </form>

      {!q && !sort && (
        <div className="mt-8">
          <p className="font-semibold">Popular searches</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <li key={s}>
                <Link href={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-line px-4 py-2 text-sm hover:border-ink">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-semibold">Or browse a category</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`} className="rounded-full bg-surface px-4 py-2 text-sm hover:bg-line">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(q || sort) && (
        <>
          <div className="mb-6 mt-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-muted">
              {results.length} {results.length === 1 ? "result" : "results"}
              {q && (
                <>
                  {" "}
                  for <span className="font-semibold text-ink">“{q}”</span>
                </>
              )}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
          {results.length === 0 ? (
            <div className="rounded-2xl bg-surface p-10 text-center">
              <p className="font-semibold">No products match “{q}”</p>
              <p className="mt-1 text-muted">Check the spelling, try a shorter word, or ask us on WhatsApp — we may be able to make it.</p>
            </div>
          ) : (
            <ProductGrid products={results} />
          )}
        </>
      )}
    </div>
  );
}
