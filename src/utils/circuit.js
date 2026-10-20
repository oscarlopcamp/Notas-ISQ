// Simulador de circuitos de pocos qubits (vector de estado) para el Módulo 3.
// Convenio de Qiskit: el qubit 0 es el bit menos significativo (el de la derecha
// en las cadenas) y la línea de arriba en los diagramas.
// Las amplitudes se guardan como números complejos ({re, im}) para poder añadir
// más compuertas en la unidad 3.5; con H, X, Z y CNOT siempre son reales.

const R = Math.SQRT1_2;

/** Compuertas de un qubit: matrices 2×2 de números complejos [[a, b], [c, d]]. */
export const GATES = {
  H: { label: 'H', name: 'Mezcla', matrix: [[[R, 0], [R, 0]], [[R, 0], [-R, 0]]] },
  X: { label: 'X', name: 'Intercambio de 0 y 1', matrix: [[[0, 0], [1, 0]], [[1, 0], [0, 0]]] },
  Z: { label: 'Z', name: 'Cambio de signo del 1', matrix: [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]] },
};

/** Celdas de una columna: null (nada), 'H', 'X', 'Z', 'ctrl' (punto de control) o 'targ' (⊕). */
export const CTRL = 'ctrl';
export const TARG = 'targ';

export function zeroState(n) {
  const re = new Float64Array(2 ** n), im = new Float64Array(2 ** n);
  re[0] = 1;
  return { n, re, im };
}

const copy = (s) => ({ n: s.n, re: Float64Array.from(s.re), im: Float64Array.from(s.im) });

export function applyGate(state, gate, q) {
  const s = copy(state), m = GATES[gate].matrix, step = 1 << q;
  for (let x = 0; x < s.re.length; x += 1) {
    if (x & step) continue;
    const y = x | step;
    const [ar, ai, br, bi] = [state.re[x], state.im[x], state.re[y], state.im[y]];
    const mul = ([cr, ci], vr, vi) => [cr * vr - ci * vi, cr * vi + ci * vr];
    const [p, q1] = [mul(m[0][0], ar, ai), mul(m[0][1], br, bi)];
    const [r, t] = [mul(m[1][0], ar, ai), mul(m[1][1], br, bi)];
    s.re[x] = p[0] + q1[0]; s.im[x] = p[1] + q1[1];
    s.re[y] = r[0] + t[0]; s.im[y] = r[1] + t[1];
  }
  return s;
}

/** CNOT: si el qubit de control vale 1, intercambia 0 y 1 en el objetivo. */
export function applyCX(state, control, target) {
  const s = copy(state), c = 1 << control, t = 1 << target;
  for (let x = 0; x < s.re.length; x += 1) {
    if ((x & c) && !(x & t)) {
      const y = x | t;
      [s.re[x], s.re[y]] = [state.re[y], state.re[x]];
      [s.im[x], s.im[y]] = [state.im[y], state.im[x]];
    }
  }
  return s;
}

/** ¿Es válida una columna? Devuelve un mensaje de error o null. */
export function columnError(col) {
  const ctrls = col.filter((c) => c === CTRL).length, targs = col.filter((c) => c === TARG).length;
  if (targs === 0 && ctrls === 0) return null;
  if (targs !== 1 || ctrls !== 1) return 'Una CNOT necesita exactamente un punto de control (●) y un objetivo (⊕) en la misma columna.';
  if (col.some((c) => c && c !== CTRL && c !== TARG)) return 'En una columna con CNOT no puede haber otras compuertas.';
  return null;
}

/** Aplica una columna completa. */
export function applyColumn(state, col) {
  const ci = col.indexOf(CTRL), ti = col.indexOf(TARG);
  if (ci >= 0 && ti >= 0) return applyCX(state, ci, ti);
  return col.reduce((s, g, q) => (g && GATES[g] ? applyGate(s, g, q) : s), state);
}

/** Estado tras cada columna: [inicial, tras col 1, …]. Se detiene en la primera columna inválida. */
export function simulate(n, columns) {
  const states = [zeroState(n)];
  for (const col of columns) {
    if (columnError(col)) break;
    states.push(applyColumn(states[states.length - 1], col));
  }
  return states;
}

export const probabilitiesOf = (s) => Array.from(s.re, (r, x) => r * r + s.im[x] * s.im[x]);
