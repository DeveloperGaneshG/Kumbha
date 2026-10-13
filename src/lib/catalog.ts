/**
 * Catalog repository — the single place the storefront reads products from.
 *
 * Uses PostgreSQL when DATABASE_URL is set, otherwise the built-in demo
 * catalog (so `npm run dev` works with zero setup). Pages never touch the
 * database directly; swap or extend the source here.
 */
import { CATEGORY_PRESETS } from "@/catalog/presets";
import { DEMO_PRODUCTS, DEMO_DELIVERY_RATES } from "@/catalog/demo-products";
import type { AttributeField, CategoryRules } from "./category-template";
import { effectiveModes, type SellingMode } from "./selling-modes";
import type { PriceTier } from "./pricing";
import type { DeliveryRate } from "./delivery";

export type CategoryView = {
  slug: string;
  name: string;
  nameTe: string | null;
  description: string | null;
  image: string | null;
  storefront: "FESTIVE" | "BUILD";
  parentSlug: string | null;
  sellingModes: SellingMode[];
  attributeSchema: AttributeField[];
  rules: CategoryRules;
  emoji: string;
};

export type VariantView = { sku: string; name: string; price: number; mrp: number | null; stock: number; capacity: number | null };

export type ReviewView = { name: string; city: string | null; rating: number; title: string | null; body: string | null; date: string; verified: boolean };

export type ProductView = {
  slug: string;
  name: string;
  nameTe: string | null;
  description: string | null;
  highlights: string[];
  category: CategoryView;
  attributes: Record<string, unknown>;
  /** Already resolved against the category */
  sellingModes: SellingMode[];
  images: string[];
  basePrice: number;
  unit: string;
  gstRate: number;
  isFeatured: boolean;
  isNew: boolean;
  rating: number;
  reviewCount: number;
  reviews: ReviewView[];
  variants: VariantView[];
  priceTiers: PriceTier[];
  artisan: { name: string; village: string | null; craft: string | null; story: string | null } | null;
};

export { SORT_OPTIONS, type SortKey } from "./sort";
import type { SortKey } from "./sort";

export type ProductQuery = {
  filters?: Record<string, string | undefined>;
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
};

const hasDatabase = () => Boolean(process.env.DATABASE_URL);

/** Lowest variant price — what "from ₹…" shows */
export const fromPrice = (p: ProductView) => Math.min(...p.variants.map((v) => v.price));
/** Variant with the biggest saving, for the card's discount badge */
export function bestDiscount(p: ProductView) {
  let best: { pct: number; price: number; mrp: number } | null = null;
  for (const v of p.variants) {
    if (v.mrp && v.mrp > v.price) {
      const pct = Math.round(((v.mrp - v.price) / v.mrp) * 100);
      if (!best || pct > best.pct) best = { pct, price: v.price, mrp: v.mrp };
    }
  }
  return best;
}

// ── Demo source ─────────────────────────────────────────────────────────────

const demoCategories: CategoryView[] = CATEGORY_PRESETS.map((c) => ({
  slug: c.slug,
  name: c.name,
  nameTe: c.nameTe,
  description: c.description,
  image: c.image,
  storefront: c.storefront,
  parentSlug: c.parentSlug ?? null,
  sellingModes: c.sellingModes,
  attributeSchema: c.attributeSchema,
  rules: c.rules,
  emoji: c.emoji,
}));

const demoProducts: ProductView[] = DEMO_PRODUCTS.map((p) => {
  const category = demoCategories.find((c) => c.slug === p.categorySlug);
  if (!category) throw new Error(`Demo product ${p.slug} has unknown category ${p.categorySlug}`);
  return {
    slug: p.slug,
    name: p.name,
    nameTe: p.nameTe ?? null,
    description: p.description,
    highlights: p.highlights ?? [],
    category,
    attributes: p.attributes,
    sellingModes: effectiveModes(category.sellingModes, p.sellingModes ?? []),
    images: p.images,
    basePrice: p.basePrice,
    unit: p.unit ?? category.rules.unit ?? "piece",
    gstRate: p.gstRate,
    isFeatured: Boolean(p.isFeatured),
    isNew: Boolean(p.isNew),
    rating: p.rating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    reviews: p.reviews ?? [],
    variants: p.variants.map((v) => ({ sku: v.sku, name: v.name, price: v.price, mrp: v.mrp ?? null, stock: v.stock, capacity: v.capacity ?? null })),
    priceTiers: p.priceTiers ?? [],
    artisan: p.artisan ?? null,
  };
});

// ── DB source ───────────────────────────────────────────────────────────────

async function dbCategories(): Promise<CategoryView[]> {
  const { db } = await import("@/db");
  const rows = await db.query.categories.findMany({
    where: (c, { eq }) => eq(c.isActive, true),
    orderBy: (c, { asc }) => asc(c.sortOrder),
    with: { parent: true },
  });
  return rows.map((c) => ({
    slug: c.slug,
    name: c.name,
    nameTe: c.nameTe,
    description: c.description,
    image: c.imageUrl,
    storefront: c.storefront,
    parentSlug: c.parent?.slug ?? null,
    sellingModes: c.sellingModes,
    attributeSchema: c.attributeSchema,
    rules: c.rules,
    emoji: CATEGORY_PRESETS.find((p) => p.slug === c.slug)?.emoji ?? "🛍️",
  }));
}

async function dbProducts(): Promise<ProductView[]> {
  const { db } = await import("@/db");
  const categories = await dbCategories();
  const rows = await db.query.products.findMany({
    where: (p, { eq }) => eq(p.isActive, true),
    with: {
      category: true,
      variants: true,
      priceTiers: true,
      artisan: true,
      reviews: { where: (r, { eq }) => eq(r.isPublished, true), orderBy: (r, { desc }) => desc(r.createdAt), limit: 20 },
    },
  });
  return rows.flatMap((p) => {
    const category = categories.find((c) => c.slug === p.category.slug);
    if (!category) return [];
    return [
      {
        slug: p.slug,
        name: p.name,
        nameTe: p.nameTe,
        description: p.description,
        highlights: p.highlights,
        category,
        attributes: p.attributes,
        sellingModes: effectiveModes(category.sellingModes, p.sellingModes),
        images: p.images,
        basePrice: p.basePrice,
        unit: p.unit,
        gstRate: p.gstRate,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        rating: p.ratingAvg,
        reviewCount: p.ratingCount,
        reviews: p.reviews.map((r) => ({
          name: r.name,
          city: r.city,
          rating: r.rating,
          title: r.title,
          body: r.body,
          date: r.createdAt.toISOString().slice(0, 10),
          verified: r.verified,
        })),
        variants: p.variants.map((v) => ({ sku: v.sku, name: v.name, price: v.price, mrp: v.mrp, stock: v.stock, capacity: v.capacity })),
        priceTiers: p.priceTiers.map((t) => ({ minQty: t.minQty, unitPrice: t.unitPrice })),
        artisan: p.artisan,
      },
    ];
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

export async function listCategories(storefront?: "FESTIVE" | "BUILD") {
  const all = hasDatabase() ? await dbCategories() : demoCategories;
  return storefront ? all.filter((c) => c.storefront === storefront) : all;
}

export async function getCategory(slug: string) {
  return (await listCategories()).find((c) => c.slug === slug) ?? null;
}

export async function allProducts() {
  return hasDatabase() ? dbProducts() : demoProducts;
}

function sortProducts(list: ProductView[], sort: SortKey = "popular") {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => fromPrice(a) - fromPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => fromPrice(b) - fromPrice(a));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "new":
      return sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount);
  }
}

/** Products in a category (and its sub-categories), filtered and sorted. */
export async function listProducts(categorySlug: string, query: ProductQuery = {}) {
  const { filters = {}, sort, minPrice, maxPrice } = query;
  const cats = await listCategories();
  const slugs = new Set([categorySlug, ...cats.filter((c) => c.parentSlug === categorySlug).map((c) => c.slug)]);
  const active = Object.entries(filters).filter(([, v]) => v);
  const matched = (await allProducts()).filter(
    (p) =>
      slugs.has(p.category.slug) &&
      (minPrice === undefined || fromPrice(p) >= minPrice) &&
      (maxPrice === undefined || fromPrice(p) <= maxPrice) &&
      active.every(([k, v]) => {
        const val = p.attributes[k];
        return Array.isArray(val) ? val.includes(v) : String(val) === v;
      }),
  );
  return sortProducts(matched, sort);
}

export async function getProduct(slug: string) {
  return (await allProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getProducts(slugs: string[]) {
  const all = await allProducts();
  return slugs.map((s) => all.find((p) => p.slug === s)).filter((p): p is ProductView => Boolean(p));
}

export async function featuredProducts(limit = 8) {
  return sortProducts((await allProducts()).filter((p) => p.isFeatured)).slice(0, limit);
}

export async function newArrivals(limit = 8) {
  return (await allProducts()).filter((p) => p.isNew).slice(0, limit);
}

export async function topDeals(limit = 8) {
  return (await allProducts())
    .filter((p) => bestDiscount(p) && !p.sellingModes.includes("CATALOG_ONLY"))
    .sort((a, b) => (bestDiscount(b)?.pct ?? 0) - (bestDiscount(a)?.pct ?? 0))
    .slice(0, limit);
}

/** Same category first, then same storefront. */
export async function relatedProducts(p: ProductView, limit = 4) {
  const all = (await allProducts()).filter((x) => x.slug !== p.slug);
  const same = all.filter((x) => x.category.slug === p.category.slug);
  const near = all.filter((x) => x.category.slug !== p.category.slug && x.category.storefront === p.category.storefront);
  return [...same, ...near].slice(0, limit);
}

export async function searchProducts(q: string, sort?: SortKey) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  const hits = (await allProducts()).filter((p) =>
    [p.name, p.nameTe, p.description, p.category.name, ...Object.values(p.attributes).map(String)].some((s) => s?.toLowerCase().includes(term)),
  );
  return sortProducts(hits, sort);
}

export async function listDeliveryRates(storefront: "FESTIVE" | "BUILD"): Promise<DeliveryRate[]> {
  if (hasDatabase()) {
    const { db } = await import("@/db");
    return db.query.deliveryRates.findMany({ where: (r, { eq }) => eq(r.storefront, storefront) });
  }
  return DEMO_DELIVERY_RATES.filter((r) => r.storefront === storefront);
}
