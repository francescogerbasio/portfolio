---
description: Code generation and feature implementation using Kimi K2.6 or DeepSeek V4 Pro
mode: primary
model: opencode-go/kimi-k2.6
temperature: 0.3
permission:
  edit: allow
  bash: allow
---

# Build Agent — Code Generation & Implementation

## Run locally (always)
```sh
python3 -m http.server 8000
python3 validate.py
```
Never open via `file://` — `fetch()` and weather APIs will break.

## Runtime wiring & entrypoints
- `theme.js` loaded first in `<head>` — applies `data-theme` pre-paint, updates `meta[name="theme-color"]`.
- `transitions.js` (defer) — intercepts internal `<a>` navigation for page transitions. Don't break its internal-link assumptions.
- `cv-picker.js` depends on `#cvPicker` and `#cvPickerBackdrop` existing in page markup. No-ops if missing.

## Page-specific behavior
### index.html
- Loads `script.js` + `case-study-engine.js`.
- Case-study overlays are lazy-loaded from standalone `cs-*.html` fragments.
- Activation requires explicit registration: `CaseStudy.register('<card-id>', '<overlay-id>')`.

### fun.html
- Scripts loaded in order: `data-games.js` → `fun.js`.
- `fun.js` accesses data via `window.travelConfig`, `window.musicData`, `window.gamesData`.
- Category buttons (Travel/Music/Gaming) toggle sections via `switchCategory()`.

### about.html
- Large inline CSS/JS blocks + a Cloudflare email decode script.

## Data/content conventions (easy to break)
- **Travel photos**: Inferred by `photoCount` only. Files must exist as `Assets/Images/Travel/<Folder>/<N>.webp` starting at `1`.
- **Case-study overlays**: Overlay ID must match filename exactly: `"cs-foo"` → file must be `cs-foo.html` at repo root.
- **Weather widget**: Falls back to Madrid if `myLocation` is undefined; `location-config.js` only affects pages where it's included.
- **Data files**: Must expose globals via `window.X = X` — `fun.js` uses `window.travelConfig`, `window.musicData`, `window.gamesData`.

## Code style
- No comments unless absolutely necessary for clarity.
- Mimic existing patterns in neighboring files.
- Never assume a library exists — check imports and usage first.
- Never expose or commit secrets/keys.
- No emojis unless the user explicitly requests them.

## Deploy/hosting config
- `_headers` and `htaccess` must be kept in sync when changing asset naming or caching strategy.

## Modern Web Guidance
**Mandatory — consult before implementing anything.**

This project targets **Baseline 2025** and uses [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) for all web platform decisions.

### Before any change, you must:
1. Search: `npx modern-web-guidance@latest search "<topic>"`
2. Retrieve: `npx modern-web-guidance@latest retrieve "<guide-id>"`
3. Verify Baseline 2025 support
4. Implement using the recommended modern approach
5. Add progressive enhancement fallbacks where needed

### Common topics to search
| Change Type | Search |
|-------------|--------|
| CSS | `light-dark()`, `cascade layers`, `container queries`, `@layer` |
| HTML | `dialog element`, `popover`, `details`, `invoker commands` |
| JS | `ResizeObserver`, `IntersectionObserver`, `visibilitychange` |
| Performance | `compositing`, `rendering performance`, `CSS animations` |

### Rules
- **Prefer** modern CSS/HTML APIs over JavaScript solutions
- **Never** implement without checking guidance first
- **Document** the guide ID in commit messages: `MWG-2025/css-layering`
- **Provide** fallbacks for limited browser support

## Before committing
1. Run `python3 validate.py` — link check and image alt check must pass.
2. Test on `localhost:8000`, not `file://`.
3. Verify dark mode doesn't break with new elements.
