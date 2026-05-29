# Deploy to Cloudflare Pages

## Pre-flight Checks

1. Run TypeScript check — must pass with zero errors:
   ```bash
   npx tsc --noEmit
   ```

2. Run production build:
   ```bash
   npm run build
   ```

3. Verify `dist/` was created and contains `index.html`:
   ```bash
   ls dist/index.html
   ```

4. Check no assets exceed 1MB:
   ```bash
   find dist/assets -type f -size +1M
   ```
   If any files appear, investigate — large bundles indicate missing code splitting.

## Local Verification

5. Start full-stack local dev (Workers + static):
   ```bash
   npm run pages:dev
   ```

6. Manually verify these routes load correctly:
   - `/` (homepage with hero, products, services)
   - `/products` (product grid with category filter)
   - `/products/<any-product-id>` (detail page with media carousel)
   - `/about` (about page with story and values)
   - `/contact` (contact form with Turnstile widget)

7. Submit a test contact form to verify the Workers function processes it.

8. Stop the dev server.

## Deploy

9. Deploy to Cloudflare Pages:
   ```bash
   npx wrangler pages deploy dist --project-name alarabiacarpets
   ```

10. Note the deployment URL from the output.

## Environment Variables

These must be set on the Cloudflare dashboard (Settings → Environment variables), not in code:
- `RESEND_API_KEY` — Resend email service API key
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile server-side secret

For local development, set these in a `.dev.vars` file (gitignored).

## Post-Deploy Verification

11. Check the live site at `https://alarabiacarpets.com`
12. Test the contact form on production (Turnstile must verify)
13. Verify product images load (check browser console for 404s)
14. Confirm Google Analytics is firing (Network tab → googletagmanager)

## Rules

- Never deploy without a passing TypeScript check
- Never deploy without testing the build locally first
- The `wrangler.toml` config is authoritative — do not change `pages_build_output_dir` or `compatibility_flags`
- Project name is `alarabiacarpets` — do not change
