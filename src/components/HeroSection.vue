<script setup lang="ts">
import DecryptedText from "./DecryptedText.vue";
import TypewriterText from "./TypewriterText.vue";
import { socialLinks } from "../data/portfolio";
</script>

<template>
  <section
    class="py-4 md:py-8 flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12"
  >
    <div
      class="group shrink-0 mb-8 md:mb-0 w-36 h-36 md:w-52 md:h-52 rounded-full border-2 border-accent shadow-lg shadow-accent/20 overflow-hidden flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:rotate-3 hover:shadow-xl hover:shadow-accent/40"
    >
      <img
        src="/lars_memoji.webp"
        alt="Portrait of Lars M."
        width="208"
        height="208"
        loading="eager"
        fetchpriority="high"
        class="w-full h-full object-cover object-center select-none cursor-default transition-transform duration-300 group-hover:scale-[1.06]"
      />
    </div>

    <div class="flex-1">
      <div class="flex items-center gap-2 text-accent mb-4 font-medium text-sm h-6">
        <TypewriterText text="init_sequence.sh" :speed="40" :hide-cursor-on-finish="true" />
      </div>

      <h1 class="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
        <DecryptedText text="Lars M." :delay="300" />
      </h1>

      <h2 class="text-3xl md:text-5xl font-bold text-accent mb-8">
        <TypewriterText text="System Engineer" :delay="800" :speed="70" />
      </h2>

      <p class="max-w-xl text-lg text-primary leading-relaxed mb-10">
        Passionate about Linux and Open Source. Dedicated to Information Security and Privacy. I
        build labs, break things and then secure them.
      </p>

      <div class="flex flex-wrap gap-4 items-center print:hidden">
        <a
          href="#projects"
          class="bg-transparent text-accent border border-accent px-6 py-3 rounded font-medium transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-canvas hover:shadow-lg hover:shadow-accent/30"
        >
          View Projects
        </a>

        <div class="flex gap-2">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="w-9 h-9 flex items-center justify-center overflow-hidden rounded-md border border-border text-primary hover:border-accent hover:text-accent hover:bg-accent/10 hover:scale-105 transition-all duration-200"
            :aria-label="link.name"
          >
            <component :is="link.icon" :size="18" />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
