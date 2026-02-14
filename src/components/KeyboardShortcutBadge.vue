<script setup lang="ts">
import { computed } from 'vue';

defineProps<{
  keys: string | string[];
  description?: string;
}>();

const isMac = computed(() => 
  typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC')
);

const formatKey = (key: string): string => {
  if (isMac.value && key === 'Ctrl') return '⌘';
  if (isMac.value && key === 'Alt') return '⌥';
  if (isMac.value && key === 'Shift') return '⇧';
  return key;
};
</script>

<template>
  <div class="inline-flex items-center gap-1">
    <kbd
      v-for="(key, index) in Array.isArray(keys) ? keys : [keys]"
      :key="index"
      class="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-mono font-semibold text-primary bg-canvas border border-border rounded shadow-sm"
      :aria-label="description || `Press ${key}`"
    >
      {{ formatKey(key) }}
    </kbd>
  </div>
</template>
