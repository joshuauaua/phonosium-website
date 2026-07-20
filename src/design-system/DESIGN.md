# Phonosium — Brand Brief

Internal brand brief covering copy voice, iconography, and logo — content the six-section [`DESIGN.md`](../../DESIGN.md) spec has no section for. For color, typography, elevation, and component tokens, see the root `DESIGN.md`; it is the single source of truth.

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

Tokens, colors, typography, elevation, and component specs are documented normatively in the root [`DESIGN.md`](../../DESIGN.md) — that file is the single source of truth for the visual system. This section covers only what the six-section DESIGN.md spec has no room for: layout rhythm and motion choreography.

### Spacing

A 4-px base scale: `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192`. Layouts breathe — single columns of content on wide canvases, with metadata in narrow side rails.

### Motion

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
