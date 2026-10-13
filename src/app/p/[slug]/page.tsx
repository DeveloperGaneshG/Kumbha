import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { allProducts, bundlesWith, cartMode, fromPrice, getProducts, getProduct, listCategories, relatedProducts, type ProductView } from "@/lib/catalog";
import { BundleCard, OrderByBanner } from "@/components/sections";
import { FrequentlyBought, type FbtItem } from "@/components/frequently-bought";
import { formatAttributes } from "@/lib/category-template";
import { store, img } from "@/config/store";
import { ProductActions } from "@/components/product-actions";
import { SizeVisualizer } from "@/components/size-visualizer";
import { WallCalculator } from "@/components/wall-calculator";
import { Gallery } from "@/components/gallery";
import { PincodeCheck } from "@/components/pincode-check";
import { Reviews } from "@/components/reviews";
import { ProductRow } from "@/components/product-card";
import { RecentlyViewed, TrackView } from "@/components/recently-viewed";
import { WishlistButton } from "@/components/wishlist-button";
import { Breadcrumbs, RatingInline, SectionHeader } from "@/components/ui";
import { CheckIcon, ShareIcon } from "@/components/icons";
import { whatsappLink } from "@/components/whatsapp";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.description ?? undefined,
    openGraph: { title: p.name, description: p.description ?? undefined, images: p.images[0] ? [img(p.images[0], 1200)] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  const { category: c } = p;
  const [cats, related, all, pairs, combos] = await Promise.all([
    listCategories(),
    relatedProducts(p, 8),
    allProducts(),
    getProducts(p.pairsWith),
    bundlesWith(p.slug),
  ]);
  // Frequently bought together: this product + its pairings, using each one's cheapest in-stock option
  const toFbt = (x: ProductView, isMain = false): FbtItem | null => {
    const mode = cartMode(x);
    const v = [...x.variants].sort((a, b) => a.price - b.price).find((v) => v.stock > 0);
    if (!mode || !v) return null;
    return {
      sku: v.sku,
      productSlug: x.slug,
      name: x.name,
      image: x.images[0],
      icon: x.category.emoji,
      variantName: v.name,
      unitPrice: v.price,
      gstRate: x.gstRate,
      mode,
      tiers: x.priceTiers,
      rules: x.category.rules,
      isMain,
    };
  };
  const fbt = [toFbt(p, true), ...pairs.map((x) => toFbt(x))].filter((x): x is FbtItem => Boolean(x));
  const parent = c.parentSlug ? cats.find((x) => x.slug === c.parentSlug) : null;
  const specs = formatAttributes(c.attributeSchema, p.attributes);
  const heightFt = typeof p.attributes.heightFt === "number" ? p.attributes.heightFt : null;
  const categoryHref = c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`;

  // Structured data so Google can show price and rating in search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.images.map((i) => img(i, 1200)),
    brand: { "@type": "Brand", name: store.name },
    ...(p.reviewCount > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount } }),
    offers: { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: fromPrice(p) / 100, highPrice: Math.max(...p.variants.map((v) => v.price)) / 100 },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TrackView slug={p.slug} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(parent ? [{ label: parent.name, href: `/c/${parent.slug}` }] : []),
          { label: c.name, href: categoryHref },
          { label: p.name },
        ]}
      />

      <div className="mt-5 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        <div className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <Gallery images={p.images} name={p.name} icon={c.emoji} />
          {c.rules.showSizeVisualizer && heightFt && <SizeVisualizer heightFt={heightFt} emoji={c.emoji} />}
        </div>

        <div className="space-y-6">
          <div>
            <Link href={categoryHref} className="text-sm font-semibold text-brand hover:underline">
              {c.name}
            </Link>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight md:text-4xl">{p.name}</h1>
            {store.features.showTeluguNames && p.nameTe && <p className="mt-1 font-[family-name:var(--font-telugu)] text-lg text-muted">{p.nameTe}</p>}
            {p.reviewCount > 0 && (
              <a href="#reviews" className="mt-3 inline-block hover:underline">
                <RatingInline rating={p.rating} count={p.reviewCount} />
              </a>
            )}
          </div>

          {c.rules.legalNotice && (
            <p role="note" className="rounded-xl border border-accent/60 bg-accent/10 p-4 text-sm">
              <strong>Please note:</strong> {c.rules.legalNotice}
            </p>
          )}

          <ProductActions
            slug={p.slug}
            name={p.name}
            image={p.images[0]}
            icon={c.emoji}
            unit={p.unit}
            gstRate={p.gstRate}
            modes={p.sellingModes}
            rules={c.rules}
            tiers={p.priceTiers}
            variants={p.variants}
          />

          {p.sellingModes.some((m) => m === "SHIP_TO_HOME" || m === "LOCAL_DELIVERY") && <OrderByBanner compact />}

          <div className="flex gap-2">
            {store.features.wishlist && <WishlistButton slug={p.slug} name={p.name} variant="button" />}
            <a
              href={whatsappLink(`Look at this: ${p.name}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-line px-4 py-3 font-semibold hover:border-ink"
            >
              <ShareIcon size={18} /> Share
            </a>
          </div>

          {p.sellingModes.some((m) => m !== "CATALOG_ONLY") && <PincodeCheck modes={p.sellingModes} fragile={c.rules.fragile} />}

          {p.highlights.length > 0 && (
            <div>
              <h2 className="font-semibold">Highlights</h2>
              <ul className="mt-2 space-y-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[15px]">
                    <CheckIcon size={18} className="mt-0.5 shrink-0 text-brand" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {c.rules.badges && (
            <ul className="flex flex-wrap gap-2">
              {c.rules.badges.map((b) => (
                <li key={b} className="rounded-full bg-brand-soft px-3 py-1 text-sm font-medium text-brand">
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Details */}
      <section className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">About this product</h2>
          <p className="mt-3 max-w-prose leading-relaxed text-muted">{p.description}</p>
          {p.origin && (
            <div className="mt-8 flex gap-4 rounded-2xl border border-line p-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-extrabold text-brand">
                {p.origin.gi ? "GI" : "📍"}
              </span>
              <div>
                <p className="font-semibold">
                  {p.origin.gi ? `GI-tagged craft from ${p.origin.place}` : `Made in ${p.origin.place}`}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {p.origin.gi
                    ? "A Geographical Indication certifies that this craft can only come from its place of origin — so you get the real thing, made by the community that created it."
                    : "Made by craftspeople we work with directly, so you know where your money goes."}
                </p>
              </div>
            </div>
          )}
          {p.artisan && (
            <div className="mt-8 rounded-2xl bg-brand-soft p-6">
              <p className="text-sm font-semibold text-brand">Made by</p>
              <p className="mt-1 text-xl font-bold">
                {p.artisan.name}
                {p.artisan.village && <span className="font-medium text-muted">, {p.artisan.village}</span>}
              </p>
              <p className="mt-2 max-w-prose text-[15px]">{p.artisan.story}</p>
            </div>
          )}
        </div>
        {specs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold">Specifications</h2>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {specs.map((s) => (
                <div key={s.key} className="grid grid-cols-[40%_1fr] gap-4 py-3 text-[15px]">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
              {p.unit !== "piece" && (
                <div className="grid grid-cols-[40%_1fr] gap-4 py-3 text-[15px]">
                  <dt className="text-muted">Sold per</dt>
                  <dd className="font-medium">{p.unit}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </section>

      {fbt.length > 1 && (
        <section className="mt-16">
          <FrequentlyBought items={fbt} />
        </section>
      )}

      {combos.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="Save with a combo" href="/combos" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {combos.map((b) => (
              <BundleCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      {c.rules.showCalculator && (
        <section className="mt-16">
          <WallCalculator />
        </section>
      )}

      {store.features.reviews && (
        <section id="reviews" className="mt-16 scroll-mt-32 border-t border-line pt-10">
          <h2 className="mb-6 text-2xl font-bold">Customer reviews</h2>
          <Reviews rating={p.rating} count={p.reviewCount} reviews={p.reviews} />
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <SectionHeader title="You may also like" href={categoryHref} />
          <ProductRow products={related.slice(0, 4)} />
        </section>
      )}

      {store.features.recentlyViewed && (
        <RecentlyViewed exclude={p.slug} catalog={all.map((x) => ({ slug: x.slug, name: x.name, image: x.images[0] ?? null, price: fromPrice(x), icon: x.category.emoji }))} />
      )}
    </div>
  );
}
