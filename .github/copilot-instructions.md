# Portfolio Project Instructions

## Project Overview
This is a **Vue 3** application built with **Vite** and **TypeScript**. It serves as a developer portfolio with a terminal/system-admin aesthetic, utilizing **Tailwind CSS v4** for styling.

## Tech Stack
- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite v7 
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
- `npm run lint`: Run ESLint.
- `npm run dev`: Start development server.
- `npm run test`: Run tests (if applicable).
- `npm run build`: Type-check (`tsc -b`) and build for production.

### Common Tasks
- **Adding a new component**: Create in `src/components/`, import in parent component.
- **Updating Theme**: Modify CSS variables in `src/style.css` inside `@layer base` for colors, and `@theme` for Tailwind configuration.
- **Composables**: Place shared logic (like animations or state management) in `src/composables/`.


### Best Practices
- **Type Safety**: Always use TypeScript types for props, state, and function signatures.
- **Component Reusability**: Create reusable components for common UI patterns (e.g., buttons, cards).
- **Consistent Styling**: Use Tailwind utility classes and custom semantic classes for consistent styling across the app.
- **Accessibility**: Ensure components are accessible (e.g., use `aria` attributes where necessary).
- **Performance**: Optimize images and use lazy loading for better performance.
- **Security**: Avoid exposing sensitive information in the frontend code. Use environment variables for any API keys or secrets.
- **Web Security**: Implement Content Security Policy (CSP) headers to mitigate XSS attacks. Use `rel="noopener noreferrer"` for external links to prevent tabnabbing.
- **Testing**: Write unit tests for critical components and logic using a testing framework like Jest or Vue Test Utils.
- **Privacy**: Privacy is a priority. No SEO is used. The site is designed to be a personal portfolio without tracking or analytics. Ensure that any third-party libraries used do not include tracking scripts or collect user data. Always review the privacy policies of dependencies and avoid those that compromise user privacy.
- **Documentation**: Keep code well-documented with comments and maintain a clear README for the project. Include instructions for setup, development, and deployment.
- **Local First**: The application is designed to run locally without reliance on external services. Ensure that all necessary assets and dependencies are included in the project to allow for offline usage. Avoid using APIs or services that require internet access, and ensure that any data used is stored locally within the application.
- **Content Security**: Implement a strict Content Security Policy (CSP) to prevent cross-site scripting (XSS) attacks. This can be done by configuring the server to include appropriate CSP headers, specifying allowed sources for scripts, styles, and other resources. Additionally, use `rel="noopener noreferrer"` for all external links to prevent tabnabbing attacks.
- **Performance Optimization**: Optimize the application for performance by minimizing bundle size, using code-splitting, and lazy-loading components where appropriate. Ensure that images are optimized and consider using a tool like Webpack Bundle Analyzer to identify and address any performance bottlenecks.
- **Security Best Practices**: Follow security best practices by keeping dependencies up to date, avoiding the use of vulnerable libraries, and regularly auditing the code for potential security issues. Use tools like npm audit to identify and fix vulnerabilities in dependencies.
- **Privacy Considerations**: Since this is a personal portfolio, ensure that no tracking or analytics tools are included in the project. Avoid using third-party libraries that may collect user data or include tracking scripts. Always review the privacy policies of any dependencies used and prioritize user privacy in all aspects of the application.
- **Clean Code**: Maintain clean and readable code by following consistent coding conventions, using meaningful variable and function names, and avoiding unnecessary complexity. Regularly refactor code to improve readability and maintainability.
- **Keep It Simple**: Focus on simplicity in both design and implementation. Avoid over-engineering solutions and strive for clear, straightforward code that is easy to understand and maintain. Prioritize functionality and user experience over unnecessary features or complexity.

After every change, ensure that the application runs smoothly and that all features work as intended. Regularly test the application in different environments and browsers to ensure compatibility and a consistent user experience.