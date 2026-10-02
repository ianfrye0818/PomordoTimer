# button

2026-10-02. Strategy: transformation engine on the user's own file (legacy `new-york` style, classification against stock new-york only). Verdict: migrated, look unchanged.

## Changed

- `src/components/ui/button.tsx`: radix `Slot` + `asChild` + `forwardRef` replaced by the real `@base-ui/react/button` primitive (`ButtonPrimitive`), which accepts `render`. All cva classes kept verbatim (your h-10 sizes, ring-offset focus style, `cursor-pointer` differ from stock new-york and were preserved). Props type is now `ButtonPrimitive.Props & VariantProps<typeof buttonVariants>`, still exported as `ButtonProps`. Added `data-slot="button"`.
- `package.json` / `pnpm-lock.yaml`: added `@base-ui/react@^1.8.0` in the same commit.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- No consumer used `<Button asChild>`, so no call sites changed.

## Behavior changes

- `asChild` no longer exists; use `render={<a href="..." />}` (add `nativeButton={false}` when rendering a non-button element).

## Verify by hand

- Tab to Start/Reset/settings buttons: focus ring still shows; Enter/Space activate.
- Save Settings with an invalid custom time: button is disabled and not clickable.
