/**
 * Festival & seasonal calendar. Festival dates follow the lunar calendar and
 * move each year — admins manage real dates in the `campaigns` table. This
 * file is the fallback used to pick the homepage hero when no campaign is set.
 */
export type Season = {
  slug: string;
  name: string;
  /** Month range (1–12), inclusive, when this season is promoted */
  fromMonth: number;
  toMonth: number;
  categorySlugs: string[];
  tagline: string;
};

export const SEASONS: Season[] = [
  {
    slug: "sankranti",
    name: "Sankranti",
    fromMonth: 12,
    toMonth: 1,
    categorySlugs: ["clay-pots", "etikoppaka-toys"],
    tagline: "Pongal pots, rangoli and gifts for the harvest festival",
  },
  {
    slug: "summer",
    name: "Summer",
    fromMonth: 3,
    toMonth: 5,
    categorySlugs: ["clay-pots"],
    tagline: "Clay matkas — naturally cool water, no electricity",
  },
  {
    slug: "ganesh-chaturthi",
    name: "Ganesh Chaturthi",
    fromMonth: 7,
    toMonth: 9,
    categorySlugs: ["idols"],
    tagline: "Pre-book eco-friendly Ganesh idols — pick your size and date",
  },
  {
    slug: "navratri",
    name: "Navratri & Dussehra",
    fromMonth: 9,
    toMonth: 10,
    categorySlugs: ["idols", "etikoppaka-toys"],
    tagline: "Durga idols and Bommala Koluvu dolls",
  },
  {
    slug: "diwali",
    name: "Diwali",
    fromMonth: 10,
    toMonth: 11,
    categorySlugs: ["diwali", "clay-pots"],
    tagline: "Diyas, lanterns, puja kits and festive gifting",
  },
];

const inRange = (m: number, s: Season) =>
  s.fromMonth <= s.toMonth ? m >= s.fromMonth && m <= s.toMonth : m >= s.fromMonth || m <= s.toMonth;

/** Seasons active this month, latest-starting first (so Diwali beats Navratri in October). */
export function activeSeasons(date = new Date()): Season[] {
  const m = date.getMonth() + 1;
  return SEASONS.filter((s) => inRange(m, s)).sort((a, b) => b.fromMonth - a.fromMonth);
}
