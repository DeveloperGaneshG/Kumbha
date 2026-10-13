"use client";

/**
 * Homepage banner: every category's interactive banner, one at a time, with
 * tabs underneath. Auto-advances until the visitor interacts (hover, focus,
 * touch or a tab click), then stays put. No auto-advance with reduced motion.
 */
import { useEffect, useRef, useState } from "react";

export type ShowcaseTab = { key: string; label: string; hint: string; panel: React.ReactNode };

export function HeroShowcase({ tabs, seconds = 9 }: { tabs: ShowcaseTab[]; seconds?: number }) {
  const [active, setActive] = useState(0);
  const [hold, setHold] = useState(false); // temporary pause (hover / focus)
  const [stopped, setStopped] = useState(false); // visitor took over
  const [reduced, setReduced] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the user's motion setting once on mount
    setReduced(mq.matches);
  }, []);

  const running = !hold && !stopped && !reduced && tabs.length > 1;
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % tabs.length), seconds * 1000);
    return () => clearTimeout(t);
  }, [running, active, seconds, tabs.length]);

  const choose = (i: number, focus = false) => {
    setActive(i);
    setStopped(true);
    if (focus) tabRefs.current[i]?.focus();
  };

  return (
    <div
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocusCapture={() => setHold(true)}
      onBlurCapture={() => setHold(false)}
      onPointerDown={() => setStopped(true)}
    >
      {tabs.map((t, i) => (
        <div key={t.key} id={`showcase-${t.key}`} role="tabpanel" aria-labelledby={`showcase-tab-${t.key}`} hidden={i !== active} className="showcase-panel">
          {t.panel}
        </div>
      ))}

      <div role="tablist" aria-label="Our crafts" className="scroller -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 md:mx-0 md:grid md:px-0" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`showcase-tab-${t.key}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`showcase-${t.key}`}
              tabIndex={on ? 0 : -1}
              onClick={() => choose(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") choose((i + 1) % tabs.length, true);
                if (e.key === "ArrowLeft") choose((i - 1 + tabs.length) % tabs.length, true);
              }}
              className={`relative min-w-36 shrink-0 overflow-hidden rounded-xl border px-4 py-3 text-left transition-colors ${on ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink"}`}
            >
              <span className="block font-bold">{t.label}</span>
              <span className={`block text-xs ${on ? "text-white/70" : "text-muted"}`}>{t.hint}</span>
              {on && running && (
                <span
                  key={`${active}-${running}`}
                  aria-hidden
                  className="showcase-progress absolute inset-x-0 bottom-0 h-1 bg-accent"
                  style={{ ["--dur" as string]: `${seconds}s` }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
