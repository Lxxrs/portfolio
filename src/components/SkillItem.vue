<script setup lang="ts">
// We use slots for icons in Vue to keep it flexible,
// or pass the component, but slots are cleaner here.
defineProps<{ label: string }>();
</script>

<template>
  <div class="flex items-center gap-3 text-primary hover:text-accent transition-colors">
    <slot />
    <span>{{ label }}</span>
  </div>
</template>
