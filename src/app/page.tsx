import Link from "next/link";
import { allProducts, featuredProducts, fromPrice, listCategories, newArrivals, topDeals } from "@/lib/catalog";
import { store } from "@/config/store";
import { ProductGrid, ProductRow } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { RecentlyViewed } from "@/components/recently-viewed";
import { SectionHeader, btn } from "@/components/ui";
import { HandIcon, ShieldIcon, ReceiptIcon, ChatIcon } from "@/components/icons";
import { whatsappLink } from "@/components/whatsapp";

export const dynamic = "force-dynamic";

const PROMISE_ICONS = [HandIcon, ShieldIcon, ReceiptIcon, ChatIcon];

function daysUntil(date: string) {
  const ms = new Date(`${date}T00:00:00+05:30`).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export default async function Home() {
  const [categories, featured, deals, fresh, all] = await Promise.all([
    listCategories(),
    featuredProducts(8),
    topDeals(8),
    newArrivals(4),
    allProducts(),
  ]);
  const top = categories.filter((c) => !c.parentSlug);
  const { campaign } = store;
  const days = daysUntil(campaign.date);
  const idols = top.find((c) => c.slug === "idols");
  const build = top.find((c) => c.storefront === "BUILD");

  return (
    <>
      {/* Campaign hero */}
      <section className="mx-auto max-w-7xl px-4 pt-5">
        <div className="relative isolate overflow-hidden rounded-2xl bg-ink">
          <ProductImage src={campaign.image} alt="" fallbackIcon="" width={1600} priority className="absolute inset-0 -z-10 h-full w-full opacity-70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="max-w-xl px-6 py-14 text-white sm:px-10 md:py-24">
            {days > 0 && days < 120 && (
              <p className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-sm font-bold text-ink">
                {campaign.name} in {days} {days === 1 ? "day" : "days"}
              </p>
            )}
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl">{campaign.headline}</h1>
            <p className="mt-4 max-w-md text-lg text-white/85">{campaign.subline}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href={`/c/${campaign.categorySlug}`} className={btn.onDark}>
                Shop {campaign.name}
              </Link>
              <Link href="/quote" className="inline-flex items-center rounded-lg border border-white/50 px-5 py-3 font-semibold text-white hover:bg-white/10">
                Bulk & gifting orders
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category rail */}
      <section className="mx-auto mt-10 max-w-7xl px-4" aria-label="Shop by category">
        <ul className="scroller -mx-4 flex gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-5 md:px-0">
          {top.map((c) => (
            <li key={c.slug} className="w-28 shrink-0 md:w-auto">
              <Link href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`} className="group block text-center">
                <ProductImage src={c.image} alt="" width={400} fallbackIcon={c.emoji} className="aspect-square w-full rounded-2xl transition group-hover:brightness-95" />
                <p className="mt-2.5 text-sm font-semibold leading-tight">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {deals.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <SectionHeader title="Festive deals" href={`/c/${campaign.categorySlug}`} />
          <ProductRow products={deals.slice(0, 4)} />
        </section>
      )}

      {/* Two feature banners */}
      <section className="mx-auto mt-16 grid max-w-7xl gap-4 px-4 md:grid-cols-2">
        {idols && (
          <Link href={`/c/${idols.slug}`} className="group relative isolate flex min-h-64 items-end overflow-hidden rounded-2xl bg-ink p-6 text-white">
            <ProductImage src={idols.image} alt="" fallbackIcon="" width={1000} className="absolute inset-0 -z-10 h-full w-full opacity-75 transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-transparent" />
            <div>
              <p className="text-2xl font-bold">Pre-book eco-friendly idols</p>
              <p className="mt-1 max-w-sm text-white/85">Reserve with a 30% advance, pick your festival date, collect fresh from the maker.</p>
              <span className="mt-4 inline-block font-semibold underline underline-offset-4">Book your idol</span>
            </div>
          </Link>
        )}
        {build && (
          <Link href="/build" className="group relative isolate flex min-h-64 items-end overflow-hidden rounded-2xl bg-ink p-6 text-white">
            <ProductImage src={build.image} alt="" fallbackIcon="" width={1000} className="absolute inset-0 -z-10 h-full w-full opacity-70 transition duration-500 group-hover:scale-[1.03]" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 to-transparent" />
            <div>
              <p className="text-2xl font-bold">Building a home?</p>
              <p className="mt-1 max-w-sm text-white/85">Bricks, sand and cement delivered to your site, with a free material calculator.</p>
              <span className="mt-4 inline-block font-semibold underline underline-offset-4">Get a site quote</span>
            </div>
          </Link>
        )}
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionHeader title="Bestsellers" href="/search?q=&sort=popular" linkLabel="Browse all" />
        <ProductGrid products={featured} />
      </section>

      {/* Promises */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {store.promises.map((p, i) => {
            const Icon = PROMISE_ICONS[i % PROMISE_ICONS.length];
            return (
              <li key={p.title} className="flex gap-4 bg-white p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <Icon size={22} />
                </span>
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="mt-1 text-sm text-muted">{p.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {fresh.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <SectionHeader title="New arrivals" />
          <ProductRow products={fresh} />
        </section>
      )}

      {/* Maker story */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid overflow-hidden rounded-2xl bg-brand-soft md:grid-cols-2">
          <ProductImage src={top[0]?.image} alt="A potter shaping clay on a wheel" width={1200} className="aspect-[4/3] h-full w-full md:aspect-auto" />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <h2 className="text-3xl font-bold">Made by hands you can name</h2>
            <p className="mt-4 max-w-md text-muted">
              Our pots come from potters in Kondapalli, our toys from lacquer turners in Etikoppaka. Every product page tells you who made it and how — and
              every order pays them fairly.
            </p>
            <div className="mt-6">
              <Link href="/c/etikoppaka-toys" className={btn.primary}>
                Meet the makers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {store.features.recentlyViewed && (
        <RecentlyViewed catalog={all.map((p) => ({ slug: p.slug, name: p.name, image: p.images[0] ?? null, price: fromPrice(p), icon: p.category.emoji }))} />
      )}

      {store.features.whatsappOrdering && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-line p-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-bold">Get festival offers on WhatsApp</h2>
              <p className="mt-1 text-muted">One message before each festival. No spam — reply STOP any time.</p>
            </div>
            <a href={whatsappLink("Hi! Please add me to your festival offers list.")} target="_blank" rel="noopener noreferrer" className={btn.whatsapp}>
              <ChatIcon size={20} /> Join on WhatsApp
            </a>
          </div>
        </section>
      )}
    </>
  );
}
