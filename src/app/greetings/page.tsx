import type { Metadata } from "next";
import Link from "next/link";
import { store } from "@/config/store";
import { Breadcrumbs, btn } from "@/components/ui";
import { GreetingMaker } from "./greeting-maker";

export const metadata: Metadata = {
  title: "Free festival greeting cards",
  description: "Make a free Diwali, Sankranti or Ganesh Chaturthi greeting card in Telugu or English and share it on WhatsApp in seconds.",
};

export default function GreetingsPage() {
  const siteUrl = store.contact.email.split("@")[1] ?? "kumbha.in";
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Greeting cards" }]} />
      <h1 className="mt-4 text-3xl font-extrabold md:text-4xl">Make a festival greeting card</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Pick a festival, add names and a message, and share it on WhatsApp or as your status. Free, in Telugu or English.
      </p>
      <div className="mt-8">
        <GreetingMaker storeName={store.name} siteUrl={siteUrl} brand={store.theme.brand} />
      </div>
      <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand-soft p-6 md:flex-row md:items-center">
        <div>
          <p className="text-lg font-bold">Send real diyas too</p>
          <p className="mt-1 text-muted">Hand-painted clay diyas and puja kits, delivered before the festival.</p>
        </div>
        <Link href="/c/diwali" className={btn.primary}>
          Shop Diwali
        </Link>
      </div>
    </div>
  );
}
