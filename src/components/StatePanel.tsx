"use client";

import { isValidElement, useEffect, useId, useRef, type ReactNode } from "react";
import { XInline } from "@/components/icons";
import type { StatePanelAction, StatusInput } from "@/lib/status";

interface StatePanelProps extends Pick<StatusInput, "badge" | "tone" | "headline" | "secondary" | "primary"> {
  /**
   * overlay: fixed to the bottom of the screen, always with a Close.
   * inline: in the flow, next to what it is about. Stays until resolved when it holds
   * the visitor's text, so give it no Close unless the state has one.
   * page: the whole body of a page, never with a Close.
   */
  variant: "overlay" | "inline" | "page";
  /** The headline's element, so the page keeps one h1 and no skipped levels. */
  headingAs?: "h1" | "h2" | "h3" | "h4";
  /** Moves focus to the headline when the panel appears. */
  focusHeadline?: boolean;
  /** Shows a 44px Close at the top end. Focus returns where it was. */
  onClose?: () => void;
  closeLabel?: string;
  /** The facts. Put emails, names and references in <bdi> so they don't reorder in Arabic. */
  children?: ReactNode;
}

const VARIANT_CLASS = { overlay: "sp sp-overlay", inline: "sp sp-inline", page: "sp sp-page" };

function Action({ action, className }: { action: StatePanelAction; className: string }) {
  if (isValidElement(action)) return action;
  const { label, href, external, onClick } = action;
  if (!href) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {label}
      </button>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {label}
    </a>
  );
}

/**
 * The one way the site reports what just happened: a sent message, a failure, an error
 * page. Badge, headline, facts, then the buttons with the primary at the bottom.
 *
 * Takes all its words as props and reads no context, so any language or screen can use it.
 */
export default function StatePanel({
  variant,
  badge,
  tone,
  headline,
  headingAs: Heading = "h2",
  focusHeadline = false,
  secondary,
  primary,
  onClose,
  closeLabel,
  children,
}: StatePanelProps) {
  const headingId = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const active = document.activeElement;
    // Strict mode runs this twice, and by the second run the headline itself is active.
    if (active instanceof HTMLElement && active !== headingRef.current) returnTo.current = active;
    if (focusHeadline) headingRef.current?.focus();
  }, [focusHeadline]);

  const close = () => {
    onClose?.();
    if (returnTo.current?.isConnected) returnTo.current.focus();
  };

  return (
    <div role="group" aria-labelledby={headingId} data-state-panel={variant} className={VARIANT_CLASS[variant]}>
      <div className={onClose ? "pe-10" : undefined}>
        {badge && <p className={tone === "fail" ? "sp-badge sp-badge-fail" : "sp-badge"}>{badge}</p>}
        <Heading id={headingId} ref={headingRef} tabIndex={-1} className="sp-title">
          {headline}
        </Heading>
      </div>
      {/* After the headline in the page order: Tab from a focused headline lands here. */}
      {onClose && (
        <button type="button" className="sp-close" aria-label={closeLabel} onClick={close}>
          <XInline className="h-5 w-5" />
        </button>
      )}
      {children && <div className="sp-facts">{children}</div>}
      {(secondary?.length || primary) && (
        <div className="sp-actions">
          {secondary?.map((action, index) => <Action key={index} action={action} className="cta-2" />)}
          {primary && <Action action={primary} className="cta" />}
        </div>
      )}
    </div>
  );
}
