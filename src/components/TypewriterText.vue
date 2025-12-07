<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  text: string;
  speed?: number;
  delay?: number;
  hideCursorOnFinish?: boolean;
}>();

const displayText = ref('');
const showCursor = ref(true);

onMounted(() => {
  setTimeout(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < props.text.length) {
        displayText.value += props.text.charAt(i);
        i++;
      } else {
        clearInterval(interval);
        if (props.hideCursorOnFinish) {
          showCursor.value = false;
        }
      }
    }, props.speed || 100);
  }, props.delay || 0);
});
</script>

<template>
  <span class="font-mono" :aria-label="text">
    {{ displayText }}<span v-if="showCursor" class="animate-blink" aria-hidden="true">_</span>
  </span>
</template>
