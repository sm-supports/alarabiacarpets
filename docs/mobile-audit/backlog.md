# Consistency backlog

What is still open after the mobile redesign (WP0 to WP14 on `feature/mobile-redesign`),
with an ID each, so a fix or a decision can name it.

**The PRD's usage pass has not been done by a person.** The plan asks for 60 minutes on a
real phone, in English and Arabic, before WP7 and again on the preview. Nobody was free, so
this backlog comes from an emulated pass instead: headless Chrome at 320, 360 and 390 with
touch and an Android user agent, the four flows in `core-flow.md`, every state in
`docs/mobile-states/`, the audit and snapshot scripts, and the reviews of each stage. An
emulator can't open WhatsApp or the dialer, can't show iOS's sheets, keyboard or safe area,
and can't run the real Turnstile or Tawk. **MB-20 (the real-phone pass) is still needed.**

Status: **open** (to do), **owner** (needs the owner's decision or data), **phone** (needs
a real phone), **watch** (after release).

## Found in the emulated pass

| ID | Status | What | Where | Suggested fix |
|----|--------|------|-------|---------------|
| MB-01 | open | A video whose poster fails gets the S16 band across its top, and the alt text in the band runs under the slide count badge ("1/2"), clipped mid-word | `/products/luxury-majlis-sofa` with the poster refused: `docs/mobile-states/s16-image-failed.jpg` | Give `.imgx-v` an end padding the badge's width, or clamp the band's name short of `.pc-count` |
| MB-02 | owner | The Arabic quote prefill reads "أبي عرض سعر لـ السجاد": "لـ" then a space before a name that starts with "ال", where Arabic writes "للسجاد". The string is older than the redesign (`common.quoteMessage`), but the bar now sends it from every product, service and category page | `src/i18n/ar.client.ts` `quoteMessage` | For the Arabic reader (MB-30): a wording that doesn't attach to the name, such as "أبي عرض سعر: {name}" |
| MB-03 | watch | One visitor can count twice: a failed send, then "Send this on WhatsApp" (a `whatsappClick` conversion), then "Try again" that succeeds (a `formLead`). Two channels, so by design, but it inflates leads | `core-flow.md` flow 3 | Read it in the 28-day review (MB-40) |
| MB-04 | watch | Every bar tap is a conversion, the same visitor's second tap included (the old pill did the same). Whether Ads counts these once per ad click depends on the conversion action's "Count" setting, which nobody has confirmed | `core-flow.md` flow 1, step 6 | Owner confirms `whatsappClick` counts "One" (MB-41) |
| MB-05 | open | On a phone, tapping a link while offline can leave the site: Next 15.5 (static export) fetches the page's data as `/about.txt`, and when that fails it loads `/about.txt` itself. A link that was on screen while still online was prefetched and works offline; one that wasn't (below the fold, or the connection dropped first) fails. The phone shows its own offline page at that address, and a reload once back online shows the raw data file, not the page. The service worker covers it (its offline page puts the real address back) but ships later and can't cover a first visit. See below | Any internal link not prefetched, offline. Reproduced in `acceptance.md` item 5 (`/about` to `/services/wardrobes`, EN and AR) | A zone rule or a Next patch, below |
| MB-06 | open | **Acceptance item 11 fails on Home:** lab LCP 2.8 s against 2.3 s, +22%, in both the 3-run and the 5-run median. First paint is 0.2 s later on every page measured (0.9 to 1.1 s). Home's LCP element is the hero h1, which paints at first paint, and in a DevTools-throttled trace first paint lands with DOMContentLoaded, after the end-of-body hydration script; scripts are about 12 KB more per page. A lead, not a finding: `main` wasn't measured in the same session | `npm run perf`; `acceptance.md` item 11 | Run `main` and this branch back to back on one machine; if it holds, cut what runs before first paint on Home (the layout's new client code, the error chunks every page now loads) or get the owner to accept it |
| MB-07 | open | More image bytes in the lab: Home 155 to 337 KB, `/products` 606 to 923 KB. Most likely because the pages are shorter, so more lazy photos sit within the browser's loading distance of the first screen (requests: Home 52 to 58, `/products` 56 to 71); nothing loads at full size. Not confirmed | `npm run perf` | Check that the tiles ask for the 360px copy; consider `loading="lazy"` distance on tile rows past the second |
| MB-08 | open | The hours appear in more places than `check-consistency` checks: `facts.whereText`, the Home FAQ answer and the contact info text in `en.ts` / `ar.ts` | `scripts/check-consistency.mjs` | Extend the hours check to those strings |
| MB-09 | owner | The sofa upholstery FAQ says the price comes after the check ("الفحص"), next to the new S17 line "Free measurement and quote" | `/services/sofa-upholstery` | Owner picks one wording; body copy, so not changed here |
| MB-10 | open | Home's about fold: the "+" sits on the h2 but opens the text below the always-open intro, so a visitor may expect the intro itself to fold. And `.fold-lead` needs the intro directly between `.fold-h` and `.fold-body`: anything put between them shows the folded text on phones | `HomeView`, `src/index.css` `.fold-lead` | Watch in the real-phone pass; a comment in `HomeView` already says so |

### MB-05: the offline tap and the `.txt` address

What happens: the router's data request for the next page (`/about.txt`, `/index.txt` for
Home) fails, and Next falls back to a full load of that same `.txt` URL instead of the page's.

Two ways out, either one enough:

1. **Zone rule (no code).** A Cloudflare Single Redirect at the zone, ahead of the Qatar
   rule: when the path ends in `.txt`, is not `/robots.txt` or `/llms.txt`, and the request
   is a page load (`http.request.headers["sec-fetch-mode"][0] eq "navigate"`, or
   `sec-fetch-dest` is `document`), 302 to the same path without `.txt` (`/index.txt` to
   `/`), keeping the query. The router's own data fetch is `cors` mode, so it is untouched.
   Check first that request-header fields are allowed in Redirect Rules on this plan; if
   not, a Transform-free Worker route on `*.txt` does the same. The redirect lands on the
   real page, which then fails offline in the browser's normal way, and reloads correctly.
   Can't be tested on a preview URL, like the Qatar rule.
2. **Next patch.** In Next's client router, the MPA fallback after a failed RSC fetch
   navigates to the fetch URL; with `output: 'export'` that URL ends in `.txt`. Patch it
   (`patch-package`, in `fetch-server-response`) to navigate to the original href, or move
   to a Next release that does this. Check the 15.5.x and 16 changelogs first; a patch has to
   be re-checked on every Next upgrade.

The service worker (WP13) already turns the `.txt` navigation into the offline page at the
right address, so after its release this only affects visitors without the worker.

## Needs a real phone

| ID | Status | What to check | Pass when |
|----|--------|---------------|-----------|
| MB-20 | phone | The PRD's 60-minute usage pass, EN and AR, on the preview: the four flows in `core-flow.md` and free browsing. Add what it finds here | Done by a person, findings logged |
| MB-21 | phone | S1 to S3 on iOS Safari and Android Chrome: does `visibilitychange` fire when WhatsApp or the dialer opens and when the visitor comes back, and does `pagehide` fire only on a real navigation? The emulation flipped `visibilityState` by hand | S1 after a real WhatsApp round trip, S3 after a call cancelled within 20 s, nothing after a real call |
| MB-22 | phone | The S2 / S3 drop rule (plan WP6): if S2 shows while WhatsApp is in fact opening (slow app start), or S3 after a call that connected, remove that state. On iOS a `tel:` tap first shows the system's call sheet, so the page may not go hidden until the call starts | No false alarm in ten tries each; otherwise delete S2 or S3 in `lib/feedback.ts` and say so here |
| MB-23 | phone | The `tel:` sheet: Call in the bar, S2, S11, the 404 and the error pages each open the dialer with +974 5551 2858 | All open it |
| MB-24 | phone | Keyboard and safe area: the bar hides while a field has focus and comes back after; nothing sits under the home indicator; the form's Send stays visible with the keyboard up. `viewport-fit` is unchanged; only if an iPhone shows a gap at the bottom does it get its own commit with side insets and a landscape check | No overlap on an iPhone with a home indicator and on Android with gesture navigation |
| MB-25 | phone | Real Tawk from the menu's Live chat row on the preview: opens maximized, minimizing hides the bubble, no bubble ever over the bar | As described |
| MB-26 | phone | Real Turnstile on the preview: the widget shows S8 there unless the preview host is added to the widget (expected, see `turnstile-spin/`). curl the Function: no token 400 `bot_required`, a bogus token 403 `bot_rejected`, bad JSON 400 `bad_body` | The three codes, after confirming the preview has its secrets |
| MB-27 | phone | Wi-Fi off at browse, mid-form and at send (acceptance item 5) on both phones, after a first visit | No browser or Next error page except MB-05's, which is known |
| MB-28 | phone | One screen reader pass (VoiceOver and TalkBack): the bar's two buttons are named, S1 to S4 are read when they appear, focus goes to the headline on S7 to S10, the folds are read as the heading plus a collapsed button | As described |
| MB-29 | phone | A fold tap on Android keeps the bar where it was (emulated: it does) | Bar doesn't move |

## Needs the owner

| ID | Status | What |
|----|--------|------|
| MB-30 | owner | **Arabic reader.** A Gulf Arabic speaker signs off the state catalogue (the plan's "State catalogue" section, all S rows, badges, shared sentences and Arabic buttons) and the strings below that were added since `main` and are not word for word from the catalogue. Acceptance item 14 waits on this |
| MB-31 | owner | **GA4 `source` custom dimension**, before release: GA4 Admin, Custom definitions, an event-scoped dimension on the parameter `source`. Dimensions don't fill in retroactively, so every day without it is lost. The sources in use are listed below |
| MB-32 | owner | **Ads baseline.** 28 days of conversions by device from before the release, and confirmation that the `whatsappClick` action counts "One" (`docs/mobile-audit/baseline/README.md`: neither could be read). Without them MB-40 has nothing to compare against |
| MB-33 | owner | **Photography.** 46 of 88 catalog photos top out at 720px; 10 to 15 sharper photos of real jobs would help most, starting with the gallery heroes and the `/products` tiles |
| MB-34 | owner | **The `/about` photo.** The shop sign reads "Al Arabia Incorporate Enterprise W.L.L" with phone numbers that aren't the site's, there is a camera stamp naming a person, and it loads with high priority. Keep or replace |
| MB-35 | owner | **Ramadan hours.** The site shows "every day, 8:00 AM to 10:00 PM" everywhere (the panels, the contact page, the offline and error pages) and has no "Open now" badge, so nothing breaks during Ramadan. If the hours change then, all the copies change together (`check-consistency` holds the self-contained ones to `formStates.open`) |
| MB-36 | owner | **The acknowledgment email promises a reply "typically within 24 hours"** ("وعادةً خلال 24 ساعة"). It is older than the redesign, and the redesign promises no reply time anywhere else. Keep it only if the team can hold to it; otherwise drop the clause from `functions/email-templates/acknowledgment.ts` |
| MB-37 | owner | **Go-aheads:** the merge and the production release; one TEST form message on production afterwards; then a Qatar phone with no `site_lang` cookie (the redirect rule can't be tested on a preview) |
| MB-38 | owner | **A call conversion in Ads.** Calls are GA4-only (`CONVERSION_LABELS.phoneClick` is null), so calls that replace WhatsApp taps leave bidding. Compare both in the 28-day review, then create a Secondary call conversion if wanted |

## Watch after release

| ID | Status | What | Rollback |
|----|--------|------|----------|
| MB-40 | watch | **28 days of Ads.** Judge the bar on the `sticky_bar:*` sources against real chats. Day 28: taps up over 30% with chats flat means flip `BAR_SENDS_ADS` to `false` in `src/lib/analytics.ts`, which keeps bar taps in GA4 only and also takes the md+ pill's taps out of bidding | One-line change and a deploy |
| MB-41 | watch | **Weekly chat counts** for the 28 days: the owner counts real WhatsApp chats and calls each week, so MB-40 has its denominator | |
| MB-42 | watch | **`/products` in Search Console** for 28 days (the grid became tiles; no text removed) | Revert the tiles commit |
| MB-43 | watch | **The service worker's release** (WP13, second release): rehearse the kill switch on a preview first (it was rehearsed on a local build only), then `SERVICE_WORKER = true`. After it is live, `/products/sofa` must still 301 | `SERVICE_WORKER = false`, or the kill switch (`CLAUDE.md`) |

## GA4 sources in use

Every WhatsApp and call CTA sends `source`. Static parts are literal; `{…}` is the page's
type, slug or id.

- Action bar and pill: `sticky_bar:{type}:{slug}`, `sticky_bar_call:{type}:{slug}` (type
  `product`, `service`, `category`, or `page` with the path, e.g. `sticky_bar:page:home`),
  `floating_button` (md and up)
- Header and menu: `navbar_desktop`, `navbar_mobile`
- Footer: `footer_get_quote`, `footer_contact`, `footer_social`
- Pages: `category:{slug}:hero`, `category:{slug}`, `service:{slug}:hero`, `service:{slug}`,
  `product_detail:{id}`, `product_detail_bottom:{id}`, `product_card:{name}`,
  `showcase:{id}`, `products_page`, `services_section`, `about_page`, `guide:{slug}`
- `/contact`: `contact_page_whatsapp`, `contact_page_call` (the tiles),
  `contact_section_primary`, `contact_section_methods`, `contact_section_call`
- Form outcomes: `contact_sent_followup` (no Ads conversion), `contact_form_failed`
- Tap feedback: `feedback_s2`, `feedback_s4` (Call), `feedback_s3` (WhatsApp, counted like
  the bar); S1's reopen is the event `whatsapp_reopen` with the first tap's source
- Error page: `page_error` (Call)

Events: `whatsapp_click`, `whatsapp_reopen`, `phone_click`, `generate_lead`,
`form_correction`, `form_failed {code}`, and the web vitals (`LCP`, `CLS`, `INP`, ...).

## Arabic reader list (MB-30)

Collected with `git diff main -- src/i18n functions public/sw.js`, plus the two
self-contained files (`src/app/global-error.tsx`, `src/app/global-not-found.tsx`).
`main` has not touched these paths since the branch point (`2f10125`).

**1. The catalogue.** Everything in the plan's "State catalogue": the badges, {kept}, {open},
{calls}, rows S1 to S19 and the Arabic buttons. Built as written, split into headline and
facts where a row has two sentences. Two rows changed by owner decision after the plan
(`decisions.md`): S17 is one line, "القياس وعرض السعر مجانًا. أرسل المقاسات وبعض الصور.", and
the offline page's draft line is S15's "رسالتك محفوظة.".

**2. Added since `main`, not word for word from the catalogue:**

| Key | Arabic | English | Where it shows |
|-----|--------|---------|----------------|
| `common.videoUnavailable` | الفيديو غير متوفر | Video unavailable | S16, a video that failed |
| `nav.menu` | القائمة | Menu | The menu's name for screen readers |
| `nav.liveChat` | محادثة مباشرة | Live chat | The phone menu's chat row (S18) |
| `bar.size` | المقاس: | Size: | Second line of the bar's WhatsApp prefill (the plan gives it; it isn't in the catalogue table) |
| `formStates.longName` | اختصر اسمك إلى 100 حرف. | Shorten your name to 100 characters. | S10, a name over the limit |
| `formStates.longEmail` | اختصر البريد الإلكتروني إلى 254 حرفًا. | Shorten the email to 254 characters. | S10 |
| `formStates.longMessage` | اختصر رسالتك إلى 5000 حرف. | Shorten your message to 5,000 characters. | S10 |
| `formStates.send` | إرسال | Send | S9 and S12's button |
| `formStates.followUp` | السلام عليكم، أرسلت لكم رسالة من الموقع، المرجع {ref}. هذي المقاسات والصور. | Hi, I sent a message on your website, REF {ref}. Here are my sizes and photos. | WhatsApp prefill from the Sent panel |
| `statePanel.close` | إغلاق | Close | Every Close button's name |
| `statePanel.call` | اتصل | Call | The one call label |
| `price.freeQuote` (`ar.ts`) | عرض سعر مجاني | Free quote | `/products` tiles with no price |
| `pages.contact.call` | اتصل | Call | `/contact` tile |
| `pages.contact.email` | البريد الإلكتروني | Email | `/contact` |
| `pages.contact.directions` | الموقع على الخريطة | Directions | `/contact` |
| `pages.contact.showroomShort` | شارع المنصورة، الدوحة، قطر | Al Mansoura St, Doha, Qatar | `/contact` |
| `pages.contact.hoursLine` | مفتوحين يوميًا من 8:00 صباحًا إلى 10:00 مساءً · الدوحة والريان والوكرة والخور ولوسيل وكل مناطق قطر | Open every day … · Doha, Al Rayyan, Al Wakrah, Al Khor, Lusail and all of Qatar | `/contact` |
| acknowledgment email `ref` | المرجع | Your reference | The customer's email |
| `global-error.tsx` | سجاد العربية / الصفحة ما انفتحت. / رسالتك محفوظة. / اتصل / أعد التحميل | | A root layout failure (copies of catalogue lines) |
| `public/sw.js` | بدون إنترنت / ما فيه اتصال حاليًا. / شغّل الواي فاي أو البيانات، والصفحة ترجع أول ما يرجع الاتصال. / رسالتك محفوظة. / المكالمات ما تحتاج إنترنت. / نفتح يوميًا من 8:00 صباحًا إلى 10:00 مساءً. / حاول مرة ثانية / اتصل | | The offline page (S14, split from the catalogue row) |

**3. Older strings the redesign now shows far more often**, worth the same read:
`common.quoteMessage` (MB-02), `nav.getFreeQuote` "اطلب عرض سعر مجاني" (the bar),
`common.heroQuote` "اطلب عرض سعر مجاني على الواتساب".

## Accepted deviations

Recorded here and in `acceptance.md`; nothing to do unless the owner reopens them.

| ID | What | Why it stays |
|----|------|--------------|
| MB-50 | On category and service pages below md, keyboard focus follows the DOM order, not the visual order: `order-*` puts the priced tiles, the price guide and the galleries higher on screen than they sit in the HTML | The DOM order keeps headings and internal links where `check-internal-links` and crawlers count them (WP11) |
| MB-51 | Find in page and a search result's `#:~:text=` link can't open a closed fold on a phone | The text sits outside `<details>` so desktop never folds in browsers without `::details-content`; `hidden="until-found"` would read as hidden text to tools that don't apply CSS (`src/index.css`, folds) |
| MB-52 | `/contact` at 1366x657 fits one screen by a thin margin. Measured 2026-11-09: the last fold ends at y=578.5 EN and 561.8 AR, the WhatsApp pill starts at y=589, so the page's last line clears the pill by 10.5px in English and 27px in Arabic; `<main>` ends at 618.5 and 601.8 in the 657px viewport. The coordinator's brief called it a 1px margin; these are the numbers today | It fits; any added line on that page, or a wrapped panel title, will push it under the pill |
| MB-53 | The desktop header button keeps "Get Quote" at weight 500, unlike the rest of the `.cta` family | Owner decision 2026-11-09, so the desktop header doesn't move (`decisions.md`) |
| MB-54 | Home at about 8,000px on a 390 phone, over the plan's 7,500 | Owner decision 2026-11-09 (`decisions.md`) |
