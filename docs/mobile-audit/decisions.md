# Owner decisions after the plan

The plan (WP0 to WP14) was approved on 2026-11-07. These later decisions change what
`acceptance.md` (WP14) should hold the site to.

## 2026-11-09

| Decision | What changed | Acceptance |
|---|---|---|
| Home at about 8,000px on a 390 phone is accepted. No swipe strip for the showcase. | Nothing beyond the next row. | Item 9: Home is held to about 8,000px, not 7,500. Measured after the next row: 8,189 EN, 8,028 AR at 390 (`scripts/audit-mobile.mjs`). `/products` keeps 7,500. |
| Home's about intro ("Al Arabia Carpets is a home furnishing and flooring company in Doha...") stays open on phones. | Only the price list and the showroom paragraphs fold under the section's h2 (`.fold-lead` in `src/index.css`). | Same item: the intro is visible without a tap. |
| The team visits to survey and measure for floor mats, ceramic tiles and sofa upholstery too. | One S17 line for every job without a price: "Free measurement and quote. Send your sizes and a few photos." The "quote" and "check" variants and `quoteKind` are gone. | Item 3: S17 has one row, in both languages. |
| The desktop header button keeps its old label, "Get Quote" / "اطلب عرض سعر" (`nav.getQuote`). | Desktop header only, md and up. The phone bar, the menu and the footer keep "Get a Free Quote". From 1024 the header row matches the baseline link for link; at 768 the row fits on one line, where the baseline's wrapped. | Item 10: the desktop header has no CTA label change. `scripts/check-consistency.mjs` allows this label on `.nav-cta` alone. |
| The offline page (S14) says "Your message is saved." / "رسالتك محفوظة." when a draft exists, not {kept}. | `public/sw.js` uses `statePanel.draftSaved`, S15's sentence, which reads right on a page with no form. | Item 3: S14's draft line is S15's sentence. |
