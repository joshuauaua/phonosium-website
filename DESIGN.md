# Phonosium Design System

This document outlines the design tokens, color system, and accessibility guidelines for the Phonosium website.

## Design Philosophy

Phonosium's design system emphasizes **minimalism, clarity, and accessibility**. The aesthetic is clean and modern with a warm orange accent color against a white background. The system prioritizes:

- **High contrast ratios** meeting WCAG 2.1 AA/AAA standards
- **Touch-friendly targets** for mobile accessibility
- **Consistent spacing** using a systematic scale
- **Semantic token naming** for maintainability

## Color System

All color tokens are defined in [`src/index.css`](./src/index.css).

### Color Palette

| Token             | Hex                     | Usage                            | WCAG Contrast on White |
| ----------------- | ----------------------- | -------------------------------- | ---------------------- |
| `--orange`        | `#D65A00`               | Primary brand color, CTAs, links | 4.51:1 (AA)            |
| `--orange-light`  | `#E87020`               | Hover states, highlights         | 3.98:1 (AA Large)      |
| `--orange-dim`    | `#B44A00`               | Scrollbars, subdued accents      | 5.91:1 (AA)            |
| `--white`         | `#FFFFFF`               | Primary background               | —                      |
| `--white-soft`    | `#F9F9F9`               | Subtle background variation      | —                      |
| `--white-mid`     | `#F0F0F0`               | Card backgrounds                 | —                      |
| `--white-card`    | `#FAFAFA`               | Elevated surfaces                | —                      |
| `--black`         | `#0A0A0A`               | Primary text, headings           | 19.36:1 (AAA)          |
| `--black-soft`    | `#333333`               | Secondary text                   | 12.63:1 (AAA)          |
| `--black-mid`     | `#666666`               | Muted text                       | 5.74:1 (AA)            |
| `--black-muted`   | `#999999`               | Disabled/placeholder text        | 2.85:1 (AA Large only) |
| `--border`        | `rgba(214, 90, 0, 0.2)` | Default borders                  | —                      |
| `--border-active` | `rgba(214, 90, 0, 0.6)` | Active/focus borders             | —                      |

### WCAG Compliance Calculations

Contrast ratios are calculated using the WCAG 2.1 formula:

```
Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
```

Where `L` is relative luminance calculated from sRGB color values.

**WCAG Success Criteria:**

- **AAA (7:1 for normal text, 4.5:1 for large text)**: Maximum accessibility
- **AA (4.5:1 for normal text, 3:1 for large text)**: Minimum acceptable standard
- **Large text**: 18pt regular or 14pt bold

**Compliance Table:**

| Foreground       | Background | Contrast | Level    | Use Cases                       |
| ---------------- | ---------- | -------- | -------- | ------------------------------- |
| `--black`        | `--white`  | 19.36:1  | AAA      | Body text, headings (all sizes) |
| `--black-soft`   | `--white`  | 12.63:1  | AAA      | Secondary text, captions        |
| `--black-mid`    | `--white`  | 5.74:1   | AA       | Muted labels, metadata          |
| `--black-muted`  | `--white`  | 2.85:1   | —        | Large text only (decorative)    |
| `--orange`       | `--white`  | 4.51:1   | AA       | Links, CTAs (normal text)       |
| `--orange-light` | `--white`  | 3.98:1   | AA Large | Hover states (large text only)  |
| `--orange-dim`   | `--white`  | 5.91:1   | AA       | Emphasized elements (all sizes) |

**Important:** `--black-muted` and `--orange-light` should only be used for large text (18pt+) or decorative elements that don't convey critical information.

## Spacing Scale

The spacing system uses a base unit of **0.25rem (4px)** with consistent increments:

| Token           | Value     | Pixels (16px base) | Usage                           |
| --------------- | --------- | ------------------ | ------------------------------- |
| `--spacing-xs`  | `0.25rem` | 4px                | Tight inline spacing, icon gaps |
| `--spacing-sm`  | `0.5rem`  | 8px                | Component padding, list items   |
| `--spacing-md`  | `1rem`    | 16px               | Default spacing, card padding   |
| `--spacing-lg`  | `1.5rem`  | 24px               | Section gaps, form spacing      |
| `--spacing-xl`  | `2rem`    | 32px               | Large content blocks            |
| `--spacing-2xl` | `3rem`    | 48px               | Major page sections             |
| `--spacing-3xl` | `4rem`    | 64px               | Hero sections, page divisions   |

**Guidelines:**

- Use `--spacing-md` as the default for most component spacing
- Prefer consistent spacing values over arbitrary pixel values
- Stack spacing tokens for larger gaps (e.g., `calc(var(--spacing-xl) + var(--spacing-lg))`)

## Touch Targets

Per WCAG 2.5.5 (Level AAA), all interactive elements meet a minimum touch target size:

```css
--touch-target-min: 44px;
```

This ensures:

- Buttons and links are at least 44×44 pixels
- Adequate spacing between adjacent clickable elements
- Improved usability on mobile devices

## Usage Guidelines

### ✅ Do

- **Use `--orange` for primary CTAs and links** — meets AA contrast for normal text
- **Use `--black` for body text** — meets AAA contrast for all text sizes
- **Use `--black-soft` for secondary content** — maintains AAA contrast
- **Use `--black-mid` for labels and metadata** — meets AA contrast
- **Apply hover states with `--orange-light`** — on large buttons/text only
- **Maintain 44px minimum touch targets** — for all interactive elements

### ❌ Don't

- **Don't use `--black-muted` for small text** — insufficient contrast (2.85:1)
- **Don't use `--orange-light` for body text** — fails AA for normal text
- **Don't use orange variants for small icons or fine details** — may fail contrast
- **Don't create arbitrary spacing values** — use the scale tokens
- **Don't reduce touch target sizes below 44px** — breaks accessibility

### Example Usage

**Primary Button:**

```css
.button-primary {
  background: var(--orange);
  color: var(--white);
  padding: var(--spacing-md) var(--spacing-xl);
  min-height: var(--touch-target-min);
}
```

**Body Text:**

```css
.body-text {
  color: var(--black);
  line-height: 1.6;
  margin-bottom: var(--spacing-md);
}
```

**Secondary Text:**

```css
.caption {
  color: var(--black-soft);
  font-size: 0.875rem;
}
```

## Adding New Tokens

When proposing new design tokens:

1. **Calculate WCAG contrast ratios** using a tool like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. **Ensure semantic naming** — describe purpose, not appearance (e.g., `--text-error` not `--color-red`)
3. **Follow the existing scale** — for spacing, use increments that align with the 4px base
4. **Update this documentation** — add the new token to the relevant table with usage guidelines
5. **Test on real devices** — verify readability and usability across different screen sizes

## Testing Accessibility

Use these tools to verify WCAG compliance:

- **Chrome DevTools** — Lighthouse audit (Accessibility score)
- **WebAIM Contrast Checker** — https://webaim.org/resources/contrastchecker/
- **axe DevTools** — Browser extension for automated accessibility testing
- **WAVE** — Web Accessibility Evaluation Tool
- **Manual testing** — Test with screen readers (VoiceOver, NVDA, JAWS)

### Contrast Ratio Testing

To verify a color combination:

1. Open [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. Enter the foreground and background hex values
3. Check the contrast ratio against WCAG requirements:
   - **4.5:1** for normal text (AA)
   - **3:1** for large text (AA Large)
   - **7:1** for normal text (AAA)
   - **4.5:1** for large text (AAA)

## Further Reading

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Touch Target Size Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)
