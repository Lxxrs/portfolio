<script setup lang="ts">
import SectionHeader from './SectionHeader.vue';
import SkillItem from './SkillItem.vue';
import { skills } from '../data/portfolio';
</script>

<template>
  <section class="py-20">
    <SectionHeader
      num="1"
      title="System Status"
    />

    <div class="grid md:grid-cols-2 gap-12">
      <div class="space-y-4 text-secondary leading-relaxed">
        <p>
          I operate at the intersection of <strong class="text-accent">System & Network Engineering</strong>.
          From configuring routers with Python, to deploying hardened storage solutions, I build systems with the power of the CLI. 
          Currently focused on network automation with Pyinfra and advancing my offensive security skills via Hack The Box.
        </p>
      </div>

      <div class="bg-card p-6 rounded-md border border-border">
        <div class="flex gap-2 mb-6 border-b border-border pb-4">
          <div class="w-3 h-3 rounded-full bg-red-500/50" />
          <div class="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div class="w-3 h-3 rounded-full bg-green-500/50" />
          <span class="ml-auto text-s text-primary font-mono">Tech Stack</span>
        </div>
        <div class="grid grid-cols-2 gap-4 font-mono text-sm">
          <SkillItem
            v-for="skill in skills"
            :key="skill.label"
            :label="skill.label"
          >
            <component
              :is="skill.icon"
              :size="16"
              class="text-accent"
            />
          </SkillItem>
        </div>
      </div>
    </div>
  </section>
</template>
