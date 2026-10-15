// Lecciones 2.3 y 2.4: tamaño de los espacios de estados, simulación densa y
// un modelo simplificado del punto de cruce entre algoritmos clásicos y cuánticos.

const UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

/** Bytes legibles en unidades binarias; por encima de YiB, en notación científica. */
export function formatBytes(bytes) {
  let v = bytes, u = 0;
  while (v >= 1024 && u < UNITS.length - 1) { v /= 1024; u += 1; }
  if (v >= 1024) return `${bytes.toExponential(2).replace('e+', ' × 10^')} B`;
  return `${v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2)} ${UNITS[u]}`;
}

/** Memoria de un vector de estado completo: 2^n amplitudes de 16 bytes (dos binary64). */
export const statevectorBytes = (n, bytesPerAmplitude = 16) => 2 ** n * bytesPerAmplitude;

/**
 * Actualiza todas las amplitudes por parejas, como hace una operación sobre un
 * qubit en un simulador de vector de estado (aquí, la operación de Hadamard).
 * `state` intercala partes real e imaginaria: [re0, im0, re1, im1, …].
 */
export function applyPairUpdate(state, n, target) {
  const r = Math.SQRT1_2;
  const step = 1 << target;
  const size = 1 << n;
  for (let i = 0; i < size; i += 1) {
    if (i & step) continue;
    const j = i | step;
    const ar = state[2 * i], ai = state[2 * i + 1], br = state[2 * j], bi = state[2 * j + 1];
    state[2 * i] = r * (ar + br); state[2 * i + 1] = r * (ai + bi);
    state[2 * j] = r * (ar - br); state[2 * j + 1] = r * (ai - bi);
  }
}

/**
 * Punto de cruce entre un algoritmo clásico y uno cuántico.
 * Cada operación clásica tarda tc segundos y cada operación cuántica, s·tc
 * (s = «ralentización», incluye el coste de la corrección de errores).
 *   kind 'quadratic':   clásico N, cuántico √N       →  N* = s²
 *   kind 'quartic':     clásico N, cuántico N^(1/4)  →  N* = s^(4/3)
 *   kind 'exponential': clásico 2^n, cuántico n³     →  n* resuelto numéricamente (N = 2^n)
 * Devuelve { N, seconds } con el tamaño de entrada y el tiempo en el cruce.
 */
export function crossover(kind, slowdown, tc = 1e-9) {
  if (kind === 'quadratic') { const N = slowdown ** 2; return { N, seconds: tc * N }; }
  if (kind === 'quartic') { const N = slowdown ** (4 / 3); return { N, seconds: tc * N }; }
  // exponencial: buscar el menor n con 2^n ≥ s·n³
  let n = 1;
  while (2 ** n < slowdown * n ** 3 && n < 2000) n += 1;
  return { N: 2 ** n, n, seconds: tc * 2 ** n };
}

/** Tiempo (s) de cada algoritmo para un tamaño N según el modelo anterior. */
export function runtimes(kind, N, slowdown, tc = 1e-9) {
  if (kind === 'quadratic') return { classical: tc * N, quantum: tc * slowdown * Math.sqrt(N) };
  if (kind === 'quartic') return { classical: tc * N, quantum: tc * slowdown * N ** 0.25 };
  const n = Math.log2(N);
  return { classical: tc * N, quantum: tc * slowdown * n ** 3 };
}
