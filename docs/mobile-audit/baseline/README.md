# Baseline for the mobile redesign

Taken on 2026-11-07 from a clean build of `main` at `2f10125`, before any site change.
Every later package is compared against these files.

| File | What it is | Made with |
|---|---|---|
| `seo-snapshot.json` | Title, description, h1s, headings and `<main>` text of all 154 pages, from the static HTML | `node scripts/snapshot-seo.mjs --write` |
| `audit.json` | Tap targets, input sizes, bottom-bar position and page heights: 10 page types EN and AR plus the 404, at 320, 360, 390 | `node scripts/audit-mobile.mjs --out=...` |
| `perf.md` | Lighthouse on a simulated slow phone, median of 3 runs | `npm run perf -- --runs=3` |
| `desktop/` | Full-page 1280px screenshots of the 10 page types, EN and AR (20 JPEGs, 6.7 MB) | `node scripts/audit-mobile.mjs --widths=1280 --no-404 --screenshots=... --full-page --format=jpeg --quality=55` |

To compare a later build: `npm run build`, then `node scripts/snapshot-seo.mjs --diff`.
All of these need `CHROME_PATH` if Chrome isn't in `/Applications`, and none is in
`npm run check` yet.

## Still needed from the owner

**Google Ads baseline: not taken.** The plan asks for 28 days of Ads conversions by device,
and for confirmation that the `whatsappClick` conversion counts "One". Neither could be
read: the Ads connector is out of calls, and the account open in the browser shows only
cancelled accounts. The owner needs to export both before release, because the 28-day
review in the plan's Risks table ("taps up over 30% with chats flat") has nothing to
compare against without them, and after release the old numbers mix with bar taps.

## What the baseline shows

Measured at 390px, English. Counts differ slightly from the plan's production figures
(61 of 96 home controls) because this script leaves out `sr-only` elements and links in
running text. It runs the same way before and after, so the comparison holds.

| Page | Height | Controls | Under 44px | First WhatsApp or call link | First field |
|---|---|---|---|---|---|
| `/` | 10,517 | 82 | 55 | 2,256 | 8,756 |
| `/products` | 19,236 | 211 | 188 | 1,477 | |
| `/products/carpet` | 8,068 | 79 | 57 | 476 | |
| `/products/artificial-grass-installation-work` | 5,250 | 52 | 43 | 1,745 | |
| `/services` | 7,098 | 78 | 61 | | |
| `/services/wardrobes` | 7,250 | 58 | 47 | 364 | |
| `/guides` | 7,733 | 80 | 55 | | |
| `/guides/choosing-carpet-for-qatar-homes` | 5,633 | 50 | 43 | 4,256 | |
| `/about` | 5,116 | 39 | 37 | 3,735 | |
| `/contact` | 4,717 | 60 | 47 | 527 | 1,167 |
| 404 | 844 | 3 | 3 | | |

Across all 63 page loads: 3,805 of 4,743 controls are under 44px, 36 inputs are under 16px
(the form's three fields wherever it appears, on Home and `/contact`), and no page
overflows sideways. The WhatsApp pill holds its position on every page (left 20, 56x48, 20
above the bottom edge). The 404 has no pill.

### The contact form today

`--form` at 390, EN and AR, with a fake Turnstile and a mocked `/api/contact`:

| Outcome | What the visitor sees | Text kept |
|---|---|---|
| Success | Toast, and the form is replaced by a thank-you | Cleared, by design |
| `bot_rejected`, `bot_required`, `bot_unavailable` | Toast: "Verification failed" | Yes |
| Every other API failure, not-JSON, network failure | Toast: "Please try again later or contact us directly." No link, gone in 5 s | Yes |
| 20 s with no answer | Same toast | Yes |
| Turnstile error or script failure | Inline "We couldn't load the security check" with phone and email | Yes |
| Turnstile pending, challenge or timeout | Send stays disabled with no explanation | Yes |
| **Offline at send** | **The whole page becomes "Application error: a client-side exception has occurred"** | **No: form and text are gone** |

The last row confirms what the plan only inferred. The error toast is a lazy chunk, so the
failed send tries to load it, the chunk can't load offline, `ChunkLoadError: Loading chunk
3495 failed` reaches the root, and React replaces the page. WP1 exists to fix this.

## How to read these

- The audit blocks every other host, so Google tag, Ads and Tawk never see a run and don't
  appear in it. `otherHosts` in `audit.json` records what each page tried to reach. Today
  that's Tawk and Google tag on every page except the 404, plus Turnstile where the form is.
- `npm run perf` does load the real third-party tags, as `scripts/check-perf.mjs` says, so
  its page loads can reach GA4 with the hostname `127.0.0.1`.
- Audit and screenshots run with reduced motion on, so `.reveal` and `.hero-in` can't leave
  content transparent.
- In `desktop/` the WhatsApp pill sits partway down each image. It is `position: fixed`, so
  a full-page capture draws it at the bottom of the 900px viewport. It isn't a layout fault.
- Turnstile in the screenshots and the form runs is a dashed "Security check (stub)" box.
- The built contact chunk does contain the public Turnstile site key (checked with the
  value masked).
