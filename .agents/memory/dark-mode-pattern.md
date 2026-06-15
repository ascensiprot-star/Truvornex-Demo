---
name: Dark mode pattern
description: How to correctly apply dark/light theming — CSS vars only, never hardcoded Tailwind color classes
---

## Rule
Never use hardcoded Tailwind color classes like `text-zinc-900`, `bg-white`, `bg-zinc-100`, `text-zinc-600` etc. They are fixed colors that don't respond to the dark/light toggle.

## How to apply
- Use inline `style={{ color: 'var(--color-primary)' }}` or CSS variable utilities from index.css
- Key vars: `--color-primary` (text/headings), `--color-text` (body), `--color-text-muted`, `--color-text-subtle`, `--color-surface`, `--color-surface-high`, `--color-surface-low`, `--color-border`, `--color-border-strong`, `--color-on-primary`
- For prose/ReactMarkdown: add `.prose *` overrides in index.css @layer utilities using CSS vars
- For recharts tooltips/axes: pass `fill: 'var(--color-text-subtle)'` via tick prop style object

**Why:** Theme is toggled by adding/removing `light` class on `<html>` (ThemeContext). Tailwind dark: variant is NOT used — only CSS custom properties switch values.

## Global CSS safety nets in index.css (already in place — do not remove)
- `html.dark .text-zinc-{900→200}` → mapped to CSS vars (rescues bare zinc text classes)
- `html.dark .card-premium .bg-zinc-{100,50}` / `.bg-white` → `var(--color-surface-high)`
- `html.dark .bg-white.rounded-2xl`, `.bg-white.rounded-xl` → `var(--color-surface) !important` (standalone card containers)
- `html.dark .border-zinc-{100,200}.rounded-{2xl,xl}` → `var(--color-border) !important`

## Active tab / selected button pattern
```jsx
style={{
  backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
  color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-muted)',
}}
```
**Never** use `bg-zinc-900 text-white` for active states — near-black bg is invisible on dark surface.

## Icon fill pattern
Tailwind `fill-zinc-*` is NOT covered by the global text override. For filled SVG icons (stars etc.) always use:
```jsx
style={{ fill: 'var(--color-primary)', color: 'var(--color-primary)' }}
```

## OwnerAdmin exception
OwnerAdmin.jsx uses intentional zinc-800/900 dark-first admin panel — do not change those files' tab/input styles.
