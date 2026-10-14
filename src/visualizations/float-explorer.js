// Explorador IEEE 754: escribe un número o cambia bits y observa signo,
// exponente, fracción, el valor exacto almacenado y el error de redondeo.
// La conversión la hace el navegador (DataView), y el valor exacto se calcula
// con BigInt; no hay tablas ni aproximaciones propias.

import { h, clear } from '../utils/dom.js';
import { renderMath } from '../utils/math.js';
import {
  FORMATS, floatToBits, bitsToFloat, decodeFloat, exactDecimal, roundingError, ulp, shortest,
} from '../utils/numbers.js';

const PRESETS = {
  binary32: ['0.1', '-2.5', '0.15625', '1', '16777217', '1e-45', '3.4e38', 'Infinity', 'NaN'],
  binary64: ['0.1', '0.3', '-2.5', '1', '9007199254740993', '5e-324', '1e308', 'Infinity', 'NaN'],
};

const KIND = {
  normal: ['Normal', 'El caso habitual: significando 1,f y exponente E − sesgo.'],
  subnormal: ['Subnormal', 'Exponente almacenado 0: el significando es 0,f y el exponente se fija en 1 − sesgo. Permite representar valores aún más cercanos a cero, con menos precisión.'],
  zero: ['Cero', 'Exponente y fracción a 0. Existen +0 y −0, que se comparan como iguales.'],
  infinity: ['Infinito', 'Exponente todo a 1 y fracción 0. Aparece, por ejemplo, al desbordar el rango.'],
  nan: ['NaN', '«Not a Number»: exponente todo a 1 y fracción distinta de 0. Resulta de operaciones como 0/0.'],
};

function sci(x) {
  if (x === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(x)));
  const m = x / 10 ** e;
  return `${m.toFixed(2).replace('.', '{,}')} \\times 10^{${e}}`;
}

function powLabel(q) {
  return `2^{${q}}`;
}

export function mount(root, { format = 'binary32', value = '0.1' } = {}) {
  let fmt = format;
  let text = value;
  let bits = floatToBits(Number(value), fmt);
  let edited = false; // true si el valor viene de cambiar bits a mano

  const fmtChips = Object.keys(FORMATS).map((k) => h('button', { type: 'button', class: 'chip', onclick: () => { fmt = k; fromText(text); } }, k));
  const input = h('input', { type: 'text', value, class: 'mono', 'aria-label': 'Número', spellcheck: 'false', oninput: (e) => fromText(e.target.value) });
  const presetBox = h('span', { class: 'chip-group wrap' });
  const strip = h('div', { class: 'fe-strip', role: 'group', 'aria-label': 'Bits del número (pulsa para cambiar)' });
  const panel = h('div', { class: 'fe-panel' });

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Formato'), fmtChips),
    h('div', { class: 'widget-controls' }, h('label', { class: 'widget-label' }, 'Número'), input),
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Probar'), presetBox),
    strip,
    panel,
  );

  function fromText(t) {
    text = t;
    const x = Number(t.replace(',', '.'));
    bits = floatToBits(x, fmt);
    edited = false;
    render();
  }

  function toggle(i) {
    const f = FORMATS[fmt];
    bits ^= 1n << BigInt(f.bits - 1 - i);
    const x = bitsToFloat(bits, fmt);
    text = shortest(x, fmt);
    input.value = text;
    edited = true;
    render();
  }

  function render() {
    const f = FORMATS[fmt];
    fmtChips.forEach((c, i) => c.setAttribute('aria-pressed', String(Object.keys(FORMATS)[i] === fmt)));
    clear(presetBox);
    PRESETS[fmt].forEach((p) => presetBox.append(h('button', { type: 'button', class: 'chip mono', onclick: () => { input.value = p; fromText(p); } }, p)));

    // ---- Tira de bits ----
    const pattern = bits.toString(2).padStart(f.bits, '0');
    clear(strip);
    const group = (label, cls, from, to) => h('div', { class: `fe-group ${cls}` },
      h('div', { class: 'fe-group-label' }, label),
      h('div', { class: 'fe-bits' }, Array.from(pattern.slice(from, to)).map((b, k) => h('button', {
        type: 'button', class: `fe-bit${b === '1' ? ' on' : ''}`,
        'aria-label': `${label}, bit ${from + k}: ${b}`, 'aria-pressed': String(b === '1'),
        onclick: () => toggle(from + k),
      }, b))));
    strip.append(
      group('Signo', 'sign', 0, 1),
      group(`Exponente (${f.exp} bits)`, 'exp', 1, 1 + f.exp),
      group(`Fracción (${f.frac} bits)`, 'frac', 1 + f.exp, f.bits),
    );

    // ---- Decodificación ----
    const d = decodeFloat(bits, fmt);
    const [kindLabel, kindText] = KIND[d.kind];
    const hex = bits.toString(16).toUpperCase().padStart(f.bits / 4, '0');
    clear(panel);
    const row = (label, ...content) => h('div', { class: 'fe-row' }, h('dt', {}, label), h('dd', {}, ...content));
    const dl = h('dl', { class: 'fe-dl' });

    dl.append(row('Tipo', h('span', { class: `badge fe-kind ${d.kind}` }, kindLabel), ' ', h('span', { class: 'muted small' }, kindText)));
    dl.append(row('Hexadecimal', h('code', {}, `0x${hex}`)));

    if (d.kind === 'normal' || d.kind === 'subnormal' || d.kind === 'zero') {
      const fracBits = pattern.slice(1 + f.exp);
      const lead = d.kind === 'normal' ? '1' : '0';
      const significand = Number(d.m) / 2 ** f.frac;
      dl.append(
        row('Signo', h('span', { html: renderMath(`s = ${d.sign} \\;\\Rightarrow\\; ${d.sign ? '-' : '+'}`) })),
        row('Exponente', h('span', { html: d.kind === 'normal'
          ? renderMath(`E = ${d.E} \\;\\Rightarrow\\; e = E - ${f.bias} = ${d.exponent}`)
          : renderMath(`E = 0 \\;\\Rightarrow\\; e = 1 - ${f.bias} = ${d.exponent}`) })),
        row('Significando', h('span', { html: renderMath(`${lead}{,}${fracBits.replace(/0+$/, '') || '0'}_2 \\approx ${String(significand).replace('.', '{,}')}`) })),
        row('Valor', h('span', { html: renderMath(`(-1)^{${d.sign}} \\times ${lead}{,}f \\times ${powLabel(d.exponent)}`) })),
      );
    }

    const exact = exactDecimal(bits, fmt);
    const sig = exact.replace(/^-?0?\.?0*/, '').replace('.', '').length;
    const shown = exact.length > 90 ? `${exact.slice(0, 88)}…` : exact;
    dl.append(row('Valor exacto almacenado', h('code', { class: 'fe-exact' }, shown),
      exact.length > 90 ? h('div', { class: 'muted small' }, `(${sig} cifras significativas en total)`) : null));

    if (!edited) {
      const err = roundingError(text.replace(',', '.'), fmt);
      if (err && err.error !== null) {
        dl.append(row('Error de redondeo', err.errorIsZero
          ? h('span', { class: 'tc-ok' }, `Ninguno: ${text} se representa exactamente.`)
          : h('span', { html: `${renderMath(`\\text{almacenado} - \\text{escrito} \\approx ${sci(err.error)}`)} &nbsp;(error relativo ${renderMath(`\\approx ${sci(err.relative)}`)})` })));
      } else if (Number.isNaN(Number(text.replace(',', '.'))) && !/^nan$/i.test(text.trim())) {
        dl.append(row('Entrada', h('span', { class: 'muted' }, 'No es un número válido; se interpreta como NaN.')));
      }
    } else {
      dl.append(row('Origen', h('span', { class: 'muted' }, 'Valor obtenido cambiando bits a mano.')));
    }

    const gap = ulp(bits, fmt);
    if (gap !== null) {
      dl.append(row('Siguiente valor representable', h('span', { html: `a una distancia de ${renderMath(`${powLabel(d.q)} \\approx ${sci(gap)}`)}. Ningún número entre ambos puede guardarse en ${fmt}.` })));
    }
    panel.append(dl);
  }

  render();
}
