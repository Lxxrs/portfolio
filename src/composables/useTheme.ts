import { ref, watch, onMounted, onUnmounted } from 'vue';

const STORAGE_KEY = 'theme-preference';

// Safely access localStorage
const getStoredTheme = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

const setStoredTheme = (theme: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage not available (SSR, private mode, etc.)
  }
};

// Initialize from localStorage or system preference
const getInitialTheme = (): boolean => {
  const stored = getStoredTheme();
  if (stored !== null) {
    return stored === 'dark';
  }
  // Fallback to system preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return true; // Default to dark
};

const isDark = ref(getInitialTheme());

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  const applyTheme = (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  let mediaQuery: MediaQueryList | null = null;
  let handleChange: ((e: MediaQueryListEvent) => void) | null = null;

  onMounted(() => {
    applyTheme(isDark.value);

    // Listen for system preference changes
    if (typeof window !== 'undefined' && window.matchMedia) {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      handleChange = (e: MediaQueryListEvent) => {
        // Only auto-update if user hasn't set a preference
        if (getStoredTheme() === null) {
          isDark.value = e.matches;
        }
      };
      mediaQuery.addEventListener('change', handleChange);
    }
  });

  onUnmounted(() => {
    if (mediaQuery && handleChange) {
      mediaQuery.removeEventListener('change', handleChange);
    }
  });

  watch(isDark, (val) => {
    applyTheme(val);
    setStoredTheme(val ? 'dark' : 'light');
  });

  return { isDark, toggleTheme };
}
