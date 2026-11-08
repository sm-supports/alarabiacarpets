# Modify the Contact Form

## Architecture

| Layer | File |
|-------|------|
| Frontend form | `src/components/ContactSection.tsx` |
| Contact page | `src/app/contact/page.tsx` (server component, renders ContactSection) |
| API endpoint | `functions/api/contact.ts` (Cloudflare Workers) |
| Email template | `functions/email-templates/acknowledgment.ts` |
| Turnstile widget | `src/components/CloudflareTurnstile.tsx` |
| Outcome messages | Inline `StatePanel`s in `ContactSection.tsx` (`data-form-state`), strings in `formStates` in `src/i18n/*.client.ts`, one per API `code` |
| Draft | `src/lib/draft.ts`: the text in this tab's sessionStorage (`contact-draft`), with the submission id, or the sent time and REF after a send. Import-free, because `app/global-error.tsx` reads it |

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

The form fires conversion events — do not remove without explicit instruction:
- Form submission: `AW-16463357836/vNfLCO7DwcgbEIzPq6o9`
- WhatsApp clicks: `AW-16463357836/n6RiCOKH_I0bEIzPq6o9`

Conversion tracking lives in `src/lib/analytics.ts` (`trackFormLead`, `trackWhatsAppClick`, `trackPhoneClick`). All events use currency `QAR`. The legacy `gtag_report_conversion()` global is re-created by `src/components/ThirdPartyScripts.tsx` for backward compatibility.

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
- CORS: allows all origins (`"*"`) — frontend and API are on the same Cloudflare Pages domain

## Testing

```bash
npm run pages:dev
```

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
