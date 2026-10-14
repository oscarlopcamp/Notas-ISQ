// Fracciones decimales → binario por multiplicaciones sucesivas.
// Usa aritmética racional exacta (BigInt), por lo que detecta con certeza
// cuándo la expansión es periódica.

import { h, clear } from '../utils/dom.js';
import { parseDecimal, fractionToBinary } from '../utils/numbers.js';
import { renderMath } from '../utils/math.js';

const MAX = 24;

export function mount(root, { value = '0.625' } = {}) {
  let text = value;
  const input = h('input', { type: 'text', value, inputmode: 'decimal', class: 'mono', 'aria-label': 'Fracción decimal entre 0 y 1', oninput: (e) => { text = e.target.value; render(); } });
  const table = h('div', { class: 'table-wrap' });
  const result = h('div', { class: 'frac-result', 'aria-live': 'polite' });

  root.append(
    h('div', { class: 'widget-controls' },
      h('label', { class: 'widget-label' }, 'Fracción', input),
      ['0.625', '0.375', '0.1', '0.2', '0.3', '0.5'].map((v) => h('button', { type: 'button', class: 'chip mono', onclick: () => { input.value = v; text = v; render(); } }, v))),
    result,
    table,
  );

  function frac(num, den) {
    return `${num}/${den}`;
  }

  function render() {
    clear(table); clear(result);
    const parsed = parseDecimal(text.replace(',', '.'));
    if (!parsed || parsed.num < 0n || parsed.num >= parsed.den) {
      result.append(h('p', { class: 'widget-warning' }, 'Escribe un número decimal entre 0 (incluido) y 1 (excluido), por ejemplo 0.1 o 0,375. Se admite punto o coma.'));
      return;
    }
    const { num, den } = parsed;
    const exp = fractionToBinary(num, den, MAX);
    const digits = exp.digits.join('');

    let shown;
    if (exp.terminated || num === 0n) {
      shown = `0.${digits || '0'}_2`;
    } else if (exp.periodStart >= 0) {
      shown = `0.${digits.slice(0, exp.periodStart)}\\overline{${digits.slice(exp.periodStart)}}_2`;
    } else {
      shown = `0.${digits}\\ldots_2`;
    }
    result.append(
      h('div', { class: 'frac-eq', html: renderMath(`${text.trim().replace('.', '{,}')} = \\dfrac{${num}}{${den}} = ${shown.replace('0.', '0{,}')}`, true) }),
      h('p', { class: exp.terminated || num === 0n ? 'tc-ok' : 'tc-warn' },
        exp.terminated || num === 0n
          ? `Expansión finita: ${digits.length || 1} cifra${digits.length === 1 ? '' : 's'} binaria${digits.length === 1 ? '' : 's'}. El denominador de la fracción reducida (${den}) es una potencia de 2, así que se puede guardar exactamente.`
          : exp.periodStart >= 0
            ? `Expansión infinita periódica: el bloque «${digits.slice(exp.periodStart)}» se repite para siempre. El denominador reducido (${den}) no es una potencia de 2, así que ningún número finito de bits lo representa exactamente: habrá que redondear.`
            : `La expansión sigue más allá de ${MAX} cifras. Como el denominador reducido (${den}) no es una potencia de 2, es infinita y periódica, pero su período es más largo de lo que se muestra aquí. En cualquier caso, habrá que redondear.`),
    );

    if (!exp.steps.length) return;
    const rows = exp.steps.map((s, k) => h('tr', { class: exp.periodStart != null && exp.periodStart >= 0 && k >= exp.periodStart ? 'period' : '' },
      h('td', { class: 'mono' }, k + 1),
      h('td', { html: renderMath(`2 \\times \\tfrac{${s.before}}{${den}} = \\tfrac{${s.doubled}}{${den}}`) }),
      h('td', { class: 'mono' }, h('b', {}, s.bit)),
      h('td', { html: renderMath(s.after === 0n ? '0' : `\\tfrac{${s.after}}{${den}}`) }),
    ));
    table.append(h('table', {},
      h('caption', {}, exp.periodStart >= 0 && !exp.terminated
        ? `Las filas sombreadas forman el período: en el paso ${exp.steps.length + 1} volvería a aparecer el resto ${frac(exp.steps[exp.periodStart].before, den)}, y desde ahí todo se repite.`
        : 'Se multiplica por 2: la parte entera es la siguiente cifra binaria y la parte fraccionaria se sigue multiplicando.'),
      h('thead', {}, h('tr', {}, ['Paso', 'Multiplicar por 2', 'Cifra', 'Resto (parte fraccionaria)'].map((t) => h('th', {}, t)))),
      h('tbody', {}, rows)));
  }

  render();
}
