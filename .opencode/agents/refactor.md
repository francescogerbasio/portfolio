---
description: Routine edits, CSS tweaks, and debugging using DeepSeek V4 Flash
mode: subagent
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

## Validation
Always end with `python3 validate.py`. Both link check and image alt check must pass. If either fails, fix before considering the task done.
