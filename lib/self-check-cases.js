// Small, curated conceptual cases. The tutor still evaluates the student's reasoning;
// neither matching a phrase nor selecting a topic awards a score.
const CASES = [
  { id: 'energy-balance', title: 'Choose an energy balance', skill: 'energy-balance', knowledgeType: 'situational',
    description: 'Choose the system, then decide which energy terms matter.',
    cases: [
      { id: 'turbine', question: 'Steam passes steadily through an insulated turbine with one inlet and one outlet. Changes in kinetic and potential energy are negligible. Choose a system boundary and explain which terms remain in its energy balance. What connects the steam’s enthalpy change to the shaft work?',
        focus: 'A fixed control volume with mass flow; no accumulation at steady state; negligible heat transfer, kinetic and potential changes; enthalpy and shaft work remain. State a work sign convention.',
        hint: 'Begin with a fixed boundary around the turbine. Does steam cross it? Then use each stated condition to remove a term from the general energy balance.' },
      { id: 'rigid-tank', question: 'A sealed, rigid tank is heated. There is no stirrer, electrical work, or appreciable change in kinetic or potential energy. Choose a system boundary and explain which terms remain in its energy balance. Should you use a change in internal energy or an inlet–outlet enthalpy difference?',
        focus: 'Closed system; no mass transfer; rigid boundary means no boundary work; no other work; Q equals the change in internal energy, using heat into the system as positive. No steady-flow inlet–outlet enthalpy terms.',
        hint: 'Ask whether mass crosses your chosen boundary, and whether that boundary moves. Those answers determine the form of the balance.' },
    ] },
  { id: 'state-properties', title: 'Identify a thermodynamic state', skill: 'state-properties', knowledgeType: 'conceptual',
    description: 'Explain when two reported properties determine a state.',
    cases: [
      { id: 'saturated-water', question: 'Water is reported at a pressure and at the saturation temperature for that pressure. Is that enough information to determine its specific volume? Explain what else, if anything, you need. No table lookup or numerical value is needed.',
        focus: 'At liquid–vapor saturation, pressure and temperature are dependent. Specific volume varies with phase/quality; identify saturated liquid, saturated vapor, or quality (or another suitable independent property) to fix the state.',
        hint: 'At one saturation pressure, compare saturated liquid, a liquid–vapor mixture, and saturated vapor. What happens to their temperature and their specific volume?' },
      { id: 'superheated-vapor', question: 'A pure substance is known to be a simple compressible system in a single superheated-vapor phase. Its pressure and temperature are specified. Are these enough to identify its equilibrium state and find its specific volume from an appropriate property model? Explain why this differs from liquid–vapor saturation.',
        focus: 'In the single-phase region, pressure and temperature can be independent and fix the equilibrium state of the simple compressible substance. At liquid–vapor saturation they are dependent. Do not infer ideal-gas accuracy solely from superheated status.',
        hint: 'Compare the independence of pressure and temperature in a single phase with their relationship along the saturation curve.' },
    ] },
  { id: 'entropy-balance', title: 'Separate entropy transfer and generation', skill: 'entropy-balance', knowledgeType: 'conceptual',
    description: 'Distinguish an insulated process from an isentropic one.',
    cases: [
      { id: 'insulated-turbine', question: 'An insulated turbine operates steadily with one inlet and one outlet, and friction makes its flow irreversible. Must the outlet specific entropy equal the inlet specific entropy? Explain using entropy transfer and entropy generation.',
        focus: 'Adiabatic means no entropy transfer with heat, not no entropy generation. For steady one-inlet/one-outlet flow, mass flow times (s_out − s_in) equals the nonnegative entropy generation rate. Irreversibility makes it positive here.',
        hint: 'In the entropy balance, distinguish the term involving heat transfer from the term for entropy generated inside the control volume.' },
      { id: 'paddle-tank', question: 'An insulated, sealed, rigid tank contains a fluid. A paddle wheel stirs the fluid irreversibly. Can the fluid’s entropy increase even though no heat enters the tank? Explain the roles of work and entropy generation.',
        focus: 'Work transfers energy but is not entropy transfer. With no mass or heat transfer, entropy change equals entropy generated; irreversible stirring can increase entropy. Rigid walls do not eliminate paddle-wheel shaft work.',
        hint: 'Write an entropy balance for a closed system. Which transfer terms are absent, and what term can still increase the entropy?' },
    ] },
];

const fail = (message) => Object.assign(new Error(message), { status: 400 });

export function selfCheckCatalog() {
  return CASES.map(({ id, title, description, skill, knowledgeType, cases }) => ({ id, title, description, skill, knowledgeType,
    cases: cases.map(({ id: caseId, question }) => ({ id: caseId, question })) }));
}

export function selfCheckCase(topicId, caseId) {
  const topic = CASES.find((item) => item.id === topicId);
  if (!topic) throw fail('Choose an available self-check topic.');
  const item = caseId === undefined ? topic.cases[0] : topic.cases.find((entry) => entry.id === caseId);
  if (!item) throw fail('Choose an available case for this topic.');
  return { topic, item };
}
