import type { Metadata } from "next";
import { listCategories, listProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/product-card";
import { CategoryHero } from "@/components/heroes/category-hero";
import { btn } from "@/components/ui";
import { RequirementForm } from "@/components/requirement-form";
import { Faq } from "@/components/sections";
import { store } from "@/config/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bricks & Construction Materials" };

const QUALITY = [
  { title: "Tested to IS standards", body: "Strength and water absorption checked for every kiln batch." },
  { title: "Counted at loading", body: "Bricks counted in front of your site supervisor — no short loads." },
  { title: "On-time delivery", body: "Your date and slot confirmed the evening before." },
  { title: "GST invoice & credit", body: "Proper billing for every load; credit for regular contractors." },
];

const STEPS = [
  { title: "Tell us what you need", body: "Pick materials and quantities, or use the calculator below." },
  { title: "Get a price with transport", body: "We reply on WhatsApp with a quote including delivery to your site." },
  { title: "Delivered to your site", body: "Tractor or lorry delivery on your date, with a GST invoice." },
];

/** The construction storefront — same engine, contractor-focused presentation. */
export default async function BuildPage() {
  const cats = (await listCategories("BUILD")).filter((c) => !c.parentSlug);
  const products = (await Promise.all(cats.map((c) => listProducts(c.slug)))).flat();
  const cover = cats[0];

  return (
    <div className="pb-16 md:pb-0">
      <section className="mx-auto max-w-7xl px-4 pt-5">
        {cover ? (
          <CategoryHero category={cover} products={products} variant="page" />
        ) : null}
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4">
        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-bold text-white">{i + 1}</span>
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="products" className="mx-auto mt-14 max-w-7xl scroll-mt-36 px-4">
        <h2 className="mb-5 text-2xl font-bold">Materials</h2>
        <ProductGrid products={products} />
      </section>

      <section className="mx-auto mt-14 max-w-7xl px-4">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {QUALITY.map((q) => (
            <li key={q.title} className="bg-white p-6">
              <p className="font-semibold">{q.title}</p>
              <p className="mt-1 text-sm text-muted">{q.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-10 px-4 lg:grid-cols-[1.2fr_1fr]">
        <RequirementForm materials={products.map((p) => p.name)} phone={store.contact.phone} />
        {cover?.rules.faqs && <Faq items={cover.rules.faqs} />}
      </section>

      {/* Sticky action bar on phones, above the bottom navigation */}
      <div style={{ bottom: "calc(56px + env(safe-area-inset-bottom))" }} className="fixed inset-x-0 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] grid grid-cols-2 gap-2 border-t border-line bg-white p-2 md:hidden">
        <a href={`tel:${store.contact.phone.replace(/\s/g, "")}`} className={`${btn.secondary} py-2.5`}>
          Call us
        </a>
        <a href="#requirement" className={`${btn.primary} py-2.5`}>
          Share requirement
        </a>
      </div>
    </div>
  );
}
