import { createHash } from "node:crypto";
import { defineConfig, mergeConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin, PluginOption } from "vite-plus";
import vueDevTools from "vite-plugin-vue-devtools";

// Typed separately so TypeScript doesn't recurse into UserConfig's deep union
// when checking the ~90-key object literal (causes TS2321 stack overflow).
const lintRules: Record<string, "error" | "warn" | "off"> = {
  "constructor-super": "error",
  "for-direction": "error",
  "getter-return": "error",
  "no-async-promise-executor": "error",
  "no-case-declarations": "error",
  "no-class-assign": "error",
  "no-compare-neg-zero": "error",
  "no-cond-assign": "error",
  "no-const-assign": "error",
  "no-constant-binary-expression": "error",
  "no-constant-condition": "error",
  "no-control-regex": "error",
  "no-debugger": "error",
  "no-delete-var": "error",
  "no-dupe-class-members": "error",
  "no-dupe-else-if": "error",
  "no-dupe-keys": "error",
  "no-duplicate-case": "error",
  "no-empty": "error",
  "no-empty-character-class": "error",
  "no-empty-pattern": "error",
  "no-empty-static-block": "error",
  "no-ex-assign": "error",
  "no-extra-boolean-cast": "error",
  "no-fallthrough": "error",
  "no-func-assign": "error",
  "no-global-assign": "error",
  "no-import-assign": "error",
  "no-invalid-regexp": "error",
  "no-irregular-whitespace": "error",
  "no-loss-of-precision": "error",
  "no-misleading-character-class": "error",
  "no-new-native-nonconstructor": "error",
  "no-nonoctal-decimal-escape": "error",
  "no-obj-calls": "error",
  "no-prototype-builtins": "error",
  "no-redeclare": "error",
  "no-regex-spaces": "error",
  "no-self-assign": "error",
  "no-setter-return": "error",
  "no-shadow-restricted-names": "error",
  "no-sparse-arrays": "error",
  "no-this-before-super": "error",
  "no-undef": "error",
  "no-unexpected-multiline": "error",
  "no-unreachable": "error",
  "no-unsafe-finally": "error",
  "no-unsafe-negation": "error",
  "no-unsafe-optional-chaining": "error",
  "no-unused-labels": "error",
  "no-unused-private-class-members": "error",
  "no-unused-vars": "error",
  "no-useless-backreference": "error",
  "no-useless-catch": "error",
  "no-useless-escape": "error",
  "no-with": "error",
  "require-yield": "error",
  "use-isnan": "error",
  "valid-typeof": "error",
  "no-array-constructor": "error",
  "no-unused-expressions": "error",
  "vue/no-arrow-functions-in-watch": "error",
  "vue/no-deprecated-destroyed-lifecycle": "error",
  "vue/no-export-in-script-setup": "error",
  "vue/no-lifecycle-after-await": "error",
  "vue/prefer-import-from-vue": "error",
  "vue/valid-define-emits": "error",
  "vue/valid-define-props": "error",
  "vue/no-multiple-slot-args": "warn",
  "vue/no-required-prop-with-default": "warn",
  "typescript/ban-ts-comment": "error",
  "typescript/no-duplicate-enum-values": "error",
  "typescript/no-empty-object-type": "error",
  "typescript/no-explicit-any": "error",
  "typescript/no-extra-non-null-assertion": "error",
  "typescript/no-misused-new": "error",
  "typescript/no-namespace": "error",
  "typescript/no-non-null-asserted-optional-chain": "error",
  "typescript/no-require-imports": "error",
  "typescript/no-this-alias": "error",
  "typescript/no-unnecessary-type-constraint": "error",
  "typescript/no-unsafe-declaration-merging": "error",
  "typescript/no-unsafe-function-type": "error",
  "typescript/no-wrapper-object-types": "error",
  "typescript/prefer-as-const": "error",
  "typescript/prefer-namespace-keyword": "error",
  "typescript/triple-slash-reference": "error",
};

// ─── Security Headers ─────────────────────────────────────────────────────────
//
// frame-ancestors, X-Content-Type-Options, Permissions-Policy, COOP, COEP, and
// CORP are HTTP-response-header–only. Browsers ignore them in <meta http-equiv>.
// They are applied via:
//   dev / preview  → server.headers / preview.headers (Vite built-in)
//   production     → dist/_headers  (Netlify / Cloudflare Pages / Codeberg Pages)
//                    + a fallback <meta> for the meta-compatible CSP subset
//
// unsafe-inline is required in dev only:
//   Vite HMR injects scripts; @tailwindcss/vite injects styles at runtime.
// ─────────────────────────────────────────────────────────────────────────────

const DEV_CSP: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": ["'self'", "'unsafe-inline'"],
  "style-src": ["'self'", "'unsafe-inline'"],
  "img-src": ["'self'", "blob:", "data:"],
  "font-src": ["'self'"],
  "connect-src": ["'self'", "ws:", "wss:", "https:"],
  "worker-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'none'"],
};

const PROD_CSP: Record<string, string[]> = {
  "default-src": ["'none'"],
  "script-src": ["'self'"],
  "style-src": ["'self'"],
  "img-src": ["'self'", "data:"],
  "font-src": ["'self'"],
  "connect-src": ["'self'"],
  "worker-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "object-src": ["'none'"],
  "frame-ancestors": ["'none'"],
  "upgrade-insecure-requests": [],
};

// Directives the CSP spec forbids inside <meta http-equiv="Content-Security-Policy">
const META_INCOMPATIBLE_CSP = new Set(["frame-ancestors", "report-uri", "sandbox"]);

/** Serialize a CSP directive map into a header / meta content string. */
function serializeCSP(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(" ")}` : k))
    .join("; ");
}

/** Like serializeCSP but silently drops directives unsupported inside <meta>. */
function serializeMetaCSP(directives: Record<string, string[]>): string {
  return serializeCSP(
    Object.fromEntries(Object.entries(directives).filter(([k]) => !META_INCOMPATIBLE_CSP.has(k))),
  );
}

// Full set of security response headers for production and preview.
// COOP + COEP together enable cross-origin isolation. Every resource on this
// site is served from 'self', so COEP require-corp is safe to use.
// X-Frame-Options is belt-and-suspenders with frame-ancestors for old browsers.
// HSTS: 2-year max-age (63072000 s) with includeSubDomains.
// To enroll in the HSTS Preload List, add `; preload` and submit at hstspreload.org.
const PROD_SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": serializeCSP(PROD_CSP),
  "Strict-Transport-Security": "max-age=300; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "no-referrer",
  "Permissions-Policy":
    "geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=(), browsing-topics=(), interest-cohort=()",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Resource-Policy": "same-origin",
};

// Dev: only the CSP is needed. Vite HMR and @tailwindcss/vite inject scripts
// and styles at runtime, so unsafe-inline is required. All other security
// headers are absent in dev — missing headers need no replacement.
const DEV_SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": serializeCSP(DEV_CSP),
};

/**
 * Production Vite plugin that:
 *  1. Computes SHA-384 SRI hashes for JS chunks in generateBundle.
 *  2. Injects a strict CSP <meta> tag and SRI integrity attributes into the
 *     built HTML (frame-ancestors excluded — HTTP-header–only per CSP Level 2).
 *  3. Emits `dist/_headers` — Codeberg Pages (Netlify format) with full
 *     PROD_SECURITY_HEADERS including HSTS, CORP, COOP, COEP, X-Frame-Options.
 *
 * Note: SRI is applied to JS only. CSS SRI is omitted because Vite's CSS
 * post-processing (charset injection, LightningCSS) can modify asset content
 * after generateBundle fires, causing a hash mismatch that silently blocks
 * the stylesheet. Same-origin CSS SRI adds minimal security value anyway.
 */
function productionCSP(): Plugin {
  // fileName (no leading slash) → "sha384-<base64>" — populated in generateBundle,
  // consumed in transformIndexHtml (post) which runs after Vite injects tags.
  const integrity = new Map<string, string>();

  return {
    name: "production-csp",
    apply: "build",

    generateBundle(_options, bundle) {
      // ── SRI hashes (JS only) ─────────────────────────────────────
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (!fileName.endsWith(".js")) continue;
        const source =
          chunk.type === "chunk"
            ? chunk.code
            : typeof chunk.source === "string"
              ? chunk.source
              : Buffer.from(chunk.source as Uint8Array);
        const hash = createHash("sha384").update(source).digest("base64");
        integrity.set(fileName, `sha384-${hash}`);
      }

      // ── _headers (Codeberg Pages / Netlify format) ───────────────────
      const lines = [
        "# HTTP security headers — auto-generated by productionCSP() in vite.config.ts",
        "# Format: Netlify / Codeberg Pages",
        "/*",
        ...Object.entries(PROD_SECURITY_HEADERS).map(([k, v]) => `  ${k}: ${v}`),
        "",
      ];
      this.emitFile({ type: "asset", fileName: "_headers", source: lines.join("\n") });
    },

    transformIndexHtml: {
      order: "post",
      handler(html) {
        // ── CSP <meta> ────────────────────────────────────────────────
        const metaTag = `<meta http-equiv="Content-Security-Policy" content="${serializeMetaCSP(PROD_CSP)}" />`;
        let result = html.replace(
          '<meta charset="UTF-8" />',
          `<meta charset="UTF-8" />\n    ${metaTag}`,
        );

        // ── SRI — <script src> ────────────────────────────────────────
        // Vite already emits `crossorigin` on module scripts; only add integrity.
        result = result.replace(
          /<script ([^>]*?)src="(\/[^"]+\.js)"([^>]*?)>/g,
          (match, before: string, src: string, after: string) => {
            if (match.includes("integrity=")) return match;
            const hash = integrity.get(src.replace(/^\//, ""));
            if (!hash) return match;
            return `<script ${before}src="${src}" integrity="${hash}"${after}>`;
          },
        );

        return result;
      },
    },
  };
}

// Split into separate variables to avoid TS2321 "Excessive stack depth" against
// UserConfig's deep union type. Each piece is narrow enough for tsc to check.

// Tooling-only config (staged hooks, fmt, lint) — small enough to type-check cleanly.
const toolingConfig = defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "vue"],
    categories: {
      correctness: "warn",
    },
    env: {
      builtin: true,
    },
    ignorePatterns: ["dist", ".yarn", ".github/**"],

    rules: lintRules,
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts", "**/*.vue"],
        rules: {
          "constructor-super": "off",
          "getter-return": "off",
          "no-class-assign": "off",
          "no-const-assign": "off",
          "no-dupe-class-members": "off",
          "no-dupe-keys": "off",
          "no-func-assign": "off",
          "no-import-assign": "off",
          "no-new-native-nonconstructor": "off",
          "no-obj-calls": "off",
          "no-redeclare": "off",
          "no-setter-return": "off",
          "no-this-before-super": "off",
          "no-undef": "off",
          "no-unreachable": "off",
          "no-unsafe-negation": "off",
          "no-var": "error",
          "no-with": "off",
          "prefer-const": "error",
          "prefer-rest-params": "error",
          "prefer-spread": "error",
        },
      },
      {
        files: ["**/*.{ts,vue}"],
        env: {
          es2020: true,
          browser: true,
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});

// Plugins extracted and cast so TypeScript doesn't recurse into PluginOption's
// deep union type when checking the outer config object (part of the TS2321 fix).
const vitePlugins: PluginOption[] = [
  vue(),
  tailwindcss(),
  productionCSP(),
  ...(process.env["NODE_ENV"] === "production" ? [] : [vueDevTools()]),
  VitePWA({
    registerType: "autoUpdate",
    includeAssets: [
      "favicon.ico",
      "apple-touch-icon.png",
      "robots.txt",
      "lars_memoji.webp",
      "icons/*.svg",
    ],
    manifest: {
      name: "Lars M. | System Engineer",
      short_name: "Lars M.",
      description: "System Engineer Portfolio",
      theme_color: "#0d1117",
      icons: [
        {
          src: "apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any",
        },
        // TODO: Generate 192x192 and 512x512 PNG icons for full PWA install support
        // Run: vp dlx pwa-asset-generator favicon.webp public/icons --icon-only
        // Then add: { src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" }
        //       and: { src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
      ],
    },
  }),
];

export default mergeConfig(
  toolingConfig,
  defineConfig({
    server: {
      headers: DEV_SECURITY_HEADERS,
    },
    preview: {
      headers: PROD_SECURITY_HEADERS,
    },
    base: "/",
    plugins: vitePlugins,
    test: {
      environment: "jsdom",
      globals: true,
    },
  }),
);
