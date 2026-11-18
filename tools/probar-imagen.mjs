// Pruebas numéricas de js/imagen-fisica.js. Uso: node tools/probar-imagen.mjs
import { senal, tiNulo, fft2, hrf, regresor, glm, pT, tCrit, azar } from '../js/imagen-fisica.js';
import { TEJIDOS, params } from '../data/neuroimagen.js';

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

console.log(mal ? `${mal} fallos` : 'todo bien');
process.exit(mal ? 1 : 0);
