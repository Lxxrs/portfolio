# Portfolio Project Instructions

## Project Overview
This is a **Vue 3** application built with **Vite** and **TypeScript**. It serves as a developer portfolio with a terminal/system-admin aesthetic.

## Tech Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured in `src/style.css`)
- **Icons:** `lucide-vue-next`

## Architecture & Core Concepts

### Directory Structure
- `src/App.vue`: Main entry component containing the global layout (Navbar) and theme logic.
- `src/components/`: Reusable UI components (e.g., `ProjectCard.vue`, `SectionHeader.vue`).
- `src/composables/`: Shared logic hooks (e.g., `useScramble.ts`).
- `src/style.css`: Global styles and Tailwind v4 theme configuration.

### Theming & Styling
- **Tailwind v4**: Configuration is handled via CSS variables in `src/style.css` under the `@theme` directive.
- **Semantic Colors**: Use these custom utility classes instead of hardcoded colors:
  - `bg-canvas`: Main background
  - `bg-card`: Component background
  - `text-primary`: Main text color
  - `text-secondary`: Muted text color
  - `text-accent`: Highlight color (Blue in light, Green in dark)
  - `border-border`: Border color
- **Dark Mode**: Implemented via a `.dark` class on `<html>`. Toggled in `App.vue`.
- **Typography**: Uses `JetBrains Mono` globally via `font-mono`.

### Component Patterns
- Use **`<script setup lang="ts">`** for all components.
- Define props using TypeScript generics:
  ```typescript
  defineProps<{
    title: string;
    isActive?: boolean;
  }>();
  ```
- Use `lucide-vue-next` for icons. Pass `:size` prop for sizing.

## Development Workflow

### Scripts
- `npm run dev`: Start development server.
- `npm run build`: Type-check and build for production.
- `npm run lint`: Run ESLint.

### Common Tasks
- **Adding a new component**: Create in `src/components/`, import in `App.vue` (or parent).
- **Updating Theme**: Modify CSS variables in `src/style.css` inside `@layer base`.
