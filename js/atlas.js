// Nivel anatómico: encéfalo, médula, nervios, vasos, esqueleto y órganos.
import { THREE } from './escena.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { A } from '../data/estructuras-a.js';
import { B } from '../data/estructuras-b.js';
import { CUERPO } from '../data/cuerpo.js';
import { NERVIOS } from '../data/nervios.js';
import { ARBOL, CAPAS, VISTAS, NATURAL, REGIONES, SISTEMAS, ARTERIAS, LADO } from '../data/grupos.js';
import { $, $$, h, esc, sinAcentos, ICO } from './ui.js';

const ORO = new THREE.Color('#ffb640');
const SIN_HEMI = new Set(['piel', 'visceras', 'esqueleto', 'columna', 'medula', 'nervios', 'autonomo']);
const ENCEFALO = ['corteza', 'blanca', 'nucleos', 'tronco', 'cerebelo', 'ventriculos'];

function tapaCorte(sh) { // las caras internas visibles por el corte se pintan planas: simulan la superficie seccionada
  sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'if (!gl_FrontFacing) { outgoingLight = diffuseColor.rgb * 0.5 + vec3(0.02); }\n#include <opaque_fragment>');
}
const capaDe = (g) => { for (const c of CAPAS) if (c[2].some(p => g === p || g.startsWith(p + '.'))) return c[0]; return null; };
const jitter = (s) => { let x = 0; for (let i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return (x % 1000) / 1000; };

export class Atlas {
  constructor(escn, app) {
    this.esc = escn; this.app = app;
    this.scene = escn.nuevaEscena(0.5);
    this.raiz = new THREE.Group(); this.scene.add(this.raiz);
    this.cat = { ...A, ...B, ...CUERPO, ...NERVIOS };
    this.recs = []; this.porBase = new Map();
    this.capas = Object.fromEntries(CAPAS.map(c => [c[0], c[3]]));
    this.color = 'natural'; this.ocultos = new Set(); this.aislados = null;
    this.sel = null; this.hov = null; this.hemi = { L: true, R: true };
    this.corte = { eje: null, v: 0, inv: false }; this.plano = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
    this.explota = 0; this.etiquetas = true; this.picables = [];
    this.extra = new THREE.Group(); this.scene.add(this.extra);   // vías y marcadores
    this.modo = { objetos: () => this.picables, planos: () => this.corte.eje ? [this.plano] : [], onHover: (hit, ev) => this._hover(hit, ev), onClick: (hit) => this._click(hit), onDbl: (hit) => { if (hit) this.enfocar(hit.object.userData.rec.base); }, frame: () => this._frame() };
    this.camIni = { p: new THREE.Vector3(34, 9, 26), t: new THREE.Vector3(0, -0.5, -0.5), near: 0.5, far: 3000 };
  }

  // ─────────────────────────────────────────────── carga
  async cargar(prog) {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const archivos = [['assets/encefalo.glb', 'Encéfalo', 3.5], ['assets/cuerpo.glb', 'Cuerpo, cráneo y médula', 2.1], ['assets/nervios.glb', 'Nervios', 0.6]];
    const total = archivos.reduce((s, a) => s + a[2], 0); let hecho = 0;
    const mans = {};
    for (const [url, nombre, peso] of archivos) {
      prog?.(hecho / total, nombre);
      let g;
      try { g = await loader.loadAsync(url, e => prog?.((hecho + peso * Math.min(1, e.loaded / (e.total || peso * 1e6))) / total, nombre)); }
      catch (e) { if (url.includes('nervios')) { hecho += peso; continue; } throw e; }
      try { Object.assign(mans, await (await fetch(url.replace('.glb', '.json'))).json()); } catch { /* sin manifiesto */ }
      hecho += peso;
      const ms = []; g.scene.traverse(o => { if (o.isMesh) ms.push(o); });
      for (const m of ms) this._registrar(m, mans[m.name]);
    }
    prog?.(1, 'Listo');
    this.cajaEncefalo = new THREE.Box3(); for (const r of this.recs) if (ENCEFALO.includes(r.capa)) this.cajaEncefalo.union(r.caja);
    this.actualizar();
  }

  _registrar(mesh, man) {
    const mm = mesh.name.match(/^(.*)_(L|R)$/);
    const base = mm ? mm[1] : mesh.name, lado = mm ? mm[2] : 'M';
    const info = this.cat[base];
    if (!info) return;                       // malla sin ficha: no se muestra
    const capa = capaDe(info.g); if (!capa) return;
    // Las mallas vienen cuantizadas (enteros + transformación en el nodo): se pasan a coordenadas reales en cm.
    const g = mesh.geometry, p0 = g.attributes.position, p = new Float32Array(p0.count * 3);
    for (let k = 0; k < p0.count; k++) { p[3 * k] = p0.getX(k); p[3 * k + 1] = p0.getY(k); p[3 * k + 2] = p0.getZ(k); }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    mesh.updateMatrix(); g.applyMatrix4(mesh.matrix);
    mesh.position.set(0, 0, 0); mesh.quaternion.identity(); mesh.scale.set(1, 1, 1); mesh.updateMatrix();
    g.computeBoundingBox(); g.computeBoundingSphere();
    const mat = new THREE.MeshStandardMaterial({ roughness: capa === 'arterias' ? 0.35 : 0.58, metalness: 0, flatShading: false });
    mat.onBeforeCompile = tapaCorte;
    mesh.material = mat; mesh.matrixAutoUpdate = true;
    const caja = mesh.geometry.boundingBox.clone();
    const c = man ? new THREE.Vector3(...man.c) : caja.getCenter(new THREE.Vector3());
    const rec = { mesh, nombre: mesh.name, base, lado, info, g: info.g, capa, c, caja, est: 0 };
    mesh.userData.rec = rec;
    this.raiz.add(mesh); this.recs.push(rec);
    if (!this.porBase.has(base)) this.porBase.set(base, []); this.porBase.get(base).push(rec);
  }

  // ─────────────────────────────────────────────── estado visual
  colorDe(rec) {
    const i = rec.info, j = jitter(rec.base);
    const c = new THREE.Color();
    if (this.color === 'regiones') { const r = REGIONES[i.g]; c.set(r ? r[0] : NATURAL[rec.g.split('.')[0]] || '#bbb'); if (r) c.offsetHSL((j - 0.5) * 0.035, 0, (j - 0.5) * 0.16); }
    else if (this.color === 'funcional') { const s = SISTEMAS[i.s]; c.set(s ? s[0] : '#9a9a9a'); if (s) c.offsetHSL(0, 0, (j - 0.5) * 0.12); }
    else if (this.color === 'irrigacion') { const a = ARTERIAS[i.a]; c.set(a ? a[0] : (rec.capa === 'arterias' ? '#d8d2c4' : '#8a8f99')); if (a) c.offsetHSL(0, 0, (j - 0.5) * 0.1); }
    else { c.set(i.col || NATURAL[i.g] || NATURAL[i.g.split('.')[0]] || '#cccccc'); if (ENCEFALO.includes(rec.capa) && rec.capa !== 'ventriculos') c.offsetHSL((j - 0.5) * 0.012, (j - 0.5) * 0.05, (j - 0.5) * 0.07); }
    return c;
  }
  estadoDe(rec) {
    let e = this.capas[rec.capa];
    if (!e || this.ocultos.has(rec.base)) return 0;
    if (rec.lado !== 'M' && !this.hemi[rec.lado] && !SIN_HEMI.has(rec.capa)) return 0;
    if (this.aislados) return this.aislados.has(rec.base) ? 1 : 2;
    return e;
  }
  actualizar() {
    const cortar = !!this.corte.eje; this.picables = [];
    for (const r of this.recs) {
      const e = r.est = this.estadoDe(r), m = r.mesh.material;
      r.mesh.visible = e !== 0; if (!e) continue;
      m.color.copy(this.colorDe(r));
      const fan = e === 2;
      if (m.transparent !== fan) { m.transparent = fan; m.needsUpdate = true; }
      m.opacity = fan ? (r.capa === 'piel' ? 0.11 : r.capa === 'esqueleto' || r.capa === 'craneo' || r.capa === 'columna' ? 0.3 : 0.12) : 1;
      m.depthWrite = !fan; r.mesh.renderOrder = fan ? 3 : 0;
      const lado = cortar || fan ? THREE.DoubleSide : THREE.FrontSide;
      if (m.side !== lado) { m.side = lado; m.needsUpdate = true; }
      const cp = cortar && r.capa !== 'piel' ? [this.plano] : null;
      if ((m.clippingPlanes || null) !== cp && !(m.clippingPlanes && cp)) { m.clippingPlanes = cp; m.needsUpdate = true; }
      const s = this.sel === r.base, hv = this.hov === r.base;
      m.emissive.copy(ORO); m.emissiveIntensity = s ? 0.42 : hv ? 0.2 : 0;
      if (!fan) this.picables.push(r.mesh);
    }
    this._velo();
    this.app.alCambiarAtlas?.();
  }
  /** Silueta de la selección visible a través de todo lo demás. */
  _velo() {
    for (const r of this.recs) if (r.velo) { r.mesh.remove(r.velo); r.velo.material.dispose(); r.velo = null; }
    if (!this.sel) return;
    for (const r of this.porBase.get(this.sel) || []) {
      if (!r.est) continue;
      const v = new THREE.Mesh(r.mesh.geometry, new THREE.MeshBasicMaterial({ color: ORO, transparent: true, opacity: 0.2, depthTest: false, depthWrite: false, clippingPlanes: this.corte.eje ? [this.plano] : null }));
      v.renderOrder = 9; v.raycast = () => { }; r.mesh.add(v); r.velo = v;
    }
  }

  setCapa(id, e) { this.capas[id] = e; this.actualizar(); this._pintarCapas(); }
  setColor(c) { this.color = c; this.actualizar(); if (!this.sel) this.pintarFicha(); }
  setCorte(eje, v, inv) {
    Object.assign(this.corte, { eje, v: v ?? this.corte.v, inv: inv ?? this.corte.inv });
    if (eje) { const n = new THREE.Vector3(eje === 'x' ? 1 : 0, eje === 'y' ? 1 : 0, eje === 'z' ? 1 : 0); const k = this.corte.v * (eje === 'y' ? 8.5 : eje === 'x' ? 7.4 : 9.4) + (eje === 'y' ? -0.5 : 0); if (this.corte.inv) this.plano.set(n, -k); else this.plano.set(n.negate(), k); }
    this.actualizar();
  }
  setExplota(k) {
    this.explota = k;
    for (const r of this.recs) {
      if (!ENCEFALO.includes(r.capa)) continue;
      const d = r.c.clone(); d.y += 1.2; const lat = r.lado === 'L' ? 1 : r.lado === 'R' ? -1 : 0;
      r.mesh.position.set(d.x * 0.75 * k + lat * 1.6 * k, d.y * 0.6 * k, d.z * 0.6 * k);
    }
  }

  // ─────────────────────────────────────────────── interacción
  _hover(hit, ev) {
    const b = hit ? hit.object.userData.rec.base : null;
    const p = $('#pista');
    if (b && ev && !this.app.sinPistas) {
      const r = hit.object.userData.rec; const pr = this.esc.canvas.getBoundingClientRect();
      p.hidden = false; p.style.left = (ev.clientX - pr.left) + 'px'; p.style.top = (ev.clientY - pr.top) + 'px';
      p.innerHTML = `<b>${esc(r.info.n)}${r.lado !== 'M' ? ' <span style="color:var(--texto3);font-weight:400">· ' + LADO[r.lado] + '</span>' : ''}</b>${r.info.la ? '<i>' + esc(r.info.la) + '</i>' : ''}`;
    } else p.hidden = true;
    if (b !== this.hov) { this.hov = b; for (const r of this.recs) if (r.est) r.mesh.material.emissiveIntensity = this.sel === r.base ? 0.42 : this.hov === r.base ? 0.2 : 0; }
  }
  _click(hit) {
    if (this.app.alPicar && this.app.alPicar(hit ? hit.object.userData.rec : null)) return;
    if (hit) { const r = hit.object.userData.rec; this.seleccionar(r.base, { lado: r.lado }); } else this.seleccionar(null);
  }
  seleccionar(base, o = {}) {
    if (base && !this.porBase.has(base)) return;
    this.sel = base; this.selLado = o.lado || null;
    if (base && o.revelar) {
      const r = this.porBase.get(base)[0];
      if (!this.capas[r.capa]) this.capas[r.capa] = 1;
      this.ocultos.delete(base);
      if (r.lado !== 'M' && !this.hemi.L && !this.hemi.R) this.hemi.L = this.hemi.R = true;
      this._pintarCapas();
    }
    this.actualizar(); this.pintarFicha(); this._marcarArbol();
    if (base && o.volar) this.enfocar(base);
    if (base) this.app.abrirFicha?.();
  }
  enfocar(base, minR = 1.6) {
    const rs = (this.porBase.get(base) || []).filter(r => r.est); if (!rs.length) return;
    const b = new THREE.Box3(); for (const r of rs) if (!this.selLado || rs.length === 1 || r.lado === this.selLado || r.lado === 'M') b.union(r.caja.clone().translate(r.mesh.position));
    if (b.isEmpty()) for (const r of rs) b.union(r.caja);
    const s = b.getBoundingSphere(new THREE.Sphere()); s.radius = Math.max(s.radius, minR);
    this.esc.encuadrar(new THREE.Box3().setFromCenterAndSize(s.center, new THREE.Vector3(1, 1, 1).multiplyScalar(s.radius * 2 / Math.sqrt(3))), null, 2.1);
  }
  vista(k) {
    const v = VISTAS[k]; if (!v) return;
    for (const c of CAPAS) this.capas[c[0]] = v.capas[c[0]] || 0;
    this.aislados = null; this.ocultos.clear(); this.hemi.L = this.hemi.R = true;
    if (v.color) this.color = v.color; else if (this.color === 'irrigacion') this.color = 'natural';
    this.actualizar(); this._pintarCapas(); this.pintarHerramientas();
    const b = this.cajaDe(v.caja);
    this.esc.encuadrar(b, new THREE.Vector3(...v.dir), v.caja === 'encefalo' ? 1.15 : 1.05);
  }
  cajaDe(k) {
    const b = new THREE.Box3();
    if (k === 'encefalo') return this.cajaEncefalo.clone();
    if (k === 'cabeza') { b.copy(this.cajaEncefalo); b.min.y -= 7; b.max.z += 2; return b; }
    for (const r of this.recs) if (k === 'cuerpo' ? r.capa === 'piel' || ENCEFALO.includes(r.capa) : (ENCEFALO.includes(r.capa) || r.capa === 'medula')) b.union(r.caja);
    return b;
  }
  /** Posición (Vector3) de una estructura o de un punto relativo a su caja: 'id' | {en:'id_L', f:[fx,fy,fz]} */
  punto(ref) {
    if (ref.isVector3) return ref;
    if (Array.isArray(ref)) return new THREE.Vector3(...ref);
    const id = typeof ref === 'string' ? ref : ref.en;
    const r = this.recs.find(x => x.nombre === id) || (this.porBase.get(id) || [])[0];
    if (!r) { console.warn('punto desconocido', id); return new THREE.Vector3(); }
    if (typeof ref === 'string' || !ref.f) return r.c.clone().add(r.mesh.position);
    const s = r.caja.getSize(new THREE.Vector3());
    return new THREE.Vector3(r.caja.min.x + s.x * ref.f[0], r.caja.min.y + s.y * ref.f[1], r.caja.min.z + s.z * ref.f[2]);
  }

  _frame() {
    const cont = $('#etiquetas');
    if (!this.etiquetas || !this.sel || this.app.modo !== 'atlas') { if (this._etq) { this._etq.remove(); this._etq = null; } return; }
    const rs = (this.porBase.get(this.sel) || []).filter(r => r.est); if (!rs.length) { if (this._etq) { this._etq.remove(); this._etq = null; } return; }
    const r = rs.find(x => x.lado === this.selLado) || rs[0];
    if (!this._etq || this._etq.dataset.b !== this.sel) { this._etq?.remove(); this._etq = h('div', { class: 'etq sel', 'data-b': this.sel }, r.info.n.replace(/ \(.*\)$/, '')); cont.append(this._etq); }
    const p = this.esc.proyectar(new THREE.Vector3(r.c.x, r.caja.max.y, r.c.z).add(r.mesh.position));
    this._etq.style.display = p.delante ? '' : 'none'; this._etq.style.left = p.x + 'px'; this._etq.style.top = (p.y - 14) + 'px';
  }

  // ─────────────────────────────────────────────── paneles
  montar() {
    const izq = $('#izq'); izq.innerHTML = '';
    izq.append(
      h('div', { class: 'cab' }, h('h2', null, 'Atlas 3D'), h('p', null, 'Gira, acerca y haz clic en cualquier estructura.')),
      h('div', { class: 'presets' }, Object.entries(VISTAS).map(([k, v]) => h('button', { onclick: () => this.vista(k) }, v.n))),
      h('div', { class: 'capas', id: 'capas' }),
      h('div', { class: 'busca-local' }, h('input', { type: 'search', placeholder: 'Filtrar estructuras…', id: 'filtro', oninput: (e) => this._filtrar(e.target.value) })),
      h('div', { class: 'desplaza' }, h('div', { class: 'arbol', id: 'arbol' })),
    );
    this._pintarCapas(); this._pintarArbol(); this.pintarFicha(); this.pintarHerramientas();
    $('#hud-sup').innerHTML = '';
  }
  _pintarCapas() {
    const c = $('#capas'); if (!c) return; c.innerHTML = '';
    const hay = new Set(this.recs.map(r => r.capa));
    for (const [id, n] of CAPAS) {
      if (!hay.has(id)) continue;
      c.append(h('button', { class: 'capa', 'data-e': this.capas[id], title: 'Clic: visible → translúcida → oculta', onclick: () => this.setCapa(id, this.capas[id] === 1 ? 2 : this.capas[id] === 2 ? 0 : 1) }, h('i'), n));
    }
    this._marcarArbol();
  }
  _pintarArbol() {
    const cont = $('#arbol'); cont.innerHTML = '';
    const porG = new Map();
    for (const [base, rs] of this.porBase) { const g = rs[0].g; if (!porG.has(g)) porG.set(g, []); porG.get(g).push(base); }
    const orden = Object.keys(this.cat);
    const nodo = (n, nivel) => {
      const hijos = (n.h || []).map(x => nodo(x, nivel + 1)).filter(Boolean);
      const bases = (porG.get(n.id) || []).sort((a, b) => orden.indexOf(a) - orden.indexOf(b));
      if (!hijos.length && !bases.length) return null;
      const cuenta = bases.length + hijos.reduce((s, x) => s + (+x.dataset.n || 0), 0);
      const d = h('details', { 'data-g': n.id, 'data-n': cuenta, open: nivel < 1 },
        h('summary', null, n.n, h('span', { class: 'n' }, cuenta)),
        h('div', { class: 'hijos' }, hijos, bases.map(b => this._fila(b))));
      return d;
    };
    for (const n of ARBOL) { const d = nodo(n, 0); if (d) cont.append(d); }
  }
  _fila(base) {
    const i = this.cat[base];
    return h('div', { class: 'item', 'data-b': base, 'data-t': sinAcentos(i.n + ' ' + (i.la || '')), onclick: (e) => { if (e.target.closest('.ojo')) return; this.seleccionar(base, { revelar: true, volar: true }); } },
      h('span', { class: 'pt' }), h('span', { class: 'nm' }, i.n),
      h('button', { class: 'ojo', title: 'Mostrar u ocultar', onclick: () => { this.ocultos.has(base) ? this.ocultos.delete(base) : this.ocultos.add(base); this.actualizar(); this._marcarArbol(); } }, '◉'));
  }
  _marcarArbol() {
    for (const f of $$('#arbol .item')) {
      const b = f.dataset.b, r = this.porBase.get(b)[0];
      f.classList.toggle('sel', b === this.sel);
      f.classList.toggle('oculto', this.ocultos.has(b) || !this.capas[r.capa]);
      f.firstChild.style.background = '#' + this.colorDe(r).getHexString();
    }
    const s = $('#arbol .item.sel');
    if (s) { let p = s.parentElement; while (p && p.id !== 'arbol') { if (p.tagName === 'DETAILS') p.open = true; p = p.parentElement; } s.scrollIntoView({ block: 'nearest' }); }
  }
  _filtrar(q) {
    q = sinAcentos(q.trim());
    for (const f of $$('#arbol .item')) f.style.display = !q || f.dataset.t.includes(q) ? '' : 'none';
    for (const d of $$('#arbol details')) { const vis = [...d.querySelectorAll('.item')].some(f => f.style.display !== 'none'); d.style.display = vis ? '' : 'none'; if (q && vis) d.open = true; }
  }

  pintarFicha() {
    if (this.app.modo !== 'atlas') return;
    const der = $('#der'); der.innerHTML = '';
    const cont = h('div', { class: 'desplaza' }); der.append(cont);
    if (!this.sel) { cont.append(this._bienvenida()); return; }
    const i = this.cat[this.sel], rs = this.porBase.get(this.sel);
    const ruta = []; const busca = (ns, tr) => { for (const n of ns) { if (n.id === i.g) { ruta.push(...tr, n.n); return true; } if (n.h && busca(n.h, [...tr, n.n])) return true; } return false; }; busca(ARBOL, []);
    const chips = [];
    if (SISTEMAS[i.s]) chips.push(h('span', { class: 'ch' }, h('i', { style: { background: SISTEMAS[i.s][0] } }), SISTEMAS[i.s][1]));
    if (i.ba && i.ba !== '—') chips.push(h('span', { class: 'ch', title: 'Áreas de Brodmann' }, 'Brodmann ' + i.ba));
    if (ARTERIAS[i.a]) chips.push(h('span', { class: 'ch', title: 'Irrigación principal' }, h('i', { style: { background: ARTERIAS[i.a][0] } }), ARTERIAS[i.a][1]));
    if (rs.length === 2) chips.push(h('span', { class: 'ch' }, 'Bilateral'));
    if (i.esq) chips.push(h('span', { class: 'ch', title: 'Trayecto generado a partir de referencias óseas: es una aproximación didáctica' }, 'Trayecto esquemático'));
    const aislado = this.aislados?.has(this.sel);
    const f = h('div', { class: 'ficha' },
      h('div', { class: 'ruta' }, ruta.slice(-3).join(' › ')),
      h('h1', null, i.n), i.la ? h('div', { class: 'lat' }, i.la) : null,
      h('div', { class: 'chips' }, chips),
      h('div', { class: 'acc' },
        h('button', { class: 'btn', onclick: () => this.enfocar(this.sel) }, 'Enfocar'),
        h('button', { class: 'btn', onclick: () => { this.aislados = aislado ? null : new Set([this.sel]); this.actualizar(); this.pintarFicha(); } }, aislado ? 'Mostrar todo' : 'Aislar'),
        h('button', { class: 'btn', onclick: () => { this.ocultos.add(this.sel); this.seleccionar(null); } }, 'Ocultar'),
        this.app.microDe?.(this.sel)),
      i.d ? [h('h3', null, 'Descripción'), h('p', null, i.d)] : null,
      i.f?.length ? [h('h3', null, 'Función'), h('ul', null, i.f.map(x => h('li', null, x)))] : null,
      i.c ? [h('h3', null, 'Conexiones y relaciones'), h('p', null, i.c)] : null,
      i.cl && i.cl !== '—' ? [h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, i.cl)] : null,
      this.app.relacionados?.(this.sel));
    cont.append(f);
  }
  _bienvenida() {
    const ley = this.color === 'regiones' ? REGIONES : this.color === 'funcional' ? SISTEMAS : this.color === 'irrigacion' ? ARTERIAS : null;
    const usados = new Set(this.recs.filter(r => r.est === 1).map(r => this.color === 'regiones' ? r.info.g : this.color === 'funcional' ? r.info.s : r.info.a));
    return h('div', { class: 'vacio' },
      h('h1', null, 'El sistema nervioso, de la anatomía a la molécula'),
      h('p', null, `Modelo tridimensional con ${this.porBase.size} estructuras reales: encéfalo del atlas humano Allen, médula espinal segmento a segmento, nervios, arterias, cráneo y columna.`),
      h('ul', null,
        h('li', null, h('b', null, 'Clic'), ' en una estructura: abre su ficha (función, conexiones, irrigación y clínica).'),
        h('li', null, h('b', null, 'Arrastrar'), ' gira · ', h('b', null, 'rueda'), ' acerca · ', h('b', null, 'botón derecho'), ' desplaza · ', h('b', null, 'doble clic'), ' enfoca.'),
        h('li', null, 'Las ', h('b', null, 'capas'), ' de la izquierda tienen tres estados: visible, translúcida y oculta.'),
        h('li', null, 'La barra inferior permite ', h('b', null, 'cortar'), ' el modelo, separar hemisferios y cambiar el código de color.')),
      ley ? [h('h3', { style: { font: '600 11px var(--sans)', letterSpacing: '.09em', textTransform: 'uppercase', color: 'var(--oro)', margin: '20px 0 4px' } }, this.color === 'regiones' ? 'Regiones' : this.color === 'funcional' ? 'Sistemas funcionales' : 'Territorios arteriales'),
      h('div', { class: 'leyenda' }, Object.entries(ley).filter(([k]) => usados.has(k)).map(([, v]) => h('span', null, h('i', { style: { background: v[0] } }), v[1])))] : null,
      h('p', { style: { marginTop: '18px' } }, h('button', { class: 'btn pri', onclick: () => this.app.ir('curso') }, 'Empezar el curso'), ' ', h('button', { class: 'btn', onclick: () => this.app.ir('micro') }, 'Bajar a la microescala')));
  }

  pintarHerramientas() {
    if (this.app.modo !== 'atlas' && this.app.modo !== 'vias') return;
    const t = $('#herramientas'); t.innerHTML = ''; $$('#lienzo .flot').forEach(x => x.remove());
    const pop = (titulo, cuerpo) => { $$('#lienzo .flot').forEach(x => x.remove()); const f = h('div', { class: 'flot' }, h('h4', null, titulo), cuerpo); $('#lienzo').append(f); const cerrar = (e) => { if (!f.contains(e.target) && !t.contains(e.target)) { f.remove(); removeEventListener('pointerdown', cerrar, true); } }; addEventListener('pointerdown', cerrar, true); return f; };
    const seg = (ops, val, fn) => h('div', { class: 'seg' }, ops.map(([k, n]) => h('button', { class: k === val ? 'on' : '', onclick: (e) => { $$('button', e.target.parentElement).forEach(b => b.classList.toggle('on', b === e.target)); fn(k); } }, n)));
    const b = (ico, txt, tit, fn, on) => h('button', { class: 'hb' + (on ? ' on' : ''), title: tit, html: ico + (txt ? `<span class="tx">${txt}</span>` : ''), onclick: fn });
    t.append(
      b(ICO.color, 'Color', 'Código de color', () => pop('Código de color', [seg([['natural', 'Natural'], ['regiones', 'Regiones'], ['funcional', 'Función'], ['irrigacion', 'Irrigación']], this.color, k => { this.setColor(k); this.pintarHerramientas(); }), h('p', { class: 'nota', style: { padding: '8px 0 0' } }, 'Natural: tejido fresco. Regiones: lóbulos y divisiones. Función: sistema funcional principal. Irrigación: territorio arterial.')]), this.color !== 'natural'),
      b(ICO.corte, 'Corte', 'Plano de corte', () => pop('Plano de corte', [
        h('div', { class: 'fila' }, h('label', null, 'Plano'), seg([[null, 'Ninguno'], ['x', 'Sagital'], ['z', 'Coronal'], ['y', 'Axial']], this.corte.eje, k => { this.setCorte(k); this.pintarHerramientas2(); })),
        h('div', { class: 'fila' }, h('label', null, 'Posición'), h('input', { type: 'range', min: -1, max: 1, step: 0.005, value: this.corte.v, oninput: e => this.setCorte(this.corte.eje || 'x', +e.target.value) })),
        h('div', { class: 'fila' }, h('label', null, 'Lado'), h('button', { class: 'btn', onclick: () => this.setCorte(this.corte.eje || 'x', undefined, !this.corte.inv) }, 'Invertir'))]), !!this.corte.eje),
      b(ICO.hemi, 'Hemisferios', 'Mostrar u ocultar hemisferios', () => pop('Hemisferios', [
        h('div', { class: 'fila' }, seg([['LR', 'Ambos'], ['L', 'Solo izquierdo'], ['R', 'Solo derecho']], this.hemi.L && this.hemi.R ? 'LR' : this.hemi.L ? 'L' : 'R', k => { this.hemi.L = k.includes('L'); this.hemi.R = k.includes('R'); this.actualizar(); this.pintarHerramientas2(); })),
        h('p', { class: 'nota', style: { padding: '6px 0 0' } }, 'Oculta un hemisferio para ver la cara medial, el cuerpo calloso y el tronco.')]), !(this.hemi.L && this.hemi.R)),
      b(ICO.explota, 'Separar', 'Separar las piezas', () => pop('Vista explosionada', h('div', { class: 'fila' }, h('input', { type: 'range', min: 0, max: 1, step: 0.01, value: this.explota, oninput: e => { this.setExplota(+e.target.value); this.pintarHerramientas2(); } }))), this.explota > 0),
      h('span', { class: 'hsep' }),
      b(ICO.vista, 'Vistas', 'Vistas anatómicas', () => pop('Vistas anatómicas', h('div', { class: 'marcas' }, [['Lateral izq.', [1, 0, 0]], ['Lateral der.', [-1, 0, 0]], ['Anterior', [0, 0, 1]], ['Posterior', [0, 0, -1]], ['Superior', [0, 1, 0.001]], ['Inferior (basal)', [0, -1, 0.001]]].map(([n, d]) => h('button', { class: 'marca-ch', onclick: () => this.esc.encuadrar(this.cajaVisible(), new THREE.Vector3(...d), 1.15) }, n)),
        h('button', { class: 'marca-ch', onclick: () => { this.hemi.L = false; this.hemi.R = true; this.actualizar(); this.esc.encuadrar(this.cajaEncefalo, new THREE.Vector3(1, 0, 0), 1.15); this.pintarHerramientas2(); } }, 'Medial (hemisferio der.)')))),
      b(ICO.etq, '', 'Etiqueta de la selección', () => { this.etiquetas = !this.etiquetas; this.pintarHerramientas(); }, this.etiquetas),
      b(ICO.inicio, '', 'Restablecer la vista', () => { this.corte.eje = null; this.setExplota(0); this.vista('encefalo'); this.seleccionar(null); }),
    );
  }
  pintarHerramientas2() { // refresca solo los estados encendido/apagado sin cerrar el panel flotante
    const bs = $$('#herramientas .hb'); const on = [this.color !== 'natural', !!this.corte.eje, !(this.hemi.L && this.hemi.R), this.explota > 0];
    on.forEach((v, k) => bs[k]?.classList.toggle('on', v));
  }
  cajaVisible() { const b = new THREE.Box3(); for (const r of this.recs) if (r.est === 1 && r.capa !== 'piel') b.union(r.caja); return b.isEmpty() ? this.cajaEncefalo : b; }
}
