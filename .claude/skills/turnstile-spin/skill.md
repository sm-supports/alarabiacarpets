# Turnstile Bot Protection

How Cloudflare Turnstile is wired into this project, and how to verify or change it.
Mirrors the Cloudflare Spin flow (`developers.cloudflare.com/turnstile/spin`), adapted to
what this machine and this Pages project can actually do.

## Current integration (complete — do not re-wire)

| Layer | File | Contract |
|-------|------|----------|
| Widget | `src/components/CloudflareTurnstile.tsx` | Explicit render, exposes `reset()` |
| Form | `src/components/ContactSection.tsx` | Renders widget, gates submit on token |
| Gate | `functions/api/contact.ts` | `verifyTurnstileToken()` before any business logic |

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
`action` mismatch, and unlisted `hostname`. Every failure returns 403 with a generic body; the
specific reason is logged server-side only.

`PRODUCTION_HOSTNAMES` gates which frontend origins are accepted. `TURNSTILE_HOSTNAMES`
overrides it — set it in `.dev.vars` for local work, never add `localhost` to the production value.

## Local testing is blocked by design

The widget is registered for the production domain only. On `localhost:8788` it fails with
Turnstile error **110200** (domain not allowed), so no real token can ever be minted locally.
A disabled submit button in local dev is **not** a code bug.

Cloudflare's always-passes test secret does not help: it returns `hostname: "example.com"` and no
`action`, so this Function's gate correctly rejects it.

To test locally you must first add `localhost` and `127.0.0.1` to the widget's domains
(dashboard → Turnstile → widget → Settings) and put the real secret in `.dev.vars`.

## The in-app browser pane cannot verify this widget

Do not try to confirm the widget renders using the Claude browser pane. It reports
`window.innerHeight === 0`, so nothing can ever intersect the viewport. `ContactSection.tsx`
wraps the form in a scroll-reveal wrapper that stays `opacity-0` until an IntersectionObserver
fires, and Turnstile refuses to mount into a hidden container. The result looks alarming and is
entirely a harness artifact:

- `window.turnstile` is an object and the `cf-turnstile-response` input exists, but its inner div
  is empty, no `challenges.cloudflare.com` iframe mounts, the token stays empty, and the submit
  button stays disabled.
- `scrollIntoView()` does not change `getBoundingClientRect()` — a tell that the page is not
  painting at all.
- Forcing `opacity: 1 !important` on the wrapper does not help; the zero-height viewport is the
  root cause.

Verify the widget in a real browser with a real viewport instead, or infer it from the Turnstile
dashboard's "Likely human" score, which is only populated when real traffic is being scored.

## Verifying the live integration without a Cloudflare token

Cloudflare's dashboard may warn *"Siteverify isn't being called"* even when the integration is
correct: the widget mints a token on every contact-page view, but only an actual form submission
redeems one. A low-traffic form therefore shows a poor issued-vs-redeemed ratio.

To check whether siteverify is genuinely being reached, exploit the length short-circuit in
`verifyTurnstileToken` — a token over 2048 chars is rejected *before* the fetch, one under it is
not. Both return an identical 403. Interleave the two and compare medians; a consistent offset of
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
