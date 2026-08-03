/* ════════════════════════════════════════════════════════════════════
   theme-boot.ts — the FOUC guard, and the hash that lets it run.

   This module owns both halves of one invariant: the exact bytes of the
   inline theme-init script, and the CSP hash of those same bytes. The
   hash is derived here, so it cannot drift from the source. Editing the
   script below needs no other change anywhere — no openssl, no config.

   BaseLayout.astro renders `themeBootSource` and registers
   `themeBootHash` via Astro.csp.insertScriptHash().
   ════════════════════════════════════════════════════════════════════ */

import { createHash } from "node:crypto";

/**
 * Order of precedence, resolved before first paint:
 *   1. an explicit choice the visitor made (localStorage)
 *   2. the operating system's preference
 *   3. dark — the site's default identity
 *
 * Kept on one line so `compressHTML` cannot alter the bytes the hash covers.
 */
export const themeBootSource =
  '(function(){var t=null;try{t=localStorage.getItem("theme")}catch(e){}var light=t?t==="light":matchMedia("(prefers-color-scheme: light)").matches;var c=document.documentElement.classList;c.toggle("light",light);c.toggle("dark",!light)})();';

export const themeBootHash = `sha256-${createHash("sha256")
  .update(themeBootSource)
  .digest("base64")}` as const;
