import Link from "next/link";
import { formatINR } from "@/lib/money";

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating.toFixed(1)} out of 5 stars`} role="img">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 20 20" aria-hidden>
            <defs>
              <linearGradient id={`s${i}-${Math.round(fill * 100)}`}>
                <stop offset={`${fill * 100}%`} stopColor="var(--accent)" />
                <stop offset={`${fill * 100}%`} stopColor="#d9dce1" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#s${i}-${Math.round(fill * 100)})`}
              d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z"
            />
          </svg>
        );
      })}
    </span>
  );
}

export function RatingInline({ rating, count }: { rating: number; count: number }) {
  if (!count) return null;
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      <Stars rating={rating} />
      <span className="font-medium text-ink">{rating.toFixed(1)}</span>
      <span>({count.toLocaleString("en-IN")})</span>
    </span>
  );
}

export function Price({ price, mrp, size = "md" }: { price: number; mrp?: number | null; size?: "md" | "lg" }) {
  const off = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>{formatINR(price)}</span>
      {off > 0 && (
        <>
          <span className={`text-faint line-through ${size === "lg" ? "text-base" : "text-sm"}`}>{formatINR(mrp!)}</span>
          <span className={`font-semibold text-sale ${size === "lg" ? "text-base" : "text-sm"}`}>{off}% off</span>
        </>
      )}
    </span>
  );
}

export function SectionHeader({ title, href, linkLabel = "See all" }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-bold md:text-[1.75rem]">{title}</h2>
      {href && (
        <Link href={href} className="shrink-0 text-sm font-semibold text-brand hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-ink">
                {it.label}
              </Link>
            ) : (
              <span className="text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-white px-5 py-3 font-semibold text-ink transition-colors hover:border-ink",
  /** White button on dark photo backgrounds */
  onDark: "inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-ink transition-colors hover:bg-white/90",
  whatsapp: "inline-flex items-center justify-center gap-2 rounded-lg bg-[#1fae53] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#178f44]",
};
