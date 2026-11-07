import { useSyncExternalStore, type ReactElement, type ReactNode } from "react";

/**
 * The one status the visitor is being told about, as an overlay StatePanel (mounted once,
 * by StatusRegion in src/app/providers.tsx). Showing a new one replaces the old one, and
 * nothing here loads on demand: this is how the site reports a failure, so it has to work
 * when the network doesn't.
 */

/** A link when `href` is set, otherwise a button. */
export interface StateAction {
  label: ReactNode;
  href?: string;
  /** Opens in a new tab. */
  external?: boolean;
  onClick?: () => void;
}

/** Data, or a ready element with its own classes (a WhatsAppLink with `className="cta"`). */
export type StatePanelAction = StateAction | ReactElement;

export interface StatusInput {
  badge?: ReactNode;
  tone?: "ok" | "fail";
  headline: ReactNode;
  facts?: ReactNode;
  /** Above the primary action, in this order. */
  secondary?: StatePanelAction[];
  /** The bottom-most button. */
  primary?: StatePanelAction;
  /** Interrupts a screen reader rather than waiting for it. For failures. */
  urgent?: boolean;
  /** Moves focus to the headline, and back again on Close. */
  focus?: boolean;
}

export interface Status extends StatusInput {
  id: number;
}

let current: Status | null = null;
let lastId = 0;
const listeners = new Set<() => void>();

function publish(next: Status | null) {
  current = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getStatus(): Status | null {
  return current;
}

/** Replaces whatever is showing. The id lets the caller clear only its own status later. */
export function showStatus(input: StatusInput): number {
  lastId += 1;
  publish({ ...input, id: lastId });
  return lastId;
}

/** Clears the status, or with an id, only if that one is still showing. */
export function clearStatus(id?: number): void {
  if (!current || (id !== undefined && current.id !== id)) return;
  publish(null);
}

export function useStatus(): Status | null {
  return useSyncExternalStore(subscribe, getStatus, () => null);
}
