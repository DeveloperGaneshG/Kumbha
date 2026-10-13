/** Inline stroke icons (no icon-font dependency). */
type P = { size?: number; className?: string };
const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export const SearchIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const HeartIcon = ({ size, className, filled }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7-4.4-9.2-8.6C1.3 8.5 3 5 6.4 5c2 0 3.2 1.1 3.9 2.2h3.4C14.4 6.1 15.6 5 17.6 5 21 5 22.7 8.5 21.2 11.4 19 15.6 12 20 12 20Z" /></svg>
);
export const CartIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.7a1.5 1.5 0 0 0 1.5-1.1L21 8H6.2" /><circle cx="9.5" cy="20" r="1.2" /><circle cx="17.5" cy="20" r="1.2" /></svg>
);
export const TruckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></svg>
);
export const ShieldIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const HandIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-.5a6.5 6.5 0 0 1-5.4-2.9L3.7 14.5a1.6 1.6 0 0 1 2.6-1.8L7 13.6" /></svg>
);
export const ReceiptIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3" /></svg>
);
export const ChatIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19z" /></svg>
);
export const HomeIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" /></svg>
);
export const GridIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></svg>
);
export const ShareIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></svg>
);
export const PinIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const CheckIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const FilterIcon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}><path d="M4 6h16M7 12h10M10 18h4" /></svg>
);
