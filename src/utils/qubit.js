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
