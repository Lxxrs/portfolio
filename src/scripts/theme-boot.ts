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

export const themeBootSource =
  '(function(){var t=null;try{t=localStorage.getItem("theme")}catch(e){}var light=t==="light";var c=document.documentElement.classList;c.toggle("light",light);c.toggle("dark",!light)})();';

export const themeBootHash = `sha256-${createHash("sha256")
  .update(themeBootSource)
  .digest("base64")}` as const;
