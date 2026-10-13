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
  storefront: "FESTIVE" | "BUILD";
  parentSlug: string | null;
  sellingModes: SellingMode[];
  attributeSchema: AttributeField[];
  rules: CategoryRules;
  emoji: string;
};

export type ProductView = {
  slug: string;
  name: string;
  nameTe: string | null;
  description: string | null;
  category: CategoryView;
  attributes: Record<string, unknown>;
  /** Already resolved against the category */
  sellingModes: SellingMode[];
  images: string[];
  basePrice: number;
  unit: string;
  gstRate: number;
  isFeatured: boolean;
  variants: { sku: string; name: string; price: number; stock: number; capacity: number | null }[];
  priceTiers: PriceTier[];
  artisan: { name: string; village: string | null; craft: string | null; story: string | null } | null;
};

export type ProductFilters = Record<string, string | undefined>;

const hasDatabase = () => Boolean(process.env.DATABASE_URL);

// ── Demo source ─────────────────────────────────────────────────────────────

const demoCategories: CategoryView[] = CATEGORY_PRESETS.map((c) => ({
  slug: c.slug,
  name: c.name,
  nameTe: c.nameTe,
  description: c.description,
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
    category,
    attributes: p.attributes,
    sellingModes: effectiveModes(category.sellingModes, p.sellingModes ?? []),
    images: [],
    basePrice: p.basePrice,
    unit: p.unit ?? category.rules.unit ?? "piece",
    gstRate: p.gstRate,
    isFeatured: Boolean(p.isFeatured),
    variants: p.variants.map((v) => ({ sku: v.sku, name: v.name, price: v.price, stock: v.stock, capacity: v.capacity ?? null })),
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
    with: { category: true, variants: true, priceTiers: true, artisan: true },
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
        category,
        attributes: p.attributes,
        sellingModes: effectiveModes(category.sellingModes, p.sellingModes),
        images: p.images,
        basePrice: p.basePrice,
        unit: p.unit,
        gstRate: p.gstRate,
        isFeatured: p.isFeatured,
        variants: p.variants.map((v) => ({ sku: v.sku, name: v.name, price: v.price, stock: v.stock, capacity: v.capacity })),
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

async function allProducts() {
  return hasDatabase() ? dbProducts() : demoProducts;
}

/** Products in a category (and its sub-categories), filtered by attribute values. */
export async function listProducts(categorySlug: string, filters: ProductFilters = {}) {
  const cats = await listCategories();
  const slugs = new Set([categorySlug, ...cats.filter((c) => c.parentSlug === categorySlug).map((c) => c.slug)]);
  const active = Object.entries(filters).filter(([, v]) => v);
  return (await allProducts()).filter(
    (p) =>
      slugs.has(p.category.slug) &&
      active.every(([k, v]) => {
        const val = p.attributes[k];
        return Array.isArray(val) ? val.includes(v) : String(val) === v;
      }),
  );
}

export async function getProduct(slug: string) {
  return (await allProducts()).find((p) => p.slug === slug) ?? null;
}

export async function featuredProducts(limit = 8) {
  return (await allProducts()).filter((p) => p.isFeatured).slice(0, limit);
}

export async function searchProducts(q: string) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return (await allProducts()).filter((p) =>
    [p.name, p.nameTe, p.description, p.category.name].some((s) => s?.toLowerCase().includes(term)),
  );
}

export async function listDeliveryRates(storefront: "FESTIVE" | "BUILD"): Promise<DeliveryRate[]> {
  if (hasDatabase()) {
    const { db } = await import("@/db");
    return db.query.deliveryRates.findMany({ where: (r, { eq }) => eq(r.storefront, storefront) });
  }
  return DEMO_DELIVERY_RATES.filter((r) => r.storefront === storefront);
}
