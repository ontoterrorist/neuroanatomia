// Vías y circuitos: tubos animados sobre el modelo anatómico.
import { THREE } from './escena.js';
import { VIAS, GRUPOS_VIAS } from '../data/vias.js';
import { CAPAS } from '../data/grupos.js';
import { $, $$, h, ICO, TECLA } from './ui.js';

export async function crear(app, esc, atlas) {
  let actual = null, paso = -1, tramos = [], guardado = null, marca = null, etq = null, pausa = false, visibles = null;
  const grupo = atlas.extra;

  app.indices.push(() => VIAS.map(v => ({ t: 'Vía', n: v.n, sub: v.sub, a: 'v:' + v.id })));

  function limpiar() { for (const o of [...grupo.children]) { grupo.remove(o); o.geometry?.dispose(); o.material?.dispose(); } tramos = []; marca = null; etq?.remove(); etq = null; }

  function mostrar(id) {
    const v = VIAS.find(x => x.id === id) || VIAS[0]; actual = v; paso = -1; limpiar();
    // estado del atlas: todo translúcido salvo las estaciones de la vía
    for (const c of CAPAS) atlas.capas[c[0]] = 0;
    Object.assign(atlas.capas, { corteza: v.opaco ? 1 : 2, nucleos: 2, tronco: 2, cerebelo: 2 }, v.capas || {});
    const sol = new Set(v.solidos || []);
    for (const b of sol) { const r = atlas.porBase.get(b)?.[0]; if (r && !atlas.capas[r.capa]) atlas.capas[r.capa] = 2; }
    atlas.aislados = v.opaco ? null : sol; atlas.sel = null;
    atlas.ocultos = new Set(['white_matter_of_forebrain', 'white_matter_of_hindbrain']);
    atlas.hemi = v.hemi === 'L' ? { L: true, R: false } : v.hemi === 'R' ? { L: false, R: true } : { L: true, R: true };
    atlas.color = 'natural'; atlas.setExplota(0); atlas.corte.eje = null;
    atlas.actualizar();
    // geometría
    const caja = new THREE.Box3(); const todo = [];
    for (const t of v.tramos) { const pts = t.pts.map(r => atlas.punto(r)); for (const p of pts) caja.expandByPoint(p); todo.push(pts); }
    const span = caja.getSize(new THREE.Vector3()).length();
    const R = THREE.MathUtils.clamp(span * 0.0045, 0.055, 0.42);
    visibles = v.tramos.map(() => true);
    v.tramos.forEach((t, k) => {
      const pts = todo[k];
      const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
      const largo = curva.getLength();
      const col = new THREE.Color(t.col);
      const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(16, Math.round(largo / R / 2.5)), R, 8, false), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.45 }));
      const soma = new THREE.Mesh(new THREE.SphereGeometry(R * 2.3, 16, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, roughness: 0.4 })); soma.position.copy(pts[0]);
      const fin = new THREE.Mesh(new THREE.ConeGeometry(R * 2.1, R * 4.6, 12), new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35 }));
      const tg = curva.getTangentAt(1); fin.position.copy(pts[pts.length - 1]); fin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tg);
      const pulso = new THREE.Mesh(new THREE.SphereGeometry(R * 2.0, 12, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(t.col).lerp(new THREE.Color('#ffffff'), 0.65) }));
      const halo = new THREE.Mesh(new THREE.SphereGeometry(R * 3.6, 12, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.28, depthWrite: false })); pulso.add(halo);
      for (const o of [tubo, soma, fin, pulso]) { o.renderOrder = 5; o.raycast = () => { }; grupo.add(o); }
      tramos.push({ curva, largo, pulso, objs: [tubo, soma, fin, pulso], fase: k * 0.37 });
    });
    const dir = new THREE.Vector3(...(v.dir || (span > 60 ? [0.75, 0.05, 0.65] : [0.85, 0.2, 0.5])));
    if (caja.getSize(new THREE.Vector3()).length() < 10) caja.expandByScalar(3);
    esc.encuadrar(caja, dir, 1.12);
    pintarLista(); pintarFicha();
    app.ruta('#vias/' + v.id);
  }

  function irPaso(k) {
    const v = actual; if (!v) return; paso = k; const p = v.pasos[k]; if (!p) return;
    const pos = atlas.punto(p.en);
    const span = new THREE.Box3().setFromObject(grupo).getSize(new THREE.Vector3()).length();
    esc.volar(pos, THREE.MathUtils.clamp(span * 0.32, 9, 60));
    if (!marca) { marca = new THREE.Mesh(new THREE.TorusGeometry(1, 0.07, 8, 40), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, depthTest: false })); marca.renderOrder = 20; marca.raycast = () => { }; grupo.add(marca); }
    marca.position.copy(pos); marca.userData.r = THREE.MathUtils.clamp(span * 0.012, 0.45, 2.2);
    etq?.remove(); etq = h('div', { class: 'etq sel' }, `${k + 1}. ${p.t}`); $('#etiquetas').append(etq); etq._pos = pos;
    $$('#der .pasos li').forEach((li, i) => li.classList.toggle('on', i === k));
    $('#der .pasos li.on')?.scrollIntoView({ block: 'nearest' });
    app.abrirFicha();
  }

  function frame(dt, t) {
    if (!pausa) for (const tr of tramos) { const vel = 14 + tr.largo * 0.5; tr.fase = (tr.fase + dt * vel / Math.max(tr.largo, 1)) % 1.25; const u = Math.min(tr.fase, 1); tr.pulso.visible = tr.fase <= 1 && tr.objs[0].visible; if (tr.pulso.visible) tr.pulso.position.copy(tr.curva.getPointAt(u)); }
    if (marca) { marca.quaternion.copy(esc.camera.quaternion); const s = marca.userData.r * (1 + 0.18 * Math.sin(t * 4)); marca.scale.setScalar(s); }
    if (etq) { const p = esc.proyectar(etq._pos); etq.style.display = p.delante ? '' : 'none'; etq.style.left = p.x + 'px'; etq.style.top = (p.y - 18) + 'px'; }
  }

  function pintarLista() {
    const izq = $('#izq'); izq.innerHTML = '';
    const lista = h('div', { class: 'desplaza' });
    for (const [g, n] of GRUPOS_VIAS) {
      const vs = VIAS.filter(v => v.g === g); if (!vs.length) continue;
      lista.append(h('div', { class: 'temario' }, h('div', { class: 'sem' }, n), vs.map(v => h('div', { ...TECLA, class: 'uni' + (v === actual ? ' sel' : ''), onclick: () => mostrar(v.id) }, h('span', null, h('div', { style: { color: 'inherit', fontWeight: 500 } }, v.n), h('div', { style: { fontSize: '11.5px', color: 'var(--texto3)' } }, v.sub))))));
    }
    izq.append(h('div', { class: 'cab' }, h('h2', null, 'Vías y circuitos'), h('p', null, `${VIAS.length} recorridos animados sobre el modelo.`)), lista);
    $('#izq .uni.sel')?.scrollIntoView({ block: 'nearest' });
  }
  function pintarFicha() {
    const v = actual, der = $('#der'); der.innerHTML = '';
    const cont = h('div', { class: 'desplaza' }); der.append(cont);
    cont.append(h('div', { class: 'ficha' },
      h('div', { class: 'ruta' }, GRUPOS_VIAS.find(g => g[0] === v.g)[1]),
      h('h1', null, v.n), h('div', { class: 'lat' }, v.sub),
      h('p', { style: { marginTop: '10px' } }, v.res),
      h('div', { class: 'controles' },
        h('button', { class: 'btn', html: pausa ? ICO.play.replace('<svg', '<svg width="13" height="13"') + ' Reanudar' : ICO.pausa.replace('<svg', '<svg width="13" height="13"') + ' Pausar', onclick: () => { pausa = !pausa; pintarFicha(); } }),
        h('button', { class: 'btn', onclick: () => irPaso(Math.max(0, paso - 1)) }, '‹ Anterior'),
        h('button', { class: 'btn pri', onclick: () => irPaso(Math.min(v.pasos.length - 1, paso + 1)) }, paso < 0 ? 'Recorrer paso a paso ›' : 'Siguiente ›'),
        h('button', { class: 'btn', onclick: () => mostrar(v.id) }, 'Vista general')),
      h('h3', null, 'Neuronas y tramos'),
      h('div', { class: 'rel' }, v.tramos.map((t, k) => h('button', { style: { opacity: visibles[k] ? 1 : 0.45 }, title: 'Mostrar u ocultar este tramo', onclick: (e) => { visibles[k] = !visibles[k]; for (const o of tramos[k].objs) o.visible = visibles[k]; e.currentTarget.style.opacity = visibles[k] ? 1 : 0.45; } }, h('span', { style: { display: 'inline-block', width: '22px', height: '4px', borderRadius: '2px', background: t.col, verticalAlign: 'middle', marginRight: '8px' } }), t.n))),
      h('h3', null, 'Recorrido'),
      h('ol', { class: 'pasos' }, v.pasos.map((p, k) => h('li', { ...TECLA, class: k === paso ? 'on' : '', onclick: () => irPaso(k) }, h('b', null, p.t), h('div', null, p.d)))),
      h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, v.clin),
      app.leccionesDeVia?.(v.id)));
  }

  return {
    async entrar(arg) {
      guardado = { capas: { ...atlas.capas }, aislados: atlas.aislados, ocultos: atlas.ocultos, hemi: { ...atlas.hemi }, color: atlas.color, sel: atlas.sel, corte: { ...atlas.corte }, explota: atlas.explota };
      esc.usar('atlas', atlas.scene, { ...atlas.modo, onClick: () => { }, onDbl: () => { }, frame }, 0.01, atlas.camIni);
      $('#herramientas').innerHTML = ''; atlas._etq?.remove(); atlas._etq = null;
      $('#hud-sup').append(h('span', { class: 'chip' }, 'Verde/azul/rosa: 1.ª, 2.ª y 3.ª neurona · el pulso indica el sentido de conducción'));
      mostrar(typeof arg === 'string' && VIAS.some(v => v.id === arg) ? arg : (actual?.id || VIAS[0].id));
    },
    salir() {
      limpiar();
      if (guardado) { Object.assign(atlas.capas, guardado.capas); atlas.aislados = guardado.aislados; atlas.ocultos = guardado.ocultos; atlas.hemi = guardado.hemi; atlas.color = guardado.color; atlas.sel = guardado.sel; atlas.corte = guardado.corte; atlas.setExplota(guardado.explota); atlas.setCorte(atlas.corte.eje); guardado = null; }
    },
    de: (base) => VIAS.filter(v => (v.solidos || []).includes(base)),
    VIAS,
  };
}
