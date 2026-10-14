// Álgebra booleana: análisis de expresiones, tablas de verdad, equivalencia
// y síntesis de suma de productos (con simplificación de Quine–McCluskey).
// Funciones puras, cubiertas por tests/.
//
// Sintaxis admitida (variables A–F, constantes 0 y 1):
//   NOT: ¬A  !A  ~A  A'  NOT A        AND: A·B  A*B  A&B  A∧B  AB  A AND B
//   XOR: A⊕B  A^B  A XOR B             OR:  A+B  A|B  A∨B  A OR B
// Precedencia: NOT > AND > XOR > OR.

const KEYWORDS = { AND: 'and', OR: 'or', XOR: 'xor', NOT: 'not' };
const SYMBOLS = {
  '¬': 'not', '!': 'not', '~': 'not', "'": 'postnot', '’': 'postnot',
  '·': 'and', '*': 'and', '&': 'and', '∧': 'and', '⋅': 'and',
  '+': 'or', '|': 'or', '∨': 'or',
  '⊕': 'xor', '^': 'xor',
  '(': '(', ')': ')',
};

export class LogicSyntaxError extends Error {
  constructor(message, position) { super(message); this.position = position; }
}

export function tokenize(src) {
  const tokens = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i += 1; continue; }
    const word = /^[A-Za-z]+/.exec(src.slice(i));
    if (word && KEYWORDS[word[0].toUpperCase()] && word[0].length > 1) {
      tokens.push({ type: KEYWORDS[word[0].toUpperCase()], pos: i });
      i += word[0].length;
      continue;
    }
    if (/[A-F]/.test(c)) { tokens.push({ type: 'var', name: c, pos: i }); i += 1; continue; }
    if (/[a-f]/.test(c)) { tokens.push({ type: 'var', name: c.toUpperCase(), pos: i }); i += 1; continue; }
    if (c === '0' || c === '1') { tokens.push({ type: 'const', value: c === '1', pos: i }); i += 1; continue; }
    if (SYMBOLS[c]) { tokens.push({ type: SYMBOLS[c], pos: i }); i += 1; continue; }
    throw new LogicSyntaxError(`Símbolo no reconocido «${c}»`, i);
  }
  return tokens;
}

export function parse(src) {
  const tokens = tokenize(src);
  let k = 0;
  const peek = () => tokens[k];
  const expect = (type) => {
    if (peek()?.type !== type) throw new LogicSyntaxError(type === ')' ? 'Falta cerrar un paréntesis' : 'Expresión incompleta', peek()?.pos ?? src.length);
    k += 1;
  };
  const startsFactor = (t) => t && (t.type === 'var' || t.type === 'const' || t.type === '(' || t.type === 'not');

  function parseOr() {
    let left = parseXor();
    while (peek()?.type === 'or') { k += 1; left = { type: 'or', a: left, b: parseXor() }; }
    return left;
  }
  function parseXor() {
    let left = parseAnd();
    while (peek()?.type === 'xor') { k += 1; left = { type: 'xor', a: left, b: parseAnd() }; }
    return left;
  }
  function parseAnd() {
    let left = parseUnary();
    for (;;) {
      if (peek()?.type === 'and') { k += 1; left = { type: 'and', a: left, b: parseUnary() }; }
      else if (startsFactor(peek())) left = { type: 'and', a: left, b: parseUnary() }; // yuxtaposición: AB
      else return left;
    }
  }
  function parseUnary() {
    if (peek()?.type === 'not') { k += 1; return postfix({ type: 'not', a: parseUnary() }); }
    return postfix(parseAtom());
  }
  function postfix(node) {
    while (peek()?.type === 'postnot') { k += 1; node = { type: 'not', a: node }; }
    return node;
  }
  function parseAtom() {
    const t = peek();
    if (!t) throw new LogicSyntaxError('Expresión incompleta', src.length);
    if (t.type === 'var') { k += 1; return { type: 'var', name: t.name }; }
    if (t.type === 'const') { k += 1; return { type: 'const', value: t.value }; }
    if (t.type === '(') { k += 1; const e = parseOr(); expect(')'); return e; }
    throw new LogicSyntaxError('Se esperaba una variable, una constante o «(»', t.pos);
  }

  if (!tokens.length) throw new LogicSyntaxError('Escribe una expresión', 0);
  const ast = parseOr();
  if (k < tokens.length) throw new LogicSyntaxError('Sobra algo al final de la expresión', tokens[k].pos);
  return ast;
}

export function variables(ast, acc = new Set()) {
  if (ast.type === 'var') acc.add(ast.name);
  if (ast.a) variables(ast.a, acc);
  if (ast.b) variables(ast.b, acc);
  return [...acc].sort();
}

export function evaluate(ast, env) {
  switch (ast.type) {
    case 'var': return Boolean(env[ast.name]);
    case 'const': return ast.value;
    case 'not': return !evaluate(ast.a, env);
    case 'and': return evaluate(ast.a, env) && evaluate(ast.b, env);
    case 'or': return evaluate(ast.a, env) || evaluate(ast.b, env);
    case 'xor': return evaluate(ast.a, env) !== evaluate(ast.b, env);
    default: throw new Error(`Nodo desconocido ${ast.type}`);
  }
}

const PREC = { or: 1, xor: 2, and: 3, not: 4, var: 5, const: 5 };
const SYM = { or: ' + ', xor: ' ⊕ ', and: '·' };
/** Expresión normalizada con símbolos matemáticos y los paréntesis mínimos. */
export function format(ast, parent = 0) {
  let s;
  if (ast.type === 'var') s = ast.name;
  else if (ast.type === 'const') s = ast.value ? '1' : '0';
  else if (ast.type === 'not') s = `¬${format(ast.a, PREC.not)}`;
  else s = `${format(ast.a, PREC[ast.type])}${SYM[ast.type]}${format(ast.b, PREC[ast.type] + (ast.type === 'and' ? 0 : 0.5))}`;
  return PREC[ast.type] < parent ? `(${s})` : s;
}

/** Filas de la tabla de verdad en orden binario (A es el bit más significativo). */
export function truthTable(ast, vars = variables(ast)) {
  const rows = [];
  for (let m = 0; m < 2 ** vars.length; m += 1) {
    const env = {};
    vars.forEach((v, i) => { env[v] = Boolean((m >> (vars.length - 1 - i)) & 1); });
    rows.push({ m, env, out: evaluate(ast, env) });
  }
  return { vars, rows };
}

/** Compara dos expresiones en todas las combinaciones de sus variables. */
export function equivalent(a, b) {
  const vars = [...new Set([...variables(a), ...variables(b)])].sort();
  const ta = truthTable(a, vars), tb = truthTable(b, vars);
  const differences = ta.rows.map((r) => ({ ...r, other: tb.rows[r.m].out })).filter((r) => r.out !== r.other);
  return { vars, equal: differences.length === 0, differences, rowsA: ta.rows, rowsB: tb.rows };
}

// ---------- Síntesis ----------

const literal = (name, value) => (value ? name : `¬${name}`);

/** Suma de productos canónica (un término por cada fila con salida 1). */
export function canonicalSOP(vars, outputs) {
  const terms = [];
  outputs.forEach((out, m) => {
    if (!out) return;
    terms.push(vars.map((v, i) => literal(v, (m >> (vars.length - 1 - i)) & 1)).join('·'));
  });
  return terms.length ? terms.join(' + ') : '0';
}

/**
 * Simplificación por Quine–McCluskey: implicantes primos, esenciales y una
 * cobertura voraz del resto. Para pocas variables suele dar la expresión mínima,
 * pero la cobertura voraz no la garantiza en general.
 */
export function simplifySOP(vars, outputs) {
  const n = vars.length;
  const minterms = outputs.map((o, m) => (o ? m : -1)).filter((m) => m >= 0);
  if (!minterms.length) return { expression: '0', implicants: [] };
  if (minterms.length === 2 ** n) return { expression: '1', implicants: [] };

  // Un implicante es una cadena de '0', '1' y '-' (variable eliminada).
  let current = [...new Set(minterms.map((m) => m.toString(2).padStart(n, '0')))];
  const primes = new Set();
  while (current.length) {
    const used = new Set();
    const next = new Set();
    for (let i = 0; i < current.length; i += 1) {
      for (let j = i + 1; j < current.length; j += 1) {
        const a = current[i], b = current[j];
        let diff = -1, count = 0;
        for (let p = 0; p < n; p += 1) if (a[p] !== b[p]) { diff = p; count += 1; }
        if (count === 1 && a[diff] !== '-' && b[diff] !== '-') {
          next.add(`${a.slice(0, diff)}-${a.slice(diff + 1)}`);
          used.add(a); used.add(b);
        }
      }
    }
    current.filter((c) => !used.has(c)).forEach((c) => primes.add(c));
    current = [...next];
  }

  const covers = (imp, m) => {
    const bits = m.toString(2).padStart(n, '0');
    return [...imp].every((c, p) => c === '-' || c === bits[p]);
  };
  const primeList = [...primes];
  const chosen = new Set();
  let remaining = new Set(minterms);
  // Esenciales
  minterms.forEach((m) => {
    const cover = primeList.filter((p) => covers(p, m));
    if (cover.length === 1) chosen.add(cover[0]);
  });
  chosen.forEach((p) => minterms.forEach((m) => { if (covers(p, m)) remaining.delete(m); }));
  // Voraz
  while (remaining.size) {
    let best = null, bestCount = -1;
    primeList.forEach((p) => {
      if (chosen.has(p)) return;
      const c = [...remaining].filter((m) => covers(p, m)).length;
      const lits = [...p].filter((x) => x !== '-').length;
      if (c > bestCount || (c === bestCount && best && lits < [...best].filter((x) => x !== '-').length)) { best = p; bestCount = c; }
    });
    chosen.add(best);
    [...remaining].forEach((m) => { if (covers(best, m)) remaining.delete(m); });
  }
  const implicants = [...chosen].sort();
  const expression = implicants
    .map((imp) => [...imp].map((c, p) => (c === '-' ? '' : literal(vars[p], c === '1'))).filter(Boolean).join('·'))
    .join(' + ');
  return { expression, implicants };
}

// ---------- Compuertas y circuitos ----------

export const GATES = {
  AND: { arity: 2, fn: (a, b) => a & b, symbol: '·' },
  OR: { arity: 2, fn: (a, b) => a | b, symbol: '+' },
  NOT: { arity: 1, fn: (a) => 1 - a, symbol: '¬' },
  XOR: { arity: 2, fn: (a, b) => a ^ b, symbol: '⊕' },
  NAND: { arity: 2, fn: (a, b) => 1 - (a & b), symbol: '↑' },
  NOR: { arity: 2, fn: (a, b) => 1 - (a | b), symbol: '↓' },
  XNOR: { arity: 2, fn: (a, b) => 1 - (a ^ b), symbol: '⊙' },
};

/**
 * Evalúa un circuito combinacional. `circuit.gates` debe estar en orden
 * topológico: [{ id, type, in: [idOrigen, …] }]. Devuelve el valor de cada nodo.
 */
export function evaluateCircuit(circuit, inputs) {
  const values = { ...inputs };
  circuit.gates.forEach((g) => {
    const args = g.in.map((src) => {
      if (values[src] === undefined) throw new Error(`Señal no definida: ${src}`);
      return values[src];
    });
    values[g.id] = GATES[g.type].fn(...args);
  });
  return values;
}
