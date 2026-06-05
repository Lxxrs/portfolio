---
applyTo: "**/*.spec.ts"
description: "Vue 3 + Vitest testing conventions for this project. Use when writing or reviewing spec files."
---

# Testing Conventions

## Imports

Always import test utilities from `vite-plus/test`, **not** from `vitest`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vite-plus/test";
```

Vue Test Utils is available directly:

```ts
import { mount, defineComponent } from "@vue/test-utils";
```

## Co-located Specs

Place `*.spec.ts` files next to the source file they test:

- `src/composables/useScramble.ts` → `src/composables/useScramble.spec.ts`
- `src/components/ProjectCard.vue` → `src/components/ProjectCard.spec.ts`

## Testing Singleton Composables

`useTheme` and other module-level singletons must be re-imported fresh per test to avoid state leakage:

```ts
beforeEach(async () => {
  vi.resetModules();
  const mod = await import("./useTheme");
  useTheme = mod.useTheme;
});
```

## Vue Lifecycle Context (`withSetup`)

Composables that use `onMounted`, `onUnmounted`, or `watch` require a Vue component context. Use a `withSetup` helper:

```ts
import { defineComponent, type App } from "vue";
import { mount } from "@vue/test-utils";

function withSetup<T>(composable: () => T): [T, App] {
  let result!: T;
  const app = mount(
    defineComponent({
      setup() {
        result = composable();
        return () => null;
      },
    }),
  );
  return [result, app.vm.$.appContext.app];
}
```

## Required Mocks

### `window.matchMedia`

Required by `useScramble` and `useTheme`. Add to any test file that imports either:

```ts
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### `localStorage`

```ts
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });
```

## Fake Timers

Use for animation composables like `useScramble`:

```ts
beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});
```

## `@vue/test-utils` Types

`@vue/test-utils@2.4.7` ships broken package metadata: its `package.json` declares
`"types": "dist/index.d.ts"` but that file does not exist. A `paths` override in
`tsconfig.app.json` redirects TypeScript to the actual `dist/src/index.d.ts`.

This is transparent — no special import paths or workarounds are needed in spec files.
If TypeScript reports `TS7016: Could not find declaration file for @vue/test-utils`,
check that the `paths` override is present in `tsconfig.app.json` and remove it
once the package ships a fixed version.
