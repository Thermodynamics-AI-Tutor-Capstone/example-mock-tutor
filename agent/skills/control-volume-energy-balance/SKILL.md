---
name: control-volume-energy-balance
description: Checklist for setting up mass and energy balances on steady-flow devices (nozzles, diffusers, turbines, compressors, pumps, throttles, heat exchangers, mixing chambers); use when a student analyses an open system.
---

# Control-volume energy balance (steady flow)

> Starter draft written by an AI assistant — not reviewed by a thermodynamics instructor. Edit freely.

## Setup checklist

1. **Draw the control volume.** Mark every inlet, exit, heat transfer, and work (shaft or electrical).
2. **State the assumptions:** steady state; which kinetic/potential energy changes are negligible;
   adiabatic or not; ideal gas or tables.
3. **Mass balance:** $\sum \dot m_{in} = \sum \dot m_{out}$. Single stream: $\dot m_1 = \dot m_2 = \dot m$,
   with $\dot m = \rho A V = A V / v$.
4. **Energy balance:**
$$\dot Q_{cv} - \dot W_{cv} = \sum_{out} \dot m\left(h + \frac{V^2}{2} + gz\right) - \sum_{in} \dot m\left(h + \frac{V^2}{2} + gz\right)$$
   Single stream, per unit mass: $q - w = (h_2 - h_1) + \dfrac{V_2^2 - V_1^2}{2} + g(z_2 - z_1)$.
5. **Cross out terms** using the device table below, then solve.

## Sign convention

The form above uses $\dot Q$ **into** the system positive and $\dot W$ **out of** the system
positive (common in many US textbooks). Some courses use other conventions — check which one the
course uses and stay consistent.

## Which terms usually vanish

| Device | $\dot Q$ | $\dot W$ | $\Delta KE$ | Key result |
|---|---|---|---|---|
| Nozzle / diffuser | ≈ 0 | 0 | **kept** | $h_1 + V_1^2/2 = h_2 + V_2^2/2$ |
| Turbine | often ≈ 0 | out (+) | usually ≈ 0 | $\dot W = \dot m (h_1 - h_2)$ |
| Compressor / pump | often ≈ 0 | in (−) | usually ≈ 0 | $\dot W_{in} = \dot m (h_2 - h_1)$; pump: $w_{in} \approx v\,\Delta P$ |
| Throttling valve | ≈ 0 | 0 | ≈ 0 | $h_2 = h_1$ |
| Heat exchanger (whole unit) | ≈ 0 to surroundings | 0 | ≈ 0 | $\sum \dot m_{hot}\,\Delta h_{hot} = -\sum \dot m_{cold}\,\Delta h_{cold}$ |
| Mixing chamber | ≈ 0 | 0 | ≈ 0 | $\sum \dot m_{in} h_{in} = \sum \dot m_{out} h_{out}$ |

"Usually" means: check the problem statement. If velocities are given and differ a lot, keep $\Delta KE$.
For a heat exchanger, a control volume around only one stream has $\dot Q \ne 0$.

## Units

- $h$ in kJ/kg, $\dot m$ in kg/s → $\dot m\,h$ in kW.
- $V^2/2$ in m²/s² = J/kg. **Divide by 1000** to get kJ/kg before adding to $h$.
- $gz$ is also J/kg — same conversion.
- Per-unit-mass answers are kJ/kg; rate answers are kW. Don't mix them in one equation.

## Sanity checks

- Turbine work output positive; compressor/pump work input positive.
- Nozzle: velocity rises, enthalpy falls. Diffuser: the reverse.
- Throttling a saturated liquid usually produces a mixture at lower $T$ and $P$.
