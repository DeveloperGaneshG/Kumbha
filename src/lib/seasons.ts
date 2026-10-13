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
  /** Photo for the "Shop by occasion" strip */
  image: string;
  /** Where the occasion tile links */
  href: string;
};

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const SEASONS: Season[] = [
  {
    slug: "sankranti",
    image: u("1641792113665-dfe333697d52"),
    href: "/c/clay-pots",
    name: "Sankranti",
    fromMonth: 12,
    toMonth: 1,
    categorySlugs: ["clay-pots", "etikoppaka-toys"],
    tagline: "Pongal pots, rangoli and gifts for the harvest festival",
  },
  {
    slug: "summer",
    image: u("1510828561531-05a3388f6d3d"),
    href: "/c/clay-pots?use=Water+storage",
    name: "Summer",
    fromMonth: 3,
    toMonth: 5,
    categorySlugs: ["clay-pots"],
    tagline: "Clay matkas — naturally cool water, no electricity",
  },
  {
    slug: "ganesh-chaturthi",
    image: u("1598209437948-3f0ae8a0e45d"),
    href: "/c/idols?deity=Ganesh",
    name: "Ganesh Chaturthi",
    fromMonth: 7,
    toMonth: 9,
    categorySlugs: ["idols"],
    tagline: "Pre-book eco-friendly Ganesh idols — pick your size and date",
  },
  {
    slug: "navratri",
    image: u("1759463191632-90844233c9ea"),
    href: "/c/idols?deity=Durga",
    name: "Navratri & Dussehra",
    fromMonth: 9,
    toMonth: 10,
    categorySlugs: ["idols", "etikoppaka-toys"],
    tagline: "Durga idols and Bommala Koluvu dolls",
  },
  {
    slug: "diwali",
    image: u("1577083753695-e010191bacb5"),
    href: "/c/diwali",
    name: "Diwali",
    fromMonth: 10,
    toMonth: 11,
    categorySlugs: ["diwali", "clay-pots"],
    tagline: "Diyas, lanterns, puja kits and festive gifting",
  },
  {
    slug: "karthika-deepam",
    name: "Karthika Deepam",
    fromMonth: 11,
    toMonth: 11,
    categorySlugs: ["diwali", "clay-pots"],
    tagline: "A month of lamps — diyas for every evening of Karthika masam",
    image: u("1635192592106-77a5aacbe1a3"),
    href: "/c/diwali?type=Diya",
  },
  {
    slug: "weddings",
    name: "Weddings & return gifts",
    fromMonth: 1,
    toMonth: 12,
    categorySlugs: ["etikoppaka-toys", "diwali"],
    tagline: "Return gifts guests keep — Etikoppaka toys, kulhads and diya sets",
    image: u("1568828668638-b1b4014d91a2"),
    href: "/gifts?for=return-gift",
  },
];

/** Occasions in calendar order starting from the current month, for the homepage strip. */
export function upcomingOccasions(date = new Date()) {
  const m = date.getMonth() + 1;
  const dist = (s: Season) => (s.fromMonth <= s.toMonth && m >= s.fromMonth && m <= s.toMonth ? 0 : (s.fromMonth - m + 12) % 12);
  const span = (s: Season) => (s.toMonth - s.fromMonth + 12) % 12;
  // Ties (several running now): shorter seasons first, then the one that started most recently
  const started = (s: Season) => (m - s.fromMonth + 12) % 12;
  return [...SEASONS].sort((a, b) => dist(a) - dist(b) || span(a) - span(b) || started(a) - started(b));
}

const inRange = (m: number, s: Season) =>
  s.fromMonth <= s.toMonth ? m >= s.fromMonth && m <= s.toMonth : m >= s.fromMonth || m <= s.toMonth;

/** Seasons active this month, latest-starting first (so Diwali beats Navratri in October). */
export function activeSeasons(date = new Date()): Season[] {
  const m = date.getMonth() + 1;
  return SEASONS.filter((s) => inRange(m, s)).sort((a, b) => b.fromMonth - a.fromMonth);
}
