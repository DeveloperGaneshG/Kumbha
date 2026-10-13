"use client";

import { useState } from "react";
import { store } from "@/config/store";
import type { SellingMode } from "@/lib/selling-modes";
import { PinIcon, TruckIcon } from "./icons";

/**
 * Delivery estimate by pincode. Local prefixes (configured in store config) get
 * own-vehicle delivery; others ship by courier. Swap the logic for a courier
 * serviceability API (Shiprocket, Delhivery) when you integrate one.
 */
export function PincodeCheck({ modes, fragile }: { modes: SellingMode[]; fragile?: boolean }) {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const ships = modes.includes("SHIP_TO_HOME");
  const local = modes.includes("LOCAL_DELIVERY") || modes.includes("QUOTE");

  function check(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pin)) {
      setResult({ ok: false, text: "Enter a 6-digit pincode." });
      return;
    }
    const isLocal = store.localPincodePrefixes.some((p) => pin.startsWith(p));
    if (isLocal && local) setResult({ ok: true, text: `Delivered by our own vehicle in ${store.shippingDays.local}.` });
    else if (isLocal && ships) setResult({ ok: true, text: `Delivered in ${store.shippingDays.local}.` });
    else if (ships) setResult({ ok: true, text: `Ships by courier, arrives in ${store.shippingDays.national}.${fragile ? " Double-boxed for safety." : ""}` });
    else if (modes.includes("PICKUP") || modes.includes("PRE_BOOK")) setResult({ ok: false, text: "We don't deliver this item to your area yet — you can collect it from our store." });
    else setResult({ ok: false, text: "Outside our delivery area. Message us on WhatsApp and we'll see what we can do." });
  }

  return (
    <div className="rounded-xl border border-line p-4">
      <p className="flex items-center gap-2 font-semibold">
        <TruckIcon size={20} /> Check delivery
      </p>
      <form onSubmit={check} className="mt-3 flex gap-2">
        <label className="relative flex-1">
          <span className="sr-only">Pincode</span>
          <PinIcon size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="Enter pincode"
            className="w-full rounded-lg border border-line py-2.5 pl-9 pr-3 outline-none focus:border-brand"
          />
        </label>
        <button className="rounded-lg border border-ink px-4 font-semibold hover:bg-ink hover:text-white">Check</button>
      </form>
      {result && (
        <p role="status" className={`mt-2 text-sm ${result.ok ? "text-success" : "text-muted"}`}>
          {result.text}
        </p>
      )}
    </div>
  );
}
