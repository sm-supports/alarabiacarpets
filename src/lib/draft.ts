/**
 * Where the contact form's draft is kept for this tab. Nothing writes it yet. The read
 * comes first because the page-error screens may only say a message is saved if it reads
 * back, and app/global-error.tsx imports this, so keep the file free of imports.
 */
const DRAFT_KEY = "contact-draft";

/** False when there is no draft and when storage is blocked. */
export function hasStoredDraft(): boolean {
  try {
    return Boolean(sessionStorage.getItem(DRAFT_KEY));
  } catch {
    return false;
  }
}
