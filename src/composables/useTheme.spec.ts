import { describe, it, expect, beforeEach, vi, afterEach } from "vite-plus/test";
import { nextTick } from "vue";

describe("useTheme", () => {
  let localStorageMock: Record<string, string> = {};
  let changeHandler: ((e: { matches: boolean }) => void) | null = null;

  const makeMq = (matches: boolean) => ({
    matches,
    addEventListener: vi.fn((_, h: (e: { matches: boolean }) => void) => {
      changeHandler = h;
    }),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  beforeEach(() => {
    vi.resetModules();
    changeHandler = null;
    document.documentElement.classList.remove("dark", "light");
    localStorageMock = {};
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn((k: string) => localStorageMock[k] ?? null),
        setItem: vi.fn((k: string, v: string) => {
          localStorageMock[k] = v;
        }),
        removeItem: vi.fn((k: string) => {
          delete localStorageMock[k];
        }),
        clear: vi.fn(() => {
          localStorageMock = {};
        }),
        length: 0,
        key: vi.fn(),
      },
      writable: true,
      configurable: true,
    });
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(false));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("initializes to dark when system prefers dark and nothing is stored", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(true));
    const { useTheme } = await import("./useTheme");
    const { isDark } = useTheme();
    expect(isDark.value).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("initializes to light when system prefers light and nothing is stored", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(false));
    const { useTheme } = await import("./useTheme");
    const { isDark } = useTheme();
    expect(isDark.value).toBe(false);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.classList.contains("light")).toBe(true);
  });

  it("uses stored theme over system preference", async () => {
    localStorageMock["theme-preference"] = "light";
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(true));
    const { useTheme } = await import("./useTheme");
    const { isDark } = useTheme();
    expect(isDark.value).toBe(false);
  });

  it("toggleTheme flips isDark and persists to localStorage", async () => {
    localStorageMock["theme-preference"] = "dark";
    const { useTheme } = await import("./useTheme");
    const { isDark, toggleTheme } = useTheme();

    expect(isDark.value).toBe(true);
    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(false);
    expect(localStorageMock["theme-preference"]).toBe("light");

    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(true);
    expect(localStorageMock["theme-preference"]).toBe("dark");
  });

  it("toggleTheme applies and removes the dark class on <html>", async () => {
    localStorageMock["theme-preference"] = "dark";
    const { useTheme } = await import("./useTheme");
    const { toggleTheme } = useTheme();

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
    toggleTheme();
    await nextTick();
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.classList.contains("light")).toBe(true);
    toggleTheme();
    await nextTick();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("follows system preference change when no manual override is stored", async () => {
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(false));
    const { useTheme } = await import("./useTheme");
    const { isDark } = useTheme();

    expect(isDark.value).toBe(false);
    changeHandler?.({ matches: true });
    expect(isDark.value).toBe(true);
  });

  it("ignores system preference change when a manual override is stored", async () => {
    localStorageMock["theme-preference"] = "light";
    window.matchMedia = vi.fn().mockImplementation(() => makeMq(false));
    const { useTheme } = await import("./useTheme");
    const { isDark } = useTheme();

    expect(isDark.value).toBe(false);
    changeHandler?.({ matches: true });
    expect(isDark.value).toBe(false);
  });
});
