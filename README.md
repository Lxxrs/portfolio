# Portfolio

[![Built with Astro](public/badges/built-with-astro.svg)](https://astro.build) [![status-badge](https://ci.codeberg.org/api/badges/16662/status.svg)](https://ci.codeberg.org/repos/16662)

One-page portfolio with a terminal/fsociety-lite aesthetic. Privacy-first:
no analytics, no cookies, no third-party requests, noindex everywhere.

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Astro 7 (static output, zero islands) |
| Styling   | Tailwind CSS 4 + CSS design tokens    |
| Client JS | Bundled `src/scripts/ui.ts`           |
| CI/CD     | Woodpecker CI → Codeberg Pages        |
| Package   | pnpm 10 · Node 24                     |

## Commands

```sh
pnpm install       # once
pnpm dev           # dev server
pnpm build         # production build -> dist/
pnpm preview       # serve dist/ locally (CSP testable here, NOT in dev)
pnpm check         # astro check + prettier --check
pnpm format        # prettier --write
```

## Editing content

Everything editable lives in `src/data/`:
`site.ts` (identity) · `projects.ts` (case studies) · `skills.ts` (tree) ·
`social.ts` (chips) · `now.ts` (the `$ now` line).

## Deploy

Push to `main` → Woodpecker validates, builds, pushes `dist/` to the
`pages` branch via SSH deploy key → git-pages serves it. See `.woodpecker.yaml`.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
