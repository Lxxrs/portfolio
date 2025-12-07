# Vue 3 + TypeScript + Vite

This template provides a minimal setup to get Vue 3 working in Vite with HMR and some ESLint rules.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with ESLint

```sh
npm run lint
```

### Run Unit Tests

```sh
npm run test
```

## Deployment

### Build for Production

1. Run the build command:
   ```sh
   npm run build
   ```
2. The output will be in the `dist/` directory.

### Deploy to Hetzner (Static Hosting)

1. **Manual Upload:**
   - Upload the contents of the `dist/` folder to your web server's public directory (e.g., `public_html` or `/var/www/html`) using SFTP or FileZilla.

2. **Automated Deployment (Codeberg CI):**
   - This project includes a `.woodpecker.yml` file for CI/CD.
   - To enable auto-deployment:
     - Uncomment the `deploy` step in `.woodpecker.yml`.
     - Add your Hetzner SSH credentials (`SSH_USER`, `SSH_HOST`, `SSH_KEY`) as secrets in your Codeberg repository settings.
     - The pipeline will use `rsync` to push the `dist/` folder to your server on every push to `main`.
