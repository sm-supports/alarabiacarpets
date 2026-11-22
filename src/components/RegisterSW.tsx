"use client";

import { useEffect } from "react";
import { SERVICE_WORKER } from "@/lib/site";

function apply() {
  try {
    // Missing in some in-app browsers; Firefox throws here when site data is blocked.
    const workers = navigator.serviceWorker;
    if (!workers) return;
    if (SERVICE_WORKER) {
      workers.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch(() => {});
    } else {
      workers.getRegistrations().then(
        (registrations) => registrations.forEach((registration) => registration.unregister().catch(() => {})),
        () => {}
      );
    }
  } catch {
    // No service workers here.
  }
}

/**
 * Registers public/sw.js, or removes it, as SERVICE_WORKER in lib/site.ts says. Waits for
 * the load event so nothing the page needs waits on it, and renders nothing.
 */
export default function RegisterSW() {
  useEffect(() => {
    if (document.readyState === "complete") {
      apply();
      return;
    }
    window.addEventListener("load", apply, { once: true });
    return () => window.removeEventListener("load", apply);
  }, []);
  return null;
}
