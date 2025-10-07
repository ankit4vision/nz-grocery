# NZ Grocery Admin - Run & Build

## Local Development

```bash
# From the admin directory
npm install
npm run dev
```

The dev server uses environment variables from `env.local` (see `env.example` for all keys). Hot Module Replacement (HMR) is enabled.

## Environment Builds

```bash
# Development build (mode=development)
npm run build:dev

# Staging build (mode=staging)
npm run build:staging

# Production build (mode=production)
npm run build:prod
```

Build outputs go to `dist/`.

## Preview Built Artifacts

```bash
# Preview generic build
npm run preview

# Preview by environment
npm run preview:dev
npm run preview:staging
npm run preview:prod
```

## Environment Files

- `env.example`: template with all variables
- `env.local`: used by `npm run dev`
- `env.staging`: used by `build:staging`/`preview:staging`
- `env.production`: used by `build:prod`/`preview:prod`

Variables are available via `import.meta.env`, e.g.:

```js
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
```

For full details, see `ENVIRONMENT_SETUP.md` and `ENVIRONMENT_SETUP_COMPLETE.md`.
