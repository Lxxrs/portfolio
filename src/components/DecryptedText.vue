<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useScramble } from '../composables/useScramble';

const props = defineProps<{ 
  text: string;
  speed?: number;
  delay?: number;
}>();

const { displayText, triggerAnimation } = useScramble(props.text, props.speed, false);
const isVisible = ref(props.delay ? false : true);

onMounted(() => {
  if (props.delay) {
    setTimeout(() => {
      isVisible.value = true;
      triggerAnimation();
    }, props.delay);
  } else {
    triggerAnimation();
  }
});
</script>

<template>
  <span 
    class="font-mono cursor-default motion-safe:hover:text-accent transition-colors" 
    :class="{ 'opacity-0': !isVisible }"
    :aria-label="text"
    @mouseenter="triggerAnimation"
  >
    <span aria-hidden="true">{{ displayText }}</span>
  </span>
</template>
