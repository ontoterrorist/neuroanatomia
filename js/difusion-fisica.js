// Física del simulador de difusión (sin DOM; se prueba en Node con tools/probar-imagen.mjs).
// Fuentes: atenuación S = S0·exp(−b·D): Hornak cap. 13 (diffusion imaging); tensor, MD, FA y FACT: Soares 2013;
// los ejes del tensor son sus autovectores y las difusividades sus autovalores: Basser 1994. Detalle en docs/semestre-3/fuentes.md.
import { azar } from './imagen-fisica.js';

/** Valores de referencia leídos en Soares 2013: b ≈ 1000 s/mm², FA mínima de 0,1–0,3 y giro máximo de 40–70° entre pasos. */
export const SOARES = { b: 1000, faMin: [0.1, 0.3], giro: [40, 70] };

/** Tensor plano [Dxx, Dxy, Dyy] de una fibra con ángulo phi (rad) en el plano: difusividad Dpar a lo largo y Dperp a través. */
export function tensorFibra(Dpar, Dperp, phi) {
  const c = Math.cos(phi), s = Math.sin(phi);
  return [Dpar * c * c + Dperp * s * s, (Dpar - Dperp) * c * s, Dpar * s * s + Dperp * c * c];
}
/** Coeficiente de difusión aparente del tensor en la dirección del gradiente (ángulo th, rad): gᵀDg. */
export const adc = (T, th) => { const c = Math.cos(th), s = Math.sin(th); return T[0] * c * c + 2 * T[1] * c * s + T[2] * s * s; };
/** Atenuación de la señal con la difusión: S/S0 = exp(−b·D) (Hornak, cap. 13). b en s/mm², D en mm²/s. */
export const atenuacion = (b, D) => Math.exp(-b * D);

/** Autovalores y ángulo del eje principal de un tensor plano. l1 ≥ l2. */
export function autoplano(T) {
  const m = (T[0] + T[2]) / 2, r = Math.hypot((T[0] - T[2]) / 2, T[1]);
  return { l1: m + r, l2: m - r, phi: 0.5 * Math.atan2(2 * T[1], T[0] - T[2]) };
}
/** Difusividad media: promedio de los tres autovalores (Soares 2013). */
export const md = (l1, l2, l3) => (l1 + l2 + l3) / 3;
/** Anisotropía fraccional (Soares 2013): √(3/2)·√(Σ(λi − MD)²) / √(Σλi²). Los autovalores negativos (ruido) se llevan a 0. */
export function fa(l1, l2, l3) {
  const L = [l1, l2, l3].map(x => Math.max(0, x)), m = md(...L), s2 = L.reduce((a, x) => a + x * x, 0);
  return s2 ? Math.sqrt(1.5 * L.reduce((a, x) => a + (x - m) ** 2, 0) / s2) : 0;
}

/** Direcciones de gradiente en el plano, repartidas de forma uniforme en [0, π). */
export const direcciones = (n) => Array.from({ length: n }, (_, k) => k * Math.PI / n);

/** Señal de un vóxel con compartimentos [{w, T}] (varias fibras) para un gradiente a ángulo th: Σ w·exp(−b·ADC). */
export const senalVoxel = (comps, b, th) => comps.reduce((a, c) => a + c.w * atenuacion(b, adc(c.T, th)), 0);
/** Magnitud con ruido gaussiano complejo (distribución de Rice) de desviación sigma. */
const rice = (s, sigma, rng) => Math.hypot(s + sigma * rng.n(), sigma * rng.n());

/** Ajuste por mínimos cuadrados del tensor plano a partir de la señal medida en cada dirección y de la imagen sin gradiente (S0). */
export function ajustar(S, S0, dirs, b) {
  const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], y = [0, 0, 0];
  dirs.forEach((th, k) => {
    const c = Math.cos(th), s = Math.sin(th), f = [c * c, 2 * c * s, s * s];
    const d = -Math.log(Math.max(S[k], 1e-6) / Math.max(S0, 1e-6)) / b;
    for (let i = 0; i < 3; i++) { y[i] += f[i] * d; for (let j = 0; j < 3; j++) A[i][j] += f[i] * f[j]; }
  });
  return resolver3(A, y);
}
function resolver3(A, y) {
  const det = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  const d = det(A); if (!d) return [0, 0, 0];
  return [0, 1, 2].map(k => det(A.map((fila, i) => fila.map((v, j) => (j === k ? y[i] : v)))) / d);
}

/** Campo sintético n×n: un haz en arco (fibras tangentes al arco), opcionalmente cruzado por un haz vertical, sobre fondo isotrópico.
 *  Cada vóxel: { comps: [{w, T}], haz: 0|1|2|3 (0 = fondo, 1 = arco, 2 = vertical, 3 = cruce), phi: ángulo verdadero del haz principal, ejes: todos los ángulos verdaderos }. */
export function campo(n, { Dpar, Dperp, Diso, cruce }) {
  const cx = n / 2, cy = n * 1.0, R = n * 0.5, ancho = n * 0.11, mitad = n * 0.07;
  const iso = tensorFibra(Diso, Diso, 0), V = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
    const x = i + 0.5 - cx, y = j + 0.5 - cy, r = Math.hypot(x, y);
    const enArco = Math.abs(r - R) < ancho && j + 0.5 < cy - 0.05 * n;
    const enVert = cruce && Math.abs(x) < mitad && j > 0.08 * n && j < 0.78 * n;
    const tang = Math.atan2(-x, y);                             // eje tangente al círculo (perpendicular al radio)
    const tArco = tensorFibra(Dpar, Dperp, tang), tVert = tensorFibra(Dpar, Dperp, Math.PI / 2);
    if (enArco && enVert) V.push({ comps: [{ w: 0.5, T: tArco }, { w: 0.5, T: tVert }], haz: 3, phi: tang, ejes: [tang, Math.PI / 2] });
    else if (enArco) V.push({ comps: [{ w: 1, T: tArco }], haz: 1, phi: tang, ejes: [tang] });
    else if (enVert) V.push({ comps: [{ w: 1, T: tVert }], haz: 2, phi: Math.PI / 2, ejes: [Math.PI / 2] });
    else V.push({ comps: [{ w: 1, T: iso }], haz: 0, phi: 0, ejes: [] });
  }
  return V;
}

/** «Escanea» el campo: mide cada vóxel con b0 y N direcciones (con ruido de Rice de relación señal/ruido snr en b0) y ajusta un tensor por vóxel. */
export function escanear(V, { b, nDir, snr, semilla = 1 }) {
  const rng = azar(semilla), dirs = direcciones(nDir), sigma = snr > 0 ? 1 / snr : 0;
  return V.map(v => {
    const S0 = rice(1, sigma, rng), S = dirs.map(th => rice(senalVoxel(v.comps, b, th), sigma, rng));
    const [xx, xy, yy] = ajustar(S, S0, dirs, b), e = autoplano([xx, xy, yy]);
    return { D: [xx, xy, yy], l1: e.l1, l2: e.l2, phi: e.phi, md: md(e.l1, e.l2, e.l2), fa: fa(e.l1, e.l2, e.l2), S, S0 };
  });
}

/** Ángulo (0–90°) entre dos ejes dados como ángulos phi (los ejes no tienen sentido). */
export function giroEntre(p, q) { let d = Math.abs(p - q) % Math.PI; if (d > Math.PI / 2) d = Math.PI - d; return d * 180 / Math.PI; }

/** Trayectoria determinista tipo FACT (Soares 2013; Mori 1999): la orientación es la del eje principal de cada vóxel y cambia de golpe en su borde.
 *  Desde la semilla (x, y en unidades de vóxel) avanza en ambos sentidos; se detiene si entra en un vóxel con FA < faMin o si el eje gira más de giroMax grados. */
export function seguir(M, n, semilla, { faMin, giroMax, paso = 0.05, maxPasos = 4000 }) {
  const vox = (x, y) => (x < 0 || y < 0 || x >= n || y >= n) ? null : M[Math.floor(y) * n + Math.floor(x)];
  const lado = (sentido) => {
    const pts = []; let [x, y] = semilla, v = vox(x, y);
    if (!v || v.fa < faMin) return { pts, motivo: 'semilla' };
    let phi = v.phi, dx = sentido * Math.cos(phi), dy = sentido * Math.sin(phi);
    for (let k = 0; k < maxPasos; k++) {
      x += dx * paso; y += dy * paso;
      const w = vox(x, y);
      if (!w) return { pts, motivo: 'borde' };
      if (w !== v) {
        if (w.fa < faMin) return { pts, motivo: 'fa' };
        if (giroEntre(phi, w.phi) > giroMax) return { pts, motivo: 'giro' };
        let ex = Math.cos(w.phi), ey = Math.sin(w.phi); if (ex * dx + ey * dy < 0) { ex = -ex; ey = -ey; }
        dx = ex; dy = ey; phi = w.phi; v = w;
      }
      pts.push([x, y]);
    }
    return { pts, motivo: 'largo' };
  };
  const a = lado(1), b = lado(-1);
  return { pts: [...b.pts.reverse(), semilla, ...a.pts], motivos: [b.motivo, a.motivo] };
}
