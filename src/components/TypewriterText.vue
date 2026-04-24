<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  text: string;
  speed?: number;
  delay?: number;
  hideCursorOnFinish?: boolean;
}>();

const displayText = ref("");
const showCursor = ref(true);
let intervalId: number | null = null;
let timeoutId: number | null = null;

onMounted(() => {
  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    // Show text immediately without animation
    timeoutId = window.setTimeout(() => {
      displayText.value = props.text;
      if (props.hideCursorOnFinish) {
        showCursor.value = false;
      }
    }, props.delay || 0);
    return;
  }

  timeoutId = window.setTimeout(() => {
    let i = 0;
    intervalId = window.setInterval(() => {
      if (i < props.text.length) {
        displayText.value += props.text.charAt(i);
        i++;
      } else {
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
        if (props.hideCursorOnFinish) {
          showCursor.value = false;
        }
      }
    }, props.speed || 100);
    timeoutId = null;
  }, props.delay || 0);
});

onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
  if (timeoutId !== null) {
    clearTimeout(timeoutId);
  }
});
</script>

<template>
  <span class="font-mono" :aria-label="text">
    {{ displayText
    }}<span v-if="showCursor" class="motion-safe:animate-blink" aria-hidden="true">_</span>
  </span>
</template>
