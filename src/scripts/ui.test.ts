// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { initUI } from "./ui.ts";

const PAGE = `
  <nav>
    <a href="#about">about</a>
    <a href="#skills">skills</a>
    <button data-theme-toggle>theme</button>
  </nav>
  <main>
    <section id="about"></section>
    <section id="skills">
      <header class="manifest"></header>
      <ul class="tree"><li>a</li><li>b</li><li>c</li></ul>
    </section>
    <h1><span id="decrypt-name" data-text="Lars M.">Lars M.</span></h1>
  </main>
  <button id="egg-para">¶</button>
  <div id="egg-mask"></div>
`;

let observed: { el: Element; fire: () => void }[] = [];

function fakeStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
    clear: () => store.clear(),
    key: () => null,
    length: 0,
  };
}

function setup({ reducedMotion = false } = {}) {
  document.body.innerHTML = PAGE;
  document.documentElement.className = "";
  observed = [];

  Object.defineProperty(window, "localStorage", {
    configurable: true,
    writable: true,
    value: fakeStorage(),
  });

  window.matchMedia = vi.fn(() => ({ matches: reducedMotion })) as never;

  class FakeObserver {
    constructor(
      private cb: (e: { isIntersecting: boolean; target: Element }[]) => void,
    ) {}
    observe(el: Element) {
      observed.push({
        el,
        fire: () => this.cb([{ isIntersecting: true, target: el }]),
      });
    }
    unobserve() {}
    disconnect() {}
  }
  // @ts-expect-error — test double
  window.IntersectionObserver = FakeObserver;
  window.requestAnimationFrame = ((cb: () => void) => {
    cb();
    return 0;
  }) as typeof window.requestAnimationFrame;

  vi.spyOn(console, "log").mockImplementation(() => {});
  return document;
}

const fire = (selector: string) =>
  observed.find((o) => o.el.matches(selector))?.fire();

beforeEach(() => {
  vi.useFakeTimers();
  vi.unstubAllGlobals();
});

describe("initUI", () => {
  it("marks the document as JS-enabled", () => {
    const doc = setup();
    expect(doc.documentElement.classList.contains("js")).toBe(false);
    initUI(doc);
    expect(doc.documentElement.classList.contains("js")).toBe(true);
  });

  it("does nothing until it is called", () => {
    const doc = setup();
    expect(doc.documentElement.className).toBe("");
  });
});

describe("theme toggle", () => {
  it("switches to light and persists the choice", () => {
    const doc = setup();
    initUI(doc);
    doc.querySelector<HTMLButtonElement>("[data-theme-toggle]")!.click();

    expect(doc.documentElement.classList.contains("light")).toBe(true);
    expect(doc.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem("theme")).toBe("light");
  });

  it("switches back to dark on a second click", () => {
    const doc = setup();
    initUI(doc);
    const btn = doc.querySelector<HTMLButtonElement>("[data-theme-toggle]")!;
    btn.click();
    btn.click();

    expect(doc.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem("theme")).toBe("dark");
  });

  it("survives localStorage throwing in private mode", () => {
    const doc = setup();
    initUI(doc);
    vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
      throw new Error("private mode");
    });

    expect(() =>
      doc.querySelector<HTMLButtonElement>("[data-theme-toggle]")!.click(),
    ).not.toThrow();
    expect(doc.documentElement.classList.contains("light")).toBe(true);
  });
});

describe("scroll reveal", () => {
  it("reveals a section header once it intersects", () => {
    const doc = setup();
    initUI(doc);
    const manifest = doc.querySelector(".manifest")!;

    expect(manifest.classList.contains("is-visible")).toBe(false);
    fire(".manifest");
    expect(manifest.classList.contains("is-visible")).toBe(true);
  });

  it("staggers every skills-tree row, however many there are", () => {
    const doc = setup();
    initUI(doc);
    fire(".tree");

    const delays = [...doc.querySelectorAll<HTMLElement>(".tree li")].map(
      (li) => li.style.animationDelay,
    );
    expect(delays).toEqual(["0ms", "55ms", "110ms"]);
  });

  it("skips the stagger under prefers-reduced-motion", () => {
    const doc = setup({ reducedMotion: true });
    initUI(doc);
    fire(".tree");

    const delays = [...doc.querySelectorAll<HTMLElement>(".tree li")].map(
      (li) => li.style.animationDelay,
    );
    expect(delays).toEqual(["", "", ""]);
  });
});

describe("nav spy", () => {
  it("marks the matching nav link current and clears the others", () => {
    const doc = setup();
    initUI(doc);

    fire("#about");
    expect(
      doc.querySelector('a[href="#about"]')!.getAttribute("aria-current"),
    ).toBe("true");

    fire("#skills");
    expect(
      doc.querySelector('a[href="#about"]')!.hasAttribute("aria-current"),
    ).toBe(false);
    expect(
      doc.querySelector('a[href="#skills"]')!.getAttribute("aria-current"),
    ).toBe("true");
  });
});

describe("decrypt", () => {
  it("hides the name, then resolves it to the real text", () => {
    const doc = setup();
    initUI(doc);
    const el = doc.getElementById("decrypt-name")!;

    expect(el.textContent).toBe("");
    vi.advanceTimersByTime(1100);
    expect(el.textContent).toBe("Lars M.");
    expect(el.classList.contains("glitch-on")).toBe(true);
  });

  it("shows the name immediately under prefers-reduced-motion", () => {
    const doc = setup({ reducedMotion: true });
    initUI(doc);
    const el = doc.getElementById("decrypt-name")!;

    expect(el.textContent).toBe("Lars M.");
    expect(el.classList.contains("glitch-on")).toBe(true);
  });
});

describe("easter eggs", () => {
  it("opens the mask when fsociety is typed", () => {
    const doc = setup();
    initUI(doc);
    const egg = doc.getElementById("egg-mask")!;

    for (const key of "fsociety") {
      doc.dispatchEvent(new KeyboardEvent("keydown", { key }));
    }
    expect(egg.classList.contains("is-on")).toBe(true);
  });

  it("only matches the last 8 keys, so typing past it still triggers", () => {
    const doc = setup();
    initUI(doc);
    const egg = doc.getElementById("egg-mask")!;

    for (const key of "xyzfsociety") {
      doc.dispatchEvent(new KeyboardEvent("keydown", { key }));
    }
    expect(egg.classList.contains("is-on")).toBe(true);
  });

  it("closes on Escape", () => {
    const doc = setup();
    initUI(doc);
    const egg = doc.getElementById("egg-mask")!;

    for (const key of "fsociety") {
      doc.dispatchEvent(new KeyboardEvent("keydown", { key }));
    }
    doc.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(egg.classList.contains("is-on")).toBe(false);
  });

  it("auto-closes after 4s", () => {
    const doc = setup();
    initUI(doc);
    const egg = doc.getElementById("egg-mask")!;

    for (const key of "fsociety") {
      doc.dispatchEvent(new KeyboardEvent("keydown", { key }));
    }
    vi.advanceTimersByTime(4000);
    expect(egg.classList.contains("is-on")).toBe(false);
  });

  it("opens on a triple-click of the footer mark, but not a double", () => {
    const doc = setup();
    initUI(doc);
    const para = doc.getElementById("egg-para")!;
    const egg = doc.getElementById("egg-mask")!;

    para.dispatchEvent(new Event("click"));
    para.dispatchEvent(new Event("click"));
    expect(egg.classList.contains("is-on")).toBe(false);

    para.dispatchEvent(new Event("click"));
    expect(egg.classList.contains("is-on")).toBe(true);
  });

  it("forgets the click run after 2s", () => {
    const doc = setup();
    initUI(doc);
    const para = doc.getElementById("egg-para")!;
    const egg = doc.getElementById("egg-mask")!;

    para.dispatchEvent(new Event("click"));
    para.dispatchEvent(new Event("click"));
    vi.advanceTimersByTime(2000);
    para.dispatchEvent(new Event("click"));
    expect(egg.classList.contains("is-on")).toBe(false);
  });
});

describe("snowflake proxy", () => {
  const PAGE_WITH_SLOT = `
    <div class="tor-widget">
      <div data-snowflake data-snowflake-src="about:blank#embed">
        <button type="button" data-snowflake-start>start</button>
        <p class="tor-note">note</p>
      </div>
    </div>`;

  function setupSlot() {
    const doc = setup();
    doc.body.innerHTML = PAGE_WITH_SLOT;
    return doc;
  }

  it("makes no third-party request until the button is pressed", () => {
    const doc = setupSlot();
    initUI(doc);
    // The whole point: no iframe exists on load, so no `unload` listener and
    // nothing reaches torproject.org.
    expect(doc.querySelector("iframe")).toBeNull();
  });

  it("injects the embed on click", () => {
    const doc = setupSlot();
    initUI(doc);
    doc.querySelector<HTMLButtonElement>("[data-snowflake-start]")!.click();

    const frame = doc.querySelector("iframe")!;
    expect(frame).not.toBeNull();
    // A dummy src on purpose: ui.ts only passes the value through, and a
    // real URL here would make the suite hit torproject.org on every run.
    expect(frame.getAttribute("src")).toBe("about:blank#embed");
    expect(frame.getAttribute("title")).toBe("Tor Snowflake proxy");
    expect(frame.getAttribute("loading")).toBe("lazy");
  });

  it("replaces the button so the embed cannot be stacked", () => {
    const doc = setupSlot();
    initUI(doc);
    const btn = doc.querySelector<HTMLButtonElement>("[data-snowflake-start]")!;
    btn.click();
    expect(doc.querySelector("[data-snowflake-start]")).toBeNull();
    expect(doc.querySelectorAll("iframe").length).toBe(1);
  });

  it("does nothing on a page with no snowflake slot", () => {
    const doc = setup();
    expect(() => initUI(doc)).not.toThrow();
  });
});

describe("progressive enhancement contract", () => {
  it("enhances a page that has none of the optional hooks", () => {
    document.body.innerHTML = "<main><p>just text</p></main>";
    document.documentElement.className = "";
    setup();
    document.body.innerHTML = "<main><p>just text</p></main>";

    expect(() => initUI(document)).not.toThrow();
    expect(document.documentElement.classList.contains("js")).toBe(true);
  });
});
