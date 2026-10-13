# Architecture

## One engine, configurable categories

```
                ┌──────────────────────────── Category (data) ───────────────────────────┐
                │ attributeSchema        sellingModes                rules               │
                │ [deity, heightFt, …]   [PRE_BOOK, QUOTE, …]        {fragile, advance%,  │
                │                                                     leadTime, badges…}  │
                └─────────┬──────────────────────┬───────────────────────────┬───────────┘
                          │                      │                           │
         ┌────────────────▼───────┐  ┌───────────▼───────────┐  ┌────────────▼────────────┐
         │ category-template.ts   │  │ selling-modes.ts      │  │ pricing.ts / delivery.ts│
         │ → filters, spec table, │  │ → buy box, cart       │  │ → tiers, GST, packaging,│
         │   Zod validation       │  │   grouping, checkout  │  │   advance, distance fee │
         └────────────────────────┘  └───────────────────────┘  └─────────────────────────┘
```

Pages never branch on a category's slug. They read the category's template, modes and rules. That's what lets a new category ship with zero code.

## Adding a category

1. Add an entry in `src/catalog/presets.ts`:

```ts
{
  slug: "brass-items",
  name: "Brass Puja Items",
  nameTe: "ఇత్తడి పూజా సామాగ్రి",
  description: "Lamps, kalash and puja thalis in pure brass.",
  storefront: "FESTIVE",
  sellingModes: ["SHIP_TO_HOME", "PICKUP"],
  emoji: "🪔",
  sortOrder: 7,
  rules: { unit: "piece", badges: ["Pure brass"] },
  attributeSchema: [
    { key: "type", label: "Type", type: "select", options: ["Lamp", "Kalash", "Thali"], required: true, filterable: true },
    { key: "weightG", label: "Weight", type: "number", unit: "g" },
  ],
}
```

2. Add products (`demo-products.ts`, or via the database/admin).
3. `npm run db:seed` — done. The nav, category page, filters, product page and quote form all pick it up.

A test (`engine.test.ts`) checks every product's attributes against its category template.

## Adding a selling mode

Add it to `SELLING_MODES` and `MODES` in `src/lib/selling-modes.ts`, then generate a migration (`npm run db:generate`) because it is a Postgres enum. Handle its CTA in `components/product-actions.tsx`.

## Money

All amounts are integers in **paise**. Prices are GST-inclusive (Indian retail norm); `gstComponent()` extracts tax for invoices.

## Two storefronts, one backend

`storefront: "FESTIVE" | "BUILD"` on a category decides presentation: the BUILD storefront (`/build`) uses a slate theme, quote-first flow and the material calculator. Later this can become a separate domain pointing at the same app.

## Data source

`src/lib/catalog.ts` is the only module pages use to read catalog data. It reads Postgres when `DATABASE_URL` is set and the demo catalog otherwise. When adding search (Meilisearch/Typesense) or caching, change it here.
