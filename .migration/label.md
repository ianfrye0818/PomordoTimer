# label

2026-10-02. Strategy: transformation engine (Base UI has no Label primitive -> native `<label>`). Verdict: migrated.

## Changed

- `src/components/ui/label.tsx`: `@radix-ui/react-label` replaced by a native `<label data-slot="label">`; cva classes unchanged; `forwardRef` dropped (React 19 passes `ref` as a prop).
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- Consumers (`SettingsForm.tsx`, `form.tsx`) unchanged; `htmlFor` works natively.

## Behavior changes

- Radix Label prevented text selection on double-click; a native label does not.
- `peer-disabled:` only matches native disabled inputs that precede the label. Base UI switch/checkbox Roots are `<span>`s, so a Label used as their `peer` sibling won't dim (no current usage relies on this).

## Verify by hand

- Settings dialog: click the "Run Continuously" and "Enable Alarm" label text; the switch toggles (smoke-tested OK).
