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

## Security

This project implements client-side security best practices following [Mozilla's Practical Security Implementation Guide](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides).

### Security Features Implemented

#### High Priority (Mozilla Guidelines)

- ✅ **Content-Security-Policy (CSP)** - Strict CSP with deny-by-default approach
  - `default-src 'none'` - Deny by default, most secure baseline
  - `script-src 'self'` - No inline scripts, prevents code injection
  - `style-src 'self'` - No inline styles (`'unsafe-inline'` removed), prevents content injection
  - `frame-ancestors 'none'` - Clickjacking prevention
  - `object-src 'none'` - Blocks dangerous plugins (Flash, Java)
  - `upgrade-insecure-requests` - Auto-upgrades HTTP to HTTPS
  - Explicit allow-list for each resource type (img, font, connect)

- ✅ **X-Content-Type-Options** - Prevents MIME-sniffing attacks (`nosniff`)
- ✅ **Referrer-Policy** - Privacy protection (`no-referrer`)
- ✅ **Permissions-Policy** - Disables unnecessary browser features
- ✅ **Cross-Origin Policies** - Protection against speculative side-channel attacks
  - `Cross-Origin-Opener-Policy: same-origin`
  - `Cross-Origin-Embedder-Policy: require-corp`
  - `Cross-Origin-Resource-Policy: same-origin`

#### Privacy & Security Measures

- ✅ No inline scripts or `eval()` - all JavaScript in separate files
- ✅ No inline styles - all CSS in external stylesheets (CSP blocks `'unsafe-inline'`)
- ✅ Self-hosted fonts and assets - no external CDNs
- ✅ Form autocomplete disabled for command palette
- ✅ Service Worker for secure offline functionality
- ✅ No cookies or sensitive data in localStorage
- ✅ Reduced motion support for accessibility
- ✅ robots.txt configured to prevent indexing

### Testing Security

Test your deployment:

- [Security Headers Test](https://securityheaders.com/)
- [Mozilla Observatory](https://observatory.mozilla.org/)

**Note:** Some security headers require server configuration for full A+ rating. The current implementation focuses on client-side security measures that work without server configuration changes.

## Privacy

This site prioritizes user privacy:

- ✅ No tracking or analytics
- ✅ No external resources (self-hosted fonts)
- ✅ No referrer information leaked
- ✅ No SEO or search indexing
- ✅ Maximum security headers

## Deployment

### Build for Production

```sh
npm run build
```

The output will be in the `dist/` directory, ready to deploy.

### Deploy to Any Static Host

Upload the entire `dist/` folder contents to your web server:

- **Hetzner:** Upload to `public_html/` or `/var/www/html/`
- **Netlify/Vercel:** Drag and drop `dist/` folder or connect Git repo
- **GitHub Pages:** Use GitHub Actions to deploy `dist/`
- **Any static host:** Just upload all files from `dist/`

That's it! No server configuration required. 🎉

### Automated Deployment (Optional)

This project includes a `.woodpecker.yml` file for CI/CD.

To enable auto-deployment:

- Uncomment the `deploy` step in `.woodpecker.yml`.
- Add your Hetzner SSH credentials (`SSH_USER`, `SSH_HOST`, `SSH_KEY`) as secrets in your Codeberg repository settings.
- The pipeline will use `rsync` to push the `dist/` folder to your server on every push to `main`.
