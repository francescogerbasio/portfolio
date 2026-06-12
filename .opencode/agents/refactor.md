---
description: Routine edits, CSS tweaks, and debugging using DeepSeek V4 Flash
mode: all
model: opencode-go/deepseek-v4-flash
temperature: 0.2
permission:
  edit: allow
  bash:
    "*": ask
    "python3 validate.py": allow
    "python3 -m http.server *": allow
    "git status": allow
    "git diff": allow
    "git log*": allow
    "ls *": allow
    "grep *": allow
---

# Refactor Agent — Fixes, Edits & Debugging

## Run locally + verify
```sh
python3 -m http.server 8000
python3 validate.py
```
Test on `localhost:8000`, never `file://`.

## Common pitfalls (check these first)
- **Data files missing `window.*` exports**: `data-travel.js`, `data-music.js`, `data-games.js` must each have `window.X = X` after the variable definition. Without it, `fun.js` can't find the data.
- **`file://` causes silent failures**: `fetch()` and weather API calls will fail. Always use the HTTP server.
- **Case-study overlay filename mismatch**: `overlayId = "cs-foo"` requires a `cs-foo.html` file at repo root.
- **Travel photo count mismatch**: `photoCount` must match actual files in `Assets/Images/Travel/<Folder>/`. Photos start at `1.webp`.
- **`_headers` / `htaccess` drift**: If you change asset paths or caching, update both files.
- **`transitions.js` assumptions**: It intercepts all internal `<a>` links. External links, hash-only links, or dynamically added links may need careful handling.
- **`cv-picker.js` no-op**: The picker silently does nothing if `#cvPicker` or `#cvPickerBackdrop` are missing from the page.

## Runtime wiring (condensed)
- `theme.js` in `<head>` — pre-paint `data-theme` + `meta[name="theme-color"]`.
- `transitions.js` (defer) — page transitions on internal links.
- `cv-picker.js` — depends on two DOM elements; no-ops if missing.
- `fun.js` accesses data via `window.travelConfig`, `window.musicData`, `window.gamesData`.

## Code style for fixes
- No comments unless clarifying a subtle bug.
- Match existing patterns — indentation, naming, file structure.
- Prefer targeted fixes over restructuring.
- If reverting code, verify `window.*` exports are preserved in data files.

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

## Validation
Always end with `python3 validate.py`. Both link check and image alt check must pass. If either fails, fix before considering the task done.
