<script setup lang="ts">
import { useScramble } from '../composables/useScramble';
const props = defineProps<{ text: string }>();
const { displayText, triggerAnimation } = useScramble(props.text);
</script>

<template>
  <span class="font-mono cursor-default hover:text-accent transition-colors" @mouseenter="triggerAnimation">
    {{ displayText }}
  </span>
</template>
