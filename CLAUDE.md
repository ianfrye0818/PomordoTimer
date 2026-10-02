# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**.

```bash
pnpm dev          # vinxi dev server (binds 0.0.0.0)
pnpm build        # production build → .output/
pnpm start:local  # run the built server with .env.production
npx tsc --noEmit  # type-check (no script defined)
npx eslint .      # lint (@tanstack/eslint-config; no script defined)
npx prettier --write .  # format (no semicolons, single quotes, trailing commas)
pnpm dlx shadcn@latest add <component>  # add shadcn/ui components (per .cursorrules)
```

Notes:
- The README's "Getting Started" section mentions `pnpm test`, `pnpm lint`, `pnpm format`, and `pnpm check`, but **none of these scripts exist** in `package.json`, and there are no tests yet. Vitest + Testing Library + jsdom are installed as dev deps if you add tests (`npx vitest run path/to/file.test.tsx`).
- The `db:*` scripts reference Prisma, but Prisma is not installed and there is no schema; the app has no backend database.

## Architecture

TanStack Start app (React 19, SSR via vinxi, `node-server` preset) configured in `app.config.ts` with `appDirectory: 'src'`. Path alias `@/*` → `src/*`. Styling is Tailwind v4 (via `@tailwindcss/vite`, theme in `src/styles.css`) with shadcn/ui "new-york" components in `src/components/ui/`.

- **Routing**: file-based in `src/routes/`. `src/routeTree.gen.ts` is auto-generated and gitignored — don't edit it. `__root.tsx` renders the HTML document shell; the only real page is `routes/index.tsx`.
- **State**: all app state lives in a single React context, `TimerProvider` in `src/components/timer-provider.tsx`, consumed via `useTimer()`. It owns the timer countdown, mode transitions (work → short/long break based on `sessionsBeforeLongBreak`), settings, tasks, focus-session task IDs, and the `<audio>` element. Zustand is a dependency but is not used.
- **Persistence**: client-only `localStorage` (keys `pomodoro-tasks`, `pomodoro-settings`, `pomodoro-isAudioEnabled`, `pomodoro-focus-session`, theme under `vite-ui-theme`). Everything is loaded in a mount `useEffect`, since the page is SSR'd and `localStorage` is unavailable on the server — keep any new browser API access inside effects/handlers.
- **Task ordering invariant**: tasks have an explicit `order` field; every mutation (`addTask`, `removeTask`, `toggleTaskCompletion`, `updateTaskOrder`) re-normalizes so active tasks come first (0..n) followed by completed tasks. Only active tasks are drag-reorderable (dnd-kit, via `ui/reorderable.tsx`). Preserve this when adding task operations.
- **Focus session**: `focusSessionTasks` is a list of task IDs (not task objects) selected for the current session, shown in `FocusSessionCard`.
- **Audio on mobile**: `startTimer` plays the audio muted then pauses it to "unlock" playback under browser autoplay rules, so the bell can play when the timer ends. Don't remove this.
- **UI composition**: `PomodoroTimer` switches between `FullscreenTimer` and `MainTabs` (Focus tab: `FocusSessionCard` + `TimerCard`; To-Dos tab: `TasksCard`). Settings are edited in `SettingsForm` (react-hook-form + zod).

## Deployment

Pushing to the `production` branch triggers `.github/workflows/docker-build-push.yml`, which builds the `dockerfile` and pushes `ianfrye/pomodoro-timer` to Docker Hub. The container runs `pnpm start:prod` (`node /app/.output/server/index.mjs`) on port 3000. `build-and-push.sh` is a manual multi-arch alternative that reads `DOCKER_LOGIN`, `CONTAINER_NAME`, `VERSION` from `.env`. Day-to-day work goes through `dev` → `main` → `production` PRs.
