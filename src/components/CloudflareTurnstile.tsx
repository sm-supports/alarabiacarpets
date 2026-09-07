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
      });
    }
  }, [siteKey, action, theme]);

  useEffect(() => {
    let mounted = true;

    const initWidget = () => {
      if (mounted) {
        renderWidget();
      }
    };

    if (window.turnstile) {
      renderWidget();
      return () => {
        mounted = false;
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }

    const scriptId = "cf-turnstile-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", initWidget);

    return () => {
      mounted = false;
      script?.removeEventListener("load", initWidget);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  return <div ref={containerRef} className={className} />;
}
