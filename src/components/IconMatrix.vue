<script setup lang="ts">
import matrix from "../assets/matrix-logo.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img :src="matrix" :width="size || 24" :height="size || 24" alt="" />
</template>
