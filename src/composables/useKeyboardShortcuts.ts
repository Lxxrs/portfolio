import { onMounted, onUnmounted } from 'vue';
import { useTheme } from './useTheme';

export function useKeyboardShortcuts() {
  const { toggleTheme } = useTheme();

  const handleKeydown = (e: KeyboardEvent) => {
    // Ignore if user is typing in an input or textarea
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'h':
        document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'a':
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'p':
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 't':
        toggleTheme();
        break;
    }
  };

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
  });
}
