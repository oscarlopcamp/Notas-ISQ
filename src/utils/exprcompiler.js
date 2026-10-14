// Compilador educativo de expresiones aritméticas a una máquina de pila.
// Recorre las mismas fases que un compilador real, a escala mínima:
// análisis léxico (tokens) → análisis sintáctico (árbol) → generación de
// código (instrucciones de pila) → ejecución en una máquina virtual.
// Admite enteros no negativos, + − * y paréntesis.

export class CompileError extends Error {
  constructor(message, position) { super(message); this.position = position; }
}

export function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i += 1; continue; }
    const num = /^\d+/.exec(src.slice(i));
    if (num) { tokens.push({ type: 'num', value: Number(num[0]), text: num[0], pos: i }); i += num[0].length; continue; }
    if ('+-*'.includes(c)) { tokens.push({ type: 'op', value: c, text: c, pos: i }); i += 1; continue; }
    if (c === '(' || c === ')') { tokens.push({ type: c, text: c, pos: i }); i += 1; continue; }
    throw new CompileError(`Carácter no válido «${c}»`, i);
  }
  return tokens;
}

/** Gramática: expr := term (('+'|'-') term)* ; term := factor ('*' factor)* ; factor := num | '(' expr ')' */
export function parse(tokens) {
  let k = 0;
  const peek = () => tokens[k];
  function expr() {
    let node = term();
    while (peek()?.type === 'op' && (peek().value === '+' || peek().value === '-')) {
      const op = tokens[k++].value;
      node = { type: 'bin', op, left: node, right: term() };
    }
    return node;
  }
  function term() {
    let node = factor();
    while (peek()?.type === 'op' && peek().value === '*') {
      k += 1;
      node = { type: 'bin', op: '*', left: node, right: factor() };
    }
    return node;
  }
  function factor() {
    const t = peek();
    if (!t) throw new CompileError('La expresión termina antes de tiempo', Infinity);
    if (t.type === 'num') { k += 1; return { type: 'num', value: t.value }; }
    if (t.type === '(') {
      k += 1;
      const e = expr();
      if (peek()?.type !== ')') throw new CompileError('Falta cerrar un paréntesis', peek()?.pos ?? Infinity);
      k += 1;
      return e;
    }
    throw new CompileError(`Se esperaba un número o «(» y apareció «${t.text}»`, t.pos);
  }
  if (!tokens.length) throw new CompileError('Escribe una expresión', 0);
  const tree = expr();
  if (k < tokens.length) throw new CompileError(`Sobra «${tokens[k].text}»`, tokens[k].pos);
  return tree;
}

const OPNAME = { '+': 'ADD', '-': 'SUB', '*': 'MUL' };

/** Generación de código por recorrido en postorden del árbol. */
export function compile(tree, code = []) {
  if (tree.type === 'num') code.push({ op: 'PUSH', arg: tree.value });
  else {
    compile(tree.left, code);
    compile(tree.right, code);
    code.push({ op: OPNAME[tree.op] });
  }
  return code;
}

/** Ejecuta el código y devuelve la pila tras cada instrucción. */
export function execute(code) {
  const stack = [];
  const trace = [];
  code.forEach((ins, pc) => {
    if (ins.op === 'PUSH') stack.push(ins.arg);
    else {
      const b = stack.pop(), a = stack.pop();
      stack.push(ins.op === 'ADD' ? a + b : ins.op === 'SUB' ? a - b : a * b);
    }
    trace.push({ pc, ins, stack: [...stack] });
  });
  return { result: stack[0], trace };
}

export const formatInstruction = (ins) => (ins.op === 'PUSH' ? `PUSH ${ins.arg}` : ins.op);
