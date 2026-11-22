import { useSyncExternalStore } from "react";
import type { ClientDict } from "@/i18n/en.client";

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

export function getBarIntent(): BarIntent | null {
  return current;
}

/**
 * The bar's WhatsApp prefill below md: the quote line, a size line for the visitor to fill
 * in, then the page (origin and path only, so gclid and lang=en stay out of the chat).
 * Also used by the Get a Free Quote of S3 (TapFeedback), which stands in for the bar.
 */
export function barQuoteMessage(t: Pick<ClientDict, "common" | "bar">, intent: BarIntent | null, pathname: string): string {
  return [
    intent ? t.common.quoteMessage(intent.name) : t.common.floatMessage,
    t.bar.size,
    `${window.location.origin}${pathname}`,
  ].join("\n");
}

/** Null on the server and while hydrating: the static bar never depends on it. */
export function useBarIntent(): BarIntent | null {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null
  );
}
