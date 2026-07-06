---
description: Add or remove certifications from the career page + keep grid in sync
agent: refactor
---

# Add Certification

Add or remove certifications from the Certifications section on the Career page (`career.html`).

---

## Usage

| Command | What it does |
|---------|-------------|
| `/add-certification` | Add one or more certifications |
| `/add-certification --remove` | Remove one or more certifications |

---

## Mode: Add (default)

### Instructions for the agent

1. **Ask the user** for each certification's details:
   - Certification name (required)
   - Organization (required)
   - Year (required, 4-digit)
   - Credential URL (optional — external link or local PDF path)
   - Keep asking "any more?" until the user says "done"

2. **Read `career.html`** and locate the certifications grid inside `<div class="certifications-grid">` (inside `<!-- Certifications Section -->`). Count existing cards.

3. **For each new certification**, generate the HTML:
   ```html
   <div class="cert-card">
       <div class="cert-year">{YEAR}</div>
       <div class="cert-name">{NAME}</div>
       <div class="cert-org">{ORG}</div>
       <a class="cert-link" href="{URL}" target="_blank">View Credential <svg width="13" height="13" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="vertical-align:middle;display:inline-block;margin-left:1px;"><path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
   </div>
   ```
   If no URL is given, use `href="#"` and change the link text to **"View Certificate"**.
   If the URL starts with `Assets/` (local PDF), use **"View Certificate"** as the link text.

4. **Insert each card** at the top of `<div class="certifications-grid">`:
   - Newest additions go first — insert at the very beginning of the grid
   - Within the same year, newer additions go before older ones
   - Insert right after the opening `<div class="certifications-grid">` tag

5. **Run validation**: `python3 validate.py`

6. **Commit and push** to the current branch with a message like:
   ```
   Add certification(s): {comma-separated cert names}
   
   - Added {N} certification(s) to career page
   ```

---

## Mode: Remove (`--remove`)

### Instructions for the agent

1. **Read `career.html`** and display the current certifications as a numbered list to the user, showing:
   ```
   1. AI Fluency Framework & Foundations — Anthropic (2026)
   2. Claude 101 — Anthropic (2026)
   ...
   ```

2. **Ask the user** which certification(s) to remove:
   - "Which certification(s) would you like to remove? Provide numbers (e.g. `1,3,5`) or names."
   - Support: numbered indices, partial title matches (case-insensitive), or "all" to confirm removal of everything

3. **Remove the matching `<div class="cert-card">` elements** from the grid in `career.html`. Strip the exact tag including its children.

4. **Run validation**: `python3 validate.py`

5. **Commit and push** with a message like:
   ```
   Remove certification(s): {comma-separated cert names}
   
   - Removed {N} certification(s) from career page
   ```

---

## Edge Cases

- **Removing the last item**: The grid should remain empty but don't remove the `<div class="certifications-grid">` container itself.
- **No matching cert**: If the user provides a name that doesn't match any card, show the full numbered list and ask again.
- **No changes after validation fails**: If `python3 validate.py` fails, report the issue to the user and do NOT commit/push. Offer to fix the problem first.
- **Duplicate detection**: Before adding a certification, check if the same name + org combination already exists in the grid. If it does, warn the user and skip the duplicate.
- **Local PDF links**: If the user provides a path like `Assets/Certificates/MyCert.pdf`, use it as the `href` and change the link text to "View Certificate" instead of "View Credential".
- **No URL**: If no URL is provided, use `href="#"` and "View Certificate" as the link text.
