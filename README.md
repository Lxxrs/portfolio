# Portfolio

[![status-badge](https://ci.codeberg.org/api/badges/16662/status.svg)](https://ci.codeberg.org/repos/16662)

Personal portfolio with a terminal/sysadmin aesthetic. Built with Vue 3, TypeScript, and Tailwind CSS v4. Privacy-first — no analytics, tracking, or cookies.

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| Framework       | Vue 3 (Composition API, `<script setup>`)   |
| Language        | TypeScript 6                                |
| Build           | Vite+ (Rolldown + Vite 8)                   |
| Styling         | Tailwind CSS 4 (CSS-native `@theme`)        |
| Icons           | lucide-vue-next + custom SVG components     |
| Testing         | Vitest (via Vite+) + Vue Test Utils + jsdom |
| Linting         | Oxlint (via Vite+)                          |
| Formatting      | Oxfmt (via Vite+)                           |
| PWA             | vite-plugin-pwa                             |
| Package Manager | pnpm 10                                     |
| Node            | 24.x                                        |

## Project Structure

```sh
src/
├── App.vue                  # Root layout, routing, theme init
├── style.css                # Tailwind v4 theme, CSS variables, fonts
├── types.ts                 # Shared TypeScript interfaces
├── data/
│   └── portfolio.ts         # Social links, skills, projects data
├── components/
│   ├── HeroSection.vue      # Animated hero with DecryptedText + TypewriterText
│   ├── AboutSection.vue     # Bio + tech stack card
│   ├── ProjectsSection.vue  # Project cards grid
│   ├── ContactSection.vue   # Email CTA + social links
│   ├── CommandPalette.vue   # Ctrl+K command palette with focus trap
│   ├── NavBar.vue           # Terminal-style breadcrumb nav
│   ├── AppFooter.vue        # Social links, sign-off, license
│   └── ...                  # ProjectCard, SectionHeader, icon components
├── composables/
│   ├── useTheme.ts          # Dark/light toggle with system preference
│   ├── useScramble.ts       # Text scramble/decrypt animation
│   ├── useActiveSection.ts  # IntersectionObserver section tracking
│   ├── useFocusTrap.ts      # Modal focus trap (WCAG compliant)
│   └── useKeyboardShortcuts.ts
└── assets/
    └── jetbrains_mono_webfonts/  # Self-hosted JetBrains Mono
```

## Development

Requires [Node.js](https://nodejs.org/) 24.x.

```sh
pnpm install             # Install dependencies
vp dev                   # Start dev server at http://localhost:5173
vp test                  # Run unit tests (watch mode)
vp test --run            # Run tests once
vp lint                  # Lint with Oxlint
vp check                 # Format + lint + type-check in one pass
vp build                 # Production build
vp preview               # Preview production build locally
```

## Deployment

Auto-deploys via [Woodpecker CI](https://ci.codeberg.org/) on push to `main`:

1. Enable Woodpecker CI at [ci.codeberg.org](https://ci.codeberg.org/)
2. Activate the repository
3. Push to `main` — site deploys automatically

## Keyboard Shortcuts

| Key            | Action               |
| -------------- | -------------------- |
| `Ctrl/Cmd + K` | Open command palette |
| `H`            | Go to Home           |
| `A`            | Go to About          |
| `P`            | Go to Projects       |
| `C`            | Go to Contact        |
| `T`            | Toggle theme         |
| `?`            | Show shortcuts help  |
| `Esc`          | Close dialogs        |

## Security & Privacy

Client-side hardening following [Mozilla's Practical Implementation Guides](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides):

- Strict Content Security Policy — dev CSP auto-replaced with production CSP at build time (no `unsafe-inline`, no `unsafe-eval`)
- Cross-Origin isolation — `COOP`, `COEP`, `CORP` headers injected in production builds
- Self-hosted fonts and assets — zero external requests
- No tracking, analytics, or cookies
- `noindex`, `nofollow`, `no-referrer` — not indexed by search engines
- `robots.txt` blocks all crawlers
- `security.txt` ([RFC 9116](https://www.rfc-editor.org/rfc/rfc9116)) for vulnerability disclosure
- Permissions-Policy disables unused browser APIs (camera, microphone, geolocation, etc.)

## Theming

Theme is configured via CSS variables in `src/style.css` under `@theme` (Tailwind v4). Use semantic color utilities:

| Utility          | Purpose                   |
| ---------------- | ------------------------- |
| `bg-canvas`      | Page background           |
| `bg-card`        | Card/component background |
| `text-primary`   | Main text                 |
| `text-secondary` | Muted text                |
| `text-accent`    | Highlight color           |
| `border-border`  | Borders                   |

Dark mode toggles via `.dark` class on `<html>`. Respects system preference on first visit.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
