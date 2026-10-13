# Kumbha

A multi-category commerce platform for **handmade, festive and building products** — built so that every category (and every future one) runs on **one engine**.

| Category | How it sells |
|---|---|
| 🏺 Clay pots & terracotta | Ship to home · local delivery · bulk quote for nurseries |
| 🪔 Diwali & festive decor | Ship to home · local delivery · pickup |
| 🎆 Bhanasancha (crackers) | Catalogue + store pickup only (regulated — see below) |
| 🛕 Ganesh & Durga idols | Pre-book with advance · made to order · pandal quotes |
| 🪀 Etikoppaka wooden toys | Ship to home · personalised · return-gift bulk quotes |
| 🧱 Bricks & construction | Quote with distance-based delivery · material calculator |

## The core idea

Categories are **data, not code**. Each category is defined by three things:

1. **Attribute template** — the fields its products have (idol: deity, height, material; brick: grade, strength, per-trip load). The product spec table, category filters and server validation are generated from it.
2. **Selling modes** — *how* it's sold: `SHIP_TO_HOME`, `LOCAL_DELIVERY`, `PICKUP`, `PRE_BOOK`, `MADE_TO_ORDER`, `QUOTE`, `CATALOG_ONLY`. The buy box, cart and payment split adapt automatically.
3. **Rules** — fragile packaging, advance %, lead time, delivery radius, legal notices, badges, calculator, size visualiser, seasons.

**Adding a new category** (brass items, handloom, organic produce…) = add one entry to [`src/catalog/presets.ts`](src/catalog/presets.ts) (later: a form in the admin panel). No new pages, no migration. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Stack

- **Next.js 16** (App Router, React Server Components) + **TypeScript**
- **Tailwind CSS v4**
- **PostgreSQL** + **Drizzle ORM** (type-safe, no binary engines, serverless-friendly)
- **Zod** for validation (attribute templates compile to Zod schemas)
- **Vitest** for unit tests · GitHub Actions CI
- Planned: Razorpay (UPI/cards), WhatsApp Business API (Interakt / Meta Cloud API), Cloudinary/S3 images, Auth.js phone OTP

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000 — runs on the built-in demo catalog, no database needed
```

With a database:

```bash
cp .env.example .env   # sets DATABASE_URL
npm run db:up          # starts Postgres in Docker
npm run db:push        # creates tables from src/db/schema.ts
npm run db:seed        # loads categories, demo products, delivery rates
npm run dev
```

If `DATABASE_URL` is unset the site uses the demo catalog in `src/catalog/`; once set, everything reads from Postgres.

### Scripts

| Script | What it does |
|---|---|
| `npm run dev` / `build` / `start` | Next.js |
| `npm test` | Unit tests for pricing, delivery, calculator, templates |
| `npm run typecheck` / `lint` | TypeScript / ESLint |
| `npm run db:generate` / `db:migrate` | Create & apply SQL migrations (use instead of `db:push` in production) |
| `npm run db:studio` | Browse the database |

## Project layout

```
src/
  app/                    pages & API routes
    c/[slug]/             category page — filters generated from the template
    p/[slug]/             product page — buy box adapts to selling modes
    build/                construction storefront + calculator
    quote/                multi-item quote request (any QUOTE-enabled product)
    cart/                 cart grouped by selling mode
    api/quotes, api/catalog
  catalog/
    presets.ts            ← category definitions (edit here to add categories)
    demo-products.ts      demo catalog + delivery rates
  components/             product card, buy box, calculator, size visualiser, cart
  db/                     Drizzle schema, client, seed
  lib/
    selling-modes.ts      mode registry
    category-template.ts  attribute templates → Zod validators, spec rows
    pricing.ts            bulk tiers, GST, packaging, advance split
    delivery.ts           distance + delivery bands
    calculators/          brick / cement / sand estimator
    seasons.ts            festival calendar for homepage
    catalog.ts            repository (DB or demo)
```

## ⚠️ Crackers (bhanasancha)

Online sale of firecrackers is restricted in India (Supreme Court orders since 2018, plus state rules; only certified green crackers in many areas), and sellers need a PESO licence. The `crackers` category is therefore set to `CATALOG_ONLY` + `PICKUP`, and a test enforces that it can never be shipped. **Check the current rules with a lawyer / your licensing office before changing this.**

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md).
