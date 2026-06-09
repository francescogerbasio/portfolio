# AGENTS.md — Master

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
| **Build** | `.opencode/agents/build.md` | MiniMax 2.7 |
| **Build-Codex** | `.opencode/agents/build-codex.md` | GPT-5.3 Codex (xhigh) |
| **Refactor / Debug** | `.opencode/agents/refactor.md` | DeepSeek V4 Flash, GLM-5.1 |

Use `@plan`, `@build`, `@build-codex`, or `@refactor` to manually invoke a subagent, or rely on the primary agent to auto-select via the Task tool.
