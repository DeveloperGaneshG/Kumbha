"use client";

/**
 * Free festival greeting-card maker. Draws a 1080×1350 card (WhatsApp status /
 * Instagram 4:5) on a canvas: lit diyas, rangoli dots, the store mark, the
 * greeting in Telugu or English, and a small store credit — so every card a
 * customer shares carries the brand to new people.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { btn } from "@/components/ui";
import { ChatIcon } from "@/components/icons";

type Occasion = { key: string; en: string; te: string; line: string };

const OCCASIONS: Occasion[] = [
  { key: "diwali", en: "Happy Diwali", te: "దీపావళి శుభాకాంక్షలు", line: "May every diya you light bring light, health and happiness to your home." },
  { key: "karthika", en: "Happy Karthika Pournami", te: "కార్తీక పౌర్ణమి శుభాకాంక్షలు", line: "Wishing you a month of lamps, peace and blessings." },
  { key: "sankranti", en: "Happy Sankranti", te: "సంక్రాంతి శుభాకాంక్షలు", line: "May the harvest bring sweetness and new beginnings to your family." },
  { key: "ganesh", en: "Happy Ganesh Chaturthi", te: "వినాయక చవితి శుభాకాంక్షలు", line: "May Ganesha remove every obstacle from your path." },
  { key: "dasara", en: "Happy Dasara", te: "దసరా శుభాకాంక్షలు", line: "May good always win, in your home and in your heart." },
];

const THEMES = [
  { key: "night", label: "Diya night", bg: ["#1b1310", "#3a1d12"], glow: "#f0a202", text: "#fff8ec", accent: "#f0a202" },
  { key: "marigold", label: "Marigold", bg: ["#7a1f0c", "#c2410c"], glow: "#ffd166", text: "#fff8ec", accent: "#ffd166" },
  { key: "peacock", label: "Peacock", bg: ["#06302b", "#0b6e5f"], glow: "#f0a202", text: "#f3fbf9", accent: "#ffd166" },
] as const;

const W = 1080;
const H = 1350;

// Store mark paths (same as the logo), in a 64×64 box
const MARK_FLAME = "M32 1.5C35.6 5 37.2 8 37.2 10.2A5.2 5.2 0 0 1 26.8 10.2C26.8 8 28.4 5 32 1.5Z";
const MARK_RIM = "M19.5 14H44.5A2.5 2.5 0 0 1 44.5 19H19.5A2.5 2.5 0 0 1 19.5 14Z";
const MARK_POT =
  "M25 19H39C39 21 39.6 22.6 41.2 23.6C50.6 27.2 55 34 55 41.5C55 52.6 45 61.5 32 61.5C19 61.5 9 52.6 9 41.5C9 34 13.4 27.2 22.8 23.6C24.4 22.6 25 21 25 19Z";

function drawDiya(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, glow: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  // glow
  const g = ctx.createRadialGradient(0, -38, 2, 0, -38, 70);
  g.addColorStop(0, glow + "cc");
  g.addColorStop(1, glow + "00");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, -38, 70, 0, Math.PI * 2);
  ctx.fill();
  // flame
  ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.moveTo(0, -62);
  ctx.bezierCurveTo(12, -46, 12, -32, 0, -26);
  ctx.bezierCurveTo(-12, -32, -12, -46, 0, -62);
  ctx.fill();
  ctx.fillStyle = "#fff4cc";
  ctx.beginPath();
  ctx.ellipse(0, -34, 4, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // clay bowl
  const clay = ctx.createLinearGradient(0, -24, 0, 18);
  clay.addColorStop(0, "#d0703a");
  clay.addColorStop(1, "#7a3412");
  ctx.fillStyle = clay;
  ctx.beginPath();
  ctx.moveTo(-50, -22);
  ctx.quadraticCurveTo(0, -12, 50, -22);
  ctx.quadraticCurveTo(44, 18, 0, 18);
  ctx.quadraticCurveTo(-44, 18, -50, -22);
  ctx.fill();
  // painted dots on the bowl
  ctx.fillStyle = "#ffd166";
  for (let i = -3; i <= 3; i++) {
    ctx.beginPath();
    ctx.arc(i * 11, -2 + Math.abs(i) * 1.2, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawRangoli(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  for (let ring = 1; ring <= 4; ring++) {
    const count = ring * 10;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      ctx.globalAlpha = 0.18 + ring * 0.05;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r * (ring / 4), cy + Math.sin(a) * r * (ring / 4), 4 + ring, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** Wrap text into lines that fit maxWidth. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function GreetingMaker({ storeName, siteUrl, brand }: { storeName: string; siteUrl: string; brand: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [theme, setTheme] = useState<(typeof THEMES)[number]>(THEMES[0]);
  const [lang, setLang] = useState<"te" | "en">("te");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState(OCCASIONS[0].line);
  const [status, setStatus] = useState("");

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    // background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, theme.bg[0]);
    bg.addColorStop(1, theme.bg[1]);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const halo = ctx.createRadialGradient(W / 2, 1040, 40, W / 2, 1040, 620);
    halo.addColorStop(0, theme.glow + "55");
    halo.addColorStop(1, theme.glow + "00");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
    // rangoli corners
    drawRangoli(ctx, 0, 0, 260, theme.accent);
    drawRangoli(ctx, W, 0, 260, theme.accent);
    // store mark
    ctx.save();
    ctx.translate(W / 2 - 48, 90);
    ctx.scale(1.5, 1.5);
    ctx.fillStyle = theme.accent;
    ctx.fill(new Path2D(MARK_FLAME));
    ctx.fillStyle = theme.text;
    ctx.fill(new Path2D(MARK_RIM));
    ctx.fill(new Path2D(MARK_POT));
    ctx.restore();

    ctx.textAlign = "center";
    ctx.fillStyle = theme.text;
    // recipient
    if (to.trim()) {
      ctx.font = '500 44px "Hanken Grotesk Variable", "Noto Sans Telugu", sans-serif';
      ctx.globalAlpha = 0.85;
      ctx.fillText(`Dear ${to.trim()},`, W / 2, 300);
      ctx.globalAlpha = 1;
    }
    // greeting (auto-size to fit)
    const greeting = lang === "te" ? occasion.te : occasion.en;
    let size = lang === "te" ? 92 : 112;
    const family = lang === "te" ? '"Noto Sans Telugu", "Hanken Grotesk Variable"' : '"Hanken Grotesk Variable", "Noto Sans Telugu"';
    ctx.font = `800 ${size}px ${family}, sans-serif`;
    let lines = wrap(ctx, greeting, 920);
    while (lines.length > 2 && size > 60) {
      size -= 6;
      ctx.font = `800 ${size}px ${family}, sans-serif`;
      lines = wrap(ctx, greeting, 920);
    }
    lines.forEach((l, i) => ctx.fillText(l, W / 2, 420 + i * size * 1.18));
    const afterGreeting = 420 + lines.length * size * 1.18;
    // message
    ctx.font = '400 42px "Hanken Grotesk Variable", "Noto Sans Telugu", sans-serif';
    ctx.globalAlpha = 0.9;
    wrap(ctx, message.trim(), 820)
      .slice(0, 4)
      .forEach((l, i) => ctx.fillText(l, W / 2, afterGreeting + 40 + i * 58));
    ctx.globalAlpha = 1;
    // sender
    if (from.trim()) {
      ctx.font = '700 46px "Hanken Grotesk Variable", "Noto Sans Telugu", sans-serif';
      ctx.fillStyle = theme.accent;
      ctx.fillText(`— ${from.trim()}`, W / 2, afterGreeting + 330);
    }
    // row of diyas
    const xs = [180, 360, 540, 720, 900];
    xs.forEach((x, i) => drawDiya(ctx, x, 1150 + (i % 2 ? 18 : 0), i === 2 ? 1.5 : 1.15, theme.glow));
    // store credit
    ctx.font = '600 30px "Hanken Grotesk Variable", sans-serif';
    ctx.fillStyle = theme.text;
    ctx.globalAlpha = 0.7;
    ctx.fillText(`Made free on ${siteUrl} · handmade diyas & gifts by ${storeName}`, W / 2, 1300);
    ctx.globalAlpha = 1;
  }, [occasion, theme, lang, to, from, message, siteUrl, storeName]);

  useEffect(() => {
    draw();
    // Make sure the Telugu and brand fonts are loaded, then redraw with them
    const fonts = document.fonts;
    if (fonts) {
      Promise.all([fonts.load('800 92px "Noto Sans Telugu"', "దీపావళి"), fonts.load('800 92px "Hanken Grotesk Variable"', "Happy")])
        .then(() => fonts.ready)
        .then(draw)
        .catch(() => {});
    }
  }, [draw]);

  const fileName = `${occasion.key}-greeting.png`;

  async function toBlob() {
    return new Promise<Blob | null>((res) => canvasRef.current?.toBlob(res, "image/png"));
  }

  async function share() {
    const blob = await toBlob();
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    const text = `${lang === "te" ? occasion.te : occasion.en}! Make your own free card: https://${siteUrl}/greetings`;
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text });
        setStatus("Shared!");
        return;
      } catch {
        /* user cancelled — fall through to download */
      }
    }
    download(blob);
    setStatus("Card saved — attach it in WhatsApp to send.");
  }

  function download(blob?: Blob | null) {
    const go = (b: Blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = fileName;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    if (blob) go(blob);
    else toBlob().then((b) => b && go(b));
  }

  const field = "w-full rounded-lg border border-line px-3 py-2.5 outline-none focus:border-brand";
  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
      <div className="mx-auto w-full max-w-[420px] lg:sticky lg:top-32">
        <canvas ref={canvasRef} width={W} height={H} className="w-full rounded-2xl shadow-xl" aria-label="Preview of your greeting card" role="img" />
      </div>

      <div className="space-y-6">
        <fieldset>
          <legend className="mb-2 font-semibold">Festival</legend>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.key}
                type="button"
                aria-pressed={o.key === occasion.key}
                onClick={() => {
                  if (message === occasion.line) setMessage(o.line);
                  setOccasion(o);
                }}
                className={chip(o.key === occasion.key)}
              >
                {o.en.replace("Happy ", "")}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <fieldset>
            <legend className="mb-2 font-semibold">Language</legend>
            <div className="flex gap-2">
              <button type="button" aria-pressed={lang === "te"} onClick={() => setLang("te")} className={chip(lang === "te")}>
                తెలుగు
              </button>
              <button type="button" aria-pressed={lang === "en"} onClick={() => setLang("en")} className={chip(lang === "en")}>
                English
              </button>
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 font-semibold">Colours</legend>
            <div className="flex flex-wrap gap-2">
              {THEMES.map((t) => (
                <button key={t.key} type="button" aria-pressed={t.key === theme.key} onClick={() => setTheme(t)} className={chip(t.key === theme.key)}>
                  <span aria-hidden className="mr-1.5 inline-block h-3 w-3 rounded-full align-middle" style={{ background: t.bg[1] }} />
                  {t.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">To</span>
            <input value={to} onChange={(e) => setTo(e.target.value.slice(0, 30))} placeholder="Amma & Nanna" className={field} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">From</span>
            <input value={from} onChange={(e) => setFrom(e.target.value.slice(0, 30))} placeholder="Ravi & family" className={field} />
          </label>
        </div>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Your message</span>
          <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 160))} rows={3} className={field} />
          <span className="mt-1 block text-right text-xs text-faint">{message.length}/160</span>
        </label>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={share} className={btn.whatsapp}>
            <ChatIcon size={20} /> Share on WhatsApp
          </button>
          <button type="button" onClick={() => download()} className={btn.secondary}>
            Download card
          </button>
        </div>
        {status && (
          <p role="status" className="text-sm font-semibold" style={{ color: brand }}>
            {status}
          </p>
        )}
        <p className="text-sm text-muted">Free, no sign-up. The card is made on your phone — nothing you type is sent to us.</p>
      </div>
    </div>
  );
}
