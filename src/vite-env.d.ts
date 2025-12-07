/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // Using 'unknown' avoids the 'Unexpected any' error while still telling TypeScript
  // that this is a valid Vue component.
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}