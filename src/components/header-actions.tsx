"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart";
import { useLocalList, WISHLIST_KEY } from "./local-list";
import { CartIcon, GridIcon, HeartIcon, HomeIcon, SearchIcon } from "./icons";

function Badge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
      {n > 99 ? "99+" : n}
    </span>
  );
}

export function HeaderActions({ wishlist }: { wishlist: boolean }) {
  const { count } = useCart();
  const { items } = useLocalList(WISHLIST_KEY);
  return (
    <div className="flex items-center gap-1">
      {wishlist && (
        <Link href="/wishlist" className="relative hidden rounded-lg p-2.5 hover:bg-surface sm:block" aria-label={`Wishlist, ${items.length} items`}>
          <HeartIcon size={22} />
          <Badge n={items.length} />
        </Link>
      )}
      <Link href="/cart" className="relative rounded-lg p-2.5 hover:bg-surface" aria-label={`Cart, ${count} items`}>
        <CartIcon size={22} />
        <Badge n={count} />
      </Link>
    </div>
  );
}

/** App-style bottom navigation on phones. */
export function MobileNav() {
  const path = usePathname();
  const { count } = useCart();
  const { items } = useLocalList(WISHLIST_KEY);
  const tabs = [
    { href: "/", label: "Home", icon: <HomeIcon />, n: 0 },
    { href: "/categories", label: "Categories", icon: <GridIcon />, n: 0 },
    { href: "/search", label: "Search", icon: <SearchIcon />, n: 0 },
    { href: "/wishlist", label: "Saved", icon: <HeartIcon />, n: items.length },
    { href: "/cart", label: "Cart", icon: <CartIcon />, n: count },
  ];
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = t.href === "/" ? path === "/" : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link href={t.href} className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${active ? "text-brand" : "text-muted"}`}>
                <span className="relative">
                  {t.icon}
                  <Badge n={t.n} />
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
