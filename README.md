# Accessibility Testing Tool (Dev-Friendly) — Skeleton

This is an **empty starter skeleton** for a simple accessibility testing tool using:

- **Next.js (App Router) + TypeScript**
- **Playwright** for loading the page in a real browser
- **axe-core** for accessibility rules/results

## What’s included
- Minimal UI: URL input + results view (placeholder data until you wire the scanner)
- API route: `POST /api/scan` (returns placeholder; hook into Playwright + axe-core)
- Scanner stub in `src/lib/scanner/scanWithAxe.ts`

## First steps (local)
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Install Playwright browsers**
   ```bash
   npx playwright install --with-deps
   ```
   (On Windows you can omit `--with-deps`.)

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. Open: http://localhost:3000

## When you start wiring real scans
- Implement `scanWithAxe(url)` in:
  - `src/lib/scanner/scanWithAxe.ts`
- Then switch the API route to call it:
  - `src/app/api/scan/route.ts`

## Notes
- Many sites block automated browsers or require cookies/auth; for MVP keep it to public pages.
- Consider adding a simple rate limit if you deploy publicly.

— Generated 2025-12-30
