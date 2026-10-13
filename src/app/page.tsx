import Link from "next/link";
import { allProducts, featuredProducts, fromPrice, listBundles, listCategories, newArrivals, topDeals } from "@/lib/catalog";
import { CategoryHero } from "@/components/heroes/category-hero";
import { HeroShowcase, type ShowcaseTab } from "@/components/heroes/showcase";
import { listProducts } from "@/lib/catalog";
import { CraftMap, Lookbook, OccasionStrip } from "@/components/stories";
import { BeforeAfter } from "@/components/before-after";
import { LogoMark } from "@/components/logo";
import { BundleCard, Faq, OrderByBanner, Testimonials, TrustStats } from "@/components/sections";
import { store } from "@/config/store";
import { ProductGrid, ProductRow } from "@/components/product-card";
import { ProductImage } from "@/components/product-image";
import { RecentlyViewed } from "@/components/recently-viewed";
import { SectionHeader, btn } from "@/components/ui";
import { HandIcon, ShieldIcon, ReceiptIcon, ChatIcon } from "@/components/icons";
import { whatsappLink } from "@/components/whatsapp";

export const dynamic = "force-dynamic";

const PROMISE_ICONS = [HandIcon, ShieldIcon, ReceiptIcon, ChatIcon];

export default async function Home() {
  const [categories, featured, deals, fresh, all, bundles] = await Promise.all([
    listCategories(),
    featuredProducts(8),
    topDeals(8),
    newArrivals(4),
    allProducts(),
    listBundles(),
  ]);
  const top = categories.filter((c) => !c.parentSlug);
  const { campaign } = store;
  const idols = top.find((c) => c.slug === "idols");
  const build = top.find((c) => c.storefront === "BUILD");
  // Homepage banner: each category's own interactive banner, current festival first
  const HINTS: Record<string, string> = { wheel: "Spin the wheel", diya: "Light the diya", "idol-size": "Pick a size", lacquer: "Natural colours", "brick-wall": "Build a wall" };
  const heroCats = top
    .filter((c) => c.rules.hero)
    .sort((a, b) => Number(b.slug === campaign.categorySlug) - Number(a.slug === campaign.categorySlug));
  const heroProducts = await Promise.all(heroCats.map((c) => listProducts(c.slug)));
  const showcase: ShowcaseTab[] = heroCats.map((c, i) => ({
    key: c.slug,
    label: c.shortName,
    hint: HINTS[c.rules.hero!.style] ?? "",
    panel: <CategoryHero category={c} products={heroProducts[i]} variant="home" />,
  }));

  return (
    <>
      {/* Hero: every craft's own interactive banner, with tabs */}
      <section className="mx-auto max-w-7xl px-4 pt-5" aria-label="Our crafts">
        <HeroShowcase tabs={showcase} />
      </section>

      <section className="mx-auto mt-4 max-w-7xl px-4">
        <OrderByBanner />
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

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionHeader title="Shop by occasion" href="/gifts" linkLabel="Gift finder" />
        <OccasionStrip />
      </section>

      {deals.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <SectionHeader title="Festive deals" href={`/c/${campaign.categorySlug}`} />
          <ProductRow products={deals.slice(0, 4)} />
        </section>
      )}

      {bundles.length > 0 && (
        <section className="mx-auto mt-16 max-w-7xl px-4">
          <SectionHeader title="Combos that save more" href="/combos" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {bundles.slice(0, 3).map((b) => (
              <BundleCard key={b.slug} b={b} />
            ))}
          </div>
        </section>
      )}

      {/* Before / after: why clay */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="mb-5 max-w-2xl">
          <h2 className="text-2xl font-bold md:text-[1.75rem]">Swap plastic for clay, one pot at a time</h2>
          <p className="mt-1 text-muted">Drag the slider. Clay keeps water cool without electricity, cooks slowly and evenly, and goes back to the earth when it&apos;s done.</p>
        </div>
        <BeforeAfter
          before="https://images.unsplash.com/photo-1776535240825-ea0ad5dd10b9"
          after="https://images.unsplash.com/photo-1790173907491-9246272c776d"
          beforeLabel="Plastic & steel"
          afterLabel="Clay kitchen"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/combos" className={btn.primary}>
            Start with the Clay Kitchen Starter Set
          </Link>
          <Link href="/c/clay-pots" className={btn.secondary}>
            Browse clay pots
          </Link>
        </div>
      </section>

      {/* Gift finder */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionHeader title="Find a gift" href="/gifts" linkLabel="All gifts" />
        <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl bg-surface p-6">
            <p className="font-semibold">By budget</p>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {store.giftBudgets.map((b) => (
                <li key={b.label}>
                  <Link
                    href={`/gifts?${new URLSearchParams(Object.entries({ min: b.min, max: b.max }).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString()}`}
                    className="flex h-full items-center justify-center rounded-xl border border-line bg-white px-3 py-5 text-center font-bold transition-colors hover:border-ink"
                  >
                    {b.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {store.giftRecipients.map((r) => (
              <li key={r.tag}>
                <Link
                  href={r.tag === "corporate" ? "/gifts?for=corporate" : `/gifts?for=${r.tag}`}
                  className="flex h-full flex-col justify-end rounded-2xl bg-brand-soft p-5 transition-colors hover:bg-brand hover:text-white"
                >
                  <span className="text-lg font-bold">{r.label}</span>
                  <span className="mt-1 text-sm opacity-80">{r.body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

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
        <TrustStats />
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

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <CraftMap />
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <Lookbook hashtag={`#My${store.name}Home`} />
      </section>

      {/* Greeting card maker promo */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <Link href="/greetings" className="group grid items-center gap-6 overflow-hidden rounded-2xl bg-ink p-8 text-white md:grid-cols-[auto_1fr_auto] md:p-10">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10">
            <LogoMark size={56} cutColor="#17181c" className="text-white" />
          </span>
          <span>
            <span className="block text-2xl font-bold">Make a free {store.campaign.name} greeting card</span>
            <span className="mt-1 block text-white/75">Add names and a message in Telugu or English, then share it on WhatsApp in seconds.</span>
          </span>
          <span className={`${btn.onDark} group-hover:bg-accent`}>Make my card</span>
        </Link>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionHeader title="What customers say" />
        <Testimonials />
      </section>

      <section className="mx-auto mt-16 max-w-3xl px-4">
        <Faq items={store.faqs} />
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
