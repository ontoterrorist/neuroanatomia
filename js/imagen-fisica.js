// Física y estadística de los simuladores de neuroimagen. Sin DOM: se prueba en Node con tools/probar-imagen.mjs.
import { TEJIDOS, params, HRF_SPM } from '../data/neuroimagen.js';

// ───────────────────────────── señal de RM (Hornak, cap. 10)
/** Intensidad de un tejido con una secuencia. sec: 'se' (eco de espín) o 'ir' (inversión-recuperación 180-90-180, en magnitud). */
export function senal(tej, B0, s) {
  const t = TEJIDOS[tej];
  if (t.mezcla) return t.mezcla.reduce((a, k) => a + senal(k, B0, s), 0) / t.mezcla.length;
  const p = params(tej, B0); if (!p) return 0;
  const E1 = Math.exp(-s.TR / p.T1), E2 = Math.exp(-s.TE / p.T2);
  if (s.sec === 'ir') return p.PD * Math.abs(1 - 2 * Math.exp(-s.TI / p.T1) + E1) * E2;
  return p.PD * (1 - E1) * E2;
}
/** TI que anula un tejido en inversión-recuperación: 1 − 2e^(−TI/T1) + e^(−TR/T1) = 0. */
export function tiNulo(tej, B0, TR) {
  const p = params(tej, B0); return p.T1 * Math.log(2 / (1 + Math.exp(-TR / p.T1)));
}

// ───────────────────────────── volumen y cortes
/** Corte 2D de etiquetas. plano: 'axial' (y fijo), 'coronal' (z fijo), 'sagital' (x fijo); f en [0,1].
 *  Convención radiológica: el lado derecho del sujeto (x<0) a la izquierda de la imagen; arriba = anterior (axial) o superior. */
export function corte(V, plano, f) {
  const [NX, NY, NZ] = V.dim, L = V.lab;
  const at = (i, j, k) => L[i + NX * (j + NY * k)];
  if (plano === 'axial') { const j = Math.round(f * (NY - 1)); const w = NX, h = NZ, o = new Uint8Array(w * h); for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) o[r * w + c] = at(c, j, NZ - 1 - r); return { w, h, d: o }; }
  if (plano === 'coronal') { const k = Math.round(f * (NZ - 1)); const w = NX, h = NY, o = new Uint8Array(w * h); for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) o[r * w + c] = at(c, NY - 1 - r, k); return { w, h, d: o }; }
  const i = Math.round(f * (NX - 1)); const w = NZ, h = NY, o = new Uint8Array(w * h);
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) o[r * w + c] = at(i, NY - 1 - r, NZ - 1 - c);
  return { w, h, d: o };
}

/** Imagen de magnitud (Float32, tamaño n×n, centrada) de un corte de etiquetas con una secuencia. */
export function imagen(C, tabla, n = 256) {
  const o = new Float32Array(n * n), ox = Math.floor((n - C.w) / 2), oy = Math.floor((n - C.h) / 2);
  for (let r = 0; r < C.h; r++) for (let c = 0; c < C.w; c++) {
    const y = r + oy, x = c + ox; if (x < 0 || y < 0 || x >= n || y >= n) continue;
    o[y * n + x] = tabla[C.d[r * C.w + c]];
  }
  return o;
}

/** Generador pseudoaleatorio reproducible y normal estándar (Box-Muller). */
export function azar(semilla = 1) {
  let s = semilla >>> 0 || 1;
  const u = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return (s + 0.5) / 4294967296; };
  return { u, n: () => Math.sqrt(-2 * Math.log(u())) * Math.cos(2 * Math.PI * u()) };
}

// ───────────────────────────── transformada de Fourier 2D (radix 2, en sitio)
function fft1(re, im, inv) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = (inv ? 2 : -2) * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const p = i + k, q = p + len / 2, tr = re[q] * cr - im[q] * ci, ti = re[q] * ci + im[q] * cr;
        re[q] = re[p] - tr; im[q] = im[p] - ti; re[p] += tr; im[p] += ti;
        const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t;
      }
    }
  }
  if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
}
/** FFT 2D de una matriz n×n (re, im Float64Array). inv = transformada inversa. Con el centro de k en (n/2, n/2). */
export function fft2(re, im, n, inv = false) {
  const r = new Float64Array(n), i = new Float64Array(n);
  const desplaza = () => { for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if ((x + y) & 1) { re[y * n + x] = -re[y * n + x]; im[y * n + x] = -im[y * n + x]; } };
  desplaza();   // multiplicar por (−1)^(x+y) centra el espectro
  for (let y = 0; y < n; y++) { for (let x = 0; x < n; x++) { r[x] = re[y * n + x]; i[x] = im[y * n + x]; } fft1(r, i, inv); for (let x = 0; x < n; x++) { re[y * n + x] = r[x]; im[y * n + x] = i[x]; } }
  for (let x = 0; x < n; x++) { for (let y = 0; y < n; y++) { r[y] = re[y * n + x]; i[y] = im[y * n + x]; } fft1(r, i, inv); for (let y = 0; y < n; y++) { re[y * n + x] = r[y]; im[y * n + x] = i[y]; } }
  desplaza();
}

// ───────────────────────────── HRF y modelo lineal general
function lgamma(x) {   // Lanczos
  const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  x -= 1; let a = c[0]; const t = x + g + 0.5; for (let i = 1; i < g + 2; i++) a += c[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}
const gpdf = (t, forma, escala) => t <= 0 ? 0 : Math.exp((forma - 1) * Math.log(t) - t / escala - lgamma(forma) - forma * Math.log(escala));
/** HRF canónica de SPM muestreada cada dt segundos, normalizada a suma 1 (como spm_hrf.m). */
export function hrf(dt, P = HRF_SPM) {
  const n = Math.floor(P.largo / dt) + 1, o = new Float64Array(n); let s = 0;
  for (let i = 0; i < n; i++) { const t = i * dt; o[i] = gpdf(t, P.p1 / P.d1, P.d1) - gpdf(t, P.p2 / P.d2, P.d2) / P.razon; s += o[i]; }
  for (let i = 0; i < n; i++) o[i] /= s;
  return o;
}
/** Regresor: estímulo (función de 0 y 1 en una rejilla fina dt) convolucionado con la HRF y muestreado cada TR. Pico normalizado a 1. */
export function regresor(estim, dt, TR, nVol, conHRF = true) {
  const k = conHRF ? hrf(dt) : Float64Array.of(1), n = estim.length, c = new Float64Array(n);
  for (let i = 0; i < n; i++) { if (!estim[i]) continue; for (let j = 0; j < k.length && i + j < n; j++) c[i + j] += estim[i] * k[j]; }
  const o = new Float64Array(nVol), paso = Math.round(TR / dt);
  for (let v = 0; v < nVol; v++) o[v] = c[Math.min(n - 1, v * paso)];
  let mx = 0; for (const x of o) mx = Math.max(mx, Math.abs(x)); if (mx) for (let v = 0; v < nVol; v++) o[v] /= mx;
  return o;
}
/** Inversa de una matriz simétrica pequeña (Gauss-Jordan). */
function inversa(A, p) {
  const M = A.map((r, i) => [...r, ...Array.from({ length: p }, (_, j) => +(i === j))]);
  for (let c = 0; c < p; c++) {
    let piv = c; for (let r = c + 1; r < p; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]]; const d = M[c][c]; if (Math.abs(d) < 1e-12) throw new Error('matriz de diseño singular');
    for (let j = 0; j < 2 * p; j++) M[c][j] /= d;
    for (let r = 0; r < p; r++) if (r !== c) { const f = M[r][c]; for (let j = 0; j < 2 * p; j++) M[r][j] -= f * M[c][j]; }
  }
  return M.map(r => r.slice(p));
}
/** Prepara el ajuste por mínimos cuadrados de Y = Xβ + e (columnas de X: arreglos de largo n). Contraste c sobre β. */
export function glm(X, c) {
  const p = X.length, n = X[0].length;
  const XtX = Array.from({ length: p }, (_, a) => Array.from({ length: p }, (_, b) => { let s = 0; for (let i = 0; i < n; i++) s += X[a][i] * X[b][i]; return s; }));
  const iX = inversa(XtX, p);
  const cVc = c.reduce((s, ca, a) => s + c.reduce((t, cb, b) => t + ca * iX[a][b] * cb, 0), 0);
  const gl = n - p;
  return {
    gl,
    /** Ajusta una serie y. Devuelve β, t, varianza residual y la serie ajustada. */
    ajustar(y) {
      const Xty = X.map(col => { let s = 0; for (let i = 0; i < n; i++) s += col[i] * y[i]; return s; });
      const b = iX.map(r => r.reduce((s, v, j) => s + v * Xty[j], 0));
      const fit = new Float64Array(n); let rss = 0;
      for (let i = 0; i < n; i++) { let f = 0; for (let a = 0; a < p; a++) f += b[a] * X[a][i]; fit[i] = f; rss += (y[i] - f) ** 2; }
      const s2 = rss / gl, cb = c.reduce((s, v, a) => s + v * b[a], 0);
      return { b, t: cb / Math.sqrt(s2 * cVc), s2, fit };
    },
  };
}

// t de Student: cola superior por la beta incompleta regularizada (fracción continua de Lentz)
function betacf(a, b, x) {
  const TINY = 1e-30; let c = 1, d = 1 - (a + b) * x / (a + 1); if (Math.abs(d) < TINY) d = TINY; d = 1 / d; let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m; let aa = m * (b - m) * x / ((a + m2 - 1) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY; d = 1 / d; h *= d * c;
    aa = -(a + m) * (a + b + m) * x / ((a + m2) * (a + m2 + 1));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY; c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY; d = 1 / d; const del = d * c; h *= del;
    if (Math.abs(del - 1) < 3e-14) break;
  }
  return h;
}
function ibeta(x, a, b) {
  if (x <= 0) return 0; if (x >= 1) return 1;
  const bt = Math.exp(lgamma(a + b) - lgamma(a) - lgamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
}
/** P(T > t) para una t de Student con gl grados de libertad. */
export function pT(t, gl) { const x = gl / (gl + t * t), q = 0.5 * ibeta(x, gl / 2, 0.5); return t >= 0 ? q : 1 - q; }
/** Umbral t para una p de una cola. */
export function tCrit(p, gl) { let lo = 0, hi = 60; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (pT(m, gl) > p) lo = m; else hi = m; } return (lo + hi) / 2; }
