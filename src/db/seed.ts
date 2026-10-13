/**
 * Seeds categories, demo products, artisans and delivery rates.
 * Run: npm run db:push && npm run db:seed   (safe to re-run — upserts by slug/sku)
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import { db } from "./index";
import { artisans, categories, deliveryRates, priceTiers, products, productVariants, reviews } from "./schema";
import { CATEGORY_PRESETS } from "@/catalog/presets";
import { DEMO_PRODUCTS, DEMO_DELIVERY_RATES } from "@/catalog/demo-products";
import { buildAttributeValidator } from "@/lib/category-template";

async function main() {
  const categoryIds = new Map<string, string>();

  // Parents first so children can reference them
  const ordered = [...CATEGORY_PRESETS].sort((a, b) => Number(Boolean(a.parentSlug)) - Number(Boolean(b.parentSlug)));
  for (const c of ordered) {
    const values = {
      slug: c.slug,
      name: c.name,
      nameTe: c.nameTe,
      description: c.description,
      imageUrl: c.image,
      storefront: c.storefront,
      parentId: c.parentSlug ? categoryIds.get(c.parentSlug) : null,
      attributeSchema: c.attributeSchema,
      sellingModes: c.sellingModes,
      rules: c.rules,
      sortOrder: c.sortOrder,
    };
    const [row] = await db
      .insert(categories)
      .values(values)
      .onConflictDoUpdate({ target: categories.slug, set: values })
      .returning({ id: categories.id });
    categoryIds.set(c.slug, row.id);
  }
  console.log(`✓ ${categoryIds.size} categories`);

  for (const p of DEMO_PRODUCTS) {
    const preset = CATEGORY_PRESETS.find((c) => c.slug === p.categorySlug)!;
    // Same validation the admin form will use
    const attributes = buildAttributeValidator(preset.attributeSchema).parse(p.attributes);

    let artisanId: string | null = null;
    if (p.artisan) {
      const existing = await db.query.artisans.findFirst({ where: eq(artisans.name, p.artisan.name) });
      artisanId = existing?.id ?? (await db.insert(artisans).values(p.artisan).returning({ id: artisans.id }))[0].id;
    }

    const values = {
      slug: p.slug,
      name: p.name,
      nameTe: p.nameTe,
      description: p.description,
      categoryId: categoryIds.get(p.categorySlug)!,
      attributes,
      sellingModes: p.sellingModes ?? [],
      images: p.images,
      highlights: p.highlights ?? [],
      ratingAvg: p.rating ?? 0,
      ratingCount: p.reviewCount ?? 0,
      isNew: Boolean(p.isNew),
      basePrice: p.basePrice,
      unit: p.unit ?? preset.rules.unit ?? "piece",
      gstRate: p.gstRate,
      isFeatured: Boolean(p.isFeatured),
      artisanId,
    };
    const [prod] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.slug, set: values })
      .returning({ id: products.id });

    for (const v of p.variants) {
      const vv = { ...v, productId: prod.id };
      await db.insert(productVariants).values(vv).onConflictDoUpdate({ target: productVariants.sku, set: vv });
    }
    await db.delete(reviews).where(eq(reviews.productId, prod.id));
    if (p.reviews?.length)
      await db.insert(reviews).values(p.reviews.map(({ date, ...r }) => ({ ...r, productId: prod.id, createdAt: new Date(date) })));
    await db.delete(priceTiers).where(eq(priceTiers.productId, prod.id));
    if (p.priceTiers?.length) await db.insert(priceTiers).values(p.priceTiers.map((t) => ({ ...t, productId: prod.id })));
  }
  console.log(`✓ ${DEMO_PRODUCTS.length} products`);

  await db.delete(deliveryRates);
  await db.insert(deliveryRates).values(DEMO_DELIVERY_RATES);
  console.log(`✓ ${DEMO_DELIVERY_RATES.length} delivery rates`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
