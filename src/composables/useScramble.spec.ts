import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';

describe('useScramble', () => {
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

  it('should initialize with the original text', async () => {
    const { useScramble } = await import('./useScramble');
    const { displayText } = useScramble('Hello', 40, false);
    expect(displayText.value).toBe('Hello');
  });

  it('should scramble text when animation is triggered', async () => {
    const { useScramble } = await import('./useScramble');
    const { displayText, triggerAnimation } = useScramble('Test', 40, false);
    
    triggerAnimation();
    await nextTick();
    
    // Should be scrambling
    vi.advanceTimersByTime(40);
    expect(displayText.value).not.toBe('Test');
    expect(displayText.value.length).toBe(4);
  });

  it('should eventually return to original text after scrambling', async () => {
    const { useScramble } = await import('./useScramble');
    const text = 'Final';
    const { displayText, triggerAnimation } = useScramble(text, 40, false);
    
    triggerAnimation();
    await nextTick();
    
    // Advance through entire animation (text.length * 3 * speed)
    vi.advanceTimersByTime(text.length * 3 * 40 + 100);
    
    expect(displayText.value).toBe(text);
  });

  it('should respect prefers-reduced-motion', async () => {
    // Mock matchMedia to return reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { useScramble } = await import('./useScramble');
    const text = 'NoAnimation';
    const { displayText, triggerAnimation } = useScramble(text, 40, false);
    
    triggerAnimation();
    await nextTick();
    
    // Should immediately show final text without animation
    expect(displayText.value).toBe(text);
  });

  it('should preserve spaces in text', async () => {
    const { useScramble } = await import('./useScramble');
    const text = 'Hello World';
    const { displayText, triggerAnimation } = useScramble(text, 40, false);
    
    triggerAnimation();
    await nextTick();
    vi.advanceTimersByTime(40);
    
    // Check that space is at correct position
    expect(displayText.value[5]).toBe(' ');
  });
});
