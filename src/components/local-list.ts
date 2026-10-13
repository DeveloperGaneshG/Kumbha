"use client";

/**
 * Tiny localStorage-backed lists (wishlist, recently viewed) that stay in sync
 * across components and tabs. No account needed; move to the database once
 * customers can log in.
 */
import { useCallback, useSyncExternalStore } from "react";

const EVENT = "local-list-change";
const EMPTY: string[] = [];
const cache = new Map<string, { raw: string | null; value: string[] }>();

function read(key: string): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return EMPTY;
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value: string[] = EMPTY;
  try {
    value = raw ? (JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache.set(key, { raw, value });
  return value;
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useLocalList(key: string) {
  const items = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => EMPTY,
  );
  const toggle = useCallback(
    (slug: string) => {
      const cur = read(key);
      write(key, cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur]);
    },
    [key],
  );
  const push = useCallback(
    (slug: string, max = 12) => {
      const cur = read(key).filter((s) => s !== slug);
      write(key, [slug, ...cur].slice(0, max));
    },
    [key],
  );
  return { items, toggle, push, has: (slug: string) => items.includes(slug) };
}

export const WISHLIST_KEY = "store-wishlist-v1";
export const RECENT_KEY = "store-recent-v1";
