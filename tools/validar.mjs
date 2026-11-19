// Valida las referencias cruzadas del contenido: enlaces del curso, preguntas, vías y fichas.
// Uso: node tools/validar.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const R = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imp = (f) => import('file://' + path.join(R, f).replace(/\\/g, '/'));
const [c0, c1, c2, c3, pr, vi, mo, mi, ea, eb, cu, ne] = await Promise.all(['data/curso-0.js', 'data/curso-1.js', 'data/curso-2.js', 'data/curso-3.js', 'data/preguntas.js', 'data/vias.js', 'data/moleculas.js', 'data/micro.js', 'data/estructuras-a.js', 'data/estructuras-b.js', 'data/cuerpo.js', 'data/nervios.js'].map(imp));
const cat = { ...ea.A, ...eb.B, ...cu.CUERPO, ...ne.NERVIOS };
const man = Object.assign({}, ...['encefalo', 'cuerpo', 'nervios'].map(f => JSON.parse(fs.readFileSync(path.join(R, 'assets', f + '.json'), 'utf8'))));
const U0 = c0.SEMESTRE_0.unidades, U3 = c3.SEMESTRE_3.unidades, U = [...U0, ...c1.SEMESTRE_1.unidades, ...c2.SEMESTRE_2.unidades, ...U3], ids = new Set(U.map(u => u.id));
const vias = new Set(vi.VIAS.map(x => x.id));
const micro = new Set(['c:corteza', 'c:cerebelo', 'c:medula', 'n:neurona', 'n:glia', ...Object.keys(mi.SINAPSIS).map(k => 's:' + k), ...mo.PROTEINAS.map(x => 'p:' + x.id), ...mo.MOLECULAS.map(x => 'q:' + x.id)]);
const { HERRAMIENTAS } = await imp('js/imagen.js');
const imagenes = new Set(HERRAMIENTAS.map(x => x.id));
const vistas = new Set(['encefalo', 'interior', 'cabeza', 'vasos', 'neuroeje', 'cuerpo']);
let bad = 0; const err = (...a) => { console.log('  ✗', ...a); bad++; };
const enlace = (a, donde) => { const i = a.indexOf(':'), t = a.slice(0, i), id = a.slice(i + 1); const ok = t === 'e' ? !!cat[id] && (man[id] || man[id + '_L']) : t === 'v' ? vias.has(id) : t === 'm' ? micro.has(id) : t === 'vista' ? vistas.has(id) : t === 'l' ? ids.has(id) : t === 'i' ? imagenes.has(id) : false; if (!ok) err('enlace', donde, a); };
if (!fs.existsSync(path.join(R, 'assets', 'volumen.bin'))) err('falta assets/volumen.bin (node tools/build-volumen.mjs)');
let palabras = 0;
const contar = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
for (const u of U) {
  for (const m of u.html.matchAll(/data-a="([^"]+)"/g)) enlace(m[1], u.id);
  for (const r of u.rel || []) if (!cat[r]) err('rel', u.id, r);
  palabras += contar(u.html);
}
// Semestre 0: formato fijado en docs/unidad-0/diseno.md (3-4 objetivos, 500-700 palabras, un recuadro «Cómo se sabe», un botón v(), id u0-NN).
const avisos = [];
U0.forEach((u, i) => {
  const w = contar(u.html);
  if (u.id !== 'u0-' + String(i + 1).padStart(2, '0')) err('id fuera de orden', u.id);
  if (u.obj.length < 3 || u.obj.length > 4) err('objetivos 3-4', u.id, u.obj.length);
  if (!u.html.includes('<h4>Cómo se sabe</h4>')) err('falta «Cómo se sabe»', u.id);
  if (!u.html.includes('class="ver3d"')) err('sin botón v()', u.id);
  if (w < 500 || w > 700) avisos.push(`${u.id}: ${w} palabras`);
});
// Semestre III: mismo formato, ids u35..u50 (docs/semestre-3/diseno.md).
U3.forEach((u, i) => {
  const w = contar(u.html);
  if (u.id !== 'u' + (35 + i)) err('id fuera de orden', u.id);
  if (u.obj.length < 3 || u.obj.length > 4) err('objetivos 3-4', u.id, u.obj.length);
  if (!u.html.includes('<h4>Cómo se sabe</h4>')) err('falta «Cómo se sabe»', u.id);
  if (!u.html.includes('class="ver3d"')) err('sin botón v()', u.id);
  if (w < 500 || w > 700) avisos.push(`${u.id}: ${w} palabras`);
});
const porU = {};
for (const q of pr.PREGUNTAS) { porU[q[0]] = (porU[q[0]] || 0) + 1; if (!ids.has(q[0]) || q[2].length !== 4 || new Set(q[2]).size !== 4) err('pregunta', q[0], q[1].slice(0, 40)); }
for (const q of pr.CASOS) { if (!ids.has(q[0]) || q[2].length !== 4) err('caso', q[1].slice(0, 40)); enlace(q[4], 'caso'); }
for (const s of Object.values(mi.SINAPSIS)) for (const [id] of s.enlaces) if (!micro.has(id)) err('sinapsis', id);
for (const v of vi.VIAS) { const chk = (r) => { const id = typeof r === 'string' ? r : r.en; if (id && !man[id] && !man[id + '_L']) err('vía', v.id, id); }; for (const t of v.tramos) t.pts.forEach(chk); for (const p of v.pasos) chk(p.en); for (const b of v.solidos || []) if (!cat[b]) err('sólido', v.id, b); }
for (const k of Object.keys(man)) if (!cat[k.replace(/_(L|R)$/, '')]) err('malla sin ficha', k);
for (const p of mo.PROTEINAS) if (!fs.existsSync(path.join(R, 'assets', 'prot', p.id + '.json'))) err('proteína sin datos', p.id);
const mj = JSON.parse(fs.readFileSync(path.join(R, 'assets', 'moleculas.json'), 'utf8'));
for (const m of mo.MOLECULAS) if (!mj[m.id]) err('molécula sin datos', m.id);
const w = (o) => JSON.stringify(o).split(/\s+/).length;
console.log(`unidades ${U.length} · palabras del curso ${palabras} · preguntas ${pr.PREGUNTAS.length} · casos ${pr.CASOS.length} · vías ${vi.VIAS.length} · fichas ${Object.keys(cat).length} · proteínas ${mo.PROTEINAS.length} · moléculas ${mo.MOLECULAS.length}`);
console.log(`palabras: fichas ${w(cat)} · vías ${w(vi.VIAS)} · moléculas ${w(mo.PROTEINAS) + w(mo.MOLECULAS)} · microescala ${w(mi.SINAPSIS) + w(mi.CIRCUITOS) + w(mi.PARTES)}`);
for (const u of [...U0, ...U3]) if ((porU[u.id] || 0) < 4) err('Semestre 0/III: unidad con menos de 4 preguntas', u.id, porU[u.id] || 0);
console.log('Semestres 0 y III fuera de 500-700 palabras:', avisos.join(' · ') || 'ninguna');
console.log('unidades sin preguntas:', U.filter(u => !porU[u.id]).map(u => u.id).join(' ') || 'ninguna');
console.log(bad ? `${bad} errores` : 'sin errores');
process.exit(bad ? 1 : 0);
