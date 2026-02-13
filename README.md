# Portfolio

Personal portfolio with a terminal aesthetic. Built with Vue 3, TypeScript, and Tailwind CSS.

## Development

```sh
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Build for production
npm run build
```

## Deployment

### Automatic (Codeberg Pages)

This project auto-deploys to [Codeberg Pages](https://lxrs.codeberg.page/portfolio/) via Woodpecker CI on every push to `main`.

**Setup:**

1. Enable Woodpecker CI at [ci.codeberg.org](https://ci.codeberg.org)
2. Activate your repository
3. Push to `main` → site deploys automatically

### Manual

```sh
npm run deploy
```

The script runs tests, builds, and pushes to the `pages` branch.

## Security

Client-side security following [Mozilla's Guidelines](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides):

- ✅ Strict Content Security Policy (CSP)
- ✅ No inline scripts or styles
- ✅ Self-hosted fonts and assets
- ✅ Cross-Origin isolation
- ✅ No tracking or analytics
- ✅ Privacy-first (no referrer, no indexing)

## License

CC BY-NC-SA 4.0
