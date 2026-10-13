/**
 * Demo products — seeded into the database and served when no DATABASE_URL is
 * set, so the storefront runs out of the box. Replace with your real catalog.
 * Prices are in paise.
 */
import { rupees } from "@/lib/money";
import type { SellingMode } from "@/lib/selling-modes";
import type { PriceTier } from "@/lib/pricing";

export type DemoVariant = { sku: string; name: string; options: Record<string, string>; price: number; stock: number; capacity?: number };

export type DemoProduct = {
  slug: string;
  name: string;
  nameTe?: string;
  description: string;
  categorySlug: string;
  attributes: Record<string, unknown>;
  sellingModes?: SellingMode[];
  basePrice: number;
  unit?: string;
  gstRate: number;
  isFeatured?: boolean;
  variants: DemoVariant[];
  priceTiers?: PriceTier[];
  artisan?: { name: string; village: string; craft: string; story: string };
};

const v = (sku: string, name: string, price: number, stock = 50, options: Record<string, string> = {}, capacity?: number): DemoVariant => ({
  sku,
  name,
  options,
  price,
  stock,
  capacity,
});

export const DEMO_PRODUCTS: DemoProduct[] = [
  // ── Clay pots ──
  {
    slug: "clay-water-matka",
    name: "Clay Water Matka with Tap",
    nameTe: "కుళాయి తో మట్టి కుండ",
    description: "Keeps water naturally cool. Wash with plain water before first use; no soap.",
    categorySlug: "clay-pots",
    attributes: { use: "Water storage", capacityL: 12, finish: "Raw", foodSafe: true, careTips: "Rinse daily, scrub weekly with coir." },
    basePrice: rupees(450),
    gstRate: 0,
    isFeatured: true,
    variants: [v("MATKA-10", "10 litre", rupees(400)), v("MATKA-12", "12 litre", rupees(450)), v("MATKA-20", "20 litre", rupees(650))],
    priceTiers: [{ minQty: 10, unitPrice: rupees(400) }, { minQty: 50, unitPrice: rupees(360) }],
  },
  {
    slug: "clay-cooking-handi",
    name: "Clay Cooking Handi",
    description: "Unglazed clay handi for curries and biryani. Season before first use.",
    categorySlug: "clay-pots",
    attributes: { use: "Cooking", capacityL: 2, finish: "Raw", foodSafe: true, careTips: "Soak 12 hours, rub with oil, heat slowly." },
    basePrice: rupees(380),
    gstRate: 0,
    variants: [v("HANDI-1", "1 litre", rupees(280)), v("HANDI-2", "2 litre", rupees(380)), v("HANDI-3", "3 litre", rupees(480))],
  },
  {
    slug: "terracotta-plant-pot",
    name: "Terracotta Plant Pot",
    description: "Breathable terracotta with drainage hole. Bulk pricing for nurseries.",
    categorySlug: "clay-pots",
    attributes: { use: "Plants", diameterIn: 10, finish: "Raw" },
    basePrice: rupees(150),
    gstRate: 12,
    variants: [v("PLANT-6", "6 inch", rupees(80), 200), v("PLANT-10", "10 inch", rupees(150), 200), v("PLANT-14", "14 inch", rupees(260), 100)],
    priceTiers: [{ minQty: 25, unitPrice: rupees(130) }, { minQty: 100, unitPrice: rupees(110) }],
  },
  // ── Diwali ──
  {
    slug: "hand-painted-diya-set",
    name: "Hand-painted Clay Diya Set",
    nameTe: "రంగుల మట్టి దీపాలు",
    description: "12 hand-painted clay diyas, ready to light.",
    categorySlug: "diwali",
    attributes: { type: "Diya", piecesPerSet: 12, material: "Clay", handPainted: true },
    basePrice: rupees(240),
    gstRate: 12,
    isFeatured: true,
    variants: [v("DIYA-12", "Set of 12", rupees(240), 300), v("DIYA-24", "Set of 24", rupees(440), 200)],
    priceTiers: [{ minQty: 10, unitPrice: rupees(210) }],
  },
  {
    slug: "diwali-puja-kit",
    name: "Lakshmi Puja Complete Kit",
    description: "Everything for Lakshmi puja: diyas, kumkum, turmeric, camphor, agarbatti, cotton wicks and kalash.",
    categorySlug: "diwali",
    attributes: { type: "Puja kit", piecesPerSet: 18, material: "Mixed" },
    basePrice: rupees(699),
    gstRate: 5,
    variants: [v("PUJAKIT-STD", "Standard", rupees(699), 120)],
  },
  // ── Crackers (catalogue only) ──
  {
    slug: "green-sparklers-box",
    name: "Green Sparklers (Box of 10)",
    description: "CSIR-NEERI certified green sparklers. Available at our licensed store.",
    categorySlug: "crackers",
    attributes: { type: "Sparklers", greenCertified: true, piecesPerBox: 10, ageGuidance: "Children only with adult supervision" },
    basePrice: rupees(120),
    gstRate: 18,
    variants: [v("SPARK-10", "Box of 10", rupees(120), 0)],
  },
  // ── Idols ──
  {
    slug: "eco-ganesh-idol",
    name: "Eco-friendly Clay Ganesh",
    nameTe: "మట్టి వినాయకుడు",
    description: "Natural clay Ganesh that dissolves in a bucket at home. Pre-book with 30% advance.",
    categorySlug: "idols",
    attributes: { deity: "Ganesh", heightFt: 1, material: "Eco clay", finish: "Natural colours", posture: "Seated on lotus", dissolvesAtHome: true },
    basePrice: rupees(1200),
    gstRate: 12,
    isFeatured: true,
    variants: [
      v("GANESH-1", "1 ft", rupees(1200), 0, { height: "1" }, 300),
      v("GANESH-2", "2 ft", rupees(2800), 0, { height: "2" }, 120),
      v("GANESH-4", "4 ft", rupees(7500), 0, { height: "4" }, 40),
    ],
    artisan: { name: "Srinivas Rao", village: "Kondapalli", craft: "Clay idols", story: "Third-generation idol maker, working only with river clay and natural colours." },
  },
  {
    slug: "durga-idol-pandal",
    name: "Durga Idol for Pandals",
    description: "Large Durga idol with lion, made to order for committees. Request a quote for 6–12 ft.",
    categorySlug: "idols",
    attributes: { deity: "Durga", heightFt: 6, material: "Natural clay with paper", finish: "Fully painted" },
    sellingModes: ["MADE_TO_ORDER", "QUOTE"],
    basePrice: rupees(25000),
    gstRate: 12,
    variants: [v("DURGA-6", "6 ft", rupees(25000), 0, { height: "6" }, 15)],
  },
  // ── Etikoppaka ──
  {
    slug: "etikoppaka-kitchen-set",
    name: "Etikoppaka Kitchen Play Set",
    nameTe: "ఏటికొప్పాక వంట బొమ్మలు",
    description: "14-piece miniature kitchen set in natural lacquer. A classic for pretend play.",
    categorySlug: "etikoppaka-toys",
    attributes: { type: "Kitchen set", ageGroup: "3-6", dyes: "Natural vegetable dyes", wood: "Ankudu (Wrightia tinctoria)", personalisable: false },
    basePrice: rupees(899),
    gstRate: 12,
    isFeatured: true,
    variants: [v("ETK-KIT14", "14 pieces", rupees(899), 40)],
    artisan: { name: "Lakshmi Devi", village: "Etikoppaka", craft: "Lacquerware toys", story: "Turns Ankudu wood on a hand lathe and colours it with lac and plant dyes, as her family has for four generations." },
  },
  {
    slug: "etikoppaka-return-gift-pack",
    name: "Return Gift Pack (Spinning Tops)",
    description: "Colourful lacquer spinning tops — bulk pricing for weddings and birthdays.",
    categorySlug: "etikoppaka-toys",
    attributes: { type: "Return gift", ageGroup: "6+", dyes: "Natural vegetable dyes", personalisable: true },
    basePrice: rupees(90),
    gstRate: 12,
    variants: [v("ETK-TOP", "Single top", rupees(90), 500)],
    priceTiers: [{ minQty: 50, unitPrice: rupees(75) }, { minQty: 200, unitPrice: rupees(65) }],
  },
  // ── Construction ──
  {
    slug: "red-clay-bricks",
    name: "Red Clay Bricks (Class A)",
    nameTe: "ఎర్ర ఇటుకలు",
    description: "Kiln-fired first-class red bricks. Priced per 1,000; tractor load ≈ 3,000 bricks.",
    categorySlug: "construction",
    attributes: { material: "Red clay brick", size: "9 × 4 × 3 in", grade: "Class A", strengthMpa: 7.5, perTrip: 3000 },
    basePrice: rupees(8500),
    unit: "1000 bricks",
    gstRate: 5,
    isFeatured: true,
    variants: [v("BRICK-RED-A", "Per 1,000", rupees(8500), 200)],
    priceTiers: [{ minQty: 10, unitPrice: rupees(8200) }, { minQty: 25, unitPrice: rupees(7900) }],
  },
  {
    slug: "fly-ash-bricks",
    name: "Fly-ash Bricks",
    description: "Uniform size, lighter and stronger than clay. Less plaster needed.",
    categorySlug: "construction",
    attributes: { material: "Fly-ash brick", size: "230 × 110 × 75 mm", grade: "IS 12894", strengthMpa: 10, perTrip: 3500 },
    basePrice: rupees(7200),
    unit: "1000 bricks",
    gstRate: 12,
    variants: [v("BRICK-FLY", "Per 1,000", rupees(7200), 300)],
  },
  {
    slug: "river-sand",
    name: "River Sand",
    description: "Washed river sand for plastering and masonry. Priced per tonne.",
    categorySlug: "construction",
    attributes: { material: "River sand", grade: "Zone II" },
    basePrice: rupees(1400),
    unit: "tonne",
    gstRate: 5,
    variants: [v("SAND-RIVER", "Per tonne", rupees(1400), 500)],
  },
];

/** Delivery bands for the construction yard (paise). Edit to match your vehicles. */
export const DEMO_DELIVERY_RATES = [
  { storefront: "BUILD" as const, vehicle: "Tractor", maxKm: 25, baseFee: rupees(800), perKmFee: rupees(40), freeKm: 5, capacity: "3,000 bricks" },
  { storefront: "BUILD" as const, vehicle: "Lorry", maxKm: 60, baseFee: rupees(2500), perKmFee: rupees(55), freeKm: 10, capacity: "8,000 bricks" },
  { storefront: "FESTIVE" as const, vehicle: "Auto", maxKm: 15, baseFee: rupees(80), perKmFee: rupees(10), freeKm: 3, capacity: null },
  { storefront: "FESTIVE" as const, vehicle: "Mini-truck", maxKm: 40, baseFee: rupees(300), perKmFee: rupees(18), freeKm: 5, capacity: null },
];
