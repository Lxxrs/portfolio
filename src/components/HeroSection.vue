<script setup lang="ts">
import DecryptedText from './DecryptedText.vue';
import TypewriterText from './TypewriterText.vue';
import { socialLinks } from '../data/portfolio';
</script>

<template>
  <section class="min-h-[60vh] flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12">
    <div class="shrink-0 mb-8 md:mb-0">
      <img 
        src="/lars_memoji.webp" 
        alt="Portrait of Lars M." 
        width="192"
        height="192"
        class="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-accent shadow-lg shadow-accent/20 transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:rotate-3 hover:shadow-accent/50" 
      >
    </div>

    <div class="flex-1">
      <div class="flex items-center gap-2 text-accent mb-4 font-medium text-sm h-6">
        <TypewriterText
          text="init_sequence.sh"
          :speed="50"
          :hide-cursor-on-finish="true"
        />
      </div>

      <h1 class="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
        <DecryptedText
          text="Lars M."
          :delay="1000"
        />
      </h1>

      <h2 class="text-3xl md:text-5xl font-bold text-accent mb-8">
        <TypewriterText
          text="System Engineer"
          :delay="2500"
          :speed="70"
        />
      </h2>

      <p class="max-w-xl text-lg text-primary leading-relaxed mb-10">
        Passionate about Linux and Open Source. Dedicated to Information Security and Privacy. I build labs, break things and then secure them.
      </p>

      <div class="flex flex-wrap gap-4 items-center print:hidden">
        <a
          href="#projects"
          class="bg-transparent text-accent border border-accent px-6 py-3 rounded font-medium transition-all duration-300 hover:-translate-y-1 hover:bg-accent hover:text-canvas hover:shadow-lg hover:shadow-accent/30 mr-4"
        >
          View Projects
        </a>
        
        <div class="flex gap-3">
          <a
            v-for="link in socialLinks"
            :key="link.name"
            :href="link.url"
            target="_blank"
            class="p-2 rounded-md border border-border text-secondary hover:border-accent hover:text-accent transition-colors"
            :aria-label="link.name"
          >
            <component
              :is="link.icon"
              :size="20"
            />
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
