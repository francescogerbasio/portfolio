# AGENTS.md

## Project shape
- Astro 5 static portfolio with Svelte islands. Entry pages: `src/pages/index.astro`, `about.astro`, `career.astro`, `fun.astro`.
- Shared shell lives in `src/layouts/BaseLayout.astro`; global CSS in `src/styles/global.css`; page CSS in `src/styles/pages/`.
- Public static files live under `public/`; deployed paths omit `public/` (`public/Assets/x` becomes `/Assets/x`).

## Commands
```sh
npm ci
npm run dev
npm run build
python3 validate.py
```
- `validate.py` reads `dist/*.html`; run `npm run build` first.
- `validate.py` exits 1 only for broken local links; missing alt text in `dist/cs-*.html` is a warning.
- Local preview must use Astro/dev server, not `file://`; fetch-based case studies and widgets break from files.

## Runtime wiring
- `BaseLayout.astro` owns SEO, structured data, nav, mobile menu, CV picker, scroll-to-top, theme bootstrap, view-transition setup.
- Theme bootstrap is inline in `<head>` before paint; do not move it into deferred/client code.
- `CvPicker.astro` markup must stay compatible with its Svelte/client handlers: `#cvPicker` and `#cvPickerBackdrop`.
- Case-study cards in `src/pages/index.astro` lazy-load fragments from `public/cs-*.html`; overlay ID and filename must match (`cs-foo` → `cs-foo.html`).

## Data/content
- Fun page data lives in `src/data/travel.ts`, `music.ts`, `games.ts`, `location.ts`; UI is `src/islands/FunManager.svelte`.
- Travel photos are inferred from `photoCount`; files must exist as `/Assets/Images/Travel/<folder>/<N>.webp`, starting at `1`.
- When changing LQA/certification lists, keep visible counts in sync; `/add-lqa-project` and `/add-certification` document exact rules.

## Build/deploy quirks
- `astro.config.mjs` sets `base` to `/portfolio/` only when `GITHUB_ACTIONS=true`; local/Netlify base is `/`.
- GitHub Pages workflow runs on branch `test`, Node `24`, `npm ci`, `npm run build`, deploys `dist`.
- `_headers` and `htaccess` both control cache/security headers; update both when asset naming or cache policy changes.

## Markdown/local docs
- `.gitignore` ignores all `*.md` except `README.md`; `AGENTS.md`, `OPTIMIZATIONS.md`, and command docs are local-only.
- `OPTIMIZATIONS.md` is the local audit source; consult before optimization work.

## Modern Web Guidance
- Before any HTML/CSS/client JS change:
```sh
npx modern-web-guidance@latest search "<topic>"
npx modern-web-guidance@latest retrieve "<guide-id>"
```
- Verify Baseline 2025, prefer native CSS/HTML over JS, include progressive fallbacks, record guide IDs as `MWG-2025/<topic>`.

## OpenCode files
- `.opencode/agents/plan.md` is read-only planning; `.opencode/agents/build.md` is implementation.
- `.opencode/commands/` contains project workflows (`/clavix-*`, `/add-lqa-project`, `/add-certification`).
