// Pruebas de la lógica de las lecciones 1.3–1.11. Los valores esperados se
// obtuvieron ejecutando el código equivalente con CPython 3.14 (ver las lecciones).

import { suite, equal, assert } from './run.js';
import * as U from '../src/utils/unicode.js';
import * as M from '../src/utils/media.js';
import * as L from '../src/utils/logic.js';
import * as CPU from '../src/utils/minicpu.js';
import * as EC from '../src/utils/exprcompiler.js';
import * as C from '../src/utils/cache.js';
import * as X from '../src/utils/complexity.js';

suite('1.3 Texto Unicode (src/utils/unicode.js)', (t) => {
  t('«e» + acento combinante: 1 grafema, 2 puntos de código, 3 bytes UTF-8, 2 unidades UTF-16', () => {
    const s = 'é';
    equal([U.graphemes(s).length, U.codePoints(s).length, U.utf8Bytes(s).length, U.utf16Units(s).length], [1, 2, 3, 2]);
  });
  t('👍🏽 y 🇪🇸: 1 grafema, 2 puntos de código, 8 bytes, 4 unidades UTF-16 (como en Python)', () => {
    ['👍🏽', '🇪🇸'].forEach((s) => equal([U.graphemes(s).length, U.codePoints(s).length, U.utf8Bytes(s).length, U.utf16Units(s).length], [1, 2, 8, 4], s));
  });
  t('NFC une «e» + U+0301 en «é»; NFD lo separa', () => {
    equal('café'.normalize('NFC'), 'café');
    equal('café'.normalize('NFD').length, 5);
    assert('café' !== 'café');
  });
  t('mojibake: «Año» en UTF-8 leído como Windows-1252 da «AÃ±o»', () => equal(U.decode(U.encode('Año', 'utf-8').bytes, 'windows-1252'), 'AÃ±o'));
  t('Windows-1252: € es 0x80 y ñ es 0xF1', () => { equal(U.encode('€', 'windows-1252').bytes, [0x80]); equal(U.encode('ñ', 'windows-1252').bytes, [0xF1]); });
  t('bytes Latin-1 de «Año» no son UTF-8 válido', () => {
    let threw = false;
    try { U.decode(U.encode('Año', 'windows-1252').bytes, 'utf-8', true); } catch { threw = true; }
    assert(threw);
    equal(U.decode(U.encode('Año', 'windows-1252').bytes, 'utf-8'), 'A�o');
  });
  t('ASCII no codifica «ñ» (se marca y se sustituye por «?»)', () => {
    const r = U.encode('Año', 'ascii');
    equal([r.bytes, r.unencodable], [[0x41, 0x3F, 0x6F], ['ñ']]);
  });
  t('UTF-16LE de «A€» es 41 00 AC 20', () => equal(U.encode('A€', 'utf-16le').bytes, [0x41, 0x00, 0xAC, 0x20]));
  t('detección de escrituras mezcladas: «pаypal» con «а» cirílica', () => {
    equal(U.scriptsUsed('paypal'), ['Latin']);
    equal(U.scriptsUsed('pаypal').sort(), ['Cyrillic', 'Latin']);
    equal(U.scriptsUsed('café 2026!'), ['Latin']);
  });
});

suite('1.4 Imagen y audio (src/utils/media.js)', (t) => {
  t('colores hexadecimales', () => { equal(M.toHexColor(31, 78, 140), '#1F4E8C'); equal(M.fromHexColor('#1f4e8c'), [31, 78, 140]); });
  t('cuantización: 8 bits no cambia; 1 bit da 0 o 255', () => {
    equal(M.quantize(200, 8).shown, 200);
    equal([M.quantize(100, 1).shown, M.quantize(200, 1).shown], [0, 255]);
  });
  t('tamaños de imagen 1920×1080 (como en Python)', () => {
    equal([1, 8, 24, 32].map((b) => M.imageBytes(1920, 1080, b)), [259200, 2073600, 6220800, 8294400]);
  });
  t('RLE de una fila y su inversa', () => {
    const fila = [...Array(10).fill(255), ...Array(3).fill(0), ...Array(7).fill(255)];
    equal(M.rle(fila), [[255, 10], [0, 3], [255, 7]]);
    equal(M.unrle(M.rle(fila)), fila);
    equal(M.rle([10, 20, 30, 40]).length, 4);
  });
  t('audio de CD: 1 411 200 bit/s', () => equal(M.pcmBitrate(44100, 16, 2), 1411200));
  t('alias: 9 Hz muestreados a 10 Hz parecen 1 Hz; 3 Hz a 10 Hz no cambian', () => {
    equal([M.aliasFrequency(9, 10), M.aliasFrequency(3, 10), M.aliasFrequency(11, 10)], [1, 3, 1]);
  });
  t('muestreo: niveles dentro de rango', () => {
    const s = M.sampleSine({ freq: 2, rate: 20, bits: 3 });
    equal(s.length, 20);
    assert(s.every((x) => x.level >= 0 && x.level <= 7));
  });
});

suite('1.5–1.7 Lógica booleana y circuitos (src/utils/logic.js)', (t) => {
  const tt = (src) => L.truthTable(L.parse(src)).rows.map((r) => Number(r.out)).join('');
  t('tablas de AND, OR, XOR, NOT, NAND', () => {
    equal([tt('A·B'), tt('A+B'), tt('A⊕B'), tt('¬A'), tt('¬(A·B)')], ['0001', '0111', '0110', '10', '1110']);
  });
  t('sintaxis alternativa: AB, A\', NOT, AND, OR, XOR', () => {
    equal(tt("AB + A'B'"), '1001');
    equal(tt('NOT A AND B'), '0100');
    equal(tt('a xor b'), '0110');
  });
  t('precedencia: NOT > AND > XOR > OR', () => {
    equal(tt('A + B·C'), tt('A + (B·C)'));
    equal(tt('A ⊕ B·C'), tt('A ⊕ (B·C)'));
    assert(tt('A + B ⊕ C') === tt('A + (B ⊕ C)'));
  });
  t('errores de sintaxis con posición', () => {
    let e;
    try { L.parse('A + (B'); } catch (err) { e = err; }
    assert(e instanceof L.LogicSyntaxError);
    try { L.parse('A $ B'); } catch (err) { e = err; }
    equal(e.position, 2);
  });
  t('De Morgan es correcto; la versión errónea no', () => {
    assert(L.equivalent(L.parse('¬(A·B)'), L.parse('¬A + ¬B')).equal);
    assert(L.equivalent(L.parse('¬(A+B)'), L.parse('¬A·¬B')).equal);
    const wrong = L.equivalent(L.parse('¬(A·B)'), L.parse('¬A·¬B'));
    equal([wrong.equal, wrong.differences.map((d) => d.m)], [false, [1, 2]]);
  });
  t('leyes: absorción, distributiva, A ⊕ A = 0', () => {
    assert(L.equivalent(L.parse('A + A·B'), L.parse('A')).equal);
    assert(L.equivalent(L.parse('A·(B + C)'), L.parse('A·B + A·C')).equal);
    assert(L.equivalent(L.parse('A + B·C'), L.parse('(A + B)·(A + C)')).equal);
    assert(L.equivalent(L.parse('A ⊕ A'), L.parse('0')).equal);
  });
  t('suma de productos canónica de la mayoría (como en Python)', () => {
    const out = [0, 0, 0, 1, 0, 1, 1, 1];
    equal(L.canonicalSOP(['A', 'B', 'C'], out), '¬A·B·C + A·¬B·C + A·B·¬C + A·B·C');
  });
  t('Quine–McCluskey: mayoría = A·B + A·C + B·C', () => {
    const r = L.simplifySOP(['A', 'B', 'C'], [0, 0, 0, 1, 0, 1, 1, 1]);
    assert(L.equivalent(L.parse(r.expression), L.parse('A·B + A·C + B·C')).equal);
    equal(r.implicants.length, 3);
  });
  t('Quine–McCluskey es equivalente a la tabla para las 256 funciones de 3 variables', () => {
    for (let f = 0; f < 256; f += 1) {
      const out = Array.from({ length: 8 }, (_, m) => (f >> m) & 1);
      const r = L.simplifySOP(['A', 'B', 'C'], out);
      const got = L.truthTable(L.parse(r.expression), ['A', 'B', 'C']).rows.map((x) => Number(x.out));
      if (got.join('') !== out.join('')) throw new Error(`f=${f}: ${r.expression}`);
    }
  });
  t('format usa paréntesis mínimos', () => equal(L.format(L.parse('(A+B)·¬(C)')), '(A + B)·¬C'));
  const FULL_ADDER = { gates: [
    { id: 'x1', type: 'XOR', in: ['A', 'B'] }, { id: 'S', type: 'XOR', in: ['x1', 'Cin'] },
    { id: 'a1', type: 'AND', in: ['A', 'B'] }, { id: 'a2', type: 'AND', in: ['x1', 'Cin'] }, { id: 'Cout', type: 'OR', in: ['a1', 'a2'] },
  ] };
  t('sumador completo: S y Cout correctos en las 8 combinaciones', () => {
    for (let m = 0; m < 8; m += 1) {
      const [A, B, Cin] = [(m >> 2) & 1, (m >> 1) & 1, m & 1];
      const v = L.evaluateCircuit(FULL_ADDER, { A, B, Cin });
      equal([v.S, v.Cout], [(A + B + Cin) % 2, (A + B + Cin) >> 1], `m=${m}`);
    }
  });
  t('NAND es universal: NOT, AND, OR y XOR con NAND', () => {
    const nand = { gates: [
      { id: 'n', type: 'NAND', in: ['A', 'B'] },
      { id: 'notA', type: 'NAND', in: ['A', 'A'] }, { id: 'notB', type: 'NAND', in: ['B', 'B'] },
      { id: 'and', type: 'NAND', in: ['n', 'n'] }, { id: 'or', type: 'NAND', in: ['notA', 'notB'] },
      { id: 'p', type: 'NAND', in: ['A', 'n'] }, { id: 'q', type: 'NAND', in: ['B', 'n'] }, { id: 'xor', type: 'NAND', in: ['p', 'q'] },
    ] };
    for (let m = 0; m < 4; m += 1) {
      const [A, B] = [(m >> 1) & 1, m & 1];
      const v = L.evaluateCircuit(nand, { A, B });
      equal([v.notA, v.and, v.or, v.xor], [1 - A, A & B, A | B, A ^ B]);
    }
  });
});

suite('1.9 MiniCPU (src/utils/minicpu.js; mismos resultados que el programa Python)', (t) => {
  t('codificación de «suma» igual que en Python', () => {
    const mem = CPU.assemble(CPU.PROGRAMS.suma.source);
    equal(mem.slice(0, 5).map((w) => w.toString(2).padStart(8, '0')), ['00110100', '01110101', '01010110', '11100000', '00000000']);
  });
  t('suma: salida [12] en 5 instrucciones y M[22] = 12', () => {
    const s = CPU.run(CPU.assemble(CPU.PROGRAMS.suma.source));
    equal([s.output, s.instructions, s.mem[22], s.halted], [[12], 5, 12, true]);
  });
  t('cuenta atrás: salida [3, 2, 1, 0] en 14 instrucciones', () => {
    const s = CPU.run(CPU.assemble(CPU.PROGRAMS.cuenta.source));
    equal([s.output, s.instructions], [[3, 2, 1, 0], 14]);
  });
  t('«H» → «h»: 104', () => equal(CPU.run(CPU.assemble(CPU.PROGRAMS.minuscula.source)).output, [104]));
  t('multiplicación 6 × 4 = 24', () => equal(CPU.run(CPU.assemble(CPU.PROGRAMS.multiplica.source)).output, [24]));
  t('cada instrucción tarda tres fases', () => {
    let s = CPU.createState(CPU.assemble(CPU.PROGRAMS.suma.source));
    const phases = [];
    for (let i = 0; i < 6; i += 1) { phases.push(s.phase); s = CPU.stepPhase(s).state; }
    equal(phases, ['fetch', 'decode', 'execute', 'fetch', 'decode', 'execute']);
  });
  t('ADD es módulo 256', () => equal(CPU.run(CPU.assemble('LOAD 20\nADD 21\nOUT\nHALT\n20: 200\n21: 100')).output, [44]));
  t('desensamblado y errores de ensamblado', () => {
    equal(CPU.disassemble(0b00110100), 'LOAD 20');
    equal(CPU.disassemble(0b11100000), 'OUT');
    let e; try { CPU.assemble('LOAD'); } catch (err) { e = err; }
    assert(e && /dirección/.test(e.message));
  });
});

suite('1.10 Compilador de expresiones (src/utils/exprcompiler.js)', (t) => {
  const run = (src) => EC.execute(EC.compile(EC.parse(EC.tokenize(src)))).result;
  t('(2 + 3) * 4 = 20 (como eval en Python)', () => equal(run('(2 + 3) * 4'), 20));
  t('precedencia y asociatividad: 2 + 3 * 4 = 14; 10 - 3 - 2 = 5', () => equal([run('2 + 3 * 4'), run('10 - 3 - 2')], [14, 5]));
  t('código de pila en postorden', () => {
    equal(EC.compile(EC.parse(EC.tokenize('(2 + 3) * 4'))).map(EC.formatInstruction), ['PUSH 2', 'PUSH 3', 'ADD', 'PUSH 4', 'MUL']);
  });
  t('errores', () => {
    ['(2 + 3', '2 +', '2 $ 3', ''].forEach((src) => {
      let e; try { run(src); } catch (err) { e = err; }
      assert(e instanceof EC.CompileError, src);
    });
  });
});

suite('1.8 Caché y 1.11 Complejidad', (t) => {
  t('recorrido por filas: 1 fallo por bloque (4 enteros de 4 bytes en bloques de 16)', () => {
    const r = C.simulateCache({ lines: 8, blockSize: 16, addresses: C.matrixTraversal(8, 8, 4, 'rows') });
    equal(C.hitRate(r), 0.75);
  });
  t('recorrido por columnas con la misma caché: más fallos', () => {
    const rows = C.simulateCache({ lines: 4, blockSize: 16, addresses: C.matrixTraversal(8, 8, 4, 'rows') });
    const cols = C.simulateCache({ lines: 4, blockSize: 16, addresses: C.matrixTraversal(8, 8, 4, 'cols') });
    assert(C.hitRate(cols) < C.hitRate(rows), `${C.hitRate(cols)} vs ${C.hitRate(rows)}`);
    equal(C.hitRate(cols), 0);
  });
  t('rutas del viajante: (n − 1)!/2 como en Python', () => equal([5, 10, 15, 20].map(X.tourCount), [12, 181440, 43589145600, 60822550204416000]));
  t('búsqueda exhaustiva evalúa (n − 1)! permutaciones y no es peor que la heurística', () => {
    const pts = X.seededPoints(7, 3);
    const bf = X.tspBruteForce(pts);
    equal(bf.evaluated, 720);
    assert(bf.length <= X.nearestNeighbor(pts).length + 1e-12);
  });
  t('tiempos legibles', () => {
    equal(X.humanTime(2 ** 30), '1.07 s');
    assert(X.humanTime(2 ** 90).includes('10^10'));
  });
});
