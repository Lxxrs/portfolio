import { onMounted, onUnmounted, Ref } from 'vue';

/**
 * Focus trap composable for modal dialogs
 * Implements WCAG 2.1 keyboard navigation best practices
 * Reference: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
 * 
 * @param containerRef - Reference to the modal container element
 * @param isActive - Ref indicating if the trap should be active
 */
export function useFocusTrap(containerRef: Ref<HTMLElement | null>, isActive: Ref<boolean>) {
  let previousActiveElement: HTMLElement | null = null;

  const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  const getFocusableElements = (): HTMLElement[] => {
    if (!containerRef.value) return [];
    return Array.from(containerRef.value.querySelectorAll(FOCUSABLE_SELECTORS));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive.value || !containerRef.value) return;

    // Only trap Tab key
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Shift + Tab on first element -> focus last element
    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab on last element -> focus first element
    if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
      return;
    }
  };

  const trapFocus = () => {
    if (!containerRef.value) return;

    // Store the currently focused element
    previousActiveElement = document.activeElement as HTMLElement;

    // Focus the first focusable element in the container
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };

  const releaseFocus = () => {
    // Restore focus to the previously focused element
    if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
      previousActiveElement.focus();
      previousActiveElement = null;
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return {
    trapFocus,
    releaseFocus,
  };
}
