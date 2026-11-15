// Microescala: circuitos, célula, sinapsis y moléculas. Este archivo coordina las escenas
// e implementa el visor molecular (proteínas del PDB y moléculas pequeñas de PubChem).
import { THREE } from './escena.js';
import { PROTEINAS, CAT_PROT, MOLECULAS, CAT_MOL, NOMBRE_LIG } from '../data/moleculas.js';
import { CELULAR, ESCENAS_CEL } from './micro-celular.js';
import { $, $$, h, esc as E } from './ui.js';

const CPK = { C: '#9aa1ab', H: '#f4f4f4', N: '#5b82f2', O: '#ea4d43', S: '#e9cb3f', P: '#f29a3f', CL: '#4fc462', F: '#86e08a', K: '#b07cf0', NA: '#f2c14e', MG: '#7fd68a', ZN: '#9fb0c8', CA: '#8fd0d0', SR: '#9fb0c8', W: '#9fb0c8' };
const RAD = { H: 0.6, C: 1, N: 0.95, O: 0.92, S: 1.15, P: 1.15, CL: 1.15, F: 0.9 };
const PALETA = ['#6fa8dc', '#e9967a', '#8fd0a0', '#d6a6e8', '#f2d27a', '#7fd1d1', '#f0a0b8', '#b0c070', '#c8b0a0', '#9aa8f0', '#e0b070', '#80c0e0'];
const SS = { H: '#ef7f8e', E: '#f2d06b', '-': '#c9ced6' };

/** Tubo de radio variable a lo largo de una polilínea suavizada. */
function tuboVar(pts, radios, colores, lados = 6, sub = 3) {
  const curva = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
  const N = (pts.length - 1) * sub + 1;
  const pos = new Float32Array(N * lados * 3), nor = new Float32Array(N * lados * 3), col = new Float32Array(N * lados * 3), idx = [];
  const fr = curva.computeFrenetFrames(N - 1, false);
  const p = new THREE.Vector3(), v = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const u = i / (N - 1); curva.getPoint(u, p);
    const f = u * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(f)), t = f - k;
    const r = radios[k] * (1 - t) + radios[k + 1] * t;
    c.copy(colores[t < 0.5 ? k : k + 1]);
    for (let j = 0; j < lados; j++) {
      const a = j / lados * Math.PI * 2; v.copy(fr.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(fr.binormals[i], Math.sin(a));
      const o = (i * lados + j) * 3;
      pos[o] = p.x + v.x * r; pos[o + 1] = p.y + v.y * r; pos[o + 2] = p.z + v.z * r; nor[o] = v.x; nor[o + 1] = v.y; nor[o + 2] = v.z; col[o] = c.r; col[o + 1] = c.g; col[o + 2] = c.b;
    }
    if (i) for (let j = 0; j < lados; j++) { const a0 = (i - 1) * lados + j, a1 = (i - 1) * lados + (j + 1) % lados, b0 = i * lados + j, b1 = i * lados + (j + 1) % lados; idx.push(a0, b0, a1, a1, b0, b1); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx);
  return g;
}

export async function crear(app, esc) {
  const cache = new Map(); let actual = null, sel = null, molJSON = null;
  app.indices.push(() => [
    ...PROTEINAS.map(p => ({ t: 'Proteína', n: p.n, sub: 'PDB ' + p.id, a: 'm:p:' + p.id })),
    ...MOLECULAS.map(m => ({ t: 'Molécula', n: m.n, sub: m.f, a: 'm:q:' + m.id })),
    ...CELULAR.flatMap(g => g.items.map(i => ({ t: 'Microescala', n: i.n, sub: g.n, a: 'm:' + i.id, kw: i.kw }))),
  ]);

  // ───────────────────────────── proteínas
  async function proteina(id) {
    const P = PROTEINAS.find(x => x.id === id);
    const js = await (await fetch(`assets/prot/${id}.json`)).json();
    const scene = esc.nuevaEscena(0.7); const raiz = new THREE.Group(); scene.add(raiz);
    const picables = []; const caja = new THREE.Box3(); const cadenas = [];
    let modo = 'cadena';
    const nombres = [...new Set(js.chains.map(c => c.mol))];
    js.chains.forEach((ch, ci) => {
      const n = ch.n, P3 = []; for (let i = 0; i < n; i++) P3.push(new THREE.Vector3(ch.ca[3 * i] / 100, ch.ca[3 * i + 1] / 100, ch.ca[3 * i + 2] / 100));
      for (const p of P3) caja.expandByPoint(p);
      const colC = new THREE.Color(PALETA[ci % PALETA.length]);
      const colT = new THREE.Color(PALETA[nombres.indexOf(ch.mol) % PALETA.length]);
      const tramos = []; let ini = 0;
      for (let i = 1; i <= n; i++) if (i === n || P3[i].distanceTo(P3[i - 1]) > 0.46) { if (i - ini >= 3) tramos.push([ini, i]); ini = i; }
      const geos = () => tramos.map(([a, b]) => {
        const rad = [], cols = [];
        for (let i = a; i < b; i++) { const s = ch.ss[i]; rad.push(s === 'H' ? 0.105 : s === 'E' ? 0.09 : 0.05); cols.push(modo === 'ss' ? new THREE.Color(SS[s]) : modo === 'tipo' ? colT : colC); }
        return tuboVar(P3.slice(a, b), rad, cols);
      });
      const grupo = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, metalness: 0.05 });
      const info = { n: `Cadena ${ch.id}`, d: `${ch.mol ? ch.mol.toLowerCase() : 'polipéptido'} · ${n} residuos resueltos` };
      for (const g of geos()) { const m = new THREE.Mesh(g, mat); m.userData.info = info; grupo.add(m); picables.push(m); }
      raiz.add(grupo); cadenas.push({ ch, grupo, geos, mat, info });
    });
    const recolorear = (m) => { modo = m; for (const c of cadenas) { const gs = c.geos(); c.grupo.children.forEach((mesh, k) => { mesh.geometry.dispose(); mesh.geometry = gs[k]; }); } };
    // ligandos e iones
    const esf = new THREE.SphereGeometry(1, 14, 10); const ligs = [];
    for (const l of js.lig) {
      const nm = NOMBRE_LIG[l.n] || l.n; const ion = l.el.length === 1; const g = new THREE.Group();
      for (let i = 0; i < l.el.length; i++) {
        const e = l.el[i]; const c = new THREE.Color(CPK[e] || '#d0a0d0');
        const m = new THREE.Mesh(esf, new THREE.MeshStandardMaterial({ color: ion ? c : c.clone().lerp(new THREE.Color('#ffd27a'), 0.25), roughness: 0.35, emissive: ion ? c : 0x000000, emissiveIntensity: ion ? 0.45 : 0 }));
        m.scale.setScalar(ion ? 0.17 : 0.15 * (RAD[e] || 1)); m.position.set(l.xyz[3 * i] / 100, l.xyz[3 * i + 1] / 100, l.xyz[3 * i + 2] / 100);
        m.userData.info = { n: nm, d: ion ? 'Ion unido a la proteína en la estructura experimental.' : 'Ligando unido a la proteína (código PDB ' + l.n + ').' };
        g.add(m); picables.push(m);
      }
      raiz.add(g); ligs.push(nm);
    }
    // membrana
    const etqs = [];
    if (js.mem) {
      let R = 0; const ocup = new Set();
      for (const c of js.chains) for (let i = 0; i < c.n; i++) { const x = c.ca[3 * i] / 100, y = c.ca[3 * i + 1] / 100, z = c.ca[3 * i + 2] / 100; if (Math.abs(y) < 1.9) { R = Math.max(R, Math.hypot(x, z)); ocup.add(Math.round(x / 0.7) + ',' + Math.round(z / 0.7)); } }
      R += 2.6;
      const losa = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 3.0, 64, 1, true, Math.PI / 2, Math.PI), new THREE.MeshStandardMaterial({ color: '#d9bd7a', transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }));
      losa.raycast = () => { }; losa.renderOrder = 2; raiz.add(losa);
      const cab = []; const paso = 0.78;
      for (let i = -Math.ceil(R / paso); i <= Math.ceil(R / paso); i++) for (let j = -Math.ceil(R / paso); j <= Math.ceil(R / paso); j++) {
        const x = (i + (j % 2 ? 0.5 : 0)) * paso, z = j * paso * 0.866; if (Math.hypot(x, z) > R) continue;
        const k = Math.round(x / 0.7) + ',' + Math.round(z / 0.7); if (ocup.has(k) || z > 0.4) continue;   // la mitad anterior se omite: membrana seccionada
        cab.push([x, 1.72, z], [x, -1.72, z]);
      }
      const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.27, 8, 6), new THREE.MeshStandardMaterial({ color: '#d8b56a', roughness: 0.7, transparent: true, opacity: 0.5 }), cab.length);
      const M = new THREE.Matrix4(); cab.forEach((p, k) => { M.makeTranslation(p[0], p[1], p[2]); im.setMatrixAt(k, M); }); im.raycast = () => { }; raiz.add(im);
      const colas = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.07, 1.35, 5), new THREE.MeshStandardMaterial({ color: '#b89a5a', transparent: true, opacity: 0.32 }), cab.length);
      cab.forEach((p, k) => { M.makeTranslation(p[0], p[1] > 0 ? 0.8 : -0.8, p[2]); colas.setMatrixAt(k, M); }); colas.raycast = () => { }; raiz.add(colas);
      etqs.push({ pos: new THREE.Vector3(-R * 0.72, 2.6, R * 0.72), txt: 'Exterior celular' }, { pos: new THREE.Vector3(-R * 0.72, -2.6, R * 0.72), txt: 'Citoplasma' }, { pos: new THREE.Vector3(R * 0.86, 0, R * 0.5), txt: 'Bicapa lipídica · ~3 nm' });
      caja.expandByPoint(new THREE.Vector3(R, 0, R)); caja.expandByPoint(new THREE.Vector3(-R, 0, -R));
    }
    const s = caja.getBoundingSphere(new THREE.Sphere());
    const d = s.radius * 1.15 / Math.sin(THREE.MathUtils.degToRad(esc.camera.fov) / 2 * Math.min(1, esc.camera.aspect));
    const dir = new THREE.Vector3(0.55, 0.16, 1).normalize();
    return {
      scene, picables, metros: 1e-9, etqs, camIni: { p: s.center.clone().addScaledVector(dir, d), t: s.center.clone(), near: 0.1, far: 800 },
      ficha: (cont, refrescar) => cont.append(h('div', { class: 'ficha' },
        h('div', { class: 'ruta' }, CAT_PROT[P.cat]), h('h1', null, P.n),
        h('div', { class: 'lat' }, P.org, ' · ', h('a', { href: 'https://www.rcsb.org/structure/' + P.id, target: '_blank', rel: 'noopener' }, 'PDB ' + P.id)),
        h('div', { class: 'fila', style: { margin: '12px 0 4px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' } }, h('span', { style: { color: 'var(--texto3)', fontSize: '12px' } }, 'Color'),
          h('div', { class: 'seg' }, [['cadena', 'Por cadena'], ['tipo', 'Por subunidad'], ['ss', 'Estructura 2.ª']].map(([k, n]) => h('button', { class: modo === k ? 'on' : '', onclick: () => { recolorear(k); refrescar(); } }, n)))),
        modo === 'ss' ? h('div', { class: 'leyenda' }, h('span', null, h('i', { style: { background: SS.H } }), 'Hélice α'), h('span', null, h('i', { style: { background: SS.E } }), 'Lámina β'), h('span', null, h('i', { style: { background: SS['-'] } }), 'Asas y giros')) : null,
        h('h3', null, 'Estructura'), h('p', null, P.d),
        h('p', { class: 'nota', style: { padding: 0 } }, `Traza de carbonos α de ${js.chains.length} cadena${js.chains.length > 1 ? 's' : ''} (${js.chains.reduce((a, c) => a + c.n, 0)} residuos)` + (js.mem ? '. La posición de la membrana se estimó a partir de la distribución de residuos hidrófobos.' : '.')),
        h('h3', null, 'Función'), h('ul', null, P.f.map(x => h('li', null, x))),
        ligs.length ? [h('h3', null, 'Ligandos e iones en la estructura'), h('div', { class: 'chips' }, [...new Set(ligs)].map(n => h('span', { class: 'ch' }, n)))] : null,
        h('h3', null, 'Farmacología'), h('p', null, P.farm),
        h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, P.cl))),
    };
  }

  // ───────────────────────────── moléculas pequeñas
  async function molecula(id) {
    const Q = MOLECULAS.find(x => x.id === id);
    molJSON ||= await (await fetch('assets/moleculas.json')).json();
    const m = molJSON[id]; const scene = esc.nuevaEscena(0.8); const raiz = new THREE.Group(); scene.add(raiz);
    const picables = [], pts = []; const esf = new THREE.SphereGeometry(1, 24, 18), cil = new THREE.CylinderGeometry(1, 1, 1, 12, 1, true);
    const NOM = { C: 'Carbono', H: 'Hidrógeno', N: 'Nitrógeno', O: 'Oxígeno', S: 'Azufre', P: 'Fósforo', CL: 'Cloro', F: 'Flúor' };
    const usados = new Set();
    for (let i = 0; i < m.el.length; i++) {
      const e = m.el[i].toUpperCase(); usados.add(e); const p = new THREE.Vector3(m.xyz[3 * i], m.xyz[3 * i + 1], m.xyz[3 * i + 2]).multiplyScalar(0.1); pts.push(p);
      const a = new THREE.Mesh(esf, new THREE.MeshStandardMaterial({ color: CPK[e] || '#d0a0d0', roughness: 0.3, metalness: 0.05 }));
      a.scale.setScalar(0.034 * (RAD[e] || 1) + 0.008); a.position.copy(p); a.userData.info = { n: NOM[e] || e, d: 'Átomo ' + (i + 1) }; raiz.add(a); picables.push(a);
    }
    const Y = new THREE.Vector3(0, 1, 0);
    for (let k = 0; k < m.b.length; k += 3) {
      const a = pts[m.b[k]], b = pts[m.b[k + 1]], ord = m.b[k + 2]; const d = b.clone().sub(a), L = d.length();
      const perp = new THREE.Vector3().crossVectors(d, Math.abs(d.y) < 0.9 * L ? Y : new THREE.Vector3(1, 0, 0)).normalize();
      for (let j = 0; j < ord; j++) {
        const c = new THREE.Mesh(cil, new THREE.MeshStandardMaterial({ color: '#c8ccd4', roughness: 0.4 }));
        c.scale.set(ord > 1 ? 0.0075 : 0.011, L, ord > 1 ? 0.0075 : 0.011); c.position.copy(a).addScaledVector(d, 0.5).addScaledVector(perp, (j - (ord - 1) / 2) * 0.02); c.quaternion.setFromUnitVectors(Y, d.clone().normalize()); c.raycast = () => { }; raiz.add(c);
      }
    }
    const caja = new THREE.Box3().setFromPoints(pts); const s = caja.getBoundingSphere(new THREE.Sphere()); s.radius = Math.max(s.radius, 0.12);
    const d = s.radius * 1.5 / Math.sin(THREE.MathUtils.degToRad(esc.camera.fov) / 2 * Math.min(1, esc.camera.aspect));
    return {
      scene, picables, metros: 1e-9, etqs: [], camIni: { p: s.center.clone().add(new THREE.Vector3(0.3, 0.2, 1).normalize().multiplyScalar(d)), t: s.center.clone(), near: 0.01, far: 100 },
      frame: (dt) => { raiz.rotation.y += dt * 0.25; },
      ficha: (cont) => cont.append(h('div', { class: 'ficha' },
        h('div', { class: 'ruta' }, CAT_MOL[Q.cat]), h('h1', null, Q.n),
        h('div', { class: 'lat' }, Q.f, m.cid ? [' · ', h('a', { href: 'https://pubchem.ncbi.nlm.nih.gov/compound/' + m.cid, target: '_blank', rel: 'noopener' }, 'PubChem CID ' + m.cid)] : null),
        h('div', { class: 'leyenda', style: { margin: '12px 0' } }, [...usados].map(e => h('span', null, h('i', { style: { background: CPK[e] || '#d0a0d0', borderRadius: '50%' } }), NOM[e] || e))),
        h('h3', null, 'Qué es'), h('p', null, Q.d),
        h('h3', null, 'Receptores y blancos'), h('p', null, Q.r),
        h('h3', null, 'Destino, uso y clínica'), h('p', null, Q.t),
        h('p', { class: 'nota', style: { padding: 0, marginTop: '14px' } }, `Confórmero 3D de ${m.el.length} átomos (modelo de bolas y varillas).`))),
    };
  }

  // ───────────────────────────── gestor
  async function abrir(id) {
    id = id || 'n:neurona';
    if (!cache.has(id)) {
      $('#hud-sup').innerHTML = '<span class="chip">Construyendo la escena…</span>';
      let s;
      if (id.startsWith('p:')) s = await proteina(id.slice(2));
      else if (id.startsWith('q:')) s = await molecula(id.slice(2));
      else if (ESCENAS_CEL[id]) s = await ESCENAS_CEL[id](esc, app);
      else return abrir('n:neurona');
      cache.set(id, s);
    }
    if (app.modo !== 'micro') return;
    actual?.salir?.();
    actual = cache.get(id); actual.id = id; sel = null;
    const modo = {
      objetos: () => actual.picables.filter(o => o.visible),
      onHover: (hit, ev) => { const p = $('#pista'); const i = hit?.object.userData.info; if (i && ev) { const r = esc.canvas.getBoundingClientRect(); p.hidden = false; p.style.left = (ev.clientX - r.left) + 'px'; p.style.top = (ev.clientY - r.top) + 'px'; p.innerHTML = `<b>${E(i.n)}</b>`; } else p.hidden = true; },
      onClick: (hit) => { sel = hit?.object.userData.info || null; actual.alSeleccionar?.(hit?.object || null); pintarFicha(); if (sel) app.abrirFicha(); },
      frame: (dt, t) => { actual.frame?.(dt, t); etiquetas(); },
    };
    esc.usar('micro:' + id, actual.scene, modo, actual.metros, actual.camIni);
    $('#hud-sup').innerHTML = ''; $('#etiquetas').innerHTML = ''; $('#herramientas').innerHTML = '';
    actual.entrar?.();
    pintarLista(); pintarFicha();
    try { history.replaceState(null, '', '#micro/' + id); } catch { /* */ }
  }
  function etiquetas() {
    const cont = $('#etiquetas'); const es = actual.etqs || [];
    if (cont.childElementCount !== es.length || cont.dataset.id !== actual.id) { cont.innerHTML = ''; cont.dataset.id = actual.id; for (const e of es) cont.append(h('div', { class: 'etq' + (e.cls ? ' ' + e.cls : '') }, e.txt)); }
    es.forEach((e, k) => { const el = cont.children[k]; const p = esc.proyectar(e.pos); el.style.display = p.delante && e.visible !== false ? '' : 'none'; el.style.left = p.x + 'px'; el.style.top = p.y + 'px'; if (el.textContent !== e.txt) el.textContent = e.txt; });
  }
  function pintarFicha() {
    const der = $('#der'); der.innerHTML = ''; const cont = h('div', { class: 'desplaza' }); der.append(cont);
    if (sel) cont.append(h('div', { class: 'ficha', style: { paddingBottom: '4px', borderBottom: '1px solid var(--linea)' } }, h('div', { class: 'ruta' }, 'Parte seleccionada'), h('h1', { style: { fontSize: '18px' } }, sel.n), sel.d ? h('p', { style: { color: 'var(--texto2)' } }, sel.d) : null));
    actual.ficha(cont, pintarFicha);
  }
  function pintarLista() {
    const izq = $('#izq'); izq.innerHTML = '';
    const lista = h('div', { class: 'desplaza' });
    const fila = (id, n, sub) => h('div', { class: 'uni' + (actual?.id === id ? ' sel' : ''), onclick: () => abrir(id) }, h('span', null, h('div', { style: { fontWeight: 500 } }, n), sub ? h('div', { style: { fontSize: '11.5px', color: 'var(--texto3)' } }, sub) : null));
    for (const g of CELULAR) lista.append(h('div', { class: 'temario' }, h('div', { class: 'sem' }, g.n), g.items.map(i => fila(i.id, i.n, i.sub))));
    lista.append(h('div', { class: 'temario' }, h('div', { class: 'sem' }, 'Proteínas · 10⁻⁸ m (estructuras reales)')));
    const arb = h('div', { class: 'arbol' });
    CAT_PROT.forEach((c, k) => arb.append(h('details', { open: PROTEINAS.some(p => p.cat === k && 'p:' + p.id === actual?.id) || k === 0 }, h('summary', null, c, h('span', { class: 'n' }, PROTEINAS.filter(p => p.cat === k).length)), h('div', { class: 'hijos' }, PROTEINAS.filter(p => p.cat === k).map(p => h('div', { class: 'item' + (actual?.id === 'p:' + p.id ? ' sel' : ''), onclick: () => abrir('p:' + p.id) }, h('span', { class: 'nm' }, p.n)))))));
    lista.append(arb, h('div', { class: 'temario' }, h('div', { class: 'sem' }, 'Neurotransmisores y fármacos · 10⁻⁹ m')));
    const arb2 = h('div', { class: 'arbol' });
    CAT_MOL.forEach((c, k) => arb2.append(h('details', { open: MOLECULAS.some(m => m.cat === k && 'q:' + m.id === actual?.id) }, h('summary', null, c, h('span', { class: 'n' }, MOLECULAS.filter(m => m.cat === k).length)), h('div', { class: 'hijos' }, MOLECULAS.filter(m => m.cat === k).map(m => h('div', { class: 'item' + (actual?.id === 'q:' + m.id ? ' sel' : ''), onclick: () => abrir('q:' + m.id) }, h('span', { class: 'nm' }, m.n)))))));
    lista.append(arb2);
    izq.append(h('div', { class: 'cab' }, h('h2', null, 'Microescala'), h('p', null, 'Del circuito (milímetros) a la molécula (ángstroms). La regla inferior indica la escala.')), lista);
    $('#izq .sel')?.scrollIntoView({ block: 'nearest' });
  }

  return {
    entrar: (arg) => abrir(typeof arg === 'string' && arg ? arg : actual?.id),
    salir: () => { actual?.salir?.(); $('#pista').hidden = true; },
    abrir,
  };
}
