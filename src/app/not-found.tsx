import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-muted">The product may have sold out for the season, or the link is out of date.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/" className={btn.primary}>
          Go to the homepage
        </Link>
        <Link href="/search" className={btn.secondary}>
          Search products
        </Link>
      </div>
    </div>
  );
}
