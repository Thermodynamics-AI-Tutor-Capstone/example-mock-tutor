export const lessonInput = {
  board: {
    kind: 'solution',
    title: 'A turbine: start with the system',
    nodes: [
      { id: 'inlet', label: 'Inlet', kind: 'state', x: 15, y: 50 },
      { id: 'turbine', label: 'Turbine', kind: 'component', x: 50, y: 50 },
      { id: 'outlet', label: 'Outlet', kind: 'state', x: 85, y: 50 },
    ],
    arrows: [
      { from: 'inlet', to: 'turbine', label: 'mass in', kind: 'flow' },
      { from: 'turbine', to: 'outlet', label: 'mass out', kind: 'flow' },
    ],
    steps: [
      { label: 'Choose the system', note: 'A fixed control volume around the turbine.' },
      { label: 'Steady mass balance', latex: '\\dot m_{in}=\\dot m_{out}', note: 'At steady state, mass does not accumulate.' },
    ],
  },
  segments: [
    { speech: 'Start by drawing a control volume around the turbine. We will track the mass crossing its boundary.', cues: [{ target: 'node:turbine', at: 0 }, { target: 'step:0', at: .5 }] },
    { speech: 'Steam enters at the inlet and leaves at the outlet. The blue arrows show the direction of mass flow.', cues: [{ target: 'node:inlet', at: 0 }, { target: 'node:outlet', at: .2 }, { target: 'arrow:0', at: .4 }, { target: 'arrow:1', at: .65 }] },
    { speech: 'At steady state, the mass flow rate in equals the mass flow rate out. Which words in your problem justify steady state?', cues: [{ target: 'step:1', at: .1 }] },
  ],
};
