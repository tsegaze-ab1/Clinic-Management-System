# Frontend (Organizer 
This folder is a clean, backend-ready frontend package extracted from the project.

## Included

- Core Vite app files: `index.html`, `package.json`, `vite.config.js`
- Full app source: `src/`
- Only required static assets currently referenced by code under `ingrident/`
- Environment template: `.env.example`

## Backend Connection

1. Copy `.env.example` to `.env`
2. Set your backend base URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Notes

- This package keeps only assets currently used by the running website pages.
- If you add new media in code, place them in `ingrident/` (or migrate to `src/assets/`) and update imports.
