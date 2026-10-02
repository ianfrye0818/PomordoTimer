# dialog

2026-10-02. Strategy: transformation engine. Verdict: migrated.

## Changed

- `src/components/ui/dialog.tsx`: `@radix-ui/react-dialog` -> `@base-ui/react/dialog`; `Overlay` -> `Backdrop`, `Content` -> `Popup` (centered modal, no Positioner); all parts are function components with `data-slot`. `data-[state=open|closed]:` -> `data-open:` / `data-closed:`, keeping the tw-animate-css keyframes (Base UI waits for exit animations, same as the shadcn base registry). Removed `data-[state=open]:bg-accent data-[state=open]:text-muted-foreground` from the close button; Radix never set `data-state` on Close, so they were inert.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- `src/components/ui/FormDialog.tsx`: `onOpenChange={setOpen}` stays valid with the new `(open, eventDetails)` signature.
- `src/components/AlarmDialog.tsx`: fully commented out; not touched.

## Behavior changes

- `onOpenChange` gets a second `eventDetails` argument; outside-press/escape interception is now `eventDetails.reason` + `cancel()` (none used here).

## Verify by hand

- Open Settings, then press Escape, click the backdrop, and click the X; each closes with fade/zoom (Escape smoke-tested OK).
- Tab inside the open dialog: focus stays trapped; after closing, focus returns to the settings button.
