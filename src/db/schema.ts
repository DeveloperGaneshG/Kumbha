/**
 * Kumbha data model (Drizzle ORM / PostgreSQL)
 *
 * Design rule: categories are DATA, not code. A new category (brass items,
 * handloom, organic produce ...) is a new `categories` row with its own
 * attributeSchema, sellingModes and rules — no migration, no new module.
 */
import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  doublePrecision,
  primaryKey,
  uniqueIndex,
  index,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { AttributeField, CategoryRules } from "@/lib/category-template";
import { SELLING_MODES } from "@/lib/selling-modes";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

// ── Enums ───────────────────────────────────────────────────────────────────

export const sellingMode = pgEnum("selling_mode", SELLING_MODES);
export const storefront = pgEnum("storefront", ["FESTIVE", "BUILD"]);
export const orderStatus = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "IN_PRODUCTION",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);
export const quoteStatus = pgEnum("quote_status", ["NEW", "QUOTED", "ACCEPTED", "REJECTED", "EXPIRED"]);

// ── Catalog ─────────────────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  nameTe: text("name_te"),
  description: text("description"),
  imageUrl: text("image_url"),
  storefront: storefront("storefront").default("FESTIVE").notNull(),
  parentId: text("parent_id").references((): AnyPgColumn => categories.id),
  /** Field definitions every product in this category fills in */
  attributeSchema: jsonb("attribute_schema").$type<AttributeField[]>().default([]).notNull(),
  sellingModes: sellingMode("selling_modes").array().notNull(),
  rules: jsonb("rules").$type<CategoryRules>().default({}).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ...timestamps,
});

export const artisans = pgTable("artisans", {
  id: id(),
  name: text("name").notNull(),
  village: text("village"),
  craft: text("craft"),
  story: text("story"),
  photoUrl: text("photo_url"),
  createdAt: timestamps.createdAt,
});

export const products = pgTable(
  "products",
  {
    id: id(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    nameTe: text("name_te"),
    description: text("description"),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    /** Values for the category's attributeSchema — validated on write */
    attributes: jsonb("attributes").$type<Record<string, unknown>>().default({}).notNull(),
    /** Empty = inherit all of the category's selling modes */
    sellingModes: sellingMode("selling_modes").array().default([]).notNull(),
    images: text("images").array().default([]).notNull(),
    /** All money is stored in paise */
    basePrice: integer("base_price").notNull(),
    unit: text("unit").default("piece").notNull(),
    weightGrams: integer("weight_grams"),
    hsnCode: text("hsn_code"),
    gstRate: integer("gst_rate").default(18).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),
    artisanId: text("artisan_id").references(() => artisans.id),
    ...timestamps,
  },
  (t) => [index("products_category_idx").on(t.categoryId)],
);

export const productVariants = pgTable("product_variants", {
  id: id(),
  productId: text("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  options: jsonb("options").$type<Record<string, string>>().default({}).notNull(),
  price: integer("price").notNull(),
  stock: integer("stock").default(0).notNull(),
  /** PRE_BOOK / MADE_TO_ORDER: units we can produce this season */
  capacity: integer("capacity"),
});

/** Bulk pricing: buy ≥ minQty → pay unitPrice */
export const priceTiers = pgTable(
  "price_tiers",
  {
    id: id(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    minQty: integer("min_qty").notNull(),
    unitPrice: integer("unit_price").notNull(),
  },
  (t) => [uniqueIndex("price_tiers_product_qty").on(t.productId, t.minQty)],
);

// ── Seasons & campaigns ─────────────────────────────────────────────────────

export const campaigns = pgTable("campaigns", {
  id: id(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  bannerUrl: text("banner_url"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  /** Pre-booking opens before the festival (idols ~6 weeks ahead) */
  bookingOpens: timestamp("booking_opens", { withTimezone: true }),
});

export const campaignProducts = pgTable(
  "campaign_products",
  {
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    discountPc: integer("discount_pc").default(0).notNull(),
  },
  (t) => [primaryKey({ columns: [t.campaignId, t.productId] })],
);

// ── Customers ───────────────────────────────────────────────────────────────

export const customers = pgTable("customers", {
  id: id(),
  /** Primary identity — OTP / WhatsApp login */
  phone: text("phone").notNull().unique(),
  name: text("name"),
  email: text("email"),
  gstin: text("gstin"),
  isBusiness: boolean("is_business").default(false).notNull(),
  creditLimit: integer("credit_limit").default(0).notNull(),
  createdAt: timestamps.createdAt,
});

export const addresses = pgTable("addresses", {
  id: id(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  label: text("label"),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
});

// ── Quotes, orders & bookings ───────────────────────────────────────────────

export type QuoteLine = { productId: string; quantity: number; unit: string };

export const quoteRequests = pgTable("quote_requests", {
  id: id(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  lines: jsonb("lines").$type<QuoteLine[]>().notNull(),
  siteAddress: text("site_address").notNull(),
  siteLat: doublePrecision("site_lat"),
  siteLng: doublePrecision("site_lng"),
  distanceKm: doublePrecision("distance_km"),
  neededBy: timestamp("needed_by", { withTimezone: true }),
  status: quoteStatus("status").default("NEW").notNull(),
  quotedAmount: integer("quoted_amount"),
  validUntil: timestamp("valid_until", { withTimezone: true }),
  notes: text("notes"),
  ...timestamps,
});

export const orders = pgTable(
  "orders",
  {
    id: id(),
    number: text("number").notNull().unique(),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    addressId: text("address_id").references(() => addresses.id),
    mode: sellingMode("mode").notNull(),
    status: orderStatus("status").default("PENDING_PAYMENT").notNull(),
    subtotal: integer("subtotal").notNull(),
    deliveryFee: integer("delivery_fee").default(0).notNull(),
    packagingFee: integer("packaging_fee").default(0).notNull(),
    taxTotal: integer("tax_total").default(0).notNull(),
    total: integer("total").notNull(),
    /** Amount due now — advance for PRE_BOOK, full otherwise */
    payNow: integer("pay_now").notNull(),
    amountPaid: integer("amount_paid").default(0).notNull(),
    /** Booking / pickup / delivery date */
    scheduledFor: timestamp("scheduled_for", { withTimezone: true }),
    slot: text("slot"),
    notes: text("notes"),
    quoteId: text("quote_id")
      .unique()
      .references(() => quoteRequests.id),
    ...timestamps,
  },
  (t) => [index("orders_status_idx").on(t.status), index("orders_scheduled_idx").on(t.scheduledFor)],
);

export const orderItems = pgTable("order_items", {
  id: id(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  variantId: text("variant_id")
    .notNull()
    .references(() => productVariants.id),
  quantity: integer("quantity").notNull(),
  unitPrice: integer("unit_price").notNull(),
  /** MADE_TO_ORDER details (name, colour, size notes ...) */
  customization: jsonb("customization").$type<Record<string, string>>(),
});

// ── Delivery ────────────────────────────────────────────────────────────────

/** Distance-band pricing for heavy goods (tractor / truck loads) */
export const deliveryRates = pgTable("delivery_rates", {
  id: id(),
  storefront: storefront("storefront").notNull(),
  vehicle: text("vehicle").notNull(),
  maxKm: doublePrecision("max_km").notNull(),
  baseFee: integer("base_fee").notNull(),
  perKmFee: integer("per_km_fee").notNull(),
  freeKm: doublePrecision("free_km").default(0).notNull(),
  capacity: text("capacity"),
});

// ── Relations ───────────────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id], relationName: "tree" }),
  children: many(categories, { relationName: "tree" }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  artisan: one(artisans, { fields: [products.artisanId], references: [artisans.id] }),
  variants: many(productVariants),
  priceTiers: many(priceTiers),
}));

export const variantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, { fields: [productVariants.productId], references: [products.id] }),
}));

export const priceTiersRelations = relations(priceTiers, ({ one }) => ({
  product: one(products, { fields: [priceTiers.productId], references: [products.id] }),
}));

export const artisansRelations = relations(artisans, ({ many }) => ({ products: many(products) }));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, { fields: [orders.customerId], references: [customers.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  variant: one(productVariants, { fields: [orderItems.variantId], references: [productVariants.id] }),
}));

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
