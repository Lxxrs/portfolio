<script setup lang="ts">
import DecryptedText from './DecryptedText.vue';

defineProps<{
  title: string;
  num: string;
}>();
</script>

<template>
  <div class="flex items-center gap-4 mb-8">
    <span class="text-accent font-bold text-sm">0{{ num }}.</span>
    <h2 class="text-2xl font-bold text-primary flex items-center gap-2">
      <DecryptedText :text="title" />
      <span class="h-px bg-border w-32 ml-4"></span>
    </h2>
  </div>
</template>
