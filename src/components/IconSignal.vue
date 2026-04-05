<script setup lang="ts">
import signalLight from "../assets/signal-light-mode.svg?url";
import signalDark from "../assets/signal-dark-mode.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img
    class="block dark:hidden"
    :src="signalLight"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
  <img
    class="hidden dark:block"
    :src="signalDark"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
</template>
