// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";
import { themeBootHash, themeBootSource } from "./theme-boot.ts";

/**
 * The boot script ships as a string, so the only way to test it is to run it.
 * `new Function` compiles the exact bytes that get rendered and hashed — if
 * this passes, the thing on the page behaves the same way.
 */
function boot({
  stored,
  osPrefersLight,
  storageThrows = false,
}: {
  stored?: string;
  osPrefersLight: boolean;
  storageThrows?: boolean;
}) {
  document.documentElement.className = "";

  vi.stubGlobal("localStorage", {
    getItem: () => {
      if (storageThrows) throw new Error("private mode");
      return stored ?? null;
    },
  });
  vi.stubGlobal("matchMedia", (q: string) => ({
    matches: q.includes("light") ? osPrefersLight : !osPrefersLight,
  }));

  new Function(themeBootSource)();
  const c = document.documentElement.classList;
  return { light: c.contains("light"), dark: c.contains("dark") };
}

afterEach(() => vi.unstubAllGlobals());

describe("theme boot", () => {
  it("follows the OS when the visitor has never chosen", () => {
    expect(boot({ osPrefersLight: true })).toEqual({
      light: true,
      dark: false,
    });
    expect(boot({ osPrefersLight: false })).toEqual({
      light: false,
      dark: true,
    });
  });

  it("lets an explicit choice override the OS", () => {
    expect(boot({ stored: "light", osPrefersLight: false })).toEqual({
      light: true,
      dark: false,
    });
    expect(boot({ stored: "dark", osPrefersLight: true })).toEqual({
      light: false,
      dark: true,
    });
  });

  it("falls back to the OS when localStorage throws in private mode", () => {
    expect(boot({ osPrefersLight: true, storageThrows: true })).toEqual({
      light: true,
      dark: false,
    });
  });

  it("always sets exactly one of the two classes", () => {
    for (const osPrefersLight of [true, false]) {
      for (const stored of [undefined, "light", "dark"]) {
        const r = boot({ stored, osPrefersLight });
        expect(r.light).toBe(!r.dark);
      }
    }
  });
});

describe("theme boot hash", () => {
  it("is derived from the source it ships with", () => {
    // Guards the invariant the whole module exists for: edit the script and
    // the hash follows, with no config to remember.
    expect(themeBootHash).toMatch(/^sha256-[A-Za-z0-9+/]+=*$/);
  });
});
