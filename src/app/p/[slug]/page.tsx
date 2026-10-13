import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct } from "@/lib/catalog";
import { formatAttributes } from "@/lib/category-template";
import { ProductActions } from "@/components/product-actions";
import { SizeVisualizer } from "@/components/size-visualizer";
import { WallCalculator } from "@/components/wall-calculator";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  return p ? { title: p.name, description: p.description ?? undefined } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const { category: c } = p;
  const specs = formatAttributes(c.attributeSchema, p.attributes);
  const heightFt = typeof p.attributes.heightFt === "number" ? p.attributes.heightFt : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-clay-600">
        <Link href="/">Home</Link> / <Link href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`}>{c.name}</Link> / {p.name}
      </p>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <div className={`flex aspect-square items-center justify-center rounded-3xl text-[10rem] ${c.storefront === "BUILD" ? "bg-slate-100" : "bg-clay-100"}`}>
            {p.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded URLs from any host
              <img src={p.images[0]} alt={p.name} className="h-full w-full rounded-3xl object-cover" />
            ) : (
              c.emoji
            )}
          </div>
          {c.rules.showSizeVisualizer && heightFt && <SizeVisualizer heightFt={heightFt} emoji={c.emoji} />}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl leading-tight">{p.name}</h1>
            {p.nameTe && <p className="mt-1 text-xl text-clay-600">{p.nameTe}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {c.rules.badges?.map((b) => (
                <span key={b} className="rounded-full bg-leaf/10 px-3 py-1 text-xs text-leaf">
                  ✓ {b}
                </span>
              ))}
            </div>
            <p className="mt-4 text-clay-800">{p.description}</p>
          </div>

          {c.rules.legalNotice && <div className="rounded-xl border border-turmeric bg-turmeric/10 p-4 text-sm">⚠️ {c.rules.legalNotice}</div>}

          <ProductActions
            slug={p.slug}
            name={p.name}
            unit={p.unit}
            gstRate={p.gstRate}
            modes={p.sellingModes}
            rules={c.rules}
            tiers={p.priceTiers}
            variants={p.variants}
          />

          {specs.length > 0 && (
            <div>
              <h2 className="text-xl">Details</h2>
              <dl className="mt-3 divide-y divide-clay-200 rounded-xl border border-clay-200 bg-white">
                {specs.map((s) => (
                  <div key={s.key} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                    <dt className="text-clay-600">{s.label}</dt>
                    <dd className="text-right font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {p.artisan && (
            <div className="rounded-2xl bg-clay-100 p-5">
              <p className="text-xs uppercase tracking-wide text-clay-600">Meet the maker</p>
              <p className="mt-1 text-lg font-semibold">
                {p.artisan.name}
                {p.artisan.village && <span className="font-normal text-clay-600"> · {p.artisan.village}</span>}
              </p>
              <p className="mt-1 text-sm text-clay-800">{p.artisan.story}</p>
            </div>
          )}
        </div>
      </div>

      {c.rules.showCalculator && (
        <section className="mt-14">
          <WallCalculator />
        </section>
      )}
    </div>
  );
}
