<script setup lang="ts">
import codeberg from "../assets/codeberg-logo.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img :src="codeberg" :width="size || 24" :height="size || 24" alt="" />
</template>
