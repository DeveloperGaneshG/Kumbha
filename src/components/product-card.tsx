import Link from "next/link";
import type { ProductView } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { MODES } from "@/lib/selling-modes";

export function ProductCard({ p }: { p: ProductView }) {
  const from = Math.min(...p.variants.map((v) => v.price));
  const primary = p.sellingModes[0];
  const isBuild = p.category.storefront === "BUILD";
  return (
    <Link
      href={`/p/${p.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-clay-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className={`flex aspect-[4/3] items-center justify-center text-6xl ${isBuild ? "bg-slate-100" : "bg-clay-100"}`}>
        {p.images[0] ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded URLs from any host
          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
        ) : (
          <span className="transition group-hover:scale-110">{p.category.emoji}</span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-xs uppercase tracking-wide text-clay-500">{p.category.name}</p>
        <h3 className="text-lg leading-tight text-clay-900">{p.name}</h3>
        {p.nameTe && <p className="text-sm text-clay-600">{p.nameTe}</p>}
        <div className="mt-auto flex items-end justify-between pt-3">
          <p className="font-semibold text-clay-900">
            {primary === "CATALOG_ONLY" ? "In store" : <>from {formatINR(from)}</>}
            <span className="text-xs font-normal text-clay-600"> / {p.unit}</span>
          </p>
          {primary && <span className="rounded-full bg-clay-100 px-2 py-0.5 text-xs text-clay-700">{MODES[primary].label}</span>}
        </div>
      </div>
    </Link>
  );
}
