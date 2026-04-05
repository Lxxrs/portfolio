<script setup lang="ts">
import liberapay from "../assets/liberapay-logo.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img :src="liberapay" :width="size || 32" :height="size || 32" alt="" />
</template>
