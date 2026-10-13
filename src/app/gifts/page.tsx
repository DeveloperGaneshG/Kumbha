import Link from "next/link";
import type { Metadata } from "next";
import { giftProducts, listBundles } from "@/lib/catalog";
import { store } from "@/config/store";
import { ProductGrid } from "@/components/product-card";
import { BundleCard, OrderByBanner } from "@/components/sections";
import { Breadcrumbs, btn } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gift finder", description: "Handmade gifts by budget and by who they're for — diyas, puja kits, clay cookware and Etikoppaka toys." };

type Props = { searchParams: Promise<{ for?: string; min?: string; max?: string }> };

export default async function GiftsPage({ searchParams }: Props) {
  const q = await searchParams;
  const min = q.min ? Number(q.min) : undefined;
  const max = q.max ? Number(q.max) : undefined;
  const tag = store.giftRecipients.some((r) => r.tag === q.for) ? q.for : undefined;
  const [products, bundles] = await Promise.all([giftProducts({ tag, min, max }), listBundles()]);
  const matchingBundles = bundles.filter(
    (b) => (!tag || b.tags.includes(tag)) && (min === undefined || b.price >= min * 100) && (max === undefined || b.price < max * 100),
  );
  const recipient = store.giftRecipients.find((r) => r.tag === tag);

  const href = (next: Record<string, string | number | undefined>) => {
    const merged = { for: tag, min, max, ...next };
    const qs = new URLSearchParams(Object.entries(merged).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString();
    return `/gifts${qs ? `?${qs}` : ""}`;
  };
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gift finder" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Find a handmade gift</h1>
      <p className="mt-2 max-w-2xl text-muted">Pick who it&apos;s for and your budget. Add gift wrap and a handwritten note in the cart.</p>

      <div className="mt-6">
        <OrderByBanner />
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-sm font-semibold">For</span>
          <Link href={href({ for: undefined })} className={chip(!tag)}>
            Anyone
          </Link>
          {store.giftRecipients.map((r) => (
            <Link key={r.tag} href={href({ for: r.tag })} className={chip(tag === r.tag)}>
              {r.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-sm font-semibold">Budget</span>
          <Link href={href({ min: undefined, max: undefined })} className={chip(min === undefined && max === undefined)}>
            Any
          </Link>
          {store.giftBudgets.map((b) => (
            <Link key={b.label} href={href({ min: b.min, max: b.max })} className={chip(min === b.min && max === b.max)}>
              {b.label}
            </Link>
          ))}
        </div>
      </div>

      {tag === "corporate" && (
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand-soft p-6 md:flex-row md:items-center">
          <div>
            <p className="text-lg font-bold">Gifting for a team or clients?</p>
            <p className="mt-1 text-muted">Bulk prices from 10 boxes, your logo on the sleeve, and delivery to multiple addresses.</p>
          </div>
          <Link href="/quote" className={btn.primary}>
            Get a corporate quote
          </Link>
        </div>
      )}
      {tag === "return-gift" && (
        <p className="mt-8 rounded-2xl bg-brand-soft p-5">
          <strong>Ordering 20 or more?</strong> Bulk prices apply automatically in the cart, or{" "}
          <Link href="/quote" className="font-semibold text-brand underline">
            request a quote
          </Link>{" "}
          for 100+.
        </p>
      )}

      {matchingBundles.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Gift-ready combos</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {matchingBundles.map((b) => (
              <BundleCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold">
          {products.length} {recipient ? recipient.label.toLowerCase() : "gift"} {products.length === 1 ? "idea" : "ideas"}
        </h2>
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <p className="rounded-2xl bg-surface p-8 text-center text-muted">Nothing in this budget yet — try the next range up, or ask us on WhatsApp.</p>
        )}
      </section>
    </div>
  );
}
