"use client";

import { Fragment, useState, memo, useCallback, useMemo, useRef, useEffect, type ComponentProps, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Mail, MessageCircle } from "@/components/icons";
import Link from "next/link";
import CloudflareTurnstile, {
  type CloudflareTurnstileHandle,
} from "@/components/CloudflareTurnstile";
import StatePanel from "@/components/StatePanel";
import { trackFormCorrection, trackFormFailed, trackFormLead, trackPhoneClick } from "@/lib/analytics";
import type { StatePanelAction } from "@/lib/status";
import { useI18n } from "@/i18n/LocaleProvider";
import { useHydrated } from "@/hooks/use-hydrated";
import { useOnline } from "@/hooks/use-online";
import { clearDraft, firstCount, isFresh, readDraft, readSent, saveDraft, saveSent, type Submission } from "@/lib/draft";
import CallLink from "@/components/CallLink";
import WhatsAppLink from "@/components/WhatsAppLink";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { EMAIL, PHONE, PHONE_E164, WHATSAPP_URL } from "@/lib/site";

// Inlined at build time. If the Cloudflare Pages build environment does not
// define it, the Turnstile widget cannot render and the form can never be
// submitted -- so the form says so (S8) instead of waiting for a token.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Stable Turnstile action for this surface. functions/api/contact.ts rejects
// any token whose siteverify `action` does not equal this value.
const TURNSTILE_ACTION = "contact";

// The Function allows 10 s for the bot check and 8 s for the email, so past this the
// request has stalled somewhere and the visitor should get the error and a retry.
const REQUEST_TIMEOUT_MS = 20_000;
// When to tell the visitor a slow send is still in progress.
const SLOW_SEND_MS = 8_000;
// How long a press of Send waits for the security check before saying it can't run.
// The clock stops while a challenge is showing: then the visitor is the one taking time.
const CHECK_WAIT_MS = 15_000;
// A check that finishes this soon after that wait ran out still sends the press, so long
// as the text is unchanged and the visitor hasn't taken one of the panel's other routes.
const LATE_SEND_MS = 60_000;
// A prefilled wa.me link much past 2 KB fails to open on some phones.
const PREFILL_MAX_BYTES = 1_800;

// The same caps, cleaning and email rule as functions/api/contact.ts, so the form
// catches what the Function would reject before anything is sent.
const FIELD_LIMITS = { name: 100, email: 254, message: 5000 } as const;
const EMAIL_RULE = /^[^\s@<>",;]+@[^\s@<>",;]+\.[^\s@<>",;]+$/;
const API_CODES = new Set([
  "bad_body",
  "bot_required",
  "bot_rejected",
  "bot_unavailable",
  "fields_required",
  "too_long",
  "invalid_email",
  "send_failed",
  "send_unknown",
]);

type Field = keyof typeof FIELD_LIMITS;
const FIELDS: Field[] = ["name", "email", "message"];
type Values = Record<Field, string>;
type FieldErrors = Partial<Record<Field, "missing" | "invalid" | "long">>;

/**
 * What the form is telling the visitor under the Send button, one at a time (the plan's
 * S5 to S12). The failures stay until the next press resolves them: they sit next to
 * the visitor's text, so they have no Close.
 */
type Kind =
  | "checking" // S5: pressed before the security check finished
  | "challenge" // S5b: Turnstile wants a tap
  | "refused" // S7: send_failed, bad_body, or a code this form doesn't know
  | "unreachable" // S7: the request never got an answer, while online
  | "noReply" // S7b: no answer in 20 s, or send_unknown (Resend gave none), so it may have arrived
  | "checkDown" // S8: the check can't run
  | "checkRejected" // S9: the check ran and didn't pass
  | "offline" // S11
  | "online" // S12
  | "restored"; // S13: this tab's draft came back after a reload or a language switch

interface FormState {
  kind: Kind;
  /** Changes on every show, so the same state shown again moves focus again. */
  id: number;
  /** Move focus to the headline: a failure the visitor's own press led to. */
  focus: boolean;
  /** Scroll it into view: the answer to a press that doesn't move focus. */
  reveal: boolean;
  /** S8 from the widget, which a token arriving later resolves. */
  fromWidget: boolean;
}

interface Sent {
  name: string;
  email: string;
  ref?: string;
  at: Date;
}

/** S6r: this tab sent a message earlier today and the page has loaded again since. */
interface SentBefore {
  ref?: string;
  at: Date;
}

/** "Already sent at 7:42 PM" names no day, so it is only said on the same one. */
const isToday = (time: number) => new Date(time).toDateString() === new Date().toDateString();

/** What one submission id stands for: the cleaned text, and whether it went as a correction. */
const contentOf = (values: Values, correction: boolean) =>
  `${values.name}\n${values.email}\n${values.message}\n${correction}`;

/**
 * Every mounted form hears when a send finishes. A send can finish after its form has
 * unmounted, when the visitor moved to another page while it was on its way, and the
 * form on that page may have restored the same message from storage.
 */
const sentListeners = new Set<(notice: { id: string; ref?: string; at: Date }) => void>();

function clean(values: Values): Values {
  return {
    // eslint-disable-next-line no-control-regex -- the control characters are the point
    name: values.name.replace(/[\u0000-\u001F\u007F]+/g, " ").trim(),
    email: values.email.trim(),
    message: values.message.trim(),
  };
}

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of FIELDS) {
    if (!values[field]) errors[field] = "missing";
    else if (values[field].length > FIELD_LIMITS[field]) errors[field] = "long";
  }
  if (!errors.email && !EMAIL_RULE.test(values.email)) errors.email = "invalid";
  return errors;
}

/** A v4 UUID, also where randomUUID is missing (it needs a secure context and a 2022 browser). */
function newSubmissionId(): string | undefined {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID();
  if (!cryptoApi?.getRandomValues) return undefined;
  const bytes = cryptoApi.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** encodeURIComponent throws on half of a surrogate pair, which a paste can leave behind. */
function wellFormed(text: string): string {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      const next = text.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        out += text[i] + text[i + 1];
        i++;
      } else {
        out += "�";
      }
    } else {
      out += code >= 0xdc00 && code <= 0xdfff ? "�" : text[i];
    }
  }
  return out;
}

/** The visitor's message for a WhatsApp prefill, cut to fit the link. */
function prefill(values: Values): { text: string; cut: boolean } {
  const signature = values.name ? `\n\n${wellFormed(values.name)}` : "";
  const message = wellFormed(values.message);
  const fits = (text: string) => encodeURIComponent(text).length <= PREFILL_MAX_BYTES;
  if (fits(message + signature)) return { text: message + signature, cut: false };
  const chars = Array.from(message);
  let low = 0;
  let high = chars.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (fits(`${chars.slice(0, mid).join("")}…${signature}`)) low = mid;
    else high = mid - 1;
  }
  return { text: `${chars.slice(0, low).join("").trimEnd()}…${signature}`, cut: true };
}

/**
 * A badge's parts joined by " · ". Each part keeps to one line, separator included, so a
 * badge too long for a narrow panel wraps between parts and never splits "REF 3F2A9C1E".
 */
function badgeParts(parts: ReactNode[]): ReactNode {
  const shown = parts.filter(Boolean);
  return shown.map((part, index) => (
    <Fragment key={index}>
      {index > 0 && " "}
      <span className="whitespace-nowrap">
        {part}
        {index < shown.length - 1 && " ·"}
      </span>
    </Fragment>
  ));
}

/** Fills {name}-style slots, each value in <bdi> so it keeps its own direction. */
function fill(template: string, values: Record<string, ReactNode>): ReactNode {
  return template
    .split(/\{(\w+)\}/)
    .map((part, index) => (index % 2 ? <bdi key={index}>{values[part]}</bdi> : part));
}

const INPUT_CLASS =
  "w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 aria-[invalid=true]:border-red-300 rounded-lg sm:rounded-xl h-11 sm:h-12 text-base";
const TEXTAREA_CLASS =
  "w-full bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-gold-500 focus:ring-gold-500/20 aria-[invalid=true]:border-red-300 rounded-lg sm:rounded-xl resize-none text-base";

interface ContactSectionProps {
  /**
   * "home" (default) is the section at the end of the home page, with its own heading and
   * contact list. "page" is the body of /contact: the view passes the page's h1 and
   * contact tiles as `intro` and its closed panels as `children`, and this adds the form.
   */
  layout?: "home" | "page";
  intro?: ReactNode;
  children?: ReactNode;
}

const ContactSection = memo(function ContactSection({ layout = "home", intro, children }: ContactSectionProps) {
  const hydrated = useHydrated();
  const page = layout === "page";
  // Under the page's h1 the form's heading is an h2, so its panels move up a level too.
  const FormHeading = page ? "h2" : "h3";
  const panelHeading = page ? "h3" : "h4";
  const { locale, t: dict, lp } = useI18n();
  const t = dict.contactSection;
  const f = dict.formStates;
  const s = dict.statePanel;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formState, setFormState] = useState<FormState | null>(() =>
    TURNSTILE_SITE_KEY ? null : { kind: "checkDown", id: 0, focus: false, reveal: false, fromWidget: true }
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);
  const [sentBefore, setSentBefore] = useState<SentBefore | null>(null);
  // Sending from the Sent panel's "Correct and resend".
  const [correcting, setCorrecting] = useState(false);
  // Whether the last write of the text to this tab's storage read back. The offline
  // badge only says DRAFT SAVED when it did.
  const [draftSaved, setDraftSaved] = useState(false);
  const online = useOnline();
  // Below md the widget loads on the first focus in the form or press of Send.
  const [armed, setArmed] = useState(false);
  // Changing it remounts the widget: only when the connection comes back after the
  // widget failed offline.
  const [widgetKey, setWidgetKey] = useState(0);
  const [copied, setCopied] = useState(false);

  // State updates are asynchronous, so a second press can arrive before the first
  // send has shown. This is set synchronously.
  const inFlight = useRef(false);
  // One id per message. A retry of the same text sends the same id, and the Function
  // passes it to Resend so the team isn't emailed twice if only the response was lost.
  const submission = useRef<Submission | null>(null);
  // What the last sent message said, for "Correct and resend".
  const lastSent = useRef<Values | null>(null);
  // An unused token. Refs rather than state: the widget's callbacks and the wait timer
  // read them between renders.
  const token = useRef("");
  const challenge = useRef(false);
  // The visitor let a challenge time out; the widget is reset on the next press.
  const timedOut = useRef(false);
  const widgetFailed = useRef<false | "offline" | "error">(false);
  // Send was pressed before there was a token; it sends when one arrives.
  const pending = useRef(false);
  // The text that press would send.
  const pressed = useRef("");
  // S8 answered a press: when it showed and the text then. A token within LATE_SEND_MS
  // still sends that press. Any press, or a tap on one of the panel's routes, drops it.
  const latePress = useRef<{ at: number; content: string } | null>(null);
  // The text on screen, for the sent listener, which outlives renders.
  const live = useRef({ name, email, message, correcting });
  const wait = useRef<{ timer?: ReturnType<typeof setTimeout>; left: number; since: number }>({ left: 0, since: 0 });
  const nextId = useRef(1);
  const focusNext = useRef<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const turnstileRef = useRef<CloudflareTurnstileHandle>(null);

  /**
   * For a state change that removes or replaces the panel and takes no focus itself: when
   * focus is in the panel (its own Send or Try again was pressed), it goes to Send rather
   * than to the page. A focus the same change already planned, on a field, wins.
   */
  const keepFocus = useCallback(() => {
    if (!focusNext.current && panelRef.current?.contains(document.activeElement)) focusNext.current = "contact-send";
  }, []);

  const show = useCallback((kind: Kind, { focus = false, reveal = false, fromWidget = false } = {}) => {
    setCopied(false);
    // The new panel replaces the old one, with whatever in it had focus.
    if (focus) focusNext.current = null;
    else keepFocus();
    setFormState({ kind, id: nextId.current++, focus, reveal, fromWidget });
  }, [keepFocus]);

  const stopClock = useCallback(() => {
    if (wait.current.timer === undefined) return;
    clearTimeout(wait.current.timer);
    wait.current.timer = undefined;
    wait.current.left -= Date.now() - wait.current.since;
  }, []);

  const runClock = useCallback(() => {
    if (wait.current.timer !== undefined) return;
    wait.current.since = Date.now();
    wait.current.timer = setTimeout(() => {
      wait.current.timer = undefined;
      pending.current = false;
      latePress.current = { at: Date.now(), content: pressed.current };
      show("checkDown", { focus: true, fromWidget: true });
      trackFormFailed("bot_pending");
    }, Math.max(0, wait.current.left));
  }, [show]);

  const cancelWait = useCallback(() => {
    pending.current = false;
    stopClock();
  }, [stopClock]);

  useEffect(() => cancelWait, [cancelWait]);

  useEffect(() => {
    live.current = { name, email, message, correcting };
  });

  useEffect(() => {
    if (!isSubmitting) {
      setIsSlow(false);
      return;
    }
    const timer = setTimeout(() => setIsSlow(true), SLOW_SEND_MS);
    return () => clearTimeout(timer);
  }, [isSubmitting]);

  // Focus moves after the render that shows its target.
  useEffect(() => {
    const id = focusNext.current;
    if (!id) return;
    focusNext.current = null;
    document.getElementById(id)?.focus();
  });

  // Focusing the headline only brings the headline into view; the buttons should come too,
  // and for S5b the box it points at, just below.
  useEffect(() => {
    if (!formState?.reveal && !formState?.focus) return;
    panelRef.current?.scrollIntoView({ block: "nearest" });
    if (formState.kind === "challenge") checkRef.current?.scrollIntoView({ block: "nearest" });
  }, [formState]);

  // Offline at send outranks everything else (S11); coming back offers Send again (S12)
  // and gives a widget that failed offline a fresh start. Nothing sends by itself.
  useEffect(() => {
    const online = () => {
      if (panelRef.current?.dataset.formState === "offline") keepFocus();
      setFormState((state) =>
        state?.kind === "offline" ? { kind: "online", id: nextId.current++, focus: false, reveal: false, fromWidget: false } : state
      );
      if (widgetFailed.current === "offline") {
        widgetFailed.current = false;
        setWidgetKey((key) => key + 1);
      }
    };
    const offline = () => {
      if (!pending.current) return;
      cancelWait();
      show("offline");
    };
    window.addEventListener("online", online);
    window.addEventListener("offline", offline);
    return () => {
      window.removeEventListener("online", online);
      window.removeEventListener("offline", offline);
    };
  }, [cancelWait, keepFocus, show]);

  // What this tab typed comes back after a reload or a language switch (S13), with the id
  // its last send used, so pressing Send again can't email it twice. A message that went
  // says so instead (S6r). Nothing sends by itself: the visitor presses Send.
  //
  // A draft read here can be a message still on its way from the page the visitor just
  // left. When that send finishes, this form says it went (S6r) rather than offer it
  // again. Subscribed in the same effect as the read, so no send can finish in between.
  useEffect(() => {
    const onSentElsewhere = ({ id, ref, at }: { id: string; ref?: string; at: Date }) => {
      const held = submission.current;
      if (held?.id !== id) return;
      submission.current = null;
      cancelWait();
      latePress.current = null;
      const now = live.current;
      // Text changed since it was restored stays, behind the panel, for after Close.
      if (contentOf(clean(now), now.correcting) === held.content) {
        setName("");
        setEmail("");
        setMessage("");
        setCorrecting(false);
        setErrors({});
      }
      setDraftSaved(false);
      setFormState(null);
      setSentBefore({ ref, at });
    };
    sentListeners.add(onSentElsewhere);
    const unsubscribe = () => {
      sentListeners.delete(onSentElsewhere);
    };

    const draft = readDraft();
    if (draft) {
      setName(draft.name);
      setEmail(draft.email);
      setMessage(draft.message);
      setCorrecting(draft.correction === true);
      live.current = { name: draft.name, email: draft.email, message: draft.message, correcting: draft.correction === true };
      submission.current = draft.submission ?? null;
      setDraftSaved(true);
      setFormState(
        (state) => state ?? { kind: "restored", id: nextId.current++, focus: false, reveal: false, fromWidget: false }
      );
      return unsubscribe;
    }
    const before = readSent();
    if (before && isToday(before.sentAt)) setSentBefore({ ref: before.ref, at: new Date(before.sentAt) });
    else if (before) clearDraft();
    return unsubscribe;
  }, [cancelWait]);

  /**
   * Writes the text through to this tab's storage. Called from the handlers that change
   * it, not from an effect, so the empty first render can never overwrite a draft before
   * it has been read back.
   */
  const persist = (values: Values, isCorrection: boolean) => {
    setDraftSaved(
      saveDraft({
        ...values,
        ...(isCorrection && { correction: true }),
        ...(submission.current && { submission: submission.current }),
      })
    );
  };

  const edit = (field: Field, value: string) => {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setMessage(value);
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
    // S13 is news about this text, and an edit shows it was read.
    setFormState((state) => (state?.kind === "restored" ? null : state));
    persist({ name, email, message, [field]: value }, correcting);
  };

  const showFieldErrors = (found: FieldErrors) => {
    setErrors(found);
    const first = FIELDS.find((field) => found[field]);
    if (first) focusNext.current = `contact-${first}`;
  };

  const onSent = (values: Values, id: string | undefined, wasCorrection: boolean) => {
    // A correction is the same lead, already counted. So is an id this tab has already
    // seen sent: one lead fires one formLead.
    if (!id || firstCount(id)) {
      if (wasCorrection) trackFormCorrection();
      else trackFormLead();
    }
    lastSent.current = values;
    submission.current = null;
    const ref = id?.slice(0, 8).toUpperCase();
    const at = new Date();
    // The text goes from storage; a reload now says when it was sent (S6r).
    saveSent({ sentAt: at.getTime(), ref });
    setDraftSaved(false);
    setSent({ name: values.name, email: values.email, ref, at });
    setName("");
    setEmail("");
    setMessage("");
    setErrors({});
    setCorrecting(false);
    setFormState(null);
    // Runs even when this form has unmounted. It let go of the id above, so only a form
    // still holding it, on the page the visitor moved to, reacts.
    if (id) for (const listener of sentListeners) listener({ id, ref, at });
  };

  const send = async (turnstileToken: string, values: Values) => {
    inFlight.current = true;
    setIsSubmitting(true);
    keepFocus();
    setFormState(null);
    token.current = "";

    const wasCorrection = correcting;
    const content = contentOf(values, wasCorrection);
    // A new id for new text, and for an id old enough that Resend may have let its key go.
    const held = submission.current;
    if (held?.content !== content || !isFresh(held)) {
      const id = newSubmissionId();
      submission.current = id ? { id, content, createdAt: Date.now() } : null;
    }
    const submissionId = submission.current?.id;
    // Stored before the request leaves: if its answer is lost and the visitor reloads,
    // the next send uses this id again.
    persist({ name, email, message }, wasCorrection);

    // AbortController rather than AbortSignal.timeout, which older Safari lacks.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    // null: sent.
    let code: string | null = null;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken,
          locale,
          submissionId,
          ...(wasCorrection && { correction: true }),
        }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const data: unknown = await res.json().catch(() => null);
        const raw = data !== null && typeof data === "object" ? (data as { code?: unknown }).code : undefined;
        code = controller.signal.aborted ? "no_reply" : typeof raw === "string" && API_CODES.has(raw) ? raw : "unknown";
      }
    } catch {
      if (controller.signal.aborted) code = "no_reply";
      else code = navigator.onLine === false ? "offline" : "unreachable";
    } finally {
      clearTimeout(timeout);
      inFlight.current = false;
      setIsSubmitting(false);
    }

    if (code === null) {
      onSent(values, submissionId, wasCorrection);
      return;
    }
    if (code === "offline") {
      // The connection was gone, so the request never left and the token is unused: the
      // Send after reconnecting takes it.
      if (!token.current) token.current = turnstileToken;
    } else {
      // Redeemed, rejected, or maybe used by a request whose answer was lost (a failure
      // while online can come after the Function read it): a used token would fail the
      // retry's check (S9), so it gets a new one.
      turnstileRef.current?.reset();
    }
    trackFormFailed(code);
    switch (code) {
      case "bot_required":
      case "bot_rejected":
        show("checkRejected", { focus: true });
        break;
      case "bot_unavailable":
        show("checkDown", { focus: true });
        break;
      case "invalid_email":
        showFieldErrors({ email: "invalid" });
        break;
      case "fields_required":
      case "too_long": {
        // The form checks the same rules first, so the Function disagreeing means the two
        // have drifted apart. Point at the field when there is one to point at.
        const found = validate(values);
        if (FIELDS.some((field) => found[field])) showFieldErrors(found);
        else show("refused", { focus: true });
        break;
      }
      case "no_reply":
      case "send_unknown":
        // It may have arrived. Try again reuses the id, so it can't go twice.
        show("noReply", { focus: true });
        break;
      case "offline":
        show("offline", { reveal: true });
        break;
      case "unreachable":
        show("unreachable", { focus: true });
        break;
      default:
        show("refused", { focus: true });
    }
  };

  /** Send, and every button that means Send. Never disabled: it always answers. */
  const press = () => {
    if (inFlight.current) return;
    setArmed(true);
    latePress.current = null;
    const values = clean({ name, email, message });
    const found = validate(values);
    if (FIELDS.some((field) => found[field])) {
      cancelWait();
      setFormState(null);
      showFieldErrors(found);
      return;
    }
    setErrors({});
    if (navigator.onLine === false) {
      cancelWait();
      // Written again here, so the badge's DRAFT SAVED is true at the moment it shows.
      persist({ name, email, message }, correcting);
      show("offline", { reveal: true });
      trackFormFailed("offline");
      return;
    }
    if (!TURNSTILE_SITE_KEY || widgetFailed.current === "error") {
      cancelWait();
      // Turnstile retries after an error by itself, so a token can still come.
      if (TURNSTILE_SITE_KEY) latePress.current = { at: Date.now(), content: contentOf(values, correcting) };
      show("checkDown", { focus: true, fromWidget: true });
      trackFormFailed(TURNSTILE_SITE_KEY ? "bot_error" : "bot_no_key");
      return;
    }
    // A widget that failed offline is remounted by the `online` event, never here.
    if (timedOut.current) {
      timedOut.current = false;
      turnstileRef.current?.reset();
    }
    if (token.current) {
      cancelWait();
      void send(token.current, values);
      return;
    }
    // S5: sends when the token arrives, or says the check can't run after 15 s.
    cancelWait();
    pending.current = true;
    pressed.current = contentOf(values, correcting);
    wait.current.left = CHECK_WAIT_MS;
    show(challenge.current ? "challenge" : "checking", { reveal: true });
    if (!challenge.current) runClock();
  };

  const onToken = (value: string) => {
    token.current = value;
    challenge.current = false;
    timedOut.current = false;
    widgetFailed.current = false;
    const late = latePress.current;
    latePress.current = null;
    if (pending.current) {
      cancelWait();
      press();
      return;
    }
    // The panel this removes may hold focus, on its headline after S8: it goes to Send.
    const panelFocused = Boolean(panelRef.current?.contains(document.activeElement));
    // The check finished after S8 answered a press: send that press, as S5 promised,
    // unless the text has changed since.
    if (late && Date.now() - late.at < LATE_SEND_MS && contentOf(clean({ name, email, message }), correcting) === late.content) {
      if (panelFocused) focusNext.current = "contact-send";
      press();
      return;
    }
    setFormState((state) => {
      if (!state || !(state.kind === "checking" || state.kind === "challenge" || (state.kind === "checkDown" && state.fromWidget))) {
        return state;
      }
      // Only when the panel really goes, or the next render would take focus from a field.
      if (panelFocused) focusNext.current = "contact-send";
      return null;
    });
  };

  const onWidgetFailed = (code: "bot_error" | "bot_unsupported") => {
    token.current = "";
    challenge.current = false;
    const wasPending = pending.current;
    cancelWait();
    latePress.current = null;
    if (code === "bot_error" && navigator.onLine === false) {
      // Not the check's fault. Tried again when the connection comes back.
      widgetFailed.current = "offline";
      if (wasPending) show("offline", { reveal: true });
      return;
    }
    widgetFailed.current = "error";
    trackFormFailed(code);
    if (wasPending) {
      // Turnstile retries after an error by itself, so a token can still come.
      if (code === "bot_error") latePress.current = { at: Date.now(), content: pressed.current };
      show("checkDown", { focus: true, fromWidget: true });
      return;
    }
    // No press is waiting, so the next press answers with S8 (press() reads widgetFailed).
    // It shows now only in place of news or of a challenge that can no longer finish, and
    // only over text, so its NOT SENT and "Your text is still here" are true. A failure
    // the visitor hasn't acted on stays: S8 over S7b would say NOT SENT, and offer
    // WhatsApp, about a message that may have arrived, and a late token would then clear it.
    const replaces = (kind?: Kind) => !kind || kind === "restored" || kind === "online" || kind === "challenge";
    if (!replaces(formState?.kind)) return;
    const values = clean({ name, email, message });
    if (FIELDS.some((field) => values[field])) show("checkDown", { fromWidget: true });
    else if (formState?.kind === "challenge") {
      // The box it pointed at has failed, so there is nothing left to tap.
      keepFocus();
      setFormState(null);
    }
  };

  const onChallengeShown = () => {
    challenge.current = true;
    if (pending.current) {
      stopClock();
      show("challenge", { reveal: true });
      return;
    }
    // It replaces news (S13 draft restored, S12 back online). Over a failure the visitor
    // hasn't acted on yet, the box just appears below it.
    const replaces = (kind?: Kind) => !kind || kind === "restored" || kind === "online";
    if (replaces(panelRef.current?.dataset.formState as Kind | undefined)) keepFocus();
    setFormState((state) =>
      replaces(state?.kind) ? { kind: "challenge", id: nextId.current++, focus: false, reveal: false, fromWidget: false } : state
    );
  };

  const onChallengeDone = () => {
    challenge.current = false;
    if (pending.current) {
      show("checking");
      runClock();
      return;
    }
    setFormState((state) => (state?.kind === "challenge" ? null : state));
  };

  const onChallengeTimeout = () => {
    token.current = "";
    challenge.current = false;
    const wasPending = pending.current;
    cancelWait();
    latePress.current = null;
    trackFormFailed("bot_timeout");
    // S9 says "press Send to retry", so the new challenge waits for that press. Kept for
    // the next press either way: it resets the widget whatever is on screen then.
    timedOut.current = true;
    if (wasPending) {
      show("checkRejected", { focus: true });
      return;
    }
    // No press is waiting: the same rule as onWidgetFailed. S9 shows only in place of news
    // or of the challenge that timed out, and only over text, so its "Your text is still
    // here" is true. A failure the visitor hasn't acted on stays: a reset after S7b can
    // bring a challenge they ignore, and S9 over S7b would hide that the message may have
    // arrived. Its Try again is a press, which handles the timeout.
    const replaces = (kind?: Kind) => !kind || kind === "restored" || kind === "online" || kind === "challenge";
    if (!replaces(formState?.kind)) return;
    const values = clean({ name, email, message });
    if (FIELDS.some((field) => values[field])) show("checkRejected");
    else if (formState?.kind === "challenge") {
      // The box it pointed at has timed out; Send brings a new one.
      keepFocus();
      setFormState(null);
    }
  };

  const closeSent = () => {
    // Removes the record of the send. Stores the text only when there is some: text the
    // visitor changed after a draft came back, when that draft's send then finished.
    persist({ name, email, message }, correcting);
    setSent(null);
    setSentBefore(null);
    setFormState(null);
    focusNext.current = "contact-send";
  };

  const correct = () => {
    const last = lastSent.current;
    if (last) {
      setName(last.name);
      setEmail(last.email);
      setMessage(last.message);
      persist(last, true);
    }
    setCorrecting(true);
    setSent(null);
    focusNext.current = "contact-name";
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      // No clipboard (an insecure context, or permission refused): select it instead.
      const area = document.getElementById("contact-message") as HTMLTextAreaElement | null;
      area?.focus();
      area?.select();
    }
  };

  const contactMethods = useMemo(() => [
    {
      icon: MessageCircle,
      label: t.whatsapp,
      value: "+974 5551 2858",
      ltr: true,
      href: WHATSAPP_URL,
      external: true,
      hasConversion: true,
    },
    {
      icon: Mail,
      label: t.email,
      value: "info@alarabiacarpets.com",
      ltr: true,
      href: "mailto:info@alarabiacarpets.com",
      external: false,
      hasConversion: false,
    },
    {
      icon: MapPin,
      label: t.location,
      value: t.locationValue,
      ltr: false,
      href: "https://maps.google.com/?q=Al+Mansoura+St,+Doha,+Qatar",
      external: true,
      hasConversion: false,
    },
  ], [t]);

  const fieldText: Record<Field, Partial<Record<"missing" | "invalid" | "long", string>>> = {
    name: { missing: f.addName, long: f.longName },
    email: { missing: f.addEmail, invalid: f.addEmail, long: f.longEmail },
    message: { missing: f.addMessage, long: f.longMessage },
  };
  const fieldProps = (field: Field) => {
    const error = errors[field];
    return {
      id: `contact-${field}`,
      name: field,
      maxLength: FIELD_LIMITS[field],
      readOnly: isSubmitting,
      required: true,
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `contact-${field}-error` : undefined,
    };
  };
  const fieldError = (field: Field) => {
    const error = errors[field];
    return error ? (
      <p id={`contact-${field}-error`} className="ct-error">
        {fieldText[field][error]}
      </p>
    ) : null;
  };

  // The panel for the current state: badge, headline, facts, actions with the primary last.
  let panel: ReactNode = null;
  let spoken: ReactNode = null;
  let urgent = false;
  const clock = (at: Date) =>
    new Intl.DateTimeFormat(locale === "ar" ? "ar-QA-u-nu-latn" : "en-US", { hour: "numeric", minute: "2-digit" }).format(at);
  if (sent) {
    const time = clock(sent.at);
    const facts = (
      <>
        <p>{fill(f.sentReply, { email: sent.email })}</p>
        <p>{f.sentNext}</p>
      </>
    );
    spoken = facts;
    panel = (
      <StatePanel
        variant="inline"
        tone="ok"
        headingAs={panelHeading}
        focusHeadline
        badge={badgeParts([
          f.sentBadge,
          <bdi key="time">{time}</bdi>,
          sent.ref && <Fragment key="ref">{f.refLabel} <bdi>{sent.ref}</bdi></Fragment>,
        ])}
        headline={fill(f.sent, { name: sent.name })}
        onClose={closeSent}
        closeLabel={s.close}
        secondary={[{ label: f.correct, onClick: correct }]}
        primary={
          <WhatsAppLink
            source="contact_sent_followup"
            conversion={false}
            message={sent.ref ? f.followUp.replace("{ref}", sent.ref) : dict.common.floatMessage}
            className="cta"
          >
            {f.continueOnWhatsApp}
          </WhatsAppLink>
        }
      >
        {facts}
      </StatePanel>
    );
  } else if (sentBefore) {
    // S6r. Not the answer to a press, so focus stays where it is.
    const headline = fill(f.alreadySent, { time: clock(sentBefore.at) });
    spoken = headline;
    panel = (
      <StatePanel
        variant="inline"
        tone="ok"
        headingAs={panelHeading}
        badge={badgeParts([
          f.sentBadge,
          sentBefore.ref && <Fragment key="ref">{f.refLabel} <bdi>{sentBefore.ref}</bdi></Fragment>,
        ])}
        headline={headline}
        onClose={closeSent}
        closeLabel={s.close}
      />
    );
  } else if (formState) {
    const failed = ["refused", "unreachable", "checkDown", "checkRejected"].includes(formState.kind);
    const pre = failed ? prefill(clean({ name, email, message })) : null;
    const shortened = pre?.cut ? <p>{f.shortened}</p> : null;
    const copy: StatePanelAction[] = pre?.cut ? [{ label: copied ? f.copied : f.copy, onClick: copyMessage }] : [];
    const call: StatePanelAction = {
      label: s.call,
      href: `tel:${PHONE_E164}`,
      onClick: () => trackPhoneClick("contact_form_failed"),
    };
    const whatsApp = (label: string, className: string) => (
      <WhatsAppLink key="whatsapp" source="contact_form_failed" message={pre?.text} className={className}>
        {label}
      </WhatsAppLink>
    );
    const sendButton = (label: string): StatePanelAction => ({ label, onClick: press });
    const fail = { tone: "fail" as const, badge: f.notSentBadge };

    const views: Record<Kind, Omit<ComponentProps<typeof StatePanel>, "variant"> & { urgent?: boolean }> = {
      checking: { headline: f.checking },
      challenge: { headline: f.challenge },
      refused: {
        ...fail,
        headline: f.refused,
        children: <><p>{f.kept}</p>{shortened}</>,
        secondary: [sendButton(f.tryAgain), call, ...copy],
        primary: whatsApp(f.sendOnWhatsApp, "cta"),
        urgent: true,
      },
      unreachable: {
        ...fail,
        headline: f.unreachable,
        children: <><p>{f.kept}</p>{shortened}</>,
        secondary: [sendButton(f.tryAgain), call, ...copy],
        primary: whatsApp(f.sendOnWhatsApp, "cta"),
        urgent: true,
      },
      noReply: {
        tone: "fail",
        badge: f.noReplyBadge,
        headline: f.noReply,
        children: <p>{f.noReplyNext}</p>,
        secondary: [call],
        primary: sendButton(f.tryAgain),
        urgent: true,
      },
      checkDown: {
        ...fail,
        headline: f.checkDown,
        children: <><p>{f.kept} {f.open}</p>{shortened}</>,
        secondary: [call, ...copy],
        primary: whatsApp(t.whatsapp, "cta"),
        urgent: true,
      },
      checkRejected: {
        ...fail,
        headline: f.checkRejected,
        children: <><p>{f.kept} {f.checkRetry}</p>{shortened}</>,
        secondary: [whatsApp(t.whatsapp, "cta-2"), ...copy],
        primary: sendButton(f.send),
        urgent: true,
      },
      offline: {
        tone: "fail",
        badge: draftSaved ? `${f.offlineBadge} · ${f.draftSavedBadge}` : f.offlineBadge,
        headline: f.kept,
        children: <p>{f.offline} {f.calls} {f.open}</p>,
        primary: call,
        urgent: true,
      },
      online: {
        headline: f.online,
        children: <p>{f.onlineNext}</p>,
        primary: sendButton(f.send),
      },
      restored: { headline: f.restored },
    };
    const { urgent: isUrgent = false, children, ...view } = views[formState.kind];
    urgent = isUrgent;
    spoken = formState.focus ? children : <>{view.headline} {children}</>;
    panel = (
      <StatePanel key={formState.id} variant="inline" headingAs={panelHeading} focusHeadline={formState.focus} {...view}>
        {children}
      </StatePanel>
    );
  }

  return (
    <section
      id="contact"
      className={`relative ${page ? "py-6 sm:py-8 lg:py-10" : "py-10 sm:py-20 lg:py-28"} bg-forest-900 overflow-hidden`}
    >
      {/* Background Elements - Smaller on mobile. Never a scroll anchor: the lower glow is
          pinned to the section's bottom, so when a /contact panel opened, Chrome kept the
          glow still and scrolled the page down by the panel's height. */}
      <div className="absolute inset-0 [overflow-anchor:none]">
        {hydrated && (
          <>
        <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[500px] lg:h-[500px] bg-teal-500/10 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03] hidden sm:block"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-5 lg:px-8">
        {/* CTA Header */}
        {/* No scroll reveal in this section: it is the whole body of /contact, so it
            must be visible from the first paint. Its overflow-hidden would also
            capture a .reveal timeline. */}
        {!page && (
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-4 sm:mb-6 leading-tight">
            {t.titleTop}
            <br />
            <span className="text-gradient">{t.titleBottom}</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-white/70 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            {t.subtitle}
          </p>

          {/* Primary CTA */}
          <WhatsAppLink source="contact_section_primary" className="cta-dark ct-go">
            <WhatsAppIcon />
            {dict.common.heroQuote}
          </WhatsAppLink>
        </div>
        )}

        {/* Content Grid. On the page: the intro, then the form, then the panels, which is
            also the order on phones; from lg the form takes the second column. */}
        <div className={page
          ? "grid grid-cols-1 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:grid-rows-[auto_1fr] gap-6 lg:gap-x-12 lg:gap-y-5 max-w-6xl mx-auto"
          : "grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 max-w-6xl mx-auto"}>
          {page && <div className="lg:col-start-1 lg:row-start-1">{intro}</div>}
          {/* Contact Form. On Home: first in the page order, so Tab and a screen reader reach it
              first, as phones show it; lg:order-last puts it back in the second column on wide
              screens. On the page the intro comes first (see above).
              The id is where /contact's WhatsApp links point before hydration (the action bar's
              and the main tile's). */}
          <div id="contact-form" className={page ? "lg:col-start-2 lg:row-start-1 lg:row-span-2" : "lg:order-last"}>
            <div className={`${page ? "p-5 sm:p-6" : "p-5 sm:p-6 lg:p-8"} rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm`}>
              <FormHeading className={`text-xl sm:text-2xl font-display font-semibold text-white ${page ? "mb-4" : "mb-5 sm:mb-6"}`}>
                {t.sendMessage}
              </FormHeading>

              {!hydrated ? (
                // Stand-in for the form until it hydrates. The form itself is
                // interactive-only markup, so it stays out of the static HTML.
                <>
                  <div className={page ? "ct-skel ct-skel-page" : "ct-skel"} aria-hidden="true">
                    <Pair page={page}>
                      <div>
                        <p className="ct-skel-label">{t.name}</p>
                        <div className="ct-skel-field" />
                      </div>
                      <div>
                        <p className="ct-skel-label">{t.emailLabel}</p>
                        <div className="ct-skel-field" />
                      </div>
                    </Pair>
                    <div>
                      <p className="ct-skel-label">{t.message}</p>
                      <div className="ct-skel-area" />
                    </div>
                    <div className="ct-skel-btn">{t.send}</div>
                  </div>
                  {/* Without JavaScript the form never arrives. */}
                  <noscript>
                    <p className="ct-noscript">
                      <a href={`tel:${PHONE_E164}`}>{s.call} <bdi dir="ltr">{PHONE}</bdi></a> <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                    </p>
                  </noscript>
                </>
              ) : sent || sentBefore ? (
                <div data-form-state={sent ? "sent" : "sentBefore"}>{panel}</div>
              ) : (
                <form
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    press();
                  }}
                  onFocus={() => setArmed(true)}
                  className="space-y-4 sm:space-y-5"
                >
                  <Pair page={page}>
                  <div>
                    <label htmlFor="contact-name" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.name}</label>
                    <Input
                      {...fieldProps("name")}
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => edit("name", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder={t.namePlaceholder}
                    />
                    {fieldError("name")}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.emailLabel}</label>
                    <Input
                      {...fieldProps("email")}
                      type="email"
                      dir="ltr"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => edit("email", e.target.value)}
                      className={INPUT_CLASS}
                      placeholder={t.emailPlaceholder}
                    />
                    {fieldError("email")}
                  </div>
                  </Pair>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs sm:text-sm text-white/60 mb-1.5 sm:mb-2">{t.message}</label>
                    <Textarea
                      {...fieldProps("message")}
                      value={message}
                      onChange={(e) => edit("message", e.target.value)}
                      rows={page ? 3 : 4}
                      className={TEXTAREA_CLASS}
                      placeholder={t.messagePlaceholder}
                    />
                    {fieldError("message")}
                  </div>

                  {/* Offline mid-form, a word that the text is safe. At Send it becomes S11, which
                      carries the same badge. Always rendered, like the status line below. */}
                  <p role="status" className="text-center empty:hidden">
                    {!online && formState?.kind !== "offline" && (
                      <span className="sp-badge sp-badge-fail mb-0">
                        {draftSaved ? `${f.offlineBadge} · ${f.draftSavedBadge}` : f.offlineBadge}
                      </span>
                    )}
                  </p>

                  <button
                    id="contact-send"
                    type="submit"
                    aria-busy={isSubmitting || undefined}
                    className="cta-dark cta-l w-full"
                  >
                    {isSubmitting && (
                      <span
                        aria-hidden="true"
                        className="w-4 h-4 rounded-full border-2 border-forest-900/30 border-t-forest-900 animate-spin"
                      />
                    )}
                    {isSubmitting ? t.sending : t.send}
                  </button>
                  {/* Success is only ever shown once the server confirms the send:
                      this is a lead form, and a message that failed must not look sent. */}
                  {/* Always rendered and only its text changes: a live region that is
                      inserted already holding its text is often not announced. */}
                  <p role="status" className="text-xs sm:text-sm text-white/70 text-center empty:hidden">
                    {isSlow ? t.stillSending : ""}
                  </p>

                  {/* data-form-state names the state for scripts/audit-mobile.mjs. */}
                  {/* A tap on one of the panel's routes is the visitor's choice: a late
                      token no longer sends the press that led to S8. */}
                  {panel && (
                    <div
                      ref={panelRef}
                      data-form-state={formState?.kind}
                      className="ct-reveal"
                      onClickCapture={(event) => {
                        if ((event.target as Element).closest("a, button")) latePress.current = null;
                      }}
                    >
                      {panel}
                    </div>
                  )}

                  {/* Below the panel, which tells the visitor to tap the box below. */}
                  {TURNSTILE_SITE_KEY && (
                    <div ref={checkRef} className="ct-reveal">
                    <CloudflareTurnstile
                      key={widgetKey}
                      ref={turnstileRef}
                      siteKey={TURNSTILE_SITE_KEY}
                      action={TURNSTILE_ACTION}
                      armed={armed}
                      onVerify={onToken}
                      onExpire={() => {
                        token.current = "";
                      }}
                      onError={() => onWidgetFailed("bot_error")}
                      onUnsupported={() => onWidgetFailed("bot_unsupported")}
                      onBeforeInteractive={onChallengeShown}
                      onAfterInteractive={onChallengeDone}
                      onTimeout={onChallengeTimeout}
                      theme="dark"
                      language={locale === "ar" ? "ar" : "auto"}
                      className="flex justify-center"
                    />
                    </div>
                  )}
                </form>
              )}

              {/* Always there once hydrated, for the same reason as the line above. When
                  focus moves to a headline the reader starts there, so these carry the rest. */}
              {hydrated && (
                <>
                  <div role="status" className="sr-only">{urgent ? null : spoken}</div>
                  <div role="alert" className="sr-only">{urgent ? spoken : null}</div>
                </>
              )}
            </div>
          </div>

          {page ? (
            <div className="lg:col-start-1 lg:row-start-2">{children}</div>
          ) : (
          /* Contact Methods */
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-6 sm:mb-8">
              {t.getInTouch}
            </h3>

            <div className="space-y-3 sm:space-y-4">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                const className = "group ct-method";
                const content = (
                  <>
                    <div className="ct-icon">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-white/60 mb-0.5 sm:mb-1">{method.label}</p>
                      <p className="text-sm sm:text-base text-white font-medium truncate">{method.ltr ? <bdi dir="ltr">{method.value}</bdi> : method.value}</p>
                    </div>
                  </>
                );
                if (method.hasConversion) {
                  return (
                    <WhatsAppLink key={method.label} href={method.href} source="contact_section_methods" className={className}>
                      {content}
                    </WhatsAppLink>
                  );
                }
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    {...(method.external && { target: "_blank", rel: "noopener noreferrer" })}
                    className={className}
                  >
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Quick Links */}
            <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-white/10">
              <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">{t.quickLinks}</p>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link
                  href={lp("/products")}
                  className="ct-chip"
                >
                  {t.viewProducts}
                </Link>
                <Link
                  href={lp("/about")}
                  className="ct-chip"
                >
                  {t.aboutUs}
                </Link>
                <CallLink source="contact_section_call" className="ct-chip">
                  {s.call}
                </CallLink>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
});

/** Name and email: side by side from sm on /contact, stacked as before on the home page. */
function Pair({ page, children }: { page: boolean; children: ReactNode }) {
  return page ? <div className="grid gap-4 sm:grid-cols-2 sm:gap-3">{children}</div> : <>{children}</>;
}

export default ContactSection;
