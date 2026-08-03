/* ════════════════════════════════════════════════════════════════════
   ui.ts — the ONLY client JavaScript on the site.
   Bundled by Astro, auto-hashed by security.csp. Everything degrades:
   without JS the page is fully readable (name visible, tree expanded,
   first case open, dark theme).
   Sections: theme · scroll reveals + spy · decrypt · spotlight · eggs

   Everything lives in `initUI(doc)` — one entry point, deliberately not
   split into per-effect modules. The bugs here are in how the effects
   touch a real document, so the document is the seam: the browser passes
   the real one, the test suite passes a parsed one.
   ════════════════════════════════════════════════════════════════════ */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#$%&@";

/** Gap between one list row's reveal and the next. */
const STAGGER_STEP_MS = 55;

/** Resolve a string one character at a time out of random glyphs. */
function scramble(
  el: HTMLElement,
  raf: (cb: () => void) => void,
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
    if (tickCount % slow !== 0) return raf(tick);
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
    if (!allDone) raf(tick);
    else done?.();
  };
  raf(tick);
}

/**
 * @param doc
 */
export function initUI(doc: Document = document): void {
  const win = doc.defaultView ?? window;
  const root = doc.documentElement;

  root.classList.add("js");

  const reduced = win.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const raf = (cb: () => void) =>
    win.requestAnimationFrame ? win.requestAnimationFrame(cb) : cb();

  /* ── 1. Theme toggle (dark default; .light opt-in, persisted) ── */
  doc.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const light = root.classList.toggle("light");
    root.classList.toggle("dark", !light);
    try {
      win.localStorage.setItem("theme", light ? "light" : "dark");
    } catch {}
  });

  /* ── 2. Scroll: section-rule draw, tree type-in, nav spy ── */
  const navLinks = new Map(
    [...doc.querySelectorAll<HTMLAnchorElement>("nav a[href^='#']")].map(
      (a) => [a.hash.slice(1), a],
    ),
  );

  const stagger = (el: Element) => {
    if (reduced) return;
    [...el.children].forEach((row, i) => {
      if (row instanceof win.HTMLElement)
        row.style.animationDelay = `${i * STAGGER_STEP_MS}ms`;
    });
  };

  if (win.IntersectionObserver) {
    const reveal = new win.IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (e.target.classList.contains("tree")) stagger(e.target);
          e.target.classList.add("is-visible");
          reveal.unobserve(e.target);
        }
      },
      { threshold: 0.35 },
    );
    doc
      .querySelectorAll(".manifest, .tree")
      .forEach((el) => reveal.observe(el));

    const spy = new win.IntersectionObserver(
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
      const el = doc.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ── 3. Decrypt engine — boot-in + re-decrypt on hover ── */
  const nameEl = doc.getElementById("decrypt-name");
  let running = false;

  if (nameEl instanceof win.HTMLElement) {
    if (reduced) {
      nameEl.classList.add("glitch-on");
    } else {
      nameEl.textContent = "";
      running = true;
      setTimeout(() => {
        scramble(nameEl, raf, 5, 4, 3, () => {
          nameEl.classList.add("glitch-on");
          running = false;
        });
      }, 1100);
    }
    nameEl.addEventListener("mouseenter", () => {
      if (reduced || running) return;
      running = true;
      scramble(nameEl, raf, 5, 4, 3, () => (running = false));
    });
  }

  /* ── 4. Cursor spotlight ── */
  {
    let queued = false;
    win.addEventListener(
      "pointermove",
      (e) => {
        if (queued) return;
        queued = true;
        raf(() => {
          root.style.setProperty("--mx", `${e.clientX}px`);
          root.style.setProperty("--my", `${e.clientY}px`);
          queued = false;
        });
      },
      { passive: true },
    );
  }

  /* ── 5. Easter eggs ── */
  const egg = doc.getElementById("egg-mask");
  let eggTimer: ReturnType<typeof setTimeout> | undefined;

  function showEgg() {
    if (!egg) return;
    egg.classList.add("is-on");
    clearTimeout(eggTimer);
    eggTimer = setTimeout(() => egg.classList.remove("is-on"), 4000);
  }

  if (egg) {
    let buf = "";
    doc.addEventListener("keydown", (e) => {
      if (e.key === "Escape") return egg.classList.remove("is-on");
      if (e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-8);
      if (buf === "fsociety") showEgg();
    });
    const para = doc.getElementById("egg-para");
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
    const original = doc.title;
    doc.addEventListener("visibilitychange", () => {
      doc.title = doc.hidden ? "[ session idle ] — reconnect?" : original;
    });
  }
}
