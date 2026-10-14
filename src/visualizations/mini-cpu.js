// MiniCPU: un procesador educativo de von Neumann paso a paso.
// Muestra memoria, registros y el ciclo búsqueda → decodificación → ejecución.

import { h, clear } from '../utils/dom.js';
import { assemble, createState, stepPhase, disassemble, PROGRAMS, OPCODES, MEM_SIZE } from '../utils/minicpu.js';

const PHASES = [['fetch', 'Búsqueda'], ['decode', 'Decodificación'], ['execute', 'Ejecución']];

export function mount(root, { program = 'suma' } = {}) {
  let progId = program;
  let source = PROGRAMS[progId].source;
  let state, log, timer = null;

  const progSel = h('select', { 'aria-label': 'Programa', onchange: (e) => { progId = e.target.value; source = PROGRAMS[progId].source; editor.value = source; load(); } },
    Object.entries(PROGRAMS).map(([k, p]) => h('option', { value: k, selected: k === progId }, p.title)));
  const editor = h('textarea', { class: 'cpu-editor mono', rows: '10', wrap: 'off', spellcheck: 'false', 'aria-label': 'Código ensamblador' }, source);
  const asmMsg = h('p', { class: 'small' });
  const memView = h('div', { class: 'cpu-mem', role: 'table', 'aria-label': 'Memoria' });
  const regs = h('div', { class: 'cpu-regs' });
  const phaseBar = h('div', { class: 'cpu-phases' });
  const explain = h('p', { class: 'cpu-explain', 'aria-live': 'polite' });
  const output = h('div', { class: 'cpu-output' });
  const runBtn = h('button', { type: 'button', class: 'btn', onclick: () => toggleRun() }, '▶ Ejecutar');

  root.append(
    h('div', { class: 'widget-controls' }, h('span', { class: 'widget-label' }, 'Programa'), progSel),
    h('div', { class: 'cpu-layout' },
      h('div', { class: 'cpu-left' },
        h('div', { class: 'widget-label' }, 'Ensamblador'), editor,
        h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn', onclick: () => { source = editor.value; load(); } }, 'Ensamblar y cargar')),
        asmMsg,
        h('details', { class: 'cpu-isa' }, h('summary', {}, 'Juego de instrucciones (8 instrucciones)'),
          h('table', { class: 'tt-table' }, h('tbody', {}, OPCODES.map((o, i) => h('tr', {}, h('td', { class: 'mono' }, i.toString(2).padStart(3, '0')), h('td', { class: 'mono' }, o.name), h('td', {}, o.desc))))),
          h('p', { class: 'small muted' }, 'Formato: 3 bits de código de operación + 5 bits de dirección (0–31). «20: 5» coloca el dato 5 en la dirección 20.'))),
      h('div', { class: 'cpu-right' },
        regs, phaseBar,
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn primary', onclick: () => { stopRun(); advance(); } }, 'Siguiente fase'),
          h('button', { type: 'button', class: 'btn', onclick: () => { stopRun(); do advance(); while (!state.halted && state.phase !== 'fetch'); } }, 'Instrucción completa'),
          runBtn,
          h('button', { type: 'button', class: 'btn', onclick: () => { stopRun(); load(); } }, 'Reiniciar')),
        explain, output)),
    h('div', { class: 'widget-label' }, 'Memoria (32 palabras de 8 bits: programa y datos juntos)'),
    h('p', { class: 'muted small' }, 'Cada celda muestra su dirección, sus bits, su valor decimal y cómo se leería si fuera una instrucción. Para la memoria no hay diferencia: el dato 5 en la dirección 20 también «se lee» como HALT 5.'),
    memView,
  );

  function load() {
    stopRun();
    try {
      const mem = assemble(source);
      state = createState(mem);
      log = 'Programa cargado. Pulsa «Siguiente fase» para ver cómo la CPU lo ejecuta.';
      asmMsg.className = 'small tc-ok';
      asmMsg.textContent = `Ensamblado correctamente (${source.split('\n').filter((l) => /^\s*[A-Za-z]/.test(l)).length} instrucciones).`;
    } catch (err) {
      asmMsg.className = 'small tc-warn';
      asmMsg.textContent = err.message;
    }
    render();
  }

  function advance() {
    if (!state || state.halted) return;
    const r = stepPhase(state);
    state = r.state;
    log = r.text;
    if (state.instructions >= 500 && !state.halted) { state = { ...state, halted: true }; log = 'Detenido tras 500 instrucciones: ¿hay un bucle infinito?'; }
    render();
  }

  function stopRun() { if (timer) { clearInterval(timer); timer = null; runBtn.textContent = '▶ Ejecutar'; } }
  function toggleRun() {
    if (timer) { stopRun(); return; }
    if (state.halted) load();
    runBtn.textContent = '⏸ Pausa';
    timer = setInterval(() => { advance(); if (state.halted) stopRun(); }, 350);
  }

  function render() {
    if (!state) return;
    clear(regs);
    const reg = (name, value, bitsN, note) => h('div', { class: 'cpu-reg' }, h('span', { class: 'cpu-reg-name' }, name),
      h('span', { class: 'mono cpu-reg-val' }, value.toString(2).padStart(bitsN, '0')), h('span', { class: 'cpu-reg-dec' }, note ?? String(value)));
    regs.append(
      reg('PC', state.pc, 5, `${state.pc} · próxima instrucción`),
      reg('IR', state.ir, 8, disassemble(state.ir)),
      reg('ACC', state.acc, 8, `${state.acc}`),
    );
    clear(phaseBar);
    PHASES.forEach(([id, label]) => phaseBar.append(h('span', { class: `cpu-phase ${state.phase === id && !state.halted ? 'next' : ''}` }, label)));
    phaseBar.append(h('span', { class: 'muted small' }, state.halted ? ' · detenida' : ` · instrucciones ejecutadas: ${state.instructions}`));
    explain.textContent = log;
    clear(output);
    output.append(h('span', { class: 'widget-label' }, 'Salida'), state.output.length
      ? state.output.map((v) => h('span', { class: 'cpu-out mono' }, v >= 32 && v < 127 && progId === 'minuscula' ? `${v} («${String.fromCharCode(v)}»)` : String(v)))
      : h('span', { class: 'muted' }, '—'));

    clear(memView);
    for (let a = 0; a < MEM_SIZE; a += 1) {
      const w = state.mem[a];
      const isPc = a === state.pc && !state.halted;
      memView.append(h('div', { class: `cpu-cell ${isPc ? 'pc' : ''} ${state.lastRead === a ? 'read' : ''} ${state.lastWrite === a ? 'write' : ''}`, role: 'row', title: `Dirección ${a}` },
        h('span', { class: 'cpu-addr mono' }, a),
        h('span', { class: 'mono cpu-word' }, w.toString(2).padStart(8, '0')),
        h('span', { class: 'cpu-dis mono', title: 'Valor decimal · lectura como instrucción' }, w ? `${w} · ${disassemble(w)}` : '0')));
    }
  }

  load();
  return stopRun;
}
