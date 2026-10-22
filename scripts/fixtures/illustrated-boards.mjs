// Authored examples for layout and teaching review, using symbolic balances only.
export const illustrationBoards = [
  {
    kind: 'solution', title: 'Piston expansion: connect motion to work',
    nodes: [
      { id: 'gas', label: 'Gas in cylinder', kind: 'component', x: 25, y: 50, illustration: 'piston-cylinder', contents: 'gas', surroundings: 'air', boundary: 'closed-system' },
      { id: 'surroundings', label: 'Surroundings', kind: 'state', x: 80, y: 50 },
    ],
    arrows: [{ from: 'gas', to: 'surroundings', label: 'boundary work', kind: 'work' }],
    steps: [
      { label: 'Define the system', note: 'A fixed mass of gas. The piston permits boundary motion.' },
      { label: 'Work during expansion', latex: 'W_b=\\int_{V_1}^{V_2}P_{ext}\\,dV', note: 'Expansion transfers work to the surroundings; the drawing is not a measured piston position.' },
      { label: 'Energy balance', latex: '\\Delta U=Q-W_b', note: 'For this closed system, neglect changes in kinetic and potential energy.' },
    ],
  },
  {
    kind: 'solution', title: 'Hose and nozzle: follow the same stream',
    nodes: [
      { id: 'hose', label: 'Hose: state 1', kind: 'component', x: 20, y: 50, illustration: 'hose', surroundings: 'air' },
      { id: 'nozzle', label: 'Nozzle: state 2', kind: 'component', x: 75, y: 50, illustration: 'nozzle', surroundings: 'air', boundary: 'control-volume' },
    ],
    arrows: [{ from: 'hose', to: 'nozzle', label: 'mass flow', kind: 'flow' }],
    steps: [
      { label: 'Steady mass balance', latex: '\\rho_1 A_1 V_1=\\rho_2 A_2 V_2', note: 'Use the same numbered states on the drawing and in the equation.' },
      { label: 'Incompressible limit', latex: 'A_1V_1=A_2V_2', note: 'Equal density is an assumption; a smaller area then means higher speed.' },
    ],
  },
  {
    kind: 'solution', title: 'Cooling a submerged solid',
    nodes: [
      { id: 'solid', label: 'Initially hot solid', kind: 'component', x: 20, y: 50, illustration: 'immersed-object', surroundings: 'water', boundary: 'closed-system' },
      { id: 'water', label: 'Surrounding water', kind: 'state', x: 80, y: 50 },
    ],
    arrows: [{ from: 'solid', to: 'water', label: 'heat', kind: 'heat' }],
    steps: [
      { label: 'Identify the transfer', note: 'The hotter solid transfers heat to the cooler water.' },
      { label: 'Combined balance', latex: '\\Delta U_{solid}+\\Delta U_{water}=0', note: 'This balance assumes no heat loss from the combined system and no work.' },
    ],
  },
  {
    kind: 'solution', title: 'Refrigerator: account for the room',
    nodes: [
      { id: 'cold', label: 'Cold space', kind: 'state', x: 12, y: 50 },
      { id: 'fridge', label: 'Refrigerator cycle', kind: 'component', x: 50, y: 50, illustration: 'refrigerator', surroundings: 'air' },
      { id: 'room', label: 'Warm room', kind: 'state', x: 88, y: 50 },
      { id: 'power', label: 'Electrical supply', kind: 'state', x: 50, y: 90 },
    ],
    arrows: [
      { from: 'cold', to: 'fridge', label: 'Q_L', kind: 'heat' },
      { from: 'fridge', to: 'room', label: 'Q_H', kind: 'heat' },
      { from: 'power', to: 'fridge', label: 'W_in', kind: 'work' },
    ],
    steps: [
      { label: 'Cycle energy balance', latex: 'Q_H=Q_L+W_{in}', note: 'The room receives both the removed heat and the energy supplied as work.' },
      { label: 'Refrigerator performance', latex: 'COP_R=Q_L/W_{in}', note: 'Use heat removed from the cold space as the useful output.' },
    ],
  },
];
export const illustratedLessonInput = {
  board: illustrationBoards[0],
  segments: [
    { speech: 'Start with the gas inside this piston cylinder. The dashed line marks our closed system, with air outside.', cues: [{ target: 'node:gas', at: 0 }, { target: 'step:0', at: .5 }] },
    { speech: 'As the gas expands, the piston moves and work goes to the surroundings. The integral adds that boundary work over the volume change.', cues: [{ target: 'node:surroundings', at: 0 }, { target: 'arrow:0', at: .25 }, { target: 'step:1', at: .55 }] },
    { speech: 'The change in internal energy equals heat supplied minus work done by the gas, when kinetic and potential energy changes are negligible.', cues: [{ target: 'step:2', at: 0 }] },
  ],
};
