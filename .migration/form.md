# form

2026-10-02. Strategy: transformation engine. `form.tsx` is the react-hook-form wrapper; only its radix `Slot` and Label types were radix. Verdict: migrated, one call-site change.

## Changed

- `src/components/ui/form.tsx`: `FormControl` was radix `Slot` (always-asChild). It is now `useRender` + `mergeProps` from `@base-ui/react`, default tag `div`, accepting a `render` prop; it still injects `id`, `aria-describedby`, `aria-invalid`. `FormLabel` types now derive from the native `Label`.
- `src/components/ui/FormInputItem.tsx:66`: `<FormControl><div className="relative">...</div></FormControl>` -> `<FormControl render={<div className="relative" />}>...`. Rendered DOM is identical (verified in browser: `div.relative` carries `id=«r0»-form-item`, `aria-invalid=false`).
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- Pre-existing quirks kept as-is: contexts default to `{}` instead of `null`, so the "useFormField should be used within <FormField>" guard never fires; `FormControl` puts `id`/`aria-*` on the wrapper `div`, not the `<input>`. Both predate the migration.
- Did not convert to Base UI `Form`/`Field`/`Fieldset`; that would be a rewrite of form handling, not a radix swap.

## Behavior changes

- `FormControl` no longer slots its child: children render *inside* a `div` unless you pass `render`. Only one call site existed and it was updated.

## Verify by hand

- To-Dos tab: add a task with Enter; submit an empty task and confirm the error message appears.
- Settings: enter an invalid "sessions before long break" value; the field shows its error.
