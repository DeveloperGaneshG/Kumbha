import Link from "next/link";

/** Text + buttons shared by every category banner. Serializable so client banners can receive it. */
export type HeroCopy = {
  kicker?: string | null;
  kickerTe?: string | null;
  title: string;
  subtitle: string;
  badge?: string | null;
  cta: { href: string; label: string };
  secondary?: { href: string; label: string } | null;
  /** h1 on category pages, h2 inside the homepage showcase */
  headingLevel?: 1 | 2;
};

export function HeroText({ copy, dark = false }: { copy: HeroCopy; dark?: boolean }) {
  const H = copy.headingLevel === 2 ? "h2" : "h1";
  return (
    <div className="relative z-10 max-w-xl">
      {copy.badge && (
        <p className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${dark ? "bg-white text-ink" : "bg-ink text-white"}`}>
          <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
          {copy.badge}
        </p>
      )}
      {copy.kicker && (
        <p className={`mt-4 font-semibold ${dark ? "text-accent" : "text-brand"}`}>
          {copy.kicker}
          {copy.kickerTe && <span className="ml-2 font-[family-name:var(--font-telugu)] font-medium opacity-80">{copy.kickerTe}</span>}
        </p>
      )}
      <H className={`mt-3 text-[2.3rem] font-extrabold leading-[1.03] tracking-tight sm:text-5xl lg:text-[3.4rem] ${dark ? "text-white" : "text-ink"}`}>{copy.title}</H>
      <p className={`mt-4 max-w-md sm:text-lg ${dark ? "text-white/80" : "text-muted"}`}>{copy.subtitle}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <Link
          href={copy.cta.href}
          className={`inline-flex items-center justify-center rounded-lg px-5 py-3 font-semibold transition-colors ${dark ? "bg-white text-ink hover:bg-accent" : "bg-brand text-white hover:bg-brand-hover"}`}
        >
          {copy.cta.label}
        </Link>
        {copy.secondary && (
          <Link
            href={copy.secondary.href}
            className={`inline-flex items-center rounded-lg border px-5 py-3 font-semibold transition-colors ${dark ? "border-white/40 text-white hover:bg-white/10" : "border-ink/25 text-ink hover:border-ink"}`}
          >
            {copy.secondary.label}
          </Link>
        )}
      </div>
    </div>
  );
}

/** Two-column banner shell: text on the left, the category's interactive visual on the right. */
export function HeroFrame({
  children,
  visual,
  background,
  dark = false,
  decoration,
}: {
  children: React.ReactNode;
  visual: React.ReactNode;
  background: string;
  dark?: boolean;
  decoration?: React.ReactNode;
}) {
  return (
    <section className={`relative isolate overflow-hidden rounded-2xl ${dark ? "text-white" : ""}`} style={{ background }}>
      {decoration}
      <div className="grid min-h-[540px] items-center gap-10 px-6 pb-12 pt-10 sm:px-10 md:grid-cols-[1fr_1.05fr] md:gap-8 md:py-12">
        {children}
        <div className="relative">{visual}</div>
      </div>
    </section>
  );
}
