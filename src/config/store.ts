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
    /** Last day to order for delivery before the festival (shown as a banner) */
    orderBy: "2026-11-03",
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

  /** Automatic cart discounts — spend more, save more. Amounts in paise. */
  offerTiers: [
    { minSubtotal: 150000, percent: 5 },
    { minSubtotal: 300000, percent: 10 },
  ],

  /** Optional gift wrap offered in the cart */
  giftWrap: { price: 4900, label: "Handmade paper gift wrap with a handwritten note" },

  /** Trust numbers shown on the homepage. SAMPLE FIGURES — replace with your real numbers before launch. */
  stats: [
    { value: "4.7/5", label: "from 2,100+ reviews" },
    { value: "25,000+", label: "orders delivered" },
    { value: "60+", label: "artisans we work with" },
    { value: "9", label: "craft villages" },
  ],

  /** SAMPLE testimonials — replace with real customer quotes (with permission). */
  testimonials: [
    { name: "Padmavathi K.", city: "Vijayawada", product: "Clay Water Matka", body: "Water stays cold all day, and the pot arrived without a single crack. Ordered two more for my daughter." },
    { name: "Ravi Teja", city: "Hyderabad", product: "Eco-friendly Clay Ganesh", body: "Booked a month ahead, collected on the exact day. The idol dissolved fully in a bucket on our balcony." },
    { name: "Divya N.", city: "Chennai", product: "Etikoppaka Animal Set", body: "My one-year-old chews everything. These are smooth, the colours haven't faded, and I know exactly who made them." },
    { name: "Suresh Builders", city: "Guntur", product: "Red Clay Bricks", body: "Quote in two hours, delivery the next morning, GST invoice on time. Our regular supplier now." },
  ],

  /** Gift finder: budgets (rupees) and who it's for (matches product `tags`) */
  giftBudgets: [
    { label: "Under ₹500", max: 500 },
    { label: "₹500 – ₹1,000", min: 500, max: 1000 },
    { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
    { label: "Above ₹2,500", min: 2500 },
  ],
  giftRecipients: [
    { tag: "family", label: "For family", body: "Diyas, puja kits and cookware for the home" },
    { tag: "kids", label: "For kids", body: "Child-safe Etikoppaka toys" },
    { tag: "return-gift", label: "Return gifts", body: "Bulk prices from 20 pieces" },
    { tag: "corporate", label: "Corporate gifting", body: "Branded boxes for teams and clients" },
  ],

  faqs: [
    { q: "Will clay items arrive without breaking?", a: "Every fragile item is wrapped in paper and double-boxed with corrugated sheets. If anything arrives broken, send us a photo within 48 hours and we'll replace it free." },
    { q: "How do I book a Ganesh or Durga idol?", a: "Choose your size, pick a pickup date and pay a 30% advance. We make your idol to order and you pay the balance when you collect it." },
    { q: "Are Etikoppaka toys safe for babies?", a: "Yes. They're turned from soft Ankudu wood and coloured with lac and natural vegetable dyes — no synthetic paint — with rounded edges." },
    { q: "Do you deliver bricks and sand to my site?", a: "Yes, within about 60 km of our yard by tractor or lorry. Send your quantity and site location and we'll quote a price including transport." },
    { q: "Can I order on WhatsApp instead?", a: "Yes. Send us your list on WhatsApp and we'll confirm prices, delivery and payment there." },
    { q: "Do you give GST invoices?", a: "Every order gets a GST invoice. Add your GSTIN at checkout or in your quote request for a business invoice." },
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
