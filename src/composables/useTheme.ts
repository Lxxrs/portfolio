import { ref, watch } from "vue";

const STORAGE_KEY = "theme-preference";

function storedTheme(): boolean | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "dark") return true;
    if (v === "light") return false;
  } catch {
    // localStorage unavailable (private mode, security restrictions)
  }
  return null;
}

// Singleton reactive state — shared across all useTheme() calls
const mq = window.matchMedia("(prefers-color-scheme: dark)");
const isDark = ref(storedTheme() ?? mq.matches);

// Apply class immediately so there is no flash before Vue mounts
document.documentElement.classList.toggle("dark", isDark.value);
document.documentElement.classList.toggle("light", !isDark.value);

// Sync DOM on any isDark change — localStorage is NOT written here so that
// system mq changes never accidentally persist a stale stored preference.
watch(isDark, (dark) => {
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.classList.toggle("light", !dark);
});

// Follow system preference when the user has not manually overridden it.
// Does NOT write to localStorage — only explicit toggles should do that.
mq.addEventListener("change", (e) => {
  if (storedTheme() === null) isDark.value = e.matches;
});

export function useTheme() {
  return {
    isDark,
    toggleTheme: () => {
      isDark.value = !isDark.value;
      // Persist only on explicit user action, never on system mq changes.
      try {
        localStorage.setItem(STORAGE_KEY, isDark.value ? "dark" : "light");
      } catch {
        // localStorage unavailable (private mode, security restrictions)
      }
    },
  };
}
