import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';

describe('useTheme', () => {
  const mockMatchMedia = (matches: boolean) => {
    const listeners: ((e: MediaQueryListEvent) => void)[] = [];
    return {
      matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn((_, handler) => listeners.push(handler)),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      onchange: null,
    };
  };

  let localStorageMock: Record<string, string> = {};

  beforeEach(() => {
    // Clear module cache to get fresh instance
    vi.resetModules();
    
    // Reset DOM class list
    document.documentElement.classList.remove('dark');
    
    // Mock localStorage with actual implementation
    localStorageMock = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => localStorageMock[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          localStorageMock[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete localStorageMock[key];
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
    
    // Mock matchMedia
    window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(true));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with dark mode from system preference when no stored value', async () => {
    window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(true));
    
    // Dynamic import to get fresh module
    const { useTheme } = await import('./useTheme');
    const { isDark } = useTheme();
    
    expect(isDark.value).toBe(true);
  });

  it('should initialize from localStorage when value exists', async () => {
    localStorageMock['theme-preference'] = 'light';
    window.matchMedia = vi.fn().mockImplementation(() => mockMatchMedia(false));
    
    // Dynamic import to get fresh module
    const { useTheme } = await import('./useTheme');
    const { isDark } = useTheme();
    
    expect(isDark.value).toBe(false);
  });

  it('should toggle theme and save to localStorage', async () => {
    localStorageMock['theme-preference'] = 'dark';
    
    const { useTheme } = await import('./useTheme');
    const { isDark, toggleTheme } = useTheme();
    
    // Initial state (dark)
    expect(isDark.value).toBe(true);
    
    // Toggle to light
    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(false);
    expect(localStorageMock['theme-preference']).toBe('light');
    
    // Toggle back to dark
    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(true);
    expect(localStorageMock['theme-preference']).toBe('dark');
  });

  it('should apply and remove dark class from document element', async () => {
    localStorageMock['theme-preference'] = 'dark';
    
    const { useTheme } = await import('./useTheme');
    const { isDark, toggleTheme } = useTheme();
    
    // Initial state (dark)
    expect(isDark.value).toBe(true);
    
    // Toggle to light
    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    
    // Toggle back to dark
    toggleTheme();
    await nextTick();
    expect(isDark.value).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
