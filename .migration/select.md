# select

2026-10-02. Strategy: transformation engine, shapes cross-checked against the shadcn base registry. Verdict: migrated, with call-site changes and one fix found in browser testing.

## Changed

- `src/components/ui/select.tsx`: `@radix-ui/react-select` -> `@base-ui/react/select`. `Content` -> `Portal > Positioner (isolate z-50) > Popup > List`; radix `position="popper"` (your default) -> `alignItemWithTrigger={false}` default so the list still drops below the trigger. Kept the popper translate classes and trigger-width min width (`--radix-select-trigger-width` -> `--anchor-width`); dropped the `h-[var(--radix-select-trigger-height)]` viewport class (on a non-flex List it would clamp the list to 40px). `Label` -> `GroupLabel`, `ScrollUp/DownButton` -> `ScrollUp/DownArrow`, `Icon asChild` -> `render`, `ItemIndicator` wrapper span -> `render`. Classes: `placeholder:` -> `data-placeholder:`, `disabled:` -> `data-disabled:`, `data-[state=*]` -> `data-open`/`data-closed`; added `data-highlighted:` so keyboard highlight shows.
- Positioner `isolate z-50` (separate fix commit): without it the popup rendered *under* the settings dialog. Caught in the browser smoke test.
- `src/components/SettingsForm.tsx`: added `PRESET_ITEMS`, `THEME_ITEMS`, `UNIT_ITEMS` and passed `items` to all three `<Select>`s, because Base UI's `SelectValue` renders the raw value (`"light"`, `"5"`) unless given a label map. The duration select's `onValueChange` now guards `null` (signature widened to `string | null`).
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- Theme/unit `onValueChange` handlers use `as` casts, so they type-check with `string | null`; Base UI only emits `null` when clearing, which these selects never do.

## Behavior changes

- Any new `<Select>` must pass `items` (or a `SelectValue` render function) to show labels in the trigger.
- Typeahead and keyboard selection use Base UI's implementation; minor feel differences from Radix are possible.

## Verify by hand

- Settings: open Work/Short/Long break selects; the list appears above the dialog, under the trigger, at least trigger width, with the checkmark on the current value (smoke-tested OK).
- Pick "Custom...", then switch the unit select between Minutes/Seconds; the trigger shows labels, not raw values.
- Theme select: trigger reads "Light"/"Dark"/"System"; keyboard: Enter opens, arrows move, Enter selects.
