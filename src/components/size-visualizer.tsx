/** Idol height next to a 5'6" person, so customers can judge size before booking. */
export function SizeVisualizer({ heightFt, emoji = "🛕" }: { heightFt: number; emoji?: string }) {
  const personFt = 5.5;
  const maxFt = Math.max(personFt, heightFt) * 1.1;
  const scale = 180 / maxFt;
  const personH = personFt * scale;
  const idolH = heightFt * scale;
  return (
    <figure className="rounded-2xl border border-line p-4">
      <svg viewBox="0 0 220 200" className="h-44 w-full" role="img" aria-label={`Idol ${heightFt} ft next to a 5.5 ft person`}>
        <line x1="0" y1="195" x2="220" y2="195" stroke="#e6e8ec" strokeWidth="2" />
        <g transform={`translate(60, ${195 - personH})`} fill="#d5d8de">
          <circle cx="0" cy={personH * 0.07} r={personH * 0.07} />
          <rect x={-personH * 0.09} y={personH * 0.15} width={personH * 0.18} height={personH * 0.42} rx="6" />
          <rect x={-personH * 0.08} y={personH * 0.55} width={personH * 0.07} height={personH * 0.45} rx="3" />
          <rect x={personH * 0.01} y={personH * 0.55} width={personH * 0.07} height={personH * 0.45} rx="3" />
        </g>
        <rect x="120" y={195 - idolH} width="70" height={idolH} rx="8" fill="var(--brand-soft)" stroke="var(--brand)" strokeDasharray="4 3" />
        <text x="155" y={195 - idolH / 2} textAnchor="middle" dominantBaseline="middle" fontSize={Math.min(40, idolH * 0.6)}>
          {emoji}
        </text>
        <text x="60" y="12" textAnchor="middle" fontSize="11" fill="#5e6470">
          5.5 ft
        </text>
        <text x="155" y={Math.max(12, 190 - idolH)} textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--brand)">
          {heightFt} ft
        </text>
      </svg>
      <figcaption className="text-center text-sm text-muted">Size compared with an average adult</figcaption>
    </figure>
  );
}
