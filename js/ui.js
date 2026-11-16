// Utilidades mínimas de interfaz.
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Crea un elemento: h('div', {class:'x', onclick: f}, hijos...) */
export function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (k === 'class') e.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(e.style, v);
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) e.append(k.nodeType ? k : document.createTextNode(k));
  return e;
}

/** Atributos para que un elemento de lista se pueda enfocar con Tab y activar con Intro o espacio (ver main.js). */
export const TECLA = { tabindex: 0, role: 'button', 'data-tecla': '' };

export const sinAcentos = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Almacén local tolerante a fallos. */
export const mem = {
  get(k, d) { try { const v = localStorage.getItem('neuroatlas:' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('neuroatlas:' + k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } },
};

export const ICO = {
  color: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.5"/><circle cx="8.5" cy="10" r="1.2" fill="currentColor"/><circle cx="12" cy="7.8" r="1.2" fill="currentColor"/><circle cx="15.5" cy="10" r="1.2" fill="currentColor"/><path d="M12 20.5c-1.5 0-2-1.5-1-2.6s.4-2.4 2-2.4h2.2c2.3 0 3.3-1.6 3.3-3.5"/></svg>',
  corte: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M12 3v18" stroke-dasharray="2.5 2.5"/></svg>',
  hemi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 4v16M12 5C8 3.5 4 6.5 4.5 11c-1 3 1 6.5 4 6.5 1 1.6 2.5 2 3.5 1.5M12 5c4-1.5 8 1.5 7.5 6 1 3-1 6.5-4 6.5-1 1.6-2.5 2-3.5 1.5"/></svg>',
  explota: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M5 5l3 3M19 5l-3 3M5 19l3-3M19 19l-3-3M5 5h3M5 5v3M19 5h-3M19 5v3M5 19h3M5 19v-3M19 19h-3M19 19v-3"/></svg>',
  etq: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12V5h7l9 9-7 7z"/><circle cx="8.5" cy="9.5" r="1.3" fill="currentColor"/></svg>',
  vista: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  inicio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12a8 8 0 1 0 2.5-5.8"/><path d="M4 4v4.5h4.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z"/></svg>',
  pausa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>',
};
