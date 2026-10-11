# AGENTS.md

## What this is

A static single-page React app (Vite + TypeScript + Tailwind v4) presenting a digital Quran with 114 surahs, an interactive tajwid guide, hadith collection, and hifz (memorization) training. No backend — all Quran data is local in `src/data/`. Audio is streamed from the `everyayah.com` CDN with a Web Audio API synthesizer fallback when offline.

## Commands

```bash
bun install          # install deps (Bun is the package manager — bun.lock is committed)
bun run dev          # dev server on port 3000 (HMR enabled)
bun run build        # production build → dist/
bun run preview      # preview production build
bun run lint         # typecheck only (tsc --noEmit) — NOT ESLint
bun run clean        # rm -rf dist server.js — Unix-only, will fail on Windows cmd/powershell
```

There is **no test framework** configured. Do not run `npm test` or assume tests exist.

## Architecture

- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`
- **Path alias:** `@/*` maps to `./*` (project root), not `src/`. Use `@/components/...`, `@/data/...`, etc.
- **Tabs/routing:** Client-side state in `App.tsx` (`activeTab` + `selectedSurahNumber`). No router library.
- **Themes:** Dark / light / sepia — toggled via CSS classes on `<html>`. Theme variables defined in `src/index.css` and synced in `App.tsx`.
- **State:** Local component state + `localStorage` for bookmarks (`quran_bookmarks` key). No global state library.
- **Audio:** `src/utils/audioEngine.ts` — singleton that loads MP3s from `everyayah.com/data/{subfolder}/{surah}{ayah}.mp3`. Falls back to a Web Audio API oscillator tone when the network request fails.
- **Download modal:** `src/utils/projectDownloader.ts` bundles the app into a standalone vanilla-JS ZIP using JSZip.

## Gotchas

- **`quran-modern/` is a stale artifact.** It contains an old vanilla JS version referencing `css/`, `data/`, `js/` subdirectories that don't exist. The real app lives entirely in `src/`. Ignore this directory.
- **`server.js` doesn't exist.** The `clean` script references it, but it's not in the repo and no build step generates it. The reference is vestigial.
- **`@google/genai` is a server-side dependency.** The `GEMINI_API_KEY` env var is injected by the hosting platform (AI Studio / Cloud Run). It is not used in client-side code directly.
- **No CI, no pre-commit hooks, no ESLint config.** Type checking via `bun run lint` is the only automated quality gate.
- **Bun, not npm.** The repo has `bun.lock`. Use `bun install` / `bun run` for correct behavior.
