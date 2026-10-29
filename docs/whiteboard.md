# Kelvin teaching board

The single guided tutor can show a diagram and equations when Whiteboard is on. A board is
bounded JSON: up to eight labeled nodes, twelve arrows, and six equation steps. The browser owns
all SVG artwork and escapes labels; the model cannot supply SVG, HTML, JavaScript, or image URLs.
No image API or additional runtime package is needed. Live agent-generated lessons still require
an available model connection. See [Narrated whiteboard](narrated-whiteboard.md) for speech controls.

## Apparatus and surroundings

A node may include an `illustration`:

- `piston-cylinder`, `rigid-tank`, `boiler`, `condenser`, `mixing-chamber`
- `turbine`, `compressor`, `pump`, `nozzle`, `diffuser`, `valve`
- `heat-exchanger`, `refrigerator`, `hose`, `immersed-object`

These are reusable, authored apparatus sketches rather than a closed list of problems. Compose
multiple apparatus with state nodes and heat/work/mass arrows. Plain nodes remain available for
abstract states, explanatory notes, and unsupported apparatus. Extend the bounded catalog when
another physical device is needed; do not substitute unrelated artwork.

Optional descriptors are based only on the problem statement:

- `surroundings: air | water | gas` shows the medium around the device. Water depicts complete
  submersion. Do not use it for partial submersion or merely because a hose carries water.
- `contents: gas | liquid | two-phase` shows known contents inside a piston cylinder, rigid tank,
  mixing chamber, boiler, or condenser. The drawn interface is schematic, never a vapor-quality
  measurement. Omit unknown phase rather than guessing it.
- `boundary: closed-system | control-volume` draws an explicitly labeled dashed boundary. For
  composite systems use a separate explanation rather than pretending individual boundaries form
  one combined boundary.

Coordinates remain 10–90 percent across/down. Illustrated nodes require separation of at least
29 x units **or** 36 y units; plain nodes need 23 x or 22 y. Prefer two to four apparatus per board.
The server rejects overlapping nodes. Boards show the drawing at full available width, with equations below.
Drawings can use up to 1000px in width and 560px (70% of viewport height) in height.
The removed workspace no longer shrinks them to fit a narrow pane. The drawing and steps have a bounded embedded viewport. Page scrolling is the default; Scroll board enables internal scrolling, and Scroll page or Escape exits before reaching the bottom. Narration controls sit above this frame and scroll normally with the conversation. **Expand diagram** opens the original SVG in a larger view; **Enlarge labels**
allows close inspection without stretching the default conversation. Escape or Close restores
the drawing and keyboard focus. Opening the larger view pauses narration or graph playback.
Diagrams use a light paper surface with navy labels in both app themes.

Every apparatus stays inside its existing `node:ID` narration target. Nodes, arrows, and equation
steps therefore retain their saved cue IDs. SVG title/description includes the apparatus, medium,
contents, and system boundary. Motion and audio remain optional; the final diagram is readable
without them. Geometry and colors are illustrative, not quantitative simulation results.

Run `node scripts/compact-diagrams.browser.test.mjs` with the same Playwright setup as the other
browser suites. It checks larger inline drawings and readable labels at 1366×768, top narration controls,
light/dark Mermaid palettes, expansion without duplicate SVG IDs, keyboard restoration, and
mobile fit. Expanded voice settings or very small screens can still require scrolling surrounding
explanation text; the diagram itself remains available in the larger view.

## Link the picture to the reasoning

1. Identify the system and depict only stated surroundings and phase.
2. Reuse numbered state labels between ports, equations, and any property plot.
3. Reveal the relevant device or energy/mass arrow when explaining its equation term.
4. State assumptions before removing terms. A turbine is not automatically adiabatic; a nozzle
   does not automatically have equal inlet/outlet density; heat-exchanger stream losses need
   an explicit assumption. Use `plot_property_diagram` for scaled thermodynamic plots.

Examples for offline review are in [illustrated-boards.mjs](../scripts/fixtures/illustrated-boards.mjs):
piston expansion, a hose and nozzle, a cooling submerged solid, and refrigerator heat/work flows.
`node scripts/board.test.mjs` validates every apparatus and schema parity, untrusted descriptors,
legacy boards, spacing, and the example compositions. `node scripts/validate-agent.mjs` validates
the tool definitions.

## Problem references informing the authored sketches

The following primary educational sources guided the apparatus choices and links to equations;
no source images are copied or loaded at runtime:

- [OpenStax: flow rate and velocity](https://openstax.org/books/college-physics-2e/pages/12-1-flow-rate-and-its-relation-to-velocity):
  hose/nozzle geometry and continuity, with distinct areas and velocities.
- [LearnChemE: ideal gas law piston](https://learncheme.github.io/demos/IdealGasLaw/dist/index.html):
  a piston, gas region, external loading, and the relation between volume change and work.
- [OpenStax: calorimetry](https://openstax.org/books/chemistry/pages/5-2-calorimetry):
  solid/water surroundings, heat transfer, and combined-system energy accounting.
- [Purdue ME200 Week 6 problems](https://engineering.purdue.edu/ME200/files/homework/WK6/Wk6_HW_Questions.pdf):
  hose/nozzle, reservoir/pump, mixing chamber, throttling valve, and heat exchanger compositions.
- [Penn State: control-volume energy](https://www.me.psu.edu/cimbala/Learning/Fluid/CV_Energy/home.htm):
  control boundaries and the distinction between shaft work and flow crossings.
- [Waterloo worked thermodynamics tutorial](https://www.mhtlab.uwaterloo.ca/courses/syde381/tutorials/Spring2014/tutorial6_s14_381.pdf):
  compressor/turbine heat exchange with surroundings; avoid universal insulation assumptions.
- [OpenStax: refrigerators and heat pumps](https://openstax.org/books/physics/pages/12-4-applications-of-thermodynamics-heat-engines-heat-pumps-and-refrigerators):
  cold space, warm surroundings, heat transfers, input work, and coefficient of performance.

Future catalog additions should include a real problem example, accessible description, bounded
schema validation, and layout checks at desktop/mobile sizes. Update both tool schemas and the
server/browser validators together. Keep the model output as data and retain existing target IDs.
