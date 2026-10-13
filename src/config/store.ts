/**
 * Store configuration — the ONLY file to edit to rebrand this platform for a
 * different shop. Name, colours, contact details, promises, campaign and
 * feature switches all come from here; no component hard-codes a brand.
 */

export type StoreConfig = typeof store;

export const store = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? "Kumbha",
  tagline: "Handmade pots, festive essentials and building materials",
  description:
    "Clay pots from local potters, eco-friendly idols, GI-tagged Etikoppaka toys, festive decor, and bricks & materials delivered to your site.",

  /** Brand colours — injected as CSS variables, so every component follows them */
  theme: {
    brand: "#0B6E5F", // primary buttons, links, active states
    brandHover: "#08594D",
    brandSoft: "#E3F1EE", // tinted backgrounds
    accent: "#F0A202", // badges, highlights, countdown
    sale: "#C7362F", // discounts
  },

  contact: {
    phone: "+91 99999 99999",
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919999999999",
    email: "hello@kumbha.in",
    address: "Benz Circle, Vijayawada, Andhra Pradesh 520010",
    hours: "Mon–Sat, 9am–8pm",
  },

  /** Pincode prefixes you deliver to with your own vehicles (same/next day) */
  localPincodePrefixes: ["520", "521", "522"],
  shippingDays: { local: "1–2 days", national: "4–7 days" },
  freeShippingAbove: 99900, // paise

  announcement: "Free delivery in Vijayawada & Guntur on orders above ₹999",

  /** Homepage campaign. Change the date and copy each festival. */
  campaign: {
    name: "Diwali",
    date: "2026-11-08",
    headline: "Light up Diwali with handmade clay diyas",
    subline: "Hand-painted diyas, puja kits and lanterns, delivered before the festival.",
    image: "https://images.unsplash.com/photo-1577083753695-e010191bacb5",
    categorySlug: "diwali",
  },

  promises: [
    { title: "Handmade by local artisans", body: "Every piece is made by potters and craftspeople we work with directly." },
    { title: "Breakage-safe packing", body: "Fragile items are double-boxed. Arrived broken? Send a photo and we replace it." },
    { title: "GST invoice on every order", body: "Business buyers can add their GSTIN at checkout." },
    { title: "Order on WhatsApp", body: "Prefer to chat? Send us your list and we’ll handle the rest." },
  ],

  features: {
    wishlist: true,
    reviews: true,
    whatsappOrdering: true,
    showTeluguNames: true,
    recentlyViewed: true,
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    youtube: "https://youtube.com/",
  },
};

/** Unsplash sample photos: request a sized, compressed version. */
export function img(url: string, width = 800) {
  if (!url.includes("images.unsplash.com")) return url;
  return `${url}?auto=format&fit=crop&w=${width}&q=70`;
}
