import { clearStatus, getStatus, showStatus, type StatusInput } from "@/lib/status";
import { onTap, type Tap } from "@/lib/tap";

/**
 * What a phone says after a WhatsApp or Call tap: S1 to S4 in the plan's state catalogue,
 * as overlay statuses (lib/status.ts). WhatsAppLink and CallLink report their taps through
 * lib/tap.ts; TapFeedback, in src/app/providers.tsx, supplies the words and installs this.
 *
 *   S4  A WhatsApp tap while navigator.onLine is false, at once. The tap still goes through.
 *   S2  The page is still in front 2.5 s after a WhatsApp tap: WhatsApp may not have opened.
 *   S1  Back on the page after WhatsApp opened. Once per session.
 *   S3  Back within 20 s of leaving for a call: it may not have gone through.
 *
 * Below md only. One status at a time: a form state in view outranks all of these, then
 * S4, S2, S1, S3, and a lower one never replaces a higher one or a status raised elsewhere.
 * A tap inside a form or page state (the Sent panel's follow-up, a failure's "Send this on
 * WhatsApp", the error page's Call) gets nothing here: that state already says what
 * happened and what comes next. So S1 never follows the follow-up, and never follows S4.
 */

export type FeedbackKind = "s1" | "s2" | "s3" | "s4";

/** The WhatsApp link that was tapped, so S1 can open the same chat again. */
export interface WhatsAppTap {
  href: string;
  source: string;
}

/** The words for one status. `done` clears it: give it to the status's own actions. */
export type FeedbackView = (kind: FeedbackKind, tap: WhatsAppTap | null, done: () => void) => StatusInput;

const RANK: Record<FeedbackKind, number> = { s4: 4, s2: 3, s1: 2, s3: 1 };

const WIDE = "(min-width: 768px)";
/** S2: how long the page may stay in front after a WhatsApp tap. */
const STILL_HERE_MS = 2500;
/** The page has to go to the background this soon after the tap, or the tap is forgotten. */
const LEAVE_WITHIN_MS = 10_000;
/** S3: back from a call this quickly means it probably didn't connect. */
const CALL_BACK_MS = 20_000;
const S1_KEY = "tap-feedback-s1";

type Pending =
  | { kind: "whatsapp"; tap: WhatsAppTap; at: number; hiddenAt: number | null; timer: number }
  | { kind: "call"; at: number; hiddenAt: number | null };

let view: FeedbackView | null = null;
let pending: Pending | null = null;
let shown: { kind: FeedbackKind; id: number } | null = null;
/** Also kept here, for a browser that blocks sessionStorage. */
let s1Seen = false;

const narrow = () => !window.matchMedia(WIDE).matches;

function s1Done(): boolean {
  if (s1Seen) return true;
  try {
    return sessionStorage.getItem(S1_KEY) === "1";
  } catch {
    return false;
  }
}

function markS1() {
  s1Seen = true;
  try {
    sessionStorage.setItem(S1_KEY, "1");
  } catch {
    // Storage blocked: this page load still remembers it.
  }
}

/** Inside a form or page StatePanel, whose own state answers the tap. */
function bound(link: Element): boolean {
  return link.closest('[data-state-panel]:not([data-state-panel="overlay"])') !== null;
}

/** A contact form state (data-form-state, ContactSection) on screen right now. */
function formInView(): boolean {
  return Array.from(document.querySelectorAll("[data-form-state]")).some((element) => {
    const box = element.getBoundingClientRect();
    return box.height > 0 && box.bottom > 0 && box.top < window.innerHeight;
  });
}

function raise(kind: FeedbackKind, tap: WhatsAppTap | null) {
  if (!view || !narrow() || formInView()) return;
  const current = getStatus();
  if (current && (shown?.id !== current.id || RANK[shown.kind] > RANK[kind])) return;
  if (kind === "s1") {
    if (s1Done()) return;
    markS1();
  }
  let id = 0;
  const input = view(kind, tap, () => clearStatus(id));
  id = showStatus(input);
  shown = { kind, id };
}

/** Clears the tap feedback on screen, if any. */
function dismiss() {
  if (shown) clearStatus(shown.id);
  shown = null;
}

/** Drops the tap being followed, so nothing more is said about it. */
export function forgetTap() {
  if (pending?.kind === "whatsapp") window.clearTimeout(pending.timer);
  pending = null;
}

/**
 * A WhatsApp link was tapped (after hydration, when it points at wa.me). Never stops the
 * tap, offline included: S4 only warns, and the app may open anyway.
 * @param conversion false for the Sent panel's follow-up, which gets no feedback.
 */
function noteWhatsAppTap(link: Element, tap: WhatsAppTap, conversion: boolean) {
  forgetTap();
  if (!narrow() || !conversion || bound(link)) return;
  if (navigator.onLine === false) {
    raise("s4", tap);
    return;
  }
  const next: Pending = { kind: "whatsapp", tap, at: Date.now(), hiddenAt: null, timer: 0 };
  // Without focus, something else is in front (an app chooser, a new tab): not "still here".
  next.timer = window.setTimeout(() => {
    if (pending === next && next.hiddenAt === null && document.visibilityState === "visible" && document.hasFocus()) {
      raise("s2", tap);
    }
  }, STILL_HERE_MS);
  pending = next;
}

/** A tel: link was tapped. */
function noteCallTap(link: Element) {
  forgetTap();
  if (!narrow() || bound(link)) return;
  pending = { kind: "call", at: Date.now(), hiddenAt: null };
}

function onTapped(tap: Tap) {
  if (tap.kind === "call") noteCallTap(tap.link);
  else noteWhatsAppTap(tap.link, { href: tap.href, source: tap.source }, tap.conversion);
}

function onVisibility() {
  const tap = pending;
  if (!tap) return;
  const now = Date.now();
  if (document.visibilityState === "hidden") {
    if (tap.hiddenAt !== null) return;
    if (now - tap.at > LEAVE_WITHIN_MS) {
      forgetTap();
      return;
    }
    tap.hiddenAt = now;
    if (tap.kind === "whatsapp") {
      window.clearTimeout(tap.timer);
      // WhatsApp opened after all, later than S2 expected.
      if (shown?.kind === "s2") dismiss();
    }
    return;
  }
  if (tap.hiddenAt === null) return;
  forgetTap();
  if (tap.kind === "whatsapp") raise("s1", tap.tap);
  else if (now - tap.hiddenAt < CALL_BACK_MS) raise("s3", null);
}

/** The visitor has moved on: typing, sending the form, or opening the menu. */
function onFocusIn(event: FocusEvent) {
  if (event.target instanceof Element && event.target.closest('input, textarea, select, [role="dialog"]')) dismiss();
}

function onWide(event: MediaQueryListEvent) {
  if (!event.matches) return;
  forgetTap();
  dismiss();
}

/** Called once by TapFeedback. Returns the cleanup. */
export function installTapFeedback(nextView: FeedbackView): () => void {
  view = nextView;
  onTap(onTapped);
  const wide = window.matchMedia(WIDE);
  document.addEventListener("visibilitychange", onVisibility);
  // A real navigation away (bfcache included) ends the tap; switching apps doesn't fire it.
  window.addEventListener("pagehide", forgetTap);
  document.addEventListener("submit", dismiss, true);
  document.addEventListener("focusin", onFocusIn, true);
  wide.addEventListener("change", onWide);
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", forgetTap);
    document.removeEventListener("submit", dismiss, true);
    document.removeEventListener("focusin", onFocusIn, true);
    wide.removeEventListener("change", onWide);
    forgetTap();
    onTap(null);
    view = null;
  };
}
