/**
 * Story sections: shop by occasion, the craft-villages map and the styling
 * lookbook. Content lives here and in seasons.ts; swap photos for your own.
 */
import Link from "next/link";
import { upcomingOccasions } from "@/lib/seasons";
import { ProductImage } from "./product-image";
import { whatsappLink } from "./whatsapp";
import { btn } from "./ui";

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export function OccasionStrip() {
  const list = upcomingOccasions();
  return (
    <ul className="scroller -mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-7 lg:px-0">
      {list.map((o, i) => (
        <li key={o.slug} className="w-40 shrink-0 lg:w-auto">
          <Link href={o.href} className="group relative block overflow-hidden rounded-2xl">
            <ProductImage src={o.image} alt="" width={400} fallbackIcon="🪔" className="aspect-[3/4] w-full transition duration-500 group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            {i === 0 && <span className="absolute left-2.5 top-2.5 rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-ink">Now</span>}
            <span className="absolute inset-x-3 bottom-3 text-[15px] font-bold leading-tight text-white">{o.name}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Craft villages, placed by real latitude/longitude on a simplified Andhra Pradesh coastline. */
const VILLAGES = [
  {
    name: "Etikoppaka",
    lat: 17.55,
    lng: 82.73,
    craft: "Lacquered wooden toys (GI-tagged)",
    body: "Toys turned from Ankudu wood and coloured with lac and plant dyes.",
    image: u("1703581698778-2224c729135b"),
    href: "/c/etikoppaka-toys",
  },
  {
    name: "Kondapalli",
    lat: 16.62,
    lng: 80.54,
    craft: "Clay pots, diyas & eco idols",
    body: "Potters and idol makers working with river clay and wood-fired kilns.",
    image: u("1607867810523-d10955f2a8df"),
    href: "/c/clay-pots",
  },
  {
    name: "Vijayawada",
    lat: 16.5,
    lng: 80.65,
    craft: "Our store & brick yard",
    body: "Pick up orders, see the pots in person, and load bricks for your site.",
    image: u("1783753444974-c1fcd211eb0b"),
    href: "/build",
  },
];

// Simplified coastline, north to south (lng, lat)
const COAST: [number, number][] = [
  [84.8, 19.1], [84.0, 18.3], [83.3, 17.7], [82.6, 17.2], [82.25, 16.9], [82.3, 16.6], [81.7, 16.3],
  [81.15, 16.15], [80.9, 15.85], [80.25, 15.55], [80.1, 15.0], [80.15, 14.4], [80.25, 13.6],
];
const BOX = { minLng: 78.4, maxLng: 85.2, minLat: 13.4, maxLat: 19.3 };
const px = (lng: number) => ((lng - BOX.minLng) / (BOX.maxLng - BOX.minLng)) * 100;
const py = (lat: number) => ((BOX.maxLat - lat) / (BOX.maxLat - BOX.minLat)) * 100;

export function CraftMap() {
  const coastPath = COAST.map(([lng, lat], i) => `${i ? "L" : "M"}${px(lng).toFixed(1)} ${py(lat).toFixed(1)}`).join(" ");
  return (
    <div className="grid overflow-hidden rounded-2xl border border-line lg:grid-cols-[1fr_1.2fr]">
      <div className="relative bg-brand-soft p-6">
        <h2 className="text-2xl font-bold">Where your order is made</h2>
        <p className="mt-1 max-w-sm text-sm text-muted">Every product comes from a craft village we work with directly — never from a warehouse of unknowns.</p>
        <svg viewBox="0 0 100 100" className="mt-4 w-full max-w-md" role="img" aria-label="Map of craft villages along the Andhra Pradesh coast">
          {/* land / sea */}
          <path d={`${coastPath} L0 100 L0 0 L100 0 Z`} fill="#fff" opacity="0.9" />
          <path d={`${coastPath} L100 100 L100 0 Z`} fill="var(--brand)" opacity="0.08" />
          <path d={coastPath} fill="none" stroke="var(--brand)" strokeWidth="0.6" strokeDasharray="1.5 1" />
          <text x="78" y="72" fontSize="3.6" fill="var(--brand)" opacity="0.7" fontStyle="italic">
            Bay of Bengal
          </text>
          {VILLAGES.map((v, i) => (
            <g key={v.name}>
              <circle cx={px(v.lng)} cy={py(v.lat)} r="3.2" fill="var(--accent)" opacity="0.35" />
              <circle cx={px(v.lng)} cy={py(v.lat)} r="1.6" fill="var(--brand)" />
              <text
                x={px(v.lng) + (i === 2 ? 3 : -3)}
                y={py(v.lat) + (i === 2 ? 5.5 : i === 1 ? -4 : -3)}
                fontSize="3.6"
                fontWeight="700"
                fill="#17181c"
                textAnchor={i === 2 ? "start" : "end"}
              >
                {v.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="divide-y divide-line">
        {VILLAGES.map((v) => (
          <li key={v.name}>
            <Link href={v.href} className="group flex gap-4 p-5 hover:bg-surface">
              <ProductImage src={v.image} alt="" width={240} fallbackIcon="📍" className="h-24 w-24 shrink-0 rounded-xl text-2xl" />
              <div>
                <p className="font-bold group-hover:underline">{v.name}</p>
                <p className="text-sm font-semibold text-brand">{v.craft}</p>
                <p className="mt-1 text-sm text-muted">{v.body}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const LOOKS = [
  { image: u("1765558290832-f50b7fab8f36"), caption: "Colourful pots on a balcony railing", href: "/c/clay-pots?use=Plants", span: "row-span-2" },
  { image: u("1675507316296-db6df46914c1"), caption: "One diya, one marigold — the simplest puja corner", href: "/c/diwali?type=Diya", span: "" },
  { image: u("1790173907491-9246272c776d"), caption: "A kitchen shelf of seasoned clay pots", href: "/c/clay-pots?use=Cooking", span: "" },
  { image: u("1714618888538-8d15a9228236"), caption: "Wooden animals for a reading nook", href: "/c/etikoppaka-toys", span: "row-span-2" },
  { image: u("1708223578831-5c737a3074ab"), caption: "Herbs in terracotta on a window sill", href: "/p/terracotta-plant-pot", span: "" },
  { image: u("1700544628901-523c8108d864"), caption: "Diyas and flowers for the Diwali table", href: "/c/diwali", span: "" },
];

export function Lookbook({ hashtag }: { hashtag: string }) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold md:text-[1.75rem]">Styled at home</h2>
          <p className="mt-1 text-muted">Ideas for using handmade pieces every day. Share yours with {hashtag} and we&apos;ll feature it here.</p>
        </div>
        <a href={whatsappLink(`Hi! Here's how I styled my Kumbha order ${hashtag}`)} target="_blank" rel="noopener noreferrer" className={btn.secondary}>
          Send us your photo
        </a>
      </div>
      <ul className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
        {LOOKS.map((l) => (
          <li key={l.image} className={l.span}>
            <Link href={l.href} className="group relative block h-full overflow-hidden rounded-xl">
              <ProductImage src={l.image} alt={l.caption} width={600} fallbackIcon="🏡" className="h-full w-full transition duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-3 pt-8 text-sm font-medium text-white opacity-100 md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
                {l.caption}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
