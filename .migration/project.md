# project

2026-10-02. Whole-project migration, Radix UI -> `@base-ui/react@1.8.0`, legacy `new-york` style (user chose to keep the existing look: own files rewired, classes preserved). Verdict: complete; 0 wrappers remain on Radix.

## Changed

- Pre-step: committed the in-progress TanStack Start / Vite 8 / Nitro upgrade on `tanstack-upgrade` (fixed a `.gitignore` line where `notes.md` and `.nitro` had been fused into `notes.md.nitro`), then branched `base-ui-migration`.
- Baseline before touching deps: `tsc --noEmit` pass, `pnpm build` pass.
- Dependency swap: added `@base-ui/react`; removed all 27 `@radix-ui/react-*` direct deps (most were never imported).
- Wrappers migrated, one commit each: button, label, form, checkbox, switch, tabs, dialog, dropdown-menu, select. `toast.tsx` deleted (unused).
- App-code sweep (`asChild`, `data-[state=`, `--radix-`, `onValueChange`, `onCheckedChange`, `onOpenChange`): `ThemeToggle.tsx` (asChild -> render), `FormInputItem.tsx` (FormControl render), `TimerCard.tsx` / `FullscreenTimer.tsx` (`data-active:`), `SettingsForm.tsx` (Select `items` + null guard).
- Final: `tsc --noEmit` pass, `pnpm build` pass, ESLint issue counts per touched file equal or lower than baseline (the repo has pre-existing lint debt, e.g. `reorderable.tsx`).
- Browser smoke test on `pnpm dev`: tabs, task form submit, checkbox, settings dialog open/Escape, switches + label association, select open/position/selection/labels. One bug found and fixed (select popup under dialog).

## Left alone

- `cmdk` and `vaul` stay in `package.json` (not radix; hard rule). They still pull `@radix-ui/react-dialog` and friends into the lockfile transitively. Neither is imported anywhere in `src/`, so `pnpm remove cmdk vaul` would drop the last radix code from node_modules.
- `sonner.tsx`, `card.tsx`, `input.tsx`, `reorderable.tsx` (dnd-kit), `ErrorMessage.tsx`, `use-mobile.tsx`: no radix.
- `tailwindcss-animate` is listed alongside `tw-animate-css`; unrelated, untouched.
- **FLAG (not fixed):** `components.json` still says `"style": "new-york"`, which the shadcn CLI resolves to the **radix** base. Future `shadcn add <x>` will deliver radix variants. Options: switch to a `base-*` style (new components arrive in that look) or hand-migrate new components.

## Behavior changes

- Tabs: manual keyboard activation (see tabs.md).
- Select: triggers need `items` to show labels (see select.md).
- Menu checkbox/radio items don't close on click (see dropdown-menu.md; unused).
- Checkbox/switch roots render `<span>` instead of `<button>`.

## Verify by hand

- One pass: switch Focus/To-Dos, add and tick a task, start/reset the timer and switch modes, open Settings, change every select and switch, Save, reopen to confirm persisted values, toggle light/dark and recheck switch/checkbox colors, test fullscreen mode tabs.
