# Portfolio Project Instructions

## Project Overview

This is a **Vue 3** application built with **Vite+** and **TypeScript**. It serves as a developer portfolio with a terminal/system-admin aesthetic, utilizing **Tailwind CSS v4** for styling.

## Tech Stack

- **Framework:** Vue 3 (Composition API, `<script setup>`)
- **Build Tool:** Vite+
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

- `vp dev`: Start development server.
- `vp lint`: Lint with Oxlint.
- `vp check`: Format, lint, and type-check in one pass.
- `vp test`: Run tests.
- `vp build`: Build for production.

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

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, but it invokes Vite through `vp dev` and `vp build`.

## Vite+ Workflow

`vp` is a global binary that handles the full development lifecycle. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

### Start

- create - Create a new project from a template
- migrate - Migrate an existing project to Vite+
- config - Configure hooks and agent integration
- staged - Run linters on staged files
- install (`i`) - Install dependencies
- env - Manage Node.js versions

### Develop

- dev - Run the development server
- check - Run format, lint, and TypeScript type checks
- lint - Lint code
- fmt - Format code
- test - Run tests

### Execute

- run - Run monorepo tasks
- exec - Execute a command from local `node_modules/.bin`
- dlx - Execute a package binary without installing it as a dependency
- cache - Manage the task cache

### Build

- build - Build for production
- pack - Build libraries
- preview - Preview production build

### Manage Dependencies

Vite+ automatically detects and wraps the underlying package manager such as pnpm, npm, or Yarn through the `packageManager` field in `package.json` or package manager-specific lockfiles.

- add - Add packages to dependencies
- remove (`rm`, `un`, `uninstall`) - Remove packages from dependencies
- update (`up`) - Update packages to latest versions
- dedupe - Deduplicate dependencies
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why (`explain`) - Show why a package is installed
- info (`view`, `show`) - View package information from the registry
- link (`ln`) / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `vp` itself to the latest version

These commands map to their corresponding tools. For example, `vp dev --port 3000` runs Vite's dev server and works the same as Vite. `vp test` runs JavaScript tests through the bundled Vitest. The version of all tools can be checked using `vp --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Using the package manager directly:** Do not use pnpm, npm, or Yarn directly. Vite+ can handle all package manager operations.
- **Always use Vite commands to run tools:** Don't attempt to run `vp vitest` or `vp oxlint`. They do not exist. Use `vp test` and `vp lint` instead.
- **Running scripts:** Vite+ built-in commands (`vp dev`, `vp build`, `vp test`, etc.) always run the Vite+ built-in tool, not any `package.json` script of the same name. To run a custom script that shares a name with a built-in command, use `vp run <script>`. For example, if you have a custom `dev` script that runs multiple services concurrently, run it with `vp run dev`, not `vp dev` (which always starts Vite's dev server).
- **Do not install Vitest, Oxlint, Oxfmt, or tsdown directly:** Vite+ wraps these tools. They must not be installed directly. You cannot upgrade these tools by installing their latest versions. Always use Vite+ commands.
- **Use Vite+ wrappers for one-off binaries:** Use `vp dlx` instead of package-manager-specific `dlx`/`npx` commands.
- **Import JavaScript modules from `vite-plus`:** Instead of importing from `vite` or `vitest`, all modules should be imported from the project's `vite-plus` dependency. For example, `import { defineConfig } from 'vite-plus';` or `import { expect, test, vi } from 'vite-plus/test';`. You must not install `vitest` to import test utilities.
- **Type-Aware Linting:** There is no need to install `oxlint-tsgolint`, `vp lint --type-aware` works out of the box.

## CI Integration

For GitHub Actions, consider using [`voidzero-dev/setup-vp`](https://github.com/voidzero-dev/setup-vp) to replace separate `actions/setup-node`, package-manager setup, cache, and install steps with a single action.

```yaml
- uses: voidzero-dev/setup-vp@v1
  with:
    cache: true
- run: vp check
- run: vp test
```

## Review Checklist for Agents

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to validate changes.
<!--VITE PLUS END-->
