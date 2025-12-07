<script setup lang="ts">
import NavBar from './components/NavBar.vue';
import HeroSection from './components/HeroSection.vue';
import AboutSection from './components/AboutSection.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import AppFooter from './components/AppFooter.vue';
import CommandPalette from './components/CommandPalette.vue';
import { useActiveSection } from './composables/useActiveSection';
import { useKeyboardShortcuts } from './composables/useKeyboardShortcuts';

const { activeSection } = useActiveSection(['home', 'about', 'projects']);
useKeyboardShortcuts();
</script>

<template>
  <div class="min-h-screen selection:bg-accent selection:text-white pb-20">
    <!-- Accessibility: Skip to main content -->
    <a href="#main-content" 
       class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-md focus:font-bold font-mono">
      Skip to content
    </a>

    <NavBar :active-section="activeSection" />
    <CommandPalette />

    <main id="main-content" class="max-w-5xl mx-auto px-6 pt-32">
      <HeroSection id="home" />
      <AboutSection id="about" />
      <ProjectsSection id="projects" />
      <AppFooter />
    </main>
  </div>
</template>
