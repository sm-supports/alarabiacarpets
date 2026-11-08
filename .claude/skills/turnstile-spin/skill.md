# Turnstile Bot Protection

How Cloudflare Turnstile is wired into this project, and how to verify or change it.
Mirrors the Cloudflare Spin flow (`developers.cloudflare.com/turnstile/spin`), adapted to
what this machine and this Pages project can actually do.

## Current integration (complete — do not re-wire)

| Layer | File | Contract |
|-------|------|----------|
| Widget | `src/components/CloudflareTurnstile.tsx` | Explicit render, `appearance: "interaction-only"`, exposes `reset()` |
| Form | `src/components/ContactSection.tsx` | Renders widget; Send is never disabled and sends once a token exists |
| Gate | `functions/api/contact.ts` | `verifyTurnstileToken()` before any business logic |

The widget shows nothing unless Cloudflare wants a tap, so the form reserves no space for it.
Below md it loads (about 1.6 MB) on the first focus in the form or press of Send; at md and up,
when the form comes within 400px of the viewport. A press before there is a token shows
"Running a quick security check" and sends when the token arrives; after 15 s without one
(the clock stops while a challenge shows) it says the check can't run. The form uses every
callback: `before-interactive` / `after-interactive` (tap the box), `timeout` (didn't pass,
press Send, which resets the widget), `error` and `unsupported` (can't run; offline, the
widget is remounted when the `online` event fires, and only then).

Token rules in the form: a fetch that rejects (no answer at all) keeps the unused token for
the retry; any HTTP answer, and the 20 s abort, reset the widget for a fresh one.

| Constant | Value |
|----------|-------|
| Sitekey | `0x4AAAAAACfJwedz6riyzASy` (public; `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) |
| Action | `contact` — must match on both sides |
| Secret | `TURNSTILE_SECRET_KEY` — Pages env var, and `.dev.vars` locally |
| Account | SM SUPPORTS, `5b939878a3419bdc5cdf60169e383004` |
| Pages project | `alarabiacarpets` |

This project uses **explicit render** (`api.js?render=explicit` + `turnstile.render()`) and
sends the token as the JSON field `turnstileToken`. That is a deliberate deviation from the
Spin doc's implicit `class="cf-turnstile"` / `cf-turnstile-response` form-field pattern —
equivalent, and required because the form posts JSON from React rather than doing a native
form submit. Both sides agree on the field name; do not "fix" one side alone.

## Rules

- **Gate, don't replace.** The check runs inside the existing handler, before its logic.
- **Never call siteverify from the browser.** Backend only.
- **Never** `cat` or `grep` `.env` / `.dev.vars` unmasked — they hold the live Resend key and the
  Turnstile secret. A repo-wide grep leaked this widget's secret into a transcript on 2026-09-06.
  Use `sed -E 's/=.*/=<masked>/'`, or read key names only.
- Pipe every Cloudflare API response through `jq 'del(.result.secret)'` before printing.
- Prove secret validity with a probe that prints **only an error code**, never the value.
- Never write the secret anywhere except the user's own store (Pages env var, `.dev.vars`).

## Server-side contract

`verifyTurnstileToken()` must keep failing closed on all of: transport error, non-2xx,
malformed body (including a literal `null` — a bare cast does not catch it), `success !== true`,
`action` mismatch, and unlisted `hostname`. Leave the function itself as it is.

Every failure returns 403 `{"error": "Bot verification failed", "code": ...}`; the specific
reason is logged server-side only. `code` is one of two classes, chosen by `botCode()` outside
`verifyTurnstileToken()`, so the form can say the right thing:

| `code` | Reasons (`verification.reason`, or any of siteverify's comma-joined error codes) | Form shows |
|--------|------------|-----------|
| `bot_unavailable` | `secret-not-configured`, `no-hostnames-configured`, `siteverify-unavailable`, `missing-input-secret`, `invalid-input-secret`, `internal-error`, `action-mismatch`, `hostname-mismatch` | "We can't run the security check right now", Call and WhatsApp |
| `bot_rejected` | everything else: `invalid-token`, `timeout-or-duplicate`, `invalid-input-response`, `not-successful`… | "The security check didn't pass", press Send to retry |

The first class is what a visitor can't fix by getting a new token (our configuration, or
Cloudflare being down). A request with no token at all is 400 `bot_required`, shown like
`bot_rejected`. When adding a reason to `verifyTurnstileToken()`, decide its class in
`CHECK_UNAVAILABLE`; the default is `bot_rejected`. The other codes the Function sends
(`bad_body`, `fields_required`, `too_long`, `invalid_email`, `send_failed`) are documented
there and in `CONTACT_SCENARIOS` in `scripts/lib/browser.mjs`, which mocks every answer.

`PRODUCTION_HOSTNAMES` gates which frontend origins are accepted. `TURNSTILE_HOSTNAMES`
overrides it — set it in `.dev.vars` for local work, never add `localhost` to the production value.

## Local testing is blocked by design

The widget is registered for the production domain only. On `localhost:8788` it fails with
Turnstile error **110200** (domain not allowed), so no real token can ever be minted locally.
"We can't run the security check right now" after Send in local dev is **not** a code bug. To
see the form's states locally, use `node scripts/audit-mobile.mjs --form`, which replaces
`api.js` with a stub and mocks `/api/contact` (see `scripts/lib/browser.mjs`).

Cloudflare's always-passes test secret does not help: it returns `hostname: "example.com"` and no
`action`, so this Function's gate correctly rejects it.

To test locally you must first add `localhost` and `127.0.0.1` to the widget's domains
(dashboard → Turnstile → widget → Settings) and put the real secret in `.dev.vars`.

## The in-app browser pane cannot verify this widget

Do not try to confirm the widget renders using the Claude browser pane. It reports
`window.innerHeight === 0`, so nothing can ever intersect the viewport, and at desktop widths
the widget loads only when the form is near it. The result looks alarming and is entirely a
harness artifact:

- `window.turnstile` is an object and the `cf-turnstile-response` input exists, but its inner div
  is empty, no `challenges.cloudflare.com` iframe mounts, the token stays empty, and Send ends in
  "We can't run the security check right now" after 15 s.
- With `interaction-only` an empty-looking widget is normal even in a real browser: it only shows
  when Cloudflare wants a tap.
- `scrollIntoView()` does not change `getBoundingClientRect()` — a tell that the page is not
  painting at all.
- The form no longer has a scroll-reveal wrapper, so there is no `opacity` to force; the
  zero-height viewport is the root cause.

Verify the widget in a real browser with a real viewport instead, or infer it from the Turnstile
dashboard's "Likely human" score, which is only populated when real traffic is being scored.

## Verifying the live integration without a Cloudflare token

Cloudflare's dashboard may warn *"Siteverify isn't being called"* even when the integration is
correct: the widget mints a token on every contact-page view, but only an actual form submission
redeems one. A low-traffic form therefore shows a poor issued-vs-redeemed ratio.

To check whether siteverify is genuinely being reached, exploit the length short-circuit in
`verifyTurnstileToken` — a token over 2048 chars is rejected *before* the fetch, one under it is
not. Both return an identical 403 with `code: "bot_rejected"` (a bogus token gets siteverify's
`invalid-input-response`); `bot_unavailable` for the under-2048 token means the siteverify call
itself failed, for example on a wrong secret. Interleave the two and compare medians; a consistent offset of
a few ms (a Cloudflare-internal hop) means siteverify is being called.

```bash
# Safe: no name/email/message, so nothing can be emailed on either code path.
curl -s -X POST https://alarabiacarpets.com/api/contact \
  -H 'Content-Type: application/json' -d '{"turnstileToken":"<120 chars>"}' \
  -o /dev/null -w '%{time_total}\n'
```

Measured 2026-09-07: >2048 chars median 38.0ms, <2048 chars median 44.5ms, and 0/30 of the
siteverify-path samples beat the fastest short-circuit sample. Siteverify **is** being called.

The only complete proof is a real submission succeeding, since the gate requires `success` +
`action` + `hostname` together. That sends a genuine email to `info@alarabiacarpets.com` — get
the user's go-ahead first.

## Cloudflare API steps (need a Turnstile-scoped token)

Wrangler here is 3.114 (project) / 4.40 (global); `wrangler turnstile widget` needs **4.109+**, so
use the REST API. The token must be exported in `~/.zshenv` — a tool shell does not inherit an
`export` typed into an interactive terminal.

```bash
# Widget metadata, secret stripped
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/challenges/widgets/$SITEKEY" \
  | jq 'del(.result.secret)'

# Is the secret bound in Pages production? Key names only.
curl -s -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$ACC/pages/projects/alarabiacarpets" \
  | jq -r '.result.deployment_configs.production.env_vars | keys[]'

# Secret validity: prints only the error code.
#   invalid-input-response -> secret is correct
#   invalid-input-secret   -> wrong secret
curl -s -X POST https://challenges.cloudflare.com/turnstile/v0/siteverify \
  -d "secret=$SECRET" -d "response=dummy" | jq -c '."error-codes"'
```

## If the secret is ever rotated

Rotate in the dashboard → update the Pages `TURNSTILE_SECRET_KEY` → update `.dev.vars` → redeploy.
The live form rejects every submission between the rotation and the redeploy, so do it deliberately.

## Related

`contact-form/` for form fields and API behaviour, `deploy/` to ship changes.
