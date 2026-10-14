// Crecimiento de funciones de coste y búsqueda exhaustiva (problema del viajante).
// Funciones puras, cubiertas por tests/.

export const GROWTH = [
  { id: 'log', label: 'log₂ n', tex: '\\log_2 n', f: (n) => Math.log2(n) },
  { id: 'n', label: 'n', tex: 'n', f: (n) => n },
  { id: 'nlogn', label: 'n log₂ n', tex: 'n \\log_2 n', f: (n) => n * Math.log2(n) },
  { id: 'n2', label: 'n²', tex: 'n^2', f: (n) => n ** 2 },
  { id: 'n3', label: 'n³', tex: 'n^3', f: (n) => n ** 3 },
  { id: '2n', label: '2ⁿ', tex: '2^n', f: (n) => 2 ** n },
  { id: 'fact', label: 'n!', tex: 'n!', f: (n) => factorial(n) },
];

export function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i += 1) r *= i;
  return r;
}

export const SECONDS_PER_YEAR = 3600 * 24 * 365.25;
export const AGE_OF_UNIVERSE_YEARS = 1.38e10; // ≈ 13 800 millones de años (orden de magnitud)

/** Tiempo legible para `ops` operaciones a `rate` operaciones por segundo. */
export function humanTime(ops, rate = 1e9) {
  const s = ops / rate;
  if (!Number.isFinite(s)) return 'más que cualquier escala física';
  if (s < 1e-6) return `${(s * 1e9).toPrecision(3)} ns`;
  if (s < 1e-3) return `${(s * 1e6).toPrecision(3)} µs`;
  if (s < 1) return `${(s * 1e3).toPrecision(3)} ms`;
  if (s < 60) return `${s.toPrecision(3)} s`;
  if (s < 3600) return `${(s / 60).toPrecision(3)} min`;
  if (s < 86400) return `${(s / 3600).toPrecision(3)} h`;
  const years = s / SECONDS_PER_YEAR;
  if (years < 1) return `${(s / 86400).toPrecision(3)} días`;
  if (years < 1e6) return `${years.toPrecision(3)} años`;
  return `${years.toExponential(2).replace('e+', ' × 10^')} años`;
}

/** Número de rutas cerradas distintas entre n ciudades (sin contar sentido ni punto de partida). */
export const tourCount = (n) => (n < 3 ? 1 : factorial(n - 1) / 2);

/** Puntos pseudoaleatorios reproducibles en [0,1]². */
export function seededPoints(n, seed = 1) {
  let a = seed >>> 0;
  const rand = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: n }, () => [0.08 + rand() * 0.84, 0.08 + rand() * 0.84]);
}

const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
export const tourLength = (points, tour) => tour.reduce((s, c, i) => s + dist(points[c], points[tour[(i + 1) % tour.length]]), 0);

/**
 * Búsqueda exhaustiva: fija la ciudad 0 y prueba todas las permutaciones del resto.
 * Devuelve la mejor ruta y cuántas permutaciones se evaluaron, (n − 1)!.
 */
export function tspBruteForce(points) {
  const n = points.length;
  const rest = Array.from({ length: n - 1 }, (_, i) => i + 1);
  let best = null, bestLen = Infinity, evaluated = 0;
  const permute = (arr, k) => {
    if (k === arr.length) {
      evaluated += 1;
      const tour = [0, ...arr];
      const len = tourLength(points, tour);
      if (len < bestLen - 1e-12) { bestLen = len; best = tour; }
      return;
    }
    for (let i = k; i < arr.length; i += 1) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  permute(rest, 0);
  return { tour: best, length: bestLen, evaluated };
}

/** Heurística del vecino más cercano: rápida, pero sin garantía de ser óptima. */
export function nearestNeighbor(points) {
  const n = points.length;
  const visited = new Set([0]);
  const tour = [0];
  while (tour.length < n) {
    const last = points[tour[tour.length - 1]];
    let best = -1, bestD = Infinity;
    for (let i = 0; i < n; i += 1) if (!visited.has(i) && dist(last, points[i]) < bestD) { best = i; bestD = dist(last, points[i]); }
    visited.add(best);
    tour.push(best);
  }
  return { tour, length: tourLength(points, tour) };
}
