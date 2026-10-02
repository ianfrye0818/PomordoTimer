# switch

2026-10-02. Strategy: transformation engine (1:1 primitive). Verdict: migrated.

## Changed

- `src/components/ui/switch.tsx`: `@radix-ui/react-switch` -> `@base-ui/react/switch`. `data-[state=checked|unchecked]:` -> `data-checked:` / `data-unchecked:` on Root and Thumb (including `dark:` variants); `disabled:` -> `data-disabled:`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- `SettingsForm.tsx` call sites `onCheckedChange={(checked) => ...}` are type-compatible.

## Behavior changes

- `id` now lands on Base UI's hidden `<input>`, not the visible root; `<label htmlFor>` still toggles it (verified in browser).

## Verify by hand

- Settings: toggle both switches by clicking the track and the label; thumb slides and colors swap in light and dark themes.
