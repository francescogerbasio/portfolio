# AGENTS.md

## Project shape
- Astro 5 static portfolio with Svelte 5 islands. Pages: `src/pages/{index,about,career,fun}.astro`, each mounting islands from `src/islands/` (index → `WorkManager.svelte`, fun → `FunManager.svelte`).
- Shared shell: `src/layouts/BaseLayout.astro`. CSS: `src/styles/global.css`, `case-study.css`, `border-beam.css`, plus per-page `src/styles/pages/{work,about,career}.css` (`work.css` styles the index page).
- Public static files live under `public/`; deployed paths omit `public/` (`public/Assets/x` → `/Assets/x`).
- Design intent: Apple-like polish, cohesive across pages, desktop-first with graceful mobile reduction.

## Commands
```sh
npm ci
npm run dev        # astro dev
npm run build      # astro build → dist/
npx astro check    # typecheck; @astrojs/check installed but has no npm script
python3 validate.py
```
- No test suite or linter is configured; `astro check` + `validate.py` are the verification steps.
- `astro check` currently reports 1 pre-existing error in `netlify/functions/deezer-artist.ts` (handler headers union type); treat new errors elsewhere as regressions.
- `validate.py` reads `dist/*.html`; run `npm run build` first. Exits 1 only for broken local links; missing alt text in `cs-*.html` is warning-only.
- Preview via the dev server, never `file://` — case-study overlays and Deezer/weather fetches break from files.

## Runtime wiring
- `BaseLayout.astro` owns SEO, structured data, nav, mobile menu, CV picker, scroll-to-top, and the theme bootstrap — inline in `<head>` before paint; do not move it into deferred/client code.
- `CvPicker.astro` is a native `popover="auto"` (`#cvPicker`) toggled via Invoker Commands (`commandfor="cvPicker"` in `Nav.astro`/`MobileMenu.astro`) plus inline JS in BaseLayout — keep IDs/attributes in sync.
- Case studies: cards in `index.astro` are registered in `WorkManager.svelte` (`register('card-callao', 'cs-callao')`); overlays lazy-fetch `public/<overlayId>.html`, so overlay ID must equal fragment filename.

## Netlify function
- `netlify/functions/deezer-artist.ts` proxies the Deezer API (artist search/lookup, albums). `FunManager.svelte` calls `/.netlify/functions/deezer-artist` — served only on Netlify / `netlify dev`; under plain `astro dev` those fetches fail gracefully (missing artist images/albums locally is expected).

## Data/content
- Fun page data: `src/data/{travel,music,games,location}.ts`; UI in `FunManager.svelte`.
- Code referencing `/Assets/...` builds URLs from `import.meta.env.BASE_URL` (`music.ts`, `games.ts`, `FunManager.svelte`) — don't hardcode `/Assets/...` in TS/Svelte (breaks the GitHub Pages `/portfolio/` base).
- Travel photos are inferred from `photoCount`; files must exist as `/Assets/Images/Travel/<folder>/<N>.webp`, starting at `1`.
- When changing LQA/certification lists, keep visible counts in sync; `/add-lqa-project` and `/add-certification` document exact rules.

## Build/deploy quirks
- `astro.config.mjs` sets `base: '/portfolio/'` only when `GITHUB_ACTIONS=true`; local/Netlify base is `/`.
- GitHub Pages workflow (`.github/workflows/deploy-pages.yml`) triggers on push to `test`: Node 24, `npm ci`, `npm run build`, deploys `dist`.
- Merge to `main` via `scripts/safe-merge-test-to-main.sh` (excludes all `.md` files).
- `public/_headers` (Netlify) and `public/htaccess` (Apache) both define cache/security headers; update both when asset naming or cache policy changes.

## Markdown/local docs
- `.gitignore` ignores all `*.md` except `README.md`; `AGENTS.md`, `OPTIMIZATIONS.md`, and command docs are local-only.
- `OPTIMIZATIONS.md` and `.opencode/agents/{plan,build}.md` predate the Astro migration: they reference deleted files (`fun.html`, `styles.css`, `script.js`, `theme.js`) and claim "no build system". Use them for design principles only — not file paths or architecture.

## Modern Web Guidance
- Before HTML/CSS/client-JS changes:
```sh
npx modern-web-guidance@latest search "<topic>"
npx modern-web-guidance@latest retrieve "<guide-id>"
```
- Prefer Baseline 2025 / native CSS-HTML over JS with progressive fallbacks; record guide IDs as `MWG-2025/<topic>`.

## OpenCode files
- `.opencode/commands/` holds project workflows (`/clavix-*`, `/add-lqa-project`, `/add-certification`).
