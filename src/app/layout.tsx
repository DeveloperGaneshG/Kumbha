import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { listCategories } from "@/lib/catalog";
import { CartProvider } from "@/components/cart";
import { CartLink } from "@/components/cart-link";
import { WhatsAppFloat } from "@/components/whatsapp";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Kumbha";

export const metadata: Metadata = {
  title: { default: `${siteName} — Handmade, festive & building essentials`, template: `%s · ${siteName}` },
  description: "Clay pots, Diwali decor, eco-friendly Ganesh & Durga idols, Etikoppaka toys, and bricks & construction materials.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = (await listCategories()).filter((c) => !c.parentSlug);
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <header className="sticky top-0 z-30 border-b border-clay-200 bg-clay-50/95 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
              <Link href="/" className="font-[family-name:var(--font-display)] text-2xl font-bold text-clay-700">
                {siteName}
              </Link>
              <form action="/search" className="ml-auto hidden flex-1 max-w-sm sm:block">
                <input
                  name="q"
                  placeholder="Search pots, idols, bricks…"
                  className="w-full rounded-full border border-clay-200 bg-white px-4 py-2 text-sm outline-none focus:border-clay-500"
                />
              </form>
              <Link href="/build" className="ml-auto rounded-full bg-slate-build px-3 py-1.5 text-sm font-medium text-white sm:ml-0">
                🧱 Build
              </Link>
              <CartLink />
            </div>
            <nav className="mx-auto flex max-w-6xl gap-5 overflow-x-auto px-4 pb-2 text-sm text-clay-700">
              {categories.map((c) => (
                <Link key={c.slug} href={`/c/${c.slug}`} className="whitespace-nowrap hover:text-clay-500">
                  {c.name}
                </Link>
              ))}
            </nav>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-16 bg-clay-900 text-clay-100">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm sm:grid-cols-3">
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl text-white">{siteName}</p>
                <p className="mt-2 opacity-80">Handmade by local potters, idol makers and Etikoppaka artisans — and everything to build your home.</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Shop</p>
                {categories.map((c) => (
                  <Link key={c.slug} href={`/c/${c.slug}`} className="block opacity-80 hover:opacity-100">
                    {c.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-white">Help</p>
                <Link href="/quote" className="block opacity-80 hover:opacity-100">Request a bulk quote</Link>
                <Link href="/build#calculator" className="block opacity-80 hover:opacity-100">Material calculator</Link>
                <p className="opacity-80">GST invoices on all orders</p>
              </div>
            </div>
          </footer>
          <WhatsAppFloat />
        </CartProvider>
      </body>
    </html>
  );
}
