import { ref, watch, onMounted } from 'vue';

const isDark = ref(true);

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  onMounted(() => {
    // Check system preference or local storage if needed in future
    // For now, default to dark as per original code
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }
  });

  watch(isDark, (val) => {
    if (val) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return { isDark, toggleTheme };
}
