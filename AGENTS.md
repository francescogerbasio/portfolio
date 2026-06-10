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
