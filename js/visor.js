// Visor dividido del curso: la lección a un lado y, al otro, una segunda instancia del Neuroatlas incrustada
// (?embed=1) que muestra el modelo 3D, la vía, la escena microscópica o el simulador de imagen del enlace apretado.
// Es una instancia aparte porque el lienzo WebGL, el panel izquierdo y la ficha son únicos en la página madre.
import { $, h } from './ui.js';

/**
 * @param app   la aplicación (para volver a «pantalla completa»)
 * @param alIr  se llama con el id de una unidad cuando el visor pide abrir otra lección
 */
export function crearVisor(app, alIr) {
  const raiz = $('#visor'), cuerpo = $('.visor-cuerpo', raiz), titulo = $('.visor-t', raiz);
  let marco = null, listo = false, pendiente = null, dir = null;

  const enviar = (a) => marco.contentWindow.postMessage({ neuro: 'accion', a }, location.origin);

  function cerrar() { raiz.hidden = true; $('#app').classList.remove('dividido'); }

  function abrir(a, rotulo) {
    if (!a) return;
    raiz.hidden = false; $('#app').classList.add('dividido');
    titulo.textContent = rotulo || '';
    if (!marco) {
      marco = h('iframe', { title: 'Modelo o simulador', src: location.pathname + '?embed=1#atlas', allow: 'fullscreen' });
      cuerpo.append(marco);
      pendiente = a;
    } else if (listo) enviar(a);
    else pendiente = a;
  }

  addEventListener('message', (e) => {
    if (e.origin !== location.origin || !marco || e.source !== marco.contentWindow) return;
    const d = e.data || {};
    if (d.neuro === 'listo') { listo = true; if (pendiente) { enviar(pendiente); pendiente = null; } }
    else if (d.neuro === 'ruta') dir = d.dir;
    else if (d.neuro === 'ir') {
      if (d.modo === 'curso') alIr(d.arg);
      else { cerrar(); app.ir(d.modo); }
    }
  });

  $('.visor-x', raiz).addEventListener('click', cerrar);
  $('.visor-full', raiz).addEventListener('click', () => {
    if (!dir) return;
    let d = dir.slice(1); try { d = decodeURIComponent(d); } catch { /* tal cual */ }
    const i = d.indexOf('/'); cerrar();
    app.ir(i < 0 ? d : d.slice(0, i), i < 0 ? undefined : d.slice(i + 1));
  });

  return { abrir, cerrar };
}
