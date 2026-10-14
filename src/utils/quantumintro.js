// Modelos del Módulo 2: interferómetro de Mach–Zehnder ideal y problema de Deutsch.
// Funciones puras, cubiertas por tests/.

/**
 * Probabilidades de detección en un interferómetro de Mach–Zehnder ideal con
 * divisores 50/50, para un fotón cada vez.
 *   phase:     desfase (radianes) introducido en el camino superior
 *   blocked:   el camino inferior está bloqueado (el obstáculo absorbe el fotón)
 *   whichPath: se registra por qué camino va el fotón (se destruye la interferencia)
 *   model:     'quantum' (amplitudes) o 'classical' (cada divisor elige al azar)
 * Devuelve { d0, d1, absorbed }.
 */
export function interferometer({ phase = 0, blocked = false, whichPath = false, model = 'quantum' } = {}) {
  if (blocked) return { d0: 0.25, d1: 0.25, absorbed: 0.5 };
  if (model === 'classical' || whichPath) return { d0: 0.5, d1: 0.5, absorbed: 0 };
  // Amplitud en D0: (1 + e^{iφ})/2  →  probabilidad cos²(φ/2)
  const d0 = Math.cos(phase / 2) ** 2;
  return { d0, d1: 1 - d0, absorbed: 0 };
}

/** Elige un resultado según las probabilidades, con un generador uniforme en [0, 1). */
export function sampleOutcome(probs, rand = Math.random) {
  const u = rand();
  if (u < probs.d0) return 'd0';
  if (u < probs.d0 + probs.d1) return 'd1';
  return 'absorbed';
}

/** Las cuatro funciones de un bit del problema de Deutsch. */
export const DEUTSCH_FUNCTIONS = [
  { id: 'c0', name: 'constante 0', f: () => 0, kind: 'constante' },
  { id: 'c1', name: 'constante 1', f: () => 1, kind: 'constante' },
  { id: 'id', name: 'identidad', f: (x) => x, kind: 'balanceada' },
  { id: 'not', name: 'negación', f: (x) => 1 - x, kind: 'balanceada' },
];

/** Funciones compatibles con las consultas hechas: { 0: valor, 1: valor }. */
export function compatibleFunctions(queries) {
  return DEUTSCH_FUNCTIONS.filter((fn) => Object.entries(queries).every(([x, y]) => fn.f(Number(x)) === y));
}

/** ¿Las consultas hechas bastan para decidir con certeza si f es constante o balanceada? */
export function decided(queries) {
  const kinds = new Set(compatibleFunctions(queries).map((fn) => fn.kind));
  return kinds.size === 1 ? [...kinds][0] : null;
}
