"use client";

/**
 * Quick "share your requirement" form for builders. Sends the details to the
 * team on WhatsApp in one tap; for a full quote with delivery estimate, the
 * customer uses /quote.
 */
import { useState } from "react";
import Link from "next/link";
import { whatsappLink } from "./whatsapp";
import { btn } from "./ui";
import { ChatIcon } from "./icons";

export function RequirementForm({ materials, phone }: { materials: string[]; phone: string }) {
  const [error, setError] = useState("");
  const field = "w-full rounded-lg border border-line bg-white px-3 py-2.5 outline-none focus:border-brand";

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const mobile = String(f.get("phone") ?? "").replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a 10-digit mobile number so we can call you back.");
      return;
    }
    setError("");
    const text = [
      "New material requirement",
      `Name: ${f.get("name")}`,
      `Phone: ${mobile}`,
      `Need: ${f.get("material")} — ${f.get("qty") || "quantity to confirm"}`,
      `Site pincode: ${f.get("pincode") || "—"}`,
      "Please call me back with a price.",
    ].join("\n");
    window.open(whatsappLink(text), "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} id="requirement" className="scroll-mt-32 rounded-2xl border border-line p-6 md:p-8">
      <h2 className="text-2xl font-bold">Share your requirement</h2>
      <p className="mt-1 text-muted">Tell us what you need and we&apos;ll call you back with a price — usually within 2 hours.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name" aria-label="Your name" className={field} />
        <input name="phone" required inputMode="tel" placeholder="Mobile number" aria-label="Mobile number" className={field} />
        <select name="material" aria-label="Material" className={field} defaultValue={materials[0]}>
          {materials.map((m) => (
            <option key={m}>{m}</option>
          ))}
          <option>Other / multiple</option>
        </select>
        <input name="qty" placeholder="Quantity (e.g. 6,000 bricks)" aria-label="Quantity" className={field} />
        <input name="pincode" inputMode="numeric" placeholder="Site pincode" aria-label="Site pincode" className={`${field} sm:col-span-2`} />
      </div>
      {error && <p className="mt-3 text-sm font-semibold text-sale">{error}</p>}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button className={btn.whatsapp}>
          <ChatIcon size={20} /> Send on WhatsApp
        </button>
        <a href={`tel:${phone.replace(/\s/g, "")}`} className={btn.secondary}>
          Call {phone}
        </a>
        <Link href="/quote" className="text-sm font-semibold text-brand hover:underline">
          Or get a detailed quote with delivery
        </Link>
      </div>
    </form>
  );
}
