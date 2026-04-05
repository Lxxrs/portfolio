<script setup lang="ts">
import palestineFlag from "../assets/apple-emojis/palestine-flag.svg?url";
</script>

<template>
  <footer class="text-center py-12 mt-12 border-t border-border print:hidden">
    <!-- Terminal sign-off -->
    <p class="text-secondary text-sm mb-6">
      <span class="text-accent">lars@portfolio</span>:
      <span class="mx-1">~#</span>
      <span class="motion-safe:animate-blink">logout</span>
    </p>

    <!-- Privacy + License -->
    <div class="text-xs text-primary space-y-3">
      <p>Built with security and privacy in mind. No analytics, tracking or cookies.</p>

      <p class="flex items-center justify-center gap-1 flex-wrap">
        <span>© 2026 by</span>
        <a
          href="https://codeberg.org/lxrs"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-accent text-primary transition-colors"
        >
          Lars M.
        </a>
        <span>- Licensed under</span>
        <a
          href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
          rel="noopener noreferrer license"
          class="hover:text-accent text-primary transition-colors inline-flex items-center gap-1"
        >
          CC BY-NC-SA 4.0
          <img
            src="/icons/cc.svg"
            alt="Creative Commons"
            width="16"
            height="16"
            class="inline-block w-4 h-4"
          />
          <img
            src="/icons/by.svg"
            alt="Attribution"
            width="16"
            height="16"
            class="inline-block w-4 h-4"
          />
          <img
            src="/icons/nc.svg"
            alt="Non-Commercial"
            width="16"
            height="16"
            class="inline-block w-4 h-4"
          />
          <img
            src="/icons/sa.svg"
            alt="Share Alike"
            width="16"
            height="16"
            class="inline-block w-4 h-4 text-primary"
          />
        </a>
      </p>
      <p>
        <a
          href="https://codeberg.org/Lxrs/portfolio"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-accent transition-colors text-primary"
        >
          Source Code
        </a>
      </p>
      <p>
        <a
          href="https://palestine.un.org/en"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-accent text-primary transition-colors inline-flex items-center gap-1 whitespace-nowrap"
        >
          Free Palestine
          <img
            :src="palestineFlag"
            width="16"
            height="16"
            alt="Flag of Palestine"
            class="inline-block"
          />
        </a>
      </p>
    </div>
  </footer>
</template>
