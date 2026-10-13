import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, listCategories, listProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { MODES } from "@/lib/selling-modes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const filters = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();

  const [products, all] = await Promise.all([listProducts(slug, filters), listCategories()]);
  const children = all.filter((c) => c.parentSlug === slug);
  // Filters are generated from the category template — no per-category code
  const filterFields = category.attributeSchema.filter((f) => f.filterable && (f.type === "select" || f.type === "multiselect"));

  const hrefWith = (key: string, value?: string) => {
    const next = new URLSearchParams(Object.entries(filters).filter((e): e is [string, string] => Boolean(e[1])));
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    return `/c/${slug}${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-clay-600">
        <Link href="/">Home</Link> / {category.name}
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">
            {category.emoji} {category.name}
          </h1>
          {category.nameTe && <p className="text-lg text-clay-600">{category.nameTe}</p>}
          <p className="mt-2 max-w-2xl text-clay-700">{category.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.rules.badges?.map((b) => (
            <span key={b} className="rounded-full bg-leaf/10 px-3 py-1 text-sm text-leaf">
              ✓ {b}
            </span>
          ))}
        </div>
      </div>

      {category.rules.legalNotice && (
        <div className="mt-6 rounded-xl border border-turmeric bg-turmeric/10 p-4 text-sm">⚠️ {category.rules.legalNotice}</div>
      )}

      {children.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {children.map((c) => (
            <Link key={c.slug} href={`/c/${c.slug}`} className="rounded-full border border-clay-300 bg-white px-4 py-1.5 text-sm">
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="space-y-6">
          {filterFields.map((f) => (
            <div key={f.key}>
              <p className="mb-2 text-sm font-semibold">{f.label}</p>
              <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
                <Link href={hrefWith(f.key)} className={`text-sm ${!filters[f.key] ? "font-semibold text-clay-700" : "text-clay-600"}`}>
                  All
                </Link>
                {"options" in f &&
                  f.options.map((o) => (
                    <Link key={o} href={hrefWith(f.key, o)} className={`text-sm ${filters[f.key] === o ? "font-semibold text-clay-700 underline" : "text-clay-600"}`}>
                      {o}
                    </Link>
                  ))}
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-clay-100 p-4 text-sm">
            <p className="font-semibold">How you can buy</p>
            <ul className="mt-2 space-y-1">
              {category.sellingModes.map((m) => (
                <li key={m}>• {MODES[m].label}</li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {products.length === 0 ? (
            <p className="text-clay-600">No products match these filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
