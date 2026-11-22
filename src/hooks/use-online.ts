import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * Whether the browser has a network. False is reliable: there is none. True only means
 * there is one, not that the site answers, so a request still has to handle failing.
 * True on the server and while hydrating, so the static HTML never says offline.
 *
 * For what to show. To act once when the connection changes, listen for the `online`
 * and `offline` events instead: a quick drop and return can come and go between renders.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine !== false,
    () => true
  );
}
