// Unidad 3.1: un qubit con amplitudes reales (las complejas llegan en el Módulo 4),
// su medición y su posición en la esfera de Bloch.

/** Probabilidades de obtener 0 y 1: el cuadrado de cada amplitud. */
export const probabilities = (a, b) => ({ p0: a * a, p1: b * b });

/** Suma de los cuadrados; vale 1 en un estado válido (normalizado). */
export const norm2 = (a, b) => a * a + b * b;

export const isNormalized = (a, b, tol = 1e-9) => Math.abs(norm2(a, b) - 1) <= tol;

/** Divide ambas amplitudes por la misma cantidad para que sus cuadrados sumen 1. */
export function normalize(a, b) {
  const len = Math.sqrt(norm2(a, b));
  if (len === 0) throw new RangeError('Las dos amplitudes no pueden ser 0 a la vez');
  return [a / len, b / len];
}

/**
 * Mide un qubit (a, b). Devuelve el bit obtenido y el estado posterior:
 * tras medir, el qubit queda en el estado base del resultado.
 */
export function measure(a, b, random = Math.random) {
  const bit = random() < b * b ? 1 : 0;
  return { bit, after: bit ? [0, 1] : [1, 0] };
}

/** Estado con amplitudes reales a partir del ángulo θ de la esfera de Bloch (en radianes). */
export const fromTheta = (theta) => [Math.cos(theta / 2), Math.sin(theta / 2)];

/** Probabilidades a partir de los ángulos de Bloch: solo dependen de θ, no de φ. */
export function blochProbabilities(theta) {
  const p0 = Math.cos(theta / 2) ** 2;
  return { p0, p1: 1 - p0 };
}

/** Punto (x, y, z) de la esfera de Bloch: θ desde el polo norte, φ alrededor del eje vertical. */
export const blochPoint = (theta, phi) => ({
  x: Math.sin(theta) * Math.cos(phi),
  y: Math.sin(theta) * Math.sin(phi),
  z: Math.cos(theta),
});

/** Texto «a|0⟩ + b|1⟩» con amplitudes redondeadas; omite los términos nulos. */
export function ketText(a, b, digits = 3) {
  const f = (x) => {
    const r = Number(x.toFixed(digits));
    return Object.is(r, -0) ? 0 : r;
  };
  const [ra, rb] = [f(a), f(b)];
  const term = (c, k) => (c === 1 ? `|${k}⟩` : c === -1 ? `−|${k}⟩` : `${String(c).replace('-', '−')}|${k}⟩`);
  if (ra === 0 && rb === 0) return '0';
  if (rb === 0) return term(ra, 0);
  if (ra === 0) return term(rb, 1);
  return `${term(ra, 0)} ${rb < 0 ? '−' : '+'} ${term(Math.abs(rb), 1)}`;
}

// ---------- Unidad 3.2: mezcla, fase, entrelazamiento e interferencia ----------
// La «mezcla» es la operación del divisor de haz de la lección 2.1 (la compuerta
// de Hadamard, que se presenta con ese nombre en la lección 3.11).

const R = Math.SQRT1_2;

/** Mezcla de un qubit: (a, b) → ((a + b)/√2, (a − b)/√2). */
export const mix = (a, b) => [(a + b) * R, (a - b) * R];

/** Operaciones de un qubit con amplitudes reales. */
export const OPS = {
  M: { label: 'Mezclar', apply: ([a, b]) => mix(a, b) },
  S: { label: 'Cambiar signo del 1', apply: ([a, b]) => [a, -b] },
  X: { label: 'Intercambiar 0 y 1', apply: ([a, b]) => [b, a] },
};

/** Aplica una secuencia de operaciones (p. ej., 'MSM') desde un estado; devuelve todos los pasos. */
export function runOps(ops, start = [1, 0]) {
  const steps = [start];
  for (const op of ops) steps.push(OPS[op].apply(steps[steps.length - 1]));
  return steps;
}

/** Contribuciones de cada amplitud de entrada a cada salida de una mezcla (para ver la interferencia). */
export const mixContributions = (a, b) => ({ to0: [a * R, b * R], to1: [a * R, -b * R] });

/** Fase relativa φ entre dos amplitudes iguales: P(0) directa = 1/2; tras mezclar, cos²(φ/2). */
export const phaseMixP0 = (phi) => Math.cos(phi / 2) ** 2;

/** Estado de dos qubits [a00, a01, a10, a11]; mezcla el qubit 0 (izquierdo) o 1 (derecho). */
export function mixQubit(state, q) {
  const e = [...state];
  const pairs = q === 0 ? [[0, 2], [1, 3]] : [[0, 1], [2, 3]];
  for (const [i, j] of pairs) [e[i], e[j]] = [(e[i] + e[j]) * R, (e[i] - e[j]) * R];
  return e;
}

export const BELL = [R, 0, 0, R];

/** Mide dos qubits: devuelve '00', '01', '10' o '11'. */
export function measurePair(state, random = Math.random) {
  let u = random();
  const labels = ['00', '01', '10', '11'];
  for (let k = 0; k < 4; k += 1) { u -= state[k] ** 2; if (u < 0) return labels[k]; }
  // Por redondeo, u puede no llegar a ser negativo: se devuelve el último resultado posible.
  for (let k = 3; k >= 0; k -= 1) if (state[k] !== 0) return labels[k];
  return labels[0];
}

/** ¿Es un estado producto (a|0⟩+b|1⟩)(c|0⟩+d|1⟩)? Ocurre si y solo si a00·a11 = a01·a10. */
export const isProduct = ([p, q, r, s], tol = 1e-12) => Math.abs(p * s - q * r) < tol;

// ---------- Unidad 3.3: sistemas de n qubits ----------
// Convenio de Qiskit: el qubit 0 es el bit de la DERECHA de la cadena, y la cadena
// leída en binario es la posición de la amplitud en la lista (lección 3.9).

/** Etiqueta del estado base x con n qubits: '0110', con el qubit 0 a la derecha. */
export const basisLabel = (x, n) => x.toString(2).padStart(n, '0');

/** Estado de qubits independientes; qubits[k] = [a, b] es el qubit k. Longitud 2^n. */
export function productState(qubits) {
  const n = qubits.length;
  return Array.from({ length: 2 ** n }, (_, x) => qubits.reduce((amp, [a, b], k) => amp * ((x >> k) & 1 ? b : a), 1));
}

/** Estado GHZ de n qubits: (|00…0⟩ + |11…1⟩)/√2. */
export function ghzState(n) {
  const s = new Array(2 ** n).fill(0);
  s[0] = R; s[2 ** n - 1] = R;
  return s;
}

/** Mide un estado de n qubits: devuelve el índice x del resultado. */
export function sampleIndex(state, random = Math.random) {
  let u = random();
  for (let x = 0; x < state.length; x += 1) { u -= state[x] ** 2; if (u < 0) return x; }
  for (let x = state.length - 1; x >= 0; x -= 1) if (state[x] !== 0) return x; // redondeo
  return 0;
}
