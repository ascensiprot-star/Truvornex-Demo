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
