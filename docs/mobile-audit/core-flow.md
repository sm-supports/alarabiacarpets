# Core flows on a phone

The PRD's Phase 1: the four flows that bring in a lead, one row per tap. For each tap,
what the visitor sees and what the site records, how to take it back, and what comes next.

**How these were walked.** On 2026-11-09, in headless Chrome at 390x844 with touch and an
Android user agent, in English and in Arabic, against a build of `feature/mobile-redesign`
served from `out/`. Every other host was blocked, `/api/contact` was mocked with the
Function's real answers, and leaving for WhatsApp or the dialer was simulated: the site's
own click handlers ran, the browser was stopped from leaving, and the page was then
reported hidden and shown again. So each row records the link the phone would open and
the analytics the tap fired, not WhatsApp or the call itself. The real-phone checks that
remain are MB-20 to MB-29 in `backlog.md`. The states named here are in the plan's catalogue,
with screenshots in `docs/mobile-states/`.

Nothing on the site is destructive, so there is no undo to offer (plan, PRD 1.2). "Take
back" says how a visitor gets out of each step. WhatsApp sends nothing until they press
send there.

Prefill links below show the production origin; the walk ran on `127.0.0.1`.

## 1. Ad landing, the bar, WhatsApp, and back

English ad: `/products/carpet?gclid=…&lang=en`. Arabic ad: `/ar/products/carpet?gclid=…`.

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | Land from the ad | The category page, "Carpets in Qatar" / its Arabic h1, with the bar along the bottom: [Call][Get a Free Quote] (Arabic mirrored: [اطلب عرض سعر مجاني][اتصل]). `lang=en` makes `AdLanguage` set `site_lang=en`. Nothing else is recorded | Phone's Back returns to Google | The bar, or the band's quote button |
| 2 | Bar: **Get a Free Quote** | WhatsApp opens on +974 5551 2858 with "Hi, I'd like a quote for Carpets.⏎Size:⏎https://alarabiacarpets.com/products/carpet" (AR: "السلام عليكم، أبي عرض سعر لـ السجاد.⏎المقاس:⏎…/ar/products/carpet"). No `gclid`, no `lang`. Fires one Ads `whatsappClick` conversion and GA4 `whatsapp_click`, source `sticky_bar:category:carpet` | Leave WhatsApp without pressing send: nothing is sent | Add the size, press send |
| 3 | Come back to the browser | S1 slides up over the bar: "WhatsApp opened. Nothing is sent until you press send. Add sizes and photos so we can prepare your quote." [Back to WhatsApp], and Close (×). Shown once per session | Close: the panel goes, nothing recorded | Back to WhatsApp |
| 4 | **Back to WhatsApp** | The same chat opens again; the panel closes. GA4 `whatsapp_reopen` with the same source, and no conversion | | |
| 5 | Come back again | Nothing: S1 has been shown this session | | The bar is still there |
| 6 | Bar again, then back | A new tap: one more conversion and `whatsapp_click`. No S1 | | |
| 2b | Bar, and WhatsApp doesn't open (page still in front 2.5 s later) | S2: "Still here? WhatsApp may not have opened." [Call], Close. The tap was still counted | Close | Call |
| 2b′ | **Call** on S2 | The dialer with +974 5551 2858. GA4 `phone_click`, source `feedback_s2` | Cancel the call sheet | Talk to the showroom |
| 2c | Bar while offline | S4 at once: "You look offline. WhatsApp may not open." [Call]. The link still goes through (screenshot `s04-offline-tap.jpg`) | Close | Call, which needs no data |

## 2. Call

From `/services/wardrobes` (the same on any page).

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | Bar: **Call** | The dialer with +974 5551 2858 (`tel:+97455512858`). GA4 `phone_click`, source `sticky_bar_call:service:wardrobes`. No Ads conversion: there is no call conversion yet (MB-38) | Cancel the call or the call sheet | Talk |
| 2 | Come back within 20 s (3 s in the walk) | S3: "Couldn't get through? We're open every day, 8:00 AM to 10:00 PM." [Get a Free Quote], Close | Close | WhatsApp instead |
| 3 | **Get a Free Quote** on S3 | WhatsApp with this page's quote: "Hi, I'd like a quote for Wardrobes & Cabinets.⏎Size:⏎…/services/wardrobes". One `whatsappClick` conversion and `whatsapp_click`, source `feedback_s3` (counted like the bar, `BAR_SENDS_ADS`) | Don't press send | Send |
| 4 | Come back from WhatsApp | S1, the first WhatsApp of this session | Close | |
| 5 | Close | The panel goes | | |
| 6 | Call again, back after 21 s (a call that connected) | Nothing is shown | | |

## 3. The form: sent, and not sent

On `/contact` (Home has the same form). The first field's top is at 645px (EN) / 678px
(AR) on a 390x844 phone, so it is on the first screen.

**Sent**

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | Type name, email and message | Kept in this tab's session storage as they type (a reload, the language switch or the offline page don't lose it). On a phone the security check starts loading at the first focus | Clear the fields | Send |
| 2 | **Send** (server answers 200) | S6 in place of the button: "SENT · 5:22 PM · REF 4D1BCC4D / We have your message, Mariam. / We'll reply to mariam@example.com. / Next: send sizes and photos on WhatsApp." [Correct and resend][Continue on WhatsApp], Close. Focus moves to the headline. One `formLead` conversion and GA4 `generate_lead`. The text leaves storage; the time and REF stay | Correct and resend | Continue on WhatsApp |
| 3 | **Continue on WhatsApp** | "Hi, I sent a message on your website, REF 4D1BCC4D. Here are my sizes and photos." (AR: "السلام عليكم، أرسلت لكم رسالة من الموقع، المرجع 698BD8C4. هذي المقاسات والصور."). GA4 `whatsapp_click` with `conversion: false`, source `contact_sent_followup`: no Ads conversion, no S1 afterwards | Don't press send | Send photos |
| 4 | **Correct and resend** | The form again, holding what was sent | Close instead | Edit |
| 5 | Edit, **Send** | S6 again with a new REF. The request says `correction: true`, so the team's email subject starts "Correction:". GA4 `form_correction`, and no second lead | | |
| 6 | Close | An empty form, focus on Send | | |
| — | Reload after Sent | S6r: "SENT · REF … / Already sent at 5:16 PM.", Close. Nothing is sent again | Close | |

**Not sent** (the email service refuses: `send_failed`)

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | **Send** | S7: "NOT SENT / Our email service didn't accept your message. / Your text is still here." [Try again][Call][Send this on WhatsApp]. Focus to the headline; the text stays in the fields. GA4 `form_failed {code: send_failed}` | Edit the fields | Send this on WhatsApp |
| 2 | **Send this on WhatsApp** | WhatsApp with the message itself and the name ("Carpet for a majlis, about 4 x 5 m.⏎⏎Mariam"). One `whatsappClick` conversion, source `contact_form_failed`. A message too long for the link is cut, with a notice and Copy (S19) | Don't press send | Send |
| 3 | **Call** | The dialer. GA4 `phone_click`, source `contact_form_failed` | Cancel | |
| 4 | **Try again** (server answers 200) | S6, one `formLead` and `generate_lead`. With step 2 this visitor counted twice (MB-03) | | |

**No connection at Send**

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | **Send** with no connection | Nothing is posted. S11: "OFFLINE · DRAFT SAVED / Your text is still here. / Turn on Wi-Fi or mobile data, then press Send. Calls don't need internet. We're open every day, 8:00 AM to 10:00 PM." [Call]. GA4 `form_failed {code: offline}` | | Call, or reconnect |
| 2 | The connection comes back | S12: "You're back online. Press Send when ready." [Send]. Nothing sends by itself | | Send |
| 3 | **Send** on S12 | S6, one lead | | |

The other outcomes (security check pending, challenged, down or failed; no reply; field
errors; draft restored) are S5 to S10 and S13, each with a screenshot pair.

## 4. `/products`, a tile, the product, the quote

| # | Tap | What happens | Take back | Next |
|---|-----|--------------|-----------|------|
| 1 | Open `/products` | Categories, then 37 products as two columns of tiles: photo, name, price or "Free quote", two lines of description. The bar along the bottom | | A tile |
| 2 | Tap a tile's photo (anywhere on the tile) | The product page, `/products/artificial-flowers-grass`. A 2px gold line runs at the top if the page takes over 250 ms. GA4 `page_view` | Phone's Back | |
| 3 | Look at the product | Breadcrumb, the photo gallery (swipe; "1/N"), category, h1, price. The in-page quote button is lower (1,286px EN, 1,266px AR); the bar's is on the first screen | | Bar |
| 4 | Bar: **Get a Free Quote** | "Hi, I'd like a quote for Artificial Flowers Grass.⏎Size:⏎…/products/artificial-flowers-grass" (AR: "…لـ عشب وزهور صناعية…"). One `whatsappClick` conversion and `whatsapp_click`, source `sticky_bar:product:artificial-flowers-grass` | Don't press send | Send |
| 5 | Come back | S1, Close | Close | |
| 6 | Close, then the phone's Back | `/products` at the same scroll position (910px EN, 897px AR), on the tile that was tapped | | Another tile |

## What a person still has to try

The walk can't show WhatsApp or the dialer opening, iOS's call sheet, whether iOS reports
the page hidden and shown again the way the walk did (S1 to S3), the keyboard and the
safe area, or the real Turnstile and Tawk. Those are MB-20 to MB-29 in `backlog.md`.
