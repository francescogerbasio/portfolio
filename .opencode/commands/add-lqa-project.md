---
description: Add or remove LQA game projects from the work page accordion + update all related counts
agent: refactor
---

# Add LQA Project

Add or remove games from the "Other Projects I've Contributed To" accordion on the Work page (`index.html`), and keep all related counts in sync across the portfolio.

---

## Usage

| Command | What it does |
|---------|-------------|
| `/add-lqa-project` | Add one or more games to the accordion |
| `/add-lqa-project --remove` | Remove one or more games from the accordion |

---

## Mode: Add (default)

### Instructions for the agent

1. **Ask the user** for each game's details:
   - Game title (required)
   - Studio / Developer (required)
   - Year (required, 4-digit)
   - Link / URL (optional — if provided, it becomes the `href`; if missing, omit `href`)
   - Keep asking "any more?" until the user says "done"

2. **Read `index.html`** and locate the accordion section inside `projects-list` (between `<!-- Other Projects Accordion -->` and the closing `</section>`). Count existing entries.

3. **For each new game**, generate the HTML:
   ```html
   <a href="{URL}" target="_blank" class="project-list-item clickable">
       <span class="project-name">{TITLE}</span>
       <span class="project-divider">·</span>
       <span class="project-studio">{STUDIO}</span>
       <span class="project-year">{YEAR}</span>
   </a>
   ```
   If no URL is given, use `<a href="#"` instead.

4. **Insert each entry** in the correct position within `<div class="projects-list">`:
   - Sort by year descending (newest first)
   - Within the same year, sort alphabetically by game title (case-insensitive)
   - Parse existing entries to find the right insertion point

5. **Update the accordion count** in `index.html`:
   Find `<span class="accordion-count">(N)</span>` and replace N with the new total number of `<a>` items inside `.projects-list`.

6. **Update the career page stat** in `career.html`:
   - Count all featured LQA cards in `index.html` (look for `<div class="project-card featured-release-card` inside `<!-- LQA Section -->`)
   - Count all accordion items in `index.html` (the same N from step 5)
   - Total = featured + accordion
   - In `career.html`, find `<div class="stat-number">X+</div>` (the one for "Shipped titles across LQA & UX") and update X to the total

7. **Run validation**: `python3 validate.py`

8. **Commit and push** to the current branch with a message like:
   ```
   Add/update LQA project list: {comma-separated game titles}
   
   - Added {N} game(s) to the accordion
   - Updated accordion count and career stat
   ```

---

## Mode: Remove (`--remove`)

### Instructions for the agent

1. **Read `index.html`** and display the current accordion list as a numbered list to the user, showing:
   ```
   1. Elden Ring — FromSoftware (2026)
   2. The Seven Deadly Sins: Origin — Netmarble (2026)
   ...
   ```

2. **Ask the user** which game(s) to remove:
   - "Which game(s) would you like to remove? Provide numbers (e.g. `1,3,5`) or names."
   - Support: numbered indices, partial title matches (case-insensitive), or "all" to confirm removal of everything

3. **Remove the matching `<a>` elements** from the accordion in `index.html`. Strip the exact tag including its children.

4. **Update the accordion count** in `index.html` (same as step 5 in Add mode).

5. **Update the career page stat** in `career.html` (same as step 6 in Add mode).

6. **Run validation**: `python3 validate.py`

7. **Commit and push** with a message like:
   ```
   Remove LQA project(s): {comma-separated game titles}
   
   - Removed {N} game(s) from the accordion
   - Updated accordion count and career stat
   ```

---

## Count Helpers (for the agent)

### Featured LQA cards count
Located in `index.html` inside `<!-- LQA Section -->`. Count `<div class="project-card featured-release-card` or `<a class="project-card project-card-link featured-release-card` elements.

### Accordion items count
Located in `index.html` inside `<!-- Other Projects Accordion -->`. Count `<a class="project-list-item clickable` elements inside `.projects-list`.

### Stat update
In `career.html`, find: `<div class="stat-number">X+</div>` — it's the first `.stat-number` after `<div class="about-stats" id="statsRow">`.

---

## Edge Cases

- **Removing the last item**: The accordion should remain empty but don't remove the `<div class="projects-list">` container itself. Count should show `(0)`.
- **Featured cards**: The remove mode only handles accordion items. If the user asks to remove a game that's in the featured LQA cards section, tell them that featured cards must be removed manually.
- **No matching game**: If the user provides a name that doesn't match any accordion item, show the full numbered list and ask again.
- **No changes after validation fails**: If `python3 validate.py` fails, report the issue to the user and do NOT commit/push. Offer to fix the problem first.
- **Duplicate detection**: Before adding a game, check if the same title + studio combination already exists in the accordion. If it does, warn the user and skip the duplicate.
