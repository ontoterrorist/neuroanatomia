# Prompt: Semestre III · Neuroimagen para el Neuroatlas

> Pégalo en una sesión nueva abierta en `~/.claude/neuroanatomia`. Redactado el 2026-11-19 a partir de `docs/semestre-3/diseno.md`. Los temarios y las fuentes de la sección 3 se leyeron el 2026-11-18 en las URL indicadas.
>
> **Estado actual:** este trabajo ya se hizo una vez (commits `42c2fbd` y `ce75684`). El prompt sirve para rehacerlo, revisarlo o ampliarlo con el mismo método. Si lo usas sobre el repo actual, empieza por la sección 9.

---

## 1. Qué hay que hacer

Agrega al curso del Neuroatlas un **Semestre III · Neuroimagen: de la física al mapa funcional**, después del Semestre II. Debe cubrir lo que se ve en un curso universitario de un semestre de resonancia magnética funcional: la física de la imagen, el contraste, la fisiología de la señal, el diseño de experimentos y el análisis estadístico. Va acompañado de una sección **Imagen** con simuladores de RM y fMRI que escanean la cabeza del propio atlas.

La regla principal es **no inventar nada**. Cada afirmación, cifra, parámetro de simulador, experimento o fecha que entre en la app tiene que venir de una fuente que hayas abierto y leído en esta sesión, y quedar anotada en el libro de fuentes (sección 4). Lo que no puedas verificar no se escribe: se anota como pendiente y se me informa.

## 2. Contexto del proyecto (léelo antes de empezar)

- App estática en español, sin compilación. Curso en `data/curso-0*.js` (Semestre 0, unidades 0.1–0.16, ids `u0-01`…`u0-16`), `data/curso-1.js` (u01–u17) y `data/curso-2.js` (u18–u34), renderizado por `js/curso.js` con `CURSO = [SEMESTRE_0, SEMESTRE_1, SEMESTRE_2]`. La numeración se calcula en `curso.js`: el Semestre 0 se rotula 0.x y los demás siguen 1, 2, 3… sin correrse, así que las nuevas unidades serán **35–50** (ids `u35`…`u50`).
- Ayudas de redacción en `data/ayudas-curso.js`: `v(acción, texto)` para el botón «◈», `clave(título, html)`, `clin(html)` para la correlación clínica y `tabla(cabeceras, filas)`. Acciones válidas: `e:` estructura del atlas, `v:` vía, `m:` microescala, `vista:` (encefalo, interior, cabeza, vasos, neuroeje, cuerpo), `l:` unidad del curso e `i:` simulador de neuroimagen.
- Preguntas con el formato `[unidad, enunciado, [correcta, d1, d2, d3], explicación]`, siempre con la correcta en primer lugar. Las del Semestre 0 viven en `data/preguntas-0.js` y se importan en `data/preguntas.js`; haz lo mismo con `data/preguntas-3.js`.
- La evaluación (`js/quiz.js`) filtra por rangos de id con `esDe(q, a, b)`: el Semestre II es 18–34 y el III será 35–50.
- `node tools/validar.mjs` comprueba todos los enlaces cruzados y el formato de las unidades del Semestre 0 (objetivos, palabras, «Cómo se sabe», botón `v()`, ≥ 4 preguntas). Extiende esas comprobaciones al Semestre III.
- Unidades ya escritas que no hay que repetir, solo enlazar: u07 (meninges y LCR), **u08 (irrigación del encéfalo)**, u17 (corteza y sustancia blanca), **0.7 (metabolismo energético)** y **0.13 (glía en la señalización)**.
- La vista previa es la configuración `neuroanatomia` (puerto 8830) de `~/.claude/.claude/launch.json`. El navegador cachea los módulos: recarga con `fetch(url, {cache:'reload'})` antes de `location.reload()`.
- La ruta tiene un espacio («Eric Pezoa»): en Bash usa `"$HOME/..."` entre comillas y en Node `fileURLToPath`/`pathToFileURL`. Los archivos del repo tienen finales de línea CRLF en la copia de trabajo: si reemplazas texto con un script, normaliza a `\n` y vuelve a CRLF.
- Los textos no han pasado por revisión de especialistas (así lo dicen los créditos y el README). Mantén esa advertencia.

## 3. Temario: de dónde sale

Columna vertebral: **MIT OCW HST.583 *Functional Magnetic Resonance Imaging: Data Acquisition and Analysis*** (otoño 2008, Gollub y otros). Sílabo y calendario: https://ocw.mit.edu/courses/hst-583-functional-magnetic-resonance-imaging-data-acquisition-and-analysis-fall-2008/pages/syllabus/. Sus siete partes: 1 Panorama · 2 Sistemas neurales funcionales (anatomía cerebrovascular y seguridad) · 3 Física de la adquisición · 4 Fisiología de la imagen (basal, activación, BOLD, técnicas no BOLD, perfusión y difusión) · 5 Diseño experimental · 6 Análisis estadístico (preprocesamiento, nivel 1, nivel 2, comparaciones múltiples, exploratorio, causalidad) · 7 Estructura y función. El libro del curso (Huettel, Song y McCarthy, *Functional Magnetic Resonance Imaging*, 2.ª ed. 2009) es comercial: sirve como mapa, no como respaldo.

Unidades (una por semana, 16 en total):

| Unidad | Título | HST.583 | Simulador / enlaces |
| --- | --- | --- | --- |
| 35 | Panorama: qué mide la neuroimagen estructural y la funcional | Parte 1 | `i:resonancia`, `i:fmri` |
| 36 | Seguridad en RM y ética de la investigación con personas | ses. 2–3 | `i:bloch` |
| 37 | Física I: espín, resonancia y relajación | ses. 6 | `i:bloch` |
| 38 | Física II: el contraste (T1, T2, DP, inversión-recuperación) | ses. 7 | `i:resonancia` |
| 39 | Física III: gradientes, selección de corte y espacio k | ses. 8 | `i:espacio-k` |
| 40 | Secuencias rápidas y artefactos | ses. 8, lab. 4 | `i:espacio-k` |
| 41 | Anatomía cerebrovascular y regulación del flujo | ses. 5 | `vista:vasos`, `l:u08`, `m:n:glia` |
| 42 | Fisiología de la señal: metabolismo basal y acoplamiento neurovascular | ses. 9–10 | `l:u0-07`, `m:c:cerebelo` |
| 43 | El contraste BOLD | ses. 11 | `i:fmri`, `i:bloch` |
| 44 | Más allá del BOLD: perfusión y difusión | ses. 12–13 | `v:corticoespinal` |
| 45 | Diseño experimental: bloques y eventos | ses. 14–15 | `i:fmri` |
| 46 | Preprocesamiento: movimiento, registro, normalización y suavizado | ses. 16, 24 | `e:anterior_commissure` |
| 47 | Modelo lineal general (primer nivel) | ses. 16–18 | `i:fmri` |
| 48 | Análisis de grupo y comparaciones múltiples | ses. 19–20 | `i:fmri` (Bonferroni) |
| 49 | Análisis exploratorio y conectividad | ses. 21, 25 | `l:u42` |
| 50 | Estructura y función: morfometría, superficie cortical y biomarcadores | ses. 22–23 | `vista:encefalo` |

Puedes reordenar o fusionar unidades si las fuentes lo justifican. Explica el cambio en el diseño.

## 4. Política de fuentes

### 4.1 Qué cuenta como fuente válida

1. **Texto abierto de física:** Hornak, *The Basics of MRI* (https://www.cis.rit.edu/htbooks/mri/), con derechos de autor: parafrasear y citar. Ojo con la numeración: el capítulo 12 («Fast imaging techniques») está en `chap-8/chap-8a.htm`, el 13 («Advanced imaging techniques») en `chap-12/chap-12.htm` y el 14 («Your MRI exam») en `chap-13/chap-13.htm`. Las páginas vienen en latin-1.
2. **Revisiones de acceso abierto** que ya se probaron útiles:
   - Glover 2011, «Overview of functional magnetic resonance imaging» (PMC3073717): BOLD, comparación de técnicas, diseño, preprocesamiento.
   - Soares et al. 2016, «A hitchhiker’s guide to functional MRI», *Front Neurosci* (CC BY, PMC5102908): diseño, artefactos, preprocesamiento, análisis, estadística.
   - Soares et al. 2013, «A hitchhiker’s guide to diffusion tensor imaging» (CC BY, PMC3594764).
   - Lindquist 2008, «The statistical analysis of fMRI data», *Statistical Science* (arXiv:0906.3662).
   - Attwell et al. 2010, «Glial and neuronal control of brain blood flow», *Nature* (PMC3206737).
   - Alsop et al. 2015, consenso de ASL (PMC4190138); Hartwig et al. 2009, seguridad en RM (CC BY, PMC2705217); Fischl 2012, «FreeSurfer» (PMC3685476).
   - West et al. 2013, *PLoS ONE* (CC BY): R1, R2 y PD de sustancia blanca, gris y LCR a 1,5 y 3 T (tabla 1).
3. **Ética:** Declaración de Helsinki de la Asociación Médica Mundial, versión de octubre de 2024 (wma.net).
4. **Literatura primaria** para los recuadros «Cómo se sabe», verificada con los MCP `openalex` o `semantic-scholar` (`ver_paper`) y leída al menos en su resumen: Kwong 1992, Ogawa 1990, Fox y Raichle 1986, Raichle 2001, Logothetis 2001, Buxton 1998, Detre 1992, Le Bihan 1986, Basser 1994, Glover 1999, Friston 1994, Worsley 1992, Genovese 2002, Eklund 2016, Biswal 1995, Power 2012, Ashburner y Friston 2000.
5. **Código como fuente de un parámetro:** `spm_hrf.m` de SPM (GitHub spm/spm) para la HRF canónica.

### 4.2 Qué no usar

- OpenStax (prohíbe la ingesta en modelos de IA), Wikipedia como fuente, blogs, apuntes de estudiantes, resúmenes generados por IA.
- Tu memoria. Si algo «lo sabes» pero no lo encuentras en una fuente abierta en esta sesión, no entra.

### 4.3 Cómo conseguir los textos

- **Europe PMC** (`/europepmc/webservices/rest/search` y `/{PMCID}/fullTextXML`) para los artículos de acceso abierto. Si dice `isOpenAccess: N` pero hay PMCID, prueba **NCBI efetch** (`db=pmc&rettype=xml`): los manuscritos de autor suelen venir completos con licencia de minería de texto.
- **arXiv** para PDF completos (`pdftotext -enc UTF-8`).
- **Crossref** (`api.crossref.org/works/<doi>`) para verificar una cita cuando OpenAlex (503) o Semantic Scholar (429) fallan.
- Wiley (`onlinelibrary.wiley.com/doi/pdfdirect/...`) devuelve 403: no insistas.
- Cuidado con resúmenes que pierden símbolos (por ejemplo, el de Wansapura 1999 perdió los asteriscos de T2* y no se puede usar).

### 4.4 Reglas de verificación

- **Libro de fuentes** en `docs/semestre-3/fuentes.md`, ordenado por unidad: por cada afirmación sustantiva, la fuente (obra, capítulo o sección, URL o identificador) y el pasaje que la respalda, citado en menos de 15 palabras o parafraseado con fidelidad. Los párrafos sin entrada se borran.
- **Cifras:** solo valores publicados, con su campo magnético, especie o preparación. Si derivas un número (frecuencia de Larmor, T1 = 1/R1, TI que anula un tejido), calcúlalo con un script en `calculos/` y cítalo.
- **Consenso y debate:** si una fuente presenta un tema como abierto (por ejemplo, la regulación del flujo en los capilares o la inferencia por cúmulos), preséntalo como debate y cita las posturas.
- **Correlación clínica:** un recuadro `clin()` solo si la fuente relaciona explícitamente el mecanismo con la clínica.
- **Normas que cambian** (implantes, marcapasos, límites de SAR): da la cifra con su fuente y su año, y remite al protocolo de cada centro.
- **Pendientes:** lo que no puedas verificar va a `docs/semestre-3/pendientes.md`, no a la app.
- **Copyright:** redacta con tus palabras. Nada de párrafos parafraseados de cerca ni figuras copiadas.

## 5. Forma de cada unidad

- `id`: `u35` … `u50`. `n`: título. `baj`: subtítulo de una línea. `obj`: 3–4 objetivos. `rel`: estructuras del atlas solo si vienen al caso (comprueba que existan en `assets/encefalo.json`). `html`: el cuerpo.
- **500–700 palabras**, párrafos cortos, `<h3>` por apartado, `<strong>` para los términos clave.
- En cada unidad:
  - al menos un botón `v()` a un simulador, una vía, una estructura o una unidad;
  - un recuadro `clave('Cómo se sabe', …)` con el experimento o la técnica que estableció la idea central, con su referencia verificada, y la frase que diga qué se leyó («Leí el resumen», «Solo verifiqué la cita»);
  - una tabla cuando ordene mejor la información;
  - al pie, `<p><small>Fuentes: …</small></p>`.
- **Preguntas:** al menos 4 por unidad en `data/preguntas-3.js`. Cada explicación debe poder rastrearse al libro de fuentes; los distractores, plausibles y claramente falsos según la fuente.

## 6. Simuladores (sección «Imagen»)

Una pestaña nueva **Imagen** en la barra (modo `imagen` en `js/main.js`, página en `#pagina` como el curso), con la física separada del DOM:

- `js/imagen-fisica.js`: ecuaciones de señal (eco de espín e inversión-recuperación, Hornak cap. 10), TI que anula un tejido, cortes del volumen, FFT 2D, HRF canónica de SPM, GLM por vóxel y distribución t. Pruebas en `tools/probar-imagen.mjs` (contraste esperado, anulación, FFT ida y vuelta, HRF que suma 1 con pico ~5 s, GLM que recupera β conocidos).
- `data/neuroimagen.js`: tiempos de relajación y densidad protónica con su fuente; todo lo que sea decisión del modelo, marcado como **supuesto**.
- `tools/build-volumen.mjs`: voxeliza a 1 mm las mallas del atlas (encéfalo, cráneo, piel, ojos, arterias, médula alta) en `assets/volumen.bin` (gzip) y `assets/volumen.json`. La piel de BodyParts3D es una cáscara con aberturas: rellena por tramos entre piel en 2 de 3 ejes y elimina bolsas de aire interiores. Hereda la licencia CC BY-SA 2.1 JP.
- Cuatro simuladores en `js/imagen.js`: `i:resonancia` (contraste), `i:espacio-k`, `i:bloch` (espín, T2*, eco) e `i:fmri` (diseño, BOLD, GLM, umbrales y falsos positivos contra la verdad del modelo). Cada uno con un recuadro «Límites del modelo» y otro «Modelo y fuentes», y al final la lista de unidades que lo enlazan.

Propuestas sin hacer, para cuando haya fuente: artefactos de adquisición (B₀ inhomogéneo), difusión y tractografía, análisis de grupo con FDR, conectividad en reposo.

## 7. Cambios de código

1. `data/curso-3.js` con `SEMESTRE_3 = { n: 'Semestre III', sub: 'Neuroimagen: de la física al mapa funcional', unidades: [...] }`, y las unidades repartidas en `curso-3-a.js` … `curso-3-d.js` (cuatro por archivo).
2. `js/curso.js`: `CURSO = [SEMESTRE_0, SEMESTRE_1, SEMESTRE_2, SEMESTRE_3]`. Comprueba que u35 se rotula «Unidad 35», que el temario muestra el avance por semestre y que la navegación ‹ › pasa de u34 a u35.
3. `js/quiz.js`: el Semestre II queda en 18–34 y se agrega la tarjeta «Semestre III» (35–50).
4. `tools/validar.mjs`: carga `data/curso-3.js`, valida los enlaces `i:` y aplica al Semestre III el formato de la sección 5.
5. `data/creditos.js` y `README.md`: la bibliografía efectivamente usada, la sección Imagen y el número de unidades y preguntas.

## 8. Cómo trabajar (por fases, con pausas)

**Fase 1: diseño (sin tocar la app).** Abre las fuentes de la sección 3 y confirma que el temario se sostiene. Escribe `docs/semestre-3/diseno.md` con las unidades finales, sus fuentes asignadas, los enlaces a la app y los temas en debate, y deja el esqueleto de `fuentes.md`. **Detente y espera mi revisión.**

**Fase 2: redacción y código.** Tras mi visto bueno, redacta de a cuatro unidades con el libro de fuentes al día. Después de cada tanda, corre `node tools/validar.mjs` hasta que diga «sin errores» y «unidades sin preguntas: ninguna», y `node tools/probar-imagen.mjs` hasta «todo bien».

**Fase 3: verificación en el navegador.** Con la vista previa `neuroanatomia`:
- el temario muestra los cuatro semestres y el III numera 35–50;
- todos los botones ◈ abren lo que dicen, incluidos los `i:`;
- los simuladores funcionan y la consola no muestra errores;
- las preguntas y la tarjeta «Semestre III» de la evaluación funcionan;
- la vista se ve bien en móvil, sin desplazamiento horizontal de la página.

Comparte una captura.

**Fase 4: cierre.** Haz un commit local, sin push. Muéstrame el resumen (unidades, preguntas, fuentes, pendientes) y **pregunta antes de hacer push** al repo público `ontoterrorist/neuroanatomia`.

## 9. Si el semestre ya existe

En el repo actual el Semestre III ya está escrito. Para revisarlo o ampliarlo:

- Lee `docs/semestre-3/diseno.md`, `fuentes.md` (secciones E y F: respaldo por unidad) y `pendientes.md`.
- No reescribas una unidad sin decirme qué cambia y por qué.
- Prioridades abiertas: leer el texto completo de los trabajos clásicos de los que solo se leyó el resumen; encontrar una fuente abierta de T2* a 3 T (hoy la fMRI usa T2 en su lugar); cubrir los agentes de contraste y la supresión de grasa (unidad 38); y el simulador de difusión y tractografía (unidad 44).

## 10. Qué entregar

- `data/curso-3.js` y `curso-3-a…d.js`, `data/preguntas-3.js`, los cambios en `js/curso.js`, `js/quiz.js`, `tools/validar.mjs`, `data/creditos.js` y `README.md`.
- La sección Imagen: `js/imagen.js`, `js/imagen-fisica.js`, `data/neuroimagen.js`, `tools/build-volumen.mjs`, `tools/probar-imagen.mjs` y `assets/volumen.*`.
- `docs/semestre-3/diseno.md`, `fuentes.md`, `pendientes.md` y `calculos/` si hizo falta.
- Un informe breve: qué quedó verificado, qué quedó fuera por falta de fuente y qué temas se presentan como debate.
