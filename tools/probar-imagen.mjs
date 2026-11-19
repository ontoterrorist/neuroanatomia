// Pruebas numéricas de js/imagen-fisica.js. Uso: node tools/probar-imagen.mjs
import { senal, tiNulo, fft2, hrf, regresor, glm, pT, tCrit, azar } from '../js/imagen-fisica.js';
import { TEJIDOS, params } from '../data/neuroimagen.js';
import { tensorFibra, adc, atenuacion, autoplano, md, fa, direcciones, senalVoxel, ajustar, campo, escanear, seguir, giroEntre } from '../js/difusion-fisica.js';

let mal = 0;
const ok = (txt, c) => { console.log(c ? 'ok ' : 'MAL', txt); if (!c) mal++; };
const casi = (a, b, tol) => Math.abs(a - b) <= tol;

// 1. Contraste: en T1 la blanca brilla más que la gris y el LCR es oscuro; en T2, al revés (Hornak, cap. 10)
for (const B0 of ['1.5', '3']) {
  const t1 = { sec: 'se', TR: 500, TE: 10 }, t2 = { sec: 'se', TR: 4000, TE: 100 };
  ok(`${B0} T: T1 sb > sg > lcr`, senal('sb', B0, t1) > senal('sg', B0, t1) && senal('sg', B0, t1) > senal('lcr', B0, t1));
  ok(`${B0} T: T2 lcr > sg > sb`, senal('lcr', B0, t2) > senal('sg', B0, t2) && senal('sg', B0, t2) > senal('sb', B0, t2));
  for (const tej of ['lcr', 'grasa']) {
    const TR = 9000, TI = tiNulo(tej, B0, TR);
    ok(`${B0} T: TI = ${TI.toFixed(0)} ms anula ${tej}`, casi(senal(tej, B0, { sec: 'ir', TR, TI, TE: 30 }), 0, 1e-9));
  }
}
// 1b. Eco de gradiente: con T2* < T2 (Oros-Peusquens 2019 frente a West 2013) pierde más señal que el eco de espín; sin T2* usa T2
{
  const se = { sec: 'se', TR: 2000, TE: 30 }, ge = { ...se, sec: 'ge' };
  for (const tej of ['sg', 'sb']) ok(`3 T: T2* < T2 → GE < SE en ${tej}`, senal(tej, '3', ge) < senal(tej, '3', se));
  ok('3 T: sin T2* (LCR) GE = SE', casi(senal('lcr', '3', ge), senal('lcr', '3', se), 1e-12));
  ok('GE con TE 0 = SE con TE 0', casi(senal('sg', '3', { ...ge, TE: 0 }), senal('sg', '3', { ...se, TE: 0 }), 1e-12));
  ok('T2* publicados: sb 50,0 y sg 55,7 ms', params('sb', '3').T2s === 50 && params('sg', '3').T2s === 55.7);
}
// con TR ≫ T1 el TI nulo tiende a T1·ln 2
const p = params('lcr', '3'); ok('TI nulo → T1·ln2 si TR → ∞', casi(tiNulo('lcr', '3', 1e9), p.T1 * Math.LN2, 1e-6));

// 2. FFT: ida y vuelta, y Parseval
{
  const n = 64, r = azar(3), re = new Float64Array(n * n), im = new Float64Array(n * n);
  for (let i = 0; i < n * n; i++) re[i] = r.u();
  const orig = re.slice(), e0 = orig.reduce((s, v) => s + v * v, 0);
  fft2(re, im, n); const e1 = re.reduce((s, v, i) => s + v * v + im[i] * im[i], 0) / (n * n);
  fft2(re, im, n, true);
  ok('FFT ida y vuelta', orig.every((v, i) => casi(v, re[i], 1e-9)));
  ok('Parseval', casi(e0, e1, 1e-6 * e0));
  // la componente continua queda en el centro de k
  const u = new Float64Array(n * n).fill(1), z = new Float64Array(n * n); fft2(u, z, n);
  ok('DC en el centro', casi(Math.hypot(u[(n / 2) * n + n / 2], z[(n / 2) * n + n / 2]), n * n, 1e-6));
}

// 3. HRF de SPM: suma 1 y pico «alrededor de 5 s» (comentario de spm_hrf.m)
{
  const dt = 0.1, k = hrf(dt), s = k.reduce((a, b) => a + b, 0); let im = 0; k.forEach((v, i) => { if (v > k[im]) im = i; });
  ok(`HRF suma ${s.toFixed(6)}`, casi(s, 1, 1e-9));
  ok(`HRF pico en ${(im * dt).toFixed(1)} s`, im * dt > 4.5 && im * dt < 5.5);
  ok('HRF con rebote negativo', Math.min(...k) < 0);
}

// 4. GLM: recupera β conocidos y la t es grande con señal y ~0 sin ella
{
  const TR = 2, nV = 120, dt = 0.1, est = new Float64Array(nV * TR / dt);
  for (let i = 0; i < est.length; i++) est[i] = Math.floor(i * dt / 20) % 2;
  const x = regresor(est, dt, TR, nV), uno = new Float64Array(nV).fill(1), lin = Float64Array.from({ length: nV }, (_, i) => i / nV - 0.5);
  const G = glm([x, uno, lin], [1, 0, 0]), r = azar(9);
  const y = Float64Array.from({ length: nV }, (_, i) => 100 + 2 * x[i] + 3 * lin[i] + 0.5 * r.n());
  const a = G.ajustar(y);
  ok(`β = [${a.b.map(v => v.toFixed(2))}] ≈ [2, 100, 3]`, casi(a.b[0], 2, 0.3) && casi(a.b[1], 100, 0.3) && casi(a.b[2], 3, 0.6));
  ok(`t con señal = ${a.t.toFixed(1)}`, a.t > 10);
  const y0 = Float64Array.from({ length: nV }, () => 100 + 0.5 * r.n());
  ok(`t sin señal = ${G.ajustar(y0).t.toFixed(2)}`, Math.abs(G.ajustar(y0).t) < 4);
  ok(`gl = ${G.gl}`, G.gl === nV - 3);
}

// 5. t de Student: simetría, límite normal y umbral
ok('P(T>0) = 0,5', casi(pT(0, 10), 0.5, 1e-12));
ok('P(T>1,96), gl grande ≈ 0,025', casi(pT(1.959964, 1e6), 0.025, 1e-4));
ok('tCrit invierte pT', casi(pT(tCrit(0.001, 97), 97), 0.001, 1e-9));

// 6. Todos los tejidos con parámetros dan señal finita
for (const k of Object.keys(TEJIDOS)) ok(`señal finita: ${k}`, Number.isFinite(senal(k, '3', { sec: 'se', TR: 500, TE: 10 })));

// 7. Difusión: tensor, atenuación, MD, FA, ajuste y trayectorias (Hornak cap. 13; Soares 2013; Basser 1994)
{
  const Dp = 1.5e-3, Dq = 0.4e-3, phi = 0.7, T = tensorFibra(Dp, Dq, phi), e = autoplano(T);
  ok('ADC a lo largo de la fibra = D∥', casi(adc(T, phi), Dp, 1e-12));
  ok('ADC perpendicular a la fibra = D⊥', casi(adc(T, phi + Math.PI / 2), Dq, 1e-12));
  ok('autovalores = D∥ y D⊥', casi(e.l1, Dp, 1e-12) && casi(e.l2, Dq, 1e-12) && casi(giroEntre(e.phi, phi), 0, 1e-6));
  ok('S/S0 = 1 con b = 0 y exp(−1) con bD = 1', atenuacion(0, Dp) === 1 && casi(atenuacion(1000, 1e-3), Math.exp(-1), 1e-12));
  ok('MD = promedio de los autovalores', casi(md(3, 2, 1), 2, 1e-12));
  ok('FA = 0 si es isotrópico y 1 si solo hay un autovalor', fa(1, 1, 1) === 0 && casi(fa(1, 0, 0), 1, 1e-12));
  ok('FA con (D∥, D⊥, D⊥) entre 0 y 1', fa(Dp, Dq, Dq) > 0 && fa(Dp, Dq, Dq) < 1);
  const dirs = direcciones(9), S = dirs.map(th => atenuacion(1000, adc(T, th))), D = ajustar(S, 1, dirs, 1000);
  ok('el ajuste sin ruido recupera el tensor', D.every((v, i) => casi(v, T[i], 1e-9)));
  const cruz = [{ w: 0.5, T }, { w: 0.5, T: tensorFibra(Dp, Dq, phi + Math.PI / 2) }];
  const Sc = dirs.map(th => senalVoxel(cruz, 1000, th)), Dc = ajustar(Sc, 1, dirs, 1000), ec = autoplano(Dc);
  ok(`un cruce de fibras baja la FA (${fa(ec.l1, ec.l2, ec.l2).toFixed(2)} < ${fa(Dp, Dq, Dq).toFixed(2)})`, fa(ec.l1, ec.l2, ec.l2) < 0.5 * fa(Dp, Dq, Dq));
  const n = 24, V = campo(n, { Dpar: Dp, Dperp: Dq, Diso: 0.8e-3, cruce: false }), lim = { faMin: 0.2, giroMax: 45 };
  const M0 = escanear(V, { b: 1000, nDir: 12, snr: 0, semilla: 4 });
  ok('sin ruido el eje ajustado coincide con el verdadero en el haz', V.every((v, i) => v.haz !== 1 || giroEntre(M0[i].phi, v.phi) < 0.01));
  ok('FA del haz alta y del fondo ~0', M0.every((m, i) => V[i].haz === 1 ? m.fa > 0.6 : V[i].haz === 0 ? m.fa < 0.01 : true));
  // semilla en el centro del haz (el vóxel de la columna 1 cuyo radio se acerca más al del arco)
  const semilla = (() => { let mejor = [0, 1e9]; V.forEach((v, k) => { if (v.haz !== 1 || k % n !== 1) return; const d = Math.abs(Math.hypot(k % n + 0.5 - n / 2, Math.floor(k / n) + 0.5 - n) - n / 2); if (d < mejor[1]) mejor = [k, d]; }); return [mejor[0] % n + 0.5, Math.floor(mejor[0] / n) + 0.5]; })();
  const tr = seguir(M0, n, semilla, lim), fin = tr.pts.at(-1), ini = tr.pts[0];
  ok(`sin ruido la trayectoria cruza el arco (x de ${ini[0].toFixed(1)} a ${fin[0].toFixed(1)})`, Math.min(ini[0], fin[0]) < 2 && Math.max(ini[0], fin[0]) > n - 3);
  ok('FA mínima mayor que la del haz detiene la trayectoria en la semilla', seguir(M0, n, semilla, { ...lim, faMin: 0.99 }).pts.length === 1);
  const Mr = escanear(V, { b: 1000, nDir: 12, snr: 12, semilla: 4 }), Mr2 = escanear(V, { b: 1000, nDir: 12, snr: 12, semilla: 4 });
  ok('el ruido es reproducible con la misma semilla', Mr.every((m, i) => m.fa === Mr2[i].fa));
  const Mf = escanear(V, { b: 1000, nDir: 12, snr: 12, semilla: 5 });
  ok('el ruido cambia la FA del fondo (sube por el sesgo de los autovalores)', Mf.some((m, i) => V[i].haz === 0 && m.fa > 0.02));
  // un giro brusco de 60° entre vecinos: se corta con 45° y pasa con 70°
  const L = Array.from({ length: 8 * 8 }, (_, i) => ({ fa: 0.8, phi: (i % 8) < 4 ? 0 : Math.PI / 3 }));
  ok('el umbral de giro corta (45°) o deja pasar (70°) un cambio de 60°', seguir(L, 8, [0.5, 4.5], { faMin: 0.2, giroMax: 45 }).pts.at(-1)[0] < 4.2 && seguir(L, 8, [0.5, 4.5], { faMin: 0.2, giroMax: 70 }).pts.length > 80);
}

console.log(mal ? `${mal} fallos` : 'todo bien');
process.exit(mal ? 1 : 0);
