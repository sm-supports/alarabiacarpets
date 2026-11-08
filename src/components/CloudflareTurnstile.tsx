"use client";

import { useEffect, useRef, useCallback, useImperativeHandle } from "react";
import type { Ref } from "react";

/** Imperative handle exposed through `ref`: lets the owning form reset the
 *  widget after a failed submit. Turnstile tokens are single-use, so a retry
 *  without a reset would replay a redeemed token and be rejected. */
export interface CloudflareTurnstileHandle {
  reset: () => void;
}

interface CloudflareTurnstileProps {
  siteKey: string;
  /** Stable surface name (1-32 chars, [A-Za-z0-9_-]). Echoed back by
   *  siteverify as `action` and checked server-side. */
  action: string;
  /** Load now. Below md the widget waits for this: it downloads about 1.6 MB, so phones
   *  fetch it on the first focus in the form or the first press of Send. At md and up it
   *  also loads when the form comes within 400px of the viewport. */
  armed?: boolean;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  /** The widget failed, or its script didn't load. */
  onError?: () => void;
  /** The browser can't run Turnstile. */
  onUnsupported?: () => void;
  /** A challenge the visitor has to tap is showing, and when it has gone. */
  onBeforeInteractive?: () => void;
  onAfterInteractive?: () => void;
  /** The visitor didn't finish the challenge in time. Reset to try again. */
  onTimeout?: () => void;
  theme?: "dark" | "light" | "auto";
  /** Widget language: "auto" follows the browser, "ar" fixes it on Arabic pages. */
  language?: string;
  className?: string;
  ref?: Ref<CloudflareTurnstileHandle>;
}

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
  "unsupported-callback"?: () => void;
  "before-interactive-callback"?: () => void;
  "after-interactive-callback"?: () => void;
  "timeout-callback"?: () => void;
  appearance?: "always" | "execute" | "interaction-only";
  theme?: "dark" | "light" | "auto";
  language?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoad?: () => void;
  }
}

const SCRIPT_ID = "cf-turnstile-script";
const DESKTOP = "(min-width: 768px)";

/**
 * Turnstile, rendered "interaction-only": nothing shows unless Cloudflare wants the
 * visitor to tap, so the form reserves no space for it.
 */
export default function CloudflareTurnstile({
  siteKey,
  action,
  armed = false,
  onVerify,
  onExpire,
  onError,
  onUnsupported,
  onBeforeInteractive,
  onAfterInteractive,
  onTimeout,
  theme = "dark",
  language = "auto",
  className = "",
  ref,
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const mountedRef = useRef(false);
  const startedRef = useRef(false);

  // The latest callbacks, so the widget (rendered once) always calls the current ones.
  const callbacks = useRef({ onVerify, onExpire, onError, onUnsupported, onBeforeInteractive, onAfterInteractive, onTimeout });
  useEffect(() => {
    callbacks.current = { onVerify, onExpire, onError, onUnsupported, onBeforeInteractive, onAfterInteractive, onTimeout };
  });

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (err) {
            console.error("Turnstile reset failed:", err);
          }
        }
      },
    }),
    []
  );

  const renderWidget = useCallback(() => {
    if (!mountedRef.current || !window.turnstile || !containerRef.current || widgetIdRef.current) return;
    try {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        appearance: "interaction-only",
        callback: (token) => callbacks.current.onVerify(token),
        "expired-callback": () => callbacks.current.onExpire?.(),
        "error-callback": () => callbacks.current.onError?.(),
        "unsupported-callback": () => callbacks.current.onUnsupported?.(),
        "before-interactive-callback": () => callbacks.current.onBeforeInteractive?.(),
        "after-interactive-callback": () => callbacks.current.onAfterInteractive?.(),
        "timeout-callback": () => callbacks.current.onTimeout?.(),
        theme,
        language,
      });
    } catch (err) {
      console.error("Turnstile render failed:", err);
      callbacks.current.onError?.();
    }
  }, [siteKey, action, theme, language]);

  // Idempotent: the first caller (armed, or the observer) starts it.
  const load = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (window.turnstile) {
      renderWidget();
      return;
    }
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      // A failed script never fires `load` or `error` again, so leaving it in the DOM
      // would make every later mount wait on it forever. Drop it so the next mount
      // (the form remounts the widget when the connection comes back) makes a fresh one.
      const created = script;
      created.addEventListener("error", () => created.remove(), { once: true });
      document.head.appendChild(script);
    }
    // A blocked script (ad-blocker, network) never fires `load`, so without this the
    // form would wait for a token that can never come.
    script.addEventListener("load", renderWidget, { once: true });
    script.addEventListener("error", () => mountedRef.current && callbacks.current.onError?.(), { once: true });
  }, [renderWidget]);

  useEffect(() => {
    mountedRef.current = true;
    // Strict mode in development unmounts and mounts again, removing the widget.
    if (startedRef.current) renderWidget();
    return () => {
      mountedRef.current = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Already gone.
        }
      }
      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  useEffect(() => {
    if (armed) load();
  }, [armed, load]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.matchMedia(DESKTOP).matches) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "400px" }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [load]);

  return <div ref={containerRef} className={className} />;
}
