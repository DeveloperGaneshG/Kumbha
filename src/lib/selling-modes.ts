/**
 * Selling modes — HOW something is sold. Categories switch these on; the
 * storefront, checkout and admin read this registry to decide which buttons,
 * forms and payment rules to show. Add a mode here and every category can use it.
 */
export const SELLING_MODES = [
  "SHIP_TO_HOME",
  "LOCAL_DELIVERY",
  "PICKUP",
  "PRE_BOOK",
  "MADE_TO_ORDER",
  "QUOTE",
  "CATALOG_ONLY",
] as const;

export type SellingMode = (typeof SELLING_MODES)[number];

export type ModeDefinition = {
  label: string;
  labelTe: string;
  /** Button text on the product page */
  cta: string;
  description: string;
  /** Goes through cart + online payment */
  usesCart: boolean;
  /** Customer must pick a date (booking / pickup / delivery slot) */
  needsDate: boolean;
  /** Default share of total paid upfront (category rules can override) */
  defaultAdvancePercent: number;
  /** Delivery address required */
  needsAddress: boolean;
};

export const MODES: Record<SellingMode, ModeDefinition> = {
  SHIP_TO_HOME: {
    label: "Ship to home",
    labelTe: "ఇంటికి పంపిణీ",
    cta: "Add to cart",
    description: "Packed and shipped by courier anywhere in India.",
    usesCart: true,
    needsDate: false,
    defaultAdvancePercent: 100,
    needsAddress: true,
  },
  LOCAL_DELIVERY: {
    label: "Local delivery",
    labelTe: "స్థానిక డెలివరీ",
    cta: "Choose delivery slot",
    description: "Delivered by our own vehicle within the city — safest for fragile and heavy items.",
    usesCart: true,
    needsDate: true,
    defaultAdvancePercent: 100,
    needsAddress: true,
  },
  PICKUP: {
    label: "Store pickup",
    labelTe: "దుకాణం నుండి తీసుకోండి",
    cta: "Reserve for pickup",
    description: "Order online, collect from our shop.",
    usesCart: true,
    needsDate: true,
    defaultAdvancePercent: 0,
    needsAddress: false,
  },
  PRE_BOOK: {
    label: "Pre-book",
    labelTe: "ముందస్తు బుకింగ్",
    cta: "Book now",
    description: "Reserve with a small advance and pick your festival date.",
    usesCart: true,
    needsDate: true,
    defaultAdvancePercent: 30,
    needsAddress: false,
  },
  MADE_TO_ORDER: {
    label: "Made to order",
    labelTe: "ఆర్డర్ పై తయారీ",
    cta: "Customise & order",
    description: "Handmade to your size, colour or name. Longer lead time.",
    usesCart: true,
    needsDate: false,
    defaultAdvancePercent: 50,
    needsAddress: true,
  },
  QUOTE: {
    label: "Get a quote",
    labelTe: "ధర కోట్ పొందండి",
    cta: "Request quote",
    description: "Bulk or site delivery — we send you a price for your quantity and location.",
    usesCart: false,
    needsDate: true,
    defaultAdvancePercent: 0,
    needsAddress: true,
  },
  CATALOG_ONLY: {
    label: "Enquire",
    labelTe: "విచారించండి",
    cta: "Enquire on WhatsApp",
    description: "Available at our licensed store. Enquire for availability.",
    usesCart: false,
    needsDate: false,
    defaultAdvancePercent: 0,
    needsAddress: false,
  },
};

/** A product's effective modes: its own list if set, otherwise the category's. */
export function effectiveModes(categoryModes: readonly SellingMode[], productModes: readonly SellingMode[]): SellingMode[] {
  if (productModes.length === 0) return [...categoryModes];
  // A product may only narrow, never widen, what its category allows
  return productModes.filter((m) => categoryModes.includes(m));
}
