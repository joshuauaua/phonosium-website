---
name: phonosium-design
description: Use this skill to generate well-branded interfaces and assets for Phonosium, a sound installation. Contains color and type tokens (CSS custom properties), a brand brief covering voice and visual rules, and core design constraints for exhibition wayfinding, posters, programme materials, web, and signage.
user-invocable: true
---

Read `DESIGN.md` for the brand foundation: voice, visual rules, type system, color usage, motion. Tokens live in `colors_and_type.css` — link it from every HTML file you produce.

Core rules to honor:

- Two-color palette: vermillion `#FF5A1F` + warm paper `#FAF7F2`, anchored by ink `#14110E`. Orange marks one thing per view.
- Type: Archivo (display at 900, body at 400/500). JetBrains Mono for timecodes, frequencies, room numbers, all UPPERCASE labels.
- Curatorial, restrained voice. Numbers are precise (`Ch. 03 · 12′37″ · 87.31 Hz`). No emoji. No exclamation.
- Rectangles with softened corners — 4px on controls, 6px on cards and panels, square only where content runs full-bleed to the edge. Hairline ink rules. Almost no shadows.

If invoked with no further direction, ask the user what surface they need (poster, programme booklet page, room signage, web landing, social tile) and produce a static HTML artifact using the tokens and components in this skill.
