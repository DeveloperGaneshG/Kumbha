/**
 * Combos — products sold together at a set price. Savings are calculated
 * from the items' current prices, so they stay correct when prices change.
 * Prices in paise.
 */
import { rupees } from "@/lib/money";

export type BundleDef = {
  slug: string;
  name: string;
  description: string;
  image: string;
  items: { productSlug: string; sku: string; qty: number }[];
  price: number;
  tags?: string[];
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const BUNDLES: BundleDef[] = [
  {
    slug: "diwali-puja-combo",
    name: "Diwali Puja Combo",
    description: "Everything for Lakshmi puja and a glowing doorway: 24 hand-painted diyas, the complete puja kit and a paper lantern.",
    image: u("1781263538938-561a5e1acc51"),
    items: [
      { productSlug: "hand-painted-diya-set", sku: "DIYA-24", qty: 1 },
      { productSlug: "diwali-puja-kit", sku: "PUJAKIT-STD", qty: 1 },
      { productSlug: "paper-lantern", sku: "LANTERN-M", qty: 1 },
    ],
    price: rupees(1249),
    tags: ["family", "corporate"],
  },
  {
    slug: "clay-kitchen-starter",
    name: "Clay Kitchen Starter Set",
    description: "Start cooking the traditional way: a 2-litre cooking handi, a 12-litre water matka and six kulhad cups.",
    image: u("1717601858050-9716a178d88a"),
    items: [
      { productSlug: "clay-cooking-handi", sku: "HANDI-2", qty: 1 },
      { productSlug: "clay-water-matka", sku: "MATKA-12", qty: 1 },
      { productSlug: "clay-kulhad-set", sku: "KULHAD-6", qty: 1 },
    ],
    price: rupees(899),
    tags: ["family"],
  },
  {
    slug: "etikoppaka-gift-box",
    name: "Etikoppaka Gift Box",
    description: "A first-toys gift for a little one: the wooden animal set and pull-along train, packed in a gift box.",
    image: u("1703581698778-2224c729135b"),
    items: [
      { productSlug: "etikoppaka-animal-set", sku: "ETK-ANIMAL5", qty: 1 },
      { productSlug: "etikoppaka-toy-train", sku: "ETK-TRAIN", qty: 1 },
    ],
    price: rupees(1799),
    tags: ["kids", "family"],
  },
  {
    slug: "festive-gift-box",
    name: "Festive Gift Box",
    description: "A ready-to-give box for friends, staff and clients: 12 diyas, six kulhad cups and a puja kit. Bulk prices from 10 boxes.",
    image: u("1508899203029-1c9eb493c9bd"),
    items: [
      { productSlug: "hand-painted-diya-set", sku: "DIYA-12", qty: 1 },
      { productSlug: "clay-kulhad-set", sku: "KULHAD-6", qty: 1 },
      { productSlug: "diwali-puja-kit", sku: "PUJAKIT-STD", qty: 1 },
    ],
    price: rupees(999),
    tags: ["corporate", "family"],
  },
];
