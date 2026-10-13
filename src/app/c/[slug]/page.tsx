import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, listCategories, listProducts, SORT_OPTIONS, type SortKey } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { SortSelect } from "@/components/sort-select";
import { Breadcrumbs } from "@/components/ui";
import { FilterIcon } from "@/components/icons";
import { MODES } from "@/lib/selling-modes";
import { Faq, OrderByBanner } from "@/components/sections";
import { CategoryHero } from "@/components/heroes/category-hero";
import { rupees } from "@/lib/money";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> };

const PRICE_BANDS = [
  { label: "Under ₹500", min: undefined, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹5,000", min: 1000, max: 5000 },
  { label: "Over ₹5,000", min: 5000, max: undefined },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategory((await params).slug);
  return c ? { title: c.name, description: c.description ?? undefined } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort, min, max, ...attrs } = await searchParams;
  const category = await getCategory(slug);
  if (!category) notFound();

  const sortKey = SORT_OPTIONS.some((o) => o.key === sort) ? (sort as SortKey) : undefined;
  const [products, all] = await Promise.all([
    listProducts(slug, {
      filters: attrs,
      sort: sortKey,
      minPrice: min ? rupees(Number(min)) : undefined,
      maxPrice: max ? rupees(Number(max)) : undefined,
    }),
    listCategories(),
  ]);
  const children = all.filter((c) => c.parentSlug === slug);
  const parent = category.parentSlug ? all.find((c) => c.slug === category.parentSlug) : null;
  // Filters come from the category template — no per-category code
  const filterFields = category.attributeSchema.filter((f) => f.filterable && (f.type === "select" || f.type === "multiselect"));
  const current = await searchParams;
  const activeCount = Object.entries(attrs).filter(([, v]) => v).length + (min || max ? 1 : 0);

  const hrefWith = (changes: Record<string, string | undefined>) => {
    const next = new URLSearchParams(Object.entries({ ...current, ...changes }).filter((e): e is [string, string] => Boolean(e[1])));
    const qs = next.toString();
    return `/c/${slug}${qs ? `?${qs}` : ""}`;
  };

  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1.5 text-sm transition-colors ${active ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`;

  const filters = (
    <div className="space-y-7">
      {filterFields.map((f) => (
        <fieldset key={f.key}>
          <legend className="mb-3 font-semibold">{f.label}</legend>
          <div className="flex flex-wrap gap-2">
            {"options" in f &&
              f.options.map((o) => {
                const active = attrs[f.key] === o;
                return (
                  <Link key={o} href={hrefWith({ [f.key]: active ? undefined : o })} className={chip(active)} aria-current={active || undefined}>
                    {o}
                  </Link>
                );
              })}
          </div>
        </fieldset>
      ))}
      <fieldset>
        <legend className="mb-3 font-semibold">Price</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => {
            const active = min === (b.min?.toString() ?? undefined) && max === (b.max?.toString() ?? undefined) && Boolean(min || max);
            return (
              <Link
                key={b.label}
                href={hrefWith(active ? { min: undefined, max: undefined } : { min: b.min?.toString(), max: b.max?.toString() })}
                className={chip(active)}
              >
                {b.label}
              </Link>
            );
          })}
        </div>
      </fieldset>
      <div className="rounded-xl bg-surface p-4 text-sm">
        <p className="font-semibold">Ways to buy</p>
        <ul className="mt-2 space-y-1.5 text-muted">
          {category.sellingModes.map((m) => (
            <li key={m}>
              <span className="font-medium text-ink">{MODES[m].label}</span> — {MODES[m].description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, ...(parent ? [{ label: parent.name, href: `/c/${parent.slug}` }] : []), { label: category.name }]}
      />

      {category.rules.hero ? (
        <div className="mt-4">
          <CategoryHero category={category} products={await listProducts(slug)} variant="page" />
          {category.rules.badges && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {category.rules.badges.map((b) => (
                <li key={b} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
      <header className="mt-4 grid items-center gap-6 md:grid-cols-[1fr_320px]">
          <div>
            <h1 className="text-3xl font-extrabold md:text-4xl">{category.name}</h1>
            {category.nameTe && <p className="mt-1 font-[family-name:var(--font-telugu)] text-lg text-muted">{category.nameTe}</p>}
            <p className="mt-3 max-w-2xl text-muted">{category.description}</p>
            {category.rules.badges && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {category.rules.badges.map((b) => (
                  <li key={b} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <ProductImage src={category.image} alt="" width={700} fallbackIcon={category.emoji} className="hidden aspect-[16/10] w-full rounded-2xl md:block" />
        </header>
      )}

      {category.sellingModes.some((m) => m === "SHIP_TO_HOME" || m === "LOCAL_DELIVERY") && (
        <div className="mt-6">
          <OrderByBanner />
        </div>
      )}

      {category.rules.legalNotice && (
        <p role="note" className="mt-6 rounded-xl border border-accent/60 bg-accent/10 p-4 text-sm">
          <strong>Please note:</strong> {category.rules.legalNotice}
        </p>
      )}

      {children.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {children.map((c) => (
            <li key={c.slug}>
              <Link href={`/c/${c.slug}`} className={chip(false)}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div id="products" className="scroll-mt-36">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <p className="text-sm text-muted">
              {products.length} {products.length === 1 ? "product" : "products"}
              {activeCount > 0 && (
                <>
                  {" · "}
                  <Link href={`/c/${slug}${sortKey ? `?sort=${sortKey}` : ""}`} className="font-semibold text-brand hover:underline">
                    Clear filters
                  </Link>
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              <details className="relative lg:hidden">
                <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium">
                  <FilterIcon size={16} /> Filters{activeCount > 0 && ` (${activeCount})`}
                </summary>
                <div className="absolute left-0 z-20 mt-2 w-[min(90vw,360px)] rounded-xl border border-line bg-white p-5 shadow-xl">{filters}</div>
              </details>
              <Suspense>
                <SortSelect />
              </Suspense>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="rounded-2xl bg-surface p-10 text-center">
              <p className="font-semibold">Nothing matches these filters</p>
              <p className="mt-1 text-sm text-muted">Try removing a filter, or ask us — we can often make it to order.</p>
              <Link href={`/c/${slug}`} className="mt-4 inline-block font-semibold text-brand hover:underline">
                Clear all filters
              </Link>
            </div>
          ) : (
            <ProductGrid products={products} className="md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" />
          )}
        </div>
      </div>

      {category.rules.origin && (
        <section className="mt-16 grid gap-6 rounded-2xl bg-brand-soft p-6 md:grid-cols-[auto_1fr] md:p-10">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-lg font-extrabold text-brand">
            {category.rules.origin.gi ? "GI" : "📍"}
          </span>
          <div>
            <h2 className="text-2xl font-bold">From {category.rules.origin.place}</h2>
            <p className="mt-3 max-w-3xl leading-relaxed">{category.rules.origin.story}</p>
          </div>
        </section>
      )}

      {category.rules.guide && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">{category.rules.guide.title}</h2>
          {category.rules.guide.intro && <p className="mt-2 max-w-2xl text-muted">{category.rules.guide.intro}</p>}
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {category.rules.guide.steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-line p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span>
                <p className="mt-3 font-semibold">{step.title}</p>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {category.rules.faqs && (
        <section className="mt-16 max-w-3xl">
          <Faq items={category.rules.faqs} title={`${category.name}: common questions`} />
        </section>
      )}
    </div>
  );
}
