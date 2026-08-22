import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit real static HTML for every route into out/. All content comes from
  // src/data/*.ts -- there is no per-request data -- so static generation gives
  // the same SEO result as SSR while leaving functions/api/contact.ts working
  // unchanged as a Cloudflare Pages Function.
  output: "export",

  // Required by output: 'export'. We also deliberately keep plain <img> tags
  // rather than next/image: product paths contain '&' (public/Products/barkia&pvc/)
  // which would truncate the ?url= param of /_next/image.
  images: { unoptimized: true },

  // Emits out/products/carpet.html served at /products/carpet, matching the
  // 43 URLs already indexed. Flipping this to true would change every canonical.
  trailingSlash: false,

  reactStrictMode: true,

  // Lint is run separately via `npm run lint`. The pre-existing rule violations
  // predate this migration -- the Vite build never invoked ESLint -- so they are
  // not allowed to block a deploy. Types are still checked on every build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
