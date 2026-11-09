# Acceptance

The plan's acceptance checklist (items 1 to 14), against `feature/mobile-redesign` on
2026-11-09: build of commit `a39080a` plus WP14's docs and the acknowledgment email's link
fix, which changes nothing in `out/`. Owner decisions made after the plan are in
`decisions.md`; open items are in `backlog.md` by ID.

Commands ran on this Mac with `CHROME_PATH` set to the installed Chrome. Each script serves
`out/` itself, blocks every other host and mocks `/api/contact`, so nothing was sent.

| # | Item | Result |
|---|------|--------|
| 1 | Tap targets 44px, inputs 16px | **Pass** |
| 2 | Bar position, menu over bar, no Tawk on phones, two actions on error screens | **Pass** |
| 3 | Every S row in both languages, screenshot pairs | **Pass**, Arabic wording waits on item 14 |
| 4 | Every API code reaches its state with the text intact | **Pass** |
| 5 | Wi-Fi off at browse, mid-form and at send | **Needs a real phone**, and one known failure (MB-05) |
| 6 | One conversion per tap, one lead per lead | **Pass** |
| 7 | 154 pages match the WP0 snapshot except CTA labels and additions | **Pass** |
| 8 | `npm run check` and `npm run typecheck` | **Pass** |
| 9 | `/contact` field ≤ 850px; `/products` and Home ≤ 7,500px at 390 | **Pass**, Home **owner-accepted deviation** |
| 10 | Desktop at 1280 differs only in the allowed ways | **Pass** |
| 11 | Phone LCP, CLS and `/contact` TBT within 10% of baseline | **Fails on Home LCP** (MB-06); the rest pass |
| 12 | JavaScript off: tile, footer nav, form fallback, bar | **Pass** |
| 13 | Keyboard and screen reader pass; fold tap on Android keeps the bar | **Needs a person and a real phone**; emulated checks pass |
| 14 | WP14 deliverables exist; a Gulf Arabic speaker signed off the catalogue | Deliverables **pass**; sign-off **needs the owner** (MB-30) |

## 1. Tap targets and inputs

`node scripts/audit-mobile.mjs --strict` (the 10 page types in EN and AR, and the 404, at
320, 360 and 390):

```
audit-mobile: 63 page loads at 320, 360, 390px: 0 of 2625 controls under 44px, 0 inputs under 16px, bar moved on 0, 0 page error(s)
```

Baseline (WP0): 3,805 of 4,743 controls under 44px and 36 inputs under 16px.

## 2. The bar, the menu, Tawk, the error screens

- Same run as item 1: the bar (`data-action-bar`) is 64px tall, full width, flush with the
  bottom, at the top, middle and end of every page, at every width (`320:64`, `360:64`,
  `390:64`, `stable: true` on all 63 loads, the 404 included).
- The open menu covers it: at 390 on `/products/carpet`, EN and AR, the element at the bar's
  centre with the menu open is the menu panel, not the bar (scratch check, `elementFromPoint`).
- No Tawk on phones: none of the 63 loads below 768 asked for `embed.tawk.to`
  (`otherHosts` in the audit's output); only `www.googletagmanager.com`.
- The two actions: the 404 has Call and Get a Free Quote (WhatsApp) in both languages
  (`docs/mobile-states/s16-404.jpg`); `error.tsx` (S15) has Call and Reload over the bar's
  Call and Get a Free Quote. The self-contained screens have the actions their catalogue rows
  give them: the offline page (S14) Try again and Call (WhatsApp can't open offline), and
  `global-error.tsx` Call and Reload. Call is on every one.

## 3. The state catalogue

28 screenshot pairs in `docs/mobile-states/` (index in its README), one per S row, with S7,
S15, S16 and S18 shown in each of their variants. Each pair's words were read out of the page
in both languages and compared with the catalogue: they match, split into headline and facts
where a row has two sentences. Where the build differs from the catalogue, on purpose:

- S17 is one line for every job without a price, and S14's draft line is S15's "Your
  message is saved." / "رسالتك محفوظة.": owner decisions of 2026-11-09 (`decisions.md`).
- S10's long-field messages and the Sent panel's WhatsApp follow-up text are not in the
  catalogue; they are on the Arabic reader's list (`backlog.md`, MB-30).
- S16's 404 shows Browse Products, Return Home, the five categories and Contact in both
  languages, with Call and Get a Free Quote along the bottom.

The Arabic itself waits on the Gulf Arabic reader (item 14).

## 4. Every API code

`node scripts/audit-mobile.mjs --form --widths=390` (every single outcome, `CONTACT_SCENARIOS`
in `scripts/lib/browser.mjs` plus network, hang, offline and each Turnstile mode, and the
multi-step flows, among them `resend-409`, a retry whose Resend answer is 409, and
`send-unknown-retry`):

```
audit-mobile: 112 form runs, 0 with problems
```

Each run checks the state the form ends in, where focus is, how many requests were posted
and that the typed text is still there. The earlier full run at 360 and 390 (stage 5) was
224 runs with 0 problems.

## 5. Wi-Fi off

Needs real phones (MB-27). What the emulation shows:

- **Mid-form and at send: pass.** Offline mid-form, the badge above Send says
  "OFFLINE · DRAFT SAVED"; Send shows S11 and posts nothing; reconnecting shows S12, and Send
  then sends once (`core-flow.md` flow 3; `audit-mobile --form`, `offline` and the
  `offline-*` flows).
- **Browsing: one known failure (MB-05).** A tap on a link the page had already prefetched
  while online works offline (`/about` to `/contact`). A tap on one it hadn't
  (`/about` to `/services/wardrobes`, below the fold) ends on the browser's offline page at
  `/services/wardrobes.txt`, and a reload once back online shows the raw data file:

  ```
  {"from":"/about","to":"/services/wardrobes","offlineUrl":"chrome-error://chromewebdata/", ... "afterReload":{"url":"/services/wardrobes.txt","type":"text/plain","start":"1:\"$Sreact.fragment\"\n2:I[9766,[],\"\"] ..."}}
  ```

  The same in Arabic. That is Next 15.5's fallback, not a page of ours; the fixes are in
  `backlog.md`. The service worker's offline page covers it once released (WP13), except on
  a first visit.
- The offline page itself (S14) was rendered from `out/sw.js`: `docs/mobile-states/s14-offline-page.jpg`.

## 6. Analytics

Walked in `core-flow.md` at 390, EN and AR, reading `dataLayer` after each tap:

| Tap | Fired |
|-----|-------|
| Bar's Get a Free Quote | 1 Ads `whatsappClick` conversion + 1 GA4 `whatsapp_click` (`sticky_bar:category:carpet`) |
| The bar again, same visit | 1 more of each (each tap is a tap; MB-04) |
| S1's Back to WhatsApp | `whatsapp_reopen` only, no conversion |
| S3's Get a Free Quote | 1 conversion + 1 `whatsapp_click` (`feedback_s3`) |
| Sent | 1 `formLead` conversion + 1 `generate_lead` |
| Correct and resend, then Sent | `form_correction` only, no second lead |
| Sent panel's Continue on WhatsApp | `whatsapp_click` with `conversion: false`, no Ads conversion |
| Failure's Send this on WhatsApp | 1 conversion + 1 `whatsapp_click` (`contact_form_failed`) |
| Any Call | `phone_click` only (no Ads call conversion exists) |

## 7. The SEO snapshot

`node scripts/snapshot-seo.mjs --diff` against the WP0 baseline (`2f10125`):

```
snapshot-seo: 154 pages against baseline 2f10125: 0 failure(s), 14 to look at, 1183 planned or added
```

The 14 to look at are the ones the stage 5 review accepted: the contact merge's new blocks
on `/contact` and `/ar/contact` and the form's order on Home. The planned changes are the
CTA labels, the breadcrumb separators, the S17 lines and the one-screen contact page. No
title, description or h1 changed, Home's included.

## 8. Checks

```
npm run typecheck   exit 0
npm run build       exit 0  (externalize-flight: 155 pages, 7662 KB moved to /_flight/)
npm run check       exit 0
check-text-ratio: 154/154 pages at or above 10%
check-arabic: 77 Arabic pages, 0 problems
check-page-weight: 0 problem(s) on 154 pages; largest hydration data 77 KB (/ar/products/carpet)
check-internal-links: 0 problem(s) on 32 keyword pages; fewest links 6
check-consistency: 0 problem(s); 972 CTAs on 155 pages, breadcrumbs on 152, 4 self-contained file(s) checked for phone and hours
```

The tightest text-to-HTML page is `/ar/products/luxury-majlis-sofa` at 11.86%, 4,717 bytes
of HTML to spare.

## 9. Heights at 390

From the item 1 run, 390x844:

| Page | EN | AR | Limit |
|------|----|----|-------|
| `/contact` first field top | 645 | 678 | ≤ 850 |
| `/products` height | 7,351 | 7,279 | ≤ 7,500 |
| Home height | 8,189 | 8,028 | about 8,000, owner-accepted 2026-11-09 (plan: 7,500) |

Baseline: `/contact` first field 1,167, `/products` 19,236, Home 10,517.

## 10. Desktop at 1280

`node scripts/audit-mobile.mjs --widths=1280 --no-404 --screenshots=… --full-page
--format=jpeg --quality=55`, then each image compared with `baseline/desktop/` (mean pixel
difference over the shared height, and the share of 20px bands that differ by more than 4):

| Page | Height EN (base → now) | Height AR | Bands differing EN / AR | What differs |
|------|------------------------|-----------|-------------------------|--------------|
| Home | 8,767 → 8,702 | 8,659 → 8,594 | 31% / 9% | Hero buttons now `.cta` / `.cta-2`; closing CTA "Chat on WhatsApp" → "Get a free quote on WhatsApp"; "Call Now" → "Call"; Send gold (`.cta-dark`); the form no longer reserves 65px for the security check (interaction-only), so everything below moves up 65px; footer button label |
| `/products` | 6,127 → 6,127 | 6,103 → 6,103 | 9% / 9% | Card button "Inquire on WhatsApp" → "Get a Free Quote", WhatsApp icon, full radius |
| Category | same | same | 2% / 2% | Band button fill |
| Product | same | same | 24% / 3% | Card button label, icon and radius; the gallery's video frame (EN) |
| `/services` | same | same | 0.4% | Closing CTA |
| Service | 6,785 → 6,821 | 6,591 → 6,627 | 69% / 62% | The S17 line in the band (+36px, everything below moves), band button gold |
| `/guides`, guide | same | same | ≤ 1.3% | Closing CTA |
| About | same | same | 2–3% | Closing CTA |
| `/contact` | 3,530 → 1,565 | 3,504 → 1,548 | 91% | The one-screen contact page (planned redesign) |

Allowed differences, and all that was found: CTA label and fill, the form's states, the
bar-free layout (the WhatsApp pill is unchanged), the contact page redesign, the S17 lines,
and phone-only breadcrumb steps (hidden from md). The cards were checked at 1280 (Home,
`/products`, category, product's related cards): same heights, only the button changed. The
desktop header matches the baseline link for link at 1024 and 1280 (WPD; `.nav-cta` keeps
"Get Quote").

## 11. Lab speed

`npm run perf -- --runs=3` (Lighthouse 12.8.2 mobile, the same method as `baseline/perf.md`),
then `npm run perf -- / /ar /contact --runs=5` for the pages near or over the limit. Each row
is the run with the median LCP.

| Page | LCP base → now (3 runs) | Change | 5 runs | CLS | TBT base → now | FCP |
|------|-------------------------|--------|--------|-----|----------------|-----|
| `/` | 2.3 → 2.8 s | **+22%** | 2.8 s (**+22%**) | 0 → 0 | 200 → 92 ms (5 runs: 16) | 0.9 → 1.1 s |
| `/ar` | 3.1 → 3.4 s | +10% | 3.3 s (+6%) | 0 → 0 | 39 → 49 ms (15) | 0.9 → 1.1 s |
| `/products` | 2.7 → 2.9 s | +7% | | 0 → 0 | 31 → 9 ms | 0.9 → 1.1 s |
| `/ar/products` | 3.2 → 3.3 s | +3% | | 0 → 0 | 17 → 43 ms | 0.9 → 1.1 s |
| `/contact` | 2.4 → 2.3 s | −4% | 2.5 s (+4%) | 0 → 0 | **261 → 42 ms (5 runs: 6)** | 1.0 → 1.1 s |
| `/products/carpet` | 3.2 → 2.6 s | −19% | | 0 → 0 | 81 → 28 ms | 0.9 → 1.1 s |
| `/products/artificial-grass-installation-work` | 4.0 → 4.1 s | +3% | | 0 → 0 | 68 → 465 ms | 0.9 → 1.1 s |
| `/services/wardrobes` | 2.7 → 2.9 s | +7% | | 0 → 0 | 12 → 13 ms | 0.9 → 1.1 s |

- **CLS:** 0.000 on every page, as before. Pass.
- **`/contact` TBT:** lower in both runs (42 and 6 ms against 261; the baseline's own spread
  was 27 to 823 ms). Pass.
- **LCP:** within 10% on seven of eight pages (`/ar` at the limit in the 3-run median, +6% in
  the 5-run). **Home fails: 2.8 s against 2.3 s in both medians, +22%.** Not accepted by the
  owner; MB-06.
- First paint is 0.2 s later on every page (0.9 to 1.1 s), and transferred bytes are up
  (scripts about +12 KB per page; images on Home 155 to 337 KB and `/products` 606 to 923 KB,
  MB-07). Not in the criterion, but it is the likely cause of Home's LCP: Home's LCP element
  is the hero h1, and in a DevTools-throttled trace (4x CPU, 1.6 Mbps) it paints at first
  paint, which lands with DOMContentLoaded (Home 3.0 to 3.3 s, `/contact` 3.0 s): anything
  that runs before the end-of-body hydration script moves it. That was not measured against
  `main` in the same session, so the cause is a lead, not a finding. Before release, run
  `main` and this branch back to back on the same machine.

## 12. JavaScript off

`node scripts/audit-mobile.mjs --strict --no-js`:

```
audit-mobile: 63 page loads at 320, 360, 390px: 0 of 2601 controls under 44px, 0 inputs under 16px, bar moved on 0, 0 page error(s)
```

And a scratch check at 390 with JavaScript off, EN and AR:

- **Tile:** a tap on the first tile's photo on `/products` opens `/products/artificial-flowers-grass`
  (`/ar/...` in Arabic): the stretched link works in the HTML.
- **Footer nav:** the menu button is a link to the footer's Products heading (`#ft-p`); the
  page scrolls there and the fold opens (`:target`). Footer folds open on tap (`<details>`).
- **Form fallback:** the `<noscript>` block has `tel:+97455512858` and
  `mailto:info@alarabiacarpets.com`.
- **Bar:** Call is `tel:+97455512858`; Get a Free Quote goes to `/contact` (`/ar/contact`), and
  on the contact page to its `#contact-form`.

## 13. Keyboard, screen reader, Android fold tap

Needs a person with a screen reader and a real Android phone (MB-28, MB-29). Emulated at
390, EN and AR:

- The open menu keeps focus inside it: 14 Tabs cycled through its links, Live chat, Get a
  Free Quote, the language link, the logo and Close, and back. Escape closes it and returns
  focus to the menu button.
- From the top of a product page, Tab goes header (logo, language, menu), the breadcrumb, the
  gallery's video controls, the description fold, the folded heading, Get a Free Quote, the
  FAQ questions, then the related guides. A fold opens from the keyboard (Enter).
- A tap on a Home fold opens it and leaves the bar where it was, visible.
- **Accepted deviation:** on category pages below md the visual order (`order-*`) differs
  from the focus order, which follows the DOM so headings and links stay where crawlers and
  `check-internal-links` count them (MB-50).

## 14. Deliverables and the Arabic sign-off

WP14's deliverables:

- `docs/mobile-audit/core-flow.md`: the four flows, one row per tap, walked in EN and AR.
- `docs/mobile-audit/backlog.md`: the backlog with IDs, from an emulated pass (the PRD's
  60-minute pass on a real phone still needs a person, MB-20).
- `docs/mobile-audit/acceptance.md`: this file.
- `docs/mobile-states/`: 28 EN | AR screenshot pairs and their index.
- `design.md`: "Site components as built" (`.cta` family, CTA vocabulary with the desktop
  header's exception, page header, type on phones, StatePanel, action bar, folds, tiles,
  gallery, z-stack).
- `CLAUDE.md`, `.claude/skills/contact-form/skill.md`, `.claude/skills/turnstile-spin/skill.md`
  updated to the code as it is.

**The Gulf Arabic sign-off has not happened.** The catalogue and the list of strings to read
are in `backlog.md` (MB-30). Release waits on it.

## Accepted deviations

| What | Decided |
|------|---------|
| Home at about 8,000px on a 390 phone (item 9) | Owner, 2026-11-09 |
| Desktop header button keeps "Get Quote", weight 500 | Owner, 2026-11-09 |
| One S17 line; S14's draft line is S15's | Owner, 2026-11-09 |
| Category pages: focus order follows the DOM, not the visual order on phones (MB-50) | WP11 review |
| Find in page and `#:~:text=` links can't open a closed fold on phones (MB-51) | WP10 review |
| `/contact` at 1366x657 fits one screen with a thin margin: the last fold clears the WhatsApp pill by 10.5px (EN) and 27px (AR) (MB-52) | Stage 5 review |
