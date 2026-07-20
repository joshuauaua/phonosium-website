---
name: phonosium-design
description: Use this skill to generate well-branded interfaces and assets for Phonosium, a sound installation. Contains colors, type, fonts, components, and a microsite UI kit for prototyping exhibition wayfinding, posters, programme materials, web, and signage.
user-invocable: true
---

Read `DESIGN.md` for the brand foundation: voice, visual rules, type system, color usage, motion. Tokens live in `colors_and_type.css` — link it from every HTML file you produce.

Core rules to honor:

- Two-color palette: vermillion `#FF5A1F` + warm paper `#FAF7F2`, anchored by ink `#14110E`. Orange marks one thing per view.
- Type: Archivo (display at 900, body at 400/500). JetBrains Mono for timecodes, frequencies, room numbers, all UPPERCASE labels.
- Curatorial, restrained voice. Numbers are precise (`Ch. 03 · 12′37″ · 87.31 Hz`). No emoji. No exclamation.
- Sharp 90° rectangles. Hairline ink rules. Almost no shadows.

If invoked with no further direction, ask the user what surface they need (poster, programme booklet page, room signage, web landing, social tile) and produce a static HTML artifact using the tokens and components in this skill.
