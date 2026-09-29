---
source: me300/lectures/Module4_3_PhaseDecisionTree_annotated.pdf
pages: 4
kind: lecture-slides
transcribed_by: deepseek-flash (from page images)
---

## Page 1

ME 300:
Engineering Thermodynamics

Phase Change
Decision Tree

[figure] Blurred flowchart/decision-tree diagram occupying the left half of the slide, rendered in blue on a white background and not legible. Structure top to bottom: a rounded rectangle at the top with a single connector line leading down to a diamond (decision node); the diamond branches into two paths, each leading to a rounded rectangle (one left, one right). Each of those rectangles leads down to a second diamond; the left diamond branches to two small rounded rectangles, and the right diamond branches to two small rounded rectangles, with an additional small rounded rectangle in the center below the right diamond. All lower branches converge into a wide bar (terminal/connector shape) at the bottom of the diagram. All labels inside the shapes are [illegible] due to blurring.

## Page 2

Start with P and T  **[handwritten: green underline squiggle beneath]**

[handwritten] sat. P  →  (green arrow pointing to the first box)

**Step 1: Go to saturation tables (D.2)**

↓

**Is T=Tsat?**  [handwritten: green underline under "T=Tsat?", green "?"]

— yes → **Vapor/liquid or on a saturation line – need more info**

[handwritten beside box] T, P are not independent.  [handwritten: green underline]

— no ↓

**Is P>Pcrit?**  [handwritten: green underline under "Is P>Pcrit?"]

— yes ← **Check table D.4 - liquid**

— yes → **Check table D.3V - supercritical**

— no ↓

**Is T>Tsat?**

— yes → **Vapor** → **Steam tables**

— no ↓

**Is T<Tsat?**

— yes → **Liquid** → **Liquid tables**

[figure] Hand-drawn T–v diagram in green ink at left: vertical axis labelled T (upward arrow), horizontal axis labelled v (rightward arrow). A saturation dome (bell-shaped curve) is drawn. A dashed horizontal line at T_sat extends from the T axis across the dome; two further dashed horizontal lines (one near the dome peak, one lower) extend to the right of the dome. Green dots mark intersections on the dome and on the dashed lines. Labels written on the diagram: P (along the left branch of the dome), low T (to the right of the dome).

## Page 3

**Start with P and v** (underlined, with green circle around "P and v")
- [handwritten] P and v [underlined in green]
- [handwritten] P and u [underlined in green]
- [handwritten] P and h [underlined in green]
- [handwritten] P and s [underlined in green]

**Flowchart:**

```
Step 1: Go to saturation tables (D.2)   [handwritten: double green underline]
        |
        v
Is vf<v<vg?  --yes-->  Liquid + vapor  -->  Calculate x
        |                                        [handwritten: T = T_sat]
       no                                        [handwritten: X = (v - v_f)/(v_g - v_f)]
        |
        v
Is P>Pcrit?  --yes-->  Check table D.3V - supercritical
        |
        +--yes-->  Check table D.4 - liquid   (note: check table to the left)
        |
       no
        |
        v
Is v>vg?  --yes-->  Vapor  -->  Steam tables
        |
       no
        |
        v
Is v<vf  --yes-->  Liquid  -->  Liquid tables
```

(Note: "Check table D.4 - liquid" has "yes" on the arrow, and is a separate box pointing back to the left of the "Is P>Pcrit?" box.)

Handwritten equations to the right of "Calculate x":
$$T = T_{sat}$$
$$X = \frac{v - v_f}{v_g - v_f}$$

[figure] A $T$-$v$ diagram drawn in green ink at the lower left. Vertical axis is labelled $T$ (with a small upward arrow), horizontal axis is labelled $v$ (with a rightward arrow). A saturation dome (bell curve) is drawn with the peak near the middle; dashed vertical lines mark the saturated liquid and vapor boundaries and are labelled $v_f$ (left dashed line) and $v_g$ (right dashed line) below the axis. Two solid green curves with small circular points marked on them pass through the dome region (appearing to cross the dome), representing constant-pressure lines/liquid-vapor states, with a horizontal line connecting them within the dome.

## Page 4

**Start with T and v**
- T and u [handwritten] ✓
- T and h [handwritten] ✓
- T and s [handwritten] ✓

[figure] Hand-drawn T–v diagram in green on the left: vertical axis labeled $T$ with an upward arrow, horizontal axis labeled $v$ with a rightward arrow; a solid green saturation dome (bell curve) rising to a peak marked with a small "x" (critical point); a horizontal green line at the top spanning the dome region; below it two horizontal dashed lines crossing the dome, each carrying filled green dots — one dot in the compressed-liquid region, one on the left branch of the dome, one on the right branch, and one in the superheated-vapor region; dashed vertical lines drop from the saturated-liquid and saturated-vapor boundaries to the $v$-axis, where the labels [handwritten] $v_f$ and [handwritten] $v_g$ are written; dashed curves inside the dome run down toward the $v$-axis.

**Step 1: Go to saturation tables (D.1)**

↓

**Is $v_f<v<v_g$?** — yes → **Liquid + vapor** → **Calculate x** [handwritten] $P = P_{sat}$

↓ no

**Is $T>T_{crit}$?** — yes → **Check table D.3V - supercritical** [handwritten: D.3V underlined in green]

↓ Yes/no

**Is $v>v_g$?** — yes → **Vapor** → **Steam tables**

↓ no

**Is $v<v_f$** — yes → **Liquid** → **Liquid tables**
