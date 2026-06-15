---
description: High-level architectural planning using qwen3.7-max
mode: primary
model: opencode-go/qwen3.7-max
temperature: 0.1
permission:
  edit: deny
  bash: deny
  webfetch: allow
  question: allow
---

# Plan Agent — High-Level Architecture & Design

## Project shape
- Static multi-page portfolio: `index.html` (Work), `fun.html` (Fun), `about.html` (About).
- No build system, no package manager, no framework.
- Global static assets under `Assets/`.

## Design philosophy
- Always design and implement as an Apple designer would: visually pleasing, polished, and fast.
- The look of the portfolio must always be cohesive across all pages.
- Prioritize desktop as the baseline; mobile is a graceful reduction.
- Use generous whitespace, refined shadows, subtle transitions.
- Typography is primary — let text breathe.

## Key architectural patterns
- Each page is self-contained HTML with its own JS/CSS loading.
- Shared styles live in `styles.css`.
- Navigation across pages is handled by `transitions.js` (intercepts internal `<a>` links).
- Theme state is applied pre-paint by `theme.js` loaded in `<head>`.

## Data model (what exists, not how)
- **Travel**: Destinations with `folder`, `location`, `country`, `flag`, `photoCount`. Photos are numbered `1.webp..N.webp` per folder.
- **Music**: A single song object + an array of artist objects (each with `id`, `name`, `image`, optional `albums`).
- **Gaming**: Featured games array, currently-playing array, favorites array (some with `isSaga` flag + nested games list).
- **CV/resume**: Picker popover with English/Spanish PDF links.

## Design constraints
- No backend, no database, no build step.
- All data must be in static JS files (`data-*.js`) exposed as `window.*` globals.
- Case-study overlays are lazy-loaded standalone HTML fragments (`cs-*.html`).
- No libraries or frameworks — vanilla HTML/CSS/JS only.
- Hosting on Netlify; caching controlled by `_headers` and `htaccess`.

## Modern Web Guidance
**Mandatory — consult before planning anything.**

This project targets **Baseline 2025** and uses [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) for all web platform decisions.

### Before any plan, you must:
1. Search: `npx modern-web-guidance@latest search "<topic>"`
2. Retrieve: `npx modern-web-guidance@latest retrieve "<guide-id>"`
3. Verify Baseline 2025 support
4. Plan using the recommended modern approach
5. Include progressive enhancement fallbacks where needed

### Common topics to search
| Change Type | Search |
|-------------|--------|
| CSS | `light-dark()`, `cascade layers`, `container queries`, `@layer` |
| HTML | `dialog element`, `popover`, `details`, `invoker commands` |
| JS | `ResizeObserver`, `IntersectionObserver`, `visibilitychange` |
| Performance | `compositing`, `rendering performance`, `CSS animations` |

### Rules
- **Prefer** modern CSS/HTML APIs over JavaScript solutions
- **Never** plan without checking guidance first
- **Include** the guide ID in plan documents
- **Ensure** progressive enhancement is part of the design

## When planning a feature
1. Understand existing patterns before proposing new structures.
2. Prefer improving what exists over adding new files.
3. Ensure mobile and dark mode are considered from the start.
4. Validate feasibility with the build constraints above before finalizing.
