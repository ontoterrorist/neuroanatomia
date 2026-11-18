// Ayudas para redactar lecciones. Las comparten curso-0.js, curso-1.js y curso-2.js.
// v(acción, texto) crea un enlace «ver en 3D». Acciones: e:estructura · v:vía · m:microescala · vista:nombre · l:unidad · i:simulador de neuroimagen
export const v = (a, t) => `<button class="ver3d" data-a="${a}">◈ ${t}</button>`;
export const clave = (t, c) => `<div class="clave"><h4>${t}</h4>${c}</div>`;
export const clin = (c) => `<div class="clave clin"><h4>Correlación clínica</h4>${c}</div>`;
export const tabla = (cab, filas) => `<table class="t"><tr>${cab.map(c => `<th>${c}</th>`).join('')}</tr>${filas.map(f => `<tr>${f.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`;
