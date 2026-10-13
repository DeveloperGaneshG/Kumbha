import Link from "next/link";
import { bestDiscount, fromPrice, type ProductView } from "@/lib/catalog";
import { store } from "@/config/store";
import { ProductImage } from "./product-image";
import { WishlistButton } from "./wishlist-button";
import { Price, RatingInline } from "./ui";

/** One line under the price telling the shopper how this item is bought. */
function buyHint(p: ProductView): string {
  const m = p.sellingModes[0];
  switch (m) {
    case "PRE_BOOK":
      return `Pre-book · pay ${p.category.rules.advancePercent ?? 30}% now`;
    case "QUOTE":
      return "Bulk & site delivery · get a quote";
    case "CATALOG_ONLY":
      return "Available at our store";
    case "MADE_TO_ORDER":
      return `Made to order · ${p.category.rules.leadTimeDays ?? 10}+ days`;
    case "PICKUP":
      return "Order online · pick up in store";
    case "LOCAL_DELIVERY":
      return `Local delivery in ${store.shippingDays.local}`;
    default:
      return `Delivery in ${store.shippingDays.national}`;
  }
}

export function ProductCard({ p, priority = false }: { p: ProductView; priority?: boolean }) {
  const deal = bestDiscount(p);
  const catalogOnly = p.sellingModes[0] === "CATALOG_ONLY";
  const isQuote = p.sellingModes[0] === "QUOTE";
  const price = fromPrice(p);
  const cheapest = p.variants.find((v) => v.price === price);
  const multi = p.variants.length > 1;

  return (
    <article className="group relative flex flex-col">
      <Link href={`/p/${p.slug}`} className="flex flex-1 flex-col rounded-xl focus-visible:outline-offset-4">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <ProductImage src={p.images[0]} alt={p.name} fallbackIcon={p.category.emoji} priority={priority} className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
          {p.images[1] && (
            <ProductImage
              src={p.images[1]}
              alt=""
              fallbackIcon={p.category.emoji}
              className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {deal && !catalogOnly && <span className="rounded-md bg-sale px-2 py-0.5 text-xs font-bold text-white">{deal.pct}% off</span>}
            {p.isNew && <span className="rounded-md bg-ink px-2 py-0.5 text-xs font-semibold text-white">New</span>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1 pt-3">
          <h3 className="line-clamp-2 font-semibold leading-snug">{p.name}</h3>
          {store.features.showTeluguNames && p.nameTe && <p className="font-[family-name:var(--font-telugu)] text-sm text-muted">{p.nameTe}</p>}
          <RatingInline rating={p.rating} count={p.reviewCount} />
          <div className="mt-auto pt-1">
            {catalogOnly ? (
              <span className="text-lg font-bold">In store</span>
            ) : (
              <span className="inline-flex flex-wrap items-baseline gap-x-1">
                {(multi || isQuote) && <span className="text-sm text-muted">From</span>}
                <Price price={price} mrp={cheapest?.mrp} />
                {p.unit !== "piece" && <span className="text-sm text-muted">/ {p.unit}</span>}
              </span>
            )}
            <p className="mt-0.5 text-sm text-muted">{buyHint(p)}</p>
          </div>
        </div>
      </Link>
      {store.features.wishlist && (
        <div className="absolute right-2.5 top-2.5">
          <WishlistButton slug={p.slug} name={p.name} />
        </div>
      )}
    </article>
  );
}

export function ProductGrid({ products, className = "" }: { products: ProductView[]; className?: string }) {
  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4 ${className}`}>
      {products.map((p, i) => (
        <ProductCard key={p.slug} p={p} priority={i < 4} />
      ))}
    </div>
  );
}

/** Horizontally scrolling row on mobile, grid on desktop. */
export function ProductRow({ products }: { products: ProductView[] }) {
  return (
    <div className="scroller -mx-4 flex gap-4 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
      {products.map((p) => (
        <div key={p.slug} className="w-[46%] shrink-0 sm:w-[31%] lg:w-auto">
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  );
}
