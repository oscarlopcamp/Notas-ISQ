// Pruebas del Módulo 2. Los valores esperados coinciden con los programas Python
// de las lecciones 2.1 y 2.2 (CPython 3.14).

import { suite, equal, assert } from './run.js';
import { interferometer, sampleOutcome, DEUTSCH_FUNCTIONS, compatibleFunctions, decided } from '../src/utils/quantumintro.js';
import { EVENTS, CATEGORIES } from '../content/module-02/historia-datos.js';
import { references } from '../references/references.js';
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
