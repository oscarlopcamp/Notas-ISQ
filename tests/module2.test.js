// Pruebas del Módulo 2. Los valores esperados coinciden con los programas Python
// de las lecciones 2.1 y 2.2 (CPython 3.14).

import { suite, equal, assert } from './run.js';
import { interferometer, sampleOutcome, DEUTSCH_FUNCTIONS, compatibleFunctions, decided } from '../src/utils/quantumintro.js';
import { EVENTS, CATEGORIES } from '../content/module-02/historia-datos.js';
import { references } from '../references/references.js';
import { seededRandom, probabilityOfOne, runShots, optimizerStep, idealTheta, shotError, successProbability, twoQubitGates, PROCESSORS, evaluateCircuit } from '../src/utils/hardware.js';
import { EPISTEMIC } from '../src/components/blocks.js';

const close = (a, b, eps = 1e-12) => Math.abs(a - b) < eps;

suite('2.1 Interferómetro de Mach–Zehnder (src/utils/quantumintro.js)', (t) => {
  t('sin desfase: todo a D0 (como interferometro.py)', () => {
    const p = interferometer();
    assert(close(p.d0, 1) && close(p.d1, 0), JSON.stringify(p));
  });
  t('desfase de 180°: todo a D1', () => {
    const p = interferometer({ phase: Math.PI });
    assert(close(p.d0, 0) && close(p.d1, 1), JSON.stringify(p));
  });
  t('desfase de 90°: 1/2 y 1/2', () => assert(close(interferometer({ phase: Math.PI / 2 }).d0, 0.5)));
  t('camino bloqueado: 1/4, 1/4 y 1/2 absorbido', () => equal(interferometer({ blocked: true }), { d0: 0.25, d1: 0.25, absorbed: 0.5 }));
  t('registrar el camino destruye la interferencia', () => equal(interferometer({ whichPath: true }), { d0: 0.5, d1: 0.5, absorbed: 0 }));
  t('el modelo clásico da 1/2 con cualquier desfase', () => [0, 1, 2, 3].forEach((ph) => equal(interferometer({ phase: ph, model: 'classical' }).d0, 0.5)));
  t('las probabilidades suman 1', () => {
    for (let deg = 0; deg <= 360; deg += 15) {
      const p = interferometer({ phase: (deg * Math.PI) / 180 });
      assert(close(p.d0 + p.d1 + p.absorbed, 1), `φ=${deg}`);
    }
  });
  t('muestreo respeta las probabilidades', () => {
    const p = { d0: 0.25, d1: 0.25, absorbed: 0.5 };
    equal([0.1, 0.3, 0.9].map((u) => sampleOutcome(p, () => u)), ['d0', 'd1', 'absorbed']);
  });
});

suite('2.2 Problema de Deutsch', (t) => {
  t('dos funciones constantes y dos balanceadas', () => equal(DEUTSCH_FUNCTIONS.map((f) => f.kind).sort(), ['balanceada', 'balanceada', 'constante', 'constante']));
  t('con f(0) = 0 quedan «constante 0» e «identidad» (como deutsch_clasico.py)', () => equal(compatibleFunctions({ 0: 0 }).map((f) => f.name), ['constante 0', 'identidad']));
  t('ninguna consulta individual decide', () => {
    [{ 0: 0 }, { 0: 1 }, { 1: 0 }, { 1: 1 }].forEach((q) => equal(decided(q), null, JSON.stringify(q)));
  });
  t('dos consultas deciden siempre', () => {
    DEUTSCH_FUNCTIONS.forEach((fn) => equal(decided({ 0: fn.f(0), 1: fn.f(1) }), fn.kind, fn.name));
  });
});

suite('2.2 Datos de la línea de tiempo (content/module-02/historia-datos.js)', (t) => {
  t('ordenados por año', () => EVENTS.forEach((e, i) => assert(i === 0 || EVENTS[i - 1].year <= e.year, `${e.title}`)));
  t('categorías y estatus válidos', () => EVENTS.forEach((e) => { assert(CATEGORIES[e.cat], e.title); assert(EPISTEMIC[e.status], e.title); }));
  t('cada hito cita referencias existentes y verificadas', () => {
    EVENTS.forEach((e) => {
      assert(e.refs.length > 0, e.title);
      e.refs.forEach((k) => { assert(references[k], `${e.title}: ${k}`); equal(references[k].verification?.status, 'verificado', k); });
    });
  });
  t('el año del hito es coherente con sus fuentes (salvo reediciones y publicaciones posteriores)', () => {
    const exceptions = new Set(['bennett2014', 'simon1997', 'shor1997', 'bernstein1997', 'fips203', 'fips204', 'fips205', 'bennett1997']);
    EVENTS.forEach((e) => e.refs.forEach((k) => {
      if (exceptions.has(k)) return;
      assert(Math.abs(references[k].year - e.year) <= 1, `${e.title} (${e.year}) ↔ ${k} (${references[k].year})`);
    }));
  });
});

import { formatBytes, statevectorBytes, applyPairUpdate, crossover, runtimes } from '../src/utils/advantage.js';

suite('2.3–2.4 Espacio de estados y punto de cruce (src/utils/advantage.js)', (t) => {
  t('memoria de 30 y 50 qubits: 16 GiB y 16 PiB (como memoria.py)', () => {
    equal([statevectorBytes(30), statevectorBytes(50)], [17179869184, 18014398509481984]);
    equal([formatBytes(statevectorBytes(30)), formatBytes(statevectorBytes(50))], ['16.0 GiB', '16.0 PiB']);
  });
  t('la actualización por parejas conserva la norma y es su propia inversa', () => {
    const n = 5, s = new Float64Array(2 * 2 ** n);
    for (let i = 0; i < s.length; i += 1) s[i] = Math.sin(i + 1);
    const norm = (v) => v.reduce((a, x) => a + x * x, 0);
    const before = [...s], n0 = norm(s);
    applyPairUpdate(s, n, 2);
    assert(Math.abs(norm(s) - n0) < 1e-12, 'norma');
    applyPairUpdate(s, n, 2);
    assert(s.every((x, i) => Math.abs(x - before[i]) < 1e-12), 'inversa');
  });
  t('cruce cuadrático: N* = s² y T* = s²·1 ns (como cruce.py)', () => {
    const q = crossover('quadratic', 1e6);
    assert(q.N === 1e12 && Math.abs(q.seconds - 1e3) < 1e-9, JSON.stringify(q)); // 1e-9 × 1e12 no es exactamente 1000 en binary64
    assert(Math.abs(crossover('quadratic', 1e9).seconds / 31557600 - 31.7) < 0.1);
  });
  t('cruce cuártico con s = 10⁶: N* = 10⁸, 0,1 s', () => {
    const c = crossover('quartic', 1e6);
    assert(Math.abs(c.N / 1e8 - 1) < 1e-9 && Math.abs(c.seconds - 0.1) < 1e-9, JSON.stringify(c));
  });
  t('en el cruce, ambos tiempos coinciden aproximadamente', () => {
    ['quadratic', 'quartic'].forEach((k) => {
      const c = crossover(k, 1e5), r = runtimes(k, c.N, 1e5);
      assert(Math.abs(r.classical / r.quantum - 1) < 1e-6, k);
    });
    const e = crossover('exponential', 1e6), r = runtimes('exponential', e.N, 1e6), r1 = runtimes('exponential', e.N / 2, 1e6);
    assert(r.classical >= r.quantum && r1.classical < r1.quantum, 'exponencial: menor n que cruza');
  });
});

suite('2.5 y 2.6 QPU simulada y métricas (src/utils/hardware.js)', (t) => {
  t('P(1) = sin²(θ/2): 0 con θ = 0, 1 con θ = π', () => assert(close(probabilityOfOne(0), 0) && close(probabilityOfOne(Math.PI), 1)));
  t('el ángulo ideal para un 70 % es ≈ 1,982 rad', () => assert(Math.abs(idealTheta(0.7) - 1.982) < 1e-3 && close(probabilityOfOne(idealTheta(0.7)), 0.7)));
  t('las repeticiones simuladas se acercan a la probabilidad real', () => {
    const rnd = seededRandom(42), n = 20000, p = probabilityOfOne(idealTheta(0.7));
    const est = runShots(idealTheta(0.7), n, rnd) / n;
    assert(Math.abs(est - p) < 4 * shotError(p, n), String(est));
  });
  t('el generador con semilla es reproducible', () => {
    const a = seededRandom(5), b = seededRandom(5);
    equal([a(), a(), a()], [b(), b(), b()]);
  });
  t('paso del optimizador como bucle.py: 0.5 + 2·(0.7 − 0.072) = 1.756', () => assert(close(optimizerStep(0.5, 0.072, 0.7), 1.756)));
  t('el bucle sin ruido converge al ángulo ideal', () => {
    let th = 0.5;
    for (let i = 0; i < 30; i += 1) th = optimizerStep(th, probabilityOfOne(th), 0.7);
    assert(Math.abs(th - idealTheta(0.7)) < 1e-9, String(th));
  });
  t('error típico con p = 0,5: 0,05 con 100 shots y 0,01 con 2500', () => assert(close(shotError(0.5, 100), 0.05) && close(shotError(0.5, 2500), 0.01)));
  t('éxito (1 − ε)^G como exito.py: 0,99^100 ≈ 0,37 y 0,999^1000 ≈ 0,37', () => {
    assert(Math.abs(successProbability(0.01, 100) - 0.366) < 1e-3);
    assert(Math.abs(successProbability(0.001, 1000) - 0.368) < 1e-3);
    assert(Math.abs(successProbability(0.01, 1000) / 4.3e-5 - 1) < 0.01);
  });
  t('puertas de dos qubits de un circuito 50 × 50: 1250', () => equal(twoQubitGates(50, 50), 1250));
  t('con un circuito mediano, B gana a A y C no cabe', () => {
    const [A, B, C] = PROCESSORS.map((p) => evaluateCircuit(p, 50, 50));
    assert(B.success > 0.25 && A.success < 1e-5 && !C.fits, JSON.stringify([A, B, C]));
  });
  t('ejercicio 2.6: el de 60 qubits gana (0,998^400 ≈ 0,45 frente a 0,98^400 ≈ 0,0003)', () => {
    assert(Math.abs(successProbability(0.002, 400) - 0.449) < 1e-3 && Math.abs(successProbability(0.02, 400) - 3.09e-4) < 1e-5);
  });
});
