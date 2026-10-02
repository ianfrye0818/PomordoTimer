# toast

2026-10-02. Strategy: removal (user decision). Verdict: deleted, not migrated.

## Changed

- `src/components/ui/toast.tsx`: deleted. It wrapped `@radix-ui/react-toast` and had zero importers. Base UI Toast has a different, manager-based API, so porting unused code wasn't worth it.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean. (file removed)

## Left alone

- `src/components/ui/sonner.tsx`: sonner is not radix; untouched and remains the toast solution.

## Behavior changes

None.

## Verify by hand

- None; nothing referenced it.
