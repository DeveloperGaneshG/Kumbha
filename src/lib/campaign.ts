import { store } from "@/config/store";

const IST = "+05:30";

/** "Order by 3 Nov for delivery before Diwali" — null once the date has passed. */
export function orderByNotice(now = new Date()) {
  const { orderBy, name, date } = store.campaign;
  if (!orderBy) return null;
  const cutoff = new Date(`${orderBy}T23:59:59${IST}`);
  const festival = new Date(`${date}T00:00:00${IST}`);
  if (now > cutoff || now > festival) return null;
  const daysLeft = Math.ceil((cutoff.getTime() - now.getTime()) / 86_400_000);
  const label = cutoff.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
  return { label, daysLeft, festival: name, text: `Order by ${label} for delivery before ${name}` };
}

/** Days until the festival itself (for the hero countdown). */
export function daysUntilFestival(now = new Date()) {
  const ms = new Date(`${store.campaign.date}T00:00:00${IST}`).getTime() - now.getTime();
  return Math.ceil(ms / 86_400_000);
}

/** Spend-more-save-more: the discount earned now and the next tier to unlock. Amounts in paise. */
export function offerProgress(subtotal: number) {
  const tiers = [...store.offerTiers].sort((a, b) => a.minSubtotal - b.minSubtotal);
  const earned = [...tiers].reverse().find((t) => subtotal >= t.minSubtotal) ?? null;
  const next = tiers.find((t) => subtotal < t.minSubtotal) ?? null;
  return {
    percent: earned?.percent ?? 0,
    discount: earned ? Math.round((subtotal * earned.percent) / 100) : 0,
    next: next ? { percent: next.percent, remaining: next.minSubtotal - subtotal, progress: subtotal / next.minSubtotal } : null,
  };
}
