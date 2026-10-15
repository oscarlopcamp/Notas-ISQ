// Pruebas del Módulo 3 (unidad 3.1). Los valores coinciden con los programas
// Python de las lecciones 3.3 y 3.4 (CPython 3.14).

import { suite, equal, assert } from './run.js';
import { probabilities, norm2, isNormalized, normalize, measure, fromTheta, blochProbabilities, blochPoint, ketText } from '../src/utils/qubit.js';
import { seededRandom } from '../src/utils/hardware.js';

const close = (a, b, eps = 1e-12) => Math.abs(a - b) < eps;

suite('3.1 El qubit (src/utils/qubit.js)', (t) => {
  t('regla de Born: 0,6|0⟩ + 0,8|1⟩ da 0,36 y 0,64 (como amplitudes.py)', () => {
    const p = probabilities(0.6, 0.8);
    assert(close(p.p0, 0.36, 1e-12) && close(p.p1, 0.64, 1e-12), JSON.stringify(p));
  });
  t('el signo no cambia las probabilidades', () => equal(probabilities(0.6, -0.8), probabilities(0.6, 0.8)));
  t('[1, 1] no está normalizado; normalizado da 1/√2', () => {
    assert(!isNormalized(1, 1) && close(norm2(1, 1), 2));
    const [a, b] = normalize(1, 1);
    assert(close(a, Math.SQRT1_2) && close(b, Math.SQRT1_2) && isNormalized(a, b));
  });
  t('normalizar [3, 4] da [0,6, 0,8]', () => { const [a, b] = normalize(3, 4); assert(close(a, 0.6) && close(b, 0.8)); });
  t('normalizar [0, 0] es un error', () => { let threw = false; try { normalize(0, 0); } catch { threw = true; } assert(threw); });
  t('medir deja el qubit en el estado base del resultado', () => {
    const rnd = seededRandom(3);
    for (let i = 0; i < 50; i += 1) {
      const r = measure(Math.SQRT1_2, Math.SQRT1_2, rnd);
      equal(r.after, r.bit ? [0, 1] : [1, 0]);
      equal(measure(...r.after, rnd).bit, r.bit); // volver a medir repite el resultado
    }
  });
  t('los estados base dan siempre el mismo resultado', () => {
    const rnd = seededRandom(9);
    for (let i = 0; i < 50; i += 1) { equal(measure(1, 0, rnd).bit, 0); equal(measure(0, 1, rnd).bit, 1); }
  });
  t('las frecuencias se acercan a la probabilidad', () => {
    const rnd = seededRandom(11), [a, b] = fromTheta(2 * Math.asin(Math.sqrt(0.8)));
    let ones = 0;
    for (let i = 0; i < 20000; i += 1) ones += measure(a, b, rnd).bit;
    assert(Math.abs(ones / 20000 - 0.8) < 0.015, String(ones / 20000));
  });
  t('Bloch: tabla de bloch.py (0°, 60°, 90°, 120°, 180°)', () => {
    const got = [0, 60, 90, 120, 180].map((d) => Number(blochProbabilities((d * Math.PI) / 180).p0.toFixed(2)));
    equal(got, [1, 0.75, 0.5, 0.25, 0]);
  });
  t('Bloch: P(0) = (1 + altura)/2 y no depende de φ', () => {
    for (let d = 0; d <= 180; d += 15) {
      const th = (d * Math.PI) / 180, p0 = blochProbabilities(th).p0;
      [0, 1, 2, 3].forEach((ph) => assert(close(p0, (1 + blochPoint(th, ph).z) / 2, 1e-12), `θ=${d}`));
    }
  });
  t('Bloch: los puntos están en la esfera de radio 1', () => {
    for (let i = 0; i < 20; i += 1) { const p = blochPoint(i * 0.3, i * 0.7); assert(close(p.x ** 2 + p.y ** 2 + p.z ** 2, 1)); }
  });
  t('fromTheta coincide con la regla de Born', () => {
    const [a, b] = fromTheta(Math.PI / 3);
    assert(close(a * a, blochProbabilities(Math.PI / 3).p0));
  });
  t('ketText escribe los estados como en la lección 3.2', () => {
    equal([ketText(1, 0), ketText(0, 1), ketText(0.6, 0.8), ketText(0.8, -0.6), ketText(0, -1), ketText(Math.SQRT1_2, -Math.SQRT1_2)],
      ['|0⟩', '|1⟩', '0.6|0⟩ + 0.8|1⟩', '0.8|0⟩ − 0.6|1⟩', '−|1⟩', '0.707|0⟩ − 0.707|1⟩']);
  });
});
