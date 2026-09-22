"""Generates the property tables Kelvin's property_lookup tool reads (agent/properties/*.json).

Values come from CoolProp's reference equations of state (IAPWS-95 for water, Tillner-Roth &
Baehr for R-134a), the same formulations the textbook tables are printed from. The app never runs
CoolProp: it interpolates these tables, the way a student reads a printed table, on a much finer grid.

Reference states match the textbooks (Cengel, Moran):
  water  - u = 0 and s = 0 for saturated liquid at the triple point (IAPWS; CoolProp's default)
  R-134a - h = 0 and s = 0 for saturated liquid at -40 C (ASHRAE)

Also writes scripts/properties/checkpoints.json: exact CoolProp values at random states, which
scripts/properties/test.mjs uses to measure the interpolation error of lib/properties.js.

Run (needs Python 3.10+; CoolProp is only needed to regenerate, not to run the app):
  python3 -m venv /tmp/cpvenv && /tmp/cpvenv/bin/pip install CoolProp==8.0.0
  /tmp/cpvenv/bin/python scripts/properties/generate_tables.py
"""

import json
import math
import os
import random

import CoolProp
import CoolProp.CoolProp as CP

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT_DIR = os.path.join(ROOT, 'agent', 'properties')
CHECK_FILE = os.path.join(ROOT, 'scripts', 'properties', 'checkpoints.json')

NICE = [1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 7.5, 8, 9]


def frange(a, b, step):
    out, i = [], 0
    while a + i * step <= b + 1e-9:
        out.append(round(a + i * step, 6))
        i += 1
    return out


FLUIDS = [
    {
        'id': 'water',
        'name': 'Water',
        'coolprop': 'Water',
        'formulation': 'IAPWS-95',
        'reference': 'u = 0 and s = 0 for saturated liquid at the triple point (IAPWS)',
        'reference_state': None,
        'P_min': None,  # triple point
        'P_max': 100000.0,
        'T_min': 0.01,
        'T_max': 1300.0,
        'T_grid': sorted(set([0.01] + frange(5, 300, 5) + frange(300, 450, 2) + frange(450, 600, 5) + frange(600, 1300, 10))),
        'sat_steps': [(0.01, 370, 0.5), (370, 373.9, 0.05)],
    },
    {
        'id': 'r134a',
        'name': 'Refrigerant-134a',
        'coolprop': 'R134a',
        'formulation': 'Tillner-Roth & Baehr (1994)',
        'reference': 'h = 0 and s = 0 for saturated liquid at -40 °C (ASHRAE)',
        'reference_state': 'ASHRAE',
        'P_min': None,  # triple point
        'P_max': 10000.0,
        'T_min': -100.0,
        'T_max': 180.0,
        'T_grid': sorted(set(frange(-100, 90, 2.5) + frange(90, 130, 1) + frange(130, 180, 2.5))),
        'sat_steps': [(-100, 98, 0.5), (98, 101.0, 0.05)],
    },
]


def sig(x, n=6):
    if x == 0 or not math.isfinite(x):
        return x
    return float(f'{x:.{n}g}')


def props(fluid, **kw):
    """One state from CoolProp, in textbook units. kw: two of T (C), P (kPa), Q."""
    keys = list(kw.items())
    args = []
    for k, v in keys:
        if k == 'T':
            args += ['T', v + 273.15]
        elif k == 'P':
            args += ['P', v * 1000.0]
        elif k == 'Q':
            args += ['Q', v]
    out = CP.PropsSI(['T', 'P', 'D', 'U', 'H', 'S'], *args, fluid)
    T, P, D, U, H, S = (out[0] if hasattr(out[0], '__len__') else out)
    return {'T': T - 273.15, 'P': P / 1000.0, 'v': 1.0 / D, 'u': U / 1000.0, 'h': H / 1000.0, 's': S / 1000.0}


def row_point(p):
    return [round(p['T'], 3), sig(p['v']), round(p['u'], 3), round(p['h'], 3), round(p['s'], 6)]


def build(f):
    name = f['coolprop']
    if f['reference_state']:
        CP.set_reference_state(name, f['reference_state'])
    Tc = CP.PropsSI('Tcrit', name) - 273.15
    Pc = CP.PropsSI('pcrit', name) / 1000.0
    Tt = CP.PropsSI('Ttriple', name) - 273.15
    Pt = CP.PropsSI('P', 'T', Tt + 273.15, 'Q', 0, name) / 1000.0
    rc = CP.PropsSI('rhocrit', name)
    crit = {'T': round(Tc, 3), 'P': sig(Pc), 'v': sig(1.0 / rc),
            'u': round(CP.PropsSI('U', 'T', Tc + 273.15, 'D', rc, name) / 1000.0, 3),
            'h': round(CP.PropsSI('H', 'T', Tc + 273.15, 'D', rc, name) / 1000.0, 3),
            's': round(CP.PropsSI('S', 'T', Tc + 273.15, 'D', rc, name) / 1000.0, 6)}

    # Saturation table, by temperature.
    Ts = []
    for a, b, step in f['sat_steps']:
        Ts += frange(a, b, step)
    Ts = sorted(set(t for t in Ts if Tt - 1e-9 <= t < Tc))
    sat_rows = []
    for t in Ts:
        l, g = props(name, T=t, Q=0), props(name, T=t, Q=1)
        sat_rows.append([round(t, 3), sig(l['P'], 7), sig(l['v']), sig(g['v']), round(l['u'], 3), round(g['u'], 3),
                         round(l['h'], 3), round(g['h'], 3), round(l['s'], 6), round(g['s'], 6)])
    sat_rows.append([crit['T'], crit['P'], crit['v'], crit['v'], crit['u'], crit['u'], crit['h'], crit['h'], crit['s'], crit['s']])

    # Single-phase grid: rows of constant pressure, each split at the saturation temperature into a
    # liquid segment (ending at saturated liquid) and a vapor segment (starting at saturated vapor).
    P_min = f['P_min'] or Pt
    lo, hi = math.log10(P_min), math.log10(f['P_max'])
    nice = [m * 10 ** k for k in range(-1, 6) for m in NICE]
    logs = [10 ** (lo + i * (hi - lo) / (30 * (hi - lo))) for i in range(int(30 * (hi - lo)) + 1)]
    Ps = sorted(set(sig(p, 6) for p in nice if P_min <= p <= f['P_max']) | {sig(P_min, 6), f['P_max']})
    for p in logs:
        if all(abs(math.log(p / q)) > 0.02 for q in Ps):
            Ps.append(sig(p, 4))
    Ps.sort()

    rows = []
    for P in Ps:
        if P < Pc:
            Tsat = CP.PropsSI('T', 'P', P * 1000.0, 'Q', 0, name) - 273.15
            L = [row_point(props(name, P=P, T=t)) for t in f['T_grid'] if t < Tsat - 1e-3 and t >= f['T_min']]
            L.append(row_point(props(name, P=P, Q=0)))
            V = [row_point(props(name, P=P, Q=1))]
            V += [row_point(props(name, P=P, T=t)) for t in f['T_grid'] if t > Tsat + 1e-3]
            rows.append({'P': P, 'Tsat': round(Tsat, 3), 'L': L, 'V': V})
        else:
            V = [row_point(props(name, P=P, T=t)) for t in f['T_grid'] if t >= f['T_min']]
            rows.append({'P': P, 'Tsat': None, 'L': [], 'V': V})

    table = {
        'fluid': f['id'],
        'name': f['name'],
        'source': f'CoolProp {CoolProp.__version__} ({f["formulation"]})',
        'reference': f['reference'],
        'units': {'T': '°C', 'P': 'kPa', 'v': 'm³/kg', 'u': 'kJ/kg', 'h': 'kJ/kg', 's': 'kJ/(kg·K)'},
        'critical': crit,
        'triple': {'T': round(Tt, 3), 'P': sig(Pt)},
        'limits': {'T_min': f['T_min'], 'T_max': f['T_max'], 'P_min': sig(P_min), 'P_max': f['P_max']},
        'sat': {'cols': ['T', 'P', 'vf', 'vg', 'uf', 'ug', 'hf', 'hg', 'sf', 'sg'], 'rows': sat_rows},
        'grid': {'cols': ['T', 'v', 'u', 'h', 's'], 'rows': rows},
    }
    return table, {'Tc': Tc, 'Pc': Pc, 'Pt': P_min}


def near_critical(T, P, c):
    return abs(T - c['Tc']) < 0.04 * (c['Tc'] + 273.15) and abs(P - c['Pc']) < 0.25 * c['Pc']


def checkpoints(f, c, n_single=500, n_two=120):
    name = f['coolprop']
    rnd = random.Random(300)
    pts = []
    lo, hi = math.log(c['Pt'] * 1.05), math.log(f['P_max'] * 0.98)
    while len([p for p in pts if p['kind'] == 'single']) < n_single:
        P = math.exp(rnd.uniform(lo, hi))
        T = rnd.uniform(f['T_min'] + 0.5, f['T_max'] - 1)
        if near_critical(T, P, c):
            continue
        if P < c['Pc']:
            Tsat = CP.PropsSI('T', 'P', P * 1000.0, 'Q', 0, name) - 273.15
            if abs(T - Tsat) < 0.5:
                continue
        try:
            s = props(name, P=P, T=T)
        except ValueError:
            continue
        pts.append({'kind': 'single', 'state': s})
    Tmax_two = c['Tc'] - 0.04 * (c['Tc'] + 273.15)
    for _ in range(n_two):
        T = rnd.uniform(f['T_min'] + 0.5, Tmax_two)
        x = rnd.uniform(0, 1)
        s = props(name, T=T, Q=x)
        s['x'] = x
        pts.append({'kind': 'two', 'state': s})
    for p in pts:
        p['state'] = {k: sig(v, 9) for k, v in p['state'].items()}
    return pts


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    checks = {}
    for f in FLUIDS:
        table, c = build(f)
        path = os.path.join(OUT_DIR, f'{f["id"]}.json')
        with open(path, 'w') as fh:
            json.dump(table, fh, separators=(',', ':'), ensure_ascii=False)
        n = sum(len(r['L']) + len(r['V']) for r in table['grid']['rows'])
        print(f'{path}: {len(table["sat"]["rows"])} saturation rows, {len(table["grid"]["rows"])} pressures, {n} grid states, {os.path.getsize(path) // 1024} KB')
        checks[f['id']] = checkpoints(f, c)
    with open(CHECK_FILE, 'w') as fh:
        json.dump({'source': f'CoolProp {CoolProp.__version__}', 'fluids': checks}, fh, separators=(',', ':'))
    print(f'{CHECK_FILE}: {sum(len(v) for v in checks.values())} checkpoints')


if __name__ == '__main__':
    main()
