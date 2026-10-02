# checkbox

2026-10-02. Strategy: transformation engine (1:1 primitive). Verdict: migrated.

## Changed

- `src/components/ui/checkbox.tsx`: `@radix-ui/react-checkbox` -> `@base-ui/react/checkbox`; `forwardRef` dropped; props `CheckboxPrimitive.Root.Props`. Classes: `data-[state=checked]:` -> `data-checked:`, `disabled:` -> `data-disabled:` (the Root now renders a `<span>`, so `:disabled` never matches). Added `data-slot`s.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- Call sites in `FocusSessionCard.tsx`, `TasksCard.tsx`, `FullscreenTimer.tsx` use `onCheckedChange={() => ...}`; compatible with the new `(checked, eventDetails)` signature. No `checked="indeterminate"` usage.

## Behavior changes

- Root element is `<span role="checkbox">` + hidden input instead of `<button>`.

## Verify by hand

- To-Dos: tick a task, confirm fill color and that it moves to the completed group (smoke-tested OK); Space toggles a focused checkbox.
- Focus tab / fullscreen: tick a focus-session task.
