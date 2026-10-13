import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-7xl">🏺</p>
      <h1 className="mt-4 text-3xl">This pot is empty</h1>
      <p className="mt-2 text-clay-700">We couldn&apos;t find that page.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-clay-600 px-6 py-2.5 font-semibold text-white">
        Back to the shop
      </Link>
    </div>
  );
}
