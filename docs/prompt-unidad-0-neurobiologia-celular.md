# Prompt: Unidad 0 · Neurobiología celular para el Neuroatlas

> Pégalo en una sesión nueva abierta en `~/.claude/neuroanatomia`. Redactado el 2026-11-17. Los temarios citados en la sección 3 se leyeron ese día en las URL indicadas.

---

## 1. Qué hay que hacer

Agrega al curso del Neuroatlas una **Unidad 0: Neurobiología celular**, antes del Semestre I. Debe cubrir lo que se ve en un curso universitario de un semestre de neurobiología celular (unas 16 semanas, unas 64 horas de cátedra): la célula nerviosa, la membrana y sus canales, la señal eléctrica, la sinapsis, la señalización química, la glía, la plasticidad y la formación de sinapsis.

La regla principal es **no inventar nada**. Cada afirmación, cifra, nombre de molécula, experimento o fecha que entre en la app tiene que venir de una fuente que hayas abierto y leído en esta sesión, y quedar anotada en un libro de fuentes (sección 4). Lo que no puedas verificar no se escribe. Se anota como pendiente y se me informa.

## 2. Contexto del proyecto (léelo antes de empezar)

- App estática en español, sin compilación. Curso en `data/curso-1.js` (u01–u17) y `data/curso-2.js` (u18–u34), renderizado por `js/curso.js` (`CURSO = [SEMESTRE_1, SEMESTRE_2]`). Preguntas en `data/preguntas.js` con el formato `[unidad, enunciado, [correcta, d1, d2, d3], explicación]`, siempre con la correcta en primer lugar. Créditos en `data/creditos.js`.
- Helpers de las lecciones (en `curso-1.js`): `v(acción, texto)` para el botón «◈ ver en 3D», `clave(título, html)`, `clin(html)` para la correlación clínica y `tabla(cabeceras, filas)`.
- Acciones de microescala que ya existen y conviene reutilizar:
  - Escenas: `m:n:neurona` (neurona con simulador de Hodgkin-Huxley), `m:n:glia` (glía y barrera hematoencefálica), `m:c:corteza`, `m:c:cerebelo`, `m:c:medula`.
  - Sinapsis animadas: `m:s:glu`, `m:s:gaba`, `m:s:ach`, `m:s:da`.
  - Proteínas (PDB): `m:p:6AGF` Nav1.4 · `2R9R` Kv1.2–2.1 · `1K4C` KcsA · `5GJV` Cav1.1 · `3J5P` TRPV1 · `2ZXE` Na⁺/K⁺-ATPasa · `4M48` DAT · `5I6X` SERT · `3KG2` AMPA · `4PE5` NMDA · `6HUO` GABA-A · `3JAD` glicina · `2BG9` nicotínico muscular · `6DDF` μ-opioide/Gi · `6CM4` D2 · `6N51` mGlu5 · `1F88` rodopsina · `1SFC` SNARE · `4EY7` acetilcolinesterasa · `1JFF` tubulina.
  - Moléculas: `m:q:<id>` (consulta los id en `data/moleculas.js`).
- Las unidades u03 (Neuronas y glía), u04 (Potenciales), u05 (Transmisión sináptica), u06 (Neurotransmisores), u30 (Aprendizaje y memoria) y u33 (Plasticidad y neurodegeneración) ya tocan parte de este temario. La Unidad 0 es la base celular más profunda. **No borres ni reescribas esas unidades.** Solo puedes agregarles una línea de enlace «Para el detalle celular, ver lección 0.x». Si crees que hay que fusionar o recortar algo, propónmelo y espera mi respuesta.
- `node tools/validar.mjs` comprueba todos los enlaces cruzados y avisa si una unidad no tiene preguntas.
- La vista previa es la configuración `neuroanatomia` (puerto 8830) de `~/.claude/.claude/launch.json`. El navegador cachea los módulos: recarga con `fetch(url, {cache:'reload'})` antes de `location.reload()`.
- La ruta tiene un espacio («Eric Pezoa»): en Bash usa `"$HOME/..."` entre comillas y en Node usa `fileURLToPath`/`pathToFileURL`.
- Los textos del curso no han pasado por revisión de especialistas (así lo dicen los créditos y el README). Mantén esa advertencia.

## 3. Temario: de dónde sale

El temario no es inventado. Combina estos programas y textos, cuyos índices se leyeron el 2026-11-17:

| Fuente | Qué aporta | URL |
| --- | --- | --- |
| UNAM, Licenciatura en Neurociencias, *Comunicación Neuronal* (3.er semestre, 64 h, obligatoria) | Columna vertebral: 6 unidades (componentes celulares, membrana, metabolismo energético, comunicación intercelular, vías de señalización, señalización neurona-glía) | https://neurociencias.facmed.unam.mx/wp-content/uploads/2022/05/ComunicacionNeuronal.pdf |
| UNAM, *Biología Celular* (1.er semestre, 64 h) | Orgánulos, citoesqueleto y transporte axoplásmico, uniones intercelulares, muerte celular programada | https://neurociencias.facmed.unam.mx/wp-content/uploads/2022/05/Biologia-Celular.pdf |
| MIT OCW 7.29J/9.09J *Cellular Neurobiology* (primavera 2012; Quinn y Littleton) | Secuencia de clases 1–12 (canales → reposo → potencial de acción → propagación → sinapsis → liberación → segundos mensajeros → aprendizaje) y 17–19 (guía axonal, formación de sinapsis) | https://ocw.mit.edu/courses/7-29j-cellular-neurobiology-spring-2012/pages/syllabus/ |
| Neuroscience Online (UTHealth), Sección 1 *Cellular and Molecular Neurobiology*, caps. 1–15 (Byrne, Waymire, Waxham, Bean) | Texto de acceso abierto para verificar contenido, capítulo por capítulo | https://nba.uth.tmc.edu/neuroscience/s1/index.htm |
| Kandel et al., *Principles of Neural Science*, 6.ª ed. (2021), Partes II y III, caps. 7–16 | Referencia canónica de cada lección | https://www.mheducation.com/highered/mhp/product/principles-neural-science-sixth-edition.html |
| PUC Chile, BIO4103 *Bases celulares y moleculares de la neurobiología* | Neurotoxicidad, patologías y metodologías como ejes | https://postgrado.bio.uc.cl/wp-content/uploads/2025/07/PROGRAMA_BASES-CELULARES-Y-MOLECULARES-DE-LA-NEUROBIOLOGIA_ESTUDIANTES-2025.pdf |

Lecciones propuestas (una por semana, 16 en total):

| Lección | Título | Temario fuente | Capítulos de verificación |
| --- | --- | --- | --- |
| 0.1 | Las células del sistema nervioso | UNAM CN 1.1 | Kandel 7 · NSO cap. 8 |
| 0.2 | Organización subcelular de la neurona: orgánulos, síntesis y tráfico de proteínas, citoesqueleto y transporte axonal | UNAM CN 1.2 · UNAM BC 2–3 | Kandel 7 · NSO cap. 10 |
| 0.3 | La membrana: lípidos, mielina, moléculas de adhesión y transportadores | UNAM CN 2.1–2.4 · UNAM BC 1 y 4 | Kandel 7–9 |
| 0.4 | Canales iónicos | MIT 2 · UNAM CN 2.5 | Kandel 8 |
| 0.5 | Potencial de reposo y propiedades pasivas | MIT 3 | Kandel 9 · NSO cap. 1 |
| 0.6 | El potencial de acción: mecanismo iónico y propagación | MIT 4–6 | Kandel 10 · NSO caps. 1–3 |
| 0.7 | Metabolismo energético del tejido nervioso | UNAM CN 3 | fuentes por buscar (ver 4.3) |
| 0.8 | Sinapsis eléctricas y químicas; la unión neuromuscular | UNAM CN 4.1–4.3 · MIT 7 | Kandel 11–12 · NSO cap. 4 |
| 0.9 | Liberación del neurotransmisor | MIT 8 | Kandel 15 · NSO caps. 5 y 10 |
| 0.10 | Integración sináptica en el sistema nervioso central | MIT 7 y 9 | Kandel 13 · NSO cap. 6 |
| 0.11 | Receptores metabotrópicos y segundos mensajeros | UNAM CN 2.6 y 5 · MIT 9–10 | Kandel 14 |
| 0.12 | Neuroquímica de los transmisores: síntesis, almacenamiento, recaptura e inactivación | UNAM CN 4.4 | Kandel 16 · NSO caps. 11–14 |
| 0.13 | La glía en la señalización: sinapsis tripartita y comunicación glía-neurona-vaso | UNAM CN 6 | fuentes por buscar (ver 4.3) |
| 0.14 | Plasticidad sináptica a nivel celular | MIT 11–12 | NSO cap. 7 · Kandel (ubicar capítulo) |
| 0.15 | Formación, mantenimiento y eliminación de sinapsis; muerte neuronal | MIT 17–19 · UNAM BC 7 | NSO cap. 9 |
| 0.16 | Genética, neurotoxicidad y enfermedad neuronal | PUC BIO4103 (contenidos 4–5) | NSO cap. 15 |

Abreviaturas: UNAM CN = Comunicación Neuronal; UNAM BC = Biología Celular; NSO = Neuroscience Online, Sección 1.

Puedes reordenar o fusionar lecciones si las fuentes lo justifican. Explica el cambio en el diseño.

## 4. Política de fuentes

### 4.1 Qué cuenta como fuente válida

1. **Textos universitarios de referencia**, citados por edición y capítulo: Kandel *Principles of Neural Science* 6.ª ed.; Purves *Neuroscience* (verifica edición y capítulos antes de citar, porque su índice no se pudo leer al redactar este prompt); Squire *Fundamental Neuroscience*; Nicholls *From Neuron to Brain*; Siegel *Basic Neurochemistry*; Alberts *Molecular Biology of the Cell*. Solo cuentan si puedes leer el pasaje: la edición gratuita de Purves en NCBI Bookshelf (https://www.ncbi.nlm.nih.gov/books/NBK10799/) muestra un desafío anti-robot al abrirla por fetch, así que ábrela en el navegador integrado. Nunca resuelvas un captcha. Si no carga, usa otra fuente.
2. **Neuroscience Online (UTHealth)**, de acceso abierto, para contrastar cada lección. No declara licencia de reutilización, así que **parafrasea y cita; no copies texto ni figuras**.
3. **Literatura primaria y revisiones** buscadas con los MCP `openalex` y `semantic-scholar`: experimentos clásicos para los recuadros «Cómo se sabe» y revisiones recientes para los temas en debate. Confirma autor, año, revista y DOI con la herramienta (`ver_paper`) antes de citarlos. No cites ningún artículo de memoria.
4. **Bases de datos para datos moleculares**: RCSB PDB (estructuras), UniProt (proteínas) y PubChem (moléculas).

### 4.2 Qué no usar

- **OpenStax**: su página prohíbe expresamente que el libro se ingiera en modelos de IA sin permiso. No lo uses.
- Wikipedia, blogs, apuntes de estudiantes, sitios de divulgación sin autor y resúmenes generados por IA. Wikipedia sirve, como mucho, para encontrar una fuente primaria, que luego hay que abrir.
- Tu memoria. Si algo «lo sabes» pero no lo encuentras en una fuente abierta en esta sesión, no entra.

### 4.3 Reglas de verificación

- **Libro de fuentes** en `docs/unidad-0/fuentes.md`, ordenado por lección. Por cada afirmación sustantiva anota la fuente (obra, edición, capítulo o sección, URL si la hay) y el pasaje que la respalda: cita literal de menos de 15 palabras o paráfrasis fiel. Los párrafos sin entrada en el libro se borran.
- **Cifras**: solo valores publicados en la fuente (concentraciones iónicas, potenciales, velocidades de conducción, constantes, tiempos). Indica siempre la especie o la preparación (axón gigante de calamar, neurona de mamífero…), porque los valores cambian. Si derivas un número (por ejemplo, un potencial de Nernst), calcúlalo con un script a partir de concentraciones citadas y guarda el cálculo en `docs/unidad-0/calculos/`.
- **Consenso y debate**: revisa en las fuentes si algún tema sigue en discusión (por ejemplo, la lanzadera de lactato astrocito-neurona en 0.7, la gliotransmisión en 0.13 o la proporción glía:neurona en 0.1). Si lo está, preséntalo como debate y cita las posturas. No lo resuelvas por tu cuenta.
- **Correlación clínica**: un recuadro `clin()` solo si la fuente relaciona explícitamente el mecanismo con la enfermedad (canalopatías, miastenia, botulismo, esclerosis múltiple…).
- **Pendientes**: lo que no puedas verificar va a `docs/unidad-0/pendientes.md`, no a la app.
- **Copyright**: redacta con tus palabras. Nada de párrafos parafraseados de cerca ni figuras copiadas. Los diagramas nuevos se hacen como tablas o SVG propios, o con las escenas 3D existentes.

## 5. Forma de cada lección

Sigue el formato de `data/curso-1.js`:

- `id`: `u0-01` … `u0-16`. `n`: título. `baj`: subtítulo de una línea. `obj`: 3–4 objetivos («Al terminar podrás…»). `rel`: estructuras del atlas solo si vienen al caso. `html`: el cuerpo.
- Extensión parecida a la de las unidades actuales, de unas 500 a 900 palabras por lección. Párrafos cortos, `<h3>` por apartado y `<strong>` para los términos clave.
- En cada lección:
  - al menos un botón `v()` a una escena, sinapsis o proteína existente cuando corresponda (por ejemplo, 0.4 → canales del PDB; 0.6 → `m:n:neurona` con el simulador; 0.9 → `m:p:1SFC`);
  - un recuadro `clave('Cómo se sabe', …)` con el experimento o la técnica que estableció la idea central (fijación de voltaje, patch clamp, análisis cuántico, cristalografía…), con su referencia verificada; así queda cubierto el eje de metodologías del programa PUC;
  - una tabla cuando ordene mejor la información (iones y concentraciones, tipos de receptores, familias de transmisores).
- **Preguntas**: al menos 4 por lección en `data/preguntas.js`, con el formato del archivo. Cada explicación debe poder rastrearse al libro de fuentes. Los distractores deben ser plausibles y claramente falsos según la fuente.
- Al final de las lecciones 0.4–0.6 y 0.8–0.12, una línea que enlace a la unidad del Semestre I que retoma el tema (`v('l:u04', …)`, etc.).

## 6. Cambios de código

1. Crea `data/curso-0.js`, que exporte `UNIDAD_0 = { n: 'Unidad 0', sub: 'Neurobiología celular', unidades: [...] }` y reutilice los helpers (impórtalos de `curso-1.js` o muévelos a un módulo común sin romper los imports existentes).
2. En `js/curso.js`, usa `CURSO = [UNIDAD_0, SEMESTRE_1, SEMESTRE_2]`. **La numeración no debe correrse**: las lecciones de la Unidad 0 se muestran como «0.1…0.16» en el temario, las tarjetas y la cabecera, y u01 sigue siendo «Unidad 1». Ajusta `temario()`, `portada()` y `leccion()`, incluidos el texto «Dos semestres…», el botón «Empezar por la unidad 1» (ofrece empezar por la 0.1 o por la 1) y el contador «Unidad X de N».
3. Comprueba que el progreso guardado (`mem 'curso'`, con claves por `id`) y las rutas `#curso/<id>` sigan funcionando, y que el índice de búsqueda (`app.indices`) incluya las nuevas lecciones.
4. En `tools/validar.mjs`, carga también `data/curso-0.js`.
5. Agrega a `data/creditos.js` la bibliografía efectivamente usada y actualiza el README (número de unidades y descripción del curso).

## 7. Cómo trabajar (por fases, con pausas)

**Fase 1: diseño (sin tocar la app).** Lee los archivos de la sección 2. Abre las fuentes de la sección 3 para confirmar que el temario se sostiene. Escribe `docs/unidad-0/diseno.md` con las lecciones finales y, para cada una, los objetivos, los apartados, las fuentes asignadas, los enlaces a la app y los temas en debate detectados. Deja también el esqueleto de `fuentes.md`. **Detente y espera mi revisión.**

**Fase 2: redacción y código.** Tras mi visto bueno, redacta de a cuatro lecciones, con el libro de fuentes al día. Después de cada tanda, corre `node tools/validar.mjs` hasta que diga «sin errores» y «unidades sin preguntas: ninguna».

**Fase 3: verificación en el navegador.** Con la vista previa `neuroanatomia`:
- el temario muestra la Unidad 0 con 0.1–0.16 y el Semestre I sigue empezando en 1;
- todos los botones ◈ abren lo que dicen;
- las preguntas funcionan;
- marcar como completada y la navegación ‹ › entre 0.16 y u01 funcionan;
- la vista se ve bien en móvil;
- no hay errores en la consola.

Comparte una captura.

**Fase 4: cierre.** Haz un commit local, sin push. Muéstrame el resumen (lecciones, preguntas, número de fuentes, lista de pendientes) y **pregunta antes de hacer push** al repo público `ontoterrorist/neuroanatomia`.

## 8. Qué entregar

- `data/curso-0.js`, con los cambios en `js/curso.js`, `data/preguntas.js`, `tools/validar.mjs`, `data/creditos.js` y `README.md`.
- `docs/unidad-0/diseno.md`, `fuentes.md`, `pendientes.md` y `calculos/` si hiciste falta.
- Un informe breve que diga qué quedó verificado, qué quedó fuera por falta de fuente y qué temas se presentan como debate.
