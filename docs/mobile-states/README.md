# Mobile states, English and Arabic

One JPEG per state from the plan's state catalogue: English on the left, Arabic on the
right, each a 390x844 phone screen. Taken on 2026-11-09 from a build of
`feature/mobile-redesign` in headless Chrome (touch, Android user agent, reduced motion on),
with the repo's own test harness (`scripts/lib/browser.mjs`): a stand-in for Turnstile, a
mocked `/api/contact` that answers with the Function's real status and body for each code,
offline emulation, and every other host blocked, so nothing was sent anywhere.

| File | State | How it was reached |
|------|-------|--------------------|
| `s01-whatsapp-opened.jpg` | S1, back from WhatsApp (once per session) | Product page, bar's Get a Free Quote, page hidden then shown again |
| `s02-still-here.jpg` | S2, still on the page 2.5 s after a WhatsApp tap | Same tap, page left in front |
| `s03-call-back.jpg` | S3, back from Call in under 20 s | Bar's Call, page hidden for about a second |
| `s04-offline-tap.jpg` | S4, WhatsApp tap while offline | Offline emulation, then the bar's Get a Free Quote |
| `s05-checking.jpg` | S5, Send before the security check finished | Turnstile held pending |
| `s05b-challenge.jpg` | S5b, the check wants a tap | Turnstile in challenge mode. The dashed box is the test stand-in, not the real widget |
| `s05c-still-sending.jpg` | S5c, sending, then the slow-send line after 8 s | `/api/contact` answering after 15 s |
| `s06-sent.jpg` | S6, Sent, with REF | 200 |
| `s06r-already-sent.jpg` | S6r, a reload after Sent | 200, then a reload |
| `s07-not-sent.jpg` | S7, the email service refused | `send_failed` (`bad_body` and unknown codes show the same) |
| `s07-unreachable.jpg` | S7, the site couldn't be reached while online | The request fails at the network |
| `s07b-no-reply.jpg` | S7b, no reply, may have arrived | `send_unknown` (the 20 s abort shows the same) |
| `s08-check-down.jpg` | S8, the security check can't run | `bot_unavailable` (script failure, 15 s pending and a missing key show the same) |
| `s09-check-failed.jpg` | S9, the check didn't pass | `bot_rejected` (`bot_required` and the timeout callback show the same) |
| `s10-field-errors.jpg` | S10, field errors, inline | Send with no name, `name@` and no message |
| `s11-offline-at-send.jpg` | S11, offline at Send, draft saved | Offline emulation, then Send |
| `s12-back-online.jpg` | S12, reconnected | S11, then back online |
| `s13-draft-restored.jpg` | S13, draft restored | Typed, then a reload |
| `s14-offline-page.jpg` | S14, the service worker's offline page, with a draft in the tab | `out/sw.js` registered by hand in a scratch browser profile (`SERVICE_WORKER` stays `false` in the code), then the server stopped and offline emulation on |
| `s15-page-error.jpg` | S15, a page that throws (`error.tsx`), with a draft stored | `/contact` with its page components broken in the hydration data, as a bad deploy would serve it |
| `s15-global-error.jpg` | S15, a root layout that throws (`global-error.tsx`, self-contained) | The layout's `Providers` broken the same way |
| `s16-404.jpg` | S16, the 404 (one bilingual page) | An unknown English address and an unknown `/ar` address; both answer 404 |
| `s16-photo-tile-failed.jpg` | S16, a photo that failed (named tile) | `/products`, the first tile's image refused |
| `s16-image-failed.jpg` | S16, a video whose poster failed (band across the top) | `/products/luxury-majlis-sofa`, the poster refused |
| `s17-no-price.jpg` | S17, the no-price line | `/services/floor-mats` |
| `s18-live-chat-opening.jpg` | S18, menu's Live chat row while Tawk loads | Tawk's script held |
| `s18-live-chat-failed.jpg` | S18, the chat didn't open | Tawk's script refused (offline and the 8 s limit show the same) |
| `s19-long-prefill.jpg` | S19, a message too long for the WhatsApp prefill | `send_failed` with a long message: the notice and Copy |

What these can't show, and a real phone has to: WhatsApp and the dialer actually opening,
iOS's own call sheet, when iOS reports the page hidden and shown again (S1 to S3), the
keyboard over the form, the safe area at the bottom, and the real Turnstile and Tawk. See
`docs/mobile-audit/backlog.md`.

The strings in these screenshots match the catalogue in both languages (checked by
reading them out of each page, not only by eye); `docs/mobile-audit/acceptance.md` item 3
lists where the built copy differs from the catalogue on purpose.
