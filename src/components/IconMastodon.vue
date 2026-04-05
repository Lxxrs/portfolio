<script setup lang="ts">
import mastodonLight from "../assets/mastodon-light-mode.svg?url";
import mastodonDark from "../assets/mastodon-dark-mode.svg?url";

defineProps<{
  size?: number | string;
}>();
</script>

<template>
  <img
    class="block dark:hidden"
    :src="mastodonLight"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
  <img
    class="hidden dark:block"
    :src="mastodonDark"
    :width="size || 24"
    :height="size || 24"
    alt=""
  />
</template>
