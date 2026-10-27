# MotionKit roadmap

MotionKit has one production path: scene mode. Every brief becomes a researched script and storyboard, then a
sequence of purpose-built shots composed with `Film`. Reusable objects live in the style-aware asset library.

## Product boundary

- Keep the existing command flow: `storyboard`, `film`, `gaya`, `aset`, `item`, `scene stills`,
  `scene video`, `vo-cut`, and `gate`.
- Build product promos, UI, typography, explainers, and stories as scenes. There is no JSON spec pipeline.
- Keep rendering local and deterministic. A scene can be evaluated at any frame without previous-frame state.
- Make visual inspection part of generation: proof shot first, grid/region stills for every shot, video last.
- Grow the library per visual style and record what each finished film taught the next one.

## Current priorities

1. Deepen the asset library in `stik`, `poly`, `poly3d`, `model3d`, `flanel`, and `ilustrasi`.
2. Improve storyboard matching from finished-film notes and actual asset coverage.
3. Add stronger static checks for registrations, asset dimensions, references, and film notes.
4. Expand camera, skeleton, cloth, atmosphere, typography, and sound primitives only when a real film needs them.
5. Preserve visual regression checks for `PizzaScene` and `UnairScene` whenever shared rendering code changes.

## Definition of done for a film

A film is done when its facts and references are recorded, script and storyboard are approved, the proof shot is
approved, every shot has been opened and judged with measurement overlays, the final video is rendered and sampled,
and the film note is added to `packages/core/src/scenes/catatan.ts`.
