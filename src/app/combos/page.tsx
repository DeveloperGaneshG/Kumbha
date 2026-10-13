import type { Metadata } from "next";
import { listBundles } from "@/lib/catalog";
import { BundleCard, OrderByBanner } from "@/components/sections";
import { Breadcrumbs } from "@/components/ui";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Combos", description: "Handmade sets at a combo price — Diwali puja, clay kitchen and Etikoppaka gift boxes." };

export default async function CombosPage() {
  const bundles = await listBundles();
  const maxSave = Math.max(0, ...bundles.map((b) => b.mrp - b.price));
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Combos" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Combos</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Sets we&apos;ve put together so you don&apos;t have to — each one costs less than buying the items separately
        {maxSave > 0 && `, saving up to ${formatINR(maxSave)}`}.
      </p>
      <div className="mt-6">
        <OrderByBanner />
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {bundles.map((b) => (
          <BundleCard key={b.slug} b={b} />
        ))}
      </div>
    </div>
  );
}
