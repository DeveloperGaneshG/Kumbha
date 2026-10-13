/**
 * Picks and fills the right interactive banner for a category, from its
 * `rules.hero.style`. Server component: it turns catalog data into the small,
 * serializable props each banner needs. A new category just sets a style.
 */
import type { CategoryView, ProductView } from "@/lib/catalog";
import { fromPrice } from "@/lib/catalog";
import { store } from "@/config/store";
import { daysUntilFestival } from "@/lib/campaign";
import type { HeroCopy } from "./frame";
import { WheelHero } from "./potters-wheel";
import { DiyaReveal } from "./diya-reveal";
import { IdolSize, type IdolSizeOption } from "./idol-size";
import { LacquerDyes } from "./lacquer-dyes";
import { BrickWall } from "./brick-wall";

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;
/** Extra mood photos for the Diwali scene, after the product photos */
const DIWALI_SCENE = [u("1635192592106-77a5aacbe1a3"), u("1675507316296-db6df46914c1"), u("1700544628901-523c8108d864"), u("1636080810842-2dc5cdfd9483")];

export function CategoryHero({
  category,
  products,
  variant,
}: {
  category: CategoryView;
  products: ProductView[];
  /** "page": on the category page (CTA scrolls to products); "home": inside the homepage showcase */
  variant: "page" | "home";
}) {
  const hero = category.rules.hero;
  if (!hero) return null;
  const isCampaign = category.slug === store.campaign.categorySlug;
  const days = daysUntilFestival();
  const href = category.storefront === "BUILD" ? "/build" : `/c/${category.slug}`;

  const copy: HeroCopy = {
    kicker: category.name,
    kickerTe: store.features.showTeluguNames ? category.nameTe : null,
    title: hero.title,
    subtitle: hero.subtitle,
    badge: isCampaign && days > 0 && days < 120 ? `${store.campaign.name} in ${days} ${days === 1 ? "day" : "days"}` : null,
    cta: variant === "home" ? { href, label: `Shop ${category.shortName}` } : { href: "#products", label: `See all ${products.length} products` },
    secondary: null,
    headingLevel: variant === "home" ? 2 : 1,
  };

  switch (hero.style) {
    case "wheel":
      copy.secondary = { href: "/combos", label: "Clay kitchen combos" };
      return (
        <WheelHero
          copy={copy}
          plates={products.slice(0, 6).map((p) => ({
            href: `/p/${p.slug}`,
            label: p.name.replace(/^(Clay|Terracotta)\s+/i, "").split(/\s+(with|\()/)[0],
            image: p.images[0] ?? null,
            icon: category.emoji,
          }))}
        />
      );

    case "diya": {
      copy.secondary = { href: "/greetings", label: "Make a free greeting card" };
      const photos = [...products.flatMap((p) => p.images.slice(0, 2)), ...DIWALI_SCENE];
      return <DiyaReveal copy={copy} images={[...new Set(photos)].slice(0, 8)} />;
    }

    case "idol-size": {
      copy.secondary = { href: "/quote", label: "Pandal & custom sizes" };
      const advance = category.rules.advancePercent ?? 30;
      const sizes: IdolSizeOption[] = products.flatMap((p) =>
        p.variants.map((v) => {
          const h = Number(v.options.height ?? p.attributes.heightFt ?? 0);
          return { heightFt: h, label: h < 1 ? `${Math.round(h * 12)} in` : `${h} ft`, price: v.price, href: `/p/${p.slug}`, image: p.images[0] ?? null, name: p.name, advancePercent: advance };
        }),
      );
      // one option per height, cheapest first
      const byHeight = new Map<number, IdolSizeOption>();
      for (const s of sizes.filter((s) => s.heightFt > 0)) if (!byHeight.has(s.heightFt) || byHeight.get(s.heightFt)!.price > s.price) byHeight.set(s.heightFt, s);
      return <IdolSize copy={copy} sizes={[...byHeight.values()]} />;
    }

    case "lacquer":
      copy.secondary = { href: "/gifts?for=kids", label: "Gifts for kids" };
      return <LacquerDyes copy={copy} toys={products.map((p) => ({ name: p.name, href: `/p/${p.slug}`, image: p.images[0] ?? null, price: fromPrice(p) }))} />;

    case "brick-wall": {
      const brick = products.find((p) => p.unit.startsWith("1000")) ?? products[0];
      if (variant === "page") copy.cta = { href: "#requirement", label: "Share your requirement" };
      copy.secondary = variant === "page" ? { href: "#products", label: "See materials" } : { href: "/quote", label: "Request a site quote" };
      return <BrickWall copy={copy} pricePer1000={brick ? fromPrice(brick) : 0} productSlug={brick?.slug ?? ""} />;
    }
  }
}
