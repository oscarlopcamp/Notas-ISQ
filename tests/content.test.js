// Integridad del contenido: todo identificador citado debe existir.
// Estas pruebas impiden publicar lecciones con citas, términos, enlaces o
// visualizaciones rotas.

import { suite, equal, assert } from './run.js';
import { lessons, modules, lessonById } from '../content/curriculum.js';
import { glossary, glossaryById } from '../content/glossary.js';
import { concepts } from '../content/library.js';
import { tutorials } from '../content/tutorials.js';
import { referenceList, references, citationLabel } from '../references/references.js';
import { widgets } from '../src/visualizations/registry.js';
import { figures } from '../src/visualizations/figures.js';
import { inline } from '../src/utils/text.js';

function scanMarkup(source, where) {
  const problems = [];
  for (const [, body] of source.matchAll(/\[(@[^\]]+)\]/g)) {
    body.split(';').forEach((part) => {
      const key = part.trim().match(/^@([\w-]+)/)?.[1];
      if (!references[key]) problems.push(`${where}: cita desconocida «${part.trim()}»`);
    });
  }
  for (const [, isLesson, id] of source.matchAll(/\[\[(>?)([\w-]+)(?:\|[^\]]+)?\]\]/g)) {
    if (isLesson && !lessonById(id)) problems.push(`${where}: lección desconocida «${id}»`);
    if (!isLesson && !glossaryById[id]) problems.push(`${where}: término desconocido «${id}»`);
  }
  const dollars = (source.replace(/\\\$/g, '').match(/\$/g) || []).length;
  if (dollars % 2) problems.push(`${where}: número impar de delimitadores $ (fórmula sin cerrar)`);
  return problems;
}

function walkStrings(value, fn, path = '') {
  if (typeof value === 'string') fn(value, path);
  else if (Array.isArray(value)) value.forEach((v, i) => walkStrings(v, fn, `${path}[${i}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => walkStrings(v, fn, `${path}.${k}`));
}

suite('Programa académico (content/curriculum.js)', (t) => {
  t('nueve módulos, en orden', () => equal(modules.map((m) => m.number), ['01', '02', '03', '04', '05', '06', '07', '08', '09']));
  t('identificadores de lección únicos', () => {
    const ids = lessons.map((l) => l.id);
    equal(ids.length, new Set(ids).size);
  });
  t('todos los requisitos previos existen', () => {
    lessons.forEach((l) => l.prerequisites.forEach((p) => assert(lessonById(p), `${l.id} → ${p}`)));
  });
  t('cada lección declara al menos un tema', () => lessons.forEach((l) => assert(l.topics.length > 0, l.id)));
  t('la primera lección está disponible', () => equal(lessons[0].status, 'disponible'));
});

suite('Lecciones publicadas', async (t) => {
  const published = lessons.filter((l) => l.status === 'disponible');
  const loaded = await Promise.all(published.map(async (l) => [l, (await l.load()).default]));

  loaded.forEach(([meta, lesson]) => {
    t(`${meta.id}: el id del archivo coincide con el índice`, () => equal(lesson.id, meta.id));
    t(`${meta.id}: estructura pedagógica mínima`, () => {
      ['title', 'objectives', 'context', 'introduction', 'levels', 'summary', 'references'].forEach((k) => assert(lesson[k], `falta «${k}»`));
      assert(lesson.levels.comprender, 'falta el nivel «comprender»');
      ['learn', 'why', 'previous', 'next'].forEach((k) => assert(lesson.context[k], `falta context.${k}`));
    });
    t(`${meta.id}: citas, términos y enlaces resuelven`, () => {
      const problems = [];
      walkStrings(lesson, (s, p) => problems.push(...scanMarkup(s, p)));
      assert(problems.length === 0, problems.join('\n'));
    });
    t(`${meta.id}: visualizaciones y figuras registradas`, () => {
      const missing = [];
      walkStrings(lesson, () => {});
      const visit = (blocks) => (blocks || []).forEach((b) => {
        if (b.type === 'widget' && !widgets[b.id]) missing.push(`widget ${b.id}`);
        if (b.type === 'figure' && !figures[b.id]) missing.push(`figura ${b.id}`);
        if (b.blocks) visit(b.blocks);
      });
      visit(lesson.introduction);
      Object.values(lesson.levels).forEach((lvl) => lvl.sections.forEach((s) => visit(s.blocks)));
      assert(missing.length === 0, missing.join(', '));
    });
    t(`${meta.id}: la bibliografía usa referencias existentes y verificadas`, () => {
      lesson.references.forEach(({ key }) => {
        assert(references[key], `referencia ${key} no existe`);
        equal(references[key].verification?.status, 'verificado', key);
      });
    });
    t(`${meta.id}: toda referencia citada en el texto figura en la bibliografía`, () => {
      const listed = new Set(lesson.references.map((r) => r.key));
      const cited = new Set();
      walkStrings(lesson, (s) => { for (const [, key] of s.matchAll(/@([\w-]+)/g)) if (references[key]) cited.add(key); });
      const missing = [...cited].filter((k) => !listed.has(k));
      assert(missing.length === 0, `citadas pero no listadas: ${missing.join(', ')}`);
    });
    t(`${meta.id}: lecciones relacionadas y siguiente existen`, () => {
      (lesson.related || []).forEach((r) => assert(lessonById(r), r));
      if (lesson.next) assert(lessonById(lesson.next), lesson.next);
    });
  });
});

suite('Glosario, biblioteca, tutoriales y referencias', (t) => {
  t('el glosario no tiene identificadores repetidos', () => equal(glossary.length, Object.keys(glossaryById).length));
  t('cada término apunta a una lección disponible y a términos existentes', () => {
    glossary.forEach((g) => {
      assert(lessonById(g.lesson)?.status === 'disponible', `${g.id} → ${g.lesson}`);
      (g.related || []).forEach((r) => assert(glossaryById[r], `${g.id} → ${r}`));
      const problems = [...scanMarkup(g.definition, g.id), ...scanMarkup(g.short, g.id)];
      assert(problems.length === 0, problems.join('\n'));
    });
  });
  t('las preguntas de la biblioteca apuntan a lecciones existentes', () => concepts.forEach((c) => assert(lessonById(c.lesson), c.q)));
  t('los tutoriales apuntan a lecciones existentes', () => tutorials.forEach((tu) => assert(lessonById(tu.lesson), tu.id)));
  t('referencias: campos obligatorios y DOI/ISBN/URL verificable', () => {
    referenceList.forEach((r) => {
      ['key', 'type', 'authors', 'title', 'topics', 'verification'].forEach((k) => assert(r[k], `${r.key}: falta ${k}`));
      assert(r.doi || r.isbn || r.url, `${r.key}: sin DOI, ISBN ni URL`);
    });
  });
  t('etiquetas de cita autor-año', () => {
    equal(citationLabel(references.shannon1948), 'Shannon, 1948');
    equal(citationLabel(references.bryant2016), "Bryant y O'Hallaron, 2016");
  });
  t('el marcado de citas y términos genera enlaces', () => {
    assert(inline('[@shannon1948]').includes('href="#/referencias/shannon1948"'));
    assert(inline('[@bryant2016, §1.1]').includes('2016, §1.1'));
    assert(inline('[[bit|bits]]').includes('href="#/glosario/bit"'));
    assert(inline('[[>representacion-informacion]]').includes('href="#/leccion/representacion-informacion"'));
  });
});
