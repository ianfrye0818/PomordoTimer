# dropdown-menu

2026-10-02. Strategy: transformation engine (radix DropdownMenu -> Base UI Menu). Verdict: migrated; type-checked but not reachable in the running UI.

## Changed

- `src/components/ui/dropdown-menu.tsx`: `@radix-ui/react-dropdown-menu` -> `Menu` from `@base-ui/react/menu`. `Content` -> `Portal > Positioner > Popup` (`align`/`alignOffset`/`side`/`sideOffset` declared, destructured, and forwarded to Positioner; `sideOffset` default 4 kept; Positioner `isolate z-50 outline-none`). `Label` -> `GroupLabel`, `ItemIndicator` -> `CheckboxItemIndicator` / `RadioItemIndicator`, `Sub`/`SubTrigger` -> `SubmenuRoot`/`SubmenuTrigger` (open marker `data-popup-open:`). `SubContent` now composes `DropdownMenuContent` with submenu defaults `align="start" alignOffset={-3} side="right" sideOffset={0}`. Vars: `--radix-dropdown-menu-content-available-height` -> `--available-height`, `...-transform-origin` -> `--transform-origin`.
- `src/components/ui/ThemeToggle.tsx:17`: `<DropdownMenuTrigger asChild><Button/></DropdownMenuTrigger>` -> `<DropdownMenuTrigger render={<Button variant="outline" size="icon" />}>`.
- Leftover scan: `grep -n "radix-ui\|@radix-ui"` on this component's files is clean.

## Left alone

- `ThemeToggle` isn't rendered anywhere (theme is chosen in Settings), so the menu was type-checked but not clicked through.

## Behavior changes

- `DropdownMenuCheckboxItem` / `RadioItem` no longer close the menu on click (Base UI `closeOnClick` defaults false for those). Plain `Item` still closes. Not patched; none are used.
- SubContent now inherits Content's `overflow-y-auto` + `max-h-(--available-height)` (was `overflow-hidden`, no max height).

## Verify by hand

- If you mount `ThemeToggle`: open with click and with Enter, arrow through items, type "D" to jump to Dark, Escape returns focus to the button, menu aligns to the button's end edge.
