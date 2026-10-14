import { suite, equal, assert } from './run.js';
import {
  interpret, range, toTwos, addBits, negateSteps, parseDecimal, fractionToBinary, hasFiniteBinary,
  floatToBits, bitsToFloat, decodeFloat, exactDecimal, roundingError, ulp, shortest,
} from '../src/utils/numbers.js';

suite('Enteros de ancho fijo (src/utils/numbers.js)', (t) => {
  t('rangos de 8 y 16 bits', () => {
    equal(range(8, 'unsigned'), [0, 255]);
    equal(range(8, 'signed'), [-128, 127]);
    equal(range(16, 'signed'), [-32768, 32767]);
    equal(range(4, 'sign-magnitude'), [-7, 7]);
  });
  t('interpretaciones de 11111011', () => {
    equal(interpret(0b11111011, 8, 'unsigned'), 251);
    equal(interpret(0b11111011, 8, 'signed'), -5);
    equal(interpret(0b11111011, 8, 'sign-magnitude'), -123);
  });
  t('toTwos(−20, 8) = 11101100', () => equal(toTwos(-20, 8), 0b11101100));
  t('6 + 7 con 4 bits: 1101, acarreos 0,0,1,1 y sin desbordamiento', () => {
    const r = addBits(0b0110, 0b0111, 4);
    equal(r.result, 0b1101);
    equal(r.carries, [0, 0, 1, 1, 0]);
    equal([r.unsignedOverflow, r.signedOverflow], [false, true]); // con signo: 6 + 7 = 13 > 7
  });
  t('12 + 5 con 4 bits desborda sin signo y da 1', () => {
    const r = addBits(12, 5, 4);
    equal([r.result, r.unsignedOverflow], [1, true]);
  });
  t('−5 + 6: acarreo final pero sin desbordamiento con signo', () => {
    const r = addBits(0b1011, 0b0110, 4);
    equal([r.result, r.carryOut, r.signedOverflow], [1, 1, false]);
  });
  t('127 + 1 con 8 bits desborda con signo: −128', () => {
    const r = addBits(127, 1, 8);
    equal([interpret(r.result, 8, 'signed'), r.signedOverflow, r.unsignedOverflow], [-128, true, false]);
  });
  t('regla del desbordamiento = definición, para todas las parejas de 8 bits', () => {
    for (let a = 0; a < 256; a += 1) {
      for (let b = 0; b < 256; b += 1) {
        const r = addBits(a, b, 8);
        const real = interpret(a, 8, 'signed') + interpret(b, 8, 'signed');
        if (r.signedOverflow !== (real < -128 || real > 127)) throw new Error(`a=${a} b=${b}`);
        if (r.unsignedOverflow !== (a + b > 255)) throw new Error(`sin signo a=${a} b=${b}`);
        if (r.result !== (a + b) % 256) throw new Error(`resultado a=${a} b=${b}`);
      }
    }
  });
  t('negar 5: 00000101 → 11111010 → 11111011', () => {
    const s = negateSteps(5, 8);
    equal([s.pattern, s.inverted, s.result, s.resultValue], [0b101, 0b11111010, 0b11111011, -5]);
  });
  t('negar −128 devuelve el mismo patrón', () => {
    const s = negateSteps(-128, 8);
    equal([s.result, s.wraps], [0b10000000, true]);
  });
  t('negar es correcto para todo el rango salvo −128', () => {
    for (let v = -127; v <= 127; v += 1) equal(negateSteps(v, 8).resultValue, -v || 0, `v=${v}`);
  });
});

suite('Fracciones binarias exactas', (t) => {
  t('parseDecimal reduce fracciones', () => {
    equal(Object.values(parseDecimal('0.625')).map(String), ['5', '8']);
    equal(Object.values(parseDecimal('0.1')).map(String), ['1', '10']);
    equal(Object.values(parseDecimal('3e-2')).map(String), ['3', '100']);
  });
  t('0.625 = 0.101 (finita)', () => {
    const r = fractionToBinary(5n, 8n);
    equal([r.digits.join(''), r.terminated], ['101', true]);
  });
  t('0.1 = 0.0(0011) periódica desde la posición 1', () => {
    const r = fractionToBinary(1n, 10n);
    equal([r.digits.join(''), r.periodStart, r.terminated], ['00011', 1, false]);
  });
  t('criterio del denominador coincide con la expansión para p/q, q ≤ 64', () => {
    for (let q = 2n; q <= 64n; q += 1n) {
      for (let p = 1n; p < q; p += 1n) {
        const g = ((a, b) => { while (b) [a, b] = [b, a % b]; return a; })(p, q);
        const r = fractionToBinary(p / g, q / g, 200);
        if (r.terminated !== hasFiniteBinary(q / g)) throw new Error(`${p}/${q}`);
      }
    }
  });
});

suite('IEEE 754 (valores comprobados con Python struct/decimal)', (t) => {
  const hex32 = (x) => floatToBits(x, 'binary32').toString(16).padStart(8, '0');
  const hex64 = (x) => floatToBits(x, 'binary64').toString(16).padStart(16, '0');
  t('patrones binary32: 0.1, −2.5, 0.15625', () => equal([hex32(0.1), hex32(-2.5), hex32(0.15625)], ['3dcccccd', 'c0200000', '3e200000']));
  t('patrón binary64 de 0.1', () => equal(hex64(0.1), '3fb999999999999a'));
  t('valor exacto de 0.1 en binary32', () => equal(exactDecimal(floatToBits(0.1, 'binary32'), 'binary32'), '0.100000001490116119384765625'));
  t('valor exacto de 0.1 en binary64', () => equal(exactDecimal(floatToBits(0.1)), '0.1000000000000000055511151231257827021181583404541015625'));
  t('16777217 se guarda como 16777216 en binary32', () => equal(exactDecimal(floatToBits(16777217, 'binary32'), 'binary32'), '16777216'));
  t('máximo binary32', () => equal(exactDecimal(0x7f7fffffn, 'binary32'), '340282346638528859811704183484516925440'));
  t('menor subnormal binary32 es 2^−149', () => {
    const d = decodeFloat(1n, 'binary32');
    equal([d.kind, d.m, d.q], ['subnormal', 1n, -149]);
    assert(exactDecimal(1n, 'binary32').startsWith('0.00000000000000000000000000000000000000000000140129846432481707092372958328991613128026194187651577175706828388979108268586060148663818836212158203125'));
  });
  t('clasificación: cero, infinito, NaN, −0', () => {
    equal(decodeFloat(floatToBits(0)).kind, 'zero');
    equal(decodeFloat(floatToBits(Infinity)).kind, 'infinity');
    equal(decodeFloat(floatToBits(NaN)).kind, 'nan');
    equal(exactDecimal(floatToBits(-0)), '-0');
  });
  t('campos de −2.5 en binary32', () => {
    const d = decodeFloat(floatToBits(-2.5, 'binary32'), 'binary32');
    equal([d.sign, d.E, d.exponent, d.fraction], [1, 128, 1, 0b01n << 21n]);
  });
  t('ida y vuelta bits ↔ número', () => {
    [0.1, -2.5, 1e-300, 123456.789].forEach((x) => equal(bitsToFloat(floatToBits(x)), x));
    equal(bitsToFloat(floatToBits(0.1, 'binary32'), 'binary32'), Math.fround(0.1));
  });
  t('error de redondeo exacto de 0.1 en binary32 ≈ 1.49e−9', () => {
    const e = roundingError('0.1', 'binary32');
    assert(Math.abs(e.error - 1.490116119384765625e-9) < 1e-20, String(e.error));
    assert(!e.errorIsZero);
  });
  t('0.75 y 0.5 son exactos; 0.2 y 0.3 no', () => {
    equal(['0.75', '0.5', '0.2', '0.3'].map((x) => roundingError(x).errorIsZero), [true, true, false, false]);
  });
  t('2^53 + 1 no es representable en binary64', () => equal(exactDecimal(floatToBits(9007199254740993)), '9007199254740992'));
  t('ulp de 1 en binary32 es 2^−23', () => equal(ulp(floatToBits(1, 'binary32'), 'binary32'), 2 ** -23));
  t('representación más corta en binary32', () => equal(shortest(Math.fround(0.1), 'binary32'), '0.1'));
});
