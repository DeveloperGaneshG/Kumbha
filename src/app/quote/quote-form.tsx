"use client";

import { useState } from "react";
import { formatINR } from "@/lib/money";
import { whatsappLink } from "@/components/whatsapp";

type ProductOption = { slug: string; name: string; unit: string; group: string };
type Line = { productSlug: string; quantity: number };
type Estimate = {
  lines: { name: string; quantity: number; unit: string; unitPrice: number; amount: number }[];
  materials: number;
  delivery: { km: number; vehicle: string; trips: number; fee: number } | null;
  total: number;
};

const input = "w-full rounded-lg border border-clay-200 bg-white px-3 py-2";

export function QuoteForm({ products, initialProduct, initialQty }: { products: ProductOption[]; initialProduct?: string; initialQty?: number }) {
  const [lines, setLines] = useState<Line[]>([
    { productSlug: products.find((p) => p.slug === initialProduct)?.slug ?? products[0]?.slug ?? "", quantity: initialQty ?? 1 },
  ]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ estimate: Estimate; summary: string } | null>(null);

  const groups = [...new Set(products.map((p) => p.group))];

  const locate = () =>
    navigator.geolocation?.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setError("Couldn't get your location — we'll use the address instead."),
    );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: f.get("name"),
        phone: f.get("phone"),
        gstin: f.get("gstin") || "",
        lines,
        siteAddress: f.get("siteAddress"),
        pincode: f.get("pincode"),
        siteLat: coords?.lat,
        siteLng: coords?.lng,
        neededBy: f.get("neededBy") || "",
        notes: f.get("notes") || undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      const issues = data.issues ? Object.entries(data.issues).map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`).join(" · ") : "";
      setError(`${data.error}${issues ? ` — ${issues}` : ""}`);
      return;
    }
    setResult(data);
    setStatus("done");
  }

  if (status === "done" && result) {
    const { estimate } = result;
    return (
      <div className="mt-8 space-y-4 rounded-2xl border border-leaf/40 bg-white p-6">
        <p className="text-xl font-semibold text-leaf">✓ Request received</p>
        <table className="w-full text-sm">
          <tbody>
            {estimate.lines.map((l) => (
              <tr key={l.name} className="border-b border-clay-100">
                <td className="py-2">
                  {l.name} <span className="text-clay-600">· {l.quantity} × {l.unit}</span>
                </td>
                <td className="py-2 text-right">{formatINR(l.amount)}</td>
              </tr>
            ))}
            {estimate.delivery && (
              <tr className="border-b border-clay-100">
                <td className="py-2">
                  Delivery · {estimate.delivery.km} km · {estimate.delivery.trips} × {estimate.delivery.vehicle}
                </td>
                <td className="py-2 text-right">{formatINR(estimate.delivery.fee)}</td>
              </tr>
            )}
            <tr>
              <td className="py-2 font-semibold">Indicative total</td>
              <td className="py-2 text-right font-semibold">{formatINR(estimate.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="text-sm text-clay-600">
          {estimate.delivery ? "" : "Delivery is added once we confirm your site location. "}Final price is confirmed by our team — rates change daily.
        </p>
        <a href={whatsappLink(result.summary)} target="_blank" rel="noopener noreferrer" className="inline-block rounded-full bg-[#25d366] px-5 py-2.5 font-semibold text-white">
          Send to us on WhatsApp for a faster reply
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-6">
      <fieldset className="space-y-3 rounded-2xl border border-clay-200 bg-white p-5">
        <legend className="px-2 font-semibold">What do you need?</legend>
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <select
              value={l.productSlug}
              onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, productSlug: e.target.value } : x)))}
              className={input}
            >
              {groups.map((g) => (
                <optgroup key={g} label={g}>
                  {products
                    .filter((p) => p.group === g)
                    .map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} (per {p.unit})
                      </option>
                    ))}
                </optgroup>
              ))}
            </select>
            <input
              type="number"
              min={1}
              step="any"
              value={l.quantity}
              onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, quantity: Number(e.target.value) } : x)))}
              className={`${input} w-28`}
              aria-label="Quantity"
            />
            {lines.length > 1 && (
              <button type="button" onClick={() => setLines(lines.filter((_, j) => j !== i))} className="px-2 text-clay-600" aria-label="Remove">
                ✕
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => setLines([...lines, { productSlug: products[0]?.slug ?? "", quantity: 1 }])} className="text-sm font-semibold text-clay-600">
          + Add another item
        </button>
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-clay-200 bg-white p-5 sm:grid-cols-2">
        <legend className="px-2 font-semibold">Your details</legend>
        <input name="name" required placeholder="Name" className={input} />
        <input name="phone" required inputMode="tel" placeholder="WhatsApp number" className={input} />
        <input name="gstin" placeholder="GSTIN (optional, for business invoice)" className={`${input} sm:col-span-2`} />
      </fieldset>

      <fieldset className="grid gap-4 rounded-2xl border border-clay-200 bg-white p-5 sm:grid-cols-2">
        <legend className="px-2 font-semibold">Delivery / site</legend>
        <textarea name="siteAddress" required placeholder="Site address / landmark" className={`${input} sm:col-span-2`} rows={2} />
        <input name="pincode" required inputMode="numeric" placeholder="Pincode" className={input} />
        <label className="text-sm">
          <span className="block text-clay-600">Needed by</span>
          <input name="neededBy" type="date" className={input} />
        </label>
        <button type="button" onClick={locate} className="rounded-lg border border-clay-300 px-3 py-2 text-sm sm:col-span-2">
          {coords ? `📍 Location added (${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)})` : "📍 Use my current location for delivery estimate"}
        </button>
        <textarea name="notes" placeholder="Anything else? (custom size, colour, unloading help…)" className={`${input} sm:col-span-2`} rows={2} />
      </fieldset>

      {error && <p className="rounded-lg bg-kumkum/10 p-3 text-sm text-kumkum">{error}</p>}
      <button disabled={status === "sending"} className="w-full rounded-full bg-clay-600 py-3 font-semibold text-white disabled:opacity-50">
        {status === "sending" ? "Sending…" : "Get my quote"}
      </button>
    </form>
  );
}
