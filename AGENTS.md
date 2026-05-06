# AGENTS.md

## Project shape
- This is a static multi-page portfolio (no package manager, no build system, no test/lint/typecheck config found).
- The look of the portfolio should always be cohesive.
- When adding or editing a feature, always design it and implement it as a Apple designer would, visually pleasing, polished and fast.
- Main pages: `index.html` (Work), `fun.html` (Fun), `about.html` (About).
- Shared global assets live under `Assets/`.

## Run locally (important)
- Use a local HTTP server; do **not** open pages via `file://`.
- Reason: the site uses `fetch()` for local files (`data-travel.js`, lazy `cs-*.html` overlays) and remote weather API calls, which break or behave inconsistently on `file://`.
- Minimal dev server command:
  - `python3 -m http.server 8000`
- Lightweight local verification:
  - `python3 validate.py`

## Runtime wiring and entrypoints
- `theme.js` is loaded first in `<head>` on all pages; it applies `data-theme` pre-paint and updates `meta[name="theme-color"]`.
- `transitions.js` intercepts internal `<a>` navigation for page transitions; avoid breaking its internal-link assumptions.
- `cv-picker.js` depends on both `#cvPicker` and `#cvPickerBackdrop` existing in page markup; if either is missing, picker logic no-ops.

## Page-specific behavior
- `index.html`:
  - Loads `script.js` + `case-study-engine.js`.
  - Case-study overlays are lazy-loaded from standalone fragments named `${overlayId}.html` (e.g. `cs-callao.html`).
  - Overlay activation requires explicit registration in inline script:
    - `CaseStudy.register('<card-id>', '<overlay-id>')`.
- `fun.html`:
  - Loads `data-games.js` then `fun.js`.
  - `fun.js` dynamically fetches and evaluates `data-travel.js` / `data-music.js`-style config objects; keep those files as executable JS defining expected globals.
- `about.html`:
  - Contains large inline CSS/JS blocks and a Cloudflare email decode script include.

## Data/content conventions that are easy to break
- Travel photos are inferred by count, not file discovery:
  - `data-travel.js` uses `photoCount` and assumes files exist as `Assets/Images/Travel/<Folder>/<n>.webp` starting at `1`.
- Case-study lazy loader expects exact filename match with overlay id:
  - `overlayId = "cs-foo"` -> file must be `cs-foo.html` at repo root.
- `script.js` weather widget falls back to Madrid if `myLocation` is undefined; `location-config.js` only affects pages where it is included.

## Deploy/hosting config
- `_headers` contains Netlify cache/header rules.
- `htaccess` contains Apache caching/compression rules.
- If changing asset naming/caching strategy, update both files consistently.

## Model Routing — task-type to preferred model
| Task Type | Preferred Models | When to pick |
|---|---|---|
| **Plan** (architecture, design decisions) | GLM-5.1 / Kimi K2.6 | High-level strategy, component design, data flow |
| **Build** (code generation, implementation) | Kimi K2.6 / DeepSeek V4 Pro | Generating new features, writing production code |
| **Refactor / Debug** (routine edits) | DeepSeek V4 Flash | Small fixes, CSS tweaks, routine changes |
| **Complex Debug** (deep investigation) | GLM-5.1 | Tracing runtime errors, concurrency, performance issues |
