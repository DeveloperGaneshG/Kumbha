import type { Metadata, Viewport } from "next";
import Link from "next/link";
// Fonts are bundled with the app (no Google Fonts request): faster, private, works offline
import "@fontsource-variable/hanken-grotesk";
import "@fontsource/noto-sans-telugu/400.css";
import "@fontsource/noto-sans-telugu/600.css";
import "@fontsource/noto-sans-telugu/800.css";
import "./globals.css";
import { listCategories } from "@/lib/catalog";
import { store } from "@/config/store";
import { CartProvider } from "@/components/cart";
import { HeaderActions, MobileNav } from "@/components/header-actions";
import { WhatsAppFloat } from "@/components/whatsapp";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  // Absolute URLs for share previews (WhatsApp, Facebook). Set NEXT_PUBLIC_SITE_URL to your domain in production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: `${store.name} — ${store.tagline}`, template: `%s | ${store.name}` },
  description: store.description,
  openGraph: { siteName: store.name, type: "website" },
};

export const viewport: Viewport = { themeColor: store.theme.brand };

// Brand colours from the store config → CSS variables used by every component
const themeVars = {
  "--brand": store.theme.brand,
  "--brand-hover": store.theme.brandHover,
  "--brand-soft": store.theme.brandSoft,
  "--accent": store.theme.accent,
  "--sale": store.theme.sale,
} as React.CSSProperties;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = (await listCategories()).filter((c) => !c.parentSlug);
  return (
    <html lang="en" style={themeVars}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body className="flex min-h-screen flex-col pb-16 md:pb-0">
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
            Skip to content
          </a>
          {store.announcement && <p className="bg-ink px-4 py-2 text-center text-[13px] font-medium text-white">{store.announcement}</p>}

          <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-6">
              <Link href="/" aria-label={`${store.name} home`} className="shrink-0 text-brand">
                <Logo />
              </Link>
              <form action="/search" role="search" className="relative hidden flex-1 md:block md:max-w-xl">
                <SearchIcon size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  name="q"
                  type="search"
                  placeholder="Search for matkas, diyas, Ganesh idols, bricks…"
                  aria-label="Search products"
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pl-10 pr-4 text-[15px] outline-none transition focus:border-brand focus:bg-white"
                />
              </form>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/quote" className="hidden rounded-lg px-3 py-2 text-sm font-semibold hover:bg-surface lg:block">
                  Bulk orders
                </Link>
                <HeaderActions wishlist={store.features.wishlist} />
              </div>
            </div>
            <nav aria-label="Categories" className="mx-auto max-w-7xl px-4">
              <ul className="scroller -mb-px flex gap-6 overflow-x-auto text-[15px]">
                {[
                  ...categories.map((c) => ({ href: c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`, label: c.name })),
                  { href: "/combos", label: "Combos" },
                  { href: "/gifts", label: "Gift finder" },
                  { href: "/greetings", label: "Greetings" },
                ].map((l) => (
                  <li key={l.href} className="shrink-0">
                    <Link
                      href={l.href}
                      className="block border-b-2 border-transparent pb-2.5 font-medium text-muted transition-colors hover:border-ink hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </header>

          <main id="main" className="flex-1">
            {children}
          </main>

          <footer className="mt-20 border-t border-line bg-surface">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Logo size={30} cutColor="#f5f6f8" className="text-brand" />
                <p className="mt-2 max-w-xs text-sm text-muted">{store.description}</p>
              </div>
              <div>
                <p className="font-semibold">Shop</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  {categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={c.storefront === "BUILD" ? "/build" : `/c/${c.slug}`} className="hover:text-ink">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold">Help</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li><Link href="/gifts" className="hover:text-ink">Gift finder</Link></li>
                  <li><Link href="/combos" className="hover:text-ink">Combos</Link></li>
                  <li><Link href="/greetings" className="hover:text-ink">Free greeting cards</Link></li>
                  <li><Link href="/quote" className="hover:text-ink">Bulk & wholesale quotes</Link></li>
                  <li><Link href="/build#calculator" className="hover:text-ink">Brick calculator</Link></li>
                  <li><Link href="/wishlist" className="hover:text-ink">Saved items</Link></li>
                  <li><Link href="/cart" className="hover:text-ink">Cart</Link></li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Contact</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>{store.contact.phone}</li>
                  <li>{store.contact.email}</li>
                  <li>{store.contact.address}</li>
                  <li>{store.contact.hours}</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-line">
              <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-faint">
                © {new Date().getFullYear()} {store.name}. Prices include GST. Sample photos from Unsplash.
              </p>
            </div>
          </footer>

          <WhatsAppFloat />
          <MobileNav />
        </CartProvider>
      </body>
    </html>
  );
}
