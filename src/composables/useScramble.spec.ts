import { describe, it, expect, beforeEach, vi, afterEach } from "vite-plus/test";
import { defineComponent, nextTick } from "vue";
import { mount } from "@vue/test-utils";

describe("useScramble", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();

    // Mock matchMedia by default (not reduced motion)
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Helper to test composable in component context
  const withSetup = async <T>(composable: () => T) => {
    let result: T | undefined;
    const TestComponent = defineComponent({
      setup() {
        result = composable();
        return () => {};
      },
    });
    const wrapper = mount(TestComponent);
    await nextTick();
    return {
      result: result as T,
      wrapper,
    };
  };

  it("should initialize with the original text", async () => {
    const { useScramble } = await import("./useScramble");
    const { result, wrapper } = await withSetup(() => useScramble("Hello", 40, false));
    expect(result.displayText.value).toBe("Hello");
    wrapper.unmount();
  });

  it("should scramble text when animation is triggered", async () => {
    const { useScramble } = await import("./useScramble");
    const { result, wrapper } = await withSetup(() => useScramble("Test", 40, false));

    result.triggerAnimation();
    await nextTick();

    // Should be scrambling
    vi.advanceTimersByTime(40);
    expect(result.displayText.value).not.toBe("Test");
    expect(result.displayText.value.length).toBe(4);
    wrapper.unmount();
  });

  it("should eventually return to original text after scrambling", async () => {
    const { useScramble } = await import("./useScramble");
    const text = "Final";
    const { result, wrapper } = await withSetup(() => useScramble(text, 40, false));

    result.triggerAnimation();
    await nextTick();

    // Advance through entire animation (text.length * 3 * speed)
    vi.advanceTimersByTime(text.length * 3 * 40 + 100);

    expect(result.displayText.value).toBe(text);
    wrapper.unmount();
  });

  it("should respect prefers-reduced-motion", async () => {
    // Mock matchMedia to return reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { useScramble } = await import("./useScramble");
    const text = "NoAnimation";
    const { result, wrapper } = await withSetup(() => useScramble(text, 40, false));

    result.triggerAnimation();
    await nextTick();

    // Should immediately show final text without animation
    expect(result.displayText.value).toBe(text);
    wrapper.unmount();
  });

  it("should preserve spaces in text", async () => {
    const { useScramble } = await import("./useScramble");
    const text = "Hello World";
    const { result, wrapper } = await withSetup(() => useScramble(text, 40, false));

    result.triggerAnimation();
    await nextTick();
    vi.advanceTimersByTime(40);

    // Check that space is at correct position
    expect(result.displayText.value[5]).toBe(" ");
    wrapper.unmount();
  });
});
