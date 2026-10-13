import Link from "next/link";
import type { Metadata } from "next";
import { listCategories } from "@/lib/catalog";
import { ProductImage } from "@/components/product-image";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "All categories" };

export default async function CategoriesPage() {
  const cats = await listCategories();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">All categories</h1>
      <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cats.map((c) => (
          <li key={c.slug}>
            <Link href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`} className="group block">
              <ProductImage src={c.image} alt="" width={600} fallbackIcon={c.emoji} className="aspect-[4/3] w-full rounded-xl" />
              <p className="mt-2 font-semibold group-hover:underline">{c.name}</p>
              <p className="line-clamp-2 text-sm text-muted">{c.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
