// Simulador de difusión: del tensor a la tractografía. Campo sintético de 24×24 vóxeles (el atlas no tiene orientación de fibras).
// La física está en js/difusion-fisica.js; los ayudantes de interfaz de js/imagen.js llegan por parámetro.
import { SOARES, adc, senalVoxel, direcciones, campo, escanear, seguir } from './difusion-fisica.js';

const N = 24, PX = 20, W = N * PX, K = 1e-3;              // los controles de difusividad están en 10⁻³ mm²/s
const deg = (r) => r * 180 / Math.PI;

export function difusion({ h, mem, desl, seg, caja, fuentes, fmt }) {
  const P = Object.assign({ cruce: 'no', b: SOARES.b, nDir: 12, snr: 20, faMin: 0.2, giro: 45, ver: 'si', Dpar: 1.5, Dperp: 0.4, Diso: 0.8, semilla: 1, sel: 12 * N + 12 }, mem.get('dif', {}));
  const cv = h('canvas', { class: 'pick', width: W, height: W, 'aria-label': 'Mapa de FA con ejes y trayectorias' }), cv2 = h('canvas', { width: 300, height: 300, 'aria-label': 'Perfil de difusión del vóxel elegido' });
  const lect = h('div', { class: 'lectura' }), lect2 = h('div', { class: 'lectura' });
  let V, M, tray;

  function calcular() {
    V = campo(N, { Dpar: P.Dpar * K, Dperp: P.Dperp * K, Diso: P.Diso * K, cruce: P.cruce === 'si' });
    M = escanear(V, { b: P.b, nDir: P.nDir, snr: P.snr, semilla: P.semilla });
    const semillas = V.map((v, k) => [v, k]).filter(([v, k]) => (v.haz === 1 || v.haz === 3) && k % N <= 2).map(([, k]) => [k % N + 0.5, Math.floor(k / N) + 0.5]);
    tray = semillas.map(s => seguir(M, N, s, { faMin: P.faMin, giroMax: P.giro }));
    resumen(); dibujar(); voxel(); mem.set('dif', P);
  }
  const llega = (t) => t.pts.some(p => p[0] >= N - 3);
  function resumen() {
    const ok = tray.filter(llega).length, mot = { fa: 0, giro: 0, borde: 0 };
    for (const t of tray) if (!llega(t)) for (const m of t.motivos) if (mot[m] !== undefined) mot[m]++;
    lect.innerHTML = `<b>${ok} de ${tray.length} trayectorias</b> sembradas en el extremo izquierdo del haz llegan al extremo derecho (${fmt(100 * ok / Math.max(1, tray.length))} %).` +
      `<small>Las que no llegan se detuvieron por FA < ${fmt(P.faMin, 2)}: ${mot.fa} · giro > ${P.giro}°: ${mot.giro} · salida del campo: ${mot.borde}</small>`;
  }

  function dibujar() {
    const g = cv.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, W, W);
    for (let k = 0; k < N * N; k++) { const v = Math.round(255 * Math.min(1, M[k].fa)); g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect((k % N) * PX, Math.floor(k / N) * PX, PX - 1, PX - 1); }
    V.forEach((v, k) => {                                      // zonas de salida y de llegada de las trayectorias
      if (v.haz !== 1 && v.haz !== 3) return;
      const c = k % N; if (c <= 2 || c >= N - 3) { g.fillStyle = c <= 2 ? 'rgba(80,200,120,.28)' : 'rgba(90,140,255,.28)'; g.fillRect(c * PX, Math.floor(k / N) * PX, PX - 1, PX - 1); }
    });
    const eje = (k, phi, largo, color, ancho) => {
      const x = (k % N + 0.5) * PX, y = (Math.floor(k / N) + 0.5) * PX, dx = Math.cos(phi) * largo / 2, dy = Math.sin(phi) * largo / 2;
      g.strokeStyle = color; g.lineWidth = ancho; g.beginPath(); g.moveTo(x - dx, y - dy); g.lineTo(x + dx, y + dy); g.stroke();
    };
    if (P.ver === 'si') V.forEach((v, k) => v.ejes.forEach(p => eje(k, p, PX * 0.95, 'rgba(70,200,230,.9)', 1)));
    M.forEach((m, k) => { if (m.fa >= P.faMin) eje(k, m.phi, PX * 0.7 * Math.min(1, m.fa + 0.2), `hsl(${Math.round(deg(((m.phi % Math.PI) + Math.PI) % Math.PI) * 2)} 85% 60%)`, 2); });
    g.lineWidth = 1.6;
    for (const t of tray) {
      g.strokeStyle = llega(t) ? 'rgba(255,214,107,.45)' : 'rgba(255,107,94,.55)'; g.beginPath();
      t.pts.forEach(([x, y], i) => i ? g.lineTo(x * PX, y * PX) : g.moveTo(x * PX, y * PX)); g.stroke();
    }
    g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect((P.sel % N) * PX, Math.floor(P.sel / N) * PX, PX - 1, PX - 1);
  }

  function voxel() {
    const g = cv2.getContext('2d'), c = 150, R = 118, m = M[P.sel], v = V[P.sel], Dmax = Math.max(P.Dpar, P.Diso) * K * 1.05;
    g.fillStyle = '#0b0d11'; g.fillRect(0, 0, 300, 300);
    g.strokeStyle = '#2a3140'; g.lineWidth = 1; g.beginPath(); g.arc(c, c, R, 0, 7); g.moveTo(c - R, c); g.lineTo(c + R, c); g.moveTo(c, c - R); g.lineTo(c, c + R); g.stroke();
    const curva = (f, color, ancho) => {
      g.strokeStyle = color; g.lineWidth = ancho; g.beginPath();
      for (let i = 0; i <= 180; i++) { const th = i / 180 * 2 * Math.PI, r = Math.max(0, f(th)) / Dmax * R; const x = c + r * Math.cos(th), y = c + r * Math.sin(th); i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke();
    };
    curva((th) => -Math.log(senalVoxel(v.comps, P.b, th)) / P.b, 'rgba(70,200,230,.9)', 1.5);   // verdad del modelo (sin ruido)
    curva((th) => adc(m.D, th), '#e6b566', 2);                                                   // tensor ajustado
    const dirs = direcciones(P.nDir);
    g.fillStyle = '#fff';
    dirs.forEach((th, k) => { const d = -Math.log(Math.max(m.S[k], 1e-6) / Math.max(m.S0, 1e-6)) / P.b, r = Math.max(0, d) / Dmax * R; for (const s of [0, Math.PI]) { g.beginPath(); g.arc(c + r * Math.cos(th + s), c + r * Math.sin(th + s), 2.6, 0, 7); g.fill(); } });
    const lim = escanear([v], { b: P.b, nDir: P.nDir, snr: 0 })[0];
    lect2.innerHTML = `<b>Vóxel (${P.sel % N}, ${Math.floor(P.sel / N)})</b> · ${['fondo isotrópico', 'haz en arco', 'haz vertical', 'cruce de fibras'][v.haz]}` +
      `<small>λ₁ ${fmt(m.l1 / K, 2)} · λ₂ ${fmt(m.l2 / K, 2)} (×10⁻³ mm²/s) · MD ${fmt(m.md / K, 2)} · FA ${fmt(m.fa, 2)}</small>` +
      `<small>Sin ruido, el modelo daría FA ${fmt(lim.fa, 2)}${v.haz === 3 ? ' (con dos fibras en el vóxel, el tensor ya no describe ninguna)' : ''}.</small>`;
  }

  cv.addEventListener('click', (e) => {
    const r = cv.getBoundingClientRect(), i = Math.min(N - 1, Math.floor((e.clientX - r.left) / r.width * N)), j = Math.min(N - 1, Math.floor((e.clientY - r.top) / r.height * N));
    P.sel = j * N + i; dibujar(); voxel(); mem.set('dif', P);
  });
  const sl = (nombre, min, max, paso, clave, f = (x) => fmt(x, paso < 1 ? 2 : 0)) => desl(nombre, min, max, paso, P[clave], f, (x) => { P[clave] = x; calcular(); });

  const ui = h('div', null,
    h('div', { class: 'dos' },
      h('figure', null, cv, h('figcaption', null, 'Mapa de FA (gris), ejes medidos (color), verdad (celeste) y trayectorias; verde: salida, azul: llegada. Haz clic en un vóxel')),
      h('div', null, h('figure', null, cv2, h('figcaption', null, 'ADC según la dirección del gradiente: ajuste (dorado), verdad (celeste), medidas (puntos)')), lect2)),
    lect,
    h('div', { class: 'mandos fila' },
      h('div', null, h('h3', null, 'Adquisición'),
        sl('b (s/mm²)', 200, 3000, 100, 'b', (x) => fmt(x)), sl('Direcciones', 6, 30, 1, 'nDir', (x) => fmt(x)), sl('SNR (b = 0)', 3, 100, 1, 'snr', (x) => fmt(x)),
        h('button', { class: 'ver3d', onclick: () => { P.semilla++; calcular(); } }, '↻ Otro ruido'),
        h('h3', null, 'Tejido'), seg([['no', 'Un haz'], ['si', 'Haz cruzado']], P.cruce, v => { P.cruce = v; calcular(); }),
        seg([['si', 'Mostrar la verdad'], ['no', 'Ocultarla']], P.ver, v => { P.ver = v; dibujar(); })),
      h('div', null, h('h3', null, 'Trayectorias (FACT)'),
        sl('FA mínima', 0.05, 0.6, 0.01, 'faMin'), sl('Giro máximo', 10, 90, 5, 'giro', (x) => fmt(x) + '°'),
        h('h3', null, 'Difusividades ilustrativas (×10⁻³ mm²/s)'),
        sl('D∥ (a lo largo)', 1, 2.5, 0.1, 'Dpar', (x) => fmt(x, 1)), sl('D⊥ (a través)', 0.1, 1, 0.05, 'Dperp', (x) => fmt(x, 2)), sl('D del fondo', 0.4, 1.5, 0.1, 'Diso', (x) => fmt(x, 1)))));
  calcular();

  return [ui,
    h('h2', null, 'De la señal que se apaga al eje de una fibra'),
    h('p', null, 'En una secuencia de difusión, dos gradientes idénticos colocados a cada lado del pulso de 180° desfasan los espines que se movieron entre ambos y dejan sin efecto a los quietos; el eco baja con la difusión en la dirección del gradiente:'),
    h('p', { class: 'formula' }, 'S / S₀ = exp(−b · D)'),
    h('p', null, 'Como en un haz de fibras el agua difunde más a lo largo que a través, D cambia con la dirección. Con una imagen sin gradiente y varias direcciones se ajusta un tensor por vóxel; sus autovectores dan los ejes del tejido y sus autovalores las difusividades (Basser, ex vivo). De ellos salen la difusividad media y la anisotropía fraccional (Soares):'),
    h('p', { class: 'formula' }, 'MD = (λ₁ + λ₂ + λ₃) / 3'),
    h('p', { class: 'formula' }, 'FA = √(3/2) · √(Σ(λᵢ − MD)²) / √(Σλᵢ²)'),
    h('p', null, 'La tractografía determinista de tipo FACT parte de una semilla, sigue el eje principal de cada vóxel (uniforme dentro de él y con cambio brusco en el borde) y termina cuando la FA cae por debajo de un umbral (0,1–0,3 en el adulto) o cuando la dirección gira más de un ángulo máximo (40–70°) (Soares et al.).'),
    caja('Para probar', h('ul', null,
      h('li', null, 'Baja el SNR: los ejes se desordenan, la FA del fondo deja de ser 0 (los autovalores con ruido nunca salen iguales) y las trayectorias se cortan.'),
      h('li', null, 'Activa el haz cruzado: en el cruce la FA cae y el eje medido no coincide con ninguna de las dos fibras. Las trayectorias se desvían hacia el haz vertical o se detienen (Soares: los cruces dan direcciones erróneas y terminaciones abruptas).'),
      h('li', null, 'Sube la FA mínima por encima de 0,5: el propio haz queda bajo el umbral y se pierde. Bájala a 0,05: las trayectorias se salen del haz hacia el fondo.'),
      h('li', null, 'Con un ángulo máximo de 10° y ruido moderado, la curvatura natural del arco más el error de orientación bastan para cortar la trayectoria.'),
      h('li', null, 'Con b bajo casi no hay atenuación y el tensor se estima mal; con b alto sube la atenuación y se hunde la señal en el ruido.'))),
    caja('Límites del modelo', h('p', null, 'El campo es sintético y plano, no sale del atlas, que no tiene orientación de fibras. Las difusividades son parámetros ilustrativos, no valores medidos: las fuentes leídas dan solo agua libre (2,3·10⁻³ mm²/s a 25 °C y 2,5 a 40 °C, Le Bihan 1986), un ADC escalar de la sustancia blanca humana a b ≈ 100–180 s/mm² y mezclado con perfusión, y el tensor de un lomo de cerdo ex vivo; ninguna da D∥ y D⊥ de la sustancia blanca humana a b ≈ 1000, así que no se afirma cuánto valen. El tensor es plano (tres incógnitas) y se supone λ₃ = λ₂; el tensor 3D tiene seis y exige al menos seis direcciones no colineales (Soares). El ruido es de Rice con el mismo SNR en todas las direcciones, sin corrientes de Foucault, movimiento ni T2. El cruce es una mezcla 50/50 de dos fibras.')),
    fuentes('hornak13', 'soares13', 'basser', 'difusion')];
}
