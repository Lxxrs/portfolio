<script setup lang="ts">
import { Terminal, Sun, Moon } from 'lucide-vue-next';
import { useTheme } from '../composables/useTheme';

defineProps<{
  activeSection?: string;
}>();

const { isDark, toggleTheme } = useTheme();
</script>

<template>
  <nav
    class="fixed w-full z-50 backdrop-blur-md bg-canvas/80 border-b border-border px-6 py-4 flex justify-between items-center print:hidden"
  >
    <div class="flex items-center gap-2 font-bold text-primary">
      <Terminal
        :size="20"
        class="text-accent"
      />
      <span class="text-sm">
        sysadmin<span class="text-accent">@local</span>:~/portfolio<span
          v-if="activeSection && activeSection !== 'home'"
          class="text-secondary"
        >/{{ activeSection }}</span>
      </span>
    </div>

    <button
      class="p-2 rounded-full hover:bg-border transition-colors text-secondary cursor-pointer"
      aria-label="Toggle Theme"
      @click="toggleTheme"
    >
      <Sun
        v-if="!isDark"
        :size="20"
      />
      <Moon
        v-else
        :size="20"
      />
    </button>
  </nav>
</template>
