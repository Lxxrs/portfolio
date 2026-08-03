// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";

export default defineConfig({
  compressHTML: true,

  devToolbar: {
    enabled: true,
  },

  experimental: {
    chromeDevtoolsWorkspace: true,

    svgOptimizer: svgoOptimizer({
      multipass: true,
      floatPrecision: 2,
      plugins: [
        "preset-default",
        "removeXMLNS",
        {
          name: "removeXlink",
          params: {
            includeLegacy: true,
          },
        },
      ],
    }),
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "JetBrainsMono",
      cssVariable: "--font-jetbrains-mono",
      // Monospace fallbacks so metric-optimized fallback + degraded rendering
      // still matches the terminal aesthetic (Astro defaults to sans-serif).
      fallbacks: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono-Regular.woff2"],
            weight: "regular",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Bold.woff2"],
            weight: "bold",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Medium.woff2"],
            weight: "medium",
            style: "normal",
          },
        ],
      },
    },
  ],

  output: "static",

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
        "default-src 'none'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'none'",
        "media-src 'none'",
        "object-src 'none'",
        "base-uri 'none'",
        "form-action 'none'",
        "manifest-src 'none'",
        // One deliberate exception to the otherwise strict default-src 'none':
        // the Tor Snowflake proxy widget embedded in the Contact section.
        "frame-src https://snowflake.torproject.org",
      ],
    },
  },

  site: "https://larmart.de",

  vite: {
    plugins: [
      tailwindcss(),
      yaml(),
      visualizer({ emitFile: true, filename: "stats.html" }),
    ],
  },
});
