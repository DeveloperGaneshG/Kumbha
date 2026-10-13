import Link from "next/link";
import { featuredProducts, listCategories } from "@/lib/catalog";
import { activeSeasons } from "@/lib/seasons";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featured] = await Promise.all([listCategories(), featuredProducts()]);
  const season = activeSeasons()[0];
  const top = categories.filter((c) => !c.parentSlug);
  const seasonCategory = season && season.categorySlugs.map((s) => top.find((c) => c.slug === s)).find(Boolean);

  return (
    <>
      <section className="mat bg-clay-600 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            {season && <p className="mb-3 inline-block rounded-full bg-turmeric px-3 py-1 text-sm font-semibold text-clay-900">{season.name} season</p>}
            <h1 className="text-4xl leading-tight md:text-5xl">{season ? season.tagline : "Handmade with love, delivered with care"}</h1>
            <p className="mt-4 max-w-xl text-clay-100">
              Clay pots from local potters, eco-friendly idols, GI-tagged Etikoppaka toys and festive decor — plus bricks and materials for your new home.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {seasonCategory && (
                <Link href={`/c/${seasonCategory.slug}`} className="rounded-full bg-white px-5 py-2.5 font-semibold text-clay-700">
                  Shop {seasonCategory.name}
                </Link>
              )}
              <Link href="/build" className="rounded-full border border-white/60 px-5 py-2.5 font-semibold">
                Building a home? →
              </Link>
            </div>
          </div>
          <div className="hidden justify-center text-[9rem] leading-none md:flex" aria-hidden>
            {seasonCategory?.emoji ?? "🏺"}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl">Shop by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {top.map((c) => (
            <Link
              key={c.slug}
              href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`}
              className={`rounded-2xl p-5 transition hover:shadow-md ${c.storefront === "BUILD" ? "bg-slate-build text-white" : "border border-clay-200 bg-white"}`}
            >
              <div className="text-4xl">{c.emoji}</div>
              <p className="mt-3 text-lg font-semibold leading-tight">{c.name}</p>
              <p className="text-sm opacity-75">{c.nameTe}</p>
              <p className="mt-2 line-clamp-2 text-sm opacity-80">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl">Featured</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-4 px-4 sm:grid-cols-3">
        {[
          ["🤲", "Made by artisans", "Every piece is handmade. Meet the potters and toy makers on each product page."],
          ["📦", "Packed for clay", "Fragile items are double-boxed. Broken on arrival? Send a photo — we replace it."],
          ["💬", "Order on WhatsApp", "Prefer chatting? Send us a message and we'll take your order there."],
        ].map(([icon, title, body]) => (
          <div key={title} className="rounded-2xl bg-clay-100 p-5">
            <div className="text-3xl">{icon}</div>
            <p className="mt-2 font-semibold">{title}</p>
            <p className="text-sm text-clay-700">{body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
