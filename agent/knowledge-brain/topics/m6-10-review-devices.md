---
id: topic:m6-10-review-devices
kind: topic
title: M6.10 — Review Devices
description: 'Review of common device modeling simplifications: nozzles, diffusers, throttles, heat exchangers,
  compressors, and turbines, grouped by passive vs. work input/output.'
parent: unit:m6-control-volumes-and-devices
unit: unit:m6-control-volumes-and-devices
lecture: M6.10
status: auto
audience: both
priority: 0.7
objectives:
- id: '#o1'
  text: Students can state the standard kinetic-energy, potential-energy, heat-transfer, and work simplifications
    for each device listed. (p. 2)
  kc_type: fact
  bloom: remember
- id: '#o2'
  text: Students can classify a device as passive ($\dot{W}=0$) or as a work input/output device from
    the review card. (p. 2)
  kc_type: skill
  bloom: understand
equations: []
misconceptions: []
examples: []
items:
- item:hw07-1
- item:hw07-2
sources:
- path: lectures/Module6_10_ReviewDevices_annotated.pdf
  pages:
  - 1
  - 2
generated:
  model: deepseek-v4-pro
  prompt_version: manual-ingest-2026-09-29
  at: '2026-09-29'
---

# M6.10 — Review Devices

> Drafted by AI (DeepSeek, from transcripts of the course files; checked by Claude) — not reviewed by an instructor. Handwriting in the source was occasionally misread; the cited pages are the authority.

## What this lecture covers
This lecture is a one-slide review of common devices in thermodynamics. It sorts nozzles, diffusers, throttles, and heat exchangers under "Passive ($\dot{W}=0$)" and compressors and turbines under "Work Input/output," then lists the simplified kinetic-energy, potential-energy, heat-transfer, and work terms used for each device (p. 2). Slide 1 is only the title slide (p. 1). Open this card when a student is setting up a device problem and needs to recall which terms are kept or neglected.

## Key ideas
- The review divides devices into two groups: passive devices with no work/power term, and work devices that either consume work or produce work (p. 2).
- For a nozzle, the slide records $V\uparrow$ and the simplification $\Delta pe=\dot{Q}=\dot{W}=0$; for a diffuser, $V\downarrow$ with the same $\Delta pe=\dot{Q}=\dot{W}=0$ (p. 2).
- A throttle is marked by a pressure drop, $P\downarrow$, and the slide keeps $\Delta ke=\Delta pe=\dot{Q}=\dot{W}=0$ (p. 2).
- A heat exchanger is the passive device where $\dot{Q}$ is retained; the slide sets $\Delta ke=\Delta pe=\dot{W}=0$ (p. 2).
- Compressors are listed as "work in" and turbines as "work out." Both are annotated with $\Delta ke=\Delta pe=\dot{Q}=0$ (p. 2).
- The deck gives no numerical examples and no derivations; it is a compact reference for device modeling choices (p. 2).

## Notation used
- $\dot{W}$ is the work or power transfer rate. The passive group sets $\dot{W}=0$ (p. 2).
- $\dot{Q}$ is the heat-transfer rate. It is set to zero for nozzles, diffusers, throttles, compressors, and turbines, and retained for heat exchangers (p. 2).
- $\Delta ke$ is the change in kinetic energy between inlet and outlet; $\Delta pe$ is the change in potential energy between inlet and outlet (p. 2).
