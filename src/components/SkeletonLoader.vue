<script setup lang="ts">
defineProps<{
  width?: string;
  height?: string;
  rounded?: boolean;
  circle?: boolean;
}>();
</script>

<template>
  <div
    class="animate-pulse bg-border/30"
    :class="{
      'rounded-full': circle,
      'rounded-md': rounded && !circle,
    }"
    :style="{
      width: width || '100%',
      height: height || '1rem',
    }"
    role="status"
    aria-label="Loading..."
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
