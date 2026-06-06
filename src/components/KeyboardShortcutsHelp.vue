<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";
import { X } from "@lucide/vue";
import { useFocusTrap } from "../composables/useFocusTrap";
import { isShortcutsHelpOpen } from "../composables/useShortcutsHelp";

const isOpen = isShortcutsHelpOpen;
const modalRef = ref<HTMLElement | null>(null);
const { trapFocus, releaseFocus } = useFocusTrap(modalRef, isOpen);

watch(isOpen, (val) => {
  if (val) nextTick(() => trapFocus());
  else releaseFocus();
});

const shortcuts = [
  { key: "Ctrl/Cmd + K", description: "Open command palette" },
  { key: "H", description: "Go to Home section" },
  { key: "A", description: "Go to About section" },
  { key: "P", description: "Go to Projects section" },
  { key: "C", description: "Go to Contact section" },
  { key: "T", description: "Toggle theme (dark/light)" },
  { key: "?", description: "Show this help dialog" },
  { key: "Esc", description: "Close dialogs" },
];

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  // Don't trigger if user is typing
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (e.key === "?" && !isOpen.value) {
    e.preventDefault();
    open();
  } else if (e.key === "Escape" && isOpen.value) {
    close();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <!-- Modal Backdrop -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-canvas/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
      @click.self="close"
    >
      <!-- Modal Content -->
      <Transition
        enter-active-class="transition-all duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          ref="modalRef"
          class="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto"
        >
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-border">
            <h2 id="shortcuts-title" class="text-xl font-bold text-primary flex items-center gap-2">
              <span class="text-accent">$</span> Keyboard Shortcuts
            </h2>
            <button
              type="button"
              class="p-2 rounded-md hover:bg-border transition-colors text-secondary hover:text-primary"
              aria-label="Close shortcuts dialog"
              @click="close"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Shortcuts List -->
          <div class="p-6 space-y-3">
            <div
              v-for="shortcut in shortcuts"
              :key="shortcut.key"
              class="flex items-center justify-between gap-4 py-2 text-sm"
            >
              <span class="text-secondary">{{ shortcut.description }}</span>
              <kbd
                class="px-3 py-1 bg-canvas border border-border rounded text-xs font-mono text-primary font-medium"
              >
                {{ shortcut.key }}
              </kbd>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 pt-0 text-xs text-secondary text-center border-t border-border">
            <p>
              Press
              <kbd class="px-2 py-1 bg-canvas border border-border rounded font-mono">?</kbd>
              anytime to view shortcuts
            </p>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>
