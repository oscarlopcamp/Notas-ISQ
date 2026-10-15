// Visor de lecciones: estructura pedagógica completa, niveles de profundidad,
// índice lateral, referencias y navegación de la ruta guiada.

import { h } from '../utils/dom.js';
import { inline } from '../utils/text.js';
import { store } from '../utils/storage.js';
import { renderBlocks } from '../components/blocks.js';
import { createCodeEditor } from '../components/code-editor.js';
import { breadcrumbs, statusBadge, setTitle } from '../components/ui.js';
import { lessonById, moduleById, nextLesson, previousLesson } from '../../content/curriculum.js';
import { references, formatReference, SOURCE_TYPES } from '../../references/references.js';

export const LEVELS = [
  { id: 'comprender', n: 1, title: 'Comprender', hint: 'Intuición, analogías y visualizaciones, sin desarrollo matemático.' },
  { id: 'matematico', n: 2, title: 'Entender matemáticamente', hint: 'Notación, ecuaciones y cálculos paso a paso.' },
  { id: 'implementar', n: 3, title: 'Implementar', hint: 'Código, simulaciones y experimentos.' },
];

export async function render(main, [id], ctx) {
  ctx.lessonId = id;
  const meta = lessonById(id);
  if (!meta) return notFound(main, id);
  const mod = moduleById(meta.moduleId);
  setTitle(meta.title);

  const crumbs = breadcrumbs([['Inicio', '#/'], [`Módulo ${mod.number}`, `#/modulo/${mod.id}`], [meta.unitTitle, `#/modulo/${mod.id}`], [meta.title]]);

  if (meta.status !== 'disponible') return renderPending(main, meta, mod, crumbs);

  let lesson;
  try {
    lesson = (await meta.load()).default;
  } catch (err) {
    console.error(err);
    main.append(h('div', { class: 'page' }, crumbs, h('h1', {}, meta.title), h('p', {}, 'No se pudo cargar el contenido de esta lección.')));
    return;
  }
  store.markVisited(id);

  const toc = h('nav', { class: 'lesson-aside', 'aria-label': 'Contenido de la lección' });
  const body = h('article', { class: 'lesson-body' });
  main.append(h('div', { class: 'lesson-layout' }, body, toc));

  // ---------- Cabecera ----------
  const completeBtn = () => h('button', {
    type: 'button', class: 'btn', 'aria-pressed': String(store.isCompleted(id)),
    onclick: (e) => { store.toggleCompleted(id); syncButtons(); e.currentTarget.blur(); },
  });
  const favBtn = h('button', { type: 'button', class: 'btn', onclick: () => { store.toggleFavorite(id); syncButtons(); } });
  const completeButtons = [completeBtn(), completeBtn()];
  function syncButtons() {
    completeButtons.forEach((b) => {
      const done = store.isCompleted(id);
      b.setAttribute('aria-pressed', String(done));
      b.textContent = done ? '✓ Lección completada' : 'Marcar como completada';
    });
    const fav = store.isFavorite(id);
    favBtn.setAttribute('aria-pressed', String(fav));
    favBtn.textContent = fav ? '★ En favoritos' : '☆ Añadir a favoritos';
  }
  syncButtons();

  const levelsPresent = LEVELS.filter((l) => lesson.levels?.[l.id]);
  body.append(
    crumbs,
    h('header', { class: 'lesson-header' },
      h('div', { class: 'eyebrow' }, `Lección ${meta.number} · ${mod.title}`),
      h('h1', {}, lesson.title),
      lesson.lede ? h('p', { class: 'lede', html: inline(lesson.lede) }) : null,
      h('div', { class: 'lesson-meta' },
        statusBadge(meta),
        meta.minutes ? h('span', {}, `≈ ${meta.minutes} min de estudio`) : null,
        h('span', {}, `Niveles: ${levelsPresent.map((l) => l.title).join(' · ')}`),
        lesson.updated ? h('span', {}, `Revisada: ${lesson.updated}`) : null),
      h('div', { class: 'btn-row' }, completeButtons[0], favBtn)),
  );

  // ---------- Contexto pedagógico (Regla 4) ----------
  if (lesson.context) {
    const c = lesson.context;
    body.append(h('dl', { class: 'lesson-context' },
      [['Qué aprenderemos', c.learn], ['Por qué lo necesitamos', c.why], ['Relación con lo anterior', c.previous], ['Para qué servirá', c.next]]
        .filter(([, v]) => v)
        .map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', { html: inline(v) })))));
  }

  const sectionEntries = [];
  const addSection = (sid, title, nodes, tocLabel = title, level = null) => {
    const sec = h('section', { class: 'lesson-section', id: `sec-${sid}`, dataset: level ? { level } : {} }, h('h2', {}, title), nodes);
    sectionEntries.push({ id: `sec-${sid}`, label: tocLabel, level, el: sec });
    return sec;
  };

  body.append(addSection('objetivos', 'Objetivos y conocimientos previos', [
    h('p', {}, 'Al terminar esta lección podrás:'),
    h('ul', {}, lesson.objectives.map((o) => h('li', { html: inline(o) }))),
    h('div', { class: 'lesson-prereq' },
      h('h4', {}, 'Conocimientos previos'),
      h('ul', {},
        (lesson.prerequisites?.lessons || []).map((pid) => h('li', { html: inline(`[[>${pid}]]`) })),
        (lesson.prerequisites?.knowledge || []).map((k) => h('li', { html: inline(k) })))),
  ], 'Objetivos'));

  if (lesson.introduction) body.append(addSection('introduccion', 'Introducción', renderBlocks(lesson.introduction, ctx)));

  // ---------- Selector de nivel ----------
  const tabs = [{ id: 'todo', title: 'Ruta completa' }, ...LEVELS];
  const levelSwitch = h('div', { class: 'level-switch', role: 'group', 'aria-label': 'Nivel de profundidad' },
    h('span', { class: 'label' }, 'Nivel:'),
    tabs.map((t) => {
      const available = t.id === 'todo' || lesson.levels?.[t.id];
      return h('button', {
        type: 'button', class: 'level-tab', dataset: { level: t.id },
        disabled: !available, title: available ? (t.hint || 'Los tres niveles en el orden recomendado') : 'No aplica en esta lección',
        onclick: () => setLevel(t.id),
      }, t.n ? `${t.n}. ${t.title}` : t.title);
    }));
  body.append(levelSwitch);

  const levelBlocks = [];
  levelsPresent.forEach((lvl) => {
    const data = lesson.levels[lvl.id];
    const block = h('div', { class: 'level-block', dataset: { level: lvl.id } },
      h('div', { class: 'level-heading', dataset: { level: lvl.id } },
        h('span', { class: 'level-n' }, `Nivel ${lvl.n}`),
        h('h2', {}, lvl.title)),
      data.intro ? h('p', { class: 'level-intro', html: inline(data.intro) }) : null);
    data.sections.forEach((s, i) => {
      // Bloques esenciales a la vista; los marcados como «deep» van a un desplegable opcional.
      const essential = s.blocks.filter((b) => !b.deep);
      const deep = s.blocks.filter((b) => b.deep);
      const sec = h('section', { class: 'lesson-section', id: `sec-${s.id}` },
        h('h3', {}, h('span', { class: 'sec-num' }, `${lvl.n}.${i + 1}`), h('span', { html: inline(s.title) })),
        s.key ? h('div', { class: 'key-idea' }, h('span', { class: 'key-idea-label' }, 'En pocas palabras'), h('p', { html: inline(s.key) })) : null,
        renderBlocks(essential, ctx),
        deep.length ? h('details', { class: 'deepdive' },
          h('summary', {}, h('span', {}, 'Para profundizar'), h('small', {}, ' · opcional: el desarrollo completo y las demostraciones')),
          h('div', { class: 'deepdive-body' }, renderBlocks(deep, ctx))) : null);
      sectionEntries.push({ id: `sec-${s.id}`, label: `${lvl.n}.${i + 1} ${s.title.replace(/\$/g, '')}`, level: lvl.id, el: sec });
      block.append(sec);
    });
    levelBlocks.push(block);
    body.append(block);
  });

  // ---------- Cierre ----------
  if (lesson.misconceptions?.length) {
    body.append(addSection('errores', 'Errores conceptuales frecuentes',
      h('ul', { class: 'misconceptions' }, lesson.misconceptions.map((m) => h('li', {},
        h('span', { class: 'myth', html: inline(m.myth) }),
        h('span', { html: inline(m.reality) }))))));
  }
  if (lesson.summary?.length) {
    body.append(addSection('resumen', 'Resumen', h('ul', { class: 'summary-list' }, lesson.summary.map((s) => h('li', { html: inline(s) })))));
  }
  if (lesson.exercises?.length) {
    body.append(addSection('ejercicios', 'Ejercicios opcionales', [
      h('p', { class: 'muted' }, 'Intenta resolverlos antes de abrir la solución.'),
      lesson.exercises.map((ex, i) => h('div', { class: 'exercise', dataset: { level: ex.level || '' } },
        h('div', { class: 'exercise-head' }, `Ejercicio ${i + 1}`, ex.level ? ` · ${LEVELS.find((l) => l.id === ex.level)?.title}` : ''),
        h('div', { html: inline(ex.question) }),
        h('details', {}, h('summary', {}, 'Ver solución'), editableAnswer(ex.answer, `${id}.ej${i + 1}`)))),
    ]));
  }
  if (lesson.references?.length) {
    body.append(addSection('referencias', 'Bibliografía', [
      h('p', { class: 'muted' }, 'Fuentes que respaldan las afirmaciones de esta lección y para qué se citan.'),
      h('ol', { class: 'ref-list' }, lesson.references.map(({ key, use }) => {
        const ref = references[key];
        if (!ref) return h('li', {}, `Referencia no definida: ${key}`);
        return h('li', { class: 'ref-item', id: `ref-${key}` },
          h('div', { html: formatReference(ref) }),
          h('div', { class: 'ref-meta' },
            h('span', { class: 'badge' }, SOURCE_TYPES[ref.type]),
            h('span', { class: `badge ${ref.verification?.status === 'verificado' ? 'verified' : 'unverified'}`, title: ref.verification?.method }, ref.verification?.status === 'verificado' ? 'Verificada' : 'Sin verificar')),
          use ? h('p', { class: 'ref-note', html: `<b>En esta lección:</b> ${inline(use)}` }) : null);
      })),
    ]));
  }
  if (lesson.related?.length) {
    body.append(addSection('relacionadas', 'Lecciones relacionadas',
      h('ul', {}, lesson.related.map((rid) => {
        const r = lessonById(rid);
        return h('li', { html: `${inline(`[[>${rid}]]`)} ${r?.status === 'pendiente' ? '<span class="badge pending">Pendiente</span>' : ''}` });
      }))));
  }

  const prev = previousLesson(id);
  const next = lesson.next ? lessonById(lesson.next) : nextLesson(id);
  body.append(h('footer', { class: 'lesson-footer' },
    h('div', { class: 'btn-row' }, completeButtons[1]),
    h('nav', { class: 'next-lesson', 'aria-label': 'Navegación entre lecciones' },
      prev ? h('a', { href: `#/leccion/${prev.id}` }, h('small', {}, '← Anterior'), prev.title) : h('span'),
      next ? h('a', { class: 'next', href: `#/leccion/${next.id}` }, h('small', {}, `Siguiente recomendada${next.status === 'pendiente' ? ' (pendiente)' : ''} →`), next.title) : null)));

  // ---------- Índice lateral y nivel ----------
  function renderToc(level) {
    toc.replaceChildren(h('h2', {}, 'En esta lección'));
    const ol = h('ol');
    let currentLevel = null;
    sectionEntries.forEach((s) => {
      if (s.level && level !== 'todo' && s.level !== level) return;
      if (s.level !== currentLevel && s.level) ol.append(h('li', { class: 'aside-level' }, LEVELS.find((l) => l.id === s.level).title));
      currentLevel = s.level;
      ol.append(h('li', {}, h('a', { href: `#/leccion/${id}`, dataset: { scroll: s.id }, html: inline(s.label) })));
    });
    toc.append(ol);
  }

  function setLevel(level) {
    if (level !== 'todo' && !lesson.levels?.[level]) level = 'todo';
    store.set({ level });
    levelSwitch.querySelectorAll('.level-tab').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.level === level)));
    levelBlocks.forEach((b) => { b.hidden = level !== 'todo' && b.dataset.level !== level; });
    renderToc(level);
    observe();
  }

  let observer;
  function observe() {
    observer?.disconnect();
    const links = new Map([...toc.querySelectorAll('a[data-scroll]')].map((a) => [a.dataset.scroll, a]));
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((a) => a.classList.remove('active'));
          links.get(e.target.id)?.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sectionEntries.forEach((s) => observer.observe(s.el));
  }
  ctx.cleanups.push(() => observer?.disconnect());

  setLevel(store.get().level || 'todo');
}

function renderPending(main, meta, mod, crumbs) {
  const prev = previousLesson(meta.id);
  const next = nextLesson(meta.id);
  main.append(h('div', { class: 'page' },
    crumbs,
    h('div', { class: 'eyebrow' }, `Lección ${meta.number} · ${mod.title}`),
    h('h1', {}, meta.title),
    h('div', { class: 'lesson-meta' }, statusBadge(meta)),
    h('div', { class: 'pending-note', style: { marginTop: '1.5rem' } },
      h('h2', { style: { marginTop: 0 } }, 'Lección en preparación'),
      h('p', {}, 'Esta lección forma parte del programa, pero su contenido todavía no se ha escrito ni verificado. No se muestra contenido provisional para evitar explicaciones incompletas o inexactas.'),
      h('h4', {}, 'Temas que cubrirá'),
      h('ul', {}, meta.topics.map((t) => h('li', {}, t))),
      meta.prerequisites.length ? [h('h4', {}, 'Conocimientos previos recomendados'),
        h('ul', {}, meta.prerequisites.map((p) => h('li', { html: inline(`[[>${p}]]`) })))] : null),
    h('nav', { class: 'next-lesson', 'aria-label': 'Navegación entre lecciones' },
      prev ? h('a', { href: `#/leccion/${prev.id}` }, h('small', {}, '← Anterior'), prev.title) : h('span'),
      next ? h('a', { class: 'next', href: `#/leccion/${next.id}` }, h('small', {}, 'Siguiente →'), next.title) : null)));
}

function notFound(main, id) {
  setTitle('Lección no encontrada');
  main.append(h('div', { class: 'page' }, h('h1', {}, 'Lección no encontrada'),
    h('p', {}, `No existe ninguna lección con el identificador «${id}». `, h('a', { href: '#/' }, 'Volver al inicio'), '.')));
}

/** Solución de un ejercicio con sus bloques de código convertidos en editores. */
function editableAnswer(answer, keyPrefix) {
  const div = h('div', { html: inline(answer) });
  div.querySelectorAll('pre').forEach((pre, k) => {
    const codeEl = pre.querySelector('code');
    const lang = (codeEl?.className.match(/language-([\w-]+)/) || [])[1] || 'python';
    pre.replaceWith(createCodeEditor({ code: pre.textContent, lang, storageKey: `${keyPrefix}.${k + 1}` }));
  });
  return div;
}
