# Deploy to Cloudflare Pages

The site is a Next.js 15 App Router project using **static export** (`output: 'export'`).
`npm run build` prerenders every route to HTML in `out/`, which is what gets deployed.
The `functions/` directory is a separate Cloudflare Pages Function and is unaffected by the build.

## Pre-flight Checks

1. Run TypeScript check — must pass with zero errors:
   ```bash
   npx tsc --noEmit
   ```

2. Run the production build:
   ```bash
   npm run build
   ```

3. Verify `out/` contains a page per route (52 at time of writing: 47 static + 404 + guides):
   ```bash
   find out -name '*.html' | wc -l
   ```

4. Verify the deploy control files made it into `out/`:
   ```bash
   ls out/_redirects out/_headers out/_routes.json out/sitemap.xml out/robots.txt out/404.html
   ```

## SEO Regression Checks

These guard the invariants the site was rebuilt for. All should print nothing or the expected count.

5. Every product page has an `<h1>` and a unique title:
   ```bash
   grep -L '<h1' out/products/*.html; grep -h -o '<title>[^<]*' out/products/*.html | sort | uniq -d
   ```

6. The product grid still emits crawlable anchors (expect 43):
   ```bash
   grep -o 'href="/products/[a-z0-9-]*"' out/products.html | sort -u | wc -l
   ```

7. No SPA fallback rule (it would reintroduce soft-404s):
   ```bash
   grep -v '^\s*#' out/_redirects | grep '^/\*' && echo "FAIL: SPA fallback present"
   ```

8. Metadata is in the static HTML, not injected by JS:
   ```bash
   grep -o 'rel="canonical" href="[^"]*"' out/products/carpet.html
   ```

## Local Verification

9. Start full-stack local dev (builds, then serves `out/` with Functions):
   ```bash
   npm run pages:dev
   ```

10. Verify these routes load: `/`, `/products`, `/products/<id>`, `/guides`,
    `/guides/<slug>`, `/about`, `/contact`.

11. Verify an unknown URL returns a real 404, not 200:
    ```bash
    curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8788/not-a-real-page
    ```

12. Verify the contact Function still routes:
    ```bash
    curl -s -X POST http://localhost:8788/api/contact -H 'Content-Type: application/json' -d '{}'
    ```
    Expect `{"error":"Bot verification required"}`.

13. Submit a test contact form in the browser. Note: `.dev.vars` uses Cloudflare's
    always-passes Turnstile test secret, but the **Resend key is the live one**, so a
    successful submission sends a real email.

14. Stop the dev server.

## Deploy

15. Deploy to Cloudflare Pages:
    ```bash
    npm run deploy
    ```

16. Note the deployment URL from the output. Prefer verifying on a preview URL before
    promoting to production.

## Environment Variables

Set on the Cloudflare dashboard (Settings → Environment variables), not in code:

| Variable | Type | Notes |
|---|---|---|
| `RESEND_API_KEY` | Runtime secret | Used by `functions/api/contact.ts` |
| `TURNSTILE_SECRET_KEY` | Runtime secret | Server-side Turnstile verification |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | **Build-time** | Inlined at build. If missing, the Turnstile widget never renders and the contact form's submit button stays permanently disabled. Set for Production *and* Preview. |
| `NODE_VERSION` | Build-time | `20` |

For local development, set the two secrets in `.dev.vars` (gitignored) and the
`NEXT_PUBLIC_*` key in `.env` (also gitignored).

## Do Not Change

- `pages_build_output_dir = "out"` in `wrangler.toml` — must match the Next export directory.
- `public/_routes.json` — pinned to `{"include": ["/api/*"]}`. Because `functions/` exists,
  Pages otherwise auto-generates a `_routes.json` whose `exclude` list caps at 100 rules,
  far fewer than this export's file count, sending static requests through the Worker.
