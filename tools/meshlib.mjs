// Utilidades de malla para la construcción de los modelos (Node).
import { MeshoptSimplifier } from 'meshoptimizer';

/** Suelda vértices coincidentes. Devuelve {pos: Float32Array, idx: Uint32Array}. */
export function weld(pos, idx, tol = 1e-5) {
  const map = new Map();
  const remap = new Uint32Array(pos.length / 3);
  const out = [];
  const inv = 1 / tol;
  for (let i = 0; i < pos.length / 3; i++) {
    const x = pos[3 * i], y = pos[3 * i + 1], z = pos[3 * i + 2];
    const k = Math.round(x * inv) + '_' + Math.round(y * inv) + '_' + Math.round(z * inv);
    let j = map.get(k);
    if (j === undefined) { j = out.length / 3; map.set(k, j); out.push(x, y, z); }
    remap[i] = j;
  }
  const n = idx ? idx.length : pos.length / 3;
  const tri = [];
  for (let t = 0; t < n; t += 3) {
    const a = remap[idx ? idx[t] : t], b = remap[idx ? idx[t + 1] : t + 1], c = remap[idx ? idx[t + 2] : t + 2];
    if (a !== b && b !== c && a !== c) tri.push(a, b, c);
  }
  return { pos: new Float32Array(out), idx: new Uint32Array(tri) };
}

/** Suavizado de Taubin (sin encogimiento) sobre malla soldada. */
export function taubin(pos, idx, iters = 6, lambda = 0.5, mu = -0.53) {
  const n = pos.length / 3;
  const nb = Array.from({ length: n }, () => new Set());
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t], b = idx[t + 1], c = idx[t + 2];
    nb[a].add(b); nb[a].add(c); nb[b].add(a); nb[b].add(c); nb[c].add(a); nb[c].add(b);
  }
  const adj = nb.map(s => Uint32Array.from(s));
  let p = Float32Array.from(pos);
  const step = (f) => {
    const q = new Float32Array(p.length);
    for (let i = 0; i < n; i++) {
      const a = adj[i];
      if (!a.length) { q[3 * i] = p[3 * i]; q[3 * i + 1] = p[3 * i + 1]; q[3 * i + 2] = p[3 * i + 2]; continue; }
      let sx = 0, sy = 0, sz = 0;
      for (const j of a) { sx += p[3 * j]; sy += p[3 * j + 1]; sz += p[3 * j + 2]; }
      const k = 1 / a.length;
      q[3 * i] = p[3 * i] + f * (sx * k - p[3 * i]);
      q[3 * i + 1] = p[3 * i + 1] + f * (sy * k - p[3 * i + 1]);
      q[3 * i + 2] = p[3 * i + 2] + f * (sz * k - p[3 * i + 2]);
    }
    p = q;
  };
  for (let i = 0; i < iters; i++) { step(lambda); step(mu); }
  return p;
}

/** Simplifica hasta `ratio` de los triángulos (error relativo máx. `err`). */
export function simplify(pos, idx, ratio, err = 0.01) {
  if (ratio >= 0.999) return { pos, idx };
  const target = Math.max(12, Math.floor(idx.length * ratio / 3) * 3);
  const [ni] = MeshoptSimplifier.simplify(idx, pos, 3, target, err, ['LockBorder']);
  return compact(pos, ni);
}

/** Elimina vértices sin uso. */
export function compact(pos, idx) {
  const remap = new Int32Array(pos.length / 3).fill(-1);
  const out = [];
  const ni = new Uint32Array(idx.length);
  for (let i = 0; i < idx.length; i++) {
    const v = idx[i];
    if (remap[v] < 0) { remap[v] = out.length / 3; out.push(pos[3 * v], pos[3 * v + 1], pos[3 * v + 2]); }
    ni[i] = remap[v];
  }
  return { pos: new Float32Array(out), idx: ni };
}

/** Normales por vértice ponderadas por área. */
export function normals(pos, idx) {
  const nrm = new Float32Array(pos.length);
  for (let t = 0; t < idx.length; t += 3) {
    const a = 3 * idx[t], b = 3 * idx[t + 1], c = 3 * idx[t + 2];
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const k of [a, b, c]) { nrm[k] += nx; nrm[k + 1] += ny; nrm[k + 2] += nz; }
  }
  for (let i = 0; i < nrm.length; i += 3) {
    const l = Math.hypot(nrm[i], nrm[i + 1], nrm[i + 2]) || 1;
    nrm[i] /= l; nrm[i + 1] /= l; nrm[i + 2] /= l;
  }
  return nrm;
}

export function bbox(pos) {
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3) for (let k = 0; k < 3; k++) {
    const v = pos[i + k]; if (v < mn[k]) mn[k] = v; if (v > mx[k]) mx[k] = v;
  }
  return { mn, mx };
}

/** Centroide ponderado por área de la superficie. */
export function centroid(pos, idx) {
  let A = 0, cx = 0, cy = 0, cz = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const a = 3 * idx[t], b = 3 * idx[t + 1], c = 3 * idx[t + 2];
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const ar = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) / 2;
    A += ar;
    cx += ar * (pos[a] + pos[b] + pos[c]) / 3; cy += ar * (pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3; cz += ar * (pos[a + 2] + pos[b + 2] + pos[c + 2]) / 3;
  }
  return A ? [cx / A, cy / A, cz / A] : [0, 0, 0];
}

/** Aplica una matriz afín 3x4 (filas) a posiciones; invierte el sentido si det<0. */
export function applyAffine(pos, idx, M) {
  const out = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i], y = pos[i + 1], z = pos[i + 2];
    out[i] = M[0] * x + M[1] * y + M[2] * z + M[3];
    out[i + 1] = M[4] * x + M[5] * y + M[6] * z + M[7];
    out[i + 2] = M[8] * x + M[9] * y + M[10] * z + M[11];
  }
  const det = M[0] * (M[5] * M[10] - M[6] * M[9]) - M[1] * (M[4] * M[10] - M[6] * M[8]) + M[2] * (M[4] * M[9] - M[5] * M[8]);
  let ni = idx;
  if (det < 0) { ni = Uint32Array.from(idx); for (let t = 0; t < ni.length; t += 3) { const s = ni[t + 1]; ni[t + 1] = ni[t + 2]; ni[t + 2] = s; } }
  return { pos: out, idx: ni };
}

/** Une varias mallas en una. */
export function merge(list) {
  let nv = 0, ni = 0;
  for (const m of list) { nv += m.pos.length; ni += m.idx.length; }
  const pos = new Float32Array(nv), idx = new Uint32Array(ni);
  let ov = 0, oi = 0;
  for (const m of list) {
    pos.set(m.pos, ov);
    for (let i = 0; i < m.idx.length; i++) idx[oi + i] = m.idx[i] + ov / 3;
    ov += m.pos.length; oi += m.idx.length;
  }
  return { pos, idx };
}

/** Lee un .obj (solo v y f) -> {pos, idx}. */
export function parseOBJ(text) {
  const pos = [], idx = [];
  let i = 0;
  const n = text.length;
  while (i < n) {
    let e = text.indexOf('\n', i); if (e < 0) e = n;
    const c0 = text.charCodeAt(i), c1 = text.charCodeAt(i + 1);
    if (c0 === 118 && c1 === 32) { // "v "
      const p = text.slice(i + 2, e).trim().split(/\s+/);
      pos.push(+p[0], +p[1], +p[2]);
    } else if (c0 === 102 && c1 === 32) { // "f "
      const p = text.slice(i + 2, e).trim().split(/\s+/).map(s => parseInt(s, 10) - 1);
      for (let k = 1; k + 1 < p.length; k++) idx.push(p[0], p[k], p[k + 1]);
    }
    i = e + 1;
  }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx) };
}
