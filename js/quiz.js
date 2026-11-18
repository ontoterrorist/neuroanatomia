// Evaluación: preguntas por unidad, casos clínicos, examen mixto e identificación en el modelo 3D.
import { PREGUNTAS, CASOS } from '../data/preguntas.js';
import { CAPAS, LADO } from '../data/grupos.js';
import { $, h, mem } from './ui.js';

const baraja = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const anotar = (u, ok) => { const s = mem.get('quiz', { ok: 0, n: 0, u: {} }); s.n++; if (ok) s.ok++; if (u) { s.u[u] ||= [0, 0]; s.u[u][1]++; if (ok) s.u[u][0]++; } mem.set('quiz', s); };

/** Tarjeta de pregunta de opción múltiple. p = {u, q, o:[correcta, …], e, a?} */
export function widgetPregunta(p, alResponder, accion) {
  const ops = baraja(p.o.map((t, i) => ({ t, ok: i === 0 })));
  const caja = h('div', { class: 'preg' }, h('div', { class: 'enun' }, p.q));
  const lista = h('div', { class: 'ops' });
  ops.forEach(o => lista.append(h('button', { class: 'op', onclick: (e) => {
    if (caja.dataset.r) return; caja.dataset.r = 1;
    [...lista.children].forEach((b, k) => { b.disabled = true; if (ops[k].ok) b.classList.add('bien'); });
    if (!o.ok) e.currentTarget.classList.add('mal');
    caja.append(h('div', { class: 'expl' }, h('b', { style: { color: o.ok ? 'var(--verde)' : 'var(--rojo)' } }, o.ok ? 'Correcto. ' : 'Incorrecto. '), p.e, p.a && accion ? h('div', { style: { marginTop: '8px' } }, h('button', { class: 'ver3d', onclick: () => accion(p.a) }, '◈ Ver en el modelo')) : null));
    anotar(p.u, o.ok); alResponder?.(o.ok);
  } }, o.t)));
  caja.append(lista); return caja;
}

export async function crear(app, esc, atlas) {
  const pag = $('#pagina');
  const nombreU = (id) => { const u = (app.mods.curso?.UNIDADES || []).find(x => x.id === id); return u ? `${u.num}. ${u.n}` : id; };

  function portada() {
    limpiar3d();
    const s = mem.get('quiz', { ok: 0, n: 0, u: {} });
    const U = app.mods.curso?.UNIDADES || [];
    pag.innerHTML = ''; $('#der').innerHTML = '';
    pag.append(h('div', { class: 'hoja' },
      h('div', { class: 'sobre' }, 'Evaluación'), h('h1', null, 'Pon a prueba lo que sabes'),
      h('p', { class: 'bajada' }, `${PREGUNTAS.length} preguntas de opción múltiple, ${CASOS.length} casos clínicos de localización e identificación de estructuras sobre el modelo.`),
      s.n ? h('div', { class: 'marcador' }, h('span', null, h('b', null, Math.round(s.ok / s.n * 100) + ' %'), ' de aciertos'), h('span', null, h('b', null, s.n), ' respuestas'), h('button', { class: 'btn', onclick: () => { mem.set('quiz', { ok: 0, n: 0, u: {} }); portada(); } }, 'Reiniciar estadísticas')) : null,
      h('h2', null, 'Identificación en el modelo 3D'),
      h('div', { class: 'tarjetas' }, Object.entries(SETS).map(([k, c]) => h('button', { class: 'tarjeta', onclick: () => iniciar3d(k) }, h('b', null, c.n), c.d))),
      h('h2', null, 'Preguntas y casos'),
      h('div', { class: 'tarjetas' },
        h('button', { class: 'tarjeta', onclick: () => serie(baraja(PREGUNTAS).slice(0, 20).map(pq), 'Examen mixto · 20 preguntas') }, h('b', null, 'Examen mixto'), '20 preguntas al azar de todo el curso.'),
        h('button', { class: 'tarjeta', onclick: () => serie(baraja(CASOS).map(pc), 'Casos clínicos de localización') }, h('b', null, 'Casos clínicos'), `${CASOS.length} viñetas: ¿dónde está la lesión?`),
        h('button', { class: 'tarjeta', onclick: () => serie(baraja(PREGUNTAS.filter(q => q[0].startsWith('u0-'))).slice(0, 20).map(pq), 'Semestre 0 · neurobiología celular') }, h('b', null, 'Semestre 0'), 'Neurobiología celular: 20 preguntas.'),
        h('button', { class: 'tarjeta', onclick: () => serie(baraja(PREGUNTAS.filter(q => esDe(q, 1, 17))).slice(0, 25).map(pq), 'Semestre I · estructura') }, h('b', null, 'Semestre I'), 'Estructura: 25 preguntas.'),
        h('button', { class: 'tarjeta', onclick: () => serie(baraja(PREGUNTAS.filter(q => esDe(q, 18, 99))).slice(0, 25).map(pq), 'Semestre II · función') }, h('b', null, 'Semestre II'), 'Función y clínica: 25 preguntas.')),
      h('h2', null, 'Por unidad'),
      h('table', { class: 't' }, h('tr', null, h('th', null, 'Unidad'), h('th', null, 'Preguntas'), h('th', null, 'Aciertos'), h('th', null, '')),
        ...U.filter(u => PREGUNTAS.some(q => q[0] === u.id)).map(u => { const r = s.u[u.id]; return h('tr', null, h('td', null, nombreU(u.id)), h('td', null, PREGUNTAS.filter(q => q[0] === u.id).length), h('td', null, r ? `${r[0]} / ${r[1]}` : '—'), h('td', null, h('button', { class: 'btn', onclick: () => serie(baraja(PREGUNTAS.filter(q => q[0] === u.id)).map(pq), nombreU(u.id)) }, 'Responder'))); }))));
    pag.scrollTop = 0;
  }
  // Las unidades de los semestres se llaman u01..u34; las del Semestre 0, u0-01..u0-16 (no entran en estos rangos).
  const esDe = (q, a, b) => /^u\d\d$/.test(q[0]) && +q[0].slice(1) >= a && +q[0].slice(1) <= b;
  const pq = (q) => ({ u: q[0], q: q[1], o: q[2], e: q[3] });
  const pc = (q) => ({ u: q[0], q: q[1], o: q[2], e: q[3], a: q[4] });

  function serie(ps, titulo) {
    let i = 0, ok = 0;
    const paso = () => {
      pag.innerHTML = ''; pag.scrollTop = 0;
      if (i >= ps.length) {
        const pct = Math.round(ok / ps.length * 100);
        pag.append(h('div', { class: 'hoja' }, h('div', { class: 'sobre' }, titulo), h('h1', null, `${ok} de ${ps.length} correctas`), h('p', { class: 'bajada' }, pct >= 85 ? 'Excelente dominio.' : pct >= 60 ? 'Buen nivel; repasa las unidades en que fallaste.' : 'Conviene volver a las lecciones antes de reintentar.'), h('p', null, h('button', { class: 'btn pri', onclick: portada }, 'Volver a la evaluación'), ' ', h('button', { class: 'btn', onclick: () => app.ir('curso') }, 'Ir al curso')))); return;
      }
      const sig = h('button', { class: 'btn pri', style: { display: 'none' }, onclick: () => { i++; paso(); } }, i === ps.length - 1 ? 'Ver resultado' : 'Siguiente ›');
      pag.append(h('div', { class: 'hoja' }, h('div', { class: 'sobre' }, `${titulo} · ${i + 1} / ${ps.length}`), h('div', { class: 'progreso', style: { margin: '10px 0 4px' } }, h('i', { style: { width: (i / ps.length * 100) + '%' } })),
        widgetPregunta(ps[i], (b) => { if (b) ok++; sig.style.display = ''; sig.focus(); }, (a) => app.accion(a)),
        h('div', { style: { display: 'flex', justifyContent: 'space-between', gap: '8px' } }, h('button', { class: 'btn', onclick: portada }, 'Salir'), sig)));
    };
    paso();
  }

  // ───────────────────────────── identificación en 3D
  const SETS = {
    corteza: { n: 'Corteza cerebral', d: 'Giros y áreas de los cinco lóbulos y la ínsula.', g: /^ctx\.(frontal|parietal|temporal|occipital|limbico)/, capas: { corteza: 1, blanca: 1, nucleos: 1, tronco: 1, cerebelo: 1 }, picar: true },
    profundas: { n: 'Núcleos profundos y diencéfalo', d: 'Ganglios basales, tálamo, hipotálamo, hipocampo y amígdala.', g: /^(gb|hipocampo|di\.|pb)/, extra: ['amygdaloid_complex'], capas: { corteza: 0, blanca: 0, nucleos: 1, tronco: 1, cerebelo: 2, ventriculos: 2 } },
    tronco: { n: 'Tronco encefálico, cerebelo y ventrículos', d: 'Mesencéfalo, puente, bulbo, pedúnculos y sistema ventricular.', g: /^(mes|pon|bul|cb|ven)/, capas: { corteza: 0, blanca: 0, nucleos: 2, tronco: 1, cerebelo: 1, ventriculos: 1 } },
    craneo: { n: 'Cráneo y columna vertebral', d: 'Huesos del cráneo y vértebras.', g: /^(craneo|columna)/, capas: { craneo: 1, columna: 1 }, picar: true, caja: 'neuroeje' },
    arterias: { n: 'Arterias del encéfalo', d: 'Polígono de Willis y ramas principales.', g: /^arterias/, capas: { corteza: 2, nucleos: 2, tronco: 1, cerebelo: 2, arterias: 1 } },
    nervios: { n: 'Nervios craneales y periféricos', d: 'Los doce pares, plexos y nervios de los miembros.', g: /^(nc|plexos|sna)/, capas: { corteza: 1, tronco: 1, cerebelo: 1, medula: 1, craneales: 1, nervios: 1, autonomo: 1, craneo: 2, columna: 2, esqueleto: 2, ojos: 1 }, caja: 'cuerpo' },
  };
  let est3d = null;
  // al salir se devuelve el atlas tal como estaba: capas, aislamiento, hemisferios, color, corte y separación
  function limpiar3d() { if (!est3d) return; const g = est3d.g; app.alPicar = null; app.sinPistas = false; Object.assign(atlas.capas, g.capas); atlas.aislados = g.aislados; atlas.ocultos = g.ocultos; atlas.hemi = g.hemi; atlas.color = g.color; atlas.corte = g.corte; atlas.sel = null; atlas.setExplota(g.explota); atlas.setCorte(atlas.corte.eje); est3d = null; $('#app').dataset.modo = 'quiz'; pag.hidden = false; }
  function iniciar3d(k) {
    const S = SETS[k];
    const bases = [...atlas.porBase.keys()].filter(b => S.g.test(atlas.cat[b].g) || S.extra?.includes(b));
    // «Otra ronda» no pasa por limpiar3d: se conserva el estado guardado en la primera ronda
    const g = est3d?.g || { capas: { ...atlas.capas }, aislados: atlas.aislados, ocultos: atlas.ocultos, hemi: { ...atlas.hemi }, color: atlas.color, corte: { ...atlas.corte }, explota: atlas.explota };
    est3d = { S, bases, cola: baraja(bases).slice(0, 15), i: 0, ok: 0, g };
    $('#app').dataset.modo = 'quiz3d'; pag.hidden = true; app.sinPistas = true;
    esc.usar('atlas', atlas.scene, atlas.modo, 0.01, atlas.camIni); esc.resize();
    for (const c of CAPAS) atlas.capas[c[0]] = S.capas[c[0]] || 0;
    atlas.aislados = null; atlas.ocultos = new Set(); atlas.hemi = { L: true, R: true }; atlas.color = 'natural'; atlas.setExplota(0); atlas.corte.eje = null; atlas.sel = null; atlas.actualizar();
    esc.encuadrar(atlas.cajaDe(S.caja || 'encefalo'), null, 1.15);
    $('#herramientas').innerHTML = ''; $('#izq').innerHTML = '';
    $('#izq').append(h('div', { class: 'cab' }, h('h2', null, 'Identificación 3D'), h('p', null, S.n)), h('div', { class: 'vacio' }, h('p', null, 'Gira y acerca el modelo con libertad. En las preguntas de «localiza», haz clic sobre la estructura.'), h('button', { class: 'btn', onclick: portada }, '‹ Terminar')));
    pregunta3d();
  }
  function pregunta3d() {
    const e = est3d, der = $('#der'); der.innerHTML = ''; const cont = h('div', { class: 'desplaza' }); der.append(cont);
    if (e.i >= e.cola.length) { cont.append(h('div', { class: 'ficha' }, h('div', { class: 'ruta' }, e.S.n), h('h1', null, `${e.ok} de ${e.cola.length} correctas`), h('div', { class: 'acc' }, h('button', { class: 'btn pri', onclick: () => iniciar3d(Object.keys(SETS).find(k => SETS[k] === e.S)) }, 'Otra ronda'), h('button', { class: 'btn', onclick: portada }, 'Volver')))); atlas.seleccionar(null); app.alPicar = null; return; }
    const base = e.cola[e.i], info = atlas.cat[base];
    const localizar = e.S.picar && Math.random() < 0.5;
    const cab = h('div', { class: 'ruta' }, `${e.S.n} · ${e.i + 1} / ${e.cola.length} · ${e.ok} aciertos`);
    const fin = (ok, msg) => { anotar(null, ok); if (ok) e.ok++; app.alPicar = () => true; atlas.seleccionar(base, { revelar: true }); if (!localizar) atlas.enfocar(base, e.S.caja === 'cuerpo' ? 9 : 4.5);
      cont.append(h('div', { class: 'ficha', style: { paddingTop: 0 } }, h('p', { class: ok ? '' : 'clin', style: ok ? { color: 'var(--verde)' } : {} }, msg), info.d ? h('p', { style: { color: 'var(--texto2)' } }, info.d) : null, h('button', { class: 'btn pri', onclick: () => { e.i++; pregunta3d(); } }, 'Siguiente ›'))); app.abrirFicha(); };
    if (localizar) {
      atlas.seleccionar(null);
      cont.append(h('div', { class: 'ficha', style: { paddingBottom: '8px' } }, cab, h('h1', null, 'Localiza en el modelo:'), h('p', { style: { font: '600 19px var(--serif)', color: 'var(--oro2)' } }, info.n), info.la ? h('div', { class: 'lat' }, info.la) : null, h('p', { class: 'nota', style: { padding: '8px 0 0' } }, 'Haz clic sobre la estructura. Cualquiera de los dos lados es válido.')));
      let intentos = 0;
      app.alPicar = (rec) => { if (!rec) return true; if (rec.base === base) fin(intentos === 0, intentos === 0 ? 'Correcto.' : 'Correcto, al segundo intento.'); else if (++intentos >= 2) fin(false, `Era otra: marcaste «${rec.info.n}${rec.lado !== 'M' ? ' ' + LADO[rec.lado] : ''}». La estructura correcta queda resaltada.`); else { const f = cont.querySelector('.nota'); f.textContent = `Eso es «${rec.info.n}». Te queda un intento.`; f.style.color = 'var(--rojo)'; } return true; };
    } else {
      atlas.seleccionar(base, { revelar: true }); atlas.enfocar(base, e.S.caja === 'cuerpo' ? 9 : 4.5); app.alPicar = () => true;
      const mismos = baraja(e.bases.filter(b => b !== base && atlas.cat[b].g === info.g)), otros = baraja(e.bases.filter(b => b !== base && atlas.cat[b].g !== info.g));
      const ops = baraja([base, ...[...mismos, ...otros].slice(0, 3)]);
      const lista = h('div', { class: 'ops', style: { display: 'grid', gap: '7px' } });
      ops.forEach(b => lista.append(h('button', { class: 'btn', style: { textAlign: 'left', padding: '9px 12px' }, onclick: (ev) => { if (lista.dataset.r) return; lista.dataset.r = 1; [...lista.children].forEach((x, k) => { x.disabled = true; if (ops[k] === base) x.style.borderColor = 'var(--verde)'; }); if (b !== base) ev.currentTarget.style.borderColor = 'var(--rojo)'; fin(b === base, b === base ? 'Correcto.' : `Incorrecto: es «${info.n}».`); } }, atlas.cat[b].n)));
      cont.append(h('div', { class: 'ficha', style: { paddingBottom: '8px' } }, cab, h('h1', null, '¿Qué estructura está resaltada?'), lista));
    }
  }

  return { entrar: () => portada(), salir: () => limpiar3d() };
}
