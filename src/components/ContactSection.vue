<script setup lang="ts">
import SectionHeader from "./SectionHeader.vue";
import { Mail } from "lucide-vue-next";
import { socialLinks } from "../data/portfolio";
</script>

<template>
  <section class="py-16">
    <SectionHeader num="3" title="Contact" />

    <div class="max-w-xl">
      <p class="text-secondary leading-relaxed mb-8">
        Interested in working together or just want to say hello? My inbox is always open.
      </p>

      <a
        href="mailto:lm@larmart.de"
        class="inline-flex items-center gap-2 bg-transparent text-accent border border-accent px-6 py-3 rounded font-medium transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-canvas hover:shadow-lg hover:shadow-accent/30 mb-8"
      >
        <Mail :size="18" />
        Get in Touch
      </a>

      <p class="text-xs text-secondary mb-3">Or reach out on</p>
      <div class="flex flex-wrap gap-2">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="w-9 h-9 flex items-center justify-center overflow-hidden rounded-md border border-border text-secondary hover:border-accent hover:text-accent hover:bg-accent/10 hover:scale-105 transition-all duration-200"
          :aria-label="link.name"
        >
          <component :is="link.icon" :size="18" />
        </a>
      </div>
    </div>
  </section>
</template>
