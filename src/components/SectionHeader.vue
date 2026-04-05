<script setup lang="ts">
import DecryptedText from "./DecryptedText.vue";

defineProps<{
  title: string;
  num: string;
}>();
</script>

<template>
  <div class="flex items-center gap-4 mb-8">
    <span class="text-accent font-bold text-sm shrink-0">0{{ num }}.</span>
    <h2 class="text-2xl font-bold text-primary shrink-0">
      <DecryptedText :text="title" />
    </h2>
    <span class="h-px bg-border flex-1 ml-2" />
  </div>
</template>
