/// <reference types="vite-plus/test" />
import { defineConfig } from "vite-plus";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import type { Plugin } from "vite-plus";

// Plugin to inject strict CSP in production build
function productionCSP(): Plugin {
  return {
    name: "production-csp",
    apply: "build",
    transformIndexHtml(html) {
      // Replace dev-friendly CSP with strict production CSP
      const strictCSP =
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests;";

      // Replace CSP meta tag
      html = html.replace(
        /<meta http-equiv="Content-Security-Policy" content="[^"]+" \/>/,
        `<meta http-equiv="Content-Security-Policy" content="${strictCSP}" />`,
      );

      // Re-add strict Cross-Origin policies for production
      const crossOriginHeaders = `
    <!-- Cross-Origin Policies: Protection against speculative side-channel attacks -->
    <meta http-equiv="Cross-Origin-Opener-Policy" content="same-origin" />
    <meta http-equiv="Cross-Origin-Embedder-Policy" content="require-corp" />
    <meta http-equiv="Cross-Origin-Resource-Policy" content="same-origin" />`;

      // Insert Cross-Origin headers before the comment about production
      html = html.replace(
        /<!-- Note: Cross-Origin policies removed for development\. Add back in production deployment via server headers\. -->/,
        crossOriginHeaders,
      );

      return html;
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
    ignorePatterns: ["dist", ".yarn"],
    rules: {
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
    },
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
  base: "/portfolio/",
  plugins: [
    vue(),
    tailwindcss(),
    productionCSP(),
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
            src: "favicon.webp",
            sizes: "192x192",
            type: "image/webp",
            purpose: "any",
          },
          {
            src: "favicon.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any",
          },
          // TODO: Add PNG icons for broader PWA install support
          // Safari and some browsers require PNG for install prompts
          // Generate with: npx pwa-asset-generator favicon.webp public/icons --icon-only
        ],
      },
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
  },
});
