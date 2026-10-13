import Link from "next/link";
import { store } from "@/config/store";
import { formatINR } from "@/lib/money";
import { orderByNotice } from "@/lib/campaign";
import type { BundleView } from "@/lib/catalog";
import { ProductImage } from "./product-image";
import { AddBundleButton } from "./add-bundle-button";
import { TruckIcon } from "./icons";
import { Stars } from "./ui";

export function Faq({ items, title = "Frequently asked questions" }: { items: { q: string; a: string }[]; title?: string }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {items.map((f) => (
          <details key={f.q} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
              {f.q}
              <span aria-hidden className="text-xl text-muted transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-2 max-w-prose text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Festival delivery cut-off. Renders nothing after the date. */
export function OrderByBanner({ compact = false }: { compact?: boolean }) {
  const n = orderByNotice();
  if (!n) return null;
  if (compact) {
    return (
      <p className="flex items-center gap-2 text-sm font-semibold text-brand">
        <TruckIcon size={18} /> {n.text}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-soft px-5 py-4">
      <p className="flex items-center gap-3 font-semibold text-brand">
        <TruckIcon size={22} />
        {n.text}
      </p>
      <p className="text-sm text-muted">
        {n.daysLeft <= 1 ? "Last day to order" : `${n.daysLeft} days left`} · Free local delivery above {formatINR(store.freeShippingAbove)}
      </p>
    </div>
  );
}

export function TrustStats() {
  return (
    <dl className="grid grid-cols-2 gap-y-6 rounded-2xl bg-ink px-6 py-8 text-white md:grid-cols-4">
      {store.stats.map((s) => (
        <div key={s.label} className="text-center">
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="block text-3xl font-extrabold md:text-4xl">{s.value}</span>
            <span className="mt-1 block text-sm text-white/70">{s.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Testimonials() {
  return (
    <div className="scroller -mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:px-0">
      {store.testimonials.map((t) => (
        <figure key={t.name} className="flex w-[80%] shrink-0 flex-col rounded-2xl border border-line p-6 sm:w-[45%] lg:w-auto">
          <Stars rating={5} />
          <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">“{t.body}”</blockquote>
          <figcaption className="mt-4 text-sm">
            <span className="font-semibold">{t.name}</span>
            <span className="text-muted">, {t.city}</span>
            <span className="block text-muted">Bought: {t.product}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function BundleCard({ b }: { b: BundleView }) {
  const save = b.mrp - b.price;
  const pct = Math.round((save / b.mrp) * 100);
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-line">
      <div className="relative">
        <ProductImage src={b.image} alt={b.name} width={800} fallbackIcon="🎁" className="aspect-[16/10] w-full" />
        {save > 0 && <span className="absolute left-3 top-3 rounded-md bg-sale px-2 py-1 text-xs font-bold text-white">Save {formatINR(save)}</span>}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold">{b.name}</h3>
        <p className="mt-1 text-sm text-muted">{b.description}</p>
        <ul className="mt-4 space-y-2">
          {b.items.map((i) => (
            <li key={i.sku} className="flex items-center gap-3 text-sm">
              <ProductImage src={i.product.images[0]} alt="" width={120} fallbackIcon={i.product.category.emoji} className="h-10 w-10 shrink-0 rounded-md text-lg" />
              <Link href={`/p/${i.product.slug}`} className="min-w-0 flex-1 truncate hover:underline">
                {i.qty > 1 && `${i.qty} × `}
                {i.product.name} <span className="text-muted">· {i.variantName}</span>
              </Link>
              <span className="text-muted line-through">{formatINR(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold">{formatINR(b.price)}</span>
            <span className="text-faint line-through">{formatINR(b.mrp)}</span>
            {pct > 0 && <span className="text-sm font-semibold text-sale">{pct}% off</span>}
          </p>
          <AddBundleButton slug={b.slug} name={b.name} price={b.price} image={b.image} summary={b.items.map((i) => i.product.name).join(" + ")} />
        </div>
      </div>
    </article>
  );
}
