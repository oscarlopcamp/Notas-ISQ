// Pruebas del Módulo 3 (unidad 3.1). Los valores coinciden con los programas
// Python de las lecciones 3.3 y 3.4 (CPython 3.14).

import { suite, equal, assert } from './run.js';
import { probabilities, norm2, isNormalized, normalize, measure, fromTheta, blochProbabilities, blochPoint, ketText, mix, runOps, mixContributions, phaseMixP0, mixQubit, BELL, measurePair, isProduct, basisLabel, productState, ghzState, sampleIndex } from '../src/utils/qubit.js';
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

suite('3.2 Propiedades cuánticas (src/utils/qubit.js)', (t) => {
  const R = Math.SQRT1_2;
  const near = (u, v) => u.every((x, i) => close(x, v[i], 1e-12));
  t('mezcla: |0⟩→|+⟩, |1⟩→|−⟩, |+⟩→|0⟩, |−⟩→|1⟩ (tabla de la lección 3.5)', () => {
    assert(near(mix(1, 0), [R, R]) && near(mix(0, 1), [R, -R]) && near(mix(R, R), [1, 0]) && near(mix(R, -R), [0, 1]));
  });
  t('mezclar dos veces devuelve el estado (como interferencia.py)', () => {
    for (const s of [[0.6, 0.8], [0.8, -0.6], [1, 0]]) assert(near(mix(...mix(...s)), s));
  });
  t('secuencias de la lección 3.8: MM → |0⟩, MSM → |1⟩, MSMSM → −|−⟩, MXM → |0⟩', () => {
    const last = (ops) => runOps(ops).at(-1);
    assert(near(last('MM'), [1, 0]) && near(last('MSM'), [0, 1]) && near(last('MSMSM'), [-R, R]) && near(last('MXM'), [1, 0]));
  });
  t('las contribuciones de una mezcla suman la amplitud de salida', () => {
    const c = mixContributions(R, R), out = mix(R, R);
    assert(close(c.to0[0] + c.to0[1], out[0]) && close(c.to1[0] + c.to1[1], out[1]) && close(c.to1[0] + c.to1[1], 0));
  });
  t('fase: tabla de fase.py (0°, 45°, 90°, 135°, 180°)', () => {
    equal([0, 45, 90, 135, 180].map((d) => Number(phaseMixP0((d * Math.PI) / 180).toFixed(2))), [1, 0.85, 0.5, 0.15, 0]);
  });
  t('fase con amplitudes reales: 0° es |+⟩ y 180° es |−⟩ al mezclar', () => {
    assert(close(phaseMixP0(0), mix(R, R)[0] ** 2) && close(phaseMixP0(Math.PI), mix(R, -R)[0] ** 2));
  });
  t('la fase global no cambia ninguna probabilidad tras mezclar', () => {
    for (const s of [[0.6, 0.8], [R, -R]]) {
      const a = mix(...s), b = mix(-s[0], -s[1]);
      assert(close(a[0] ** 2, b[0] ** 2) && close(a[1] ** 2, b[1] ** 2));
    }
  });
  t('el estado de Bell está entrelazado; |+⟩|+⟩ no', () => assert(!isProduct(BELL) && isProduct([0.5, 0.5, 0.5, 0.5])));
  t('mezclar los dos qubits del estado de Bell lo deja igual (coinciden siempre)', () => {
    assert(near(mixQubit(mixQubit(BELL, 0), 1), BELL));
  });
  t('par clásico mezclado: los cuatro resultados equiprobables (coinciden la mitad)', () => {
    for (const s of [[1, 0, 0, 0], [0, 0, 0, 1]]) mixQubit(mixQubit(s, 0), 1).forEach((x) => assert(close(x * x, 0.25)));
  });
  t('(|01⟩ + |10⟩)/√2 tras mezclar ambos da (|00⟩ − |11⟩)/√2 (ejercicio 3.7)', () => {
    assert(near(mixQubit(mixQubit([0, R, R, 0], 0), 1), [R, 0, 0, -R]));
  });
  t('medir el estado de Bell da solo 00 y 11, con frecuencias parecidas', () => {
    const rnd = seededRandom(21), c = { '00': 0, '01': 0, '10': 0, '11': 0 };
    for (let i = 0; i < 10000; i += 1) c[measurePair(BELL, rnd)] += 1;
    assert(c['01'] === 0 && c['10'] === 0 && Math.abs(c['00'] / 10000 - 0.5) < 0.02, JSON.stringify(c));
  });
  t('measurePair nunca devuelve un resultado de amplitud nula, aunque el redondeo no sume 1', () => {
    for (let k = 0; k < 200; k += 1) assert(measurePair([0, 0, 0, 0.9999999], () => 0.99999999999) === '11');
    assert(measurePair([0.9999999, 0, 0, 0], () => 0.99999999999) === '00');
  });
});

suite('3.3 Sistemas de n qubits (src/utils/qubit.js)', (t) => {
  const R = Math.SQRT1_2;
  t('etiquetas con el convenio de Qiskit: 6 con 3 qubits es 110', () => equal([basisLabel(6, 3), basisLabel(1, 2), basisLabel(8, 4)], ['110', '01', '1000']));
  t('qubit 0 en |+⟩ y qubit 1 en |0⟩ dan 00 y 01 (como la guía de Qiskit y varios_qubits.py)', () => {
    const s = productState([[R, R], [1, 0]]);
    assert(close(s[0], R) && close(s[1], R) && s[2] === 0 && s[3] === 0, JSON.stringify(s));
  });
  t('qubits 1 y 2 en 1 y qubit 0 en 0: solo el número 6', () => {
    const s = productState([[1, 0], [0, 1], [0, 1]]);
    assert(s[6] === 1 && s.filter((a) => a !== 0).length === 1);
  });
  t('n qubits en |+⟩: 2ⁿ amplitudes iguales a 1/√(2ⁿ)', () => {
    for (let n = 1; n <= 5; n += 1) {
      const s = productState(Array(n).fill([R, R]));
      assert(s.length === 2 ** n && s.every((a) => close(a, 1 / Math.sqrt(2 ** n))), `n=${n}`);
    }
  });
  t('los estados producto están normalizados', () => {
    const s = productState([[0.6, 0.8], [R, -R], [0, 1]]);
    assert(close(s.reduce((p, a) => p + a * a, 0), 1));
  });
  t('ejercicio de la lección: P(11) = 0,32', () => assert(close(productState([[0.6, 0.8], [R, R]])[3] ** 2, 0.32)));
  t('con dos qubits, productState coincide con isProduct', () => assert(isProduct(productState([[0.6, 0.8], [R, -R]])) && !isProduct(ghzState(2))));
  t('GHZ: solo 00…0 y 11…1, y medir da siempre todos iguales', () => {
    const rnd = seededRandom(13);
    for (let n = 2; n <= 5; n += 1) {
      const g = ghzState(n);
      for (let i = 0; i < 200; i += 1) { const x = sampleIndex(g, rnd); assert(x === 0 || x === 2 ** n - 1, `n=${n} x=${x}`); }
    }
  });
});

