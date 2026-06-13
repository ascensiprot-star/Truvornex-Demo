---
name: Truvornex Narrative
colors:
  surface: '#12131a'
  surface-dim: '#12131a'
  surface-bright: '#383940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#1a1b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a31'
  surface-container-highest: '#33343c'
  on-surface: '#e2e1eb'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e2e1eb'
  inverse-on-surface: '#2f3037'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c8c5ca'
  on-secondary: '#303033'
  secondary-container: '#47464a'
  on-secondary-container: '#b6b4b8'
  tertiary: '#ffffff'
  on-tertiary: '#32302d'
  tertiary-container: '#e7e1dd'
  on-tertiary-container: '#676460'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e4e1e6'
  secondary-fixed-dim: '#c8c5ca'
  on-secondary-fixed: '#1b1b1e'
  on-secondary-fixed-variant: '#47464a'
  tertiary-fixed: '#e7e1dd'
  tertiary-fixed-dim: '#cbc6c1'
  on-tertiary-fixed: '#1d1b19'
  on-tertiary-fixed-variant: '#494643'
  background: '#12131a'
  on-background: '#e2e1eb'
  surface-variant: '#33343c'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for a hyperlocal super-app that prioritizes utility through a high-end, editorial lens. The brand personality is authoritative, precise, and sophisticated—functioning more like a premium concierge than a standard marketplace. By stripping away all decorative color and non-functional flourishes, the system centers the user's focus entirely on the content: the texture of a restaurant dish, the clarity of a job listing, or the map of a local event.

The visual style is **Hyper-Premium Minimalism**. It relies on the interplay of deep blacks, pure grays, and expansive whitespace (or "blackspace" in dark mode) to create a sense of infinite depth and exclusivity. This monochromatic approach ensures that third-party imagery (food, products, profile photos) serves as the primary visual driver, while the interface remains a disciplined, invisible framework.

## Colors

The palette is strictly monochromatic to maintain a "luxury utility" aesthetic. 

- **Primary:** Used for the most important actions and high-contrast text. In dark mode, this is an off-white that prevents eye strain while remaining crisp.
- **Surface & Background:** Layers are defined by shifting between Zinc-950 and Zinc-900. Depth is communicated through these subtle tonal shifts rather than traditional shadows.
- **Functional Accents:** While the core system is monochromatic, functional colors (Success: Green, Error: Red) should be used sparingly and only for status communication, utilizing desaturated, high-clarity tones that respect the dark interface.

## Typography

Typography is the "hero" of this design system. It uses a triple-font strategy to differentiate roles:
1. **Hanken Grotesk** for headlines to provide a sharp, contemporary edge.
2. **Inter** for body copy to ensure maximum legibility across dense service listings.
3. **Geist** for technical labels and metadata, reinforcing the "super-app" precision.

Hierarchy is aggressive. Large, bold displays are paired with significantly smaller, monospaced-style labels to create a sophisticated, editorial contrast.

## Layout & Spacing

This design system employs a **4px base unit** spacing rhythm. 

- **Grid:** A 12-column fluid grid is used for desktop, collapsing to a 4-column grid for mobile.
- **Margins:** Mobile views utilize a strict 16px side margin. Desktop views use expanded 48px margins to maintain a sense of luxury and breathing room.
- **Density:** Service marketplace views (lists) should use "MD" (16px) spacing to maximize information density, while editorial or discovery pages (Events, Restaurants) should use "LG" and "XL" spacing to evoke a premium feel.

## Elevation & Depth

In this dark-mode-first system, elevation is conveyed through **Tonal Layering** and **Low-Contrast Outlines**. 

- **Level 0 (Background):** The base layer (#09090B).
- **Level 1 (Surface):** Elevated cards and containers (#18181B).
- **Borders:** Instead of shadows, use 1px solid strokes at `rgba(255,255,255,0.08)` to define boundaries. 
- **Shadows:** Use only for temporary floating elements (Modals, Popovers). These should be extremely diffused (24px+ blur) with low opacity (0.4) to maintain the minimal aesthetic without looking "heavy."

## Shapes

The shape language is structured to differentiate between interactive elements and structural containers:
- **Cards/Containers:** 12px radius provides a modern, approachable frame for content.
- **Buttons/Inputs:** 8px radius creates a more disciplined, technical appearance for touch targets.
- **Chips/Pills:** 24px (full-round) radius is reserved for status indicators, categories, and filters to distinguish them from primary actions.

## Components

### Buttons
- **Primary:** Solid #FAFAFA background with #09090B text. High contrast, 8px radius.
- **Secondary:** Transparent background with a 1px border (`rgba(255,255,255,0.08)`).
- **Ghost:** No border or background, purely typographic with an icon.

### Cards
- Use #18181B background.
- Apply a 1px border.
- Imagery should be full-bleed at the top or left, with text content padded by 16px.

### Inputs
- 8px radius, #18181B background, 1px border. 
- Focus state: Border color changes to #FAFAFA.
- Labels: Use `label-md` (Geist, Uppercase) positioned above the field.

### List Items
- Clean dividers (1px, `rgba(255,255,255,0.08)`).
- Use thin-stroke icons (Lucide style) with a consistent 20px box.

### Loading States
- Use **Skeletal Shimmer** animations.
- Gradients for skeletons should move from #18181B to #27272A.

### Micro-interactions
- All hover and active states must use a 200ms `cubic-bezier(0.4, 0, 0.2, 1)` transition for a snappy, high-performance feel.