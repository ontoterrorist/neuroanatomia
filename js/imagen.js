// Neuroimagen: simuladores de resonancia magnética (contraste, espacio k, ecuaciones de Bloch) y de fMRI (BOLD + GLM).
// Escanean un volumen de 1 mm generado a partir de las mallas del atlas (tools/build-volumen.mjs).
import { TEJIDOS, PRESETS, FUENTES, tejidoDe, params } from '../data/neuroimagen.js';
import { senal, tiNulo, corte, imagen, azar, fft2, hrf, regresor, glm, pT, tCrit } from './imagen-fisica.js';
import { $, h, mem, TECLA } from './ui.js';

export const HERRAMIENTAS = [
  { id: 'resonancia', n: 'Contraste en RM', sub: 'T1, T2, densidad protónica, FLAIR y STIR sobre la cabeza del atlas' },
  { id: 'espacio-k', n: 'El espacio k', sub: 'La imagen es la transformada de Fourier de lo que mide la antena' },
  { id: 'bloch', n: 'El espín: relajación y eco', sub: 'Magnetización, T1, T2, T2* y el eco de espín' },
  { id: 'fmri', n: 'fMRI: BOLD y modelo lineal general', sub: 'Diseña un experimento, simula la señal y busca la activación' },
];

let VOL = null;
/** Carga el volumen de etiquetas (gzip) una sola vez. */
async function volumen() {
  if (VOL) return VOL;
  const [meta, bin] = await Promise.all([fetch('assets/volumen.json').then(r => r.json()), fetch('assets/volumen.bin')]);
  const ds = bin.body.pipeThrough(new DecompressionStream('gzip'));
  const lab = new Uint8Array(await new Response(ds).arrayBuffer());
  const tej = meta.nombres.map(tejidoDe);
  VOL = { ...meta, lab, tej };
  return VOL;
}

const fmt = (v, d = 0) => v.toLocaleString('es', { maximumFractionDigits: d, minimumFractionDigits: d });
const lienzo = (n, clase = 'rm') => { const c = h('canvas', { class: clase, width: n, height: n }); return c; };
/** Pinta una matriz Float32 (n×n) en gris, con ventana [0, max]. */
function pintarGris(cv, img, n, max) {
  const g = cv.getContext('2d'), id = g.createImageData(n, n);
  if (!max) { max = 0; for (const v of img) if (v > max) max = v; }
  for (let i = 0; i < n * n; i++) { const v = Math.max(0, Math.min(255, img[i] / max * 255)); id.data[4 * i] = id.data[4 * i + 1] = id.data[4 * i + 2] = v; id.data[4 * i + 3] = 255; }
  g.putImageData(id, 0, 0);
}
/** Deslizador con etiqueta y valor. */
function desl(nombre, min, max, paso, valor, fmtv, al) {
  const o = h('output', null, fmtv(valor));
  const i = h('input', { type: 'range', min, max, step: paso, value: valor, 'aria-label': nombre, oninput: (e) => { o.textContent = fmtv(+e.target.value); al(+e.target.value); } });
  const d = h('div', { class: 'deslz' }, h('span', null, nombre), i, o);
  d.poner = (v) => { i.value = v; o.textContent = fmtv(v); };
  return d;
}
/** Botones segmentados. */
function seg(opciones, actual, al) {
  const c = h('div', { class: 'seg', role: 'group' });
  const pinta = (v) => [...c.children].forEach(b => b.classList.toggle('on', b.dataset.v === String(v)));
  for (const [v, t] of opciones) c.append(h('button', { 'data-v': v, onclick: () => { pinta(v); al(v); } }, t));
  pinta(actual); c.poner = pinta; return c;
}
const caja = (titulo, ...k) => h('div', { class: 'clave' }, h('h4', null, titulo), ...k);
const fuentes = (...claves) => caja('Modelo y fuentes', h('ul', { class: 'fuentes' }, claves.map(k => h('li', null, FUENTES[k]))));

export async function crear(app, esc, atlas) {
  let actual = null, parar = () => { };
  const nombreDe = (n) => atlas.cat[n]?.n?.replace(/ \(.*\)$/, '') || n.replace(/_/g, ' ');
  app.indices.push(() => HERRAMIENTAS.map(t => ({ t: 'Simulador', n: t.n, sub: t.sub, a: 'i:' + t.id, kw: 'resonancia magnetica rm mri fmri neuroimagen' })));

  function menu() {
    const izq = $('#izq'); izq.innerHTML = '';
    izq.append(h('div', { class: 'cab' }, h('h2', null, 'Neuroimagen'), h('p', null, 'Simuladores de resonancia magnética y fMRI sobre la cabeza del atlas.')),
      h('div', { class: 'desplaza temario' },
        h('div', { ...TECLA, class: 'uni' + (!actual ? ' sel' : ''), onclick: () => abrir(null) }, h('span', null, 'Presentación')),
        HERRAMIENTAS.map((t, i) => h('div', { ...TECLA, class: 'uni' + (actual === t.id ? ' sel' : ''), onclick: () => abrir(t.id) }, h('span', { class: 'k' }, String(i + 1).padStart(2, '0')), h('span', null, t.n)))));
  }

  function portada() {
    return h('div', { class: 'hoja' },
      h('div', { class: 'sobre' }, 'Neuroimagen'), h('h1', null, 'Un resonador en el navegador'),
      h('p', { class: 'bajada' }, 'Cuatro simuladores que escanean la cabeza del atlas: el mismo encéfalo que exploras en 3D, convertido en un volumen de vóxeles de 1 mm con sustancia gris, sustancia blanca, líquido cefalorraquídeo, hueso, grasa y tejido blando.'),
      h('div', { class: 'tarjetas' }, HERRAMIENTAS.map((t, i) => h('button', { class: 'tarjeta', onclick: () => abrir(t.id) }, h('small', null, `Simulador ${i + 1}`), h('b', null, t.n), t.sub))),
      caja('Qué es y qué no es', h('p', null, 'Es un modelo docente: las intensidades salen de ecuaciones de señal y de tiempos de relajación publicados, y la fMRI se genera con una respuesta hemodinámica canónica y ruido gaussiano. No reproduce un equipo real: no hay bobinas, ni flujo, ni susceptibilidad, ni movimiento. El volumen es una segmentación esquemática hecha a partir de mallas 3D, no una imagen de un sujeto.')),
      fuentes('atlas', 'west', 'jordan', 'hornak', 'spm', 'friston', 'ogawa'));
  }

  // ═══════════════════════════════════════════ 1. Contraste
  async function resonancia() {
    const V = await volumen(), n = 256;
    const P = Object.assign({ plano: 'axial', f: 0.62, B0: '3', sec: 'se', TR: 500, TE: 10, TI: 800, snr: 40, preset: 't1' }, mem.get('rm', {}));
    const cv = lienzo(n), info = h('div', { class: 'lectura' }, 'Haz clic en la imagen para identificar el tejido.');
    const barras = h('div', { class: 'barras' });
    let C = null, img = null;
    const tabla = () => V.tej.map(t => senal(t, P.B0, P));
    function calcular() {
      C = corte(V, P.plano, P.f);
      img = imagen(C, tabla(), n);
      // ruido complejo gaussiano: imagen de magnitud con distribución de Rice
      const r = azar(7), ref = senal('sb', P.B0, { sec: 'se', TR: 4000, TE: 10 }), s = P.snr ? ref / P.snr : 0;
      if (s) for (let i = 0; i < img.length; i++) img[i] = Math.hypot(img[i] + s * r.n(), s * r.n());
      let mx = 0; for (const t of ['sg', 'sb', 'lcr', 'grasa', 'musculo']) mx = Math.max(mx, senal(t, P.B0, P));
      pintarGris(cv, img, n, mx * 1.05 || 1);
      barras.innerHTML = '';
      for (const t of ['sb', 'sg', 'lcr', 'grasa', 'musculo']) {
        const v = senal(t, P.B0, P);
        barras.append(h('div', { class: 'barra' }, h('span', null, TEJIDOS[t].n.replace(/ \(.*\)$/, '')), h('i', null, h('b', { style: { width: (v / (mx || 1) * 100) + '%', background: TEJIDOS[t].c } })), h('output', null, fmt(v * 100, 1))));
      }
      mem.set('rm', P);
    }
    const tr = desl('TR', 100, 10000, 50, P.TR, v => fmt(v) + ' ms', v => { P.TR = v; P.preset = null; pre.poner(''); calcular(); });
    const te = desl('TE', 5, 250, 1, P.TE, v => fmt(v) + ' ms', v => { P.TE = v; P.preset = null; pre.poner(''); calcular(); });
    const ti = desl('TI', 20, 4000, 10, P.TI, v => fmt(v) + ' ms', v => { P.TI = v; P.preset = null; pre.poner(''); calcular(); });
    const fila = h('div', null, ti); fila.hidden = P.sec !== 'ir';
    const secB = seg([['se', 'Eco de espín'], ['ir', 'Inversión-recuperación']], P.sec, v => { P.sec = v; fila.hidden = v !== 'ir'; P.preset = null; pre.poner(''); calcular(); });
    const pre = seg(PRESETS.map(p => [p.id, p.n]), P.preset || '', id => {
      const p = PRESETS.find(x => x.id === id); Object.assign(P, { sec: p.sec, TR: p.TR, TE: p.TE, preset: id });
      if (p.anula) P.TI = Math.round(tiNulo(p.anula, P.B0, p.TR));
      tr.poner(P.TR); te.poner(P.TE); ti.poner(P.TI); secB.poner(P.sec); fila.hidden = P.sec !== 'ir'; calcular();
    });
    const sl = desl('Posición', 0.05, 0.95, 0.005, P.f, v => fmt(v * 100) + ' %', v => { P.f = v; calcular(); });
    cv.addEventListener('click', (e) => {
      const r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * n), y = Math.floor((e.clientY - r.top) / r.height * n);
      const c = x - Math.floor((n - C.w) / 2), f = y - Math.floor((n - C.h) / 2);
      if (c < 0 || f < 0 || c >= C.w || f >= C.h) return;
      const k = C.d[f * C.w + c], nom = V.nombres[k], t = V.tej[k], p = params(t, P.B0);
      info.innerHTML = '';
      info.append(...[h('b', null, TEJIDOS[t].n), ' · ', /^(aire|piel_grasa|tejido_blando|lcr_externo)$/.test(nom) ? '' : nombreDe(nom),
        p ? h('small', null, ` T1 ${fmt(p.T1)} ms · T2 ${fmt(p.T2, 1)} ms · DP ${fmt(p.PD, 2)} · señal ${fmt(senal(t, P.B0, P) * 100, 1)}`) : null,
        atlas.cat[nom] ? h('button', { class: 'ver3d', onclick: () => app.ir('atlas', nom) }, '◈ Ver en el atlas') : null].filter(x => x != null && x !== ''));
    });
    const ui = h('div', { class: 'sim' },
      h('div', { class: 'visor' }, cv, info),
      h('div', { class: 'mandos' },
        h('h3', null, 'Corte'), seg([['axial', 'Axial'], ['coronal', 'Coronal'], ['sagital', 'Sagital']], P.plano, v => { P.plano = v; calcular(); }), sl,
        h('h3', null, 'Campo'), seg([['1.5', '1,5 T'], ['3', '3 T']], P.B0, v => { P.B0 = v; const p = PRESETS.find(x => x.id === P.preset); if (p?.anula) { P.TI = Math.round(tiNulo(p.anula, v, P.TR)); ti.poner(P.TI); } calcular(); }),
        h('h3', null, 'Secuencia'), pre, secB, tr, te, fila,
        h('div', { class: 'marcas' }, h('button', { class: 'marca-ch', onclick: () => { P.TI = Math.round(tiNulo('lcr', P.B0, P.TR)); ti.poner(P.TI); calcular(); } }, 'TI que anula el LCR'), h('button', { class: 'marca-ch', onclick: () => { P.TI = Math.round(tiNulo('grasa', P.B0, P.TR)); ti.poner(P.TI); calcular(); } }, 'TI que anula la grasa')),
        desl('Señal/ruido', 0, 200, 5, P.snr, v => v ? fmt(v) : 'sin ruido', v => { P.snr = v; calcular(); }),
        h('h3', null, 'Señal por tejido'), barras));
    calcular();
    return [ui,
      h('h2', null, 'Cómo se forma el contraste'),
      h('p', null, 'Cada tejido tiene una densidad de protones (DP) y dos tiempos de relajación: T1, lo que tarda la magnetización longitudinal en recuperarse, y T2, lo que tarda la transversal en perderse. La intensidad de cada vóxel sale de la ecuación de señal de la secuencia:'),
      h('p', { class: 'formula' }, 'Eco de espín: S = DP · (1 − e', h('sup', null, '−TR/T1'), ') · e', h('sup', null, '−TE/T2')),
      h('p', { class: 'formula' }, 'Inversión-recuperación: S = DP · |1 − 2e', h('sup', null, '−TI/T1'), ' + e', h('sup', null, '−TR/T1'), '| · e', h('sup', null, '−TE/T2')),
      h('p', null, 'Con TR corto, los tejidos de T1 corto (sustancia blanca, grasa) alcanzan a recuperarse y brillan: es la ponderación en T1. Con TR largo y TE largo, lo que decide es T2, y el LCR, de T2 muy largo, brilla. Con TR largo y TE corto queda la densidad protónica. En inversión-recuperación, el TI que hace cero el paréntesis anula un tejido: FLAIR apaga el LCR y STIR, la grasa.'),
      caja('Para probar', h('ul', null,
        h('li', null, 'Pasa de 1,5 T a 3 T con la misma secuencia: T1 se alarga y la imagen ponderada en T1 cambia aunque no toques nada.'),
        h('li', null, 'Sube el TE en la secuencia T2 hasta que solo quede el LCR.'),
        h('li', null, 'En FLAIR, mueve el TI unos cientos de milisegundos: el LCR reaparece. La imagen es de magnitud, así que lo que cruza por cero vuelve a verse brillante.'))),
      caja('Límites del modelo', h('p', null, 'El tronco del encéfalo y la médula se tratan como mezcla 50/50 de gris y blanca porque el atlas no los separa. Todo el tejido blando de la cabeza se trata como músculo, el hueso y las arterias no dan señal y el ojo usa los valores del LCR. La DP de grasa y músculo es un supuesto dentro del rango de Hornak. El ruido es gaussiano complejo, por lo que la magnitud sigue una distribución de Rice.')),
      fuentes('west', 'jordan', 'hornak', 'atlas')];
  }

  // ═══════════════════════════════════════════ 2. Espacio k
  async function espacioK() {
    const V = await volumen(), n = 256;
    const P = Object.assign({ filtro: 'todo', radio: 32, plano: 'axial', f: 0.62, sec: 't1' }, mem.get('ek', {}));
    const cvI = lienzo(n), cvK = lienzo(n), cvR = lienzo(n);
    const lect = h('div', { class: 'lectura' });
    let base = null;
    function preparar() {
      const p = PRESETS.find(x => x.id === P.sec), s = { ...p, TI: p.anula ? tiNulo(p.anula, '3', p.TR) : 0 };
      const tabla = V.tej.map(t => senal(t, '3', s));
      base = imagen(corte(V, P.plano, P.f), tabla, n);
      pintarGris(cvI, base, n);
      reconstruir();
    }
    function reconstruir() {
      const re = Float64Array.from(base), im = new Float64Array(n * n);
      fft2(re, im, n);
      const c = n / 2;
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        const i = y * n + x, ky = y - c, kx = x - c, r = Math.hypot(kx, ky);
        let keep = 1;
        if (P.filtro === 'centro') keep = Math.abs(kx) < P.radio && Math.abs(ky) < P.radio ? 1 : 0;
        else if (P.filtro === 'bordes') keep = r > P.radio * 0.25 ? 1 : 0;
        else if (P.filtro === 'pares') keep = (ky & 1) ? 0 : 1;
        else if (P.filtro === 'mitad') keep = ky <= 8 ? 1 : 0;
        re[i] *= keep; im[i] *= keep;
      }
      if (P.filtro === 'espiga') { const i = (c + 37) * n + c + 23, m = Math.hypot(re[c * n + c], im[c * n + c]) * 0.02; re[i] += m; }
      // espacio k en escala logarítmica
      const mag = new Float32Array(n * n); let mx = 0;
      for (let i = 0; i < n * n; i++) { mag[i] = Math.log1p(Math.hypot(re[i], im[i])); if (mag[i] > mx) mx = mag[i]; }
      pintarGris(cvK, mag, n, mx);
      fft2(re, im, n, true);
      const out = new Float32Array(n * n); for (let i = 0; i < n * n; i++) out[i] = Math.hypot(re[i], im[i]);
      let mb = 0; for (const v of base) if (v > mb) mb = v;
      pintarGris(cvR, out, n, mb);
      const txt = { todo: 'Con todo el espacio k, la reconstrucción es idéntica al objeto.', centro: `Solo el centro (${2 * P.radio}×${2 * P.radio} de ${n}×${n}): queda el contraste, se pierde el detalle y aparecen ondulaciones en los bordes (artefacto de truncamiento o de Gibbs).`, bordes: 'Sin el centro se pierde el contraste general y quedan los bordes: la información fina vive lejos del centro.', pares: 'Se mide una línea de cada dos en la dirección de fase: el campo de visión se reduce a la mitad y la imagen se pliega sobre sí misma (aliasing).', mitad: 'Falta casi la mitad del espacio k: como la imagen es real, la otra mitad es redundante (simetría conjugada) y la reconstrucción de magnitud pierde poco.', espiga: 'Un solo punto anómalo en el espacio k (una «espiga») se convierte en un patrón de rayas sobre toda la imagen.' }[P.filtro];
      lect.textContent = txt; rad.hidden = !['centro', 'bordes'].includes(P.filtro);
      mem.set('ek', P);
    }
    const rad = desl('Radio', 4, 128, 2, P.radio, v => fmt(v), v => { P.radio = v; reconstruir(); });
    const ui = h('div', null,
      h('div', { class: 'tres' }, h('figure', null, cvI, h('figcaption', null, 'Objeto')), h('figure', null, cvK, h('figcaption', null, 'Espacio k (log |F|)')), h('figure', null, cvR, h('figcaption', null, 'Reconstrucción'))),
      lect,
      h('div', { class: 'mandos fila' },
        h('div', null, h('h3', null, 'Qué se mide'), seg([['todo', 'Todo'], ['centro', 'Solo el centro'], ['bordes', 'Sin el centro'], ['pares', 'Una línea de cada dos'], ['mitad', 'Media k'], ['espiga', 'Espiga']], P.filtro, v => { P.filtro = v; reconstruir(); }), rad),
        h('div', null, h('h3', null, 'Imagen de partida'), seg(PRESETS.slice(0, 4).map(p => [p.id, p.n]), P.sec, v => { P.sec = v; preparar(); }),
          desl('Posición', 0.05, 0.95, 0.005, P.f, v => fmt(v * 100) + ' %', v => { P.f = v; preparar(); }))));
    preparar();
    return [ui,
      h('h2', null, 'Por qué una imagen es una suma de ondas'),
      h('p', null, 'Los gradientes de campo hacen que la frecuencia y la fase de la señal dependan de la posición. Lo que recoge la antena en cada instante no es un píxel, sino un punto del espacio de frecuencias espaciales: el espacio k. La imagen se obtiene con la transformada de Fourier inversa de todo el espacio k medido.'),
      h('p', null, 'El centro del espacio k corresponde a las frecuencias espaciales bajas y fija el contraste y la intensidad general; la periferia, a las frecuencias altas, lleva los bordes y el detalle. Por eso la resolución depende de cuánto se mide hacia afuera y el campo de visión, de lo juntas que están las líneas medidas.'),
      caja('Límites del modelo', h('p', null, 'Se parte de una imagen ya calculada a 3 T y se le aplica una transformada de Fourier discreta de 256×256. No se simulan gradientes, trayectorias ni el tiempo de lectura: el objetivo es mostrar la relación entre los datos crudos y la imagen.')),
      fuentes('hornak', 'atlas')];
  }

  // ═══════════════════════════════════════════ 3. Bloch
  function bloch() {
    const P = Object.assign({ tej: 'sg', B0: '3', modo: 'eco', ang: 90, TE: 80, TR: 1500, dis: 40, vel: 1 }, mem.get('bl', {}));
    const cv3 = h('canvas', { class: 'graf espin', width: 520, height: 360 }), cvT = h('canvas', { class: 'graf', width: 760, height: 220 });
    const lect = h('div', { class: 'lectura' });
    let tray = null, t0 = performance.now(), raf = 0;
    const NI = 15, DT = 0.5;
    function simular() {
      const p = params(P.tej, P.B0), T1 = p.T1, T2 = p.T2, E1 = Math.exp(-DT / T1), E2 = Math.exp(-DT / T2);
      const dur = P.modo === 'rep' ? 5 * P.TR : P.modo === 'eco' ? Math.max(P.TE * 2.2, 200) : Math.max(4 * T2, 200);
      const pulsos = P.modo === 'rep' ? Array.from({ length: 5 }, (_, i) => [i * P.TR, P.ang]) : P.modo === 'eco' ? [[0, 90], [P.TE / 2, 180]] : [[0, P.ang]];
      const iso = Array.from({ length: NI }, (_, i) => ({ df: P.dis * (i / (NI - 1) - 0.5), m: [0, 0, 1] }));
      const pasos = Math.ceil(dur / DT), out = { t: [], M: [], iso: [], pulsos, T1, T2, dur };
      let ip = 0;
      for (let s = 0; s <= pasos; s++) {
        const t = s * DT;
        while (ip < pulsos.length && pulsos[ip][0] <= t + 1e-9) {
          const a = pulsos[ip][1] * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
          for (const q of iso) { const [x, y, z] = q.m; q.m = [x, y * ca - z * sa, y * sa + z * ca]; }
          ip++;
        }
        let sx = 0, sy = 0, sz = 0; for (const q of iso) { sx += q.m[0]; sy += q.m[1]; sz += q.m[2]; }
        out.t.push(t); out.M.push([sx / NI, sy / NI, sz / NI]);
        if (s % 4 === 0) out.iso.push(iso.map(q => q.m.slice()));
        for (const q of iso) {   // precesión en el marco rotatorio + relajación (solución exacta en cada paso)
          const ph = 2 * Math.PI * q.df * DT / 1000, c = Math.cos(ph), sn = Math.sin(ph); let [x, y, z] = q.m;
          [x, y] = [x * c - y * sn, x * sn + y * c];
          q.m = [x * E2, y * E2, 1 + (z - 1) * E1];
        }
      }
      tray = out; t0 = performance.now(); mem.set('bl', P);
      const tx = { fid: `Tras el pulso de ${P.ang}°, la magnetización transversal se pierde por dos razones: la relajación T2 (${fmt(T2, 1)} ms) y el desfase de los espines que precesan a frecuencias algo distintas (T2*). Mz se recupera con T1 = ${fmt(T1)} ms.`, eco: `El pulso de 180° a TE/2 = ${fmt(P.TE / 2)} ms invierte el desfase: los espines rápidos quedan atrás y alcanzan a los lentos en TE = ${fmt(P.TE)} ms. El eco recupera lo perdido por desfase, pero no lo perdido por T2 (línea punteada).`, rep: `Pulsos de ${P.ang}° cada TR = ${fmt(P.TR)} ms: si TR no alcanza para que Mz se recupere, cada pulso parte de menos magnetización, hasta que tras algunos ciclos se llega a un estado de equilibrio.` }[P.modo];
      lect.textContent = tx;
    }
    function dibujar() {
      if (!tray) return;
      const vel = P.modo === 'rep' ? 2500 : P.modo === 'eco' ? 160 : 400;
      const tt = ((performance.now() - t0) / 1000 * vel * P.vel) % (tray.dur * 1.08);
      const k = Math.min(tray.t.length - 1, Math.round(tt / DT)), ki = Math.min(tray.iso.length - 1, Math.floor(k / 4));
      // vista 3D del marco rotatorio
      const g = cv3.getContext('2d'), W = cv3.width, H = cv3.height, cx = W / 2, cy = H * 0.62, R = H * 0.42;
      g.clearRect(0, 0, W, H);
      const pr = ([x, y, z]) => [cx + R * (x * 0.95 - y * 0.55), cy - R * (z * 0.95 - y * 0.32 - x * 0.12)];
      g.lineWidth = 1; g.strokeStyle = '#33405a'; g.fillStyle = '#7a8394'; g.font = '13px system-ui';
      for (const [v, t] of [[[1.1, 0, 0], "x'"], [[0, 1.1, 0], "y'"], [[0, 0, 1.15], 'z (B₀)']]) { const a = pr([0, 0, 0]), b = pr(v); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); g.fillText(t, b[0] + 4, b[1] - 2); }
      g.beginPath(); for (let i = 0; i <= 64; i++) { const a = i / 64 * 2 * Math.PI, p = pr([Math.cos(a), Math.sin(a), 0]); i ? g.lineTo(...p) : g.moveTo(...p); } g.stroke();
      g.strokeStyle = 'rgba(111,168,220,.55)'; for (const m of tray.iso[ki]) { const a = pr([0, 0, 0]), b = pr(m); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
      const M = tray.M[k], a = pr([0, 0, 0]), b = pr(M);
      g.strokeStyle = '#e6b566'; g.lineWidth = 3.5; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke();
      g.fillStyle = '#e6b566'; g.beginPath(); g.arc(b[0], b[1], 4.5, 0, 7); g.fill();
      g.fillStyle = '#aab1bf'; g.fillText(`t = ${fmt(tray.t[k])} ms`, 12, 22);
      // curvas
      const G = cvT.getContext('2d'), w = cvT.width, hh = cvT.height, x0 = 44, y0 = hh - 26, sx = (w - x0 - 12) / tray.dur, sy = hh - 46;
      G.clearRect(0, 0, w, hh); G.font = '12px system-ui'; G.strokeStyle = '#263041'; G.lineWidth = 1;
      G.beginPath(); G.moveTo(x0, 14); G.lineTo(x0, y0); G.lineTo(w - 8, y0); G.stroke();
      const Yv = (v) => y0 - (v + 1) / 2 * sy;
      G.fillStyle = '#7a8394'; G.fillText('1', x0 - 14, Yv(1) + 4); G.fillText('0', x0 - 14, Yv(0) + 4); G.fillText('−1', x0 - 20, Yv(-1) + 4); G.beginPath(); G.moveTo(x0, Yv(0)); G.lineTo(w - 8, Yv(0)); G.stroke(); G.fillText(fmt(tray.dur) + ' ms', w - 70, hh - 6);
      for (const [tp, an] of tray.pulsos) { G.fillStyle = 'rgba(230,181,102,.25)'; G.fillRect(x0 + tp * sx - 1, 14, 3, y0 - 14); G.fillStyle = '#e6b566'; G.fillText(an + '°', x0 + tp * sx + 4, 26); }
      const linea = (f, col, dash) => { G.strokeStyle = col; G.setLineDash(dash || []); G.lineWidth = 2; G.beginPath(); for (let i = 0; i < tray.t.length; i += 2) { const X = x0 + tray.t[i] * sx, Y = Yv(f(i)); i ? G.lineTo(X, Y) : G.moveTo(X, Y); } G.stroke(); G.setLineDash([]); };
      linea(i => tray.M[i][2], '#8fd0a0');
      linea(i => Math.hypot(tray.M[i][0], tray.M[i][1]), '#e6b566');
      if (P.modo !== 'rep') { const s0 = P.modo === 'eco' ? 1 : Math.abs(Math.sin(P.ang * Math.PI / 180)); linea(i => s0 * Math.exp(-tray.t[i] / tray.T2), '#e9967a', [5, 4]); }
      G.fillStyle = '#8fd0a0'; G.fillText('Mz', x0 + 8, hh - 6); G.fillStyle = '#e6b566'; G.fillText('|Mxy|', x0 + 40, hh - 6); if (P.modo !== 'rep') { G.fillStyle = '#e9967a'; G.fillText('envolvente T2', x0 + 100, hh - 6); }
      G.strokeStyle = '#e8e3d6'; G.lineWidth = 1; G.beginPath(); G.moveTo(x0 + tray.t[k] * sx, 14); G.lineTo(x0 + tray.t[k] * sx, y0); G.stroke();
      raf = requestAnimationFrame(dibujar);
    }
    const te = desl('TE', 10, 300, 5, P.TE, v => fmt(v) + ' ms', v => { P.TE = v; simular(); });
    const tr = desl('TR', 100, 5000, 50, P.TR, v => fmt(v) + ' ms', v => { P.TR = v; simular(); });
    const an = desl('Ángulo', 5, 180, 5, P.ang, v => fmt(v) + '°', v => { P.ang = v; simular(); });
    const vis = () => { te.hidden = P.modo !== 'eco'; tr.hidden = P.modo !== 'rep'; an.hidden = P.modo === 'eco'; };
    const ui = h('div', null, h('div', { class: 'sim' },
      h('div', { class: 'visor' }, cv3, lect),
      h('div', { class: 'mandos' },
        h('h3', null, 'Experimento'), seg([['fid', 'Un pulso'], ['eco', 'Eco de espín'], ['rep', 'Pulsos repetidos']], P.modo, v => { P.modo = v; vis(); simular(); }),
        an, te, tr,
        h('h3', null, 'Tejido'), seg(['sg', 'sb', 'lcr', 'grasa'].map(k => [k, TEJIDOS[k].n.replace(/ \(.*\)$/, '').replace('Líquido cefalorraquídeo', 'LCR')]), P.tej, v => { P.tej = v; simular(); }),
        seg([['1.5', '1,5 T'], ['3', '3 T']], P.B0, v => { P.B0 = v; simular(); }),
        desl('Desfase', 0, 200, 5, P.dis, v => fmt(v) + ' Hz', v => { P.dis = v; simular(); }),
        desl('Velocidad', 0.25, 3, 0.25, P.vel, v => fmt(v, 2) + '×', v => { P.vel = v; }))),
      cvT);
    vis(); simular(); raf = requestAnimationFrame(dibujar);
    parar = () => cancelAnimationFrame(raf);
    return [ui,
      h('h2', null, 'Lo que hace cada espín'),
      h('p', null, 'En el campo B₀ la magnetización neta apunta a lo largo de z. Un pulso de radiofrecuencia la inclina hacia el plano transversal, donde precesa y genera la señal. Desde ahí, dos relajaciones independientes: la componente longitudinal vuelve a su valor de equilibrio con la constante T1, Mz(t) = M₀(1 − e', h('sup', null, '−t/T1'), ') tras un pulso de 90°, y la transversal decae con T2.'),
      h('p', null, 'Las flechas azules son grupos de espines («isocromatos») que precesan a frecuencias un poco distintas porque el campo no es perfectamente homogéneo; el control «Desfase» fija ese rango. Su suma (flecha dorada) cae más rápido que T2: es el decaimiento T2*. El pulso de 180° del eco de espín revierte ese desfase, no la relajación T2.'),
      caja('Límites del modelo', h('p', null, 'Las ecuaciones de Bloch se integran con su solución exacta en pasos de 0,5 ms, en el marco rotatorio y con pulsos instantáneos. Las frecuencias de los isocromatos se reparten de forma uniforme; un reparto lorentziano daría un decaimiento T2* exponencial.')),
      fuentes('hornak', 'west', 'jordan')];
  }

  // ═══════════════════════════════════════════ 4. fMRI
  async function fmri() {
    const V = await volumen(), [NX, NY, NZ] = V.dim, mm = V.mm;
    // corte axial por defecto: el que más corteza motora primaria tiene
    const iM1 = V.nombres.indexOf('primary_motor_cortex');
    const porY = new Float64Array(NY); for (let q = 0; q < V.lab.length; q++) if (V.lab[q] === iM1) porY[Math.floor(q / NX) % NY]++;
    let jM = 0; porY.forEach((v, j) => { if (v > porY[jM]) jM = j; });
    const P = Object.assign({ f: jM / (NY - 1), region: 'primary_motor_cortex', lado: 'izq', dis: 'bloques', on: 20, off: 20, TR: 2, nV: 150, A: 2, ruido: 1, deriva: 2, umbral: 'p001', conHRF: true, sem: 1 }, mem.get('fm', {}));
    const VX = 3;                               // vóxel funcional de 3 mm
    const cv = h('canvas', { class: 'rm' }), cvS = h('canvas', { class: 'graf', width: 760, height: 200 }), cvX = h('canvas', { class: 'graf dm', width: 120, height: 200 }), cvH = h('canvas', { class: 'graf', width: 240, height: 120 });
    const res = h('div', { class: 'lectura' }), selR = h('select', { 'aria-label': 'Estructura activa' });
    let D = null, sel = null;

    function preparar() {
      const j = Math.round(P.f * (NY - 1));
      const w = Math.floor(NX / VX), hh = Math.floor(NZ / VX);
      // estructuras con sustancia gris presentes en esta losa
      const cuenta = new Map();
      for (let k = 0; k < NZ; k++) for (let i = 0; i < NX; i++) { const l = V.lab[i + NX * (j + NY * k)]; if (V.tej[l] === 'sg') cuenta.set(l, (cuenta.get(l) || 0) + 1); }
      const opts = [...cuenta].filter(([, c]) => c > 40).sort((a, b) => b[1] - a[1]).map(([l]) => V.nombres[l]);
      if (!opts.includes(P.region)) P.region = opts[0];
      selR.innerHTML = ''; for (const o of opts) selR.append(h('option', { value: o, selected: o === P.region }, nombreDe(o)));
      const iR = V.nombres.indexOf(P.region), xMid = -V.origen[0] / (mm / 10);   // índice de x = 0 (línea media)
      const lado = (i) => P.lado === 'ambos' || (P.lado === 'izq' ? i > xMid : i < xMid);   // x > 0: hemisferio izquierdo
      // por vóxel funcional: fracción activa, fracción de encéfalo y señal basal (ponderación T2 con TE 30 ms; T2 en lugar de T2*)
      const sec = { sec: 'se', TR: P.TR * 1000, TE: 30 }, base = V.tej.map(t => senal(t, '3', sec));
      const act = new Float32Array(w * hh), enc = new Float32Array(w * hh), S0 = new Float32Array(w * hh);
      for (let r = 0; r < hh; r++) for (let c = 0; c < w; c++) {
        let a = 0, e = 0, s = 0, nn = 0;
        for (let dj = -1; dj <= 1; dj++) for (let dk = 0; dk < VX; dk++) for (let di = 0; di < VX; di++) {
          const i = c * VX + di, k = NZ - 1 - (r * VX + dk), jj = j + dj; if (jj < 0 || jj >= NY || k < 0) continue;
          const l = V.lab[i + NX * (jj + NY * k)]; nn++; s += base[l];
          if (/^(sg|sb|mixto)$/.test(V.tej[l])) e++;
          if (l === iR && lado(i)) a++;
        }
        act[r * w + c] = a / nn; enc[r * w + c] = e / nn; S0[r * w + c] = s / nn;
      }
      // anatomía de fondo a 1 mm (ponderada en T1)
      const t1 = V.tej.map(t => senal(t, '3', { sec: 'se', TR: 500, TE: 10 }));
      const C = corte(V, 'axial', P.f), fondo = new Float32Array(C.w * C.h), borde = new Uint8Array(C.w * C.h);
      for (let q = 0; q < C.w * C.h; q++) fondo[q] = t1[C.d[q]];
      for (let r = 1; r < C.h - 1; r++) for (let c = 1; c < C.w - 1; c++) {
        const q = r * C.w + c, en = (qq) => C.d[qq] === iR && lado(qq % C.w);
        if (en(q) && (!en(q - 1) || !en(q + 1) || !en(q - C.w) || !en(q + C.w))) borde[q] = 1;
      }
      D = { w, hh, act, enc, S0, C, fondo, borde };
      simular();
    }

    function estimulo() {
      const dt = 0.1, n = Math.round(P.nV * P.TR / dt), e = new Float64Array(n), r = azar(P.sem * 7919 + 3);
      if (P.dis === 'bloques') for (let i = 0; i < n; i++) { const t = i * dt; e[i] = (t % (P.on + P.off)) >= P.off ? 1 : 0; }
      else { let t = 8; while (t < n * dt - 20) { const i0 = Math.round(t / dt); for (let i = i0; i < i0 + 10 && i < n; i++) e[i] = 1; t += 4 + r.u() * 8; } }
      return { e, dt };
    }

    function simular() {
      const { e, dt } = estimulo();
      const xV = regresor(e, dt, P.TR, P.nV, true), xM = regresor(e, dt, P.TR, P.nV, P.conHRF);
      const uno = new Float64Array(P.nV).fill(1), lin = Float64Array.from({ length: P.nV }, (_, i) => i / (P.nV - 1) - 0.5);
      const G = glm([xM, uno, lin], [1, 0, 0]);
      const { w, hh, act, enc, S0 } = D, r = azar(P.sem);
      let sMed = 0, nEnc = 0; for (let q = 0; q < w * hh; q++) if (enc[q] > 0.5) { sMed += S0[q]; nEnc++; } sMed /= nEnc || 1;
      const T = new Float32Array(w * hh).fill(NaN), Y = new Map();
      const fase = r.u() * 6.28;
      for (let q = 0; q < w * hh; q++) {
        if (enc[q] <= 0.5) continue;
        const y = new Float64Array(P.nV);
        for (let v = 0; v < P.nV; v++) {
          const deriva = P.deriva / 100 * S0[q] * (lin[v] + 0.5 * Math.sin(2 * Math.PI * v / P.nV * 1.5 + fase));
          y[v] = S0[q] * (1 + P.A / 100 * act[q] * xV[v]) + deriva + P.ruido / 100 * sMed * r.n();
        }
        const a = G.ajustar(y); T[q] = a.t; Y.set(q, y);
      }
      const nT = [...T].filter(v => !Number.isNaN(v)).length;
      const pU = P.umbral === 'p05' ? 0.05 : P.umbral === 'p001' ? 0.001 : 0.05 / nT, tc = tCrit(pU, G.gl);
      let vp = 0, fp = 0, act0 = 0;
      for (let q = 0; q < w * hh; q++) { if (Number.isNaN(T[q])) continue; const real = act[q] > 0; if (real) act0++; if (T[q] > tc) real ? vp++ : fp++; }
      Object.assign(D, { T, Y, tc, G, xM, xV, e, dt, lin, nT, vp, fp, act0 });
      if (sel == null || !Y.has(sel)) { let best = -1, bt = -1e9; for (const [q] of Y) if (act[q] > 0 && T[q] > bt) { bt = T[q]; best = q; } sel = best >= 0 ? best : Y.keys().next().value; }
      pintarMapa(); pintarSerie(); pintarDiseno();
      res.innerHTML = '';
      res.append(h('b', null, `${fmt(nT)} vóxeles probados`), ` · umbral t > ${fmt(tc, 2)} (gl = ${G.gl}, p ${P.umbral === 'bonf' ? '< 0,05 corregida por Bonferroni' : '< ' + fmt(pU, 3) + ' sin corregir'}) · `,
        h('span', { class: 'ok' }, `${vp} de ${act0} vóxeles activos detectados`), ' · ', h('span', { class: fp ? 'mal' : 'ok' }, `${fp} falsos positivos`));
      mem.set('fm', P);
    }

    function pintarMapa() {
      const { C, fondo, borde, w, hh, T, tc } = D, W = C.w, H = C.h;
      cv.width = W; cv.height = H;
      const g = cv.getContext('2d'), id = g.createImageData(W, H);
      let mx = 0; for (const v of fondo) if (v > mx) mx = v;
      for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
        const q = r * W + c, o = 4 * q; let R, Gg, B; R = Gg = B = fondo[q] / mx * 200;
        const fr = Math.floor(r / VX), fc = Math.floor(c / VX), t = fr < hh && fc < w ? T[fr * w + fc] : NaN;
        if (t > tc) { const k = Math.min(1, (t - tc) / (3 * tc)); R = 255; Gg = 60 + 195 * k; B = 20 * k; }
        if (borde[q]) { R = 80; Gg = 220; B = 255; }
        if (sel != null && fr * w + fc === sel && (r % VX === 0 || c % VX === 0 || r % VX === VX - 1 || c % VX === VX - 1)) { R = 255; Gg = 255; B = 255; }
        id.data[o] = R; id.data[o + 1] = Gg; id.data[o + 2] = B; id.data[o + 3] = 255;
      }
      g.putImageData(id, 0, 0);
    }
    function ejes(G, w, hh) { G.clearRect(0, 0, w, hh); G.font = '12px system-ui'; G.strokeStyle = '#263041'; G.lineWidth = 1; }
    function pintarSerie() {
      const { Y, G: M, xM, e, dt } = D, y = Y.get(sel); if (!y) return;
      const a = M.ajustar(y), w = cvS.width, hh = cvS.height, x0 = 8, x1 = w - 8, y0 = hh - 22, y1 = 12;
      const G = cvS.getContext('2d'); ejes(G, w, hh);
      let lo = Infinity, hi = -Infinity; for (const v of y) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
      const X = (v) => x0 + v / (P.nV - 1) * (x1 - x0), Yp = (v) => y0 - (v - lo) / (hi - lo || 1) * (y0 - y1);
      G.fillStyle = 'rgba(230,181,102,.13)'; for (let i = 0; i < e.length; i++) if (e[i]) G.fillRect(X(i * dt / P.TR), y1, Math.max(1, (x1 - x0) / (P.nV - 1) * dt / P.TR), y0 - y1);
      G.strokeStyle = '#7a8394'; G.lineWidth = 1.2; G.beginPath(); y.forEach((v, i) => i ? G.lineTo(X(i), Yp(v)) : G.moveTo(X(i), Yp(v))); G.stroke();
      G.strokeStyle = '#e6b566'; G.lineWidth = 2.2; G.beginPath(); a.fit.forEach((v, i) => i ? G.lineTo(X(i), Yp(v)) : G.moveTo(X(i), Yp(v))); G.stroke();
      G.fillStyle = '#aab1bf'; G.fillText(`vóxel seleccionado · fracción activa ${fmt(D.act[sel] * 100)} % · β tarea = ${fmt(a.b[0], 2)} · t = ${fmt(a.t, 2)}`, x0 + 4, hh - 5);
      G.fillStyle = '#e6b566'; G.fillText('modelo ajustado', w - 120, hh - 5);
    }
    function pintarDiseno() {
      const { xM, lin } = D, G = cvX.getContext('2d'), w = cvX.width, hh = cvX.height; ejes(G, w, hh);
      const cols = [xM, new Float64Array(P.nV).fill(1), lin], cw = w / 3;
      cols.forEach((col, k) => { let lo = Math.min(...col), hi = Math.max(...col); if (hi === lo) { lo -= 1; } for (let v = 0; v < P.nV; v++) { const g = Math.round((col[v] - lo) / (hi - lo) * 255); G.fillStyle = `rgb(${g},${g},${g})`; G.fillRect(k * cw + 1, v / P.nV * hh, cw - 2, hh / P.nV + 1); } });
      const K = hrf(0.1), Gh = cvH.getContext('2d'), wh = cvH.width, hh2 = cvH.height; ejes(Gh, wh, hh2);
      const mx = Math.max(...K), mn = Math.min(...K), yb = (v) => 12 + (mx - v) / (mx - mn) * (hh2 - 34);
      Gh.beginPath(); Gh.moveTo(6, yb(0)); Gh.lineTo(wh - 6, yb(0)); Gh.stroke();
      Gh.strokeStyle = '#e6b566'; Gh.lineWidth = 2; Gh.beginPath(); K.forEach((v, i) => { const X = 6 + i / (K.length - 1) * (wh - 12); i ? Gh.lineTo(X, yb(v)) : Gh.moveTo(X, yb(v)); }); Gh.stroke();
      Gh.fillStyle = '#aab1bf'; Gh.fillText('HRF canónica (0–32 s)', 8, hh2 - 6);
    }
    cv.addEventListener('click', (ev) => {
      const r = cv.getBoundingClientRect(), c = Math.floor((ev.clientX - r.left) / r.width * D.C.w / VX), f = Math.floor((ev.clientY - r.top) / r.height * D.C.h / VX);
      const q = f * D.w + c; if (D.Y.has(q)) { sel = q; pintarMapa(); pintarSerie(); }
    });
    selR.addEventListener('change', () => { P.region = selR.value; sel = null; preparar(); });
    const onoff = h('div', null, desl('Tarea', 4, 40, 2, P.on, v => fmt(v) + ' s', v => { P.on = v; simular(); }), desl('Reposo', 4, 40, 2, P.off, v => fmt(v) + ' s', v => { P.off = v; simular(); }));
    onoff.hidden = P.dis !== 'bloques';
    const ui = h('div', null,
      h('div', { class: 'sim' },
        h('div', { class: 'visor' }, cv, h('p', { class: 'nota' }, 'Fondo: anatomía ponderada en T1 (1 mm). Color: vóxeles de 3 mm que superan el umbral. Celeste: borde de la región que de verdad responde. Haz clic en un vóxel para ver su serie.')),
        h('div', { class: 'mandos' },
          h('h3', null, 'Qué responde'), selR, seg([['izq', 'Izquierda'], ['der', 'Derecha'], ['ambos', 'Ambos lados']], P.lado, v => { P.lado = v; sel = null; preparar(); }),
          desl('Corte axial', 0.3, 0.95, 0.005, P.f, v => fmt(v * 100) + ' %', v => { P.f = v; sel = null; preparar(); }),
          h('h3', null, 'Diseño'), seg([['bloques', 'Bloques'], ['eventos', 'Eventos']], P.dis, v => { P.dis = v; onoff.hidden = v !== 'bloques'; simular(); }), onoff,
          desl('TR', 0.5, 4, 0.5, P.TR, v => fmt(v, 1) + ' s', v => { P.TR = v; preparar(); }), desl('Volúmenes', 40, 400, 10, P.nV, v => fmt(v), v => { P.nV = v; simular(); }),
          h('h3', null, 'Señal y ruido'), desl('BOLD', 0, 6, 0.1, P.A, v => fmt(v, 1) + ' %', v => { P.A = v; simular(); }), desl('Ruido', 0, 6, 0.1, P.ruido, v => fmt(v, 1) + ' %', v => { P.ruido = v; simular(); }), desl('Deriva', 0, 10, 0.5, P.deriva, v => fmt(v, 1) + ' %', v => { P.deriva = v; simular(); }),
          h('div', { class: 'marcas' }, h('button', { class: 'marca-ch', onclick: () => { P.sem++; simular(); } }, 'Otra realización del ruido')),
          h('h3', null, 'Análisis'), seg([['p05', 'p < 0,05'], ['p001', 'p < 0,001'], ['bonf', 'Bonferroni']], P.umbral, v => { P.umbral = v; simular(); }),
          seg([['1', 'Regresor con HRF'], ['0', 'Sin convolución']], P.conHRF ? '1' : '0', v => { P.conHRF = v === '1'; simular(); }))),
      res,
      h('div', { class: 'fila-graf' }, h('figure', null, cvS, h('figcaption', null, 'Serie temporal del vóxel (gris), bloques de tarea (sombreado) y modelo ajustado (dorado)')), h('figure', null, cvX, h('figcaption', null, 'Matriz de diseño: tarea, constante, deriva')), h('figure', null, cvH, h('figcaption', null, 'Respuesta hemodinámica'))));
    preparar();
    return [ui,
      h('h2', null, 'Del estímulo al mapa'),
      h('p', null, 'La fMRI no mide la actividad neuronal sino una consecuencia vascular: la desoxihemoglobina es paramagnética y actúa como un contraste natural, de modo que los cambios de oxigenación de la sangre alteran la señal (contraste BOLD, Ogawa y colaboradores, 1990).'),
      h('p', null, 'El simulador construye la señal de cada vóxel como su intensidad basal más una respuesta proporcional a la fracción del vóxel que pertenece a la estructura elegida, más una deriva lenta y ruido gaussiano. La respuesta esperada es el estímulo convolucionado con la HRF canónica de SPM, que tiene su pico hacia los 5 s y un rebote negativo posterior.'),
      h('p', null, 'El análisis es un modelo lineal general por vóxel: Y = Xβ + ε, con una columna para la tarea, una constante y una deriva lineal. Para cada vóxel se estima β por mínimos cuadrados y se calcula t = cβ / √(σ² c(XᵀX)⁻¹cᵀ), con c = [1 0 0]. Como el simulador sabe qué vóxeles responden de verdad, cuenta aciertos y falsos positivos.'),
      caja('Para probar', h('ul', null,
        h('li', null, 'Baja el umbral a p < 0,05 sin corregir: aparecen falsos positivos repartidos por todo el corte. Con miles de pruebas, el 5 % de ellas sale «significativo» por azar.'),
        h('li', null, 'Quita la convolución con la HRF: el modelo llega antes que la señal y pierde sensibilidad.'),
        h('li', null, 'Con bloques muy cortos (4 s), la HRF suaviza la alternancia y la señal casi desaparece.'),
        h('li', null, 'Fíjate en los vóxeles del borde de la región: solo una parte de su volumen responde (volumen parcial) y su t es menor.'))),
      caja('Límites del modelo', h('p', null, 'La amplitud del BOLD, el ruido y la deriva son parámetros del simulador, no valores medidos. El ruido es blanco (las series reales tienen autocorrelación), la señal basal usa T2 en lugar de T2* (no hay un valor de T2* verificado en las fuentes leídas), no hay movimiento ni suavizado espacial, y la activación sigue el contorno de una estructura del atlas, no un mapa funcional real.')),
      fuentes('spm', 'friston', 'ogawa', 'west', 'atlas')];
  }

  async function abrir(id) {
    parar(); parar = () => { };
    const t = HERRAMIENTAS.find(x => x.id === id); actual = t ? t.id : null;
    menu(); $('#der').innerHTML = '';
    const pag = $('#pagina'); pag.innerHTML = '';
    const hoja = h('div', { class: 'hoja ancha' });
    pag.append(hoja); pag.scrollTop = 0;
    app.ruta('#imagen' + (t ? '/' + t.id : ''));
    if (!t) { hoja.replaceWith(portada()); return; }
    hoja.append(h('div', { class: 'sobre' }, `Neuroimagen · simulador ${HERRAMIENTAS.indexOf(t) + 1} de ${HERRAMIENTAS.length}`), h('h1', null, t.n), h('p', { class: 'bajada' }, t.sub));
    const espera = h('p', { class: 'nota' }, 'Cargando el volumen…'); hoja.append(espera);
    try {
      const cont = await ({ resonancia, 'espacio-k': espacioK, bloch, fmri })[t.id]();
      if (actual !== t.id) return;
      espera.remove(); hoja.append(...cont.flat());
      const us = (app.mods.curso?.UNIDADES || []).filter(u => u.html.includes('"i:' + t.id + '"'));
      if (us.length) hoja.append(h('h3', null, 'Unidades del curso que usan este simulador'), h('p', null, us.map(u => h('button', { class: 'ver3d', onclick: () => app.ir('curso', u.id) }, `◈ ${u.rot}. ${u.n}`))));
    } catch (e) { console.error(e); espera.textContent = 'No se pudo cargar el simulador: ' + (e.message || e); }
  }

  return { entrar: (arg) => abrir(HERRAMIENTAS.some(t => t.id === arg) ? arg : actual), salir() { parar(); parar = () => { }; } };
}
