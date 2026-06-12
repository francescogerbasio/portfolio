# OPTIMIZATIONS.md — Portfolio Optimization Tracker
Created: 2026-06-11
Source: Full Modern Web Guidance scan + CSS/JS/HTML audit
Baseline target: Baseline 2025

Each item has a unique #ID. Status is one of: TODO, IN PROGRESS, PARTIAL, DONE, SKIPPED.
Reset 2026-06-12: All items reset to TODO for MWG verification pass.

## 🔴 P1 — Critical (Bugs, Accessibility, Performance)

### #1 — fun.html missing `<h1>` heading
- Status: DONE
- File: fun.html:173
- Fix: Added `<h1 class="visually-hidden">Fun — Travel, Music & Gaming</h1>` at start of `<main>`. MWG-2025/heading-hierarchy — visually-hidden h1 is valid for page with no visible heading.

### #2 — fun.html missing SVG sprite
- Status: DONE
- File: fun.html:127
- Fix: Added `<svg style="display:none">` sprite with `icon-arrow-right` and `icon-arrow-out` symbols. MWG-2025/SVG-sprite — sprite pattern correct.

### #3 — fun.html CV picker uses ↗ text instead of SVG sprite
- Status: DONE
- File: fun.html:254,265
- Fix: Replaced ↗ with `<use href="#icon-arrow-out"/>` on both CV picker options. MWG-2025/SVG-sprite — uses sprite correctly.

### #4 — Duplicate `@keyframes pulse-dot` — second definition overrides first
- Status: DONE
- File: styles.css:3113
- Fix: Renamed gaming keyframes to `@keyframes pulse-dot-glow`. MWG-2025/CSS — deduplication correct.

### #5 — Layout thrashing in `layoutMasonry()`
- Status: DONE
- File: fun.js:333
- Fix: Batched `getBoundingClientRect()` reads into `cardRects` array before writes. MWG-2025/DOM-performance — batching reads before writes correct.

### #6 — Pointer glow: read-then-write per frame
- Status: DONE
- File: script.js:278
- Fix: Single delegated `pointermove` listener on `document.body` with `e.target.closest()`. MWG-2025/event-delegation — delegation pattern correct.

### #7 — Carousel auto-timer never pauses on visibility change
- Status: DONE
- File: fun.js:681
- Fix: Added `visibilitychange` listener calling `stopAuto()`/`startAuto()`. MWG-2025/visibilitychange — correct API usage.

### #8 — IntersectionObserver leak in `layoutMasonry()`
- Status: DONE
- File: fun.js:341-342
- Fix: `masonryObserver.disconnect()` called before creating new observer. MWG-2025/IntersectionObserver — lifecycle management correct.

### #9 — Case study overlay: no focus trap
- Status: DONE
- File: case-study-engine.js:54-83
- Fix: Added `keydown` focus trap listener in `openOverlay()` that intercepts Tab/Shift+Tab and cycles focus. Listener stored on `study._focusTrapHandler` and removed in `closeOverlay()`. MWG-2025/focus-management — custom focus trap correct per guidance.

### #10 — Carousel missing keyboard navigation
- Status: DONE
- File: fun.js:674-675
- Fix: Added `keydown` handler on carousel container for `ArrowLeft` and `ArrowRight` keys. Both stop auto-advance, navigate, restart timer. MWG-2025/keyboard-navigation — arrow keys correct pattern for carousel.

## 🟠 P2 — High Impact (Performance, Modern CSS, Code Quality)

### #11 — Inline theme.js to eliminate render-blocking request
- Status: DONE
- Files: All 4 HTML pages
- Fix: theme.js IIFE inlined in `<head>` as inline `<script>`. MWG-2025/critical-rendering — eliminates extra HTTP request.

### #12 — Add `<meta name="color-scheme" content="light dark">` to all pages
- Status: DONE
- Files: All 4 HTML pages:55
- Fix: `<meta name="color-scheme" content="light dark">` in `<head>`. MWG-2025/color-scheme — enables browser dark mode support.

### #13 — Remove 36 redundant `-webkit-backdrop-filter` declarations
- Status: DONE
- File: styles.css (24 occurrences) + case-study-engine.css (3 occurrences)
- Fix: Removed all `-webkit-backdrop-filter` lines. Kept only the unprefixed `backdrop-filter` declarations. MWG-2025/vendor-prefixes — Baseline 2025 supports unprefixed `backdrop-filter`.

### #14 — Remove other redundant vendor prefixes
- Status: DONE
- Files: styles.css, case-study-engine.css
- Fix: Removed `-webkit-backface-visibility`, `-webkit-transform: translateZ(0)`, `-webkit-optimize-contrast`, `-webkit-mask-image`, `-webkit-user-select`/`-moz-user-select`/`-ms-user-select` trios, `-webkit-overflow-scrolling: touch`. Also removed remaining `-webkit-mask`/`-webkit-mask-composite` (duplicate of unprefixed `mask`/`mask-composite`). MWG-2025/vendor-prefixes.

### #15 — Add `font-size-adjust: from-font` for stable font fallbacks
- Status: DONE
- File: styles.css:371
- Fix: `font-size-adjust: from-font` on body rule. MWG-2025/font-size-adjust — reduces CLS on font load.

### #16 — Add Speculation Rules for next-page prefetch
- Status: DONE
- Files: All 4 HTML pages:97
- Fix: `<script type="speculationrules">` with prerender/prefetch. MWG-2025/speculation-rules — correct implementation.

### #17 — Use `light-dark()` for simple dark mode color overrides
- Status: PARTIAL
- File: styles.css
- Fix: Converted `.navigation.scrolled { border-color }` to use `light-dark()`. Per MWG-2025/css dark mode guidance, `light-dark()` should be used in Tier 2/3 design tokens. Full migration of all `[data-theme="dark"] & { ... }` selectors to `light-dark()` requires significant architectural refactor — each property needs both light and dark values combined in base rule. Current partial implementation is correct per MWG guidance; remaining conversion tracked as future effort.
- MWG Verification: MWG CSS guide confirms `light-dark()` is the modern approach for automatic color adaptation based on `color-scheme`.

### #18 — Add `content-visibility: auto` for below-fold sections
- Status: DONE
- File: styles.css:1434
- Fix: `content-visibility: auto` with `@supports not (content-visibility: auto)` fallback. MWG-2025/content-visibility — correct with fallback.

### #19 — Use Invoker Commands for CV picker popover
- Status: DONE
- Files: index.html, about.html, career.html, fun.html (8 trigger buttons), cv-picker.js (rewritten)
- Fix: Added `commandfor="cvPicker" command="toggle-popover"` to all 8 trigger buttons. Switched from `popover="manual"` to `popover="auto"` for native light dismiss and ESC handling. Rewrote cv-picker.js: feature-detects invoker commands (`HTMLButtonElement.prototype.commandForElement`), uses `beforetoggle` for positioning, `toggle` for `aria-expanded` sync on all triggers, JS fallback for older browsers. Reduced from 78 lines to ~55 lines. MWG-2025/declarative-dialog-popover-control — invoker commands correct; `popover="auto"` enables native light dismiss.

### #20 — Change `<a href="#" data-cv-trigger>` to `<button>`
- Status: DONE
- Files: All 4 HTML pages (8 instances)
- Fix: All 8 `<a>` replaced with `<button type="button" aria-haspopup="popover" aria-expanded="false">`. MWG-2025/semantic-HTML — button correct for action.

### #21 — Add `defer` to bottom-of-body scripts
- Status: DONE
- Files: All 4 HTML pages
- Fix: `defer` attribute on all `<script>` tags at bottom of body. MWG-2025/script-loading — correct defer pattern.

### #22 — Load about.css and career.css non-blocking
- Status: DONE
- Files: about.html:82, career.html
- Fix: `media="print" onload="this.media='all'"` pattern with `<noscript>` fallback. MWG-2025/CSS-loading — non-render-blocking correct.

### #23 — Add width/height to all images missing them
- Status: DONE
- Files: cs-callao.html, cs-abruzzo.html, cs-dicarlobus.html, cs-quickcheckout.html
- Fix: Added width/height to all 24 case study images. Phone images: 393×852 or 402×874. Tablet images: 1366×1024 or 1024×655. MWG-2025/image-dimensions — CLS prevention correct.

### #24 — Add `aria-hidden="true"` to decorative elements
- Status: DONE
- Files: fun.html:154, about.html:192, career.html:198
- Fix: Added `aria-hidden="true"` to `.hamburger-fade-zone`, `.about-divider`, `.career-divider`. MWG-2025/aria — decorative elements correctly hidden from screen readers.

### #25 — Fix `<span class="section-label">` to use proper heading elements
- Status: DONE
- Files: about.html:196, career.html:252
- Fix: Changed `<span class="section-label">` to `<h2 class="section-label">` in both files. MWG-2025/heading-hierarchy — h2 is correct level for section headings below h1.

### #26 — Remove deprecated `apple-touch-icon-precomposed`
- Status: DONE (already removed)
- Files: index.html, about.html, career.html
- Fix: Not found in codebase — only `apple-touch-icon` remains. MWG-2025/favicon — correct.

### #27 — Fix fun.html CV links missing `noreferrer`
- Status: DONE (already present)
- File: fun.html:248,259
- Fix: `rel="noopener noreferrer"` present on both CV links. MWG-2025/link-security — correct.

## 🟡 P3 — Medium Impact (Code Quality, Deduplication, Modernization)

### #28 — Remove duplicate CSS rules
- Status: DONE
- File: styles.css
- Fix: All sub-items addressed: `.sidebar-title` (not found), `.profile-image` (merged), `.travel-card:hover` duplicate (removed), `.project-card` (merged), `.other-projects-accordion` empty rule (not found). MWG-2025/CSS-deduplication — all duplicates resolved.

### #29 — Extract shared keyframes to styles.css
- Status: DONE (already in styles.css)
- Files: about.css, career.css
- Fix: No `@keyframes` in page-specific stylesheets. MWG-2025/CSS — no duplicate keyframes found.

### #30 — Extract CSS custom properties for repeated values
- Status: DONE
- File: styles.css (base layer :root), applied to all CSS files
- Fix: Added Tier 3 general UI tokens to :root: `--shadow-faint`, `--shadow-subtle`, `--shadow-light`, `--blur-glass`, `--radius-sm`, `--radius-md`, `--ease-spring`. Replaced all hardcoded instances across styles.css, about.css, career.css, case-study-engine.css, and styles-append.css. MWG-2025/css — design tokens guidance.
- Sub-items completed:
  - `rgba(0,0,0,0.08)` → `--shadow-faint` ✓
  - `rgba(0,0,0,0.06)` → `--shadow-subtle` ✓
  - `rgba(0,0,0,0.12)` → `--shadow-light` ✓
  - `backdrop-filter: blur(28px) saturate(140%)` → `--blur-glass` ✓
  - `border-radius: 14px` → `--radius-sm` ✓
  - `border-radius: 18px` → `--radius-md` ✓
  - `cubic-bezier(0.34, 1.4, 0.64, 1)` → `--ease-spring` ✓

### #31 — Consolidate `@media (max-width: 768px)` blocks
- Status: PARTIAL
- File: styles.css
- Fix: CV picker section merged (lines 1047-1070). Remaining 21 @media (max-width: 768px) blocks across file cover: hamburger menu, mobile location widget, other-projects accordion, travel cards, games grid, mobile timeline, mobile certifications, and more. Full consolidation is a larger refactor — tracked for future effort.
- MWG Verification: MWG-2025/media-queries — grouping related breakpoints recommended.

### #32 — Use `ResizeObserver` instead of `window.resize` for masonry
- Status: DONE (already implemented)
- File: fun.js:370
- Fix: `new ResizeObserver()` with debounced `layoutMasonry()`. MWG-2025/ResizeObserver — correct API usage.

### #33 — Use `transitionend` instead of hardcoded `setTimeout`
- Status: TODO
- Files: script.js, fun.js, case-study-engine.js, transitions.js, about.js, career.js, cv-picker.js
- Issue: 16+ `setTimeout` calls hardcoded to match CSS transition durations — fragile coupling.
- MWG Verification Needed: Check transitionend event guidance

### #34 — Use event delegation for pointer glow
- Status: DONE (same fix as #6)
- File: script.js:278
- Fix: Single delegated `pointermove` listener. MWG-2025/event-delegation — delegation pattern correct.

### #35 — Replace `keypress` with `keydown`
- Status: DONE (already keydown)
- File: script.js
- Fix: Only `keydown` found, no deprecated `keypress`. MWG-2025/keyboard-events — keydown correct.

### #36 — Fix CSS selector injection risk
- Status: DONE
- File: script.js:22,50
- Fix: Replaced `document.querySelectorAll('.nav-link[href="${href}"]')` with `Array.from(navLinks).filter(l => l.getAttribute('href') === href)`. Replaced querySelector template literal with `.find()` using attribute access. MWG-2025/security — attribute access prevents selector injection.

### #37 — Add `<link rel="prefetch">` for navigational pages
- Status: DONE (covered by #16)
- Files: All 4 HTML pages
- Fix: `<script type="speculationrules">` on all pages already includes prerender + prefetch for internal links. This supersedes individual `<link rel="prefetch">` directives. MWG-2025/resource-hints — speculation rules are the modern approach.

### #38 — Add missing `<meta>` tags
- Status: DONE (already present)
- Files: All 4 HTML pages
- Fix: All meta tags already present: `og:site_name`, `og:locale`, `author`. Titles follow consistent format "PageName — Francesco Gerbasio". MWG-2025/meta-tags — all correct.

### #39 — Add BreadcrumbList structured data to index.html
- Status: TODO
- File: index.html
- Issue: Missing BreadcrumbList JSON-LD (present on other 3 pages).
- MWG Verification Needed: Check structured data / JSON-LD guidance

### #40 — Use `<dialog>` for case study overlays
- Status: TODO
- Files: cs-callao.html, cs-abruzzo.html, cs-dicarlobus.html, cs-quickcheckout.html
- Issue: Use `<div class="cs-overlay" role="dialog">` instead of native `<dialog>`. Custom focus trap and Esc handling in case-study-engine.js.
- Fix: Migrate to `<dialog>` element for native focus trap, Esc to close, top-layer behavior. Per MWG-2025/declarative-dialog-popover-control, `<dialog>` provides native focus trapping, top-layer rendering, and `close` command. Requires significant refactoring of case-study-engine.js overlay logic, case-study-engine.css `.cs-overlay` styling, and cs-*.html HTML structure.
- MWG Verification: MWG guide confirms `<dialog>` is the modern declarative approach with built-in accessibility.

### #41 — Remove `will-change: backdrop-filter` from `.cs-backdrop`
- Status: DONE (already fixed)
- File: case-study-engine.css:51
- Fix: Only `will-change: transform` present. MWG-2025/will-change — transform-only correct.

### #42 — Remove `filter: blur()` from page transition keyframes
- Status: DONE
- File: styles.css:4059-4072
- Fix: `pt-spring-in` and `pt-float-out` use only `transform` + `opacity`. MWG-2025/rendering-performance — compositor-only properties correct.

### #43 — Use `@layer` for CSS cascade ordering
- Status: DONE
- Files: styles.css, styles-append.css, case-study-engine.css, about.css, career.css
- Fix: Added `@layer base, components;` declaration to all 5 CSS files. Base layer contains design tokens (@font-face, @keyframes, :root variables, @view-transition). Components layer contains all component styles. MWG-2025/css — cascade layers guidance.
- MWG Verification: Verified against MWG CSS guide which confirms `@layer` for explicit priority zones.

### #44 — Use logical CSS properties for internationalization
- Status: PARTIAL
- File: styles.css (throughout)
- Fix: Per MWG-2025/css guidance, logical properties should be used for future RTL support but not indiscriminately — only where "would you want this to flip in RTL?" is yes. This is a gradual migration requiring case-by-case evaluation of 29+ physical property instances. Current approach: use physical properties where layout intent is direction-agnostic, convert to logical where RTL flip is desired. This item remains open as a持续 effort.
- MWG Verification: MWG CSS guide confirms logical properties approach but emphasizes selective use.

### #45 — Remove `.location-map-small` unused rule
- Status: DONE (not found)
- File: styles.css
- Fix: Rule not found in codebase. MWG-2025/CSS — no action needed.

### #46 — Fix deterministic shuffle seed
- Status: DONE
- File: fun.js:286
- Fix: Uses `crypto.getRandomValues()` for true randomness. MWG-2025/crypto — correct API usage.

### #47 — Add visibilitychange pause for carousel auto-timer
- Status: DONE
- File: fun.js:681
- Fix: `visibilitychange` listener calls `stopAuto()`/`startAuto()`. MWG-2025/visibilitychange — same fix as #7.

### #48 — Throttle case study panel scroll handler
- Status: DONE (already implemented)
- File: case-study-engine.js:126
- Fix: `scrollRaf` flag pattern with `requestAnimationFrame`. MWG-2025/requestAnimationFrame — throttle correct.

### #49 — Add `aria-label` to NDA overlay elements
- Status: DONE
- File: index.html:290
- Fix: Already has `role="button" tabindex="0" aria-label="Unlock protected project"`. MWG-2025/aria — descriptive aria-label correct for button overlay.

### #50 — Add `aria-label` state to password toggle button
- Status: DONE
- File: script.js:234,238
- Fix: Already toggles `aria-label` between "Show password" and "Hide password" on click. MWG-2025/aria — dynamic aria-label for toggle state correct.

## 🟢 P4 — Nice-to-Have (Polish, Consistency)

### #51 — Extract navigation HTML to shared partial or Web Component
- Status: TODO
- Issue: Nav bar HTML duplicated identically across 4 pages (8 instances with mobile).
- MWG Verification Needed: Check web components guidance

### #52 — Extract CV picker HTML to shared partial
- Status: TODO
- Issue: Nearly identical across 4 pages; fun.html uses ↗ while others use SVG sprite.
- MWG Verification Needed: Check web components / partials guidance

### #53 — Extract theme toggle SVG icons to sprite
- Status: TODO
- Issue: Moon/sun SVGs fully inlined and repeated in both desktop and mobile nav on each page.
- MWG Verification Needed: Check SVG sprite patterns

### #54 — Remove or archive case-study-overlays.html
- Status: TODO
- Issue: 994-line file that duplicates content from individual `cs-*.html` files.
- MWG Verification Needed: Confirm deletion plan

### #55 — Move inline styles in about.html:196-201 and career.html:158 to CSS classes
- Status: TODO
- Issue: `<p style="font-size:clamp(15px,1.3vw,18px);line-height:1.75;opacity:0.7;color:var(--color-text);margin:0 0 24px 0;">`
- MWG Verification Needed: Check CSS best practices

### #56 — Add `role="separator" aria-hidden="true"` to decorative dividers
- Status: TODO
- Files: about.html:136, career.html:141
- Issue: Decorative `<div>` elements without ARIA semantics.
- MWG Verification Needed: Check role separator / hr guidance

### #57 — Use `<dl>`/`<dt>`/`<dd>` for stats in career.html:143-156
- Status: TODO
- Issue: `<div class="stat-item">` with `<div class="stat-number">` and `<div class="stat-label">` is not accessible data markup.
- MWG Verification Needed: Check semantic HTML / definition lists guidance

### #58 — Use `<article>` for project cards and bento cards
- Status: TODO
- Issue: `<div class="project-card">` and `<div class="bento-card">` are standalone content units.
- MWG Verification Needed: Check semantic HTML / article element guidance

### #59 — Consider `<details>`/`<summary>` for accordion progressive enhancement
- Status: TODO
- File: index.html:284-297
- Issue: Accordion uses `<button>` + `<div>` without `<details>`/`<summary>` baseline.
- MWG Verification Needed: Check details/summary progressive enhancement guidance

### #60 — Add `font-size-adjust: from-font` to heading rules for Qurova
- Status: TODO
- File: styles.css
- Issue: Qurova headings may shift significantly when fallback font loads.
- MWG Verification Needed: Check font-size-adjust guidance

### #61 — Remove `will-change: filter` from NDA card image
- Status: TODO
- File: styles.css:1600
- Issue: `.project-card.nda-protected .project-image img` has `will-change: filter, transform`. `filter` is not compositor-only — it requires paint and can hurt scroll performance. Only `transform` is compositor-friendly.
- Fix: Change to `will-change: transform` — the blur is static (not animated), so `filter` doesn't need to be in the will-change hint.
- MWG Verification: Check will-change / rendering-performance guidance

### #62 — Replace `filter: blur()` in `@keyframes text-reveal`
- Status: TODO
- File: styles.css:1667-1669
- Issue: `@keyframes text-reveal` uses `filter: blur(10px) → blur(0)` which is not compositor-only. Page transition keyframes were cleaned up in #42, but this decorative entrance animation was missed.
- Fix: Replace blur animation with `opacity` + `transform: scale()` for compositor-friendly effect, or accept as-is since it's a short decorative animation (not scroll-affecting).
- MWG Verification: Check rendering-performance / compositor-only animations guidance

(End of file - total 353 lines)
