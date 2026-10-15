// Lecciones 2.5 y 2.6: una QPU simulada con repeticiones (shots), el bucle
// híbrido clásico-cuántico y un modelo simplificado del éxito de un circuito.

/** Generador pseudoaleatorio reproducible (mulberry32). Devuelve números en [0, 1). */
export function seededRandom(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Probabilidad de medir 1 tras girar un qubit un ángulo θ desde 0: sin²(θ/2). */
export const probabilityOfOne = (theta) => Math.sin(theta / 2) ** 2;

/** QPU simulada: cuántas de `shots` repeticiones dan 1. */
export function runShots(theta, shots, random = Math.random) {
  const p1 = probabilityOfOne(theta);
  let ones = 0;
  for (let i = 0; i < shots; i += 1) if (random() < p1) ones += 1;
  return ones;
}

/** Paso del optimizador clásico de la lección (como bucle.py): θ ← θ + 2·(objetivo − medida). */
export const optimizerStep = (theta, measured, target, gain = 2) => theta + gain * (target - measured);

/** Ángulo que da exactamente la probabilidad `target`: θ = 2·asin(√target). */
export const idealTheta = (target) => 2 * Math.asin(Math.sqrt(target));

/** Error típico de una probabilidad estimada con `shots` repeticiones: √(p(1−p)/shots). */
export const shotError = (p, shots) => Math.sqrt((p * (1 - p)) / shots);

/** Modelo simplificado: el circuito acierta si todas sus operaciones salen bien, (1 − ε)^G. */
export const successProbability = (errorPerGate, gates) => (1 - errorPerGate) ** gates;

/** Operaciones de dos qubits de un circuito «cuadrado» simple: ⌊anchura/2⌋ por capa. */
export const twoQubitGates = (width, depth) => Math.floor(width / 2) * depth;

/** Procesadores ficticios de la lección 2.6 (no corresponden a ningún equipo real). */
export const PROCESSORS = [
  { id: 'A', name: 'Procesador A', qubits: 1000, error: 0.01, note: 'muchos qubits, operaciones poco fiables' },
  { id: 'B', name: 'Procesador B', qubits: 100, error: 0.001, note: 'menos qubits, operaciones diez veces mejores' },
  { id: 'C', name: 'Procesador C', qubits: 30, error: 0.0001, note: 'pocos qubits, operaciones excelentes' },
];

/** ¿Cabe el circuito y con qué probabilidad sale bien en cada procesador? */
export function evaluateCircuit(processor, width, depth) {
  const gates = twoQubitGates(width, depth);
  const fits = width <= processor.qubits;
  return { fits, gates, success: fits ? successProbability(processor.error, gates) : 0 };
}
