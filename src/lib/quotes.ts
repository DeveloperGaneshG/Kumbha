import { getProduct, listDeliveryRates } from "./catalog";
import { deliveryQuote, distanceKm, roadEstimateKm, tripsNeeded } from "./delivery";
import { unitPriceFor } from "./pricing";
import type { QuoteRequestInput } from "./validation";

const warehouse = () => ({
  lat: Number(process.env.WAREHOUSE_LAT ?? 16.5062),
  lng: Number(process.env.WAREHOUSE_LNG ?? 80.648),
});

/**
 * Instant indicative estimate shown to the customer right after they submit a
 * quote request. The final price is confirmed by staff (rates change daily).
 */
export async function estimateQuote(input: QuoteRequestInput) {
  const lines = [];
  let materials = 0;
  let trips = 0;
  let storefront: "FESTIVE" | "BUILD" = "FESTIVE";

  for (const l of input.lines) {
    const p = await getProduct(l.productSlug);
    if (!p) throw new Error(`Unknown product: ${l.productSlug}`);
    if (p.category.storefront === "BUILD") storefront = "BUILD";
    const unitPrice = unitPriceFor(p.basePrice, l.quantity, p.priceTiers);
    const amount = Math.round(unitPrice * l.quantity);
    materials += amount;
    const perTrip = typeof p.attributes.perTrip === "number" ? p.attributes.perTrip : null;
    // Quantity is in the product's unit (e.g. per 1000 bricks)
    const pieces = p.unit.startsWith("1000") ? l.quantity * 1000 : l.quantity;
    // TODO: size trips by the chosen vehicle's capacity, not only the product's per-trip load
    if (perTrip) trips += tripsNeeded(pieces, perTrip);
    lines.push({ productSlug: p.slug, name: p.name, unit: p.unit, quantity: l.quantity, unitPrice, amount });
  }

  let delivery: { km: number; vehicle: string; perTrip: number; trips: number; fee: number } | null = null;
  if (input.siteLat !== undefined && input.siteLng !== undefined) {
    const km = roadEstimateKm(distanceKm(warehouse(), { lat: input.siteLat, lng: input.siteLng }));
    const q = deliveryQuote(km, await listDeliveryRates(storefront));
    if (q) {
      const t = Math.max(1, trips);
      delivery = { km, vehicle: q.vehicle, perTrip: q.fee, trips: t, fee: q.fee * t };
    }
  }

  return { lines, materials, delivery, total: materials + (delivery?.fee ?? 0) };
}
