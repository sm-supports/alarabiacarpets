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
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
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

export default function CloudflareTurnstile({
  siteKey,
  action,
  onVerify,
  onExpire,
  onError,
  theme = "dark",
  language = "auto",
  className = "",
  ref,
}: CloudflareTurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  }, [onVerify, onExpire, onError]);

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
    if (window.turnstile && containerRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current?.(),
        "error-callback": () => onErrorRef.current?.(),
        theme,
        language,
      });
    }
  }, [siteKey, action, theme, language]);

  // Turnstile downloads about 1.6 MB, so it waits until the form is near the
  // viewport. Submit stays disabled until there is a token, so nothing gets through
  // before it loads.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mounted = true;
    let script: HTMLScriptElement | null = null;

    const initWidget = () => {
      if (mounted) {
        renderWidget();
      }
    };

    // A blocked script (ad-blocker, network) never fires `load`, so without
    // this the form would sit with a disabled button and no explanation.
    const handleScriptError = () => {
      if (mounted) {
        onErrorRef.current?.();
      }
    };

    const load = () => {
      if (window.turnstile) {
        renderWidget();
        return;
      }

      const scriptId = "cf-turnstile-script";
      script = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        // A failed script never fires `load` or `error` again, so leaving it in
        // the DOM would make every later mount wait on it forever. Drop it so
        // the next mount creates a fresh one. Registered here rather than in
        // handleScriptError so it still runs if this component has unmounted.
        const created = script;
        created.addEventListener("error", () => created.remove(), { once: true });
        document.head.appendChild(script);
      }

      script.addEventListener("load", initWidget);
      script.addEventListener("error", handleScriptError);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        load();
      },
      { rootMargin: "400px" }
    );
    observer.observe(container);

    return () => {
      mounted = false;
      observer.disconnect();
      script?.removeEventListener("load", initWidget);
      script?.removeEventListener("error", handleScriptError);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return <div ref={containerRef} className={className} />;
}
