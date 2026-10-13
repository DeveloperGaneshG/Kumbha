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

## Rebrand it in one file

Everything brand-specific lives in [`src/config/store.ts`](src/config/store.ts): store name, colours, contact details, announcement bar, homepage festival campaign (with countdown), delivery pincodes, promises, and feature switches (wishlist, reviews, WhatsApp ordering, Telugu names, recently viewed). Offers, gift budgets, testimonials, trust numbers and FAQs are in the same file (the stats and testimonials are samples — replace them with your real ones). Change it and the whole storefront follows — so the same codebase can run a different shop.

## Brand

The Kumbha mark is a kalash (the "kumbha" pot) crowned with a diya flame. It lives in [`src/components/logo.tsx`](src/components/logo.tsx) and follows the brand colours from the store config. Ready-to-use files for print, WhatsApp and social profiles are in `public/brand/` (`kumbha-logo.svg`, `kumbha-mark.svg`, `kumbha-app-icon.svg`); the browser tab icon is `src/app/icon.svg`.

The homepage banner shows every category inside kalash-shaped windows over a soft blur of the same photos (`src/components/hero-collage.tsx`). The festival's category takes the big centre pot; change `campaign` in the store config each season.

## Storefront features

- **Home:** festival campaign hero with countdown, photo category rail, deals, bestsellers, new arrivals, maker story, recently viewed, WhatsApp offers sign-up
- **Category:** filters generated from the category template, price bands, sort (popular, top rated, newest, price), mobile filter drawer
- **Product:** photo gallery, price with MRP and % off, option picker, quantity stepper, buy box that adapts to the selling mode, bulk price tiers, pincode delivery check, wishlist, WhatsApp share, highlights, specifications, maker profile, ratings summary and reviews, related products, Google rich-result structured data
- **Wishlist & recently viewed** (saved in the browser), **cart** grouped by selling mode with free-delivery progress and advance-payment split
- **Mobile:** app-style bottom navigation, horizontally scrolling rows, sticky header with search
- **Selling more per order:** combos with savings (`/combos`, `src/catalog/bundles.ts`), "frequently bought together" with tick-boxes, spend-more-save-more cart offers (`offerTiers`), gift wrap with a handwritten note
- **Gifting:** gift finder by budget and recipient (`/gifts`), return-gift and corporate paths, "order by … for delivery before Diwali" cut-off banner (`campaign.orderBy`)
- **Trust & story:** GI-tag / origin badges, "Ready to ship · dispatched in N days" labels, craft origin stories, trust numbers, customer testimonials, FAQs, clay-pot care guide
- **Construction:** per-brick price on cards, strength / water absorption / IS standard specs, "Share your requirement" call-back form, quality promises, sticky Call / Share bar on phones
- Accessible: skip link, visible focus, labelled controls, reduced-motion support

Sample photos are free Unsplash images standing in for real product photography — replace the URLs in `src/catalog/` before launch. Missing or broken photos fall back to a neutral tile.

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
    wishlist/, categories/, search/
    api/quotes, api/catalog
  config/
    store.ts              ← brand, colours, contact, campaign, feature switches
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
