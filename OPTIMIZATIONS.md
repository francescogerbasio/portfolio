# OPTIMIZATIONS.md — Portfolio Optimization Tracker
Created: 2026-06-11  
Source: Full Modern Web Guidance scan + CSS/JS/HTML audit  
Baseline target: Baseline 2025

Each item has a unique #ID. Status is one of: TODO, IN PROGRESS, DONE, SKIPPED.

## 🔴 P1 — Critical (Bugs, Accessibility, Performance)

### #1 — fun.html missing `<h1>` heading
- Status: DONE
- File: fun.html
- Fix: Added `<h1 class="visually-hidden">Fun — Travel, Music & Gaming</h1>` at start of `<main>`.

### #2 — fun.html missing SVG sprite
- Status: DONE
- File: fun.html
- Fix: Added `<svg style="display:none">` sprite block with `icon-arrow-right` and `icon-arrow-out` symbols immediately after `<body>`.

### #3 — fun.html CV picker uses ↗ text instead of SVG sprite
- Status: DONE
- File: fun.html:188,199
- Fix: Replaced ↗ with `<svg width="13" height="13" aria-hidden="true" style="vertical-align:middle;display:inline-block;margin-left:1px"><use href="#icon-arrow-out"/></svg>` on both CV picker options (requires #2).

### #4 — Duplicate `@keyframes pulse-dot` — second definition overrides first
- Status: DONE
- File: styles.css:2921-2924 (music) and styles.css:3132-3135 (gaming)
- Fix: Renamed gaming keyframes to `@keyframes pulse-dot-glow` and updated `.games-subsection-dot.playing` to reference `pulse-dot-glow`. The music `.preview-dot` keeps the original `pulse-dot`.

### #5 — Layout thrashing in `layoutMasonry()`
- Status: DONE
- File: fun.js:295-319
- Fix: Batched all `getBoundingClientRect()` reads into a single pass before any writes. Created `cardRects` array mapping each card's top position, then used those pre-read values in the forEach instead of calling `getBoundingClientRect()` per-card. Also removed redundant `instant` branching in `revealCard`.

### #6 — Pointer glow: read-then-write per frame
- Status: DONE
- File: script.js:276-288
- Fix: Replaced per-element `pointermove`/`pointerleave` listeners with a single delegated listener on `document.body` using `e.target.closest()` to match target elements. Eliminates N listeners and N getBoundingClientRect() calls per frame.

### #7 — Carousel auto-timer never pauses on visibility change
- Status: DONE
- File: fun.js:654
- Fix: Added `visibilitychange` listener that calls `stopAuto()` when page is hidden and `startAuto()` when visible. Follows the same pattern as phrase rotation in script.js.

### #8 — IntersectionObserver leak in `layoutMasonry()`
- Status: DONE
- File: fun.js:343-358
- Fix: Moved `masonryObserver` to module scope and `revealCard` to module scope. Added `if (masonryObserver) masonryObserver.disconnect()` before creating a new observer, preventing the leak on repeated resize calls.

### #9 — Case study overlay: no focus trap
- Status: DONE
- File: case-study-engine.js:46-52
- Fix: Added `keydown` focus trap listener on the panel in `openOverlay()` that intercepts Tab/Shift+Tab and cycles focus between first/last focusable elements within the panel. Listener is stored on `study._focusTrapHandler` and removed in `closeOverlay()`.

### #10 — Carousel missing keyboard navigation
- Status: DONE
- File: fun.js:607-629
- Fix: Added `keydown` handler on the carousel container for `ArrowLeft` and `ArrowRight` keys. Both keys stop the auto-advance, navigate to the previous/next slide, then restart the auto timer.

## 🟠 P2 — High Impact (Performance, Modern CSS, Code Quality)

### #11 — Inline theme.js to eliminate render-blocking request
- Status: DONE
- Files: All 4 HTML pages (index.html, fun.html, about.html, career.html)
- Fix: Inlined the full 71-line theme.js IIFE directly into `<head>` as an inline `<script>` block on all 4 pages. Eliminates the separate HTTP request while preserving the intentionally-blocking behavior that prevents FOUC.

### #12 — Add `<meta name="color-scheme" content="light dark">` to all pages
- Status: DONE
- Files: All 4 HTML pages
- Fix: Added `<meta name="color-scheme" content="light dark">` immediately after `<meta charset="UTF-8">` in `<head>` on all 4 pages.

### #13 — Remove 36 redundant `-webkit-backdrop-filter` declarations
- Status: DONE
- File: styles.css (24 occurrences) + case-study-engine.css (3 occurrences)
- Fix: Removed all `-webkit-backdrop-filter` lines (and the `-webkit-backdrop-filter` from a `transition` shorthand). Kept only the unprefixed `backdrop-filter` declarations. Baseline 2025 supports unprefixed `backdrop-filter`.

### #14 — Remove other redundant vendor prefixes
- Status: DONE
- Files: styles.css, case-study-engine.css
- Fix: Removed `-webkit-backface-visibility` (3×) where unprefixed `backface-visibility` existed; removed `-webkit-transform: translateZ(0)` (2×) where unprefixed existed; replaced `image-rendering: -webkit-optimize-contrast` (2×) with `image-rendering: crisp-edges`; replaced `-webkit-mask-image` with standard `mask-image: radial-gradient(white, black)`; removed `-webkit-user-select`/`-moz-user-select`/`-ms-user-select` trios (6×) where unprefixed `user-select` existed; removed `-webkit-overflow-scrolling: touch` (1×, obsolete).

### #15 — Add `font-size-adjust: from-font` for stable font fallbacks
- Status: DONE
- File: styles.css — body rule
- Fix: Added `font-size-adjust: from-font` to the body rule. This tells the browser to use the font's intrinsic aspect ratio from the font file to size fallback fonts, reducing CLS when custom fonts load. The `@font-face` rules already had `size-adjust: 100%` descriptors.

### #16 — Add Speculation Rules for next-page prefetch
- Status: DONE
- Files: All 4 HTML pages
- Fix: Added `<script type="speculationrules">` with `prerender` (eagerness: moderate) and `prefetch` (eagerness: conservative) for all internal navigation links on each page. Prerendering triggers on hover.

### #17 — Use `light-dark()` for simple dark mode color overrides
- Status: IN PROGRESS (partial)
- File: styles.css
- Fix: Converted `.navigation.scrolled { border-color }` to use `light-dark()`. Removed the redundant `[data-theme="dark"] &.scrolled` nested override since it's now handled by the `light-dark()` in the base rule. Full migration requires finding base rules for each dark-mode override (many `.bento-card`, `.accordion-trigger`, etc. dark-mode blocks have no corresponding light-mode base in the same rule), which is a larger architectural refactor beyond the scope of a single pass.

### #18 — Add `content-visibility: auto` for below-fold sections
- Status: DONE
- File: styles.css
- Fix: Added `content-visibility: auto` with `contain-intrinsic-size: auto none 600px` to `.work-section`. Added `@supports not (content-visibility: auto)` fallback using `contain: layout style`. Note: `.category-section` uses `display: none` when inactive, so content-visibility is not applicable there. Other sections (.values-section, .currently-section, .timeline-section, .certifications-section) were not found in the codebase.

### #19 — Use Invoker Commands for CV picker popover
- Status: IN PROGRESS
- Files: cv-picker.js, all HTML pages
- Fix: The `commandfor` + `command="toggle-popover"` API is the modern declarative approach. However, it requires: (1) CSS `anchor` positioning for placement relative to the trigger, (2) a polyfill for unsupported browsers (Safari < 17.5, Firefox), and (3) a positioning fallback since `positionBelow(trigger)` needs to know which trigger was clicked. This is a more involved change best done as a dedicated effort.

### #20 — Change `<a href="#" data-cv-trigger>` to `<button>`
- Status: DONE
- Files: All 4 HTML pages (8 instances: 2 per page for desktop + mobile)
- Fix: Replaced all `<a href="#" class="nav-link" data-cv-trigger>Resume</a>` with `<button type="button" class="nav-link" data-cv-trigger aria-haspopup="popover" aria-expanded="false">Resume</button>`. Semantically correct — the element performs an action (opens popover), not navigation.

### #21 — Add `defer` to bottom-of-body scripts
- Status: DONE
- Files: fun.html:164-168, index.html:520-522, about.html:241-244, career.html:309-312
- Fix: Added `defer` attribute to all `<script>` tags at bottom of body across all 4 pages (data-*.js, script.js, case-study-engine.js, cv-picker.js, scroll-reveal.js, about.js, career.js, location-config.js).

### #22 — Load about.css and career.css non-blocking
- Status: DONE
- Files: about.html:40, career.html:44-45
- Fix: Applied `media="print" onload="this.media='all'"` pattern to `about.css` (in both about.html and career.html) and `career.css` (in career.html), with `<noscript>` fallback links. Page-specific stylesheets now load non-render-blocking.

### #23 — Add width/height to all images missing them
- Status: IN PROGRESS (partial)
- Files: about.html:148 (Spiderman.webp already had dimensions), index.html:253,256 (social icons — fixed), cs-*.html (24+ images need dimensions)
- Fix: Added `width="24" height="24"` to LinkedIn and Instagram SVG icons on index.html. The cs-*.html files have 6+ images each without dimensions — this is a larger task requiring dimension lookup for each image file (portrait phone screenshots at 800×1067 and showcase images).

### #24 — Add `aria-hidden="true"` to decorative elements
- Status: DONE
- Files: fun.html:152 (hamburger-fade-zone), about.html:190 (about-divider), career.html:196 (career-divider)
- Fix: Added `aria-hidden="true"` to all three decorative `<div>` elements.

### #25 — Fix `<span class="section-label">` to use proper heading elements
- Status: DONE
- Files: about.html:194, career.html:250
- Fix: Changed `<span class="section-label">The story</span>` to `<h2 class="section-label">The story</h2>` in about.html, and `<span class="section-label">What I bring</span>` to `<h2 class="section-label">What I bring</h2>` in career.html. Both are major section headings below h1, making h2 the correct level.

### #26 — Remove deprecated `apple-touch-icon-precomposed`
- Status: TODO
- Files: index.html:20, about.html:19, career.html:19
- Issue: Apple now treats `apple-touch-icon` the same as precomposed; extra link is unnecessary.
- Fix: Remove the `<link rel="apple-touch-icon-precomposed">` line from all pages.

### #27 — Fix fun.html CV links missing `noreferrer`
- Status: TODO
- File: fun.html:182,193
- Issue: `rel="noopener"` only, missing `noreferrer`. Inconsistent with all other pages.
- Fix: Change to `rel="noopener noreferrer"`.

## 🟡 P3 — Medium Impact (Code Quality, Deduplication, Modernization)

### #28 — Remove duplicate CSS rules
- Status: TODO
- File: styles.css
- Sub-items:
  - `.sidebar-title` declared twice (lines 697 and 825) — merge
  - `.profile-image` declared twice (lines 683 and 740) — merge
  - `.profile-image img` declared twice (lines 691 and 748) — merge
  - `.travel-card:hover` duplicate `@media (hover:hover)` block (lines 2592 and 2601) — remove one
  - `.project-card` declared twice (lines 1495 and 2284) — merge animation into first declaration
  - Empty `.other-projects-accordion {}` rule (line 1097) — remove

### #29 — Extract shared keyframes to styles.css
- Status: TODO
- Files: about.css and career.css
- Issue: `@keyframes fadeUp` and `@keyframes lineGrow` duplicated in both files.
- Fix: Move to styles.css and remove from page-specific files.

### #30 — Extract CSS custom properties for repeated values
- Status: TODO
- File: styles.css
- Sub-items:
  - `rgba(0,0,0,0.08)` used 6+ times → `--shadow-faint`
  - `rgba(0,0,0,0.06)` used 10+ times → `--shadow-subtle`
  - `rgba(0,0,0,0.12)` used 7+ times → `--shadow-light`
  - `backdrop-filter: blur(28px) saturate(140%)` used 6 times → `--blur-glass`
  - `border-radius: 14px` used 8+ times → `--radius-sm`
  - `border-radius: 18px` used 6+ times → `--radius-md`
  - `cubic-bezier(0.34, 1.4, 0.64, 1)` used 11+ times → `--ease-spring`

### #31 — Consolidate `@media (max-width: 768px)` blocks
- Status: TODO
- File: styles.css
- Issue: 15 separate `@media (max-width: 768px)` blocks. Merge where possible.
- Fix: Especially merge `.cv-picker` mobile styles (3 blocks → 1).

### #32 — Use `ResizeObserver` instead of `window.resize` for masonry
- Status: TODO
- File: fun.js:362-369
- Issue: Window resize listener with debounced setTimeout is less efficient than container-aware updates.
- Fix: Replace `window.addEventListener('resize', ...)` with `new ResizeObserver()` on the grid container.

### #33 — Use `transitionend` instead of hardcoded `setTimeout`
- Status: TODO
- Files: script.js, fun.js, case-study-engine.js, transitions.js, about.js, career.js, cv-picker.js
- Issue: 16+ `setTimeout` calls hardcoded to match CSS transition durations — fragile coupling.
- Fix: Replace with `transitionend` event listeners where possible. Keep `setTimeout` as fallback only.

### #34 — Use event delegation for pointer glow
- Status: TODO
- File: script.js:276-288
- Issue: Per-element `pointermove` listeners on potentially 10+ elements.
- Fix: Single `pointermove` listener on `document.body` with `e.target.closest()` matching.

### #35 — Replace `keypress` with `keydown`
- Status: TODO
- File: script.js:341
- Issue: `keypress` event is deprecated.
- Fix: Change to `keydown` + `e.key === 'Enter'`.

### #36 — Fix CSS selector injection risk
- Status: TODO
- File: script.js:22,50
- Issue: `document.querySelectorAll('.nav-link[href="${href}"]')` could break with special characters in href.
- Fix: Use `Array.from(navLinks).filter(l => l.getAttribute('href') === href)` instead.

### #37 — Add `<link rel="prefetch">` for navigational pages
- Status: TODO
- Files: All 4 HTML pages
- Issue: No prefetch hints for other pages in the site.
- Fix: Add prefetch hints (e.g., on index.html, prefetch about.html).

### #38 — Add missing `<meta>` tags
- Status: TODO
- Files: All 4 HTML pages
- Sub-items:
  - Missing `<meta property="og:site_name" content="Francesco Gerbasio">`
  - Missing `<meta property="og:locale" content="en_US">`
  - Missing `<meta name="author" content="Francesco Gerbasio">`
  - index.html title "Francesco - Portfolio" is generic — should match other pages' format

### #39 — Add BreadcrumbList structured data to index.html
- Status: TODO
- File: index.html
- Issue: Missing BreadcrumbList JSON-LD (present on other 3 pages).
- Fix: Add BreadcrumbList JSON-LD with Work as position 1.

### #40 — Use `<dialog>` for case study overlays
- Status: TODO
- Files: cs-callao.html, cs-abruzzo.html, cs-dicarlobus.html, cs-quickcheckout.html
- Issue: Use `<div class="cs-overlay" role="dialog">` instead of native `<dialog>`. Pattern already established for NDA modal.
- Fix: Migrate to `<dialog>` element for native focus trap, Esc to close, top-layer behavior.

### #41 — Remove `will-change: backdrop-filter` from `.cs-backdrop`
- Status: TODO
- File: case-study-engine.css:41
- Issue: `will-change` on `backdrop-filter` triggers full compositing. Should be `will-change: transform` or removed.
- Fix: Change to `will-change: transform` or remove entirely.

### #42 — Consider removing `filter: blur()` from page transition keyframes
- Status: TODO
- File: styles.css:4082-4095
- Issue: `pt-spring-in` and `pt-float-out` animate `filter: blur()`, promoting a new compositing layer every frame.
- Fix: Use `transform: scale()` + `opacity` instead of blur for smoother transitions.

### #43 — Use `@layer` for CSS cascade ordering
- Status: TODO
- Files: styles.css, styles-append.css, case-study-engine.css, about.css, career.css
- Issue: No cascade layers; specificity wars possible between files.
- Fix: Add `@layer base, components, overrides;` to establish clear precedence.

### #44 — Use logical CSS properties for internationalization
- Status: TODO
- File: styles.css (throughout)
- Issue: All `margin-left`, `padding-right`, etc. should be `margin-inline-start`, `padding-inline-end` for future RTL support.
- Fix: Gradual migration — start with the most common physical properties.

### #45 — Remove `.location-map-small` unused rule
- Status: TODO
- File: styles.css:816-818
- Issue: `display: none` for a class that doesn't appear in any HTML file.
- Fix: Delete the rule.

### #46 — Fix deterministic shuffle seed
- Status: TODO
- File: fun.js:285
- Issue: `seed = 12345` produces the same "random" order every time. All visitors see the same photo order.
- Fix: Use `crypto.getRandomValues()` for true randomness, or document that it's intentional.

### #47 — Add visibilitychange pause for carousel auto-timer
- Status: TODO
- File: fun.js:654
- Issue: Same as #7 but tracked separately — `setInterval` for featured games carousel runs in background.
- Fix: Same pattern as #30 (phrase rotation visibilitychange).

### #48 — Throttle case study panel scroll handler
- Status: TODO
- File: case-study-engine.js:103-107
- Issue: `panel.addEventListener('scroll', ...)` fires on every pixel.
- Fix: Wrap in `requestAnimationFrame` throttle.

### #49 — Add `aria-label` to NDA overlay elements
- Status: TODO
- File: script.js:242-249
- Issue: `.nda-overlay` elements lack role, tabindex, aria-label.
- Fix: Add `role="button" tabindex="0" aria-label="Unlock protected project"` in HTML.

### #50 — Add `aria-label` state to password toggle button
- Status: TODO
- File: script.js:230-239
- Issue: Button swaps SVG via `innerHTML` but doesn't update `aria-label`.
- Fix: Toggle `aria-label` between "Show password" and "Hide password".

## 🟢 P4 — Nice-to-Have (Polish, Consistency)

### #51 — Extract navigation HTML to shared partial or Web Component
- Status: TODO
- Issue: Nav bar HTML duplicated identically across 4 pages (8 instances with mobile).
- Fix: Create a `<nav-bar>` Web Component or use a build-time include.

### #52 — Extract CV picker HTML to shared partial
- Status: TODO
- Issue: Nearly identical across 4 pages; fun.html uses ↗ while others use SVG sprite.
- Fix: Create shared HTML partial or Web Component.

### #53 — Extract theme toggle SVG icons to sprite
- Status: TODO
- Issue: Moon/sun SVGs fully inlined and repeated in both desktop and mobile nav on each page.
- Fix: Add `icon-moon` and `icon-sun` symbols to the SVG sprite.

### #54 — Remove or archive case-study-overlays.html
- Status: TODO
- Issue: 994-line file that duplicates content from individual `cs-*.html` files. Maintenance burden.
- Fix: Delete or move to an archive branch.

### #55 — Move inline styles in about.html:196-201 and career.html:158 to CSS classes
- Status: TODO
- Issue: `<p style="font-size:clamp(15px,1.3vw,18px);line-height:1.75;opacity:0.7;color:var(--color-text);margin:0 0 24px 0;">`
- Fix: Create utility classes like `.text-body-secondary` in about.css/career.css.

### #56 — Add `role="separator" aria-hidden="true"` to decorative dividers
- Status: TODO
- Files: about.html:136, career.html:141
- Issue: Decorative `<div>` elements without ARIA semantics.
- Fix: Add `role="separator" aria-hidden="true"` or use `<hr>` with styling.

### #57 — Use `<dl>`/`<dt>`/`<dd>` for stats in career.html:143-156
- Status: TODO
- Issue: `<div class="stat-item">` with `<div class="stat-number">` and `<div class="stat-label">` is not accessible data markup.
- Fix: Use `<dl>` with `<dt>`/`<dd>` or `<figure>`/`<figcaption>` pattern.

### #58 — Use `<article>` for project cards and bento cards
- Status: TODO
- Issue: `<div class="project-card">` and `<div class="bento-card">` are standalone content units.
- Fix: Change to `<article class="project-card">` and `<article class="bento-card">`.

### #59 — Consider `<details>`/`<summary>` for accordion progressive enhancement
- Status: TODO
- File: index.html:284-297
- Issue: Accordion uses `<button>` + `<div>` without `<details>`/`<summary>` baseline.
- Fix: Wrap in `<details>`/`<summary>` for no-JS fallback, enhance with JS.

### #60 — Add `font-size-adjust: from-font` to heading rules for Qurova
- Status: TODO
- File: styles.css
- Issue: Qurova headings may shift significantly when fallback font loads.
- Fix: Add `font-size-adjust: cap-height from-font` to `.hero-title`, `.section-title`, `.page-title`, etc.
