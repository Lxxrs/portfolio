<script setup lang="ts">
import { ref, watch, type Component } from 'vue';
import { Sun, Moon, Terminal, Server, Shield, Network, ChevronRight, Mail } from 'lucide-vue-next';

// Import the components we created
import DecryptedText from './components/DecryptedText.vue';
import SectionHeader from './components/SectionHeader.vue';
import ProjectCard from './components/ProjectCard.vue';
import SkillItem from './components/SkillItem.vue';

// Import Icons
import LinkedinIcon from './components/LinkedinIcon.vue';
import MastodonIcon from './components/MastodonIcon.vue';
import SignalIcon from './components/SignalIcon.vue';
import LiberapayIcon from './components/LiberapayIcon.vue';
import CodebergIcon from './components/CodebergIcon.vue';

// --- State ---
const darkMode = ref(true);

interface SocialLink {
  name: string;
  url: string;
  icon: Component;
}

const socialLinks: SocialLink[] = [
  { name: 'Email', url: 'mailto:email@example.com', icon: Mail },
  { name: 'Signal', url: 'https://signal.me/#username', icon: SignalIcon },
  { name: 'Mastodon', url: 'https://mastodon.social/@user', icon: MastodonIcon },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/user', icon: LinkedinIcon },
  { name: 'Codeberg', url: 'https://codeberg.org/user', icon: CodebergIcon },
  { name: 'Liberapay', url: 'https://liberapay.com/user', icon: LiberapayIcon },
];

// --- Theme Logic ---
watch(darkMode, (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, { immediate: true });
</script>

<template>
  <div class="min-h-screen selection:bg-accent selection:text-white pb-20">

    <nav
      class="fixed w-full z-50 backdrop-blur-md bg-canvas/80 border-b border-border px-6 py-4 flex justify-between items-center">
      <div class="flex items-center gap-2 font-bold text-primary">
        <Terminal :size="20" class="text-accent" />
        <span class="text-sm">
          sysadmin<span class="text-accent">@local</span>:~/portfolio
        </span>
      </div>

      <button @click="darkMode = !darkMode"
        class="p-2 rounded-full hover:bg-border transition-colors text-secondary cursor-pointer"
        aria-label="Toggle Theme">
        <Sun v-if="!darkMode" :size="20" />
        <Moon v-else :size="20" />
      </button>
    </nav>

    <main class="max-w-5xl mx-auto px-6 pt-32">

      <section class="min-h-[60vh] flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-12">
        <div class="shrink-0 mb-8 md:mb-0">
          <img src="/lars_memoji.jpg" alt="My Memoji" class="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-accent shadow-lg shadow-accent/20" />
        </div>

        <div class="flex-1">
          <div class="flex items-center gap-2 text-accent mb-4 font-medium text-sm">
            <span class="animate-blink">_</span>
            <span>init_sequence.sh</span>
          </div>

          <h1 class="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
            <DecryptedText text="Lars M." />
          </h1>

          <h2 class="text-3xl md:text-5xl font-bold text-secondary mb-8">
            Securing the infrastructure.
          </h2>

          <p class="max-w-xl text-lg text-secondary leading-relaxed mb-10">
            Junior <span class="text-accent font-bold">System Engineer</span>.
            I build labs, harden networks, and automate the boring stuff.
            Passionate about Open Source and InfoSec.
          </p>

          <div class="flex flex-wrap gap-4 items-center">
            <a href="#projects"
              class="bg-accent text-white px-6 py-3 rounded font-medium hover:opacity-90 transition-opacity mr-4">
              View Executables
            </a>
            
            <div class="flex gap-3">
              <a v-for="link in socialLinks" :key="link.name" :href="link.url" target="_blank"
                class="p-2 rounded-md border border-border text-secondary hover:border-accent hover:text-accent transition-colors"
                :aria-label="link.name">
                <component :is="link.icon" :size="20" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="py-20">
        <SectionHeader num="1" title="System Status" />

        <div class="grid md:grid-cols-2 gap-12">
          <div class="space-y-4 text-secondary leading-relaxed">
            <p>
              My passion lies in the intersection of <strong class="text-primary">Network Engineering</strong> and
              <strong class="text-primary">Security</strong>.
              I prefer command-line solutions over GUIs and reproducible infrastructure over manual configuration.
            </p>
            <p>
              Currently working towards my LPIC-1 and experimenting with proactive threat hunting in my homelab.
            </p>
          </div>

          <div class="bg-card p-6 rounded-md border border-border">
            <div class="flex gap-2 mb-6 border-b border-border pb-4">
              <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
              <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
              <span class="ml-auto text-xs text-secondary font-mono">bash</span>
            </div>
            <div class="grid grid-cols-2 gap-4 font-mono text-sm">
              <SkillItem label="Linux / RHEL">
                <Server :size="16" class="text-accent" />
              </SkillItem>
              <SkillItem label="Networking / TCP">
                <Network :size="16" class="text-accent" />
              </SkillItem>
              <SkillItem label="Hardening (CIS)">
                <Shield :size="16" class="text-accent" />
              </SkillItem>
              <SkillItem label="Ansible / PyInfra">
                <ChevronRight :size="16" class="text-accent" />
              </SkillItem>
              <SkillItem label="Docker & Podman">
                <ChevronRight :size="16" class="text-accent" />
              </SkillItem>
              <SkillItem label="Bash & Python">
                <ChevronRight :size="16" class="text-accent" />
              </SkillItem>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" class="py-20">
        <SectionHeader num="2" title="Executables" />
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          <ProjectCard title="PyInfra Router"
            desc="Production script to automate router configuration across multiple devices using Python."
            :stack="['Python', 'Pyinfra', 'NetOps']"
            repoUrl="https://codeberg.org/user/pyinfra-router" />

          <ProjectCard title="HomeLab NAS"
            desc="Self-hosted storage solution using TrueNAS Scale. Configured with ZFS pools and WireGuard."
            :stack="['TrueNAS', 'ZFS', 'WireGuard']" :is-private="true" />

          <ProjectCard title="Packet Monitor"
            desc="Internal tool to visualize packet flow and flag anomalies. Built with a Vue frontend and Scapy."
            :stack="['Vue', 'TypeScript', 'Scapy']"
            repoUrl="https://codeberg.org/user/packet-monitor" />

          <ProjectCard title="Portfolio Website"
            desc="This website! Built with Vue 3, TypeScript, and Tailwind CSS. Features a custom terminal theme."
            :stack="['Vue 3', 'TypeScript', 'Tailwind']"
            repoUrl="https://codeberg.org/user/portfolio" />

        </div>
      </section>

      <footer class="text-center py-12 mt-12 border-t border-border">
        <p class="text-secondary text-sm mb-4">
          <span class="text-accent">root@portfolio</span>:
          <span class="mx-1">~#</span>
          <span class="animate-blink">logout</span>
        </p>
        <div class="text-xs text-secondary">
          <p class="mb-2">Created with Vue, TypeScript and Tailwind</p>
          <a href="https://codeberg.org/user/portfolio" target="_blank" class="hover:text-accent transition-colors">
            Source Code
          </a>
        </div>
      </footer>

    </main>
  </div>
</template>
