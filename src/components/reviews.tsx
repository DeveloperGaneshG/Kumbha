import type { ReviewView } from "@/lib/catalog";
import { CheckIcon } from "./icons";
import { Stars } from "./ui";

/**
 * Rating summary + review list. The distribution is estimated from the
 * average when only aggregate numbers exist (demo data); with real reviews
 * in the database, compute it from the rows.
 */
function distribution(avg: number, count: number) {
  const weights = [5, 4, 3, 2, 1].map((s) => Math.exp(-Math.abs(s - avg) * 1.6));
  const total = weights.reduce((a, b) => a + b, 0);
  return weights.map((w) => Math.round((w / total) * count));
}

export function Reviews({ rating, count, reviews }: { rating: number; count: number; reviews: ReviewView[] }) {
  if (!count && reviews.length === 0) {
    return <p className="text-muted">No reviews yet. Bought this? Your review helps other shoppers.</p>;
  }
  const dist = distribution(rating, count);
  const max = Math.max(...dist, 1);
  return (
    <div className="grid gap-10 md:grid-cols-[280px_1fr]">
      <div>
        <p className="text-5xl font-extrabold">{rating.toFixed(1)}</p>
        <Stars rating={rating} size={20} />
        <p className="mt-1 text-sm text-muted">{count.toLocaleString("en-IN")} ratings</p>
        <ul className="mt-5 space-y-1.5">
          {dist.map((n, i) => (
            <li key={i} className="flex items-center gap-3 text-sm">
              <span className="w-3 text-muted">{5 - i}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / max) * 100}%` }} />
              </span>
              <span className="w-10 text-right text-muted">{n}</span>
            </li>
          ))}
        </ul>
      </div>
      <ul className="divide-y divide-line">
        {reviews.map((r) => (
          <li key={r.name + r.date} className="py-5 first:pt-0">
            <div className="flex items-center gap-3">
              <Stars rating={r.rating} />
              {r.title && <p className="font-semibold">{r.title}</p>}
            </div>
            {r.body && <p className="mt-2 max-w-prose text-[15px] leading-relaxed">{r.body}</p>}
            <p className="mt-2 flex flex-wrap items-center gap-x-3 text-sm text-muted">
              <span>
                {r.name}
                {r.city && `, ${r.city}`}
              </span>
              <span>{new Date(r.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              {r.verified && (
                <span className="inline-flex items-center gap-1 text-success">
                  <CheckIcon size={14} /> Verified purchase
                </span>
              )}
            </p>
          </li>
        ))}
        {reviews.length === 0 && <li className="text-muted">Written reviews will appear here.</li>}
      </ul>
    </div>
  );
}
