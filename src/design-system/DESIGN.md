# Phonosium — Design System

**Phonosium** is a sound installation — an immersive spatial work that treats acoustics as architecture. The name fuses _phono_ (sound) with the _-sium_ suffix of _auditorium_, _planetarium_, _atrium_: a space for sound.

The visual identity reads like contemporary exhibition wayfinding: large, confident architectural type; generous white space; a single vermillion accent that does all the heavy lifting; monospaced technical metadata (timecodes, frequencies, room numbers, chapter indices) as a structural motif throughout.

---

## Index

- `colors_and_type.css` — all design tokens (colors, type ramp, spacing, radius, shadow)
- `fonts/` — webfont files (Archivo + JetBrains Mono)
- `assets/` — logo lockup, sound diagrams, marks
- `preview/` — design system specimen cards (typography, color, components)
- `ui_kits/site/` — Phonosium installation microsite — homepage, program, room view
- `SKILL.md` — agent skill manifest

---

## Content fundamentals

Phonosium copy is **curatorial, not commercial**. It speaks like wall text in a gallery: declarative, restrained, never selling.

- **Casing**: Display headlines often run in lowercase or small caps. Technical labels (room numbers, durations, frequencies) are UPPERCASE monospace.
- **Voice**: Third-person observational ("the room breathes at 47 Hz"). Avoid "we" and "you" except in instructional micro-copy.
- **Numbers**: Always present, always precise. `Ch. 04 · 12′37″ · 220 Hz`. Numbers anchor the work in something measurable.
- **No emoji.** No exclamation points. No marketing superlatives.
- **Punctuation as ornament**: middots `·`, en-dashes `–`, primes `′″` for time, slashes for ratios. These structure information visually.
- **Headlines are short**. 2–6 words. Often a single noun phrase.

Example copy:

> _Six speakers, one room, one tone. The walls answer._
>
> Ch. 03 — Standing Waves — 14′02″

---

## Visual foundations

### Color

A two-color system: **vermillion orange** + **warm white**, anchored by a near-black ink. Color is functional, never decorative. Orange marks one thing per view — the live element, the current chapter, the call to action. Backgrounds are paper-white or ink-black; orange is never the background of a large area except in deliberate full-bleed posters.

### Type

**Archivo** (variable, 100–900) for everything text. The display register lives at 800–900 weight, often very tight tracking (`-0.04em`), with line-height crushed to `0.9` for big numerals and titles. Body sits at 400–500, generous line-height (`1.55`). **JetBrains Mono** is the technical voice: timecodes, frequency labels, room numbers, captions. Never use mono for body copy.

### Spacing

A 4-px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`. Layouts breathe — single columns of content on wide canvases, with metadata in narrow side rails.

### Backgrounds

Almost always solid paper (`--ph-paper`) or solid ink (`--ph-ink`). No gradients. No textures. The only "image" element is sound diagrams — waveforms, frequency bars, radial speaker maps — rendered as flat geometry in orange-on-paper or paper-on-ink.

### Borders and corners

Hairline (`1px`) ink borders. Radii are minimal: most surfaces are sharp 90° rectangles; small interactive elements use `2px`; pills use `999px` only when shape carries meaning (status chips).

### Shadows

Almost none. The system relies on hairline rules and weight contrast for hierarchy, not elevation. One subtle shadow exists for floating overlays only.

### Motion

- **Easing**: `cubic-bezier(0.2, 0.7, 0.1, 1)` — confident, no overshoot.
- **Duration**: `180ms` for hover/press; `420ms` for entries.
- Hover state: orange underline slides in from left, or ink fill replaces outline.
- Press state: 2% scale-down, no color shift.
- Sound-related elements may animate continuously (waveform sweeps, frequency pulses) at the room's actual tempo.

### Layout rules

- Persistent UPPERCASE mono header strip at top: `PHONOSIUM · BERLIN · 2026.05.16`
- Vertical mono labels in left/right margins for chapter or room.
- One headline per screen. Subordinate text never competes.

---

## Iconography

Phonosium uses **almost no icons**. Information is carried by typography and numerical labels. The few marks that exist are geometric primitives drawn from sound notation:

- Circle (speaker / point source)
- Concentric rings (radiation pattern)
- Vertical bars at varying heights (frequency spectrum)
- Sine and square wave glyphs
- Arrow primitives `→ ← ↑ ↓` (typeset, not iconographic)

For UI affordances (close, menu, play) we use the **Lucide** icon set at stroke-width `1.5`, ink color, no fill. CDN: `https://unpkg.com/lucide@latest`.

No emoji. No Unicode pictographs except sound-related: `◯ ● ▮ ▯ ▲ ▼ ◀ ▶ ⌁`.

---

## Logo

The Phonosium wordmark is **set type** — Archivo Black, lowercase, tracked tight (`-0.04em`), with a single orange ring (`◯`) replacing the dot above the _i_. The mark scales from 16px (favicon) to wall-sized.

A "sound" variant of the lockup includes concentric rings emanating from the i-dot for use on title slides and posters.
