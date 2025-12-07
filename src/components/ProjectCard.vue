<script setup lang="ts">
import { Lock } from 'lucide-vue-next';
import CodebergIcon from './CodebergIcon.vue';

defineProps<{
  title: string;
  desc: string;
  stack: string[];
  repoUrl?: string;
  isPrivate?: boolean;
}>();
</script>

<template>
  <div
    class="group border border-border bg-card hover:border-accent focus-within:border-accent p-6 rounded-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20 flex flex-col h-full">
    <div class="flex justify-between items-start mb-4">
      <div class="text-primary font-bold text-lg group-hover:text-accent transition-colors">
        {{ title }}
      </div>
      <div class="text-secondary">
        <div v-if="isPrivate" class="flex items-center gap-2 text-xs border border-border px-2 py-1 rounded">
          <Lock :size="14" /> <span>Private</span>
        </div>
        <a v-else :href="repoUrl" target="_blank" class="hover:text-accent transition-colors" :aria-label="`View source code for ${title}`">
          <CodebergIcon :size="20" />
        </a>
      </div>
    </div>
    <p class="text-secondary mb-6 text-sm leading-relaxed grow">
      {{ desc }}
    </p>
    <div class="flex flex-wrap gap-2 mt-auto">
      <span v-for="tech in stack" :key="tech" class="text-xs font-medium text-accent bg-accent-dim px-2 py-1 rounded">
        {{ tech }}
      </span>
    </div>
  </div>
</template>
