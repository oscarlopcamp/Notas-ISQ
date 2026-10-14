import { suite, equal, assert } from './run.js';
import {
  toBinary, fromBinary, toHex, divisionSteps, bitsNeeded, encodeText, codePointLabel, interpretByte,
} from '../src/utils/encoding.js';

suite('Representación binaria (src/utils/encoding.js)', (t) => {
  t('72 en binario es 01001000', () => equal(toBinary(72), '01001000'));
  t('HOLA coincide con la tabla de la lección', () => {
    equal([...'HOLA'].map((c) => toBinary(c.codePointAt(0))), ['01001000', '01001111', '01001100', '01000001']);
  });
  t('fromBinary usa la regla de Horner correctamente', () => equal(fromBinary('01001000'), 72));
  t('ida y vuelta para los 256 valores de un byte', () => {
    for (let n = 0; n < 256; n += 1) equal(fromBinary(toBinary(n)), n, `n=${n}`);
  });
  t('fromBinary rechaza cadenas no binarias', () => {
    let threw = false;
    try { fromBinary('0102'); } catch { threw = true; }
    assert(threw, 'debería lanzar un error');
  });
  t('hexadecimal de HOLA: 48 4F 4C 41', () => equal([...'HOLA'].map((c) => toHex(c.codePointAt(0))), ['48', '4F', '4C', '41']));
  t('divisiones sucesivas de 72 producen los restos de la tabla', () => {
    equal(divisionSteps(72).map((s) => s.remainder), [0, 0, 0, 1, 0, 0, 1]);
    equal(divisionSteps(72).map((s) => s.remainder).reverse().join(''), '1001000');
  });
  t('bits mínimos: 2→1, 26→5, 128→7, 200→8, 1 114 112→21', () => {
    equal([2, 26, 128, 200, 1114112].map(bitsNeeded), [1, 5, 7, 8, 21]);
  });
  t('etiqueta de punto de código', () => { equal(codePointLabel(72), 'U+0048'); equal(codePointLabel(0x1F600), 'U+1F600'); });
});

suite('Codificación de texto', (t) => {
  t('UTF-8 de «Año» es 41 C3 B1 6F', () => {
    equal(encodeText('Año', 'utf8').flatMap((c) => c.bytes), [0x41, 0xC3, 0xB1, 0x6F]);
  });
  t('«ñ» no es representable en ASCII', () => {
    const [, enye] = encodeText('Añ', 'ascii');
    equal(enye.representable, false);
    equal(enye.bytes, []);
  });
  t('«€» ocupa 3 bytes: E2 82 AC', () => equal(encodeText('€', 'utf8')[0].bytes, [0xE2, 0x82, 0xAC]));
  t('un emoji es un solo carácter de 4 bytes', () => {
    const items = encodeText('😀', 'utf8');
    equal(items.length, 1);
    equal(items[0].bytes.length, 4);
  });
  t('«camión» ocupa 7 bytes (ejercicio 6)', () => equal(encodeText('camión', 'utf8').flatMap((c) => c.bytes).length, 7));
  t('ASCII y UTF-8 coinciden para texto ASCII', () => {
    equal(encodeText('HOLA', 'ascii').flatMap((c) => c.bytes), encodeText('HOLA', 'utf8').flatMap((c) => c.bytes));
  });
});

suite('Interpretaciones de un byte', (t) => {
  t('01000001: 65, «A», 0x41', () => {
    const r = interpretByte(0b01000001);
    equal([r.unsigned, r.signed, r.ascii, r.hex], [65, 65, 'A', '41']);
  });
  t('11111111: 255 sin signo, −1 con signo, sin carácter ASCII', () => {
    const r = interpretByte(255);
    equal([r.unsigned, r.signed, r.ascii, r.asciiDefined], [255, -1, null, false]);
  });
  t('10000000 con signo es −128', () => equal(interpretByte(128).signed, -128));
});
