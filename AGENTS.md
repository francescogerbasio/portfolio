# AGENTS.md — Master

## Baseline target
This project's Baseline target is **Baseline 2025**.

## Modern Web Guidance
This project uses [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) for all web platform decisions.
- Search for guides: `npx modern-web-guidance@latest search "<query>"`
- Retrieve guide details: `npx modern-web-guidance@latest retrieve "<guide-id>"`
- Prefer modern CSS/HTML APIs over JavaScript solutions
- Provide progressive enhancement fallbacks for limited-availability features

## Project shape
- Static multi-page portfolio (no package manager, no build system).
- Pages: `index.html` (Work), `fun.html` (Fun), `about.html` (About).
- Global assets under `Assets/`.

## Run locally
```sh
python3 -m http.server 8000
python3 validate.py
```
Do **not** open via `file://` — `fetch()` and weather APIs break.

## Sub-agent files
Load the appropriate file for your task type:

| Task | File | Models |
|---|---|---|
| **Plan** | `.opencode/agents/plan.md` | GLM-5.1, Kimi K2.6 |
| **Build** | `.opencode/agents/build.md` | Kimi K2.6, DeepSeek V4 Pro |
| **Refactor / Debug** | `.opencode/agents/refactor.md` | DeepSeek V4 Flash, GLM-5.1 |

Use `@plan`, `@build`, or `@refactor` to manually invoke a subagent, or rely on the primary agent to auto-select via the Task tool.

## Session Progress (this session)

### #26 SVG sprite — COMPLETED
- **25 inline SVGs replaced** with `<use href="#icon-arrow-right">` / `<use href="#icon-arrow-out">` across all pages
- Sprite added to index.html (both `icon-arrow-right` + `icon-arrow-out`), about.html (both symbols), career.html (both symbols)
- Replaced: 8 card arrows in index.html, 1 LinkedIn button arrow in about.html, 7 cert links + 1 LinkedIn + 2 CV-picker arrows + 1 timeline year in career.html, 4 SVGs each in cs-callao/abruzzo/dicarlobus, 2 SVGs in cs-quickcheckout
- Kept (intentionally): moon/sun theme toggle icons, QuickCheckout back-arrow (upward), eye-open icon in index.html (all unique, non-reusable)

### #27 CSS nesting for dark mode — COMPLETED
- Replaced 17 standalone `[data-theme="dark"] .selector` rules with CSS nesting inside their parent selectors
- Groups: `.navigation` (scrolled + ::before), `.bento-card`, `.accordion-trigger`, `.project-list-item`, `.projects-list`, `.accordion-icon`, `.accordion-trigger.active .accordion-icon` (+ ::after), `.accordion-count`
- `@media (hover: hover)` block nested under `body::before`
- Net reduction: from 17 separate `[data-theme="dark"]` rules to ~12 nested groups

### #28 @media consolidation — COMPLETED
- Reduced `@media (max-width: 768px)` blocks from 18 to 14 (consolidated 4 CV picker blocks into 1)
- CV picker section: merged `.cv-picker-label`, `.cv-picker-options`, `.cv-picker-option`, `.cv-picker-option:hover`, `.cv-picker-arrow`, `.cv-picker:popover-open .cv-picker-option:hover` into single `@media (max-width: 768px)` block

### #29 Container queries — COMPLETED
- Added `container-type: inline-size` to: `.projects-grid`, `.artists-grid`, `.games-grid`, `.games-grid.small`
- Added `@container (max-width: 800px)` for `.projects-grid` single-column layout
- Added `@supports not (container-type: inline-size)` fallback for `@media (max-width: 1200px)` for `.projects-grid`
- Added `@container (max-width: 320px)` for `.artists-grid` mobile layout
- Added `@supports not (container-type: inline-size)` fallback for `@media (max-width: 600px)` artists-grid
- Added `@supports not (container-type: inline-size)` fallback for `@media (max-width: 768px)` games-grid
- Added `@container (max-width: 500px)` for `.games-grid` (3-column at tablet)
- Added `@container (max-width: 300px)` for `.games-grid.small` (2-column at small tablet)
- Added `@supports not (container-type: inline-size)` + `@container (max-width: 320px)` for `.games-grid` + `.games-grid.small` at 600px breakpoint

### #30 visibilitychange — COMPLETED
- Refactored `setInterval(rotatePhrase, 5000)` in script.js to be pause/resume capable
- Added `visibilitychange` listener: pauses interval when `document.hidden`, resumes when visible
- Wrapped initial start in `if (!document.hidden)` check
- Created `startPhraseRotation()` and `stopPhraseRotation()` helper functions
