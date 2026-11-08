/**
 * The contact form's text, kept in this tab's sessionStorage so it survives a reload, a
 * language switch and the browser's offline page. After a send it holds only when the
 * message went and its REF, so a reload says "Already sent" instead of showing an empty
 * form that invites a second send. sessionStorage, not localStorage: the text stays in
 * this tab and goes when the tab closes.
 *
 * Storage can be blocked, full or missing, and every call here survives that. A write
 * reports whether it reads back, so the form only says the draft is saved when it is.
 *
 * app/global-error.tsx imports this, and Next loads that file on every page of both
 * languages, so keep this file free of imports.
 */
const DRAFT_KEY = "contact-draft";
const VERSION = 1;

export interface Draft {
  name: string;
  email: string;
  message: string;
  /** Typed after "Correct and resend", so the send is marked as a correction. */
  correction?: boolean;
  /**
   * The id a send of exactly this content already used. A send after a reload reuses
   * it, so a message whose response was lost isn't emailed twice.
   */
  submission?: { id: string; content: string };
}

export interface SentRecord {
  /** When the server confirmed the send, in epoch milliseconds. */
  sentAt: number;
  ref?: string;
}

const isText = (value: unknown): value is string => typeof value === "string";
const hasText = (draft: Pick<Draft, "name" | "email" | "message">) => /\S/.test(draft.name + draft.email + draft.message);

function read(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    const stored: unknown = raw ? JSON.parse(raw) : null;
    return stored && typeof stored === "object" && (stored as { v?: unknown }).v === VERSION
      ? (stored as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

/** True only when the value reads back. A write that fails leaves nothing behind. */
function write(value: object | null): boolean {
  try {
    if (value === null) {
      sessionStorage.removeItem(DRAFT_KEY);
      return sessionStorage.getItem(DRAFT_KEY) === null;
    }
    const raw = JSON.stringify({ v: VERSION, ...value });
    sessionStorage.setItem(DRAFT_KEY, raw);
    if (sessionStorage.getItem(DRAFT_KEY) === raw) return true;
  } catch {
    // Blocked, full, or not there at all.
  }
  try {
    // An older draft left in place would be restored, or called saved, as if it were this one.
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Nothing more to do.
  }
  return false;
}

/** The text this tab last typed, or null when there is none or storage is blocked. */
export function readDraft(): Draft | null {
  const draft = read()?.draft as Record<string, unknown> | undefined;
  if (!draft || !isText(draft.name) || !isText(draft.email) || !isText(draft.message)) return null;
  const result: Draft = { name: draft.name, email: draft.email, message: draft.message };
  if (!hasText(result)) return null;
  if (draft.correction === true) result.correction = true;
  const submission = draft.submission as Record<string, unknown> | undefined;
  if (submission && isText(submission.id) && isText(submission.content)) {
    result.submission = { id: submission.id, content: submission.content };
  }
  return result;
}

/** When this tab last sent a message, or null. */
export function readSent(): SentRecord | null {
  const sent = read()?.sent as Record<string, unknown> | undefined;
  if (!sent || typeof sent.sentAt !== "number" || !Number.isFinite(sent.sentAt)) return null;
  return { sentAt: sent.sentAt, ...(isText(sent.ref) && { ref: sent.ref }) };
}

/**
 * Keeps the form's text, replacing whatever was stored. True only when it reads back.
 * With every field empty it removes the draft and returns false: nothing is saved.
 */
export function saveDraft(draft: Draft): boolean {
  if (!hasText(draft)) {
    write(null);
    return false;
  }
  return write({ draft });
}

/** Replaces the draft with the record of its send. */
export function saveSent(sent: SentRecord): boolean {
  return write({ sent });
}

export function clearDraft(): void {
  write(null);
}

// Under its own key, so a draft or Sent write can't drop it.
const COUNTED_KEY = "contact-counted";

/**
 * Whether this send's lead still has to be counted, and records it as counted. One id can
 * come back sent twice: a form that restored the message while its first send was still
 * on its way sends the same id, and Resend answers the replay as sent. True when storage
 * can't tell, so a lead is never lost to blocked storage.
 */
export function firstCount(submissionId: string): boolean {
  try {
    const raw = sessionStorage.getItem(COUNTED_KEY);
    const stored: unknown = raw ? JSON.parse(raw) : [];
    const ids = Array.isArray(stored) ? stored.filter(isText) : [];
    if (ids.includes(submissionId)) return false;
    sessionStorage.setItem(COUNTED_KEY, JSON.stringify([...ids, submissionId].slice(-20)));
  } catch {
    // Blocked or full: count it.
  }
  return true;
}

/** False when there is no draft with text in it and when storage is blocked. */
export function hasStoredDraft(): boolean {
  return readDraft() !== null;
}
