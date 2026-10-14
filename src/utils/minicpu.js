// MiniCPU: procesador educativo de acumulador con arquitectura de von Neumann.
//
// NO es un procesador real. Es un modelo mínimo diseñado para esta plataforma:
//   · Memoria de 32 palabras de 8 bits; programa y datos comparten memoria.
//   · Registros: PC (contador de programa, 5 bits), IR (registro de instrucción),
//     ACC (acumulador, 8 bits; la aritmética es módulo 256).
//   · Instrucción de 8 bits: 3 bits de código de operación + 5 bits de dirección.
// La misma máquina se implementa en Python en la lección 1.9 (nivel 3).

export const OPCODES = [
  { name: 'HALT', desc: 'Detiene la máquina.' },
  { name: 'LOAD', desc: 'ACC ← M[d]' },
  { name: 'STORE', desc: 'M[d] ← ACC' },
  { name: 'ADD', desc: 'ACC ← (ACC + M[d]) mod 256' },
  { name: 'SUB', desc: 'ACC ← (ACC − M[d]) mod 256' },
  { name: 'JMP', desc: 'PC ← d' },
  { name: 'JZ', desc: 'si ACC = 0, PC ← d' },
  { name: 'OUT', desc: 'Envía ACC a la salida.' },
];
export const MEM_SIZE = 32;
const USES_ADDRESS = new Set(['LOAD', 'STORE', 'ADD', 'SUB', 'JMP', 'JZ']);

export const encode = (name, address = 0) => (OPCODES.findIndex((o) => o.name === name) << 5) | (address & 0x1F);
export const decodeWord = (word) => ({ op: word >> 5, address: word & 0x1F, name: OPCODES[word >> 5].name });

export function disassemble(word) {
  const { name, address } = decodeWord(word);
  return USES_ADDRESS.has(name) ? `${name} ${address}` : name;
}

/**
 * Ensambla líneas como «LOAD 20», «OUT», «20: 5» (dato en la dirección 20).
 * Las instrucciones se colocan desde la dirección 0. Admite comentarios con «;».
 */
export function assemble(source) {
  const memory = Array(MEM_SIZE).fill(0);
  let pc = 0;
  source.split('\n').forEach((raw, lineNo) => {
    const line = raw.replace(/;.*/, '').trim();
    if (!line) return;
    const data = /^(\d+)\s*:\s*(\d+)$/.exec(line);
    if (data) {
      const [addr, value] = [Number(data[1]), Number(data[2])];
      if (addr >= MEM_SIZE || value > 255) throw new SyntaxError(`Línea ${lineNo + 1}: dato fuera de rango`);
      memory[addr] = value;
      return;
    }
    const m = /^([A-Za-z]+)(?:\s+(\d+))?$/.exec(line);
    const name = m?.[1].toUpperCase();
    if (!m || !OPCODES.some((o) => o.name === name)) throw new SyntaxError(`Línea ${lineNo + 1}: instrucción desconocida «${line}»`);
    const address = m[2] ? Number(m[2]) : 0;
    if (USES_ADDRESS.has(name) && m[2] === undefined) throw new SyntaxError(`Línea ${lineNo + 1}: ${name} necesita una dirección`);
    if (address >= MEM_SIZE) throw new SyntaxError(`Línea ${lineNo + 1}: dirección fuera de rango (0–31)`);
    memory[pc] = encode(name, address);
    pc += 1;
  });
  return memory;
}

export function createState(memory) {
  return { mem: [...memory], pc: 0, ir: 0, acc: 0, phase: 'fetch', halted: false, output: [], instructions: 0, lastWrite: null, lastRead: null };
}

/**
 * Avanza una fase del ciclo (búsqueda → decodificación → ejecución).
 * Devuelve un estado nuevo y una explicación de lo ocurrido.
 */
export function stepPhase(state) {
  if (state.halted) return { state, text: 'La máquina está detenida.' };
  const s = { ...state, mem: [...state.mem], output: [...state.output], lastWrite: null, lastRead: null };
  if (s.phase === 'fetch') {
    s.ir = s.mem[s.pc];
    s.lastRead = s.pc;
    const text = `Búsqueda: se lee M[${s.pc}] = ${s.ir.toString(2).padStart(8, '0')} y se copia en IR. PC pasa de ${s.pc} a ${(s.pc + 1) % MEM_SIZE}.`;
    s.pc = (s.pc + 1) % MEM_SIZE;
    s.phase = 'decode';
    return { state: s, text };
  }
  const { name, address, op } = decodeWord(s.ir);
  if (s.phase === 'decode') {
    s.phase = 'execute';
    const bits = s.ir.toString(2).padStart(8, '0');
    return { state: s, text: `Decodificación: código ${bits.slice(0, 3)} = ${name} (${OPCODES[op].desc})${USES_ADDRESS.has(name) ? `, dirección ${bits.slice(3)} = ${address}` : ''}.` };
  }
  // Ejecución
  let text;
  switch (name) {
    case 'HALT': s.halted = true; text = 'Ejecución: HALT. El programa termina.'; break;
    case 'LOAD': s.acc = s.mem[address]; s.lastRead = address; text = `Ejecución: ACC ← M[${address}] = ${s.acc}.`; break;
    case 'STORE': s.mem[address] = s.acc; s.lastWrite = address; text = `Ejecución: M[${address}] ← ACC = ${s.acc}.`; break;
    case 'ADD': {
      const v = s.mem[address]; const r = (s.acc + v) % 256; s.lastRead = address;
      text = `Ejecución: ACC ← ${s.acc} + M[${address}] (${v}) = ${r}${s.acc + v > 255 ? ' (módulo 256: hubo desbordamiento)' : ''}.`;
      s.acc = r; break;
    }
    case 'SUB': {
      const v = s.mem[address]; const r = (s.acc - v + 256) % 256; s.lastRead = address;
      text = `Ejecución: ACC ← ${s.acc} − M[${address}] (${v}) = ${r}${s.acc - v < 0 ? ' (módulo 256)' : ''}.`;
      s.acc = r; break;
    }
    case 'JMP': text = `Ejecución: salto incondicional; PC ← ${address}.`; s.pc = address; break;
    case 'JZ':
      if (s.acc === 0) { text = `Ejecución: ACC = 0, así que se salta; PC ← ${address}.`; s.pc = address; }
      else text = `Ejecución: ACC = ${s.acc} ≠ 0, no se salta; PC sigue en ${s.pc}.`;
      break;
    case 'OUT': s.output.push(s.acc); text = `Ejecución: se envía ACC = ${s.acc} a la salida.`; break;
    default: text = '';
  }
  s.instructions += 1;
  s.phase = 'fetch';
  return { state: s, text };
}

/** Ejecuta hasta HALT (o hasta un máximo de instrucciones, para evitar bucles infinitos). */
export function run(memory, maxInstructions = 1000) {
  let s = createState(memory);
  let guard = 0;
  while (!s.halted && s.instructions < maxInstructions && guard < maxInstructions * 3 + 3) {
    s = stepPhase(s).state;
    guard += 1;
  }
  return s;
}

export const PROGRAMS = {
  suma: {
    title: 'Suma de dos números',
    source: `LOAD 20   ; ACC ← primer número
ADD 21    ; ACC ← ACC + segundo número
STORE 22  ; guarda el resultado
OUT       ; lo muestra
HALT
20: 5
21: 7`,
  },
  minuscula: {
    title: '«H» → «h» (lección 1.1)',
    source: `LOAD 20   ; código de «H» (72)
ADD 21    ; + 32
OUT       ; 104 = «h»
HALT
20: 72
21: 32`,
  },
  cuenta: {
    title: 'Cuenta atrás (bucle)',
    source: `LOAD 20   ; n
OUT       ; dirección 1: inicio del bucle
SUB 21    ; n ← n − 1
JZ 5      ; si llega a 0, sale del bucle
JMP 1     ; si no, repite
OUT       ; dirección 5: muestra el 0
HALT
20: 3
21: 1`,
  },
  multiplica: {
    title: 'Multiplicación por sumas',
    source: `LOAD 22   ; resultado
ADD 20    ; + a
STORE 22
LOAD 21   ; b (contador)
SUB 23    ; b − 1
STORE 21
JZ 8      ; si b = 0, termina
JMP 0
LOAD 22   ; dirección 8
OUT
HALT
20: 6
21: 4
22: 0
23: 1`,
  },
};
