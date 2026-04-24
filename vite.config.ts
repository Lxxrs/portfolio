/// <reference types="vite-plus/test" />
import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite-plus";
import { createHtmlPlugin } from "vite-plugin-html";
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
  "default-src": ["'self'"],
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
const PROD_SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": serializeCSP(PROD_CSP),
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
 *  1. Injects a strict CSP <meta> tag right after <meta charset>.
 *     frame-ancestors is excluded (HTTP-header–only per CSP Level 2);
 *     it is enforced via the emitted _headers file instead.
 *  2. Emits `dist/_headers` — Netlify / Cloudflare Pages / Codeberg Pages format.
 *  3. Emits `dist/_apache-security-headers.conf` — Apache mod_headers snippet
 *     ready to paste into an .htaccess file (Hetzner / konsoleH).
 */
function productionCSP(): Plugin {
  return {
    name: "production-csp",
    apply: "build",
    transformIndexHtml(html) {
      const metaTag = `<meta http-equiv="Content-Security-Policy" content="${serializeMetaCSP(PROD_CSP)}" />`;
      // Place directly after <meta charset> — MDN recommends CSP meta appears
      // as the first <meta> element in <head>.
      return html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    ${metaTag}`);
    },
    generateBundle() {
      // _headers — Netlify / Cloudflare Pages / Codeberg Pages
      const netlifyLines = [
        "# HTTP security headers — auto-generated by productionCSP() in vite.config.ts",
        "# Format: Netlify / Cloudflare Pages / Codeberg Pages",
        "/*",
        ...Object.entries(PROD_SECURITY_HEADERS).map(([k, v]) => `  ${k}: ${v}`),
        "",
      ];
      this.emitFile({ type: "asset", fileName: "_headers", source: netlifyLines.join("\n") });

      // _apache-security-headers.conf — paste into .htaccess on Apache / konsoleH
      const apacheLines = [
        "# HTTP security headers — auto-generated by productionCSP() in vite.config.ts",
        "# Paste the <IfModule> block into your .htaccess file (requires mod_headers).",
        "<IfModule mod_headers.c>",
        ...Object.entries(PROD_SECURITY_HEADERS).map(([k, v]) => `  Header always set ${k} "${v}"`),
        "</IfModule>",
        "",
      ];
      this.emitFile({
        type: "asset",
        fileName: "_apache-security-headers.conf",
        source: apacheLines.join("\n"),
      });
    },
  };
}

export default defineConfig({
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
  server: {
    headers: DEV_SECURITY_HEADERS,
  },
  preview: {
    headers: PROD_SECURITY_HEADERS,
  },
  base: "/",
  plugins: [
    vue(),
    tailwindcss() as unknown as Plugin,
    productionCSP(),
    vueDevTools() as unknown as Plugin,
    createHtmlPlugin({}) as unknown as Plugin,
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.webp", "robots.txt", "lars_memoji.webp", "icons/*.svg"],
      manifest: {
        name: "Lars M. | System Engineer",
        short_name: "Lars M.",
        description: "System Engineer Portfolio",
        theme_color: "#0d1117",
        icons: [
          {
            src: "favicon.ico",
            sizes: "192x192",
            type: "image/webp",
            purpose: "any",
          },
          {
            src: "favicon.ico",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any",
          },
          // TODO: Add PNG icons for broader PWA install support
          // Safari and some browsers require PNG for install prompts
          // Generate with: npx pwa-asset-generator favicon.webp public/icons --icon-only
        ],
      },
    }) as unknown as Plugin,
  ],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
