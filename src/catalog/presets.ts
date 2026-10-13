/**
 * Category presets — the starting categories. Seeded into the database by
 * `npm run db:seed`, and used as the demo catalog when no DATABASE_URL is set.
 *
 * TO ADD A NEW CATEGORY: append an object here (or create it from the admin
 * panel later). Pick its attributes, selling modes and rules — that's it.
 */
import type { AttributeField, CategoryRules } from "@/lib/category-template";
import type { SellingMode } from "@/lib/selling-modes";

export type CategoryPreset = {
  slug: string;
  name: string;
  nameTe: string;
  description: string;
  storefront: "FESTIVE" | "BUILD";
  parentSlug?: string;
  sellingModes: SellingMode[];
  attributeSchema: AttributeField[];
  rules: CategoryRules;
  /** Icon used in compact places (nav, chips) */
  emoji: string;
  /** Cover photo for category tiles and headers */
  image: string;
  sortOrder: number;
};

export const CATEGORY_PRESETS: CategoryPreset[] = [
  {
    slug: "clay-pots",
    name: "Clay Pots & Terracotta",
    nameTe: "మట్టి కుండలు",
    description: "Cooking pots, water matkas, plant pots and terracotta decor — handmade by local potters.",
    storefront: "FESTIVE",
    sellingModes: ["SHIP_TO_HOME", "LOCAL_DELIVERY", "PICKUP", "QUOTE"],
    emoji: "🏺",
    image: "https://images.unsplash.com/photo-1507022787381-b30170b5ebf4",
    sortOrder: 1,
    rules: {
      fragile: true,
      unit: "piece",
      deliveryRadiusKm: 40,
      badges: ["Handmade", "Natural clay"],
      seasons: ["summer", "sankranti", "diwali"],
    },
    attributeSchema: [
      { key: "use", label: "Use", type: "select", options: ["Cooking", "Water storage", "Plants", "Decor", "Puja"], required: true, filterable: true },
      { key: "capacityL", label: "Capacity", type: "number", unit: "litres", min: 0 },
      { key: "diameterIn", label: "Diameter", type: "number", unit: "inch", min: 0 },
      { key: "finish", label: "Finish", type: "select", options: ["Raw", "Glazed", "Painted", "Polished"], filterable: true },
      { key: "foodSafe", label: "Food safe", type: "boolean" },
      { key: "careTips", label: "Care tips", type: "text" },
    ],
  },
  {
    slug: "diwali",
    name: "Diwali & Festive Decor",
    nameTe: "దీపావళి సామాగ్రి",
    description: "Diyas, lanterns, torans, rangoli and ready puja kits.",
    storefront: "FESTIVE",
    sellingModes: ["SHIP_TO_HOME", "LOCAL_DELIVERY", "PICKUP"],
    emoji: "🪔",
    image: "https://images.unsplash.com/photo-1635192592106-77a5aacbe1a3",
    sortOrder: 2,
    rules: { fragile: true, unit: "set", seasons: ["diwali"], badges: ["Festive pick"] },
    attributeSchema: [
      { key: "type", label: "Type", type: "select", options: ["Diya", "Lantern", "Toran", "Rangoli", "Puja kit", "Gift hamper"], required: true, filterable: true },
      { key: "piecesPerSet", label: "Pieces per set", type: "number", min: 1 },
      { key: "material", label: "Material", type: "select", options: ["Clay", "Brass", "Paper", "Fabric", "Mixed"], filterable: true },
      { key: "handPainted", label: "Hand painted", type: "boolean" },
    ],
  },
  {
    slug: "crackers",
    name: "Bhanasancha (Crackers)",
    nameTe: "బాణాసంచా",
    description: "Green crackers available at our licensed store.",
    storefront: "FESTIVE",
    parentSlug: "diwali",
    // Online sale of firecrackers is restricted in India — catalogue + store pickup only.
    // Verify current Supreme Court / state rules and your PESO licence before changing this.
    sellingModes: ["CATALOG_ONLY", "PICKUP"],
    emoji: "🎆",
    image: "https://images.unsplash.com/photo-1513546493312-0066d7de3fd2",
    sortOrder: 3,
    rules: {
      unit: "box",
      seasons: ["diwali"],
      badges: ["Green crackers"],
      legalNotice:
        "Crackers are sold only at our licensed store. Online booking reserves stock for in-store pickup and payment. Only certified green crackers are stocked.",
    },
    attributeSchema: [
      { key: "type", label: "Type", type: "select", options: ["Sparklers", "Flower pots", "Chakkar", "Rockets", "Sound", "Gift box"], required: true, filterable: true },
      { key: "greenCertified", label: "Green certified (CSIR-NEERI)", type: "boolean", required: true },
      { key: "piecesPerBox", label: "Pieces per box", type: "number", min: 1 },
      { key: "ageGuidance", label: "Age guidance", type: "text" },
    ],
  },
  {
    slug: "idols",
    name: "Ganesh & Durga Idols",
    nameTe: "గణేష్ & దుర్గా విగ్రహాలు",
    description: "Eco-friendly clay idols for homes and pandals. Pre-book your size and festival date.",
    storefront: "FESTIVE",
    sellingModes: ["PRE_BOOK", "MADE_TO_ORDER", "PICKUP", "QUOTE"],
    emoji: "🛕",
    image: "https://images.unsplash.com/photo-1598195596234-e04b82ef8adf",
    sortOrder: 4,
    rules: {
      fragile: true,
      unit: "idol",
      advancePercent: 30,
      leadTimeDays: 21,
      showSizeVisualizer: true,
      badges: ["Eco-friendly clay", "No PoP"],
      seasons: ["ganesh-chaturthi", "navratri"],
    },
    attributeSchema: [
      { key: "deity", label: "Deity", type: "select", options: ["Ganesh", "Durga", "Lakshmi", "Saraswati", "Other"], required: true, filterable: true },
      { key: "heightFt", label: "Height", type: "number", unit: "ft", min: 0.25, max: 25, required: true, filterable: true },
      { key: "material", label: "Material", type: "select", options: ["Eco clay", "Natural clay with paper", "Seed idol"], required: true, filterable: true },
      { key: "finish", label: "Finish", type: "select", options: ["Plain", "Natural colours", "Fully painted"], filterable: true },
      { key: "posture", label: "Posture", type: "text" },
      { key: "dissolvesAtHome", label: "Dissolves in a bucket at home", type: "boolean" },
    ],
  },
  {
    slug: "etikoppaka-toys",
    name: "Etikoppaka Wooden Toys",
    nameTe: "ఏటికొప్పాక చెక్క బొమ్మలు",
    description: "GI-tagged lacquerware toys from Etikoppaka, coloured with natural dyes. Safe for children.",
    storefront: "FESTIVE",
    sellingModes: ["SHIP_TO_HOME", "MADE_TO_ORDER", "QUOTE"],
    emoji: "🪀",
    image: "https://images.unsplash.com/photo-1703581698778-2224c729135b",
    sortOrder: 5,
    rules: {
      unit: "piece",
      leadTimeDays: 10,
      badges: ["GI tagged", "Natural dyes", "Child safe"],
      seasons: ["sankranti", "navratri"],
    },
    attributeSchema: [
      { key: "type", label: "Type", type: "select", options: ["Toy", "Doll set", "Kitchen set", "Decor", "Return gift", "Bommala Koluvu"], required: true, filterable: true },
      { key: "ageGroup", label: "Age group", type: "select", options: ["0-3", "3-6", "6+", "Decor (all ages)"], filterable: true },
      { key: "dyes", label: "Dyes", type: "select", options: ["Natural vegetable dyes"] },
      { key: "wood", label: "Wood", type: "select", options: ["Ankudu (Wrightia tinctoria)"] },
      { key: "personalisable", label: "Name can be painted", type: "boolean" },
    ],
  },
  {
    slug: "construction",
    name: "Bricks & Construction Materials",
    nameTe: "ఇటుకలు & నిర్మాణ సామగ్రి",
    description: "Red bricks, fly-ash bricks, sand, cement and aggregates delivered to your site.",
    storefront: "BUILD",
    sellingModes: ["QUOTE", "LOCAL_DELIVERY", "PICKUP"],
    emoji: "🧱",
    image: "https://images.unsplash.com/photo-1495578942200-c5f5d2137def",
    sortOrder: 6,
    rules: {
      unit: "1000 bricks",
      minOrderQty: 1,
      deliveryRadiusKm: 60,
      showCalculator: true,
      badges: ["GST invoice", "Site delivery"],
    },
    attributeSchema: [
      { key: "material", label: "Material", type: "select", options: ["Red clay brick", "Fly-ash brick", "Concrete block", "River sand", "M-sand", "Cement", "Aggregate"], required: true, filterable: true },
      { key: "size", label: "Size", type: "text" },
      { key: "grade", label: "Grade / class", type: "text", filterable: true },
      { key: "strengthMpa", label: "Compressive strength", type: "number", unit: "N/mm²" },
      { key: "perTrip", label: "Quantity per tractor load", type: "number" },
    ],
  },
];
