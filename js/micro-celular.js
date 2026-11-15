// Escenas procedurales de la microescala: neurona (con simulador de Hodgkin-Huxley), glía,
// sinapsis y microcircuitos. Son modelos esquemáticos a escala aproximada.
import { THREE, azar } from './escena.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { SINAPSIS, CIRCUITOS, PARTES } from '../data/micro.js';
import { $, h } from './ui.js';

export const CELULAR = [
  { n: 'Circuitos · 10⁻³ m', items: [{ id: 'c:corteza', n: 'Columna cortical', sub: 'Las seis capas de la neocorteza', kw: 'capas piramidal interneurona' }, { id: 'c:cerebelo', n: 'Corteza cerebelosa', sub: 'Purkinje, granulares, fibras musgosas y trepadoras', kw: 'purkinje granular paralelas' }, { id: 'c:medula', n: 'Sección de la médula espinal', sub: 'Láminas de Rexed y tractos', kw: 'tractos laminas rexed asta' }] },
  { n: 'Célula · 10⁻⁵ m', items: [{ id: 'n:neurona', n: 'Neurona y potencial de acción', sub: 'Partes, mielina y simulador de Hodgkin-Huxley', kw: 'axon dendrita soma mielina ranvier hodgkin huxley' }, { id: 'n:glia', n: 'Células gliales', sub: 'Astrocito, oligodendrocito, microglía y barrera hematoencefálica', kw: 'astrocito oligodendrocito microglia barrera' }] },
  { n: 'Sinapsis · 10⁻⁷ m', items: Object.entries(SINAPSIS).map(([k, s]) => ({ id: 's:' + k, n: s.n, sub: s.sub, kw: 'sinapsis vesicula ' + s.kw })) },
];

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0, ...o });
const info = (o, k, extra) => { o.userData.info = extra ? { ...PARTES[k], ...extra } : PARTES[k] || { n: k }; return o; };

/** Árbol dendrítico: devuelve segmentos {pts, r}. */
function ramas(o, d, L, r, n, rnd, op = {}) {
  const { abre = 0.75, k = 0.74, plano = null, curva = 0.14 } = op, out = [];
  const jit = (s) => { const v = V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).multiplyScalar(2 * s); if (plano) v[plano] *= 0.08; return v; };
  (function rec(o, d, L, r, n) {
    const p1 = o.clone().addScaledVector(d, L * 0.5).add(jit(L * curva)), p2 = o.clone().addScaledVector(d, L).add(jit(L * curva));
    out.push({ pts: [o, p1, p2], r });
    if (n <= 0) return;
    const nh = rnd() < 0.22 ? 3 : 2;
    for (let i = 0; i < nh; i++) { const d2 = d.clone().add(jit(abre)).normalize(); rec(p2, d2, L * (k + rnd() * 0.12), Math.max(r * 0.72, 0.02), n - 1); }
  })(o.clone(), d.clone().normalize(), L, r, n);
  return out;
}
function mallaRamas(segs, material, lados = 5) {
  const gs = segs.map(s => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s.pts), Math.max(3, s.pts.length * 2), s.r, lados, false));
  const m = new THREE.Mesh(mergeGeometries(gs), material); gs.forEach(g => g.dispose()); return m;
}
const tubo = (pts, r, material, seg = 0, lados = 8) => new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), seg || pts.length * 8, r, lados, false), material);
function camara(esc, centro, radio, dir = [0.4, 0.2, 1]) { const d = radio * 1.2 / Math.sin(THREE.MathUtils.degToRad(esc.camera.fov) / 2 * Math.min(1, esc.camera.aspect)); return { p: centro.clone().add(V3(...dir).normalize().multiplyScalar(d)), t: centro.clone(), near: radio / 200, far: radio * 60 }; }

// ══════════════════════════════════════════════════ Hodgkin-Huxley
export function hodgkinHuxley({ I = 10, dur = 1, I2 = 0, dt2 = 8, gNa = 120, gK = 36, T = 6.3, tmax = 30 } = {}) {
  const dt = 0.01, n = Math.round(tmax / dt), paso = 5, phi = Math.pow(3, (T - 6.3) / 10);
  let V = -65, m = 0.0529, hh = 0.5961, nn = 0.3177; const out = { t: [], V: [], gNa: [], gK: [], m: [], h: [], n: [], I: [] };
  for (let i = 0; i < n; i++) {
    const t = i * dt; const Ie = (t >= 2 && t < 2 + dur ? I : 0) + (I2 && t >= 2 + dt2 && t < 2 + dt2 + dur ? I2 : 0);
    const am = Math.abs(V + 40) < 1e-6 ? 1 : 0.1 * (V + 40) / (1 - Math.exp(-(V + 40) / 10)), bm = 4 * Math.exp(-(V + 65) / 18);
    const ah = 0.07 * Math.exp(-(V + 65) / 20), bh = 1 / (1 + Math.exp(-(V + 35) / 10));
    const an = Math.abs(V + 55) < 1e-6 ? 0.1 : 0.01 * (V + 55) / (1 - Math.exp(-(V + 55) / 10)), bn = 0.125 * Math.exp(-(V + 65) / 80);
    m += dt * phi * (am * (1 - m) - bm * m); hh += dt * phi * (ah * (1 - hh) - bh * hh); nn += dt * phi * (an * (1 - nn) - bn * nn);
    const gna = gNa * m * m * m * hh, gk = gK * nn * nn * nn * nn;
    V += dt * (Ie - gna * (V - 50) - gk * (V + 77) - 0.3 * (V + 54.387));
    if (i % paso === 0) { out.t.push(t); out.V.push(V); out.gNa.push(gna); out.gK.push(gk); out.m.push(m); out.h.push(hh); out.n.push(nn); out.I.push(Ie); }
  }
  return out;
}
function graficar(cv, series, { ymin, ymax, xmax, ejes = [], marcas = [] }) {
  const dpr = Math.min(devicePixelRatio || 1, 2), W = cv.clientWidth || 320, H = cv.clientHeight || 170; cv.width = W * dpr; cv.height = H * dpr;
  const g = cv.getContext('2d'); g.scale(dpr, dpr); g.clearRect(0, 0, W, H);
  const mx = 34, my = 10, X = (t) => mx + t / xmax * (W - mx - 8), Y = (v) => my + (1 - (v - ymin) / (ymax - ymin)) * (H - my - 18);
  g.font = '10px ui-monospace, Consolas, monospace'; g.fillStyle = '#7a8394'; g.strokeStyle = '#263041'; g.lineWidth = 1;
  for (const v of ejes) { g.beginPath(); g.moveTo(mx, Y(v)); g.lineTo(W - 8, Y(v)); g.stroke(); g.fillText(String(v), 4, Y(v) + 3); }
  for (let t = 0; t <= xmax; t += xmax / 6) g.fillText((+t.toFixed(0)) + '', X(t) - 4, H - 4);
  g.fillText('ms', W - 22, H - 4);
  for (const [v, txt, c] of marcas) { g.strokeStyle = c; g.setLineDash([3, 3]); g.beginPath(); g.moveTo(mx, Y(v)); g.lineTo(W - 8, Y(v)); g.stroke(); g.setLineDash([]); g.fillStyle = c; g.fillText(txt, W - 8 - g.measureText(txt).width, Y(v) - 3); }
  for (const s of series) { g.strokeStyle = s.c; g.lineWidth = s.w || 1.6; g.beginPath(); s.y.forEach((v, i) => { const x = X(s.t[i]), y = Y(Math.max(ymin, Math.min(ymax, v))); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); }
}

// ══════════════════════════════════════════════════ Neurona
async function neurona(esc) {
  const scene = esc.nuevaEscena(0.75), rnd = azar(7), picables = [], etqs = [];
  const add = (o, k, ex) => { info(o, k, ex); scene.add(o); picables.push(o); return o; };
  const cDend = '#d9b98f', cAxon = '#e9d08a';
  // soma translúcido con orgánulos
  add(new THREE.Mesh(new THREE.SphereGeometry(2.6, 40, 28), mat('#e3c39a', { transparent: true, opacity: 0.42, depthWrite: false })), 'soma').renderOrder = 3;
  add(new THREE.Mesh(new THREE.SphereGeometry(1.15, 28, 20), mat('#8f7fd0', { roughness: 0.4 })), 'nucleo');
  const nuc = add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12), mat('#5b47a8')), 'nucleolo'); nuc.position.set(0.35, 0.25, 0.4);
  for (let i = 0; i < 9; i++) { const g = add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 8), mat('#7fa6e0')), 'nissl'); const a = rnd() * 6.28, b = (rnd() - 0.5) * 2.2; g.position.set(Math.cos(a) * Math.cos(b), Math.sin(b), Math.sin(a) * Math.cos(b)).multiplyScalar(1.75); g.scale.set(1.5, 0.45, 1); g.lookAt(0, 0, 0); }
  for (let i = 0; i < 3; i++) { const g = add(new THREE.Mesh(new THREE.TorusGeometry(0.55 + i * 0.16, 0.07, 6, 20, Math.PI * 1.1), mat('#f0a05a')), 'golgi'); g.position.set(-1.3, -0.9, 0.9); g.rotation.set(0.6, 0.4, 0.3); }
  for (let i = 0; i < 7; i++) { const g = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.5, 4, 8), mat('#e2665c')), 'mitocondria'); const a = rnd() * 6.28, b = (rnd() - 0.5) * 2.4; g.position.set(Math.cos(a) * Math.cos(b), Math.sin(b), Math.sin(a) * Math.cos(b)).multiplyScalar(1.5 + rnd() * 0.6); g.rotation.set(rnd() * 3, rnd() * 3, rnd() * 3); }
  // dendritas con espinas
  const segs = []; for (const d of [[-1, 0.9, 0.2], [-0.8, -0.9, -0.3], [-0.2, 1, -0.6], [0.2, -1, 0.5], [-1, 0, 0.9], [-0.9, 0.1, -0.9], [0.5, 0.9, 0.5]]) segs.push(...ramas(V3(...d).normalize().multiplyScalar(2.3), V3(...d), 5.5, 0.42, 4, rnd));
  add(mallaRamas(segs, mat(cDend)), 'dendritas');
  const esp = []; for (const s of segs) if (s.r < 0.3) for (let i = 0; i < 4; i++) { const p = s.pts[0].clone().lerp(s.pts[2], rnd()); const n = V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize().multiplyScalar(s.r + 0.16); esp.push(p.add(n)); }
  const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.11, 6, 5), mat('#f0d9b0'), esp.length); const M = new THREE.Matrix4(); esp.forEach((p, i) => { M.makeTranslation(p.x, p.y, p.z); im.setMatrixAt(i, M); }); add(im, 'espinas');
  // cono axónico, segmento inicial, axón mielinizado
  const cono = add(new THREE.Mesh(new THREE.ConeGeometry(1.25, 2.6, 20, 1, true), mat(cAxon, { side: THREE.DoubleSide })), 'cono'); cono.rotation.z = -Math.PI / 2; cono.position.set(3.3, 0, 0);
  const sia = add(new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.4, 14), mat('#f08a5a', { emissive: '#f08a5a', emissiveIntensity: 0.15 })), 'sia'); sia.rotation.z = Math.PI / 2; sia.position.set(5.6, 0, 0);
  const x0 = 6.8, LI = 8.4, GAP = 0.6, NI = 6; const nodos = [], vainas = [];
  add(tubo([V3(4.4, 0, 0), V3(x0 + NI * (LI + GAP) + 2, 0, 0)], 0.26, mat(cAxon), 4), 'axon');
  for (let i = 0; i < NI; i++) {
    const xc = x0 + i * (LI + GAP) + LI / 2;
    const v = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.72, LI - 1.44, 6, 18), mat('#f4efe4', { roughness: 0.35 })), 'mielina'); v.rotation.z = Math.PI / 2; v.position.set(xc, 0, 0); vainas.push(v);
    const sc = add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 10), mat('#cfc6ee')), 'schwann'); sc.scale.set(1.5, 0.6, 1); sc.position.set(xc, 0.82, 0);
    const n = add(new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.31, GAP, 14), mat('#f2c14e', { emissive: '#f2c14e', emissiveIntensity: 0.1 })), 'nodo'); n.rotation.z = Math.PI / 2; n.position.set(xc + LI / 2 + GAP / 2, 0, 0); nodos.push(n);
  }
  const xf = x0 + NI * (LI + GAP) + 2; const term = [];
  for (const [dy, dz] of [[2.4, 1.2], [0.8, -1.8], [-1, 1.6], [-2.6, -0.8]]) { const fin = V3(xf + 5, dy, dz); scene.add(tubo([V3(xf, 0, 0), V3(xf + 2, dy * 0.5, dz * 0.5), fin], 0.13, mat(cAxon), 12, 6)); const b = add(new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), mat('#f0a5c8', { emissive: '#f0a5c8', emissiveIntensity: 0.1 })), 'boton'); b.position.copy(fin); term.push(b); }
  const diana = add(new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 7, 6, 16), mat('#c9706c')), 'diana'); diana.position.set(xf + 7.2, 0, 0);
  // pulso del potencial de acción
  const pulso = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 12), new THREE.MeshBasicMaterial({ color: '#fff3b0', transparent: true, opacity: 0.95 })); pulso.visible = false; pulso.raycast = () => { }; scene.add(pulso);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(1.5, 16, 12), new THREE.MeshBasicMaterial({ color: '#f2c14e', transparent: true, opacity: 0.25, depthWrite: false })); pulso.add(halo);
  let tp = -1; const paradas = [5.6, ...nodos.map(n => n.position.x), xf + 5];
  const disparar = () => { tp = 0; };
  etqs.push({ pos: V3(-6, 6.5, 0), txt: 'Dendritas' }, { pos: V3(0, 3.2, 0), txt: 'Soma' }, { pos: V3(5.6, 0.9, 0), txt: 'Segmento inicial' }, { pos: V3(x0 + LI / 2, 1.6, 0), txt: 'Vaina de mielina' }, { pos: V3(nodos[1].position.x, -1.0, 0), txt: 'Nodo de Ranvier' }, { pos: V3(xf + 5, 3.4, 1.2), txt: 'Botones terminales' });
  const centro = V3(xf / 2 - 2, 0, 0);
  // simulador
  const P = { I: 10, dur: 1, I2: 0, dt2: 8, gNa: 120, gK: 36, T: 6.3 };
  let cvV, cvG, resumen;
  const correr = () => {
    const r = hodgkinHuxley(P); const pico = Math.max(...r.V);
    graficar(cvV, [{ t: r.t, y: r.V, c: '#f2c14e', w: 2 }, { t: r.t, y: r.I.map(v => -95 + v * 0.6), c: '#7a8394', w: 1 }], { ymin: -100, ymax: 60, xmax: 30, ejes: [-80, -40, 0, 40], marcas: [[50, 'E_Na +50', '#e8776e'], [-77, 'E_K −77', '#7aa9e6']] });
    graficar(cvG, [{ t: r.t, y: r.gNa, c: '#e8776e' }, { t: r.t, y: r.gK, c: '#7aa9e6' }], { ymin: 0, ymax: 40, xmax: 30, ejes: [0, 20, 40] });
    const n = r.V.filter((v, i) => i > 0 && v >= 0 && r.V[i - 1] < 0).length;
    resumen.textContent = n ? `${n} potencial${n > 1 ? 'es' : ''} de acción · pico ${pico.toFixed(0)} mV` : `Sin potencial de acción: respuesta subumbral (pico ${pico.toFixed(0)} mV)`;
    resumen.style.color = n ? 'var(--verde)' : 'var(--texto2)';
    if (n) disparar();
  };
  const desl = (k, nombre, min, max, step, fmt) => { const o = h('output', null, fmt(P[k])); return h('div', { class: 'deslz' }, h('span', null, nombre), h('input', { type: 'range', min, max, step, value: P[k], oninput: (e) => { P[k] = +e.target.value; o.textContent = fmt(P[k]); correr(); } }), o); };
  const api = {
    scene, picables, metros: 1e-5, etqs, camIni: camara(esc, centro, 44, [0.1, 0.25, 1]),
    frame: (dt) => {
      if (tp < 0) { pulso.visible = false; return; }
      tp += dt * 3.2; const k = Math.floor(tp), f = tp - k;
      if (k >= paradas.length - 1) { tp = -1; for (const b of term) b.material.emissiveIntensity = 0.1; return; }
      // conducción saltatoria: se detiene (regenera) en cada nodo y cruza el internodo casi al instante
      const e = f < 0.55 ? 0 : (f - 0.55) / 0.45; pulso.visible = true; pulso.position.set(paradas[k] + (paradas[k + 1] - paradas[k]) * e * e * (3 - 2 * e), 0, 0);
      nodos.forEach((n, i) => { n.material.emissiveIntensity = i === k - 1 && f < 0.55 ? 1.2 : 0.1; });
      if (k === paradas.length - 2 && f > 0.7) for (const b of term) b.material.emissiveIntensity = 1;
    },
    ficha: (cont) => {
      cvV = h('canvas', { class: 'graf' }); cvG = h('canvas', { class: 'graf', style: { height: '110px' } }); resumen = h('div', { style: { fontSize: '12.5px', margin: '4px 0 8px' } });
      cont.append(h('div', { class: 'ficha' },
        h('div', { class: 'ruta' }, 'Célula · escala de micrómetros'), h('h1', null, 'La neurona y el potencial de acción'),
        h('p', { style: { marginTop: '8px' } }, 'Neurona multipolar con axón mielinizado. Haz clic en cualquier parte para identificarla. El punto luminoso muestra la conducción saltatoria: el potencial se regenera solo en los nodos de Ranvier.'),
        h('h3', null, 'Simulador de Hodgkin-Huxley'),
        h('p', { class: 'nota', style: { padding: 0 } }, 'Modelo original de 1952 (axón gigante de calamar). Amarillo: potencial de membrana (mV). Gris: corriente inyectada.'),
        cvV, resumen,
        h('p', { class: 'nota', style: { padding: 0 } }, 'Conductancias (mS/cm²): rojo g_Na, azul g_K.'), cvG,
        desl('I', 'Estímulo', 0, 30, 0.5, v => v.toFixed(1) + ' µA'), desl('dur', 'Duración', 0.2, 25, 0.2, v => v.toFixed(1) + ' ms'),
        desl('I2', '2.º pulso', 0, 60, 1, v => v ? v.toFixed(0) + ' µA' : 'no'), desl('dt2', 'Intervalo', 1.5, 20, 0.5, v => v.toFixed(1) + ' ms'),
        desl('gNa', 'g_Na máx.', 0, 120, 2, v => Math.round(v / 1.2) + ' %'), desl('gK', 'g_K máx.', 0, 36, 1, v => Math.round(v / 0.36) + ' %'), desl('T', 'Temperatura', 0, 30, 0.5, v => v.toFixed(1) + ' °C'),
        h('div', { class: 'marcas' },
          h('button', { class: 'marca-ch', onclick: () => { Object.assign(P, { I: 10, dur: 1, I2: 0, dt2: 8, gNa: 120, gK: 36, T: 6.3 }); cont.innerHTML = ''; api.ficha(cont); } }, 'Restablecer'),
          h('button', { class: 'marca-ch', title: 'Bloquea los canales de Na⁺', onclick: () => { P.gNa = 6; cont.innerHTML = ''; api.ficha(cont); } }, 'Tetrodotoxina'),
          h('button', { class: 'marca-ch', title: 'Bloquea los canales de K⁺', onclick: () => { P.gK = 4; cont.innerHTML = ''; api.ficha(cont); } }, 'Tetraetilamonio'),
          h('button', { class: 'marca-ch', onclick: () => { Object.assign(P, { I: 10, dur: 1, I2: 10, dt2: 5 }); cont.innerHTML = ''; api.ficha(cont); } }, 'Período refractario'),
          h('button', { class: 'marca-ch', onclick: () => { Object.assign(P, { I: 12, dur: 25, I2: 0 }); cont.innerHTML = ''; api.ficha(cont); } }, 'Descarga repetitiva')),
        h('h3', null, 'Qué observar'),
        h('ul', null,
          h('li', null, h('b', null, 'Todo o nada: '), 'bajo ~7 µA (1 ms) la respuesta es pasiva; sobre el umbral, el potencial tiene siempre la misma amplitud.'),
          h('li', null, h('b', null, 'Dos compuertas del Na⁺: '), 'la activación (m) es rápida; la inactivación (h) cierra el canal en ~1 ms. Por eso g_Na sube y cae sola.'),
          h('li', null, h('b', null, 'El K⁺ llega tarde: '), 'g_K crece con retraso, repolariza y produce la poshiperpolarización hacia E_K.'),
          h('li', null, h('b', null, 'Período refractario: '), 'con dos pulsos separados menos de ~5 ms, el segundo falla (absoluto) o exige más corriente (relativo).'),
          h('li', null, h('b', null, 'Temperatura: '), 'al subirla, las compuertas se aceleran (Q₁₀ ≈ 3) y el potencial se acorta; base del fenómeno de Uhthoff en la esclerosis múltiple.')),
        h('h3', null, 'Bases iónicas'),
        h('table', { class: 't' }, h('tr', null, h('th', null, 'Ion'), h('th', null, 'Dentro'), h('th', null, 'Fuera'), h('th', null, 'Equilibrio')),
          ...[['K⁺', '140 mM', '5 mM', '−90 mV'], ['Na⁺', '10–15 mM', '145 mM', '+60 mV'], ['Cl⁻', '5–10 mM', '110 mM', '−70 mV'], ['Ca²⁺', '0,0001 mM', '1–2 mM', '+120 mV']].map(r => h('tr', null, r.map(c => h('td', null, c))))),
        h('p', null, 'Ecuación de Nernst (37 °C): E = (61,5 / z) · log₁₀([ion]fuera / [ion]dentro). El potencial de reposo (~−70 mV) queda cerca de E_K porque en reposo dominan los canales de fuga de K⁺ (ecuación de Goldman-Hodgkin-Katz).')));
      requestAnimationFrame(correr);
    },
  };
  return api;
}

// ══════════════════════════════════════════════════ Glía
async function glia(esc) {
  const scene = esc.nuevaEscena(0.75), rnd = azar(21), picables = [], etqs = [];
  const add = (o, k, ex) => { info(o, k, ex); scene.add(o); picables.push(o); return o; };
  // capilar
  const cap = [V3(-16, -6, -2), V3(-6, -5, 0), V3(4, -6.5, 1), V3(16, -5, -1)];
  add(tubo(cap, 1.1, mat('#d9655f', { transparent: true, opacity: 0.55, depthWrite: false }), 40, 16), 'endotelio').renderOrder = 2;
  const cc = new THREE.CatmullRomCurve3(cap);
  for (let i = 0; i < 9; i++) { const e = add(new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.17, 8, 16), mat('#b8302c')), 'eritrocito'); e.position.copy(cc.getPointAt(0.06 + i * 0.105)); e.rotation.set(rnd() * 3, rnd() * 3, 0); }
  const per = add(new THREE.Mesh(new THREE.SphereGeometry(0.75, 14, 10), mat('#c98a4e')), 'pericito'); per.position.copy(cc.getPointAt(0.3)).add(V3(0, 1.25, 0)); per.scale.set(1.8, 0.5, 1);
  // astrocito con pies terminales
  const A = V3(-3, 1.5, 0); add(new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 14), mat('#6fc7a8')), 'astrocito').position.copy(A);
  const sa = []; for (let i = 0; i < 9; i++) { const d = V3(rnd() - 0.5, rnd() - 0.2, rnd() - 0.5).normalize(); sa.push(...ramas(A.clone().addScaledVector(d, 1), d, 2.8, 0.26, 3, rnd, { abre: 1.0 })); }
  for (const u of [0.33, 0.45, 0.56]) { const p = cc.getPointAt(u).add(V3(0, 1.15, 0.2)); sa.push({ pts: [A.clone().add(V3((u - 0.45) * 6, -1, 0)), A.clone().lerp(p, 0.6), p], r: 0.24 }); const pie = add(new THREE.Mesh(new THREE.SphereGeometry(0.7, 12, 10), mat('#6fc7a8')), 'pie'); pie.position.copy(p); pie.scale.set(1.6, 0.35, 1.4); }
  add(mallaRamas(sa, mat('#6fc7a8')), 'astrocito');
  // axones y oligodendrocito
  const O = V3(8, 4.5, 0); add(new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 12), mat('#8fb4f0')), 'oligo').position.copy(O);
  const so = [];
  for (let k = 0; k < 4; k++) {
    const z = -3 + k * 2, y = 1.2 + (k % 2) * 1.2;
    scene.add(tubo([V3(-4, y + 3, z), V3(4, y, z), V3(17, y + 0.5, z)], 0.16, mat('#e9d08a'), 20, 6));
    for (const xc of [6.5, 12.5]) { const v = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.45, 4, 5, 14), mat('#f4efe4', { roughness: 0.35 })), 'mielinaSNC'); v.rotation.z = Math.PI / 2; v.position.set(xc, y + (xc - 4) * 0.04, z); if (xc === 6.5 || k < 2) so.push({ pts: [O.clone(), O.clone().lerp(v.position, 0.5).add(V3(0, 0.6, 0)), v.position.clone().add(V3(0, 0.45, 0))], r: 0.1 }); }
  }
  add(mallaRamas(so, mat('#8fb4f0')), 'oligo');
  // neurona vecina y sinapsis envuelta por el astrocito
  const N = V3(-11, 5, 1); add(new THREE.Mesh(new THREE.SphereGeometry(1.5, 20, 14), mat('#e3c39a')), 'somaVecino').position.copy(N);
  const sn = []; for (const d of [[1, -0.3, 0], [-0.6, 0.8, 0.3], [0.2, 1, -0.4], [-1, -0.4, 0.2]]) sn.push(...ramas(N.clone().addScaledVector(V3(...d).normalize(), 1.3), V3(...d), 3, 0.28, 2, rnd));
  add(mallaRamas(sn, mat('#d9b98f')), 'dendritas');
  // microglía
  const Mg = V3(3, 7.5, -2); add(new THREE.Mesh(new THREE.SphereGeometry(0.6, 14, 10), mat('#e8a34e')), 'microglia').position.copy(Mg);
  const sm = []; for (let i = 0; i < 6; i++) { const d = V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); sm.push(...ramas(Mg.clone().addScaledVector(d, 0.5), d, 1.8, 0.1, 3, rnd, { abre: 1.2 })); }
  add(mallaRamas(sm, mat('#e8a34e'), 4), 'microglia');
  // epéndimo
  for (let i = 0; i < 9; i++) { const e = add(new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.6, 1.5), mat('#c79bd9')), 'ependimo'); e.position.set(-13 + i * 1.62, 11, -1); }
  etqs.push({ pos: A.clone().add(V3(0, 1.8, 0)), txt: 'Astrocito' }, { pos: O.clone().add(V3(0, 1.4, 0)), txt: 'Oligodendrocito' }, { pos: Mg.clone().add(V3(0, 1.2, 0)), txt: 'Microglía' }, { pos: V3(10, -3.6, 0), txt: 'Capilar · barrera hematoencefálica' }, { pos: V3(-6, 12.4, -1), txt: 'Epéndimo (pared ventricular)' });
  return { scene, picables, metros: 1e-5, etqs, camIni: camara(esc, V3(0, 3, 0), 19, [0.15, 0.1, 1]),
    ficha: (cont) => cont.append(h('div', { class: 'ficha' }, h('div', { class: 'ruta' }, 'Célula · escala de micrómetros'), h('h1', null, 'Células gliales'),
      h('p', { style: { marginTop: '8px' } }, 'La glía es tan numerosa como las neuronas (cerca de 86 000 millones de cada una en el encéfalo humano) y es indispensable para su función. Haz clic en cada célula.'),
      h('table', { class: 't' }, h('tr', null, h('th', null, 'Célula'), h('th', null, 'Origen'), h('th', null, 'Función principal')),
        ...[['Astrocito', 'Neuroectodermo', 'Sinapsis tripartita, recaptación de glutamato y K⁺, barrera hematoencefálica, lactato, cicatriz glial'], ['Oligodendrocito', 'Neuroectodermo', 'Mielina del SNC: cada uno mieliniza hasta 50 internodos'], ['Célula de Schwann', 'Cresta neural', 'Mielina del SNP: una célula por internodo; guía la regeneración'], ['Microglía', 'Saco vitelino (mesodermo)', 'Macrófago residente: vigilancia inmunitaria, fagocitosis, poda sináptica'], ['Epéndimo', 'Neuroectodermo', 'Reviste los ventrículos; sus cilios mueven el LCR; forma el epitelio de los plexos coroideos']].map(r => h('tr', null, r.map(c => h('td', null, c))))),
      h('h3', null, 'Barrera hematoencefálica'), h('p', null, 'Formada por las uniones estrechas (claudina-5, ocludina) del endotelio capilar, sostenidas por los pericitos y los pies terminales de los astrocitos. Solo la cruzan libremente gases y moléculas liposolubles pequeñas; la glucosa usa GLUT1 y los aminoácidos, LAT1. Falta en los órganos circunventriculares (área postrema, eminencia media, neurohipófisis, pineal).'),
      h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, 'Esclerosis múltiple: desmielinización autoinmunitaria del SNC (oligodendrocitos). Síndrome de Guillain-Barré: desmielinización del SNP (células de Schwann). Gliomas: astrocitoma, glioblastoma, oligodendroglioma, ependimoma. Neuromielitis óptica: anticuerpos contra la acuaporina-4 de los pies astrocitarios. Edema vasogénico: rotura de la barrera.'))) };
}

// ══════════════════════════════════════════════════ Sinapsis
async function sinapsis(esc, app, tipo) {
  const S = SINAPSIS[tipo], scene = esc.nuevaEscena(0.8), rnd = azar(tipo.length * 13 + 5), picables = [], etqs = [];
  const add = (o, k, ex) => { info(o, k, ex); scene.add(o); picables.push(o); return o; };
  const cNT = new THREE.Color(S.col), R = 5.2, yM = -4.6;      // la membrana presináptica queda en y = yM
  // terminal presináptico (esfera truncada, translúcida)
  const pre = add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.84), mat('#e9d08a', { transparent: true, opacity: 0.26, side: THREE.DoubleSide, depthWrite: false })), 'terminal'); pre.renderOrder = 4;
  const rz = Math.sin(Math.PI * 0.84) * R;
  const zona = add(new THREE.Mesh(new THREE.CylinderGeometry(rz, rz, 0.12, 40), mat('#d9b85a', { transparent: true, opacity: 0.55 })), 'zonaActiva'); zona.position.y = yM + 0.25;
  scene.add(tubo([V3(0, R - 0.3, 0), V3(0.5, R + 4, 0), V3(2, R + 9, 0)], 1.1, mat('#e9d08a', { transparent: true, opacity: 0.45 }), 12, 14));
  for (let i = 0; i < 2; i++) { const m = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.7, 2.2, 5, 12), mat('#e2665c')), 'mitocondria'); m.position.set(i ? 2.2 : -2.4, 1.8 + i, i ? -1.5 : 1.2); m.rotation.set(0.4, i, 1.1); }
  // vesículas
  const ves = []; const gv = new THREE.SphereGeometry(0.24, 12, 10);
  const acop = []; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28, r = i ? 1.7 : 0; acop.push(V3(Math.cos(a) * r, yM + 0.62, Math.sin(a) * r)); }
  for (let i = 0; i < 46; i++) {
    const a = rnd() * 6.28, b = Math.acos(rnd() * 1.4 - 0.7), r = rnd() * 3.3; const p = i < acop.length ? acop[i] : V3(Math.cos(a) * Math.sin(b) * r, yM + 1.5 + rnd() * 4.6, Math.sin(a) * Math.sin(b) * r);
    const v = add(new THREE.Mesh(gv, mat(cNT.clone().lerp(new THREE.Color('#ffffff'), 0.45), { roughness: 0.35 })), i < acop.length ? 'vesiculaAcoplada' : 'vesicula'); v.position.copy(p); ves.push({ m: v, p0: p.clone(), acop: i < acop.length });
  }
  // canales de Ca2+ presinápticos
  const cav = []; for (let i = 0; i < 8; i++) { const a = i / 8 * 6.28 + 0.3; const c = add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.55, 8), mat('#f2c14e')), 'cav'); c.position.set(Math.cos(a) * 1.05, yM + 0.25, Math.sin(a) * 1.05); cav.push(c); }
  // transportadores de recaptación
  const trans = []; if (S.recap !== 'ninguna') for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; const enAstro = S.recap === 'astro'; const c = add(new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.4, 4, 8), mat('#b58cf0')), 'transportador', { n: S.transportador[0], d: S.transportador[1] }); c.position.set(Math.cos(a) * (enAstro ? 4.9 : 3.3), enAstro ? yM - 0.5 : yM + 0.25, Math.sin(a) * (enAstro ? 4.9 : 3.3)); trans.push(c); }
  // hendidura y elemento postsináptico
  const yP = yM - 0.75;
  const post = add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.82, 40, 28, 0, Math.PI * 2, Math.PI * 0.2, Math.PI * 0.8), mat(S.postCol, { transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false })), 'post', { n: S.post[0], d: S.post[1] }); post.position.y = yP - Math.cos(Math.PI * 0.2) * R * 0.82; post.renderOrder = 4;
  const rp = Math.sin(Math.PI * 0.2) * R * 0.82;
  const dps = add(new THREE.Mesh(new THREE.CylinderGeometry(rp, rp, 0.3, 40), mat('#8a6ad0', { transparent: true, opacity: 0.6 })), 'dps'); dps.position.y = yP - 0.3;
  scene.add(tubo([V3(0, post.position.y - R * 0.78, 0), V3(0, post.position.y - R * 0.82 - 3, 0)], 0.9, mat(S.postCol, { transparent: true, opacity: 0.4 }), 4, 12));
  // receptores
  const recs = []; S.receptores.forEach((rc, k) => { const n = rc.n || 6; for (let i = 0; i < n; i++) { const a = i / n * 6.28 + k * 0.5, r = 0.7 + k * 0.95; const g = add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.7, 5), mat(rc.col)), 'receptor', { n: rc.nombre, d: rc.d }); g.position.set(Math.cos(a) * r, yP - 0.05, Math.sin(a) * r); recs.push({ m: g, rc, col: new THREE.Color(rc.col) }); } });
  // enzima en la hendidura (acetilcolinesterasa)
  if (S.enzima) for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28 + 0.4; const e = add(new THREE.Mesh(new THREE.OctahedronGeometry(0.2), mat('#6fc7a8')), 'enzima', { n: S.enzima[0], d: S.enzima[1] }); e.position.set(Math.cos(a) * 2.9, yM - 0.35, Math.sin(a) * 2.9); }
  // prolongación astrocitaria (sinapsis tripartita)
  if (S.astro) { const as = add(new THREE.Mesh(new THREE.TorusGeometry(5.3, 0.75, 12, 40, Math.PI * 1.5), mat('#6fc7a8', { transparent: true, opacity: 0.5 })), 'astroSinapsis'); as.rotation.x = Math.PI / 2; as.position.y = yM - 0.45; }
  // partículas: Ca2+, neurotransmisor, iones postsinápticos
  const pool = (n, geo, color) => Array.from({ length: n }, () => { const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color })); m.visible = false; m.raycast = () => { }; scene.add(m); return { m, a: rnd() * 6.28, r: rnd(), s: rnd() }; });
  const ca = pool(26, new THREE.SphereGeometry(0.07, 6, 5), '#ffe27a'), nt = pool(70, new THREE.SphereGeometry(0.075, 6, 5), cNT), ion = pool(34, new THREE.SphereGeometry(0.065, 6, 5), S.ionCol);
  const flash = new THREE.Color('#fff3b0'), basePre = new THREE.Color('#e9d08a');
  etqs.push({ pos: V3(-R - 0.5, 2.5, 0), txt: 'Terminal presináptico' }, { pos: V3(R * 0.8, yM - 0.35, R * 0.6), txt: 'Hendidura sináptica · ' + S.hendidura }, { pos: V3(-R * 0.9, post.position.y - 1, 0), txt: S.post[0] });
  // línea de tiempo (segundos de animación)
  const FASES = [0, 1.4, 2.8, 4.4, 6.6, 8.6, 10.2]; let t = 0, corre = true, fase = 0, cvP, lis;
  const estado = (tt) => {
    const f = FASES.findIndex((x, i) => tt >= x && tt < (FASES[i + 1] ?? 1e9)); if (f !== fase) { fase = f; lis?.forEach((li, i) => li.classList.toggle('on', i === f)); }
    const u = (a, b) => THREE.MathUtils.clamp((tt - a) / (b - a), 0, 1);
    pre.material.color.copy(basePre).lerp(flash, tt < 1.4 ? Math.sin(u(0, 1.4) * Math.PI) * 0.9 : 0); pre.material.opacity = 0.26 + (tt < 1.4 ? Math.sin(u(0, 1.4) * Math.PI) * 0.25 : 0);
    const abiertoCa = tt > 1.2 && tt < 3.4; cav.forEach(c => { c.material.emissive.set(abiertoCa ? '#f2c14e' : '#000000'); c.material.emissiveIntensity = abiertoCa ? 0.9 : 0; c.scale.x = c.scale.z = abiertoCa ? 1.5 : 1; });
    ca.forEach((p, i) => { const k = u(1.4 + p.s * 0.8, 2.6 + p.s * 0.8); p.m.visible = k > 0 && k < 1; const c = cav[i % cav.length].position; p.m.position.set(c.x + Math.cos(p.a) * 0.5 * k, c.y - 0.5 + k * 1.6, c.z + Math.sin(p.a) * 0.5 * k); });
    ves.forEach(v => { if (!v.acop) { v.m.position.y = v.p0.y + Math.sin(tt * 0.8 + v.p0.x * 3) * 0.05; return; } const k = u(2.8, 3.5), back = u(8.6, 10.2); v.m.position.y = v.p0.y - 0.42 * k * (1 - back); v.m.scale.setScalar(tt > 8.6 ? 0.3 + 0.7 * back : 1 - 0.7 * k); });
    nt.forEach((p, i) => {
      const v = acop[i % acop.length], k = u(3.0 + p.s * 0.5, 4.6 + p.s * 0.6), fuera = u(6.6 + p.s, 8.4 + p.s * 0.6); p.m.visible = k > 0 && fuera < 1;
      const rr = 0.3 + p.r * 2.3 * k; let x = v.x + Math.cos(p.a) * rr, z = v.z + Math.sin(p.a) * rr, y = yM + 0.15 - 0.7 * Math.min(1, k * 1.3) * (0.4 + 0.6 * p.s) + Math.sin(tt * 6 + i) * 0.03;
      if (fuera > 0) { if (S.recap === 'ninguna' || S.enzima) { p.m.scale.setScalar(1 - fuera); } else { const d = trans[i % trans.length].position; x += (d.x - x) * fuera; y += (d.y - y) * fuera; z += (d.z - z) * fuera; p.m.scale.setScalar(1); } } else p.m.scale.setScalar(1);
      p.m.position.set(x, y, z);
    });
    const unido = tt > 4.2 && tt < 7.4; recs.forEach(r => { const act = unido && !(r.rc.requiereDespol && tt < 5.2); r.m.material.emissive.copy(r.col); r.m.material.emissiveIntensity = act ? 0.9 : 0; r.m.scale.x = r.m.scale.z = act ? 1.35 : 1; });
    ion.forEach((p, i) => { const k = u(4.6 + p.s * 1.6, 6.0 + p.s * 1.6); p.m.visible = S.ionotropico && k > 0 && k < 1; const r = recs[i % recs.length].m.position; const dir = S.ionSale ? -1 : 1; p.m.position.set(r.x + Math.cos(p.a) * 0.4 * k, r.y + (dir > 0 ? 0.5 - k * 2.2 : -1.7 + k * 2.2), r.z + Math.sin(p.a) * 0.4 * k); });
    dibujarPSP(tt);
  };
  const dibujarPSP = (tt) => {
    if (!cvP) return; const ts = [], ys = []; const amp = S.psp;
    for (let x = 0; x <= 60; x += 0.5) { const tau = (x - 8); const y = tau > 0 ? amp * (tau / 6) * Math.exp(1 - tau / 6) : 0; ts.push(x); ys.push(-65 + y); }
    const hasta = Math.max(0, Math.min(1, (tt - 4.4) / 4)) * 60; const k = ts.findIndex(x => x > hasta);
    graficar(cvP, [{ t: ts.slice(0, k < 0 ? ts.length : k), y: ys.slice(0, k < 0 ? ys.length : k), c: S.psp >= 0 ? '#6fd08c' : '#ef6b62', w: 2 }], { ymin: -80, ymax: -40, xmax: 60, ejes: [-75, -65, -55, -45], marcas: [[-55, 'umbral', '#7a8394']] });
  };
  return { scene, picables, metros: 1e-7, etqs, camIni: camara(esc, V3(0, -1.5, 0), 10.5, [0.25, 0.12, 1]),
    frame: (dt) => { if (corre) { t += dt; if (t > 11.4) t = 0; } estado(t); },
    ficha: (cont, refrescar) => {
      cvP = h('canvas', { class: 'graf', style: { height: '120px' } });
      const ol = h('ol', { class: 'pasos' }, S.pasos.map((p, i) => h('li', { class: i === fase ? 'on' : '', onclick: () => { t = FASES[i] + 0.02; corre = false; refrescar(); } }, h('b', null, p[0]), h('div', null, p[1])))); lis = [...ol.children];
      cont.append(h('div', { class: 'ficha' }, h('div', { class: 'ruta' }, 'Sinapsis · escala de nanómetros'), h('h1', null, S.n), h('div', { class: 'lat' }, S.sub),
        h('p', { style: { marginTop: '10px' } }, S.d),
        h('div', { class: 'controles' }, h('button', { class: 'btn pri', onclick: () => { corre = !corre; refrescar(); } }, corre ? 'Pausar' : 'Reproducir'), h('button', { class: 'btn', onclick: () => { t = 0; corre = true; refrescar(); } }, 'Reiniciar')),
        h('h3', null, 'Secuencia de la transmisión'), ol,
        h('h3', null, S.ionotropico ? 'Potencial postsináptico (mV)' : 'Efecto postsináptico'), S.ionotropico ? cvP : h('p', null, S.efecto), S.ionotropico ? h('p', { class: 'nota', style: { padding: 0 } }, S.efecto) : null,
        h('h3', null, 'Receptores'), h('ul', null, S.receptores.map(r => h('li', null, h('b', { style: { color: r.col } }, r.nombre + ': '), r.d))),
        h('h3', null, 'Farmacología'), h('ul', null, S.farm.map(f => h('li', null, f))),
        h('h3', null, 'Ver a escala molecular'), h('div', { class: 'rel' }, S.enlaces.map(([id, n]) => h('button', { onclick: () => app.mods.micro.abrir(id) }, n))),
        h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, S.cl)));
    } };
}

// ══════════════════════════════════════════════════ Circuitos
function piramidal(o, tam, alto, rnd, col) {
  const segs = []; const ap = o.clone().add(V3(0, alto, 0));
  segs.push({ pts: [o.clone().add(V3(0, tam, 0)), o.clone().add(V3((rnd() - 0.5) * 0.5, alto * 0.5, (rnd() - 0.5) * 0.5)), ap], r: tam * 0.22 });
  for (let i = 0; i < 4; i++) { const d = V3(rnd() - 0.5, 0.9, rnd() - 0.5); segs.push(...ramas(ap, d, alto * 0.14 + 0.6, tam * 0.1, 2, rnd, { abre: 1.0 })); }
  for (let i = 0; i < 3; i++) { const y = tam + alto * (0.25 + i * 0.2); const d = V3(rnd() - 0.5, 0.35, rnd() - 0.5); segs.push(...ramas(o.clone().add(V3(0, y, 0)), d, 1.6, tam * 0.08, 1, rnd)); }
  for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28 + rnd(); const d = V3(Math.cos(a), -0.35, Math.sin(a)); segs.push(...ramas(o.clone().addScaledVector(d, tam * 0.6), d, tam * 2.4, tam * 0.13, 2, rnd)); }
  const g = new THREE.Group(); const soma = new THREE.Mesh(new THREE.ConeGeometry(tam, tam * 2, 10), mat(col)); soma.position.copy(o).add(V3(0, tam * 0.2, 0));
  g.add(soma, mallaRamas(segs, mat(col), 4)); return g;
}
function estrellada(o, tam, rnd, col, L = 2.2, n = 7, op = {}) {
  const segs = []; for (let i = 0; i < n; i++) { const d = V3(rnd() - 0.5, rnd() - 0.5, rnd() - 0.5).normalize(); segs.push(...ramas(o.clone().addScaledVector(d, tam * 0.8), d, L, tam * 0.16, 2, rnd, op)); }
  const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.SphereGeometry(tam, 14, 10), mat(col)); s.position.copy(o); g.add(s, mallaRamas(segs, mat(col), 4)); return g;
}
function registrar(g, k, picables, scene, datos) { g.traverse(o => { if (o.isMesh) { o.userData.info = datos[k]; picables.push(o); } }); scene.add(g); return g; }
function capas(scene, lista, ancho, prof, etqs) {
  let y = 0; for (const [nombre, alto, col] of lista) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, prof), new THREE.MeshStandardMaterial({ color: col, transparent: true, opacity: 0.075, depthWrite: false })); m.position.y = y - alto / 2; m.raycast = () => { }; m.renderOrder = 1; scene.add(m);
    const b = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(ancho, alto, prof)), new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.28 })); b.position.y = y - alto / 2; scene.add(b);
    etqs.push({ pos: V3(-ancho / 2 - 0.4, y - alto / 2, prof / 2), txt: nombre }); y -= alto;
  }
  return y;
}
function fichaCircuito(C) {
  return (cont) => cont.append(h('div', { class: 'ficha' }, h('div', { class: 'ruta' }, 'Circuito · escala de milímetros'), h('h1', null, C.n), h('div', { class: 'lat' }, C.sub), h('p', { style: { marginTop: '10px' } }, C.d),
    C.tabla ? h('table', { class: 't' }, h('tr', null, C.tabla[0].map(c => h('th', null, c))), ...C.tabla.slice(1).map(r => h('tr', null, r.map(c => h('td', null, c))))) : null,
    ...C.secciones.flatMap(([t, x]) => [h('h3', null, t), Array.isArray(x) ? h('ul', null, x.map(i => h('li', null, i))) : h('p', null, x)]),
    h('h3', null, 'Correlación clínica'), h('p', { class: 'clin' }, C.cl)));
}

async function corteza(esc) {
  const C = CIRCUITOS.corteza, scene = esc.nuevaEscena(0.75), rnd = azar(3), picables = [], etqs = [], D = C.celulas;
  const fondo = capas(scene, [['I · molecular', 2, '#9aa8f0'], ['II · granular externa', 2.2, '#8fd0a0'], ['III · piramidal externa', 6, '#f2d27a'], ['IV · granular interna', 3, '#e9967a'], ['V · piramidal interna', 5, '#d6a6e8'], ['VI · multiforme', 5.6, '#7fd1d1'], ['Sustancia blanca', 3, '#e8e2d0']], 16, 8, etqs);
  const R = (g, k) => registrar(g, k, picables, scene, D);
  R(piramidal(V3(-4.5, -9.2, 1), 0.42, 7.6, rnd, '#f2d27a'), 'p3'); R(piramidal(V3(-1.2, -7.4, -1.5), 0.36, 5.8, rnd, '#f2d27a'), 'p3'); R(piramidal(V3(4.8, -4.0, 0.5), 0.3, 2.6, rnd, '#b9e08a'), 'p2');
  R(piramidal(V3(1.2, -16.6, 0.5), 0.75, 15.4, rnd, '#d6a6e8'), 'p5'); R(piramidal(V3(-5.6, -15.6, -1.5), 0.6, 14.2, rnd, '#d6a6e8'), 'p5');
  R(piramidal(V3(5.2, -20.6, -1), 0.45, 9.5, rnd, '#7fd1d1'), 'p6');
  for (const [x, z] of [[-2.6, 1.6], [0.2, -0.6], [3, 1.2], [-0.6, 2.2]]) R(estrellada(V3(x, -11.6 + rnd(), z), 0.26, rnd, '#e9967a', 1.1, 6), 'ee');
  R(estrellada(V3(3.4, -8.4, -2), 0.32, rnd, '#ef6b62', 1.6, 6), 'cesta'); R(estrellada(V3(-3.4, -17.4, 1.8), 0.32, rnd, '#ef6b62', 1.6, 6), 'cesta');
  R(estrellada(V3(6, -14.6, 1.6), 0.28, rnd, '#f08fc0', 1.3, 5), 'mart'); R(estrellada(V3(-6.6, -5.4, -1), 0.24, rnd, '#b58cf0', 1.2, 5, { plano: 'x' }), 'vip'); R(estrellada(V3(2.2, -1.1, -1.6), 0.24, rnd, '#9aa8f0', 1.8, 5, { plano: 'y' }), 'cr');
  const ax = (pts, col, k, r = 0.07) => { const t = tubo(pts.map(p => V3(...p)), r, mat(col, { emissive: col, emissiveIntensity: 0.25 }), 0, 5); t.userData.info = D[k]; picables.push(t); scene.add(t); return t; };
  ax([[1.2, -16.6, 0.5], [1.4, -20, 0.6], [1.2, -26.5, 0.4]], '#d6a6e8', 'axP5', 0.1); ax([[5.2, -20.6, -1], [5.4, -24, -1], [6.4, -26.5, -1]], '#7fd1d1', 'axP6');
  ax([[-4.5, -9.2, 1], [-4.4, -14, 1.2], [-4.8, -23, 1.2], [-8, -25.4, 1.2]], '#f2d27a', 'axP3');
  const tc = [[-1, -26.5, 0.8], [-1, -19, 0.8], [-0.8, -13, 0.8]]; ax(tc, '#5db7e8', 'tc', 0.1); for (const d of [[-2.4, -11.2, 1.4], [0.6, -10.8, -0.4], [2.4, -11.6, 1.2], [-0.6, -10.4, 2]]) ax([[-0.8, -13, 0.8], d], '#5db7e8', 'tc', 0.05);
  ax([[6.4, -14.6, 1.6], [6.9, -8, 1.4], [6.4, -1.6, 1.2], [3, -0.9, 1], [-2, -0.9, 0.6]], '#f08fc0', 'axMart', 0.05);
  ax([[-8, -3.4, 0], [-3, -3.2, 0.4], [3, -3.4, -0.4], [8, -3.2, 0]], '#8fd0a0', 'cc', 0.06);
  return { scene, picables, metros: 1e-4, etqs, camIni: camara(esc, V3(0, -13, 0), 15, [0.35, 0.1, 1]), ficha: fichaCircuito(C) };
}

async function cerebelo(esc) {
  const C = CIRCUITOS.cerebelo, scene = esc.nuevaEscena(0.75), rnd = azar(11), picables = [], etqs = [], D = C.celulas;
  capas(scene, [['Capa molecular', 4, '#9aa8f0'], ['Capa de células de Purkinje', 0.7, '#f2d27a'], ['Capa granular', 3.4, '#e9967a'], ['Sustancia blanca', 3.2, '#e8e2d0']], 16, 9, etqs);
  const R = (g, k) => registrar(g, k, picables, scene, D);
  // Purkinje: árboles planos en el plano sagital (x, y), apilados a lo largo de z
  for (const z of [-3, 0, 3]) {
    const o = V3(z * 0.3, -4.35, z), segs = [];
    for (const dx of [-0.5, 0.5]) segs.push(...ramas(o.clone().add(V3(0, 0.3, 0)), V3(dx, 1, 0), 1.25, 0.13, 5, rnd, { abre: 0.95, plano: 'z', k: 0.7, curva: 0.1 }));
    const g = new THREE.Group(); const s = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), mat('#f2d27a')); s.scale.y = 1.25; s.position.copy(o); g.add(s, mallaRamas(segs, mat('#f2d27a'), 4)); R(g, 'purkinje');
    const a = tubo([o.clone(), V3(o.x + 0.3, -7, z), V3(o.x - 0.5, -10.4, z * 0.4)], 0.06, mat('#ef6b62', { emissive: '#ef6b62', emissiveIntensity: 0.3 }), 0, 5); a.userData.info = D.axPurk; picables.push(a); scene.add(a);
    // fibra trepadora que envuelve el árbol
    const tr = []; for (let i = 0; i <= 14; i++) tr.push(V3(o.x + Math.sin(i * 1.1) * (0.2 + i * 0.07), -11.3 + i * 0.75, z + 0.12)); const t = tubo(tr, 0.045, mat('#f2c14e', { emissive: '#f2c14e', emissiveIntensity: 0.4 }), 60, 5); t.userData.info = D.trepadora; picables.push(t); scene.add(t);
  }
  // granulares, sus axones ascendentes y las fibras paralelas (a lo largo de z)
  for (let i = 0; i < 26; i++) {
    const o = V3((rnd() - 0.5) * 13, -5.2 - rnd() * 2.6, (rnd() - 0.5) * 7), g = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), mat('#e9967a')); g.position.copy(o); g.userData.info = D.granular; picables.push(g); scene.add(g);
    if (i < 14) { const y = -0.5 - rnd() * 3.2; const a = tubo([o, V3(o.x, y, o.z)], 0.022, mat('#6fd08c', { emissive: '#6fd08c', emissiveIntensity: 0.3 }), 4, 4); const pf = tubo([V3(o.x, y, -4.4), V3(o.x, y, 4.4)], 0.022, mat('#6fd08c', { emissive: '#6fd08c', emissiveIntensity: 0.3 }), 2, 4); for (const m of [a, pf]) { m.userData.info = D.paralela; picables.push(m); scene.add(m); } }
  }
  for (const [x, z] of [[-4.6, 1], [3.6, -2]]) { const m = tubo([V3(x - 1, -11.3, z), V3(x, -8, z), V3(x + 0.4, -6.2, z)], 0.07, mat('#5db7e8', { emissive: '#5db7e8', emissiveIntensity: 0.3 }), 0, 5); m.userData.info = D.musgosa; picables.push(m); scene.add(m); for (let i = 0; i < 4; i++) { const r = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 6), mat('#5db7e8')); r.position.set(x + 0.4 + (rnd() - 0.5) * 1.6, -6.2 + (rnd() - 0.5) * 1.4, z + (rnd() - 0.5) * 1.4); r.userData.info = D.roseta; picables.push(r); scene.add(r); } }
  R(estrellada(V3(5.6, -5.4, 2), 0.24, rnd, '#b58cf0', 1.6, 6), 'golgi'); R(estrellada(V3(-5.8, -3.2, -1.5), 0.2, rnd, '#f08fc0', 1.2, 5, { plano: 'z' }), 'cesta'); R(estrellada(V3(4.6, -1.3, -2.5), 0.17, rnd, '#f4b6dc', 1.0, 5, { plano: 'z' }), 'estrellada');
  const dn = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 12), mat('#7fd1d1')); dn.position.set(-0.6, -10.8, 0.4); dn.userData.info = D.nucleo; picables.push(dn); scene.add(dn);
  etqs.push({ pos: V3(-0.6, -11.6, 0.4), txt: 'Neurona de un núcleo profundo' });
  return { scene, picables, metros: 1e-4, etqs, camIni: camara(esc, V3(0, -5.5, 0), 9.5, [0.75, 0.25, 0.7]), ficha: fichaCircuito(C) };
}

async function medula(esc) {
  const C = CIRCUITOS.medula, scene = esc.nuevaEscena(0.8), picables = [], etqs = [], D = C.celulas;
  const forma = (pts) => { const s = new THREE.Shape(); pts.forEach((p, i) => i ? s.lineTo(p[0], p[1]) : s.moveTo(p[0], p[1])); s.closePath(); return s; };
  const pieza = (pts, col, k, z = 0, alto = 1.6, op = 1) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(forma(pts), { depth: alto, bevelEnabled: false, curveSegments: 4 }), mat(col, { transparent: op < 1, opacity: op })); m.position.z = z; m.userData.info = D[k]; picables.push(m); scene.add(m); return m; };
  const esp = (pts) => pts.map(([x, y]) => [-x, y]).reverse();
  // contorno (sustancia blanca): x lateral, y anterior (ventral) hacia arriba de la pantalla → aquí +y = anterior
  const cont = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; cont.push([Math.cos(a) * 6.2 * (1 - 0.06 * Math.abs(Math.sin(a))), Math.sin(a) * 4.7 + (Math.abs(Math.cos(a)) < 0.12 && Math.sin(a) > 0 ? -0.9 : 0)]); }
  pieza(cont, '#efe7d4', 'blanca', 0, 1.5);
  // sustancia gris (mitad derecha de la pantalla) — asta posterior abajo, anterior arriba
  const gris = [[0, 0.55], [0.9, 0.7], [1.5, 1.6], [1.7, 2.7], [2.6, 3.3], [3.4, 2.9], [3.7, 1.9], [3.3, 0.9], [2.7, 0.2], [2.6, -0.6], [2.9, -1.6], [3.2, -2.9], [3.0, -3.9], [2.5, -4.1], [2.1, -3.2], [1.6, -1.8], [1.0, -0.8], [0, -0.55]];
  pieza(gris, '#c9a59a', 'gris', 0.06, 1.5); pieza(esp(gris), '#c9a59a', 'gris', 0.06, 1.5);
  const zona = (pts, col, k, lado = 1) => pieza(lado > 0 ? pts : esp(pts), col, k, 0.12, 1.5, 0.92);
  // láminas (derecha) y tractos: ascendentes en azules/verdes (lado derecho), descendentes en rojos (lado izquierdo); ambos existen a los dos lados
  zona([[2.5, -4.1], [3.0, -3.9], [3.15, -3.3], [2.2, -3.4]], '#7fb0f0', 'lam1'); zona([[2.2, -3.4], [3.15, -3.3], [3.1, -2.5], [1.95, -2.6]], '#9fc4f4', 'lam2'); zona([[1.95, -2.6], [3.1, -2.5], [2.85, -1.3], [1.5, -1.5]], '#b9d4f6', 'lam34'); zona([[1.5, -1.5], [2.85, -1.3], [2.6, -0.5], [1.0, -0.8]], '#cfe0f6', 'lam56');
  zona([[1.0, -0.8], [2.6, -0.5], [2.7, 0.2], [3.3, 0.9], [1.5, 1.2], [0.9, 0.7]], '#d9c2e8', 'lam7'); zona([[1.5, 1.2], [3.3, 0.9], [3.7, 1.9], [3.4, 2.9], [2.6, 3.3], [1.7, 2.7]], '#f0a3a0', 'lam9');
  zona([[0.9, 0.2], [1.6, 0.25], [1.6, -0.5], [0.9, -0.5]], '#e9d08a', 'clarke'); zona([[2.7, 0.2], [3.5, 0.5], [3.45, -0.1], [2.65, -0.3]], '#c8a0e8', 'iml');
  const T = (pts, col, k) => { zona(pts, col, k, 1); zona(pts, col, k, -1); };
  T([[0.05, -0.6], [0.9, -0.85], [1.3, -4.4], [0.05, -4.65]], '#4f9bd9', 'gracil'); T([[0.95, -0.9], [1.55, -1.9], [2.05, -3.3], [2.4, -4.2], [1.35, -4.42]], '#6fb5e8', 'cuneiforme');
  T([[2.6, -4.2], [3.1, -4.05], [3.3, -3.4], [3.6, -3.9], [2.9, -4.4]], '#a9c8a0', 'lissauer');
  T([[3.25, -2.9], [3.0, -1.5], [2.75, -0.7], [4.3, -0.5], [4.9, -1.6], [4.4, -3.0]], '#e2574c', 'cel'); T([[4.5, -3.1], [5.0, -1.6], [4.4, -0.45], [5.6, -0.3], [5.9, -1.5], [5.3, -3.0]], '#58c4c0', 'ecp');
  T([[4.4, -0.4], [5.65, -0.25], [5.75, 1.3], [4.9, 2.4], [4.3, 1.0]], '#7fd68a', 'eca'); T([[2.8, -0.2], [4.3, -0.4], [4.25, 0.9], [3.45, 0.75]], '#f29d7a', 'rubro');
  T([[3.8, 1.9], [4.3, 1.1], [4.9, 2.5], [3.9, 3.9], [3.2, 3.6], [3.5, 3.0]], '#f2c14e', 'et'); T([[1.7, 2.9], [2.6, 3.45], [3.15, 3.7], [2.4, 4.45], [1.2, 4.5]], '#d98ac0', 've'); T([[0.75, 0.8], [1.45, 1.7], [1.65, 2.8], [1.15, 4.4], [0.75, 4.2]], '#e58a4f', 'cea');
  T([[0.05, 0.6], [0.7, 0.75], [0.7, 1.4], [0.05, 1.3]], '#bdbdbd', 'cba');
  // raíces, ganglio y nervio espinal (lado derecho) + arco reflejo
  const tub = (pts, r, col, k, em = 0) => { const m = tubo(pts.map(p => V3(...p)), r, mat(col, { emissive: col, emissiveIntensity: em }), 0, 8); m.userData.info = D[k]; picables.push(m); scene.add(m); return m; };
  tub([[2.9, -4.3, 0.8], [4.6, -5.3, 0.8], [7.2, -4.6, 0.8], [9.2, -2.6, 0.8]], 0.36, '#f0d66b', 'raizPost'); const drg = new THREE.Mesh(new THREE.SphereGeometry(0.85, 18, 12), mat('#eccb58')); drg.scale.set(1.5, 1, 1); drg.position.set(7.4, -4.4, 0.8); drg.rotation.z = 0.5; drg.userData.info = D.drg; picables.push(drg); scene.add(drg);
  tub([[3.3, 3.2, 0.8], [5.4, 4.6, 0.8], [7.6, 2.6, 0.8], [9.2, -2.6, 0.8]], 0.3, '#f0d66b', 'raizAnt'); tub([[9.2, -2.6, 0.8], [11.4, -3.4, 0.8], [13.5, -3.2, 0.8]], 0.48, '#f0d66b', 'nervio');
  tub([[13.5, -3.3, 1.8], [11.4, -3.5, 1.8], [9.2, -2.8, 1.8], [7.4, -4.5, 1.8], [4.6, -5.3, 1.8], [2.8, -4.2, 1.8], [2.4, -2.4, 1.8], [2.3, 0.2, 1.8], [2.7, 2.0, 1.8]], 0.07, '#5db7e8', 'ia', 0.6);
  tub([[2.7, 2.0, 1.8], [3.3, 3.2, 1.8], [5.4, 4.6, 1.8], [7.6, 2.6, 1.8], [9.2, -2.5, 1.8], [11.4, -3.3, 1.8], [13.5, -3.1, 1.8]], 0.07, '#ef6b62', 'alfa', 0.6);
  const mn = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), mat('#ef6b62', { emissive: '#ef6b62', emissiveIntensity: 0.5 })); mn.position.set(2.7, 2.0, 1.8); mn.userData.info = D.alfa; picables.push(mn); scene.add(mn);
  const cc = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 1.7, 12), mat('#7db9dc')); cc.rotation.x = Math.PI / 2; cc.position.set(0, 0, 0.9); cc.userData.info = D.canal; picables.push(cc); scene.add(cc);
  etqs.push({ pos: V3(0, -5.3, 1.6), txt: 'POSTERIOR (dorsal)' }, { pos: V3(0, 5.4, 1.6), txt: 'ANTERIOR (ventral)' }, { pos: V3(7.4, -5.8, 0.8), txt: 'Ganglio de la raíz dorsal' }, { pos: V3(-3.9, -1.8, 1.7), txt: 'Corticoespinal lateral' }, { pos: V3(-0.7, -3, 1.7), txt: 'Columnas dorsales' }, { pos: V3(-4.2, 2.6, 1.7), txt: 'Espinotalámico' }, { pos: V3(2.6, 2.2, 2.2), txt: 'Motoneurona α' });
  return { scene, picables, metros: 1e-3, etqs, camIni: camara(esc, V3(3, -0.3, 0.8), 11, [0, -0.25, 1]), ficha: fichaCircuito(C) };
}

export const ESCENAS_CEL = {
  'n:neurona': async (esc) => { const s = await neurona(esc); return s; },
  'n:glia': glia, 'c:corteza': corteza, 'c:cerebelo': cerebelo, 'c:medula': medula,
  ...Object.fromEntries(Object.keys(SINAPSIS).map(k => ['s:' + k, (esc, app) => sinapsis(esc, app, k)])),
};
