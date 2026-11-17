// Curso: Unidad 0 (neurobiología celular) y dos semestres. Temario, lecciones, enlaces al modelo 3D y autoevaluación.
import { UNIDAD_0 } from '../data/curso-0.js';
import { SEMESTRE_1 } from '../data/curso-1.js';
import { SEMESTRE_2 } from '../data/curso-2.js';
import { PREGUNTAS } from '../data/preguntas.js';
import { $, $$, h, mem, TECLA } from './ui.js';
import { widgetPregunta } from './quiz.js';

export const CURSO = [UNIDAD_0, SEMESTRE_1, SEMESTRE_2];
// Numeración: la Unidad 0 se rotula 0.1…0.16 y las unidades de los semestres siguen 1…34 sin correrse.
// `sem` es el índice en CURSO (0 = Unidad 0); `num` y `rot` son las etiquetas que muestra toda la app.
let nSem = 0;
export const UNIDADES = CURSO.flatMap((s, i) => s.unidades.map((u, j) => {
  const num = i === 0 ? `0.${j + 1}` : String(++nSem);
  return { ...u, sem: i, num, rot: i === 0 ? `Lección ${num}` : `Unidad ${num}` };
}));
const LECCIONES_0 = UNIDADES.filter(u => u.sem === 0), DE_SEMESTRES = UNIDADES.filter(u => u.sem > 0);

export async function crear(app, esc, atlas) {
  let actual = null;
  const prog = () => mem.get('curso', { hechas: {}, ultima: null });
  app.indices.push(() => UNIDADES.map(u => ({ t: 'Lección', n: `${u.num}. ${u.n}`, sub: u.baj, a: 'l:' + u.id })));
  app.leccionesDe = (base) => UNIDADES.filter(u => u.rel?.includes(base));

  function temario() {
    const izq = $('#izq'); izq.innerHTML = ''; const p = prog();
    const hechasDe = (lista) => lista.filter(u => p.hechas[u.id]).length;
    const hechas = hechasDe(DE_SEMESTRES), hechas0 = hechasDe(LECCIONES_0);
    const lista = h('div', { class: 'desplaza temario' });
    CURSO.forEach((s, i) => {
      lista.append(h('div', { class: 'sem' }, `${s.n} · ${s.sub}`));
      for (const u of UNIDADES.filter(x => x.sem === i)) lista.append(h('div', { ...TECLA, class: 'uni' + (actual === u.id ? ' sel' : ''), onclick: () => abrir(u.id) }, h('span', { class: 'k' }, u.num.padStart(2, '0')), h('span', null, u.n), p.hechas[u.id] ? h('span', { class: 'ok', title: 'Completada' }, '\u2713') : null));
    });
    izq.append(h('div', { class: 'cab' }, h('h2', null, 'Curso'), h('p', null, `Unidad 0: ${hechas0} de ${LECCIONES_0.length} lecciones · Semestres: ${hechas} de ${DE_SEMESTRES.length} unidades`), h('div', { class: 'progreso' }, h('i', { style: { width: (hechas / DE_SEMESTRES.length * 100) + '%' } }))),
      h('div', { ...TECLA, class: 'uni' + (!actual ? ' sel' : ''), style: { padding: '9px 14px', cursor: 'pointer' }, onclick: () => abrir(null) }, 'Presentación y plan de estudio'), lista);
    $('#izq .uni.sel')?.scrollIntoView({ block: 'nearest' });
  }

  function portada() {
    const p = prog(); const sig = UNIDADES.find(u => !p.hechas[u.id]) || UNIDADES[0];
    return h('div', { class: 'hoja' },
      h('div', { class: 'sobre' }, 'Curso de neuroanatomía funcional'), h('h1', null, 'Una unidad de base celular y dos semestres, del canal iónico a la conducta'),
      h('p', { class: 'bajada' }, 'El temario sigue el de un curso universitario exigente de neuroanatomía y neurociencia: primero la estructura, después la función. Cada unidad enlaza con el modelo tridimensional, las vías animadas y las escenas microscópicas.'),
      h('p', null, h('button', { class: 'btn pri', onclick: () => abrir(p.ultima && !p.hechas[p.ultima] ? p.ultima : sig.id) }, Object.keys(p.hechas).length ? 'Continuar donde quedaste' : 'Empezar por la 0.1 (neurobiología celular)'), ' ', Object.keys(p.hechas).length ? null : [h('button', { class: 'btn', onclick: () => abrir(DE_SEMESTRES[0].id) }, 'Empezar por la unidad 1'), ' '], h('button', { class: 'btn', onclick: () => app.ir('quiz') }, 'Ir a la evaluación')),
      CURSO.map((s, i) => [h('h2', null, `${s.n}: ${s.sub}`), h('div', { class: 'tarjetas' }, UNIDADES.filter(x => x.sem === i).map(u => h('button', { class: 'tarjeta', onclick: () => abrir(u.id) }, h('small', null, (i === 0 ? `Lección ${u.num}` : `Unidad ${u.num}`) + (p.hechas[u.id] ? ' · \u2713 completada' : '')), h('b', null, u.n), u.baj)))]),
      h('h2', null, 'Cómo estudiar con esta aplicación'),
      h('ul', null,
        h('li', null, h('strong', null, 'Lee con el modelo abierto. '), 'Los botones ◈ llevan a la estructura, la vía o la molécula de la que habla el texto. Vuelve a la lección con el botón Curso.'),
        h('li', null, h('strong', null, 'Localiza antes de memorizar. '), 'Para cada estructura pregúntate: ¿dónde está?, ¿qué entra?, ¿qué sale?, ¿qué arteria la irriga?, ¿qué pasa si se lesiona? Las fichas del atlas siguen ese orden.'),
        h('li', null, h('strong', null, 'Recorre las vías paso a paso'), ' y fíjate siempre en el punto donde cruzan la línea media: es la clave de la localización clínica.'),
        h('li', null, h('strong', null, 'Evalúate al terminar cada unidad. '), 'Las preguntas y los casos clínicos refuerzan el recuerdo mucho más que releer.')),
      h('p', { style: { color: 'var(--texto3)', fontSize: '14px' } }, 'Este material es educativo. No sustituye a los textos de referencia ni a la formación clínica supervisada.'));
  }

  function leccion(u) {
    const idx = UNIDADES.findIndex(x => x.id === u.id), p = prog();
    const pregs = PREGUNTAS.filter(q => q[0] === u.id);
    const cuerpo = h('div', { html: u.html });
    const rel = (u.rel || []).filter(b => atlas.cat[b]);
    return h('div', { class: 'hoja' },
      h('div', { class: 'sobre' }, u.sem === 0 ? `${CURSO[0].n} · Lección ${u.num} de ${LECCIONES_0.length}` : `${CURSO[u.sem].n} · Unidad ${u.num} de ${DE_SEMESTRES.length}`), h('h1', null, u.n), h('p', { class: 'bajada' }, u.baj),
      h('div', { class: 'clave' }, h('h4', null, 'Al terminar podrás'), h('ul', null, u.obj.map(o => h('li', null, o)))),
      cuerpo,
      rel.length ? [h('h3', null, 'Estructuras de esta unidad en el atlas'), h('p', null, rel.map(b => h('button', { class: 'ver3d', 'data-a': 'e:' + b }, '◈ ' + atlas.cat[b].n.replace(/ \(.*\)$/, ''))))] : null,
      pregs.length ? [h('h2', null, 'Comprueba lo aprendido'), pregs.map(q => widgetPregunta({ u: q[0], q: q[1], o: q[2], e: q[3] }))] : null,
      h('div', { class: 'pie-leccion' },
        idx > 0 ? h('button', { class: 'btn', onclick: () => abrir(UNIDADES[idx - 1].id) }, '‹ ' + UNIDADES[idx - 1].n) : h('span'),
        h('button', { class: 'btn' + (p.hechas[u.id] ? '' : ' pri'), onclick: () => { const q = prog(); if (q.hechas[u.id]) delete q.hechas[u.id]; else q.hechas[u.id] = true; mem.set('curso', q); abrir(u.id, true); } }, p.hechas[u.id] ? '✓ Completada (desmarcar)' : 'Marcar como completada'),
        idx < UNIDADES.length - 1 ? h('button', { class: 'btn', onclick: () => abrir(UNIDADES[idx + 1].id) }, UNIDADES[idx + 1].n + ' ›') : h('span')));
  }

  function abrir(id, mantenerScroll) {
    const u = UNIDADES.find(x => x.id === id); actual = u ? u.id : null;
    const pag = $('#pagina'); const y = pag.scrollTop; pag.innerHTML = ''; pag.append(u ? leccion(u) : portada());
    pag.scrollTop = mantenerScroll ? y : 0;
    if (u) { const p = prog(); p.ultima = u.id; mem.set('curso', p); }
    temario();
    $('#der').innerHTML = '';
    app.ruta('#curso' + (u ? '/' + u.id : ''));
  }

  $('#pagina').addEventListener('click', (e) => { const b = e.target.closest('.ver3d'); if (b?.dataset.a) app.accion(b.dataset.a); });

  return { entrar: (arg) => abrir(typeof arg === 'string' && UNIDADES.some(u => u.id === arg) ? arg : actual), salir() { }, de: app.leccionesDe, UNIDADES };
}
