// @ts-check
import { defineConfig, fontProviders, svgoOptimizer } from "astro/config";
import { visualizer } from "rollup-plugin-visualizer";
import tailwindcss from "@tailwindcss/vite";
import yaml from "@rollup/plugin-yaml";

export default defineConfig({
  build: {
    inlineStylesheets: "always",
  },

  compressHTML: true,

  devToolbar: {
    enabled: true,
  },

  experimental: {
    chromeDevtoolsWorkspace: true,

    contentIntellisense: true,

    incrementalBuild: true,

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
      fallbacks: ["ui-monospace", "SF Mono", "Menlo", "monospace"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono-Regular.woff2"],
            weight: "normal",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Bold.woff2"],
            weight: "bold",
            style: "normal",
          },
          {
            src: ["./src/assets/fonts/JetBrainsMono-Medium.woff2"],
            weight: 500,
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

      scriptDirective: {
        resources: ["'self'", { resource: "'none'", kind: "attribute" }],
      },

      styleDirective: {
        resources: ["'self'", { resource: "'none'", kind: "attribute" }],
      },

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
        "frame-src https://snowflake.torproject.org https://embed-snowflake.torproject.org",
      ],
    },
  },

  site: "https://larmart.de",

  vite: {
    plugins: [
      tailwindcss(),
      yaml(),
      visualizer({ emitFile: false, filename: "stats.html" }),
    ],
  },
});
