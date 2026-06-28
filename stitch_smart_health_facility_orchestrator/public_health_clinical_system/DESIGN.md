---
name: Public Health Clinical System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fb'
  surface-container: '#ecedf6'
  surface-container-high: '#e7e8f0'
  surface-container-highest: '#e1e2ea'
  on-surface: '#191c21'
  on-surface-variant: '#424752'
  inverse-surface: '#2e3037'
  inverse-on-surface: '#eff0f8'
  outline: '#727783'
  outline-variant: '#c2c6d4'
  surface-tint: '#005db6'
  primary: '#00478d'
  on-primary: '#ffffff'
  primary-container: '#005eb8'
  on-primary-container: '#c8daff'
  inverse-primary: '#a9c7ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#45484a'
  on-tertiary: '#ffffff'
  tertiary-container: '#5d6062'
  on-tertiary-container: '#d8dadc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#191c21'
  surface-variant: '#e1e2ea'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-max: 1440px
  gutter: 16px
---

## Brand & Style
The design system is engineered for high-stakes public health administration, prioritizing utility, clarity, and institutional trust. The visual narrative is **Corporate / Modern** with a lean toward **Systematic Functionalism**. It avoids decorative flourishes to ensure that critical health data remains the focal point.

The personality is authoritative yet accessible, designed to evoke a sense of stability and precision. The interface utilizes a high "signal-to-noise" ratio, optimized for users who manage complex supply chains and facility metrics over extended shifts. The aesthetic is defined by rigid structural alignment, intentional whitespace to group related data, and a color-coded status language that enables rapid decision-making.

## Colors
The palette is rooted in clinical reliability. **Action Blue (#005EB8)** is reserved strictly for primary interactive elements and navigation to maintain a high affordance scent. 

- **Background Strategy:** The primary interface uses `#F8FAFC` to reduce the harshness of pure white while maintaining high contrast for text.
- **Semantic Logic:** Color is used as a functional data dimension. `Critical Red` is used for immediate shortages or emergencies, `Warning Amber` for preventative alerts, and `Stability Green` for confirmed healthy metrics.
- **Neutral Scales:** Grays are slightly blued (Slate) to maintain a cohesive professional tone and prevent the UI from feeling "muddy."

## Typography
This design system employs **Inter** for its exceptional legibility in dense data environments. The scale is meticulously balanced to handle multi-level hierarchies in administrative dashboards.

- **Data Tables:** Use `body-sm` for standard cell content to maximize information density.
- **Numerical Data:** For inventory counts or IDs, a monospaced alternative (JetBrains Mono) is recommended within tables to ensure vertical alignment of digits.
- **Headlines:** Keep tracking tight on larger sizes to maintain a modern, "compacted" professional look.
- **Multilingual Support:** The system ensures consistent line heights across different scripts to prevent layout shifting during language toggling.

## Layout & Spacing
The layout follows a **Fluid Grid** approach with a 12-column structure for desktop. 

- **Density:** To accommodate "data-rich" requirements, the system uses a 4px baseline grid. Padding in tables and list items is kept tight (`sm` for vertical, `md` for horizontal).
- **Facility vs. District Views:** 
  - **District Level:** High-level summaries using 4-column cards for KPIs.
  - **Facility Level:** Deep-dive 12-column data tables with horizontal scrolling for expansive data sets.
- **Breakpoints:** 
  - Desktop: 1024px+ (12 columns, 24px margins)
  - Tablet: 768px - 1023px (8 columns, 16px margins)
  - Mobile: <768px (4 columns, 12px margins, single-stack cards).

## Elevation & Depth
This design system utilizes **Tonal Layers** and **Low-contrast outlines** rather than heavy shadows. This maintains a flat, efficient aesthetic that feels like a professional tool rather than a consumer app.

- **Level 0 (Background):** #F8FAFC.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a 1px solid border (#E2E8F0).
- **Level 2 (Dropdowns/Modals):** Pure White with a subtle, 8px soft blur shadow (Opacity 5%, Neutral Tint) to provide focus without breaking the flat design language.
- **Interactions:** Hover states on rows and buttons use a slight darkening of the background rather than elevation "lift."

## Shapes
The shape language is **Soft (0.25rem)**. This subtle rounding provides a modern feel while maintaining a structured, efficient "grid" look.

- **Standard Elements:** Buttons, Input fields, and Tags use 4px (`rounded`).
- **Containers:** Large dashboard cards use 8px (`rounded-lg`) to gently separate them from the background.
- **Status Pills:** Status badges use a fully rounded (pill) shape to distinguish them clearly from interactive buttons.

## Components
- **Data Tables:** The core of the system. Use sticky headers, zebra-striping (Slate-50), and hover states for rows. Column headers must include sort indicators.
- **Status Badges:** Compact pills with light background tints and dark text (e.g., Critical: Red-100 bg, Red-800 text).
- **Buttons:** 
  - *Primary:* Action Blue, white text, 4px radius. 
  - *Secondary:* White bg, Slate-300 border, Slate-700 text.
- **Action Cards:** Dashboard summaries featuring a large numerical value (Display-lg), a label (Label-bold), and a sparkline or trend indicator.
- **Input Fields:** High-contrast borders (#CBD5E1) that darken on focus to #005EB8. Include clear error validation text using `body-sm` in Critical Red.
- **Language Toggle:** A persistent utility component in the top-right navigation bar, utilizing a simple chevron-down ghost button.