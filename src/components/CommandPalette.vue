<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import {
  Terminal,
  Search,
  ArrowRight,
  Sun,
  Moon,
  Home,
  User,
  Briefcase,
  Mail,
} from "lucide-vue-next";
import { useTheme } from "../composables/useTheme";
import { useFocusTrap } from "../composables/useFocusTrap";
import { socialLinks } from "../data/portfolio";
import type { Component } from "vue";

const isOpen = ref(false);
const searchQuery = ref("");
const selectedIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);
const modalRef = ref<HTMLElement | null>(null);

const { toggleTheme, isDark } = useTheme();
const { trapFocus, releaseFocus } = useFocusTrap(modalRef, isOpen);

// Watch for modal open/close to manage focus
watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      trapFocus();
    });
  } else {
    releaseFocus();
  }
});

interface Command {
  id: string;
  label: string;
  icon: Component;
  shortcut?: string;
  action: () => void;
  group: "Navigation" | "Actions" | "Social";
}

const commands = computed<Command[]>(() => {
  const list: Command[] = [
    // Navigation
    {
      id: "nav-home",
      label: "Go to Home",
      icon: Home,
      group: "Navigation",
      action: () => scrollTo("home"),
    },
    {
      id: "nav-about",
      label: "Go to About",
      icon: User,
      group: "Navigation",
      action: () => scrollTo("about"),
    },
    {
      id: "nav-projects",
      label: "Go to Projects",
      icon: Briefcase,
      group: "Navigation",
      action: () => scrollTo("projects"),
    },
    {
      id: "nav-contact",
      label: "Go to Contact",
      icon: Mail,
      group: "Navigation",
      action: () => scrollTo("contact"),
    },
    // Actions
    {
      id: "theme-toggle",
      label: isDark.value ? "Switch to Light Mode" : "Switch to Dark Mode",
      icon: isDark.value ? Sun : Moon,
      group: "Actions",
      action: () => {
        toggleTheme();
        close();
      },
    },
  ];

  // Add Socials
  socialLinks.forEach((link) => {
    list.push({
      id: `social-${link.name}`,
      label: `Open ${link.name}`,
      icon: link.icon, // Using the component directly
      group: "Social",
      action: () => {
        const newWindow = window.open(link.url, "_blank", "noopener,noreferrer");
        if (newWindow) newWindow.opener = null;
        close();
      },
    });
  });

  return list.filter((cmd) => cmd.label.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  close();
};

const open = () => {
  isOpen.value = true;
  searchQuery.value = "";
  selectedIndex.value = 0;
  nextTick(() => {
    searchInput.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  }

  if (!isOpen.value) return;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      selectedIndex.value = (selectedIndex.value + 1) % commands.value.length;
      break;
    case "ArrowUp":
      e.preventDefault();
      selectedIndex.value =
        (selectedIndex.value - 1 + commands.value.length) % commands.value.length;
      break;
    case "Enter":
      e.preventDefault();
      if (commands.value[selectedIndex.value]) {
        commands.value[selectedIndex.value].action();
      }
      break;
    case "Escape":
      e.preventDefault();
      close();
      break;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        ref="modalRef"
        class="fixed inset-0 z-100 flex items-start justify-center pt-[20vh] px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="command-palette-title"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" @click="close" />

        <!-- Modal -->
        <div
          class="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-[60vh]"
        >
          <h2 id="command-palette-title" class="sr-only">Command Palette</h2>
          <!-- Search Bar -->
          <div class="flex items-center px-4 py-3 border-b border-border">
            <Search :size="20" class="text-secondary mr-3" aria-hidden="true" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Type a command..."
              autocomplete="off"
              aria-label="Search commands"
              class="flex-1 bg-transparent border-none outline-none text-primary placeholder-secondary font-mono text-sm h-6"
            />
            <div class="text-xs text-secondary border border-border px-1.5 py-0.5 rounded">ESC</div>
          </div>

          <!-- Results -->
          <div class="overflow-y-auto p-2">
            <div v-if="commands.length === 0" class="p-4 text-center text-secondary text-sm">
              No commands found.
            </div>

            <button
              v-for="(cmd, index) in commands"
              :key="cmd.id"
              type="button"
              class="w-full flex items-center px-3 py-3 rounded-md text-sm transition-colors group"
              :class="selectedIndex === index ? 'bg-accent/10 text-accent' : 'text-primary'"
              @click="cmd.action"
              @mouseenter="selectedIndex = index"
            >
              <component
                :is="cmd.icon"
                :size="18"
                class="mr-3"
                :class="selectedIndex === index ? 'text-accent' : 'text-secondary'"
              />
              <span class="flex-1 text-left font-medium">{{ cmd.label }}</span>
              <ArrowRight v-if="selectedIndex === index" :size="16" class="opacity-50" />
            </button>
          </div>

          <!-- Footer -->
          <div
            class="bg-canvas/50 px-4 py-2 border-t border-border flex justify-between items-center text-xs text-secondary"
          >
            <div class="flex gap-3">
              <span><strong class="text-primary">↑↓</strong> to navigate</span>
              <span><strong class="text-primary">↵</strong> to select</span>
            </div>
            <div class="flex items-center gap-1">
              <Terminal :size="12" />
              <span>sysadmin@local</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
