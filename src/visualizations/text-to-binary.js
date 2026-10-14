// Conversor texto → caracteres → codificación → bits → representación binaria.
// La codificación UTF-8 la realiza el navegador (TextEncoder), no una tabla propia.

import { h, clear } from '../utils/dom.js';
import { encodeText, toBinary, toHex, codePointLabel, describeChar } from '../utils/encoding.js';

const MAX_CHARS = 32;

export function mount(root, { text = 'HOLA', mode = 'ascii' } = {}) {
  let state = { text, mode, hover: null };

  const input = h('input', {
    type: 'text', value: text, maxlength: String(MAX_CHARS), spellcheck: 'false', autocomplete: 'off',
    id: `t2b-${Math.random().toString(36).slice(2, 7)}`,
    oninput: (e) => update({ text: e.target.value }),
  });
  const modeButtons = [
    ['ascii', 'ASCII (7 bits)'],
    ['utf8', 'UTF-8 (Unicode)'],
  ].map(([value, label]) => h('button', {
    type: 'button', class: 'chip', 'aria-pressed': String(value === mode),
    onclick: () => update({ mode: value }),
  }, label));

  const examples = ['HOLA', 'Hola', 'Año', 'Qubit |ψ⟩', '€ 5'].map((ex) =>
    h('button', { type: 'button', class: 'chip', onclick: () => { input.value = ex; update({ text: ex }); } }, ex));

  const pipeline = h('div', { class: 't2b-pipeline', role: 'table', 'aria-label': 'Descomposición del texto' });
  const stream = h('div', { class: 't2b-stream mono', 'aria-live': 'polite' });
  const stats = h('p', { class: 'widget-stats' });
  const warning = h('p', { class: 'widget-warning', hidden: true });

  root.append(
    h('div', { class: 'widget-controls' },
      h('label', { for: input.id, class: 'widget-label' }, 'Texto'),
      input,
      h('div', { class: 'chip-group', role: 'group', 'aria-label': 'Codificación' }, modeButtons),
    ),
    h('div', { class: 'widget-controls subtle' }, h('span', { class: 'widget-label' }, 'Ejemplos'), examples),
    pipeline,
    warning,
    h('div', { class: 't2b-stream-wrap' },
      h('div', { class: 'stage-label' }, 'Representación binaria (secuencia de bytes en memoria)'),
      stream),
    stats,
  );

  function update(patch) {
    state = { ...state, ...patch };
    modeButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(['ascii', 'utf8'][i] === state.mode)));
    render();
  }

  function render() {
    const items = encodeText(state.text, state.mode);
    clear(pipeline);
    pipeline.append(h('div', { class: 't2b-row t2b-head', role: 'row' },
      ['#', 'Carácter', 'Punto de código', 'Bits (bytes)'].map((t, i) =>
        h('div', { role: 'columnheader', class: `stage-label c${i}` }, t, i === 1 || i === 2 ? h('span', { class: 'arrow', 'aria-hidden': 'true' }, '→') : null))));

    items.forEach((item, i) => {
      const active = state.hover === i;
      const row = h('div', {
        class: `t2b-row${active ? ' active' : ''}${item.representable ? '' : ' invalid'}`,
        role: 'row',
        onmouseenter: () => highlight(i), onmouseleave: () => highlight(null),
        onfocus: () => highlight(i), onblur: () => highlight(null), tabindex: '0',
      },
        h('div', { role: 'cell', class: 'c0' }, h('span', { class: 't2b-index mono' }, i + 1)),
        h('div', { role: 'cell', class: 'c1' }, h('span', { class: 't2b-char' }, describeChar(item.char))),
        h('div', { role: 'cell', class: 'c2 mono' },
          h('span', { class: 't2b-cp' }, codePointLabel(item.codePoint)),
          h('span', { class: 'muted' }, ` = ${item.codePoint}`),
          item.representable && state.mode === 'utf8' && item.bytes.length > 1
            ? h('span', { class: 't2b-note' }, ` → ${item.bytes.length} bytes: ${item.bytes.map((b) => toHex(b)).join(' ')}`)
            : null),
        h('div', { role: 'cell', class: 'c3 mono' },
          item.representable
            ? item.bytes.map((b) => h('span', { class: 't2b-byte' }, renderBits(toBinary(b))))
            : h('span', { class: 't2b-bad' }, 'sin código ASCII')),
      );
      pipeline.append(row);
    });

    if (items.length === 0) pipeline.append(h('p', { class: 'muted widget-empty' }, 'Escribe algún carácter para ver su representación.'));

    clear(stream);
    let bytes = 0;
    items.forEach((item, i) => {
      item.bytes.forEach((b) => {
        bytes += 1;
        stream.append(h('span', {
          class: `t2b-seg${state.hover === i ? ' active' : ''}${i % 2 ? ' alt' : ''}`,
          onmouseenter: () => highlight(i), onmouseleave: () => highlight(null),
        }, toBinary(b)));
      });
    });

    const bad = items.filter((it) => !it.representable);
    warning.hidden = bad.length === 0;
    warning.textContent = bad.length
      ? `ASCII solo define los valores 0–127. ${bad.map((b) => `«${b.char}» (${codePointLabel(b.codePoint)})`).join(', ')} no tiene representación en ASCII: cambia a UTF-8 para codificarlo.`
      : '';

    stats.textContent = `${items.length} ${items.length === 1 ? 'carácter' : 'caracteres'} · ${bytes} ${bytes === 1 ? 'byte' : 'bytes'} · ${bytes * 8} bits`
      + (state.mode === 'utf8' && bytes !== items.length ? ' — en UTF-8, no todos los caracteres ocupan un byte.' : '');
  }

  function highlight(i) {
    state.hover = i;
    pipeline.querySelectorAll('.t2b-row:not(.t2b-head)').forEach((row, k) => row.classList.toggle('active', k === i));
    let k = 0;
    const items = encodeText(state.text, state.mode);
    const segs = stream.querySelectorAll('.t2b-seg');
    items.forEach((item, idx) => item.bytes.forEach(() => { segs[k]?.classList.toggle('active', idx === i); k += 1; }));
  }

  render();
}

function renderBits(bits) {
  return Array.from(bits).map((b) => h('span', { class: b === '1' ? 'b1' : 'b0' }, b));
}
