import { store } from "@/config/store";

/**
 * Kumbha mark: a kalash (the "kumbha" pot) crowned with a diya flame.
 * The pot uses currentColor so it follows the text colour it sits in; the
 * band is cut out with `cutColor` (match the background) and the flame uses
 * the accent colour. To rebrand, replace these paths or the whole component.
 */
export function LogoMark({ size = 36, className = "", cutColor = "#fff" }: { size?: number; className?: string; cutColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden focusable="false">
      <path d="M32 1.5C35.6 5 37.2 8 37.2 10.2A5.2 5.2 0 0 1 26.8 10.2C26.8 8 28.4 5 32 1.5Z" fill="var(--accent)" />
      <path d="M19.5 14H44.5A2.5 2.5 0 0 1 44.5 19H19.5A2.5 2.5 0 0 1 19.5 14Z" fill="currentColor" />
      <path
        d="M25 19H39C39 21 39.6 22.6 41.2 23.6C50.6 27.2 55 34 55 41.5C55 52.6 45 61.5 32 61.5C19 61.5 9 52.6 9 41.5C9 34 13.4 27.2 22.8 23.6C24.4 22.6 25 21 25 19Z"
        fill="currentColor"
      />
      <path d="M11.5 39.5Q32 47 52.5 39.5" stroke={cutColor} strokeWidth="3.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Mark + store name. */
export function Logo({ size = 34, className = "", cutColor }: { size?: number; className?: string; cutColor?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <LogoMark size={size} cutColor={cutColor} />
      <span className="text-[1.55rem] font-extrabold leading-none tracking-tight">{store.name}</span>
    </span>
  );
}
