export type LatLng = { lat: number; lng: number };

export type DeliveryRate = {
  vehicle: string;
  maxKm: number;
  baseFee: number;
  perKmFee: number;
  freeKm: number;
  capacity?: string | null;
};

/** Straight-line distance in km (haversine). Use a road-distance API in production. */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Roads are ~1.3x straight-line distance on average. */
export const roadEstimateKm = (straightKm: number) => Math.round(straightKm * 1.3 * 10) / 10;

/**
 * Pick the cheapest rate band that covers the distance and return the fee per trip.
 * Returns null when the site is outside every band (show "call us").
 */
export function deliveryQuote(km: number, rates: DeliveryRate[]) {
  const options = rates
    .filter((r) => km <= r.maxKm)
    .map((r) => ({
      vehicle: r.vehicle,
      capacity: r.capacity ?? null,
      fee: r.baseFee + Math.max(0, Math.ceil(km - r.freeKm)) * r.perKmFee,
    }))
    .sort((a, b) => a.fee - b.fee);
  return options[0] ?? null;
}

/** Number of trips needed when a load carries `perTrip` units. */
export const tripsNeeded = (quantity: number, perTrip: number) => Math.max(1, Math.ceil(quantity / perTrip));
