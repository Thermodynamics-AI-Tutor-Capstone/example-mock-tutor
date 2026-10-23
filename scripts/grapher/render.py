"""Fixed, data-only Matplotlib renderer for Kelvin's animated property Grapher.

Thermodynamic calculations stay in the existing local table engine. This process
accepts only its numeric plot data on stdin and writes a self-contained SVG JSON
response to stdout. It never evaluates code, opens user paths, or makes requests.
"""
import io
import json
import math
import sys
import xml.etree.ElementTree as ET

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter, NullFormatter
import numpy as np

NS = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", NS)
ET.register_namespace("xlink", XLINK)
matplotlib.rcParams.update({
    "svg.fonttype": "none", "svg.hashsalt": "kelvin-grapher-v1",
    "text.parse_math": False, "font.family": "DejaVu Sans",
    "font.size": 10, "axes.labelsize": 11,
})


def coordinates(points):
    if not isinstance(points, list) or len(points) > 2000:
        raise ValueError("Invalid curve")
    result = np.asarray(points, dtype=float)
    if result.ndim != 2 or result.shape[1] != 2 or not np.isfinite(result).all():
        raise ValueError("Invalid coordinates")
    return result[:, 0], result[:, 1]


def graph(data):
    fig, ax = plt.subplots(figsize=(10.4, 6.25), layout="constrained")
    fig.set_facecolor("#ffffff")
    ax.set_facecolor("#fbfcfe")
    groups = {}

    def mark(artist, group, suffix):
        artist.set_gid(f"{group}-{suffix}")
        groups.setdefault(group, []).append(f"{group}-{suffix}")
        return artist

    ax.set_xscale("log" if data["axes"]["x"]["log"] else "linear")
    ax.set_yscale("log" if data["axes"]["y"]["log"] else "linear")
    # User text is never parsed as TeX, so use plain numeric log ticks too.
    # Matplotlib's default log formatter emits mathtext commands otherwise.
    for key, axis_object in (("x", ax.xaxis), ("y", ax.yaxis)):
        if data["axes"][key]["log"]:
            axis_object.set_major_formatter(FuncFormatter(lambda value, _position: f"{value:g}"))
            axis_object.set_minor_formatter(NullFormatter())
    for key, setter in (("x", ax.set_xlabel), ("y", ax.set_ylabel)):
        axis = data["axes"][key]
        setter(f'{axis["label"]} ({axis["unit"]})' + (" · log scale" if axis["log"] else ""), labelpad=11)
    ax.xaxis.set_gid("graph-axis-x")
    ax.yaxis.set_gid("graph-axis-y")
    for side, spine in ax.spines.items():
        spine.set_gid(f"graph-axis-{side}")
        spine.set_color("#506178")
    ax.set_title(data["title"], loc="left", fontsize=14, fontweight="bold", pad=17)
    ax.grid(True, which="major", color="#dce3ec", linewidth=.55, alpha=.8)
    ax.set_axisbelow(True)

    def curve(points, group, color, label, dashed=False, width=1.8):
        x, y = coordinates(points)
        line, = ax.plot(x, y, color=color, linewidth=width, linestyle="--" if dashed else "-", zorder=3)
        mark(line, group, "line")
        # Boundary labels appear beside their own curve, rather than in a legend
        # that could reveal a later animation step before it is constructed.
        if label:
            i = max(1, int(len(x) * .42))
            text = ax.annotate(label, xy=(x[i], y[i]), xytext=(7, 5), textcoords="offset points", fontsize=9.2, color=color, bbox={"facecolor": "white", "edgecolor": "none", "alpha": .85, "pad": 1.2}, zorder=8)
            mark(text, group, "label")

    if data["type"] == "PT":
        curve(data["coexistence"], "graph-boundary-coexistence", "#627184", "Liquid–vapor coexistence")
    else:
        curve(data["dome"]["liquid"], "graph-boundary-liquid", "#567a98", "Saturated liquid · x=0")
        curve(data["dome"]["vapor"], "graph-boundary-vapor", "#8c68a2", "Saturated vapor · x=1")

    cx, cy = data["critical"]
    critical, = ax.plot([cx], [cy], marker="D", color="#584f77", markersize=5.5, linestyle="none", zorder=10)
    mark(critical, "graph-critical", "point")
    cp = data["criticalProperties"]
    critical_offset = (12, 46) if data["type"] == "Pv" else (10, 13)
    label = ax.annotate(f'Critical point\nTc={cp["T"]:g} °C; Pc={cp["P"]:g} kPa', (cx, cy), xytext=critical_offset, textcoords="offset points", fontsize=9.2, color="#584f77", arrowprops={"arrowstyle": "-", "color": "#8c83a1", "lw": .65} if data["type"] == "Pv" else None, zorder=11)
    mark(label, "graph-critical", "label")
    if label.arrow_patch is not None:
        mark(label.arrow_patch, "graph-critical", "leader")

    for region in data["regions"]:
        # An anchor at a calculated equilibrium state ensures these labels are
        # physically located, including the supercritical region on every chart.
        x, y = region["xy"]
        ax.update_datalim([[x, y]])
        align = "right" if region["id"].endswith("-liquid") else "left" if region["id"].endswith("-vapor") else "center"
        text = ax.text(x, y, region["text"], color="#718096", fontsize=9.5, ha=align, va="center", bbox={"facecolor": "white", "edgecolor": "none", "alpha": .8, "pad": 1.7}, zorder=4)
        text.set_gid(region["id"])

    for i, isobar in enumerate(data["isobars"]):
        curve(isobar["points"], f"graph-isobar-{i}", "#9bafc4", f'P={isobar["label"]}', True, 1.1)

    colors = ["#146ca4", "#ca5b20", "#2e8769", "#8a54ab", "#bf425c", "#9b7a13"]
    for i, process in enumerate(data["paths"]):
        group = f"graph-process-{i}"
        color = colors[i % len(colors)]
        curve(process["points"], group, color, None, process["dashed"], 2.4)
        x, y = coordinates(process["points"])
        # Locate arrow endpoints by normalized screen distance so direction is
        # readable even when log axes greatly change apparent point spacing.
        tx = np.log(x) if data["axes"]["x"]["log"] else x
        ty = np.log(y) if data["axes"]["y"]["log"] else y
        dx = np.diff(tx) / max(float(np.ptp(tx)), 1e-10)
        dy = np.diff(ty) / max(float(np.ptp(ty)), 1e-10)
        distance = np.concatenate(([0.], np.cumsum(np.hypot(dx, dy))))
        if distance[-1] > 1e-7:
            a = max(0, min(len(x)-2, int(np.searchsorted(distance, .45 * distance[-1]))))
            b = min(len(x)-1, max(a+1, int(np.searchsorted(distance, .6 * distance[-1]))))
            arrow = ax.annotate("", xy=(x[b], y[b]), xytext=(x[a], y[a]), arrowprops={"arrowstyle": "-|>", "color": color, "lw": 1.8, "mutation_scale": 13, "shrinkA": 0, "shrinkB": 0}, zorder=8)
            mark(arrow, group, "direction")
            # Annotation draws its FancyArrowPatch outside the annotation's own
            # SVG group. Include that actual patch in the animation group too.
            mark(arrow.arrow_patch, group, "arrow")
        middle = len(x) // 2
        overlap = distance[-1] <= 1e-7
        note = f'{process["from"]} → {process["to"]}' + (" (overlap)" if overlap else "")
        text = ax.annotate(note, (x[middle], y[middle]), xytext=(7, -15 - (i % 2) * 11 if overlap else -13), textcoords="offset points", color=color, fontsize=9.2, bbox={"facecolor": "white", "edgecolor": "none", "alpha": .9, "pad": 1}, zorder=9)
        mark(text, group, "label")

    positions = {}
    for i, st in enumerate(data["states"]):
        x, y = st["xy"]
        group = f"graph-state-{i}"
        point, = ax.plot([x], [y], marker="o", markersize=6.5, markeredgecolor="white", markeredgewidth=1.3, color="#143d62", linestyle="none", zorder=12)
        mark(point, group, "point")
        key = (round(x, 7), round(y, 7))
        offset = positions.get(key, 0)
        positions[key] = offset + 1
        label = ax.annotate(st["label"], (x, y), xytext=(8, 7 + offset*15), textcoords="offset points", color="#143d62", fontsize=10, fontweight="bold", bbox={"facecolor": "white", "edgecolor": "none", "alpha": .88, "pad": 1}, zorder=13)
        mark(label, group, "label")

    ax.autoscale_view()
    ax.margins(x=.16, y=.23)
    # Show fluid and source without offering interpretations such as process-area
    # work on a log-scaled P-v chart.
    fig.text(.99, .006, f'{data["fluid"]} · local interpolated property tables', ha="right", va="bottom", fontsize=8, color="#738196")
    output = io.StringIO()
    fig.savefig(output, format="svg", metadata={"Date": None, "Creator": "Kelvin Python Grapher"})
    plt.close(fig)
    root = ET.fromstring(output.getvalue())
    root.set("role", "img")
    root.set("aria-label", data["title"])
    # Group each step's artists under one stable ID. All clip references remain
    # internal SVG references; the browser namespaces the complete document.
    for group_id, member_ids in groups.items():
        members = set(member_ids)
        parent_map = {child: parent for parent in root.iter() for child in parent}
        nodes = [node for node in root.iter() if node.get("id") in members]
        if not nodes:
            raise ValueError("Missing plotted artists")
        parent = parent_map[nodes[0]]
        group = ET.Element(f"{{{NS}}}g", {"id": group_id})
        insert_at = min(list(parent).index(node) for node in nodes if parent_map[node] is parent)
        for node in nodes:
            parent_map[node].remove(node)
            group.append(node)
        parent.insert(insert_at, group)
    for node in root.iter():
        if node.tag == f"{{{NS}}}text":
            node.set("style", node.get("style", "") + "; font-family: 'DejaVu Sans', Arial, sans-serif")
        for key, value in node.attrib.items():
            if key.endswith("href") and not value.startswith("#"):
                raise ValueError("External SVG references are forbidden")
    return ET.tostring(root, encoding="unicode")


if __name__ == "__main__":
    raw = sys.stdin.buffer.read(1024 * 1024 + 1)
    if len(raw) > 1024 * 1024:
        raise ValueError("Plot input too large")
    payload = json.loads(raw)
    print(json.dumps({"svg": graph(payload)}, ensure_ascii=True))
