// Voxeliza la cabeza del atlas (encéfalo, cráneo, piel, ojos, arterias) para los simuladores de neuroimagen.
// Salida: assets/volumen.bin (etiquetas uint8 comprimidas con gzip) y assets/volumen.json (dimensiones y nombres).
// Uso: node tools/build-volumen.mjs [mm por vóxel, por defecto 1]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MM = +(process.argv[2] || 1);
const S = MM / 10;                       // el modelo está en centímetros
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

/** Triángulos en coordenadas de mundo de cada malla que pase el filtro. */
async function mallas(archivo, filtro) {
  const doc = await io.read(path.join(R, 'assets', archivo));
  const out = [];
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh || !filtro(node.getName())) continue;
    const M = node.getWorldMatrix();
    const tri = [];
    for (const prim of mesh.listPrimitives()) {
      const pa = prim.getAttribute('POSITION'), ix = prim.getIndices();
      const n = pa.getCount(), P = new Float64Array(n * 3), e = [];
      for (let i = 0; i < n; i++) {
        pa.getElement(i, e);
        P[3 * i] = M[0] * e[0] + M[4] * e[1] + M[8] * e[2] + M[12];
        P[3 * i + 1] = M[1] * e[0] + M[5] * e[1] + M[9] * e[2] + M[13];
        P[3 * i + 2] = M[2] * e[0] + M[6] * e[1] + M[10] * e[2] + M[14];
      }
      const m = ix ? ix.getCount() : n;
      for (let t = 0; t < m; t++) { const k = ix ? ix.getScalar(t) : t; tri.push(P[3 * k], P[3 * k + 1], P[3 * k + 2]); }
    }
    out.push({ n: node.getName(), tri: Float64Array.from(tri) });
  }
  return out;
}

const CABEZA_HUESOS = /^(frontal|parietal_[LR]|occipital|temporal_[LR]|esfenoides|etmoides|maxilar_[LR]|cigomatico_[LR]|nasal_[LR]|lagrimal_[LR]|palatino_[LR]|cornete_inferior_[LR]|vomer|mandibula|dientes|C1|C2)$/;
const CABEZA_OTROS = /^(piel|esclera_[LR]|cornea_[LR]|cristalino_[LR]|n_optico_[LR]|hipofisis|tentorio|capsula_interna_[LR]|plexo_coroideo_[LR]|me_C1|me_C2|a_(carotida_interna|cerebral|comunicante|basilar|cerebelosa|vertebral|coroidea|lenticuloestriadas|pontinas|oftalmica).*)$/;
const enc = await mallas('encefalo.glb', () => true);
const cue = await mallas('cuerpo.glb', (n) => CABEZA_HUESOS.test(n) || CABEZA_OTROS.test(n));

// caja: los huesos del cráneo más un margen para la piel; abajo hasta C2
const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
for (const m of cue.filter(m => CABEZA_HUESOS.test(m.n))) for (let i = 0; i < m.tri.length; i += 3) for (let a = 0; a < 3; a++) { mn[a] = Math.min(mn[a], m.tri[i + a]); mx[a] = Math.max(mx[a], m.tri[i + a]); }
for (let a = 0; a < 3; a++) { mn[a] -= 1.2; mx[a] += 1.2; }
const D = [0, 1, 2].map(a => Math.ceil((mx[a] - mn[a]) / S));
const [NX, NY, NZ] = D, N = NX * NY * NZ;
console.log(`rejilla ${NX}×${NY}×${NZ} a ${MM} mm (${(N / 1e6).toFixed(1)} M vóxeles)`);
const idx = (i, j, k) => i + NX * (j + NY * k);

/** Vóxeles interiores de una malla cerrada: paridad de cruces a lo largo de los tres ejes, voto de mayoría. */
function interior(tri) {
  let a0 = [1e9, 1e9, 1e9], a1 = [-1e9, -1e9, -1e9];
  for (let i = 0; i < tri.length; i += 3) for (let a = 0; a < 3; a++) { a0[a] = Math.min(a0[a], tri[i + a]); a1[a] = Math.max(a1[a], tri[i + a]); }
  const lo = a0.map((v, a) => Math.max(0, Math.floor((v - mn[a]) / S))), hi = a1.map((v, a) => Math.min(D[a] - 1, Math.ceil((v - mn[a]) / S)));
  const bx = hi[0] - lo[0] + 1, by = hi[1] - lo[1] + 1, bz = hi[2] - lo[2] + 1;
  if (bx <= 0 || by <= 0 || bz <= 0) return [];
  const votos = new Uint8Array(bx * by * bz);
  const B = [bx, by, bz];
  for (const ax of [0, 1, 2]) {
    const u = (ax + 1) % 3, w = (ax + 2) % 3;
    const cortes = new Map();
    for (let t = 0; t < tri.length; t += 9) {
      const p = [0, 1, 2].map(q => [tri[t + 3 * q], tri[t + 3 * q + 1], tri[t + 3 * q + 2]]);
      const us = p.map(q => (q[u] - mn[u]) / S - 0.5), ws = p.map(q => (q[w] - mn[w]) / S - 0.5);
      const u0 = Math.max(lo[u], Math.ceil(Math.min(...us))), u1 = Math.min(hi[u], Math.floor(Math.max(...us)));
      const w0 = Math.max(lo[w], Math.ceil(Math.min(...ws))), w1 = Math.min(hi[w], Math.floor(Math.max(...ws)));
      const den = (us[1] - us[0]) * (ws[2] - ws[0]) - (us[2] - us[0]) * (ws[1] - ws[0]);
      if (Math.abs(den) < 1e-12) continue;
      for (let iu = u0; iu <= u1; iu++) for (let iw = w0; iw <= w1; iw++) {
        // desplazamiento ínfimo para no caer justo en una arista
        const cu = iu + 1e-7, cw = iw + 2e-7;
        const l1 = ((us[1] - cu) * (ws[2] - cw) - (us[2] - cu) * (ws[1] - cw)) / den;
        const l2 = ((us[2] - cu) * (ws[0] - cw) - (us[0] - cu) * (ws[2] - cw)) / den;
        const l3 = 1 - l1 - l2;
        if (l1 < 0 || l2 < 0 || l3 < 0) continue;
        const v = (l1 * p[0][ax] + l2 * p[1][ax] + l3 * p[2][ax] - mn[ax]) / S - 0.5;
        const key = iu * 100000 + iw; let arr = cortes.get(key); if (!arr) cortes.set(key, arr = []); arr.push(v);
      }
    }
    for (const [key, arr] of cortes) {
      if (arr.length < 2) continue;
      arr.sort((a, b) => a - b);
      const iu = Math.floor(key / 100000), iw = key % 100000;
      for (let c = 0; c + 1 < arr.length; c += 2) {
        const s0 = Math.max(lo[ax], Math.ceil(arr[c])), s1 = Math.min(hi[ax], Math.floor(arr[c + 1]));
        for (let s = s0; s <= s1; s++) {
          const q = [0, 0, 0]; q[ax] = s - lo[ax]; q[u] = iu - lo[u]; q[w] = iw - lo[w];
          votos[q[0] + bx * (q[1] + by * q[2])]++;
        }
      }
    }
  }
  const out = [];
  for (let k = 0; k < bz; k++) for (let j = 0; j < by; j++) for (let i = 0; i < bx; i++) if (votos[i + bx * (j + by * k)] >= 2) out.push(idx(i + lo[0], j + lo[1], k + lo[2]));
  return out;
}

// nombres: el encéfalo sin lado (el lado se deduce de x); el cuerpo igual
const base = (n) => n.replace(/_(L|R)$/, '');
const NOMBRES = ['aire', 'piel_grasa', 'tejido_blando', 'lcr_externo'];
const id = (n) => { let i = NOMBRES.indexOf(n); if (i < 0) { i = NOMBRES.length; NOMBRES.push(n); } return i; };
const piezas = [];
for (const m of [...enc, ...cue]) {
  if (m.n === 'piel') continue;
  const v = interior(m.tri);
  piezas.push({ n: base(m.n), v });
}
const lab = new Uint8Array(N);
// 1) piel: en BodyParts3D es una cáscara delgada con aberturas (boca, narinas), así que ni la paridad ni una
//    inundación sirven. Se rellena, en cada línea de la rejilla, el tramo entre el primer y el último vóxel de
//    piel, y se queda con lo que cumplen al menos dos de los tres ejes.
{
  const cas = new Uint8Array(N); for (const q of interior(cue.find(m => m.n === 'piel').tri)) cas[q] = 1;
  const votos = new Uint8Array(N);
  for (const ax of [0, 1, 2]) {
    const u = (ax + 1) % 3, w = (ax + 2) % 3, paso = [1, NX, NX * NY][ax];
    for (let a = 0; a < D[u]; a++) for (let b = 0; b < D[w]; b++) {
      const c = [0, 0, 0]; c[u] = a; c[w] = b; const q0 = idx(c[0], c[1], c[2]);
      let p0 = -1, p1 = -1;
      for (let s = 0; s < D[ax]; s++) if (cas[q0 + s * paso]) { if (p0 < 0) p0 = s; p1 = s; }
      // el cuello sale por el borde inferior: en el eje vertical el tramo llega hasta el fondo
      if (ax === 1 && p0 >= 0 && cas[q0]) p0 = 0;
      for (let s = p0; p0 >= 0 && s <= p1; s++) votos[q0 + s * paso]++;
    }
  }
  for (let q = 0; q < N; q++) if (votos[q] >= 2) lab[q] = 2;
  // bolsas de aire encerradas (donde solo votó un eje): se inunda el aire desde el borde y el resto pasa a tejido
  const ext = new Uint8Array(N), pila = [];
  const pon = (q) => { if (!ext[q] && lab[q] === 0) { ext[q] = 1; pila.push(q); } };
  for (let k = 0; k < NZ; k++) for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) if (i === 0 || j === 0 || k === 0 || i === NX - 1 || j === NY - 1 || k === NZ - 1) pon(idx(i, j, k));
  while (pila.length) {
    const q = pila.pop(), i = q % NX, j = Math.floor(q / NX) % NY, k = Math.floor(q / (NX * NY));
    if (i > 0) pon(q - 1); if (i < NX - 1) pon(q + 1); if (j > 0) pon(q - NX); if (j < NY - 1) pon(q + NX); if (k > 0) pon(q - NX * NY); if (k < NZ - 1) pon(q + NX * NY);
  }
  for (let q = 0; q < N; q++) if (lab[q] === 0 && !ext[q]) lab[q] = 2;
}
// 2) las estructuras de mayor a menor volumen, para que las pequeñas queden encima de las que las contienen
piezas.sort((a, b) => b.v.length - a.v.length);
for (const p of piezas) { const e = id(p.n); for (const q of p.v) lab[q] = e; }
if (NOMBRES.length > 255) throw new Error('demasiadas etiquetas');

// 3) espacio subaracnoideo: vóxeles blandos encerrados por hueso en ≥5 de 6 direcciones y a ≤12 mm del encéfalo
const HUESO = new Set(piezas.filter(p => CABEZA_HUESOS.test(p.n) || CABEZA_HUESOS.test(p.n + '_L') || /^(C1|C2|dientes)$/.test(p.n)).map(p => NOMBRES.indexOf(p.n)));
const ENCEF = new Set(enc.map(m => NOMBRES.indexOf(base(m.n))));
const esH = new Uint8Array(N), esE = new Uint8Array(N);
for (let q = 0; q < N; q++) { esH[q] = HUESO.has(lab[q]); esE[q] = ENCEF.has(lab[q]); }
// distancia al encéfalo (chaflán 3D aproximado, en vóxeles)
const dist = new Float32Array(N).fill(1e9);
for (let q = 0; q < N; q++) if (esE[q]) dist[q] = 0;
const pasa = (orden) => {
  for (let k0 = 0; k0 < NZ; k0++) for (let j0 = 0; j0 < NY; j0++) for (let i0 = 0; i0 < NX; i0++) {
    const i = orden > 0 ? i0 : NX - 1 - i0, j = orden > 0 ? j0 : NY - 1 - j0, k = orden > 0 ? k0 : NZ - 1 - k0, q = idx(i, j, k);
    let d = dist[q];
    for (const [di, dj, dk, c] of [[-1, 0, 0, 1], [0, -1, 0, 1], [0, 0, -1, 1], [-1, -1, 0, 1.414], [-1, 0, -1, 1.414], [0, -1, -1, 1.414]]) {
      const a = i + orden * di, b = j + orden * dj, cc = k + orden * dk;
      if (a < 0 || b < 0 || cc < 0 || a >= NX || b >= NY || cc >= NZ) continue;
      d = Math.min(d, dist[idx(a, b, cc)] + c);
    }
    dist[q] = d;
  }
};
pasa(1); pasa(-1);
const cerrado = new Uint8Array(N);   // cuántas de las 6 direcciones topan con hueso
for (const [ax, sg] of [[0, 1], [0, -1], [1, 1], [1, -1], [2, 1], [2, -1]]) {
  const L = D[ax], u = (ax + 1) % 3, w = (ax + 2) % 3;
  for (let a = 0; a < D[u]; a++) for (let b = 0; b < D[w]; b++) {
    let visto = 0;
    for (let s0 = 0; s0 < L; s0++) {
      const s = sg > 0 ? s0 : L - 1 - s0; const c = [0, 0, 0]; c[ax] = s; c[u] = a; c[w] = b;
      const q = idx(c[0], c[1], c[2]);
      if (esH[q]) visto = 1; else if (lab[q] === 0) visto = 0;
      cerrado[q] += visto;
    }
  }
}
const lcr = id('lcr_externo');
for (let q = 0; q < N; q++) if (lab[q] === 2 && cerrado[q] >= 5 && dist[q] * MM <= 12) lab[q] = lcr;

// 4) grasa subcutánea: la capa de tejido blando a ≤4 mm del exterior (modelo esquemático)
const fuera = new Float32Array(N).fill(1e9);
for (let q = 0; q < N; q++) if (lab[q] === 0) fuera[q] = 0;
{ const tmp = dist.slice(); dist.set(fuera); pasa(1); pasa(-1); fuera.set(dist); dist.set(tmp); }
for (let q = 0; q < N; q++) if (lab[q] === 2 && fuera[q] * MM <= 4) lab[q] = 1;

const cuenta = new Map(); for (let q = 0; q < N; q++) cuenta.set(lab[q], (cuenta.get(lab[q]) || 0) + 1);
const gz = zlib.gzipSync(Buffer.from(lab.buffer), { level: 9 });
fs.writeFileSync(path.join(R, 'assets', 'volumen.bin'), gz);
fs.writeFileSync(path.join(R, 'assets', 'volumen.json'), JSON.stringify({
  nota: 'Etiquetas uint8, orden x más rápido, luego y, luego z; archivo comprimido con gzip. Coordenadas del atlas en cm. x<0 es el lado derecho del sujeto, y hacia arriba, z hacia adelante.',
  mm: MM, dim: D, origen: mn.map(v => +(v + S / 2).toFixed(4)), nombres: NOMBRES,
  voxeles: Object.fromEntries([...cuenta].map(([k, v]) => [NOMBRES[k], v])),
}));
console.log(`assets/volumen.bin ${(gz.length / 1024).toFixed(0)} KB · ${NOMBRES.length} etiquetas`);
