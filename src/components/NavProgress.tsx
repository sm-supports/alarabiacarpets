"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** A quick page change shows nothing. */
const SHOW_AFTER_MS = 250;
/** A navigation that never lands (an intercepted link, a hung request) must not leave it up. */
const GIVE_UP_MS = 15_000;
const WIDE = "(min-width: 768px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

/** A click that will load another page in this tab. */
function leavesPage(event: MouseEvent): boolean {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement)) return false;
  if ((link.target && link.target !== "_self") || link.hasAttribute("download")) return false;
  const url = new URL(link.href, window.location.href);
  // tel:, mailto:, wa.me's app links and the like don't load a page here.
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;
  // A hash or a query on this page: no path change would ever end the line.
  return url.pathname !== window.location.pathname;
}

/**
 * The 2px gold line at the top of a phone's screen while a tapped link loads, shown only
 * after 250 ms so a quick change shows nothing. One delegated listener covers every link,
 * Next's and plain ones, including the language switch, which is a full page load. It ends
 * when the path changes or the page goes away. Below md and with motion allowed only.
 *
 * Reads usePathname only: useSearchParams would need a Suspense boundary under static export.
 */
export default function NavProgress() {
  const pathname = usePathname();
  const path = useRef(pathname);
  const [startedOn, setStartedOn] = useState<string | null>(null);

  useEffect(() => {
    path.current = pathname;
    setStartedOn(null);
  }, [pathname]);

  useEffect(() => {
    let wait = 0;
    let cap = 0;
    const stop = () => {
      window.clearTimeout(wait);
      window.clearTimeout(cap);
      setStartedOn(null);
    };
    const onClick = (event: MouseEvent) => {
      if (window.matchMedia(WIDE).matches || window.matchMedia(REDUCED).matches || !leavesPage(event)) return;
      const from = path.current;
      window.clearTimeout(wait);
      window.clearTimeout(cap);
      wait = window.setTimeout(() => {
        if (path.current !== from) return;
        setStartedOn(from);
        cap = window.setTimeout(stop, GIVE_UP_MS);
      }, SHOW_AFTER_MS);
    };
    // Capture: a handler that stops the click on its way up can't hide it from here.
    window.addEventListener("click", onClick, true);
    window.addEventListener("pagehide", stop);
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("pagehide", stop);
      window.clearTimeout(wait);
      window.clearTimeout(cap);
    };
  }, []);

  return startedOn !== null && startedOn === pathname ? <div className="np" aria-hidden="true" /> : null;
}
