# Portfolio Project Instructions

## Project Overview
This is a **Vue 3** application built with **Vite** and **TypeScript**. It serves as a developer portfolio with a terminal/system-admin aesthetic, utilizing **Tailwind CSS v4** for styling.

## Tech Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (configured in `src/style.css` via `@theme`)
- **Icons:** `lucide-vue-next` and custom SVG components

## Architecture & Core Concepts

### Directory Structure
- `src/App.vue`: Main entry component containing the global layout (Navbar), theme logic, and routing (if applicable).
- `src/components/`: Reusable UI components (e.g., `ProjectCard.vue`, `SectionHeader.vue`).
- `src/composables/`: Shared logic hooks (e.g., `useScramble.ts` for text animation).
- `src/style.css`: Global styles, Tailwind v4 theme configuration, and CSS variables.

### Theming & Styling
- **Tailwind v4**: Configuration is handled via CSS variables in `src/style.css` under the `@theme` directive.
- **Semantic Colors**: Use these custom utility classes (mapped to CSS variables) instead of hardcoded colors:
  - `bg-canvas`: Main background
  - `bg-card`: Component/Card background
  - `text-primary`: Main text color
  - `text-secondary`: Muted/Secondary text color
  - `text-accent`: Highlight color (dynamic based on theme)
  - `border-border`: Border color
- **Dark Mode**: Implemented via a `.dark` class on `<html>`. Toggled in `App.vue` using a watcher.
- **Typography**: Uses `JetBrains Mono` globally via `font-mono`.

### Component Patterns
- **Script Setup**: Use `<script setup lang="ts">` for all components.
- **Props**: Define props using TypeScript generics with `defineProps`.
  ```typescript
  defineProps<{
    title: string;
    desc: string;
    stack: string[];
    isPrivate?: boolean;
  }>();
  ```
- **Icons**: Use `lucide-vue-next` for standard icons. Pass `:size` prop for sizing. Custom icons (e.g., `CodebergIcon.vue`) are in `src/components/`.

## Development Workflow

### Scripts
- `npm run dev`: Start development server.
- `npm run build`: Type-check (`tsc -b`) and build for production.
- `npm run lint`: Run ESLint.

### Common Tasks
- **Adding a new component**: Create in `src/components/`, import in parent component.
- **Updating Theme**: Modify CSS variables in `src/style.css` inside `@layer base` for colors, and `@theme` for Tailwind configuration.
- **Composables**: Place shared logic (like animations or state management) in `src/composables/`.
