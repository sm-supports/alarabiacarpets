# Modify the Contact Form

## Architecture

| Layer | File |
|-------|------|
| Frontend form | `src/components/ContactSection.tsx` |
| Contact page | `src/app/(en)/contact/page.tsx` and `src/app/(ar)/ar/contact/page.tsx` over `src/views/ContactView.tsx`, which renders `<ContactSection layout="page">` (the one-screen layout). Home renders `<ContactSection />` too |
| API endpoint | `functions/api/contact.ts` (Cloudflare Workers) |
| Email template | `functions/email-templates/acknowledgment.ts` |
| Turnstile widget | `src/components/CloudflareTurnstile.tsx` |
| Outcome messages | Inline `StatePanel`s in `ContactSection.tsx` (`data-form-state`), strings in `formStates` in `src/i18n/*.client.ts`, one per API `code` |
| Draft | `src/lib/draft.ts`: the text in this tab's sessionStorage (`contact-draft`), with the submission id and when it was made (`createdAt`), or the sent time and REF after a send. An id older than 23 hours is replaced, inside Resend's 24-hour key window. Import-free, because `app/global-error.tsx` reads it |

## Current Form Fields

- **Name** — text input, required
- **Email** — email input, required, regex validated server-side
- **Message** — textarea, required
- **Turnstile** — bot verification, produces a token sent with the request

## Adding a New Form Field

### Frontend (`src/components/ContactSection.tsx`)

1. Add it to `FIELD_LIMITS` (same cap as the Function), `FIELDS`, `clean()` and `validate()`,
   with its error strings in `formStates` in both `src/i18n/*.client.ts`.
2. Add state and an input following the existing ones: `{...fieldProps("x")}`, `INPUT_CLASS`
   (16px text, so iOS doesn't zoom), an `autoComplete`, and `{fieldError("x")}` under it.
3. Add it to the `Values` that `press()` builds and `send()` posts, and to `contentOf()`,
   so an edit gets a new submission id.
4. Clear it in `onSent()` and in `onSentElsewhere` (the restore effect), and restore it in
   `correct()`. Set it through `edit()`, which writes the draft, and add it to `Draft` in
   `src/lib/draft.ts`, to the restore effect and to the `live` ref.

### Backend (`functions/api/contact.ts`)

5. Add the field to the destructured request body:
   ```typescript
   const { name, email, phone, message, turnstileToken } = (await context.request.json()) as {
     name?: string;
     email?: string;
     phone?: string;
     message?: string;
     turnstileToken?: string;
   };
   ```

6. Add validation if the field is required.

7. Include in the admin notification email HTML:
   ```typescript
   <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
   ```

8. Optionally include in the acknowledgment email template.

## Google Ads Conversion Tracking

The form fires conversion events — do not remove without explicit instruction. The labels
are `CONVERSION_LABELS` in `src/lib/analytics.ts` (`formLead`, `whatsappClick`); read them
there rather than copying them here.

Conversion tracking lives in `src/lib/analytics.ts` (`trackFormLead`, `trackWhatsAppClick`, `trackPhoneClick`). All events use currency `QAR`. The legacy `gtag_report_conversion()` global is re-created by `src/components/ThirdPartyScripts.tsx` for backward compatibility.

What the form sends, once per outcome, with no personal data:

| Outcome | Events |
|---------|--------|
| Sent | `formLead` conversion and GA4 `generate_lead`, once per lead |
| Sent after "Correct and resend" | GA4 `form_correction` only: the lead was already counted. The request carries `correction: true`, and the admin email's subject starts "Correction:" |
| Any failure | GA4 `form_failed {code}`: the API's `code` (`unknown` for one the form doesn't know), or one the form names itself: `unreachable`, `no_reply` (the 20 s abort), `offline`, `bot_pending`, `bot_timeout`, `bot_error`, `bot_unsupported`, `bot_no_key` |
| "Continue on WhatsApp" on the Sent panel | GA4 `whatsapp_click` with `source: contact_sent_followup` and `conversion: false`: no Ads conversion |
| "Send this on WhatsApp" / Call on a failure | `source: contact_form_failed` (a WhatsApp tap counts as a conversion; a call is GA4 only) |

## Request and response

The form posts `{ name, email, message, turnstileToken, submissionId, locale, correction? }`.
Every answer other than 200 carries `{ error, code }`, and the form picks its state by
`code`, never by status or `error` text. The codes: `bot_required`, `bot_rejected`,
`bot_unavailable`, `invalid_email`, `too_long`, `fields_required`, `bad_body`, `send_failed`,
`send_unknown` (see `turnstile-spin/` for the bot classes and `CONTACT_SCENARIOS` in
`scripts/lib/browser.mjs` for each body). A code the form doesn't know shows S7, as
`send_failed` does.

REF is `submissionId.slice(0, 8).toUpperCase()`: one id per message, kept across retries,
so Resend's idempotency key holds. It appears on the Sent panel, in the admin email's subject,
in the acknowledgment email and in the WhatsApp follow-up prefill. A failed send's WhatsApp
prefill is capped at about 1,800 encoded bytes, with a notice and a Copy button (S19).

## Turnstile Configuration

- Site key: `process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time; set in `.env` locally
  and in the Pages project for Production *and* Preview)
- Secret key: `TURNSTILE_SECRET_KEY` (runtime secret on the Pages project; `.dev.vars` locally)
- Allowed hostnames: `TURNSTILE_HOSTNAMES` (optional, comma-separated). The Function compares
  it against the `hostname` siteverify returns and falls back to the production hostnames in
  `PRODUCTION_HOSTNAMES` when unset. `.dev.vars` sets `localhost,127.0.0.1`; never put those
  in the production value.
- Action: the widget renders with `action="contact"` and the Function rejects any token whose
  siteverify `action` differs. Change both sides together or not at all.
- Widget component: `src/components/CloudflareTurnstile.tsx` handles script loading, cleanup,
  and exposes `reset()` through its `ref`. `ContactSection` calls it after a failed submit
  because tokens are single-use.
- Cloudflare's always-passes test secret (`1x0000…AA`) returns `hostname: "example.com"` and
  no `action`, so it now fails the hostname and action checks. Local end-to-end testing of a
  real submission needs the real widget secret in `.dev.vars`.
- Do not modify the Turnstile verification logic unless changing providers

## Email Configuration

- Admin notification: sent to `info@alarabiacarpets.com`
- Acknowledgment: sent to the submitter's email address
- Sender: `Al Arabia Carpets <noreply@alarabiacarpets.com>`
- API key: `context.env.RESEND_API_KEY`
- The admin email goes under the idempotency key `contact-admin/<submissionId>`, so a retry
  of the same message can't email the team twice. Resend's answer sets the response
  (`sendResult()` in `functions/api/contact.ts`):

  | Resend | Function | Form |
  |--------|----------|------|
  | Sent | 200 | Sent (S6) |
  | 409, already sent under this key | 200 | Sent (S6) |
  | 409 `concurrent_idempotent_requests` (first send still in progress) | asks again once after 1 s, then as that answer; still in progress is `send_unknown` | |
  | Any other status (422, 429, 5xx…) | 502 `send_failed` | S7, "didn't accept", WhatsApp first |
  | No answer: the 8 s limit, or a network failure | 502 `send_unknown` | S7b, "may have arrived", Try again first |

  A request without a `submissionId` has no key, so a retry could send twice: there, no
  answer is `send_failed` too.
- CORS: allows all origins (`"*"`) — frontend and API are on the same Cloudflare Pages domain

## Testing

```bash
npm run pages:dev
```

On this Mac's case-insensitive volume `wrangler pages dev` 404s `/products/*`, but
`/contact` works. A real send needs the Turnstile widget to allow the host (see
`turnstile-spin/`), and sends real email: get the owner's go-ahead first.

Set environment variables in `.dev.vars` for local testing:
```
RESEND_API_KEY=re_xxxxx
TURNSTILE_SECRET_KEY=xxxxx
```

Test:
- Form renders with all fields
- Turnstile produces a token (interaction-only: it shows only when it wants a tap)
- Submission sends both admin notification and acknowledgment emails
- Every outcome, mocked: `node scripts/audit-mobile.mjs --form` (exits 1 on a wrong state,
  focus, post count or lost text)
- The Sent panel stays until closed; Close returns to an empty form with focus on Send
- Offline at send: the panel appears, the page stays, and the text is still in the form

## Rules

- Always validate fields server-side in the Workers function, not just client-side
- Always escape user input with `escapeHtml()` before inserting into email HTML
- Never remove the Turnstile verification
- Never remove the Google Ads conversion tracking without explicit instruction
- Never load a form message from a lazy chunk: offline, the chunk fails and takes the page with it
