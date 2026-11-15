// Genera assets/nervios.glb: nervios craneales, raíces y nervios espinales, plexos, nervios de
// los miembros y sistema autónomo, como tubos trazados sobre referencias óseas reales de BodyParts3D.
// Son trayectos ESQUEMÁTICOS (aproximación didáctica), no mallas segmentadas.
// Coordenadas de trabajo: «común» en mm (x = izquierda, y = arriba, z = anterior).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO, Document } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { quantize, meshopt, reorder } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import * as ML from './meshlib.mjs';
import { loadBP, bpByName } from './registro.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw'), OUT = path.join(ROOT, 'assets');
const AN = JSON.parse(fs.readFileSync(path.join(RAW, 'anclas.json'), 'utf8'));
const MB = JSON.parse(fs.readFileSync(path.join(OUT, 'encefalo.json'), 'utf8'));
const MC = JSON.parse(fs.readFileSync(path.join(OUT, 'cuerpo.json'), 'utf8'));
const C = AN.C, K = AN.canal, XM = -0.5;
await MeshoptEncoder.ready;

// ───────────────────────────── utilidades geométricas
const V = { add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], len: (a) => Math.hypot(a[0], a[1], a[2]), nor: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; }, cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], lerp: (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t] };
const sg = (S) => S === 'L' ? 1 : -1;
/** desplaza p: lat = hacia fuera del plano medio, ant = adelante, sup = arriba */
const o = (p, S, lat = 0, sup = 0, ant = 0) => [p[0] + sg(S) * lat, p[1] + sup, p[2] + ant];
const man = (M, id) => { const m = M[id]; if (!m) throw new Error('sin manifiesto: ' + id); const f = (v) => v.map((x, k) => x * 10 + C[k]); return { c: f(m.c), mn: f(m.mn), mx: f(m.mx) }; };
const enc = (id, f) => { const m = man(MB, id); return f ? m.mn.map((v, k) => v + (m.mx[k] - v) * f[k]) : m.c; };
const cue = (id) => man(MC, id);
const elemCache = new Map();
const elem = (rx) => { const k = String(rx); if (!elemCache.has(k)) { const fj = bpByName(rx); if (!fj.length) throw new Error('sin elemento ' + rx); const m = ML.merge(fj.map(loadBP)); elemCache.set(k, { c: ML.centroid(m.pos, m.idx), ...ML.bbox(m.pos), m }); } return elemCache.get(k); };
const lado = (S) => S === 'L' ? 'Left' : 'Right';
/** punto sobre el eje de un hueso (0 = extremo superior, 1 = inferior) */
const eje = (id, u) => { const e = AN.huesos[id].eje.map((p, k, a) => p || a.find(Boolean)); const f = Math.min(e.length - 1.001, Math.max(0, u * (e.length - 1))); const k = Math.floor(f); return V.lerp(e[k], e[k + 1], f - k); };
const canalEn = (y) => { const cl = Object.values(K).filter(v => v.gap).sort((a, b) => b.y - a.y); if (y >= cl[0].y) return [cl[0].x, y, cl[0].z]; for (let i = 1; i < cl.length; i++) if (y >= cl[i].y) { const f = (y - cl[i].y) / (cl[i - 1].y - cl[i].y); return [cl[i].x + f * (cl[i - 1].x - cl[i].x), y, cl[i].z + f * (cl[i - 1].z - cl[i].z)]; } const n = cl.length - 1; return [cl[n].x, y, cl[n].z]; };

function catmull(pts, n = 10) {
  const P = [pts[0], ...pts, pts[pts.length - 1]], out = [];
  for (let i = 1; i < P.length - 2; i++) for (let j = 0; j < n; j++) {
    const t = j / n, t2 = t * t, t3 = t2 * t, a = P[i - 1], b = P[i], c = P[i + 1], d = P[i + 2];
    out.push([0, 1, 2].map(k => 0.5 * ((2 * b[k]) + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t3)));
  }
  out.push(pts[pts.length - 1]); return out;
}
/** tubo a lo largo de puntos de control; r puede ser número o [r0, r1] */
function tubo(ctrl, r, lados = 7) {
  const pts = catmull(ctrl.filter((p, i, a) => i === 0 || V.len(V.sub(p, a[i - 1])) > 0.3), 8);
  const pos = [], idx = []; let nrm = null;
  for (let i = 0; i < pts.length; i++) {
    const t = V.nor(V.sub(pts[Math.min(pts.length - 1, i + 1)], pts[Math.max(0, i - 1)]));
    if (!nrm) { nrm = V.nor(V.cross(t, Math.abs(t[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])); } else { nrm = V.nor(V.sub(nrm, V.mul(t, V.dot(nrm, t)))); }
    const b = V.cross(t, nrm); const rr = Array.isArray(r) ? r[0] + (r[1] - r[0]) * i / (pts.length - 1) : r;
    for (let k = 0; k < lados; k++) { const a = k / lados * Math.PI * 2; pos.push(...V.add(pts[i], V.add(V.mul(nrm, Math.cos(a) * rr), V.mul(b, Math.sin(a) * rr)))); }
    if (i) for (let k = 0; k < lados; k++) { const a0 = (i - 1) * lados + k, a1 = (i - 1) * lados + (k + 1) % lados, b0 = i * lados + k, b1 = i * lados + (k + 1) % lados; idx.push(a0, a1, b0, a1, b1, b0); }
  }
  // tapas
  for (const [i0, inv] of [[0, false], [(pts.length - 1) * lados, true]]) { const c = pos.length / 3; pos.push(...pts[inv ? pts.length - 1 : 0]); for (let k = 0; k < lados; k++) { const a = i0 + k, b = i0 + (k + 1) % lados; inv ? idx.push(c, a, b) : idx.push(c, b, a); } }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };
}
function bola(c, r, esc = [1, 1, 1], nl = 8, nm = 10) {
  const pos = [], idx = [];
  for (let i = 0; i <= nl; i++) { const th = i / nl * Math.PI; for (let j = 0; j < nm; j++) { const ph = j / nm * 2 * Math.PI; pos.push(c[0] + r * esc[0] * Math.sin(th) * Math.cos(ph), c[1] + r * esc[1] * Math.cos(th), c[2] + r * esc[2] * Math.sin(th) * Math.sin(ph)); } }
  for (let i = 0; i < nl; i++) for (let j = 0; j < nm; j++) { const a = i * nm + j, b = i * nm + (j + 1) % nm, c2 = (i + 1) * nm + j, d = (i + 1) * nm + (j + 1) % nm; idx.push(a, b, c2, b, d, c2); }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };
}

const partes = new Map();   // id -> lista de mallas
const pon = (id, ...ms) => { if (!partes.has(id)) partes.set(id, []); partes.get(id).push(...ms.flat()); };

// ───────────────────────────── referencias
const FM = [K.C1.x, K.C1.ymax + 3, K.C1.z];                       // foramen magno
const PIT = cue('hipofisis').c;
const ORDEN = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5'];
const SEGS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'L1', 'L2', 'L3', 'L4', 'L5', 'S1', 'S2', 'S3', 'S4', 'S5'];
const entre = (a, b) => (K[a].y + K[b].y) / 2;
/** altura del foramen intervertebral (o sacro) por el que sale el nervio */
function yForamen(s) {
  const r = s[0], k = +s.slice(1);
  if (s === 'C1') return K.C1.ymax + 1;
  if (r === 'C' && k <= 7) return entre('C' + (k - 1), 'C' + k);
  if (s === 'C8') return entre('C7', 'T1');
  if (r === 'T') return k < 12 ? entre('T' + k, 'T' + (k + 1)) : entre('T12', 'L1');
  if (r === 'L') return k < 5 ? entre('L' + k, 'L' + (k + 1)) : K.L5.y - 27;
  return K.sacro.ymax - 26 - 19.5 * (k - 1);
}
const ancho = (s) => s[0] === 'C' ? 11.5 : s[0] === 'T' ? 13.5 : s[0] === 'L' ? 17 : 19 - 2.2 * (+s.slice(1));

// ───────────────────────────── raíces y nervios espinales
const salida = {};   // 'C5|L' -> punto donde el ramo anterior deja la columna
for (const s of SEGS) for (const S of ['L', 'R']) {
  const seg = cue('me_' + s);
  const y0 = seg.c[1], yF = yForamen(s);
  const p0 = [seg.c[0] + sg(S) * 3.8, y0, seg.c[2]];
  const pts = [p0];
  const n = Math.max(1, Math.round((y0 - yF) / 22));
  for (let i = 1; i <= n; i++) {            // descenso dentro del saco dural (cola de caballo en los niveles bajos)
    const y = y0 + (yF + 6 - y0) * i / (n + 0.4); const c = canalEn(y);
    const sep = 3.8 + Math.min(3.5, (y0 - y) / 40) + (s[0] === 'S' || s[0] === 'L' ? (SEGS.indexOf(s) - 19) * -0.28 + 3 : 0);
    pts.push([c[0] + sg(S) * Math.max(1.6, sep), y, c[2] - (s[0] === 'S' ? 2 : 0)]);
  }
  const cF = canalEn(yF); const zS = s[0] === 'S' ? K.sacro.z + 9 : cF[2] + 2;
  const F = [cF[0] + sg(S) * ancho(s), yF, zS];
  const fin = s[0] === 'S' ? [F[0] + sg(S) * 4, yF - 6, zS + 12] : [F[0] + sg(S) * 11, yF - 5, zS + (s[0] === 'T' ? -2 : 5)];
  pts.push(F, fin);
  const id = 'ne_' + s + '_' + S;
  pon(id, tubo(pts, s[0] === 'C' && +s.slice(1) >= 5 || s === 'T1' || s[0] === 'L' || s === 'S1' || s === 'S2' ? 1.5 : 1.15));
  pon(id, bola([cF[0] + sg(S) * (ancho(s) - 2.5), yF + 0.5, zS], 2.4, [1.25, 1, 1]));       // ganglio de la raíz dorsal
  salida[s + '|' + S] = fin;
}
// filum terminale
{ const cono = cue('me_S5'); pon('filum_terminal', tubo([[cono.c[0], cono.mn[1] + 2, cono.c[2]], canalEn(K.L3.y), canalEn(K.L5.y), [K.sacro.x, K.sacro.ymax - 45, K.sacro.z - 2], [K.sacro.x, K.sacro.ymin + 22, K.sacro.z - 14]], [0.9, 0.5])); }

// ───────────────────────────── nervios intercostales (siguen cada costilla real)
const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
for (const S of ['L', 'R']) for (let k = 0; k < 12; k++) {
  const rib = elem(new RegExp(`^${lado(S)} ${ORD[k]} rib$`, 'i')).m;
  const zc = K['T' + (k + 1)].z + 55, NB = 14, sl = Array.from({ length: NB }, () => [0, 0, 0, 0]);
  for (let i = 0; i < rib.pos.length; i += 3) {
    const ang = Math.atan2(rib.pos[i + 2] - zc, sg(S) * (rib.pos[i] - XM));   // −90° atrás … +90° adelante
    const b = Math.min(NB - 1, Math.max(0, Math.floor((ang + 2.2) / 4.0 * NB)));
    sl[b][0] += rib.pos[i]; sl[b][1] += rib.pos[i + 1]; sl[b][2] += rib.pos[i + 2]; sl[b][3]++;
  }
  const path = sl.filter(s => s[3] > 6).map(s => [s[0] / s[3] - sg(S) * 2.5, s[1] / s[3] - 7, s[2] / s[3] - 1]);
  if (path.length < 3) continue;
  const ini = salida['T' + (k + 1) + '|' + S];
  path.sort((a, b) => Math.atan2(a[2] - zc, sg(S) * (a[0] - XM)) - Math.atan2(b[2] - zc, sg(S) * (b[0] - XM)));
  const ctrl = [ini, ...path.filter(p => V.len(V.sub(p, ini)) > 14)];
  if (k >= 6) { const u = ctrl[ctrl.length - 1]; ctrl.push([XM + sg(S) * 28, u[1] - 30 - (k - 6) * 9, u[2] + 12]); }   // los inferiores continúan hacia la pared abdominal
  pon('nn_intercostales_' + S, tubo(ctrl, [1.1, 0.7], 6));
}

// ───────────────────────────── miembro superior
for (const S of ['L', 'R']) {
  const hum = 'humero_' + S, rad = 'radio_' + S, cub = 'cubito_' + S;
  // marco local: abajo (eje), radial (del cúbito al radio) y palmar
  const marco = (u) => { const R = eje(rad, u), U = eje(cub, u); const down = V.nor(V.sub(eje(rad, Math.min(1, u + 0.2)), eje(rad, Math.max(0, u - 0.2)))); let r = V.sub(R, U); r = V.nor(V.sub(r, V.mul(down, V.dot(r, down)))); const p = V.mul(V.cross(down, r), sg(S)); return { r, p, m: V.lerp(R, U, 0.5) }; };
  const codo = marco(0.12);
  const H = (u, r = 0, p = 0) => V.add(eje(hum, u), V.add(V.mul(codo.r, r), V.mul(codo.p, p)));
  const A = (u, r = 0, p = 0, base = 'm') => { const m = marco(u); const b = base === 'm' ? m.m : base === 'r' ? eje(rad, u) : eje(cub, u); return V.add(b, V.add(V.mul(m.r, r), V.mul(m.p, p))); };
  const mano = marco(0.97);
  const hueso = (n) => elem(new RegExp(`^${n.replace('@', lado(S).toLowerCase())}$`, 'i')).c;
  const pm = (p, r = 0, pal = 0) => V.add(p, V.add(V.mul(mano.r, r), V.mul(mano.p, pal)));
  const cab = eje(hum, 0.03);
  const AX = V.add(cab, [-sg(S) * 30, -26, -6]);                 // axila
  const clav = AN.huesos['clavicula_' + S]; const cmid = [(clav.mn[0] + clav.mx[0]) / 2, (clav.mn[1] + clav.mx[1]) / 2, (clav.mn[2] + clav.mx[2]) / 2];
  const TR = [cmid[0] - sg(S) * 14, cmid[1] - 2, cmid[2] - 16];   // troncos, tras el tercio medio de la clavícula
  // plexo braquial: raíces → troncos → fascículos
  const tr = { sup: V.add(TR, [0, 5, 0]), med: TR, inf: V.add(TR, [0, -5, -1]) };
  for (const [s, t] of [['C5', 'sup'], ['C6', 'sup'], ['C7', 'med'], ['C8', 'inf'], ['T1', 'inf']]) pon('plexo_braquial_' + S, tubo([salida[s + '|' + S], V.lerp(salida[s + '|' + S], tr[t], 0.55), tr[t]], 1.6));
  const fas = { lat: V.add(AX, [sg(S) * 3, 5, 4]), post: V.add(AX, [0, 2, -5]), med: V.add(AX, [-sg(S) * 4, -3, 2]) };
  for (const [t, f] of [['sup', 'lat'], ['med', 'lat'], ['sup', 'post'], ['med', 'post'], ['inf', 'post'], ['inf', 'med']]) pon('plexo_braquial_' + S, tubo([tr[t], V.lerp(tr[t], fas[f], 0.5), fas[f]], 1.5));
  // n. axilar: rodea por detrás el cuello quirúrgico del húmero
  pon('n_axilar_' + S, tubo([fas.post, H(0.13, -10, -12), H(0.15, 4, -17), H(0.16, 17, -8), H(0.19, 19, 6)], [1.5, 1.0]));
  // n. musculocutáneo
  pon('n_musculocutaneo_' + S, tubo([fas.lat, H(0.22, 2, 14), H(0.5, 6, 17), H(0.85, 12, 16), A(0.2, 10, 8, 'r'), A(0.6, 8, 6, 'r'), A(0.9, 6, 5, 'r')], [1.5, 0.8]));
  // n. mediano
  const cap = hueso('@ capitate'), tunel = pm(cap, 0, 9);
  pon('n_mediano_' + S, tubo([V.lerp(fas.lat, fas.med, 0.5), H(0.3, -13, 8), H(0.6, -12, 9), H(0.9, -7, 13), H(1.0, -3, 16), A(0.2, 0, 10), A(0.5, 0, 9), A(0.85, 1, 8), tunel, pm(cap, 0, 9, 0)], [1.9, 1.5]));
  for (const d of ['thumb', 'index finger', 'middle finger']) pon('n_mediano_' + S, tubo([tunel, pm(hueso(`proximal phalanx of @ ${d}`), 0, 6), pm(hueso(`distal phalanx of @ ${d}`), 0, 4)], [1.0, 0.6], 6));
  pon('n_mediano_' + S, tubo([tunel, pm(hueso('proximal phalanx of @ ring finger'), 3, 6), pm(hueso('distal phalanx of @ ring finger'), 3, 4)], [0.9, 0.5], 6));
  // n. cubital
  const pis = hueso('@ pisiform'), guyon = pm(pis, 4, 5);
  pon('n_cubital_' + S, tubo([fas.med, H(0.3, -17, 4), H(0.6, -17, -2), H(0.9, -20, -9), H(0.985, -27, -10), A(0.08, -12, -2, 'c'), A(0.3, -6, 8, 'c'), A(0.7, -3, 8, 'c'), A(0.95, -2, 8, 'c'), guyon], [1.8, 1.4]));
  for (const [d, r] of [['little finger', 0], ['ring finger', -3]]) pon('n_cubital_' + S, tubo([guyon, pm(hueso(`proximal phalanx of @ ${d}`), r, 6), pm(hueso(`distal phalanx of @ ${d}`), r, 4)], [1.0, 0.6], 6));
  // n. radial: surco espiral del húmero, epicóndilo lateral, ramo superficial
  pon('n_radial_' + S, tubo([fas.post, H(0.25, -10, -9), H(0.42, -2, -15), H(0.56, 9, -13), H(0.72, 15, -3), H(0.9, 17, 8), H(1.0, 15, 12), A(0.15, 9, 6, 'r'), A(0.5, 9, 3, 'r'), A(0.85, 8, -4, 'r'), pm(hueso('@ first metacarpal bone'), 4, -7), pm(hueso('proximal phalanx of @ thumb'), 2, -6)], [1.9, 0.8]));
  pon('n_radial_' + S, tubo([H(1.0, 15, 12), A(0.12, 6, -6, 'r'), A(0.4, 0, -10), A(0.8, 0, -9)], [1.2, 0.7], 6));  // ramo profundo (interóseo posterior)
}

// ───────────────────────────── miembro inferior
for (const S of ['L', 'R']) {
  const fem = 'femur_' + S, tib = 'tibia_' + S, per = 'perone_' + S;
  const FH = o(eje(fem, 0.02), S, -18, 4, 0);            // centro aproximado de la cabeza femoral
  const Fm = (u, lat = 0, ant = 0, sup = 0) => o(eje(fem, u), S, lat, sup, ant);
  const T = (u, lat = 0, ant = 0, sup = 0) => o(eje(tib, u), S, lat, sup, ant);
  const P = (u, lat = 0, ant = 0, sup = 0) => o(eje(per, u), S, lat, sup, ant);
  const hueso = (n) => elem(new RegExp(`^${n.replace('@', lado(S).toLowerCase())}$`, 'i')).c;
  const sal = (s) => salida[s + '|' + S];
  // n. femoral (L2–L4)
  const psoas = [XM + sg(S) * 44, K.L5.y - 8, K.L5.z + 26], ing = o(FH, S, -6, 12, 42);
  for (const s of ['L2', 'L3', 'L4']) pon('n_femoral_' + S, tubo([sal(s), V.lerp(sal(s), psoas, 0.6), psoas], 1.5));
  pon('n_femoral_' + S, tubo([psoas, V.lerp(psoas, ing, 0.5), ing, Fm(0.2, 0, 42), Fm(0.4, 2, 40)], [2.4, 1.6]));
  pon('n_femoral_' + S, tubo([Fm(0.2, 0, 42), Fm(0.5, -22, 30), Fm(0.8, -36, 10), Fm(0.99, -44, -2), T(0.3, -22, 4), T(0.7, -19, 8), T(0.99, -24, 10)], [1.3, 0.7], 6));   // n. safeno
  // n. obturador (L2–L4)
  const pelv = [XM + sg(S) * 36, K.sacro.ymax - 34, K.sacro.z + 34], obt = o(FH, S, -40, -20, 10);
  for (const s of ['L2', 'L3', 'L4']) pon('n_obturador_' + S, tubo([sal(s), V.lerp(sal(s), pelv, 0.6), pelv], 1.2));
  pon('n_obturador_' + S, tubo([pelv, V.lerp(pelv, obt, 0.55), obt, Fm(0.25, -52, 12), Fm(0.5, -46, 6)], [1.6, 0.9]));
  // n. ciático (L4–S3) y sus ramas
  const escot = o(FH, S, -40, 16, -50), glut = o(FH, S, -22, -32, -56);
  for (const s of ['L4', 'L5', 'S1', 'S2', 'S3']) pon('n_ciatico_' + S, tubo([sal(s), V.lerp(sal(s), escot, 0.55), escot], 1.8));
  const bif = Fm(0.74, -4, -32);
  pon('n_ciatico_' + S, tubo([escot, glut, Fm(0.25, -8, -34), Fm(0.5, -6, -33), bif], [4.2, 3.6], 9));
  const talon = hueso('@ calcaneus'), mt3 = hueso('@ third metatarsal bone'), mt1 = hueso('@ first metatarsal bone'), mt2 = hueso('@ second metatarsal bone');
  pon('n_tibial_' + S, tubo([bif, Fm(0.9, -2, -32), Fm(1.0, 0, -30), T(0.15, 0, -34), T(0.45, -2, -34), T(0.8, -10, -26), T(1.0, -22, -16), V.add(talon, [-sg(S) * 12, -6, 26]), V.add(mt3, [0, -14, -10]), V.add(mt3, [0, -14, 22])], [2.8, 1.2]));
  pon('n_peroneo_' + S, tubo([bif, Fm(0.92, 20, -26), P(0.03, 9, -9), P(0.07, 12, 0), P(0.11, 10, 8)], [2.2, 1.8]));
  pon('n_peroneo_' + S, tubo([P(0.11, 10, 8), P(0.4, 12, 6), P(0.75, 9, 12), P(0.95, 2, 22), V.add(mt3, [sg(S) * 4, 13, 4])], [1.5, 0.8], 6));       // superficial
  pon('n_peroneo_' + S, tubo([P(0.11, 10, 8), T(0.25, 17, 10), T(0.6, 13, 15), T(0.98, 4, 24), V.add(V.lerp(mt1, mt2, 0.5), [0, 11, 6]), V.add(V.lerp(mt1, mt2, 0.5), [0, 9, 34])], [1.4, 0.7], 6));  // profundo
  // n. pudendo (S2–S4)
  const esp = o(FH, S, -50, -6, -46), per2 = [XM + sg(S) * 15, AN.huesos['coxal_' + S].mn[1] + 26, K.sacro.z + 78];
  for (const s of ['S2', 'S3', 'S4']) pon('n_pudendo_' + S, tubo([sal(s), V.lerp(sal(s), esp, 0.6), esp], 1.0));
  pon('n_pudendo_' + S, tubo([esp, V.lerp(esp, per2, 0.5), per2], [1.3, 0.8]));
}

// ───────────────────────────── nervio frénico (C3–C5)
const cor = cue('corazon'), dia = cue('diafragma');
for (const S of ['L', 'R']) {
  const j = [XM + sg(S) * 26, K.C5.y - 6, K.C5.z + 15];
  for (const s of ['C3', 'C4', 'C5']) pon('n_frenico_' + S, tubo([salida[s + '|' + S], V.lerp(salida[s + '|' + S], j, 0.6), j], 0.9));
  const xb = S === 'L' ? cor.mx[0] + 3 : cor.mn[0] - 3;
  pon('n_frenico_' + S, tubo([j, [XM + sg(S) * 30, K.T1.y, K.T1.z + 34], [XM + sg(S) * 34, K.T3.y, K.T3.z + 58], [xb, cor.mx[1] - 12, cor.c[2] + 4], [xb, cor.c[1], cor.c[2] + 6], [xb, cor.mn[1] - 4, cor.c[2] + 4], [xb + sg(S) * 10, cor.mn[1] - 12, cor.c[2]]], [1.4, 1.0]));
}

// ───────────────────────────── nervios craneales
const esto = cue('estomago'), eso = cue('esofago');
const lengua = elem(/^Tongue$/).c, mand = AN.huesos.mandibula;
let arco = null; try { arco = elem(/^Arch of aorta$/).c; } catch { arco = [XM + 14, K.T4.y, K.T4.z + 52]; }
for (const S of ['L', 'R']) {
  const ojo = cue('esclera_' + S).c;
  const ore = elem(/^External ear$/); const oreja = [S === 'L' ? ore.mx[0] - 8 : ore.mn[0] + 8, (ore.mn[1] + ore.mx[1]) / 2, (ore.mn[2] + ore.mx[2]) / 2]; const EAR = [oreja[0] - sg(S) * 14, oreja[1] - 2, oreja[2] + 4];
  const pons = man(MB, 'basilar_part_of_pons_' + S), bul = man(MB, 'tegmentum_of_medulla_oblongata_' + S), oli = man(MB, 'inferior_olive_' + S), crus = man(MB, 'cerebral_peduncle_crus_cerebri_' + S), pir = man(MB, 'pyramidal_part_of_medulla_oblongata_' + S);
  const JF = [FM[0] + sg(S) * 27, FM[1] + 7, FM[2] + 15];         // foramen yugular
  const CPA = [pons.mx[0] * (S === 'L' ? 1 : 0) + pons.mn[0] * (S === 'R' ? 1 : 0) - sg(S) * 3, pons.mn[1] + 2, pons.c[2] - 3];   // ángulo pontocerebeloso
  const cav = o(PIT, S, 13, 3, 3);                                // seno cavernoso
  const SOF = [ojo[0] * 0.6 + XM * 0.4, ojo[1] + 3, ojo[2] - 37]; // fisura orbitaria superior
  const post = (rx) => { const m = elem(rx).m; let b = null; for (let i = 0; i < m.pos.length; i += 3) if (!b || m.pos[i + 2] < b[2]) b = [m.pos[i], m.pos[i + 1], m.pos[i + 2]]; return b; };
  // I: filetes olfatorios
  const bo = man(MB, 'olfactory_bulb_' + S);
  for (let k = 0; k < 6; k++) { const x = bo.c[0] + (k % 2 ? 1.6 : -1.6), z = bo.mn[2] + (bo.mx[2] - bo.mn[2]) * (0.15 + 0.14 * k); pon('n_olfatorio_' + S, tubo([[x, bo.mn[1] + 0.5, z], [x + sg(S) * 0.8, bo.mn[1] - 4, z + 1], [x + sg(S) * 2.2, bo.mn[1] - 9, z + 1.5]], [0.55, 0.3], 5)); }
  // III: de la fosa interpeduncular a la órbita
  const iii0 = [S === 'L' ? crus.mn[0] + 1 : crus.mx[0] - 1, crus.c[1] - 3, crus.mx[2] - 3];
  pon('n_oculomotor_tronco_' + S, tubo([iii0, V.lerp(iii0, cav, 0.5), cav, V.lerp(cav, SOF, 0.6), post(new RegExp(`^Superior branch of ${lado(S).toLowerCase()} oculomotor nerve$`, 'i'))], 1.25));
  // V: raíz, ganglio trigeminal y sus tres divisiones
  const v0 = [S === 'L' ? pons.mx[0] - 1 : pons.mn[0] + 1, pons.c[1] + 1, pons.c[2] + 1];
  const G = o(PIT, S, 19, -6, -9);
  pon('n_trigemino_' + S, tubo([v0, V.lerp(v0, G, 0.55), G], 2.0), bola(G, 4.2, [1.3, 0.7, 1]));
  pon('n_trigemino_' + S, tubo([G, V.lerp(G, post(new RegExp(`^${lado(S)} ophthalmic nerve$`, 'i')), 0.5), post(new RegExp(`^${lado(S)} ophthalmic nerve$`, 'i'))], 1.2));
  const FR = o(PIT, S, 19, -10, 9), IOF = [ojo[0] + sg(S) * 1, ojo[1] - 22, ojo[2] + 9];
  pon('n_maxilar_' + S, tubo([G, FR, [ojo[0], ojo[1] - 17, ojo[2] - 16], [ojo[0] + sg(S) * 1, ojo[1] - 18, ojo[2] + 2], IOF], [1.5, 1.2]));
  for (const d of [[-7, -9, 6], [1, -13, 5], [8, -6, 3]]) pon('n_maxilar_' + S, tubo([IOF, V.add(IOF, [sg(S) * d[0] * 0.5, d[1] * 0.5, d[2]]), V.add(IOF, [sg(S) * d[0], d[1], d[2]])], [0.8, 0.4], 5));
  pon('n_maxilar_' + S, tubo([FR, [FR[0] - sg(S) * 3, FR[1] - 14, FR[2] + 8], [XM + sg(S) * 20, FR[1] - 26, FR[2] + 14]], [0.9, 0.5], 5));   // nn. alveolares superiores / palatinos
  const FO = o(PIT, S, 23, -15, -5), div = [XM + sg(S) * 31, PIT[1] - 36, PIT[2] + 1];
  const MF = [XM + sg(S) * 38, PIT[1] - 54, PIT[2] + 4], MEN = [XM + sg(S) * 25, mand.mn[1] + 15, mand.mx[2] - 13];
  pon('n_mandibular_' + S, tubo([G, FO, div], 1.6));
  pon('n_mandibular_' + S, tubo([div, MF, [XM + sg(S) * 36, mand.mn[1] + 20, PIT[2] + 22], [XM + sg(S) * 31, mand.mn[1] + 15, mand.mx[2] - 28], MEN, [XM + sg(S) * 14, mand.mn[1] + 13, mand.mx[2] - 2]], [1.3, 0.7]));      // n. alveolar inferior → mentoniano
  pon('n_mandibular_' + S, tubo([div, [XM + sg(S) * 26, PIT[1] - 50, PIT[2] + 14], [lengua[0] + sg(S) * 14, lengua[1] - 2, lengua[2] + 2], [lengua[0] + sg(S) * 7, lengua[1] + 2, lengua[2] + 18]], [1.1, 0.5], 6));                     // n. lingual
  pon('n_mandibular_' + S, tubo([div, [EAR[0] - sg(S) * 6, EAR[1] - 6, EAR[2] + 12], [EAR[0] + sg(S) * 8, EAR[1] + 22, EAR[2] + 10]], [0.8, 0.4], 5));                                                                                // n. auriculotemporal
  // VI
  const vi0 = [XM + sg(S) * 4, pons.mn[1] + 1, pons.mx[2] - 1];
  pon('n_abducens_' + S, tubo([vi0, [XM + sg(S) * 7, PIT[1] - 12, PIT[2] - 9], o(PIT, S, 12, -1, 2), SOF, [ojo[0] + sg(S) * 12, ojo[1], ojo[2] - 10]], 0.85, 6));
  // VII y VIII
  const IAM = V.lerp(CPA, EAR, 0.36), GEN = V.add(V.lerp(CPA, EAR, 0.58), [0, 2, 4]), SM = [EAR[0] - sg(S) * 9, EAR[1] - 17, EAR[2] - 5], PAR = [EAR[0] + sg(S) * 4, EAR[1] - 24, EAR[2] + 12];
  pon('n_facial_' + S, tubo([[CPA[0], CPA[1], CPA[2] + 1.5], IAM, GEN, [GEN[0] + sg(S) * 5, GEN[1] - 6, GEN[2] - 6], SM, PAR], [1.3, 1.2]));
  for (const d of [[10, 62, 34], [14, 26, 48], [2, -4, 56], [-6, -30, 44], [-8, -52, 14]]) pon('n_facial_' + S, tubo([PAR, V.add(PAR, [sg(S) * d[0] * 0.6, d[1] * 0.45, d[2] * 0.5]), V.add(PAR, [sg(S) * d[0] * 0.2 - sg(S) * 8, d[1], d[2]])], [0.9, 0.45], 5));
  const IE = V.add(V.lerp(CPA, EAR, 0.56), [0, -2, -3]);
  pon('n_vestibulococlear_' + S, tubo([[CPA[0], CPA[1] - 1, CPA[2] - 1.5], V.add(IAM, [0, -1.5, -2]), IE], 1.4), bola(V.add(IE, [sg(S) * 1, -1, 3]), 3.4, [1, 0.8, 1]), bola(V.add(IE, [sg(S) * 3, 2, -3]), 3.0));
  // IX, X, XI, XII
  const lat = (dy) => [S === 'L' ? bul.mx[0] - 1 : bul.mn[0] + 1, bul.c[1] + dy, bul.c[2]];
  pon('n_glosofaringeo_' + S, tubo([lat(7), V.add(JF, [0, 2, 1]), [JF[0] - sg(S) * 2, JF[1] - 22, JF[2] + 12], [XM + sg(S) * 19, K.C2.y - 4, K.C2.z + 44], [lengua[0] + sg(S) * 9, lengua[1] - 6, lengua[2] - 14]], [1.0, 0.6], 6));
  const cuello = (v, lt, an) => [XM + sg(S) * lt, K[v].y, K[v].z + an];
  const vago = [lat(2), JF, [JF[0], JF[1] - 14, JF[2] + 3], cuello('C4', 25, 27), cuello('C7', 22, 30), cuello('T2', 20, 36), cuello('T5', 15, 40), [eso.c[0] + sg(S) * 7, K.T8.y, K.T8.z + 44], [eso.c[0] + sg(S) * 5, K.T10.y, K.T10.z + 50], [esto.c[0] + sg(S) * 6, esto.mx[1] - 14, esto.c[2] + (S === 'L' ? 16 : -14)], [esto.c[0] - 6, esto.c[1], esto.c[2] + (S === 'L' ? 22 : -18)]];
  pon('n_vago_' + S, tubo(vago, [1.9, 1.3]), bola([JF[0], JF[1] - 9, JF[2] + 2], 2.8, [1, 1.6, 1]));
  pon('n_vago_' + S, tubo([cuello('T2', 20, 36), [cor.c[0] + sg(S) * 10, cor.mx[1] + 6, cor.c[2] - 2], [cor.c[0] + sg(S) * 4, cor.mx[1] - 6, cor.c[2]]], [0.9, 0.5], 5));   // ramos cardíacos
  const gancho = S === 'L' ? [arco[0] + 6, arco[1] - 14, arco[2] - 2] : [XM - 24, K.T1.y - 4, K.T1.z + 34];
  pon('n_vago_' + S, tubo([S === 'L' ? cuello('T3', 19, 38) : cuello('T1', 21, 33), gancho, [gancho[0] - sg(S) * 9, gancho[1] + 6, gancho[2] - 8], [XM + sg(S) * 11, K.T1.y, K.T1.z + 28], [XM + sg(S) * 10, K.C6.y, K.C6.z + 30]], [0.9, 0.6], 5));  // n. laríngeo recurrente
  const c5 = cue('me_C5'), c3 = cue('me_C3'), c1 = cue('me_C1');
  pon('n_accesorio_' + S, tubo([[c5.c[0] + sg(S) * 5, c5.c[1], c5.c[2] - 1], [c3.c[0] + sg(S) * 5.5, c3.c[1], c3.c[2] - 1], [c1.c[0] + sg(S) * 6, c1.mx[1] + 2, c1.c[2] - 1], [FM[0] + sg(S) * 12, FM[1] + 9, FM[2] + 6], V.add(JF, [0, 1, -1.5]), [JF[0] + sg(S) * 6, JF[1] - 24, JF[2] - 2], cuello('C4', 48, 6), [XM + sg(S) * 78, K.T1.y + 22, K.T1.z - 4]], [1.0, 0.8], 6));
  const xii0 = [S === 'L' ? oli.mn[0] - 0.5 : oli.mx[0] + 0.5, oli.c[1], oli.mx[2] - 0.5];
  pon('n_hipogloso_' + S, tubo([xii0, [FM[0] + sg(S) * 14, FM[1] + 5, FM[2] + 10], [FM[0] + sg(S) * 22, FM[1] - 14, FM[2] + 16], [XM + sg(S) * 25, K.C2.y - 12, K.C2.z + 34], [lengua[0] + sg(S) * 12, lengua[1] - 9, lengua[2] - 2], [lengua[0] + sg(S) * 5, lengua[1] - 3, lengua[2] + 14]], [1.1, 0.7], 6));
  void pir;
}

// ───────────────────────────── sistema simpático
for (const S of ['L', 'R']) {
  const pts = [], gang = [];
  const pt = (v) => { const r = v[0]; const [lt, an] = r === 'C' ? [19, 17] : r === 'T' ? [22, 12] : [25, 26]; return [XM + sg(S) * lt, K[v].y, K[v].z + an]; };
  pts.push([XM + sg(S) * 20, K.C2.y + 12, K.C2.z + 18]);
  for (const v of ORDEN.slice(1)) pts.push(pt(v));
  for (let k = 1; k <= 4; k++) pts.push([XM + sg(S) * (17 - 3.4 * k), K.sacro.ymax - 12 - 26 * k, K.sacro.z + 22 - 5 * k]);
  pts.push([XM, K.sacro.ymin + 6, K.sacro.z - 4]);       // ganglio impar
  pon('tronco_simpatico_' + S, tubo(pts, 1.05, 6));
  gang.push(bola([XM + sg(S) * 20, K.C2.y - 2, K.C2.z + 18], 3.1, [0.8, 2.2, 0.8]));         // ganglio cervical superior
  gang.push(bola(pt('C6'), 2.4), bola(V.lerp(pt('C7'), pt('T1'), 0.6), 3.3, [1, 1.5, 1]));  // medio y estrellado
  for (const v of ORDEN.slice(8)) gang.push(bola(pt(v), 2.3, [1, 1.3, 1]));
  pon('tronco_simpatico_' + S, gang);
  // ramos comunicantes T1–L2
  for (const v of ORDEN.slice(7, 21)) pon('tronco_simpatico_' + S, tubo([salida[v + '|' + S], V.lerp(salida[v + '|' + S], pt(v), 0.5), pt(v)], 0.5, 5));
  // nervio esplácnico mayor (T5–T9) → ganglio celíaco
  const CG = [XM + sg(S) * 9, K.T12.y - 6, K.T12.z + 52];
  for (const v of ['T5', 'T6', 'T7', 'T8', 'T9']) pon('nn_esplacnicos_' + S, tubo([pt(v), [XM + sg(S) * 20, K.T10.y + 10, K.T10.z + 30], [XM + sg(S) * 14, K.T11.y, K.T11.z + 42], CG], 0.7, 5));
  pon('nn_esplacnicos_' + S, bola(CG, 4.8, [1.4, 0.9, 0.8]));
  pon('nn_esplacnicos_' + S, tubo([CG, [esto.c[0], esto.c[1] - 4, esto.c[2] - 8]], [0.8, 0.4], 5));
  // nervios esplácnicos pélvicos (parasimpático sacro, S2–S4)
  const vej = cue('vejiga');
  for (const s of ['S2', 'S3', 'S4']) pon('nn_esplacnicos_pelvicos_' + S, tubo([salida[s + '|' + S], [XM + sg(S) * 18, vej.c[1] + 26, vej.c[2] - 40], [vej.c[0] + sg(S) * 12, vej.c[1] + 4, vej.c[2] - 12]], [0.8, 0.45], 5));
}

// ───────────────────────────── escritura
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('nervios');
const mat = doc.createMaterial('m');
const manif = {}; let tris = 0;
for (const [id, ms] of partes) {
  const m = ML.merge(ms); const pos = new Float32Array(m.pos.length);
  for (let i = 0; i < pos.length; i += 3) { pos[i] = (m.pos[i] - C[0]) / 10; pos[i + 1] = (m.pos[i + 1] - C[1]) / 10; pos[i + 2] = (m.pos[i + 2] - C[2]) / 10; }
  const prim = doc.createPrimitive().setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf)).setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(ML.normals(pos, m.idx)).setBuffer(buf)).setIndices(doc.createAccessor().setType('SCALAR').setArray(m.idx).setBuffer(buf)).setMaterial(mat);
  scene.addChild(doc.createNode(id).setMesh(doc.createMesh(id).addPrimitive(prim)));
  const b = ML.bbox(pos); manif[id] = { c: ML.centroid(pos, m.idx).map(v => +v.toFixed(3)), mn: b.mn.map(v => +v.toFixed(2)), mx: b.mx.map(v => +v.toFixed(2)), t: m.idx.length / 3 }; tris += m.idx.length / 3;
}
await doc.transform(reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 8 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(path.join(OUT, 'nervios.glb'), doc);
fs.writeFileSync(path.join(OUT, 'nervios.json'), JSON.stringify(manif));
console.log('nervios.glb', (fs.statSync(path.join(OUT, 'nervios.glb')).size / 1e6).toFixed(2), 'MB,', partes.size, 'mallas,', tris, 'tri');
console.log([...new Set([...partes.keys()].map(k => k.replace(/_(L|R)$/, '').replace(/^ne_.*/, 'ne_*')))].join(' '));
