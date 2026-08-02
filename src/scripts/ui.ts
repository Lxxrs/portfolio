/* ════════════════════════════════════════════════════════════════════
   ui.ts — the ONLY client JavaScript on the site.
   Bundled by Astro, auto-hashed by security.csp. Everything degrades:
   without JS the page is fully readable (name visible, tree expanded,
   first case open, dark theme).
   Sections: theme · scroll reveals + spy · decrypt · spotlight · eggs
   ════════════════════════════════════════════════════════════════════ */

document.documentElement.classList.add("js");

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── 1. Theme toggle (dark default; .light opt-in, persisted) ── */
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const root = document.documentElement;
  const light = root.classList.toggle("light");
  root.classList.toggle("dark", !light);
  try {
    localStorage.setItem("theme", light ? "light" : "dark");
  } catch {
    /* private mode — theme just won't persist */
  }
});

/* ── 2. Scroll: section-rule draw, tree type-in, nav spy ── */
const navLinks = new Map(
  [...document.querySelectorAll<HTMLAnchorElement>("nav a[href^='#']")].map(
    (a) => [a.hash.slice(1), a],
  ),
);
const reveal = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add("is-visible");
      reveal.unobserve(e.target);
    }
  },
  { threshold: 0.35 },
);
document
  .querySelectorAll(".manifest, .tree")
  .forEach((el) => reveal.observe(el));

const spy = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      navLinks.forEach((a) => a.removeAttribute("aria-current"));
      navLinks.get(e.target.id)?.setAttribute("aria-current", "true");
    }
  },
  { rootMargin: "-40% 0px -55% 0px" },
);
["home", "about", "skills", "projects", "contact"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) spy.observe(el);
});

/* ── 3. Decrypt engine — boot-in + re-decrypt on hover ── */
const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@";
const nameEl = document.getElementById("decrypt-name");
let running = false;

function scramble(
  el: HTMLElement,
  base: number,
  perChar: number,
  slow: number,
  done?: () => void,
) {
  const target = el.dataset.text ?? el.textContent ?? "";
  const resolveAt = [...target].map(
    (_, i) => base + i * perChar + Math.floor(Math.random() * 4),
  );
  let frame = 0;
  let tickCount = 0;
  const tick = () => {
    tickCount++;
    if (tickCount % slow !== 0) return requestAnimationFrame(tick);
    let out = "";
    let allDone = true;
    for (let i = 0; i < target.length; i++) {
      if (target[i] === " ") {
        out += " ";
        continue;
      }
      if (frame >= (resolveAt[i] ?? 0)) out += target[i];
      else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        allDone = false;
      }
    }
    el.textContent = out;
    frame++;
    if (!allDone) requestAnimationFrame(tick);
    else done?.();
  };
  requestAnimationFrame(tick);
}

if (nameEl instanceof HTMLElement) {
  if (reduced) {
    nameEl.classList.add("glitch-on");
  } else {
    nameEl.textContent = ""; // never show the name before it decrypts
    running = true;
    setTimeout(() => {
      scramble(nameEl, 5, 4, 3, () => {
        nameEl.classList.add("glitch-on");
        running = false;
      });
    }, 1100);
  }
  nameEl.addEventListener("mouseenter", () => {
    if (reduced || running) return;
    running = true;
    scramble(nameEl, 5, 4, 3, () => (running = false));
  });
}

/* ── 4. Cursor spotlight ── */
{
  const root = document.documentElement;
  let queued = false;
  window.addEventListener(
    "pointermove",
    (e) => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        root.style.setProperty("--mx", `${e.clientX}px`);
        root.style.setProperty("--my", `${e.clientY}px`);
        queued = false;
      });
    },
    { passive: true },
  );
}

/* ── 5. Easter eggs ── */
const egg = document.getElementById("egg-mask");
let eggTimer: ReturnType<typeof setTimeout> | undefined;

function showEgg() {
  if (!egg) return;
  egg.classList.add("is-on");
  clearTimeout(eggTimer);
  eggTimer = setTimeout(() => egg.classList.remove("is-on"), 4000);
}

if (egg) {
  // trigger 1: type "fsociety" anywhere (last 8 keys only, nothing stored or sent)
  let buf = "";
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return egg.classList.remove("is-on");
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-8);
    if (buf === "fsociety") showEgg();
  });
  // trigger 2: triple-click the footer ¶ within 2s
  const para = document.getElementById("egg-para");
  let clicks = 0;
  let clickTimer: ReturnType<typeof setTimeout> | undefined;
  para?.addEventListener("click", () => {
    clicks++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => (clicks = 0), 2000);
    if (clicks >= 3) {
      clicks = 0;
      showEgg();
    }
  });
  egg.addEventListener("click", () => egg.classList.remove("is-on"));
}

// console greeting for the curious
console.log(
  "%c\n  hello, friend.\n",
  "color:#7aa2f7;font-size:16px;font-family:monospace;",
);
console.log(
  "%c  you opened the console. respect.\n  source: https://codeberg.org/Lxrs/portfolio\n  no trackers to find in here.\n",
  "color:#7a8aa5;font-family:monospace;",
);

// idle tab title
{
  const original = document.title;
  document.addEventListener("visibilitychange", () => {
    document.title = document.hidden
      ? "[ session idle ] — reconnect?"
      : original;
  });
}
