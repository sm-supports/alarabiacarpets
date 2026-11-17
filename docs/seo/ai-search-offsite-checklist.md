# Being cited by AI search: off-site checklist

Written 17 November 2026, alongside the on-site work on `feature/ai-search`.

ChatGPT, Perplexity, Gemini, Copilot and Google's AI answers decide which local business to name
mostly from sources outside the site:

- the business's map listings and their reviews
- directories
- other sites that mention it

The site itself is in order:

- AI crawlers are allowed.
- Every page has its FAQs and schema in the HTML.
- Guides open with a direct answer.

What follows is the owner's list, most important first. Every item uses the same name, address
and phone number (NAP), written exactly like this:

> Al Arabia Carpets · Al Mansoura St, Doha, Qatar · +974 5551 2858 · alarabiacarpets.com
> Arabic name: سجاد العربية · Hours: every day, 8:00 AM to 10:00 PM

## 1. Google Business Profile (do first)

Local answers in Google and Gemini come straight from it, and Bing can import it (item 3).

- [ ] Claim or verify the profile at business.google.com.
- [ ] Set the primary category to the main trade, e.g. Carpet store. Add secondary categories
      only for work the business really does: Flooring store, Curtain store, Furniture store,
      Interior designer.
- [ ] Set the NAP and hours above exactly, and use the website `https://alarabiacarpets.com`.
- [ ] Add services with short descriptions, using the same wording as the service pages.
- [ ] Add photos of real jobs. These are the same rule as the site: no third-party renders or
      stock photos.
- [ ] Send the developer the profile's share link and the year the business started. They go
      into the schema (`sameAs`, `hasMap`, `foundingDate`) in one line each.

## 2. Reviews

- [ ] After each installation, send the customer the profile's review link on WhatsApp with
      one line of thanks.
- [ ] Reply to every review, good or bad, within a few days.
- [ ] No discounts or gifts for reviews. Never ask only happy customers (both break Google's
      rules).
- [ ] Keep review stars off the site until reviews are actually shown on a page. Google
      penalises marked-up reviews it cannot see (this is a site rule in `CLAUDE.md`).

## 3. Bing Places and Apple

Copilot, and partly ChatGPT search, lean on Bing's data; Siri and Apple Maps use Apple's.

- [ ] **Bing Places** (bing.com/forbusiness): choose "Import from Google Business Profile".
  - An imported, verified Google profile is verified on Bing automatically.
  - It takes about 10 to 14 days to go live.
  - Turn on periodic sync so changes carry over.
- [ ] **Apple Business** (business.apple.com, formerly Apple Business Connect):
  - Apple's country list includes Qatar.
  - Whether the place-card ("Brand and Location") features are open to Qatar businesses
    was not clear from Apple's page. Try to claim the place card. If Qatar is not offered,
    skip this item.

## 4. Qatar directories

Add the business to each with identical NAP. These were found on 17 November 2026; check each
site's terms, since some charge for listings.

| Directory | Where | Notes |
|---|---|---|
| Qatar Living Services | qatarliving.com/services | Create an account, post a service listing with photos of real work. The most-read local site. |
| Qatar Yello | qataryello.com | Has a "Carpet & Rug Dealers" category. |
| Qatar Online Directory | qataronlinedirectory.com | Has a flooring contractors category. |
| Marhaba QBiz | marhaba.qa/qbiz-me | Online business directory from Marhaba. |
| AngloInfo Doha | angloinfo.com/doha/directory | Expat audience. Its wording suggests paid advertising. |

Skip directories that only exist to sell links. One accurate listing on a site people use is
worth more than ten on sites nobody visits.

## 5. Mentions from clients and partners

The home page names 13 clients, including Ezdan, Doha Festival City and Al Muftah Group. A
mention or a "supplier" link from any of them, or from a supplier whose products you fit, is
the kind of independent reference AI answers trust.

- [ ] Ask the clients you have a good relationship with whether they list contractors or
      suppliers anywhere.
- [ ] Ask your carpet, SPC and wallpaper suppliers whether they have a "where to buy" or
      "installers" page.
- [ ] One home-page logo (logo8, a green oval with an "A") could not be identified from the
      image. Tell the developer whose it is, so it can be named on the site.

## 6. Wikidata: later, not now

Wikidata is a strong source for AI answers, but it deletes entries about small businesses that
have no independent sources. Create an item only after at least one independent publication has
written about the business, such as a newspaper or trade magazine, not a directory or press
release. Until then, an entry is likely to be removed.

## 7. Measuring it

**Baseline, to read now in GA4.**

1. Open Reports → Acquisition → Traffic acquisition.
2. Change the dimension to "Session source".
3. Filter for sources containing `chatgpt`, `perplexity`, `gemini`, `copilot` or `claude`.
4. Note the sessions for the last 90 days.
5. Repeat on the same date each month.

(The GA4 connector used for this was out of calls until 4 December 2026, so this baseline has
not been recorded yet.)

**Monthly prompt check.**

- Ask each engine the same ten questions:
  - ChatGPT with search on
  - Perplexity
  - Google (AI Mode or the AI Overview)
  - Gemini
  - Copilot
- Record three things:
  - whether Al Arabia Carpets is named
  - which page is cited
  - which competitors are named

| # | Prompt |
|---|---|
| 1 | Best carpet shop in Doha |
| 2 | Where can I buy carpet in Qatar |
| 3 | SPC flooring price in Qatar |
| 4 | Vinyl flooring installation in Doha |
| 5 | Event carpet supplier in Qatar |
| 6 | Office carpet tiles in Doha |
| 7 | Made-to-measure curtains in Doha |
| 8 | Sofa upholstery in Doha |
| 9 | محل سجاد في الدوحة |
| 10 | تركيب باركيه في قطر |

**Crawler activity.** Cloudflare dashboard → AI Crawl Control shows which AI bots fetch the
site and how often. A bot that stops appearing is worth looking into.

## Sources checked for this list

- [Bing Places import from Google Business Profile](https://ppc.land/bing-places-for-business-migrates-to-bing-com-domain-with-import-tools/)
- [Bing Places listing guide](https://whitespark.ca/guides/the-ultimate-guide-to-your-bing-places-listing/)
- [Apple Business availability by country](https://support.apple.com/126603)
- [Qatar Living Services](https://www.qatarliving.com/services)
- [Qatar Yello](https://www.qataryello.com/companies/TFS?showmap=1)
- [Qatar Online Directory, flooring contractors](https://www.qataronlinedirectory.com/150086/company-list/companies-qatar/FLOOR-MATERIALS-)
- [Marhaba QBiz](https://marhaba.qa/qbiz-me/)
- [AngloInfo Doha directory](https://www.angloinfo.com/doha/directory)
