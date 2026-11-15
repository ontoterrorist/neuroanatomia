// Neuroatlas — arranque y navegación entre secciones.
import { Escenario } from './escena.js';
import { Atlas } from './atlas.js';
import { $, $$, h, esc, sinAcentos, mem } from './ui.js';

const app = {
  modo: 'atlas', mods: {},
  async ir(modo, arg) {
    if (!['atlas', 'vias', 'micro', 'curso', 'quiz'].includes(modo)) modo = 'atlas';
    this.mods[this.modo]?.salir?.();
    this.modo = modo;
    $('#app').dataset.modo = modo;
    $$('#modos button').forEach(b => b.classList.toggle('activo', b.dataset.modo === modo));
    $('#app').classList.remove('abre-izq', 'abre-der');
    $('#pagina').hidden = !(modo === 'curso' || modo === 'quiz');
    $('#pista').hidden = true; $('#etiquetas').innerHTML = ''; $('#hud-sup').innerHTML = ''; $$('#lienzo .flot').forEach(x => x.remove());
    if (modo === 'atlas') {
      esc3d.usar('atlas', atlas.scene, atlas.modo, 0.01, atlas.camIni);
      atlas.extra.clear(); atlas.montar();
      if (arg) atlas.seleccionar(arg, { revelar: true, volar: true });
    } else {
      const m = await this.modulo(modo);
      if (this.modo !== modo) return;
      await m.entrar(arg);
    }
    try { history.replaceState(null, '', '#' + modo + (typeof arg === 'string' ? '/' + arg : '')); } catch { /* sin historial */ }
  },
  async modulo(modo) {
    if (!this.mods[modo]) {
      const f = { vias: './vias.js', micro: './micro.js', curso: './curso.js', quiz: './quiz.js' }[modo];
      const M = await import(f);
      this.mods[modo] = await M.crear(app, esc3d, atlas);
    }
    return this.mods[modo];
  },
  abrirFicha() { if (matchMedia('(max-width: 860px)').matches) { $('#app').classList.remove('abre-izq'); $('#app').classList.add('abre-der'); } },
  /** Acción genérica usada por enlaces «ver en 3D» del curso, la búsqueda y las fichas. */
  accion(a) {
    if (!a) return;
    const [tipo, id, extra] = a.split(':');
    if (tipo === 'e') this.ir('atlas', id);
    else if (tipo === 'v') this.ir('vias', id);
    else if (tipo === 'm') this.ir('micro', id + (extra ? ':' + extra : ''));
    else if (tipo === 'l') this.ir('curso', id);
    else if (tipo === 'vista') { this.ir('atlas').then(() => atlas.vista(id)); }
  },
  /** Botón hacia la escena microscópica que corresponde a una estructura. */
  microDe(base) {
    const g = atlas.cat[base]?.g || '';
    const m = /^ctx/.test(g) ? ['c:corteza', 'Ver su microcircuito'] : g === 'cb' ? ['c:cerebelo', 'Ver su microcircuito'] : /^medula/.test(g) ? ['c:medula', 'Ver la sección medular']
      : /^(substantia_nigra|putamen|posteroventral_putamen|nucleus_accumbens|.*_of_caudate)$/.test(base) ? ['s:da', 'Ver la sinapsis dopaminérgica'] : g === 'hipocampo' ? ['s:glu', 'Ver la sinapsis y la LTP']
      : /^(raices|plexos|nc)$/.test(g) ? ['n:neurona', 'Ver el axón y la mielina'] : g === 'arterias' ? ['n:glia', 'Ver la barrera hematoencefálica'] : null;
    return m ? h('button', { class: 'btn', onclick: () => this.ir('micro', m[0]) }, '⌄ ' + m[1]) : null;
  },
  /** Vías y lecciones que mencionan una estructura. */
  relacionados(base) {
    const vs = this.mods.vias?.de(base) || [], ls = this.leccionesDe?.(base) || [];
    if (!vs.length && !ls.length) return null;
    const U = this.mods.curso?.UNIDADES || [];
    return [vs.length ? [h('h3', null, 'Vías en las que participa'), h('div', { class: 'rel' }, vs.map(v => h('button', { onclick: () => this.ir('vias', v.id) }, v.n, h('small', null, v.sub))))] : null,
      ls.length ? [h('h3', null, 'Lecciones del curso'), h('div', { class: 'rel' }, ls.map(u => h('button', { onclick: () => this.ir('curso', u.id) }, `Unidad ${U.findIndex(x => x.id === u.id) + 1}. ${u.n}`)))] : null];
  },
  leccionesDeVia(id) {
    const U = this.mods.curso?.UNIDADES || [], ls = U.filter(u => u.html.includes('"v:' + id + '"'));
    return ls.length ? [h('h3', null, 'Lecciones del curso'), h('div', { class: 'rel' }, ls.map(u => h('button', { onclick: () => this.ir('curso', u.id) }, `Unidad ${U.findIndex(x => x.id === u.id) + 1}. ${u.n}`)))] : null;
  },
  indices: [],     // proveedores de búsqueda: () => [{t, n, sub, a}]
};

const esc3d = new Escenario($('#gl'));
const atlas = new Atlas(esc3d, app);
window.neuro = { app, atlas, esc: esc3d };

// ───────────────────────────── navegación
$$('#modos button').forEach(b => b.addEventListener('click', () => app.ir(b.dataset.modo)));
$('#btn-menu').addEventListener('click', () => { $('#app').classList.toggle('abre-izq'); $('#app').classList.remove('abre-der'); });
$('#btn-info').addEventListener('click', () => { $('#app').classList.toggle('abre-der'); $('#app').classList.remove('abre-izq'); });
$('#lienzo').addEventListener('pointerdown', () => $('#app').classList.remove('abre-izq', 'abre-der'));
// en pantallas angostas, elegir un elemento de la lista cierra el panel de navegación
$('#izq').addEventListener('click', (e) => { if (matchMedia('(max-width: 860px)').matches && e.target.closest('.uni, .item, .presets button') && !e.target.closest('.ojo')) setTimeout(() => $('#app').classList.remove('abre-izq'), 0); });

// ───────────────────────────── búsqueda global
const dlg = $('#dlg-buscar'), q = $('#q'), res = $('#resultados');
let lista = [], cursor = 0;
function indice() {
  const out = [];
  for (const [base, rs] of atlas.porBase) { const i = rs[0].info; out.push({ t: 'Estructura', n: i.n, sub: i.la, a: 'e:' + base }); }
  for (const f of app.indices) out.push(...f());
  return out.map(o => ({ ...o, k: sinAcentos(o.n + ' ' + (o.sub || '') + ' ' + (o.kw || '')) }));
}
let IDX = null;
function buscar() {
  IDX ||= indice();
  const t = sinAcentos(q.value.trim()).split(/\s+/).filter(Boolean);
  lista = !t.length ? IDX.slice(0, 0) : IDX.filter(o => t.every(x => o.k.includes(x))).sort((a, b) => (a.k.indexOf(t[0]) - b.k.indexOf(t[0])) || a.n.length - b.n.length).slice(0, 40);
  cursor = 0; pintar();
}
function pintar() {
  res.innerHTML = '';
  if (!lista.length) { res.append(h('li', { style: { color: 'var(--texto3)', cursor: 'default' } }, q.value.trim() ? 'Sin resultados.' : 'Escribe para buscar entre estructuras, vías, lecciones y moléculas.')); return; }
  lista.forEach((o, k) => res.append(h('li', { class: k === cursor ? 'on' : '', onclick: () => elegir(k) }, h('span', { class: 'tp' }, o.t), h('span', null, o.n, o.sub ? h('small', null, o.sub) : null))));
  res.children[cursor]?.scrollIntoView({ block: 'nearest' });
}
function elegir(k) { const o = lista[k]; if (!o) return; dlg.close(); app.accion(o.a); }
function abrirBusqueda() { IDX = null; q.value = ''; buscar(); dlg.showModal(); q.focus(); }
$('#btn-buscar').addEventListener('click', abrirBusqueda);
q.addEventListener('input', buscar);
q.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { cursor = Math.min(lista.length - 1, cursor + 1); pintar(); e.preventDefault(); }
  else if (e.key === 'ArrowUp') { cursor = Math.max(0, cursor - 1); pintar(); e.preventDefault(); }
  else if (e.key === 'Enter') elegir(cursor);
});
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
addEventListener('keydown', e => {
  const enCampo = /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName);
  if (e.key === '/' && !enCampo) { e.preventDefault(); abrirBusqueda(); }
  if (e.key === 'Escape' && !dlg.open && app.modo === 'atlas' && !enCampo) atlas.seleccionar(null);
});

addEventListener('hashchange', () => { const [modo, arg] = decodeURIComponent(location.hash.slice(1)).split('/'); if (modo) app.ir(modo, arg); });

// ───────────────────────────── créditos
$('#btn-acerca').addEventListener('click', async () => {
  const d = $('#dlg-acerca');
  if (!d.dataset.ok) { const { CREDITOS } = await import('../data/creditos.js'); d.innerHTML = '<button class="ico cerrar" aria-label="Cerrar">✕</button><div class="hoja">' + CREDITOS + '</div>'; d.dataset.ok = 1; $('.cerrar', d).addEventListener('click', () => d.close()); d.addEventListener('click', e => { if (e.target === d) d.close(); }); }
  d.showModal();
});

// ───────────────────────────── arranque
(async () => {
  const c = $('#carga');
  try {
    esc3d.usar('atlas', atlas.scene, atlas.modo, 0.01, atlas.camIni);
    await atlas.cargar((p, n) => { $('.b i', c).style.width = (p * 100).toFixed(0) + '%'; $('.d', c).textContent = n; });
    // módulos de contenido (para búsqueda y enlaces cruzados); si alguno falla, el atlas sigue funcionando
    for (const m of ['vias', 'micro', 'curso', 'quiz']) { try { await app.modulo(m); } catch (e) { console.warn('módulo no disponible:', m, e); } }
    const [modo, arg] = decodeURIComponent(location.hash.slice(1)).split('/');
    await app.ir(modo || 'atlas', arg);
    if (!modo || modo === 'atlas') { if (!arg) esc3d.encuadrar(atlas.cajaEncefalo, atlas.camIni.p.clone().sub(atlas.camIni.t), 1.15, 1); }
    c.classList.add('fuera'); setTimeout(() => { c.style.display = 'none'; }, 650);
  } catch (e) {
    console.error(e);
    $('.t', c).textContent = 'No se pudo cargar el atlas'; $('.d', c).textContent = String(e.message || e);
  }
})();
