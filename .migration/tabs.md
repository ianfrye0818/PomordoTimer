# tabs

2026-10-02. Strategy: transformation engine. Verdict: migrated, with app-code class sweep.

## Changed

- `src/components/ui/tabs.tsx`: `@radix-ui/react-tabs` -> `@base-ui/react/tabs`; `Trigger` -> `Tab`, `Content` -> `Panel`; `data-[state=active]:` -> `data-active:`; added `aria-disabled:` alongside `disabled:`. `Tabs` is now a function with `data-slot` instead of a bare re-export.
- `src/components/TimerCard.tsx:82,92,102` and `src/components/FullscreenTimer.tsx:135,145,155`: mode-tab colors `data-[state=active]:bg-*` -> `data-active:bg-*`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- `onValueChange={(value) => timer.setMode(value as Mode)}` still type-checks (value is now `any`).

## Behavior changes

- **Keyboard activation is now manual**: Radix activated a tab when arrow keys focused it; Base UI only moves focus, and Enter/Space activates. Not patched (per skill policy). To restore Radix behavior add `activateOnFocus` to `TabsList`.

## Verify by hand

- Click Focus/To-Dos and Work/Short Break/Long Break; active styling and the green/rose/pink mode colors show (smoke-tested OK).
- Arrow-key between mode tabs and press Enter; decide whether you want `activateOnFocus`.
