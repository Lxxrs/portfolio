// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://larmart.de",
  output: "static",
  compressHTML: true,
  security: {
    csp: {
      algorithm: "SHA-256",
      // Astro hashes every bundled script/style automatically.
      // The one manual hash below is for the theme-init inline script in
      // BaseLayout.astro — recompute it if you EVER edit that script:
      //   pnpm build, copy the <script> body from dist/index.html, then:
      //   printf '%s' '<script body>' | openssl dgst -sha256 -binary | openssl base64
      scriptDirective: {
        resources: ["'self'"],
        hashes: [
          {
            hash: "sha256-wlJS1CP0c1ItA6M/rRl9rhVD/QwTjwLvJE6TiIdV738=",
            kind: "element",
          },
        ],
      },
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "media-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
        "manifest-src 'none'",
      ],
    },
  },
  vite: { plugins: [tailwindcss()] },
});
