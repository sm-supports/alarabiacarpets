import { useSyncExternalStore } from "react";

/**
 * What the page is about, for the action bar (WhatsAppFloat): its WhatsApp prefill names
 * it, and its analytics sources carry the type and slug. BarIntent, rendered by the
 * product, service and category views, sets it while that page is mounted. Every other
 * page has none, and the bar falls back to the general quote message.
 */
export interface BarIntent {
  /** The name as the page shows it, in the page's language. */
  name: string;
  type: "product" | "service" | "category";
  /** The id or slug in the page's URL. */
  slug: string;
}

let current: BarIntent | null = null;
const listeners = new Set<() => void>();

function publish(next: BarIntent | null) {
  current = next;
  listeners.forEach((listener) => listener());
}

export function setBarIntent(intent: BarIntent) {
  publish(intent);
}

/** Clears `intent` only if it is still the current one, so a page that has already replaced it keeps its own. */
export function clearBarIntent(intent: BarIntent) {
  if (current === intent) publish(null);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Null on the server and while hydrating: the static bar never depends on it. */
export function useBarIntent(): BarIntent | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}
