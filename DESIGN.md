---
name: Phonosium
description: Exhibition-wayfinding design system for a sound installation — one vermillion accent, Archivo display type, JetBrains Mono metadata, flat hairline-ruled surfaces.
colors:
  vermillion: '#ff5a1f'
  vermillion-deep: '#c2410c'
  vermillion-soft: '#ffd9c2'
  vermillion-tint: '#fff1e6'
  paper: '#faf7f2'
  white: '#ffffff'
  chalk: '#efebe3'
  mist: '#d9d4cc'
  stone: '#8a847c'
  stone-dark: '#5a544c'
  graphite: '#3a332d'
  ink: '#14110e'
  ink-lead: '#2a251f'
typography:
  display:
    fontFamily: 'Archivo, Inter, system-ui, sans-serif'
    fontSize: '192px'
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: '-0.04em'
  headline:
    fontFamily: 'Archivo, Inter, system-ui, sans-serif'
    fontSize: '128px'
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: '-0.04em'
  title:
    fontFamily: 'Archivo, Inter, system-ui, sans-serif'
    fontSize: '40px'
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  body:
    fontFamily: 'Archivo, Inter, system-ui, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: '0'
  label:
    fontFamily: 'JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace'
    fontSize: '12px'
    fontWeight: 500
    lineHeight: 1.6
    letterSpacing: '0.04em'
rounded:
  none: '0px'
  sm: '2px'
  md: '4px'
  pill: '999px'
spacing:
  s-1: '4px'
  s-2: '8px'
  s-3: '12px'
  s-4: '16px'
  s-5: '24px'
  s-6: '32px'
  s-7: '48px'
  s-8: '64px'
  s-9: '96px'
  s-10: '128px'
  s-11: '192px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
    padding: '14px 22px'
  button-primary-hover:
    backgroundColor: '{colors.vermillion}'
    textColor: '{colors.paper}'
  button-outline:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
    padding: '14px 22px'
  button-outline-hover:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
  button-accent:
    backgroundColor: '{colors.vermillion}'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.sm}'
    padding: '14px 22px'
  button-accent-hover:
    backgroundColor: '{colors.vermillion-deep}'
    textColor: '{colors.paper}'
  chip:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '4px 10px'
  chip-live:
    backgroundColor: '{colors.vermillion-tint}'
    textColor: '{colors.vermillion-deep}'
    rounded: '{rounded.pill}'
  card:
    backgroundColor: '{colors.paper}'
    rounded: '{rounded.none}'
    padding: '{spacing.s-6}'
  input:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.none}'
    padding: '14px 16px'
---

# Design System: Phonosium

## 1. Overview

**Creative North Star: "The Sound Chamber"**

Phonosium is a sound installation — an immersive spatial work that treats acoustics as architecture. The site is its wayfinding layer: it reads like exhibition signage, not a marketing page. Large, confident architectural type sets the hierarchy; generous white space lets it breathe; a single vermillion accent (`#ff5a1f`) does all the emphasis work, marking the one live element, current chapter, or call to action per screen. Monospaced technical metadata — timecodes, frequencies, room numbers, chapter indices — recurs as a structural motif, anchoring the work in something measurable.

The voice is curatorial and third-person observational, like wall text in a gallery ("the room breathes at 47 Hz"), never a pitch. This system explicitly rejects gradient backgrounds, glassmorphism, rounded cards with heavy drop shadows, playful bouncy animations, emoji in UI copy or icons, and marketing superlatives — the site gets out of the way of the installation itself.

**Key Characteristics:**

- One accent color, used sparingly and only for the live/actionable element
- Flat surfaces — hierarchy comes from hairline rules and weight, not shadows
- Large, tight-tracked Archivo display type paired with uppercase JetBrains Mono metadata
- Mobile-first: legible and tappable at arm's length, outdoors, in person at the installation site

## 2. Colors

A two-color system — vermillion orange plus warm neutrals anchored by a near-black ink — where color is functional, never decorative.

### Primary

- **Vermillion** (`#ff5a1f`): the single accent. Marks the live element, the current chapter, or the call to action — never a large background except a deliberate full-bleed poster.
- **Vermillion Deep** (`#c2410c`): pressed/hover states on accent surfaces, and the on-paper text color for the "live" chip variant.
- **Vermillion Soft** (`#ffd9c2`) / **Vermillion Tint** (`#fff1e6`): selection fills and page tints — the only places the accent is allowed to sit under body content.

### Neutral

- **Exhibition Ink** (`#14110e`): primary text, primary borders, and the inverse background for full-bleed dark sections.
- **Ink Lead** (`#2a251f`): lead paragraph text where slightly softer than pure ink is needed (14.2:1 contrast on paper).
- **Warm Paper** (`#faf7f2`): the primary canvas. Almost every surface is solid paper or solid ink — no gradients, no textures.
- **White** (`#ffffff`): true white, reserved for isolated needs distinct from the warm paper canvas.
- **Chalk** (`#efebe3`): scrollbar track and the faintest background variation.
- **Mist** (`#d9d4cc`): soft dividers (`.ph-rule--soft`).
- **Stone** (`#8a847c`): muted text, placeholders (3.46:1 on paper — below AA; see Contrast Ratios below).
- **Stone Dark** (`#5a544c`): labels and metadata needing stronger contrast than Stone (7.0:1 on paper).
- **Graphite** (`#3a332d`): scrollbar-thumb hover state.

### Contrast Ratios

Computed per the [WCAG 2.1 relative-luminance formula](https://www.w3.org/TR/WCAG21/#dfn-relative-luminance) for every color pairing actually used for text or interactive-state content in `colors_and_type.css`. AA requires 4.5:1 for normal text / 3:1 for large text (≥18px/14px bold) and non-text UI components (borders, focus indicators); AAA requires 7:1 / 4.5:1.

| Foreground                | Background                | Usage                                                                                                          | Ratio                                       | AA                                                          | AAA  |
| ------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------- | ---- |
| Ink `#14110e`             | Paper `#faf7f2`           | Body text, `.ph-btn--outline`, `.ph-chip`, `.ph-input`                                                         | 17.60:1                                     | Pass                                                        | Pass |
| Ink Lead `#2a251f`        | Paper `#faf7f2`           | Lead paragraph text                                                                                            | 14.21:1                                     | Pass                                                        | Pass |
| Stone Dark `#5a544c`      | Paper `#faf7f2`           | Metadata labels                                                                                                | 7.00:1                                      | Pass                                                        | Pass |
| Paper `#faf7f2`           | Ink `#14110e`             | `.ph-btn` primary, `.ph-btn--outline:hover`, inverse sections                                                  | 17.60:1                                     | Pass                                                        | Pass |
| Ink `#14110e`             | Vermillion `#ff5a1f`      | `.ph-btn--accent` text                                                                                         | 6.03:1                                      | Pass (normal)                                               | Fail |
| Paper `#faf7f2`           | Vermillion Deep `#c2410c` | `.ph-btn--accent:hover` text                                                                                   | 4.85:1                                      | Pass (normal)                                               | Fail |
| Vermillion Deep `#c2410c` | Vermillion Tint `#fff1e6` | `.ph-chip--live` text                                                                                          | 4.68:1                                      | Pass (normal)                                               | Fail |
| Stone `#8a847c`           | Paper `#faf7f2`           | Muted text, `.ph-input::placeholder`                                                                           | 3.46:1                                      | **Fail** (passes only at large-text/UI-component threshold) | Fail |
| Paper `#faf7f2`           | Vermillion `#ff5a1f`      | `.ph-btn` (primary) `:hover` text — background switches to Vermillion but the inherited text color stays Paper | 2.92:1                                      | **Fail**                                                    | Fail |
| Vermillion `#ff5a1f`      | Paper `#faf7f2`           | Focus underline (`.ph-input:focus`), accent borders — non-text UI, needs 3:1                                   | **2.92:1 — fails the 3:1 non-text minimum** | **Fail**                                                    | Fail |

**Known gaps (tracked, not yet fixed):**

- **Stone-on-Paper** (3.46:1) is used for real muted body copy across the site (captions, meta labels, footer text — see `InstallationDetail.module.css`, `ContributionForm.module.css`, `Footer.module.css`), not only placeholders. It fails the 4.5:1 AA minimum for normal-size text.
- **Primary-button hover state** (Paper-on-Vermillion, 2.92:1): `.ph-btn:hover` changes the background to Vermillion without also switching the text color to Ink, so hovered primary-button text fails AA.
- **Vermillion-on-Paper as a non-text indicator** (focus underline, accent borders) also falls short of the 3:1 minimum WCAG 1.4.11 requires for UI-component boundaries.

The PRODUCT.md accessibility claim has been updated to reflect this — see its Accessibility & Inclusion section.

### Named Rules

**The One Accent Rule.** Vermillion appears on one thing per view. Its rarity is the point — if more than one element on screen carries the accent, one of them is wrong.

## 3. Typography

**Display Font:** Archivo (with Inter, system-ui fallback)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, SF Mono, Menlo fallback)

**Character:** Archivo carries every text role — display numerals crushed to a 0.88 line-height with tight (`-0.04em`) tracking at 800–900 weight, body settling to a relaxed 1.55 line-height at 400–500 weight. JetBrains Mono is the technical register: uppercase, tracked, reserved strictly for timecodes, frequencies, room numbers, and captions.

### Hierarchy

- **Display** (900, 192px, line-height 0.88, `-0.04em`): hero numerals and title-slide type only.
- **Headline / H1** (900, 128px, line-height 0.92, `-0.04em`): the largest in-page heading.
- **H2** (700, 84px, line-height 0.95, `-0.02em`): major section headers.
- **H3** (700, 56px, line-height 1, `-0.02em`): sub-section headers.
- **Title / H4** (600, 40px, line-height 1.1, `-0.02em`): card and panel titles.
- **H5** (600, 28px, line-height 1.2): minor headings.
- **Lead** (400, 22px, line-height 1.45): intro paragraphs.
- **Body** (400, 16px, line-height 1.55): default copy, 65–75ch max line length.
- **Small** (400, 14px, line-height 1.6): captions, fine print.
- **Label / Mono** (500, 12px, uppercase, `0.04em` tracking): timecodes, frequencies, room numbers.
- **Caps** (700, 12px, Archivo, uppercase, `0.12em` tracking): editorial labels set in the sans, not mono.

### Named Rules

**The Mono-For-Metadata Rule.** JetBrains Mono is reserved for the technical voice — timecodes, frequency labels, room numbers, captions. Never for body copy.

## 4. Elevation

Phonosium is flat by default. Depth comes from hairline (1px) ink rules and weight contrast, not shadows — this reads as exhibition signage, not a SaaS dashboard. Exactly one shadow exists, for floating overlays.

### Shadow Vocabulary

- **Overlay** (`box-shadow: 0 12px 32px -8px rgba(20,17,14,0.18), 0 2px 6px -2px rgba(20,17,14,0.08)`): floating overlays only (menus, popovers). Not used on cards, buttons, or any resting surface.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only for elements floating above the page, never as a decorative lift on cards or buttons.

## 5. Components

### Buttons

- **Shape:** sharp rectangle, minimal radius (2px).
- **Primary:** ink fill, paper text, uppercase label type, 14px/22px padding. Hover fills vermillion.
- **Outline:** transparent fill, ink border and text. Hover inverts to an ink fill with paper text.
- **Accent:** vermillion fill, ink text (for contrast on the bright fill). Hover deepens to Vermillion Deep with paper text.

### Chips

- **Style:** pill shape (999px radius), transparent background, 1px ink border, ink text, mono label type.
- **Live variant:** Vermillion Tint background, Vermillion Deep text and border, plus a small pulsing vermillion dot — the one chip state allowed to carry the accent as a fill.

### Cards / Containers

- **Corner Style:** 0px — sharp rectangles, no exceptions.
- **Background:** Warm Paper.
- **Shadow Strategy:** none (see Elevation) — the 1px ink border does the separating work.
- **Border:** 1px solid ink.
- **Internal Padding:** 32px (`spacing.s-6`).

### Inputs / Fields

- **Style:** no box or side borders — a single 2px ink underline (`border-bottom`), transparent background, 0 radius.
- **Focus:** the underline shifts to vermillion.
- **Placeholder:** Stone.

## 6. Do's and Don'ts

### Do:

- **Do** reserve vermillion (`#ff5a1f`) for the one live/actionable element per view — the current chapter, the primary CTA, the live indicator.
- **Do** use 1px hairline ink borders and weight contrast for hierarchy instead of shadows or elevation.
- **Do** set technical metadata (timecodes, frequencies, room numbers) in uppercase JetBrains Mono, tracked `0.04em`.
- **Do** keep layouts mobile-first with tappable targets — visitors check the schedule outdoors, at arm's length.
- **Do** use confident, no-overshoot easing (`cubic-bezier(0.2, 0.7, 0.1, 1)`) for state transitions.

### Don't:

- **Don't** use gradient backgrounds.
- **Don't** use glassmorphism.
- **Don't** use rounded cards with heavy drop shadows — corners are sharp (0–2px) and surfaces are flat.
- **Don't** use playful, bouncy animations — motion is restrained: 120–420ms, no overshoot.
- **Don't** use emoji in UI copy or icons.
- **Don't** use marketing superlatives ("amazing", "revolutionary") — the voice is curatorial, third-person, and observational.
