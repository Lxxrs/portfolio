<script setup lang="ts">
import linkedinLight from "../assets/linkedin-light-mode.svg?url";
import linkedinDark from "../assets/linkedin-dark-mode.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img
    class="block dark:hidden"
    :src="linkedinLight"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
  <img
    class="hidden dark:block"
    :src="linkedinDark"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
</template>
