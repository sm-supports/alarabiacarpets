import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/**
 * False on the server and during hydration, true afterwards, without the mismatch
 * a setState-in-effect would risk. Used to keep interactive-only markup (the mobile
 * menu, extra carousel slides) out of the static HTML, which crawlers read and
 * Semrush measures for its text-to-HTML ratio.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
