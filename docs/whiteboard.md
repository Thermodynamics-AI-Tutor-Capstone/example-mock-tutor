# Kelvin teaching board prototype

The `show_on_board` tool accepts a bounded JSON board: up to eight labeled nodes, twelve arrows,
and six solution steps. The server validates the structure, streams a `kelvin-board` block into the
assistant reply, and saves that block with the message. The browser draws the SVG and KaTeX steps
in sequence. It reopens as a static board in chat history. No image API or new runtime dependency is
needed. This is a schematic; use `plot_property_diagram` for scale and property values.

The tool is offered to the enabled Coach, Check My Work, and Concepts & Practice styles. Try a
prompt such as: “Show a turbine control volume on the board, label the inlet, outlet, mass flow,
heat, and work, and write only the energy balance we should start from.” A configured DeepSeek key
and sign-in are still required for a live agent turn. The offline tool and renderer can be checked
with `node scripts/board.test.mjs`.

## Extend the display

The current renderer is [public/board.js](../public/board.js). The streaming chat retains its SVG
node while more reply text arrives, so the animation is not restarted. For richer diagrams, extend
the JSON schema in both [agent/tools/show_on_board.yml](../agent/tools/show_on_board.yml) and
[lib/tools/show_on_board.js](../lib/tools/show_on_board.js), then update the browser's validation
and rendering together. Keep the model's output as data; the browser owns SVG creation and escapes
all labels. Add one diagram type at a time, with a real thermodynamics example and a narrow layout
check. The next useful type is a control-volume boundary with heat, work, and mass arrows anchored
to its perimeter. Preserve the reduced-motion rule and the SVG title/description when extending it.

## Give students a scratchpad

1. Add a “Draw work” button beside the attachment button in [public/index.html](../public/index.html)
   and a small overlay or side panel. Create `public/scratchpad.js` for a canvas with pointer events,
   undo, clear, and an equation/text field. Keep strokes as normalized points so resizing the panel
   does not alter them. Reuse KaTeX for display; add MathLive only if students need a math keyboard.
2. For the first usable version, export the canvas as a PNG with `canvas.toBlob()`, wrap it in a
   `File`, and pass it to `window.KelvinAttachments.upload([file])`. That uses the existing private
   upload, image transcription, student review, and `read_attachment` path. Ask the student to check
   the transcription before Kelvin diagnoses a handwritten equation.
3. If students need to reopen and edit a board, store its strokes and equation fields as JSON in a
   new conversation-owned database row behind authenticated GET/PUT routes. Keep the PNG attachment
   as the snapshot Kelvin reads. Verify two users cannot read each other's boards, and test mouse,
   touch, mobile layout, undo, and reconnecting to an existing chat.
