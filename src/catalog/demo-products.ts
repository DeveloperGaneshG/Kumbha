/**
 * Demo products — seeded into the database and served when no DATABASE_URL is
 * set, so the storefront runs out of the box. Replace with your real catalog.
 *
 * Prices are in paise. `mrp` is the compare-at price used for "% off".
 * Photos are free Unsplash stock images standing in for your own product
 * photography — replace them before launch.
 */
import { rupees } from "@/lib/money";
import type { SellingMode } from "@/lib/selling-modes";
import type { PriceTier } from "@/lib/pricing";

export type DemoVariant = {
  sku: string;
  name: string;
  options: Record<string, string>;
  price: number;
  mrp?: number;
  stock: number;
  capacity?: number;
};

export type DemoReview = { name: string; city: string; rating: number; title: string; body: string; date: string; verified: boolean };

export type DemoProduct = {
  slug: string;
  name: string;
  nameTe?: string;
  description: string;
  highlights?: string[];
  categorySlug: string;
  attributes: Record<string, unknown>;
  sellingModes?: SellingMode[];
  images: string[];
  basePrice: number;
  unit?: string;
  gstRate: number;
  isFeatured?: boolean;
  isNew?: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: DemoReview[];
  variants: DemoVariant[];
  priceTiers?: PriceTier[];
  artisan?: { name: string; village: string; craft: string; story: string };
  /** Where it's made. `gi` marks a Geographical Indication craft. */
  origin?: { place: string; gi?: boolean };
  /** Gift finder tags: family, kids, return-gift, corporate */
  tags?: string[];
  /** Days to dispatch when in stock (shown as "Ships in N days") */
  shipsInDays?: number;
  /** Frequently bought together */
  pairsWith?: string[];
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

const v = (sku: string, name: string, price: number, mrp?: number, stock = 50, options: Record<string, string> = {}, capacity?: number): DemoVariant => ({
  sku,
  name,
  options,
  price,
  mrp,
  stock,
  capacity,
});

export const DEMO_PRODUCTS: DemoProduct[] = [
  // ── Clay pots ──
  {
    slug: "clay-water-matka",
    origin: { place: "Kondapalli" }, tags: ["family"], shipsInDays: 2, pairsWith: ["clay-kulhad-set", "terracotta-plant-pot"],
    name: "Clay Water Matka with Tap",
    nameTe: "కుళాయి తో మట్టి కుండ",
    description: "Keeps drinking water naturally cool through the summer, with no electricity. Fired from river clay and fitted with a food-grade tap.",
    highlights: ["Cools water 6–8°C below room temperature", "Food-grade brass-finish tap", "Lid included", "Wash with plain water only — no soap"],
    categorySlug: "clay-pots",
    attributes: { use: "Water storage", capacityL: 12, finish: "Raw", foodSafe: true, careTips: "Rinse daily, scrub weekly with coir." },
    images: [u("1510828561531-05a3388f6d3d"), u("1604264726154-26480e76f4e1"), u("1719173150322-e75de9901efb")],
    basePrice: rupees(450),
    gstRate: 0,
    isFeatured: true,
    rating: 4.6,
    reviewCount: 214,
    reviews: [
      { name: "Padmavathi K.", city: "Vijayawada", rating: 5, title: "Water stays cold all day", body: "Bought for summer and stopped using the fridge for drinking water. Packing was very good, no cracks.", date: "2026-05-02", verified: true },
      { name: "Rahul S.", city: "Hyderabad", rating: 4, title: "Good quality", body: "Seeps slightly for the first two days, which the seller told me is normal. Works perfectly after that.", date: "2026-04-18", verified: true },
    ],
    variants: [v("MATKA-10", "10 litre", rupees(400), rupees(499)), v("MATKA-12", "12 litre", rupees(450), rupees(599)), v("MATKA-20", "20 litre", rupees(650), rupees(799))],
    priceTiers: [{ minQty: 10, unitPrice: rupees(400) }, { minQty: 50, unitPrice: rupees(360) }],
    artisan: { name: "Venkatesh Kummari", village: "Kondapalli", craft: "Potter", story: "Has worked the wheel for 30 years, and fires every pot in a wood kiln behind his home." },
  },
  {
    slug: "clay-cooking-handi",
    origin: { place: "Kondapalli" }, tags: ["family"], shipsInDays: 2, pairsWith: ["clay-kulhad-set", "clay-water-matka"],
    name: "Clay Cooking Handi",
    nameTe: "మట్టి వంట పాత్ర",
    description: "Unglazed clay handi for curries, dal and biryani. Slow, even heat keeps food moist and adds an earthy flavour.",
    highlights: ["Unglazed, chemical-free clay", "Works on gas and in the oven", "Season before first use (guide included)"],
    categorySlug: "clay-pots",
    attributes: { use: "Cooking", capacityL: 2, finish: "Raw", foodSafe: true, careTips: "Soak 12 hours, rub with oil, heat slowly." },
    images: [u("1590600504282-30e4dc6f8fcc"), u("1618722060945-b87f7326995b")],
    basePrice: rupees(380),
    gstRate: 0,
    isFeatured: true,
    rating: 4.4,
    reviewCount: 96,
    variants: [v("HANDI-1", "1 litre", rupees(280), rupees(349)), v("HANDI-2", "2 litre", rupees(380), rupees(449)), v("HANDI-3", "3 litre", rupees(480), rupees(549))],
  },
  {
    slug: "terracotta-plant-pot",
    origin: { place: "Kondapalli" }, tags: ["family", "corporate"], shipsInDays: 2,
    name: "Terracotta Plant Pot",
    description: "Breathable terracotta that keeps roots healthy, with a drainage hole. Bulk pricing for nurseries and landscapers.",
    highlights: ["Drainage hole", "Breathable clay prevents root rot", "Bulk price from 25 pots"],
    categorySlug: "clay-pots",
    attributes: { use: "Plants", diameterIn: 10, finish: "Raw" },
    images: [u("1592064465579-6796bfdaa5cd"), u("1620293106076-ad27d651efe3"), u("1528789386055-75c4b717bad1")],
    basePrice: rupees(150),
    gstRate: 12,
    rating: 4.7,
    reviewCount: 341,
    variants: [v("PLANT-6", "6 inch", rupees(80), undefined, 200), v("PLANT-10", "10 inch", rupees(150), rupees(180), 200), v("PLANT-14", "14 inch", rupees(260), rupees(320), 100)],
    priceTiers: [{ minQty: 25, unitPrice: rupees(130) }, { minQty: 100, unitPrice: rupees(110) }],
  },
  {
    slug: "clay-kulhad-set",
    origin: { place: "Kondapalli" }, tags: ["family", "return-gift", "corporate"], shipsInDays: 2, pairsWith: ["clay-cooking-handi"],
    name: "Clay Kulhad Cups (Set of 6)",
    description: "Traditional chai cups with a smoky, earthy taste. Reusable, or compostable when you're done.",
    categorySlug: "clay-pots",
    attributes: { use: "Cooking", capacityL: 0.15, finish: "Polished", foodSafe: true },
    images: [u("1699762641437-eb7c6e618796"), u("1611078295948-10b3961e1e40")],
    basePrice: rupees(240),
    gstRate: 0,
    isNew: true,
    rating: 4.3,
    reviewCount: 58,
    variants: [v("KULHAD-6", "Set of 6", rupees(240), rupees(299), 150), v("KULHAD-12", "Set of 12", rupees(440), rupees(549), 100)],
    priceTiers: [{ minQty: 20, unitPrice: rupees(210) }],
  },
  // ── Diwali ──
  {
    slug: "hand-painted-diya-set",
    origin: { place: "Kondapalli" }, tags: ["family", "return-gift", "corporate"], shipsInDays: 1, pairsWith: ["diwali-puja-kit", "paper-lantern"],
    name: "Hand-painted Clay Diya Set",
    nameTe: "రంగుల మట్టి దీపాలు",
    description: "Twelve clay diyas painted by hand in festive colours. Ready to fill with oil and light.",
    highlights: ["Set of 12 or 24", "Hand-painted — each piece is unique", "Burns 3–4 hours per fill"],
    categorySlug: "diwali",
    attributes: { type: "Diya", piecesPerSet: 12, material: "Clay", handPainted: true },
    images: [u("1577083753695-e010191bacb5"), u("1635192592106-77a5aacbe1a3"), u("1605292356183-a77d0a9c9d1d")],
    basePrice: rupees(240),
    gstRate: 12,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 527,
    reviews: [
      { name: "Sravani M.", city: "Guntur", rating: 5, title: "Beautiful colours", body: "Even prettier than the photos. Ordered a second set for my mother.", date: "2025-10-28", verified: true },
      { name: "Anil R.", city: "Visakhapatnam", rating: 5, title: "Arrived in two days", body: "Packed in paper and corrugated sheets, not one diya broken.", date: "2025-10-25", verified: true },
      { name: "Meena T.", city: "Bengaluru", rating: 4, title: "Nice, slightly small", body: "Good quality. They're a little smaller than I expected, so I'd recommend the 24 set.", date: "2025-10-20", verified: false },
    ],
    variants: [v("DIYA-12", "Set of 12", rupees(240), rupees(320), 300), v("DIYA-24", "Set of 24", rupees(440), rupees(600), 200)],
    priceTiers: [{ minQty: 10, unitPrice: rupees(210) }],
  },
  {
    slug: "diwali-puja-kit",
    tags: ["family", "corporate"], shipsInDays: 1, pairsWith: ["hand-painted-diya-set", "paper-lantern"],
    name: "Lakshmi Puja Complete Kit",
    description: "Everything for Lakshmi puja in one box: diyas, kumkum, turmeric, camphor, agarbatti, cotton wicks and a kalash.",
    highlights: ["18 items", "Step-by-step puja guide in Telugu & English", "Ready to gift"],
    categorySlug: "diwali",
    attributes: { type: "Puja kit", piecesPerSet: 18, material: "Mixed" },
    images: [u("1761295908789-42feef309297"), u("1692107112697-aca539554bc0")],
    basePrice: rupees(699),
    gstRate: 5,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 142,
    variants: [v("PUJAKIT-STD", "Standard", rupees(699), rupees(899), 120), v("PUJAKIT-PRM", "Premium (brass kalash)", rupees(1299), rupees(1599), 60)],
  },
  {
    slug: "paper-lantern",
    tags: ["family"], shipsInDays: 2, pairsWith: ["hand-painted-diya-set"],
    name: "Handmade Paper Lantern",
    description: "Folded paper lantern for doorways and balconies. Use with an LED bulb or tealight holder.",
    categorySlug: "diwali",
    attributes: { type: "Lantern", piecesPerSet: 1, material: "Paper" },
    images: [u("1515140302183-8823a2335e2a"), u("1639918065925-eb39272edda2")],
    basePrice: rupees(349),
    gstRate: 12,
    isNew: true,
    rating: 4.2,
    reviewCount: 37,
    variants: [v("LANTERN-M", "Medium", rupees(349), rupees(449), 80)],
  },
  // ── Crackers (catalogue only) ──
  {
    slug: "green-sparklers-box",
    name: "Green Sparklers (Box of 10)",
    description: "CSIR-NEERI certified green sparklers with lower smoke. Available at our licensed store only.",
    categorySlug: "crackers",
    attributes: { type: "Sparklers", greenCertified: true, piecesPerBox: 10, ageGuidance: "Children only with adult supervision" },
    images: [u("1513546493312-0066d7de3fd2"), u("1509910110001-4e756f86fbd3")],
    basePrice: rupees(120),
    gstRate: 18,
    variants: [v("SPARK-10", "Box of 10", rupees(120), undefined, 0)],
  },
  // ── Idols ──
  {
    slug: "eco-ganesh-idol",
    origin: { place: "Kondapalli" }, tags: ["family"],
    name: "Eco-friendly Clay Ganesh",
    nameTe: "మట్టి వినాయకుడు",
    description: "Natural clay Ganesh that dissolves in a bucket at home after the festival. Pre-book now with a 30% advance and collect on your date.",
    highlights: ["Dissolves at home in 2–3 hours", "Painted with natural colours", "No Plaster of Paris", "Reserve now, pay the balance at pickup"],
    categorySlug: "idols",
    attributes: { deity: "Ganesh", heightFt: 1, material: "Eco clay", finish: "Natural colours", posture: "Seated on lotus", dissolvesAtHome: true },
    images: [u("1567591414240-e9c1e59f3e06"), u("1598195596234-e04b82ef8adf"), u("1598209437948-3f0ae8a0e45d")],
    basePrice: rupees(1200),
    gstRate: 12,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 188,
    reviews: [
      { name: "Kiran P.", city: "Vijayawada", rating: 5, title: "Booked a month ahead, collected on time", body: "Very lively face and it dissolved completely in a bucket. Our family's choice every year now.", date: "2025-09-05", verified: true },
    ],
    variants: [
      v("GANESH-1", "1 ft", rupees(1200), rupees(1500), 0, { height: "1" }, 300),
      v("GANESH-2", "2 ft", rupees(2800), rupees(3400), 0, { height: "2" }, 120),
      v("GANESH-4", "4 ft", rupees(7500), rupees(9000), 0, { height: "4" }, 40),
    ],
    artisan: { name: "Srinivas Rao", village: "Kondapalli", craft: "Idol maker", story: "Third-generation idol maker who works only with river clay and natural colours." },
  },
  {
    slug: "ganesh-desk-idol",
    origin: { place: "Kondapalli" }, tags: ["family", "corporate"], shipsInDays: 2,
    name: "Ganesh Desk Idol with Gold Accents",
    description: "A small Ganesh for your desk, car dashboard or puja shelf. Hand-finished with gold accents.",
    categorySlug: "idols",
    attributes: { deity: "Ganesh", heightFt: 0.5, material: "Natural clay with paper", finish: "Fully painted" },
    sellingModes: ["PICKUP"],
    images: [u("1613422954567-8eade6e47038"), u("1567591370504-80142b28f1c1")],
    basePrice: rupees(599),
    gstRate: 12,
    isNew: true,
    rating: 4.6,
    reviewCount: 64,
    variants: [v("GANESH-DESK", "6 inch", rupees(599), rupees(799), 40)],
  },
  {
    slug: "durga-idol-pandal",
    origin: { place: "Kondapalli" },
    name: "Durga Idol for Pandals",
    nameTe: "దుర్గా విగ్రహం",
    description: "Large Durga idol with lion, made to order for committees and pandals. Request a quote for 6–12 ft.",
    categorySlug: "idols",
    attributes: { deity: "Durga", heightFt: 6, material: "Natural clay with paper", finish: "Fully painted" },
    sellingModes: ["MADE_TO_ORDER", "QUOTE"],
    images: [u("1759463191632-90844233c9ea"), u("1728754178092-43f15566fdb6")],
    basePrice: rupees(25000),
    gstRate: 12,
    rating: 4.8,
    reviewCount: 23,
    variants: [v("DURGA-6", "6 ft", rupees(25000), undefined, 0, { height: "6" }, 15)],
  },
  // ── Etikoppaka ──
  {
    slug: "etikoppaka-animal-set",
    origin: { place: "Etikoppaka", gi: true }, tags: ["kids", "family"], shipsInDays: 3, pairsWith: ["etikoppaka-toy-train", "etikoppaka-return-gift-pack"],
    name: "Etikoppaka Wooden Animal Set",
    nameTe: "ఏటికొప్పాక చెక్క బొమ్మలు",
    description: "Hand-turned Ankudu-wood animals finished in natural lacquer. Smooth, rounded and safe for little hands.",
    highlights: ["GI-tagged Etikoppaka craft", "Natural vegetable dyes — no paint", "Rounded edges, child-safe"],
    categorySlug: "etikoppaka-toys",
    attributes: { type: "Toy", ageGroup: "0-3", dyes: "Natural vegetable dyes", wood: "Ankudu (Wrightia tinctoria)", personalisable: false },
    images: [u("1714618888538-8d15a9228236"), u("1703581698778-2224c729135b")],
    basePrice: rupees(899),
    gstRate: 12,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 119,
    reviews: [
      { name: "Divya N.", city: "Chennai", rating: 5, title: "Perfect first toys", body: "My daughter chews everything and I don't worry with these. Colours haven't faded at all.", date: "2026-02-11", verified: true },
    ],
    variants: [v("ETK-ANIMAL5", "Set of 5", rupees(899), rupees(1099), 40)],
    artisan: { name: "Lakshmi Devi", village: "Etikoppaka", craft: "Lacquerware toys", story: "Turns Ankudu wood on a hand lathe and colours it with lac and plant dyes, as her family has for four generations." },
  },
  {
    slug: "etikoppaka-toy-train",
    origin: { place: "Etikoppaka", gi: true }, tags: ["kids"], shipsInDays: 3, pairsWith: ["etikoppaka-animal-set"],
    name: "Etikoppaka Wooden Toy Train",
    description: "Pull-along train with three carriages. Personalise it with your child's name painted on the engine.",
    categorySlug: "etikoppaka-toys",
    attributes: { type: "Toy", ageGroup: "3-6", dyes: "Natural vegetable dyes", personalisable: true },
    images: [u("1505003098838-83ce5356c228")],
    basePrice: rupees(1199),
    gstRate: 12,
    isNew: true,
    rating: 4.8,
    reviewCount: 41,
    variants: [v("ETK-TRAIN", "Engine + 3 carriages", rupees(1199), rupees(1399), 25)],
  },
  {
    slug: "etikoppaka-return-gift-pack",
    origin: { place: "Etikoppaka", gi: true }, tags: ["kids", "return-gift"], shipsInDays: 3,
    name: "Return Gift Blocks Pack",
    description: "Colourful lacquered wooden blocks in a cloth pouch — bulk pricing for weddings, birthdays and Bommala Koluvu.",
    categorySlug: "etikoppaka-toys",
    attributes: { type: "Return gift", ageGroup: "3-6", dyes: "Natural vegetable dyes", personalisable: true },
    images: [u("1568828668638-b1b4014d91a2")],
    basePrice: rupees(90),
    gstRate: 12,
    rating: 4.5,
    reviewCount: 77,
    variants: [v("ETK-BLOCKS", "Pouch of 6 blocks", rupees(90), rupees(120), 500)],
    priceTiers: [{ minQty: 50, unitPrice: rupees(75) }, { minQty: 200, unitPrice: rupees(65) }],
  },
  // ── Construction ──
  {
    slug: "red-clay-bricks",
    pairsWith: ["river-sand"],
    name: "Red Clay Bricks (Class A)",
    nameTe: "ఎర్ర ఇటుకలు",
    description: "Kiln-fired first-class red bricks with uniform size and sharp edges. Priced per 1,000; a tractor load is about 3,000 bricks.",
    highlights: ["Compressive strength 7.5 N/mm²", "Delivered by tractor or lorry", "GST invoice", "Credit for regular contractors"],
    categorySlug: "construction",
    attributes: { material: "Red clay brick", size: "9 × 4 × 3 in", grade: "Class A", strengthMpa: 7.5, waterAbsorption: 15, standard: "IS 1077", perTrip: 3000 },
    images: [u("1495578942200-c5f5d2137def"), u("1520758594221-872948699332")],
    basePrice: rupees(8500),
    unit: "1000 bricks",
    gstRate: 5,
    isFeatured: true,
    rating: 4.5,
    reviewCount: 62,
    variants: [v("BRICK-RED-A", "Per 1,000", rupees(8500), undefined, 200)],
    priceTiers: [{ minQty: 10, unitPrice: rupees(8200) }, { minQty: 25, unitPrice: rupees(7900) }],
  },
  {
    slug: "fly-ash-bricks",
    pairsWith: ["river-sand"],
    name: "Fly-ash Bricks",
    description: "Uniform, lighter and stronger than clay bricks, so you need less plaster. Made to IS 12894.",
    categorySlug: "construction",
    attributes: { material: "Fly-ash brick", size: "230 × 110 × 75 mm", grade: "Class 10", strengthMpa: 10, waterAbsorption: 12, standard: "IS 12894", perTrip: 3500 },
    images: [u("1707636497375-fa03615149b2"), u("1612529505363-07a363324da7")],
    basePrice: rupees(7200),
    unit: "1000 bricks",
    gstRate: 12,
    rating: 4.4,
    reviewCount: 31,
    variants: [v("BRICK-FLY", "Per 1,000", rupees(7200), undefined, 300)],
  },
  {
    slug: "river-sand",
    name: "Washed River Sand",
    description: "Washed river sand for plastering and masonry, priced per tonne and delivered to your site.",
    categorySlug: "construction",
    attributes: { material: "River sand", grade: "Zone II" },
    images: [u("1783753444974-c1fcd211eb0b"), u("1685555809025-0fe60ab6df46")],
    basePrice: rupees(1400),
    unit: "tonne",
    gstRate: 5,
    rating: 4.2,
    reviewCount: 18,
    variants: [v("SAND-RIVER", "Per tonne", rupees(1400), undefined, 500)],
  },
];

/** Delivery bands for the construction yard (paise). Edit to match your vehicles. */
export const DEMO_DELIVERY_RATES = [
  { storefront: "BUILD" as const, vehicle: "Tractor", maxKm: 25, baseFee: rupees(800), perKmFee: rupees(40), freeKm: 5, capacity: "3,000 bricks" },
  { storefront: "BUILD" as const, vehicle: "Lorry", maxKm: 60, baseFee: rupees(2500), perKmFee: rupees(55), freeKm: 10, capacity: "8,000 bricks" },
  { storefront: "FESTIVE" as const, vehicle: "Auto", maxKm: 15, baseFee: rupees(80), perKmFee: rupees(10), freeKm: 3, capacity: null },
  { storefront: "FESTIVE" as const, vehicle: "Mini-truck", maxKm: 40, baseFee: rupees(300), perKmFee: rupees(18), freeKm: 5, capacity: null },
];
