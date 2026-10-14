// Ejecutor mínimo de pruebas en el navegador (sin dependencias).
// Escribe el resultado en <body data-status="pass|fail"> para poder
// comprobarlo también desde un navegador sin interfaz (ver README).

const suites = [];
export function suite(name, fn) { suites.push({ name, fn }); }

export function assert(cond, message) { if (!cond) throw new Error(message || 'Aserción fallida'); }
export function equal(actual, expected, message) {
  const big = (_, v) => (typeof v === 'bigint' ? `${v}n` : v);
  const a = JSON.stringify(actual, big), e = JSON.stringify(expected, big);
  if (a !== e) throw new Error(`${message ? `${message}: ` : ''}se esperaba ${e}, se obtuvo ${a}`);
}

async function run() {
  await import('./encoding.test.js');
  await import('./numbers.test.js');
  await import('./module1.test.js');
  await import('./content.test.js');
  const out = document.getElementById('results');
  let passed = 0, failed = 0;
  for (const s of suites) {
    const tests = [];
    const t = (name, fn) => tests.push({ name, fn });
    await s.fn(t);
    out.insertAdjacentHTML('beforeend', `<h2>${s.name}</h2>`);
    for (const test of tests) {
      try {
        await test.fn();
        passed += 1;
        out.insertAdjacentHTML('beforeend', `<div class="pass">✓ ${test.name}</div>`);
      } catch (err) {
        failed += 1;
        out.insertAdjacentHTML('beforeend', `<div class="fail">✗ ${test.name}</div><pre>${String(err.message).replace(/</g, '&lt;')}</pre>`);
      }
    }
  }
  document.getElementById('summary').textContent = `${passed} pruebas superadas, ${failed} fallidas.`;
  document.body.dataset.status = failed ? 'fail' : 'pass';
  document.body.dataset.summary = `${passed}/${passed + failed}`;
}

run().catch((err) => {
  document.getElementById('summary').textContent = `Error al ejecutar las pruebas: ${err.message}`;
  document.body.dataset.status = 'fail';
});
