// Construye assets/encefalo.glb y assets/cuerpo.glb a partir de las fuentes en raw/.
//   Encéfalo: Allen Human Reference Atlas 3D vía HuBMAP HRA (CC BY 4.0)
//   Médula:   Visible Human Male vía HuBMAP HRA (CC BY 4.0), ajustada al conducto vertebral
//   Cuerpo:   BodyParts3D 4.0, DBCLS (CC BY-SA 2.1 JP)
// Espacio de la app: x = izquierda del sujeto, y = arriba, z = anterior; unidad = 1 cm;
// origen = centro del encéfalo.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO, Document } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { quantize, meshopt, reorder } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import * as ML from './meshlib.mjs';
import { registro, loadBP } from './registro.mjs';
import { PIEZAS, VERTEBRAS } from './cuerpo-config.mjs';
import { nombreAllen } from './allen-fix.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw');
const OUT = path.join(ROOT, 'assets');
fs.mkdirSync(OUT, { recursive: true });
await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const idx = JSON.parse(fs.readFileSync(path.join(RAW, 'bp3d-index.json'), 'utf8'));

// ───────────────────────────── Allen (mm, convención común) → espacio BodyParts3D
const M = await registro();
const allenDoc = await new NodeIO().read(path.join(RAW, 'hra', '3d-allen-m-brain.glb'));
const brain = [];
for (const node of allenDoc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const prim = mesh.listPrimitives()[0];
  const pos0 = Float32Array.from(prim.getAttribute('POSITION').getArray(), v => v * 1000);
  const idx0 = Uint32Array.from(prim.getIndices().getArray());
  const name = nombreAllen(node.getName());
  let m = ML.applyAffine(pos0, idx0, M);
  if (/white_matter/.test(name)) m = ML.simplify(m.pos, m.idx, 0.6, 0.004);
  const c = ML.centroid(m.pos, m.idx);
  // El atlas es simétrico: el lado se asigna por posición (x>0 = izquierda del sujeto).
  const side = name === 'optic_chiasm' ? 'M' : (c[0] > -0.5 ? 'L' : 'R');
  brain.push({ id: name + (side === 'M' ? '' : '_' + side), pos: m.pos, idx: m.idx });
}
const bb = ML.bbox(ML.merge(brain).pos);
const C = bb.mn.map((v, k) => (v + bb.mx[k]) / 2);
C[0] = -0.5; // plano medio de BodyParts3D
const toApp = (pos) => { const o = new Float32Array(pos.length); for (let i = 0; i < pos.length; i += 3) { o[i] = (pos[i] - C[0]) / 10; o[i + 1] = (pos[i + 1] - C[1]) / 10; o[i + 2] = (pos[i + 2] - C[2]) / 10; } return o; };
console.log('centro del encéfalo (mm, común):', C.map(v => v.toFixed(1)));

// ───────────────────────────── BodyParts3D
const byName = (rx) => Object.entries(idx).filter(([, v]) => v.n && rx.test(v.n)).map(([fj]) => fj);
const sideOf = (n) => /\bleft\b/i.test(n) ? 'L' : (/\bright\b/i.test(n) ? 'R' : 'M');
const strip = (n) => n.replace(/\b(left|right)\b ?/ig, '').replace(/\s+/g, ' ').trim();
const concepts = {};
for (const l of fs.readFileSync(path.join(RAW, 'partof_element_parts.txt'), 'utf8').split(/\r?\n/).slice(1)) {
  const p = l.split('\t'); if (p.length < 3) continue;
  (concepts[p[1].trim().toLowerCase()] ||= []).push(p[2].trim());
}
const cache = new Map();
const bp = (fj) => { if (!cache.has(fj)) cache.set(fj, loadBP(fj)); return cache.get(fj); };

function reduce(m, target) {
  let w = ML.weld(m.pos, m.idx, 1e-3);
  const tris = w.idx.length / 3;
  if (tris > target * 1.15) w = ML.simplify(w.pos, w.idx, target / tris, 0.03);
  return w;
}
const mirror = (m) => { const p = Float32Array.from(m.pos); for (let i = 0; i < p.length; i += 3) p[i] = -1 - p[i]; const ix = Uint32Array.from(m.idx); for (let t = 0; t < ix.length; t += 3) { const s = ix[t + 1]; ix[t + 1] = ix[t + 2]; ix[t + 2] = s; } return { pos: p, idx: ix }; };

const body = [];      // {id, g, pos (común mm), idx}
const add = (id, g, fjs, target, extra) => {
  fjs = fjs.filter(f => idx[f]);
  if (!fjs.length) { console.log('  !! sin elementos:', id); return; }
  let m = ML.merge(fjs.map(bp));
  if (extra) m = ML.merge([m, extra]);
  const r = reduce(m, target);
  body.push({ id, g, pos: r.pos, idx: r.idx, n: fjs.length });
};
for (const P of PIEZAS) {
  if (P.n) {
    let fjs = byName(P.n);
    if (P.porLado) { for (const f of fjs) add(P.id + (ML.centroid(bp(f).pos, bp(f).idx)[0] > -0.5 ? '_L' : '_R'), P.g, [f], P.t); continue; }
    if (P.espejo) { const m = ML.merge(fjs.map(bp)); const r = reduce(ML.merge([m, mirror(m)]), P.t); body.push({ id: P.id, g: P.g, pos: r.pos, idx: r.idx, n: fjs.length }); continue; }
    add(P.id, P.g, fjs, P.t);
  } else if (P.lr || P.lrn) {
    const rx = new RegExp('^' + (P.lr ?? P.lrn) + '$', 'i');
    for (const S of ['L', 'R']) {
      let fjs = Object.entries(idx).filter(([, v]) => v.n && sideOf(v.n) === S && rx.test(strip(v.n))).map(([f]) => f);
      if (P.extra) for (const f of byName(P.extra)) if ((ML.centroid(bp(f).pos, bp(f).idx)[0] > -0.5 ? 'L' : 'R') === S) fjs.push(f);
      add(P.id + '_' + S, P.g, fjs, P.t);
    }
  } else if (P.fj) {
    for (const S of ['L', 'R']) add(P.id + '_' + S, P.g, P.fj[S], P.t);
  } else if (P.c) {
    add(P.id, P.g, concepts[P.c] || [], P.t);
  } else if (P.cl) {
    for (const S of ['L', 'R']) add(P.id + '_' + S, P.g, concepts[P.cl[S]] || [], P.t);
  }
}

// ───────────────────────────── conducto vertebral y médula espinal
const canal = {};
for (const v of [...VERTEBRAS, 'sacro']) {
  const m = body.find(b => b.id === v); if (!m) continue;
  const b = ML.bbox(m.pos);
  const xc = (b.mn[0] + b.mx[0]) / 2, h = b.mx[1] - b.mn[1];
  let best = null;
  for (let k = 0; k < 8; k++) {
    const y0 = b.mn[1] + h * k / 8, y1 = y0 + h / 8;
    const zs = [];
    for (let i = 0; i < m.pos.length; i += 3) if (Math.abs(m.pos[i] - xc) < 3 && m.pos[i + 1] >= y0 && m.pos[i + 1] < y1) zs.push(m.pos[i + 2]);
    zs.sort((a, c) => a - c);
    for (let i = 1; i < zs.length; i++) { const g = zs[i] - zs[i - 1]; if (g > 8 && g < 36 && (!best || g > best.g)) best = { g, z: v === 'C1' ? (zs[i] + zs[i - 1]) / 2 - 3 : zs[i] - Math.min(g / 2, 8.5), y: (y0 + y1) / 2 }; }
  }
  canal[v] = { x: xc, y: best ? best.y : (b.mn[1] + b.mx[1]) / 2, z: best ? best.z : b.mn[2] + 12, gap: best ? +best.g.toFixed(1) : null, ymin: b.mn[1], ymax: b.mx[1], xmin: b.mn[0], xmax: b.mx[0], zmin: b.mn[2], zmax: b.mx[2] };
}
console.log('conducto (diámetro AP mm):', Object.entries(canal).map(([k, v]) => k + ':' + v.gap).join(' '));
const cl = Object.values(canal).filter(v => v.gap).sort((a, b) => b.y - a.y);
const lineAt = (y) => {  // centro del conducto a la altura y (interpolación lineal)
  if (y >= cl[0].y) return [cl[0].x, cl[0].z];
  for (let i = 1; i < cl.length; i++) if (y >= cl[i].y) { const f = (y - cl[i].y) / (cl[i - 1].y - cl[i].y); return [cl[i].x + f * (cl[i - 1].x - cl[i].x), cl[i].z + f * (cl[i - 1].z - cl[i].z)]; }
  const n = cl.length - 1; return [cl[n].x, cl[n].z];
};
const cordDoc = await new NodeIO().read(path.join(RAW, 'hra', '3d-vh-m-spinal-cord.glb'));
const ORD = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12 };
const segs = [];
for (const node of cordDoc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const nm = node.getName();
  let id = null, mm;
  if ((mm = nm.match(/_C(\d)_segment/))) id = 'C' + mm[1];
  else if ((mm = nm.match(/_([a-z]+)_(thoracic|lumbar|sacral)_spinal/))) id = { thoracic: 'T', lumbar: 'L', sacral: 'S' }[mm[2]] + ORD[mm[1]];
  const prim = mesh.listPrimitives()[0];
  segs.push({ id, pos: Float32Array.from(prim.getAttribute('POSITION').getArray()), idx: Uint32Array.from(prim.getIndices().getArray()) });
}
{
  const all = ML.merge(segs); const b = ML.bbox(all.pos);
  const yT = b.mx[1], yB = b.mn[1], NB = 60;
  const sx = new Float64Array(NB), sz = new Float64Array(NB), sn = new Float64Array(NB);
  for (let i = 0; i < all.pos.length; i += 3) { const k = Math.min(NB - 1, Math.floor((yT - all.pos[i + 1]) / (yT - yB) * NB)); sx[k] += all.pos[i]; sz[k] += all.pos[i + 2]; sn[k]++; }
  const cv = (t) => { const f = Math.min(NB - 1.001, Math.max(0, t * NB - 0.5)); const k = Math.floor(f), u = f - k; const k2 = Math.min(NB - 1, k + 1); return [(sx[k] / sn[k]) * (1 - u) + (sx[k2] / sn[k2]) * u, (sz[k] / sn[k]) * (1 - u) + (sz[k2] / sn[k2]) * u]; };
  const YT = canal.C1.ymax + 3, YB = canal.L1.ymin + 2;   // del foramen magno al disco L1–L2
  console.log('médula: VH', ((yT - yB) * 1000).toFixed(0), 'mm → conducto', (YT - YB).toFixed(0), 'mm');
  for (const s of segs) {
    const p = new Float32Array(s.pos.length);
    for (let i = 0; i < p.length; i += 3) {
      const t = (yT - s.pos[i + 1]) / (yT - yB);
      const [cx, cz] = cv(t); const Y = YT - t * (YT - YB); const [X, Z] = lineAt(Y);
      p[i] = X + (s.pos[i] - cx) * 1000; p[i + 1] = Y; p[i + 2] = Z + (s.pos[i + 2] - cz) * 1000;
    }
    const ix = Uint32Array.from(s.idx);  // misma orientación: no hay reflexión
    body.push({ id: 'me_' + s.id, g: 'medula', pos: p, idx: ix, n: 1 });
  }
}

// ───────────────────────────── anclas para los nervios periféricos (ejes de huesos)
const anclas = { canal, huesos: {} };
for (const b of body) {
  if (!/^(humero|radio|cubito|femur|tibia|perone|clavicula|escapula|coxal|mano|pie|rotula)_/.test(b.id) && !['mandibula', 'esternon', 'sacro'].includes(b.id)) continue;
  const bx = ML.bbox(b.pos); const NS = 12; const sl = Array.from({ length: NS }, () => [0, 0, 0, 0]);
  for (let i = 0; i < b.pos.length; i += 3) { const k = Math.min(NS - 1, Math.floor((bx.mx[1] - b.pos[i + 1]) / (bx.mx[1] - bx.mn[1] + 1e-6) * NS)); sl[k][0] += b.pos[i]; sl[k][1] += b.pos[i + 1]; sl[k][2] += b.pos[i + 2]; sl[k][3]++; }
  anclas.huesos[b.id] = { mn: bx.mn, mx: bx.mx, eje: sl.map(s => s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : null) };
}
anclas.C = C;
fs.writeFileSync(path.join(RAW, 'anclas.json'), JSON.stringify(anclas));

// ───────────────────────────── escritura
async function writeGLB(file, parts) {
  const doc = new Document();
  const buf = doc.createBuffer();
  const scene = doc.createScene('escena');
  const mat = doc.createMaterial('m').setBaseColorFactor([0.9, 0.8, 0.75, 1]).setRoughnessFactor(0.7).setMetallicFactor(0);
  for (const p of parts) {
    const pos = toApp(p.pos);
    const prim = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(ML.normals(pos, p.idx)).setBuffer(buf))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(p.idx).setBuffer(buf))
      .setMaterial(mat);
    scene.addChild(doc.createNode(p.id).setMesh(doc.createMesh(p.id).addPrimitive(prim)));
    p.app = pos;
  }
  await doc.transform(reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 8 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  await io.write(file, doc);
  return fs.statSync(file).size;
}
const manifest = (parts) => Object.fromEntries(parts.map(p => { const b = ML.bbox(p.app); return [p.id, { c: ML.centroid(p.app, p.idx).map(v => +v.toFixed(3)), mn: b.mn.map(v => +v.toFixed(2)), mx: b.mx.map(v => +v.toFixed(2)), t: p.idx.length / 3, ...(p.g ? { g: p.g } : {}) }]; }));

const only = process.argv[2];
if (!only || only === 'encefalo') {
  const s1 = await writeGLB(path.join(OUT, 'encefalo.glb'), brain);
  fs.writeFileSync(path.join(OUT, 'encefalo.json'), JSON.stringify(manifest(brain)));
  console.log('encefalo.glb', (s1 / 1e6).toFixed(2), 'MB,', brain.length, 'mallas,', brain.reduce((s, p) => s + p.idx.length / 3, 0), 'tri');
}
if (!only || only === 'cuerpo') {
  const s2 = await writeGLB(path.join(OUT, 'cuerpo.glb'), body);
  fs.writeFileSync(path.join(OUT, 'cuerpo.json'), JSON.stringify(manifest(body)));
  console.log('cuerpo.glb', (s2 / 1e6).toFixed(2), 'MB,', body.length, 'mallas,', body.reduce((s, p) => s + p.idx.length / 3, 0), 'tri');
  const g = {}; for (const b of body) { (g[b.g] ||= [0, 0]); g[b.g][0]++; g[b.g][1] += b.idx.length / 3; } console.log(g);
}
