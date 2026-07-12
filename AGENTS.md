# AGENTS.md

## Project shape
- Static multi-page portfolio. No build system, no package manager, no framework — vanilla HTML/CSS/JS only.
- Pages: `index.html` (Work), `fun.html` (Fun), `about.html` (About), `career.html` (Career).
- Global assets under `Assets/`. Hosted on Netlify; caching controlled by `_headers` and `htaccess` — keep both in sync when changing asset naming or cache strategy.
- Targets **Baseline 2025**.

## Markdown files are local-only
- `.gitignore` ignores all `*.md` except `README.md`. `AGENTS.md`, `OPTIMIZATIONS.md`, and other `.md` files are local working docs, not committed.
- `scripts/safe-merge-test-to-main.sh` also strips every `.md` from merges into `main`.
- Do not commit `.md` files or expect them to survive a clone.

## Run locally
```sh
python3 -m http.server 8000   # required — file:// breaks fetch() and the weather widget
python3 validate.py           # checks all *.html for broken local links + alt text on cs-*.html images
```
`validate.py` exits 1 only on broken links; missing alt text is a warning, not a failure.

## Modern Web Guidance (mandatory)
One-time setup (if the skill is not present): `npx modern-web-guidance@latest install`  
Update occasionally: `npx modern-web-guidance@latest update`

Before any CSS/HTML/JS change: search → retrieve → verify Baseline 2025 support → implement → add progressive-enhancement fallbacks.
```sh
npx modern-web-guidance@latest search "<topic>"      # e.g. "dialog element", "container queries"
npx modern-web-guidance@latest retrieve "<guide-id>"
```
Prefer modern CSS/HTML APIs over JS. Document guide IDs in commits: `MWG-2025/<topic>`.  
The full optimization audit (item IDs + DONE/TODO/PARTIAL status) lives in `OPTIMIZATIONS.md` (local, gitignored) — consult it before optimization work.

## Runtime wiring (easy to break)
- `theme.js` loads first in `<head>` (blocking) — applies `data-theme` pre-paint. Do not move or defer it.
- `transitions.js` (defer) intercepts internal `<a>` links for page transitions — do not break its internal-link assumptions.
- `cv-picker.js` requires `#cvPicker` + `#cvPickerBackdrop` in page markup; it no-ops if either is missing.
- Case studies: register in `index.html` via `CaseStudy.register('card-id', 'cs-id')`. The engine `fetch()`es `cs-id.html` (filename must match the overlay ID exactly) and injects it into a native `<dialog>`.

## Data files (fun.html)
- `data-travel.js` → `window.travelConfig`, `data-music.js` → `window.musicData`, `data-games.js` → `window.gamesData`. Each file must end with `window.X = X`.
- Load order before `fun.js`: `data-travel.js` → `data-music.js` → `data-games.js` → `fun.js`.
- Travel photos are inferred from `photoCount` only — files must exist as `Assets/Images/Travel/<folder>/<N>.webp`, starting at `1`.
- `location-config.js` → `window.myLocation`; the weather widget falls back to Madrid if undefined.

## Slash commands (`.opencode/commands/`)
- `/add-certification`, `/add-lqa-project` — edit `career.html` / `index.html` and keep counts in sync (see the command files for exact HTML + count rules).
- `/clavix-*` — requirements → PRD → plan → implement workflow.

## Agent files
- `.opencode/agents/plan.md` (read-only planning) and `.opencode/agents/build.md` (implementation) hold agent-specific detail and repeat the MWG workflow. OpenCode auto-selects via the Task tool; invoke manually with `@plan` / `@build`.
