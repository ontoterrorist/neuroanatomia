// Calcula la transformación afín que lleva el encéfalo del atlas Allen (HRA) al espacio
// del cuerpo de BodyParts3D, usando centroides de estructuras homólogas.
// Convención común: (x = izquierda, y = arriba, z = anterior), en mm.
// Modelo simétrico: x' = sx·x + tx ; (y',z') = A·(y,z) + t   (sin acoplar x con y,z).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeIO } from '@gltf-transform/core';
import * as ML from './meshlib.mjs';
import { nombreAllen } from './allen-fix.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RAW = path.join(ROOT, 'raw');
const idx = JSON.parse(fs.readFileSync(path.join(RAW, 'bp3d-index.json'), 'utf8'));

export function loadBP(fj) {
  const m = ML.parseOBJ(fs.readFileSync(path.join(RAW, 'bp3d-isa', 'isa_BP3D_4.0_obj_99', fj + '.obj'), 'utf8'));
  // (x izq, y post, z arriba) -> (x izq, y arriba, z ant)
  const p = m.pos;
  for (let i = 0; i < p.length; i += 3) { const y = p[i + 1], z = p[i + 2]; p[i + 1] = z; p[i + 2] = -y; }
  return m;
}
export function bpByName(rx) {
  return Object.entries(idx).filter(([, v]) => v.n && rx.test(v.n)).map(([fj]) => fj);
}

async function allenParts() {
  const doc = await new NodeIO().read(path.join(RAW, 'hra', '3d-allen-m-brain.glb'));
  const out = {};
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue;
    const prim = mesh.listPrimitives()[0];
    const pos = Float32Array.from(prim.getAttribute('POSITION').getArray(), v => v * 1000);
    const idxA = Uint32Array.from(prim.getIndices().getArray());
    const name = nombreAllen(node.getName());
    const c = ML.centroid(pos, idxA);
    const side = name === 'optic_chiasm' ? 'M' : (c[0] > 0 ? 'L' : 'R');
    (out[name + '|' + side] ||= []).push({ pos, idx: idxA });
  }
  return out;
}

const PAIRS = [ // [regex Allen, regex BP3D (con Left/Right)]
  [/^(putamen|posteroventral_putamen)$/, 'putamen'],
  [/^(head|body|tail)_of_caudate$/, 'caudate nucleus'],
  [/segment_of_globus_pallidus$/, 'globus pallidus'],
  [/^(head|body|tail)_of_hippocampus$/, 'hippocampus'],
  [/^(amygdaloid_complex|lateral_nucleus|basolateral.*|basomedial.*|central_nuclear_group)$/, 'amygdala'],
  [/^superior_colliculus$/, 'superior colliculus'],
  [/^inferior_colliculus$/, 'inferior colliculus'],
  [/^primary_motor_cortex$/, 'precentral gyrus'],
  [/^postcentral_gyrus$/, 'postcentral gyrus'],
  [/^middle_frontal_gyrus$/, 'middle frontal gyrus'],
  [/^supramarginal_gyrus$/, 'supramarginal gyrus'],
  [/^angular_gyrus$/, 'angular gyrus'],
  [/^middle_temporal_gyrus$/, 'middle temporal gyrus'],
  [/^inferior_temporal_gyrus$/, 'inferior temporal gyrus'],
  [/^(short|long)_insular_gyri$/, 'insula'],
  [/lateral_ventricle$/, 'lateral ventricle'],
  [/^(thalamus|.*_of_thalamus|ventral_posterior.*|.*geniculate.*)$/, 'thalamus'],
];

function solve(A, b) { // mínimos cuadrados por ecuaciones normales (n pequeño)
  const n = A[0].length;
  const M = Array.from({ length: n }, () => new Float64Array(n + 1));
  for (let r = 0; r < A.length; r++) for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) M[i][j] += A[r][i] * A[r][j];
    M[i][n] += A[r][i] * b[r];
  }
  for (let i = 0; i < n; i++) {
    let p = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[p][i])) p = k;
    [M[i], M[p]] = [M[p], M[i]];
    for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; }
  }
  return M.map((r, i) => r[n] / r[i]);
}

export async function registro(verbose = false) {
  const al = await allenParts();
  const src = [], dst = [], names = [];
  for (const [rxA, bpName] of PAIRS) for (const side of ['L', 'R']) {
    const parts = Object.entries(al).filter(([k]) => k.endsWith('|' + side) && rxA.test(k.split('|')[0])).flatMap(([, v]) => v);
    const fjs = bpByName(new RegExp('^' + (side === 'L' ? 'Left ' : 'Right ') + bpName + '$', 'i'));
    if (!parts.length || !fjs.length) { if (verbose) console.log('  sin par:', bpName, side, parts.length, fjs.length); continue; }
    const a = ML.merge(parts), b = ML.merge(fjs.map(loadBP));
    src.push(ML.centroid(a.pos, a.idx)); dst.push(ML.centroid(b.pos, b.idx)); names.push(bpName + ' ' + side);
  }
  // x
  const [sx, tx] = solve(src.map(s => [s[0], 1]), dst.map(d => d[0]));
  // (y,z)
  const [a11, a12, ty] = solve(src.map(s => [s[1], s[2], 1]), dst.map(d => d[1]));
  const [a21, a22, tz] = solve(src.map(s => [s[1], s[2], 1]), dst.map(d => d[2]));
  let M = [sx, 0, 0, tx, 0, a11, a12, ty, 0, a21, a22, tz];
  const M0 = M;
  // Ajuste fino de tamaño: la caja del encéfalo Allen se lleva a la del encéfalo de BodyParts3D
  // (ancho y largo completos; en altura se hace coincidir el vértice, con escala media).
  {
    const allA = ML.merge(Object.values(al).flat());
    const bA = ML.bbox(ML.applyAffine(allA.pos, allA.idx, M).pos);
    const bpBrain = bpByName(/(gyrus|occipital lobe|Cerebellum|superior parietal lobule)/i).filter(f => !/nerve/i.test(idx[f].n));
    const bB = ML.bbox(ML.merge(bpBrain.map(loadBP)).pos);
    const kx = (bB.mx[0] - bB.mn[0] - 2) / (bA.mx[0] - bA.mn[0]);
    const kz = (bB.mx[2] - bB.mn[2] - 2) / (bA.mx[2] - bA.mn[2]);
    const ky = (kx + kz) / 2;
    const ox = (bB.mx[0] + bB.mn[0]) / 2 - kx * (bA.mx[0] + bA.mn[0]) / 2;
    const oz = (bB.mx[2] + bB.mn[2]) / 2 - kz * (bA.mx[2] + bA.mn[2]) / 2;
    const oy = (bB.mx[1] - 1) - ky * bA.mx[1];
    M = [kx * M[0], 0, 0, kx * M[3] + ox, 0, ky * M[5], ky * M[6], ky * M[7] + oy, 0, kz * M[9], kz * M[10], kz * M[11] + oz];
    if (verbose) console.log('ajuste de caja: kx', kx.toFixed(3), 'ky', ky.toFixed(3), 'kz', kz.toFixed(3));
  }
  if (verbose) {
    let e2 = 0;
    src.forEach((s, i) => {
      const p = [M0[0] * s[0] + M0[3], a11 * s[1] + a12 * s[2] + ty, a21 * s[1] + a22 * s[2] + tz];
      const e = Math.hypot(p[0] - dst[i][0], p[1] - dst[i][1], p[2] - dst[i][2]); e2 += e * e;
      console.log('  ', names[i].padEnd(28), e.toFixed(1), 'mm');
    });
    console.log('RMS', Math.sqrt(e2 / src.length).toFixed(2), 'mm ·', src.length, 'pares');
    console.log('M', M.map(v => +v.toFixed(4)));
    const rot = Math.atan2(a21, a11) * 180 / Math.PI;
    console.log('escala x', sx.toFixed(3), ' escalas yz', Math.hypot(a11, a21).toFixed(3), Math.hypot(a12, a22).toFixed(3), ' inclinación', rot.toFixed(1), '°');
    // cajas: encéfalo Allen transformado vs encéfalo BP3D
    const allA = ML.merge(Object.values(al).flat());
    const tA = ML.applyAffine(allA.pos, allA.idx, M);
    const bA = ML.bbox(tA.pos);
    const bpBrain = bpByName(/(gyrus|occipital lobe|Cerebellum|Medulla oblongata|^Pons|superior parietal lobule)/i).filter(f => !/nerve/i.test(idx[f].n));
    const bB = ML.bbox(ML.merge(bpBrain.map(loadBP)).pos);
    console.log('caja Allen→BP3D', bA.mn.map(v => v.toFixed(0)), bA.mx.map(v => v.toFixed(0)));
    console.log('caja encéfalo BP3D', bB.mn.map(v => v.toFixed(0)), bB.mx.map(v => v.toFixed(0)));
  }
  return M;
}

if (process.argv[1] && process.argv[1].endsWith('registro.mjs')) {
  const M = await registro(true);
  fs.writeFileSync(path.join(RAW, 'registro.json'), JSON.stringify(M));
}
