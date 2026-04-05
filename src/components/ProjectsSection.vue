<script setup lang="ts">
import SectionHeader from "./SectionHeader.vue";
import ProjectCard from "./ProjectCard.vue";
import { projects } from "../data/portfolio";
</script>

<template>
  <section class="py-16">
    <SectionHeader num="2" title="Projects" />
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in projects"
        :key="project.title"
        :title="project.title"
        :desc="project.desc"
        :stack="project.stack"
        :repo-url="project.repoUrl"
        :is-private="project.isPrivate"
      />
    </div>
  </section>
</template>
