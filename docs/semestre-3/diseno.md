# Semestre III · Neuroimagen — diseño (Fase 1)

> Redactado el 2026-11-18. Estado: **simuladores hechos y probados; lecciones sin redactar, esperando tu revisión del temario.**
> Mismo método que el Semestre 0 (`docs/prompt-unidad-0-neurobiologia-celular.md`): nada entra a la app sin una fuente abierta y leída en la sesión, anotada en `fuentes.md`. Lo que no se pudo verificar está en `pendientes.md`.

## 1. Qué ya está en la app

### Semestre 0
La antigua «Unidad 0» es ahora el **Semestre 0 · Neurobiología celular**: sus 16 lecciones se llaman «Unidad 0.1 … 0.16», el temario muestra el avance por semestre (0, I, II), la portada ofrece empezar por el Semestre 0 o por el I, y la evaluación tiene la tarjeta «Semestre 0». Los id (`u0-01`…`u0-16`), las rutas `#curso/u0-NN` y el progreso guardado no cambian. Las referencias internas «lección 0.x» pasaron a «unidad 0.x». Los documentos de `docs/unidad-0/` se dejan como registro histórico.

### Sección «Imagen» (nueva pestaña)
Cuatro simuladores en `js/imagen.js`, con la física aparte en `js/imagen-fisica.js` (probada en Node con `tools/probar-imagen.mjs`) y los parámetros con su fuente en `data/neuroimagen.js`. Desde el curso se enlazan con `v('i:<id>', texto)`; el validador comprueba esos enlaces.

| id | Simulador | Qué hace | Base |
| --- | --- | --- | --- |
| `i:resonancia` | Contraste en RM | Corta la cabeza del atlas en los tres planos y calcula la imagen con la ecuación de eco de espín o de inversión-recuperación a 1,5 o 3 T; presets T1, DP, T2, FLAIR y STIR (TI que anula LCR o grasa calculado); ruido de Rice; clic → tejido, estructura y enlace al atlas | Hornak cap. 10; West 2013; Jordan 2011 |
| `i:espacio-k` | El espacio k | Imagen ↔ espacio k con FFT 2D: centro, periferia, submuestreo (aliasing), media k (simetría conjugada), espiga | Hornak |
| `i:bloch` | El espín | Ecuaciones de Bloch en el marco rotatorio con 15 isocromatos: un pulso (T2 y T2*), eco de espín, pulsos repetidos (estado de equilibrio) | Hornak cap. 10; West; Jordan |
| `i:fmri` | fMRI y GLM | Diseño en bloques o eventos, BOLD = estímulo ⊛ HRF canónica de SPM en la estructura elegida (con volumen parcial a 3 mm), deriva y ruido; GLM por vóxel, umbral p < 0,05, p < 0,001 o Bonferroni; cuenta aciertos y falsos positivos contra la verdad del modelo | spm_hrf.m; Friston 1994; Ogawa 1990 |

El volumen (`assets/volumen.bin`, 490 KB, 176×239×233 vóxeles de 1 mm) lo genera `tools/build-volumen.mjs` desde las mallas del atlas: 280 estructuras del encéfalo, cráneo, piel, ojos, arterias y médula alta. El espacio subaracnoideo, la grasa subcutánea y el tejido blando se deducen por geometría (ver el archivo). Licencia: el volumen deriva de BodyParts3D, así que hereda CC BY-SA 2.1 JP (igual que `cuerpo.glb`).

## 2. Temario: de dónde sale

Columna vertebral: **MIT OCW HST.583 *Functional Magnetic Resonance Imaging: Data Acquisition and Analysis*** (otoño 2008, Gollub y otros), sílabo y calendario leídos el 2026-11-18 en https://ocw.mit.edu/courses/hst-583-functional-magnetic-resonance-imaging-data-acquisition-and-analysis-fall-2008/pages/syllabus/. Sus siete partes: 1 Panorama · 2 Sistemas neurales funcionales (incluye anatomía cerebrovascular y seguridad) · 3 Física de la adquisición · 4 Fisiología de la imagen (basal, activación, BOLD, técnicas no BOLD, perfusión y difusión) · 5 Diseño experimental · 6 Análisis estadístico (preprocesamiento, nivel 1, nivel 2, comparaciones múltiples, análisis exploratorio, causalidad) · 7 Estructura y función (integración, biomarcadores, superficie cortical, normalización espacial). Libro del curso: Huettel, Song y McCarthy, *Functional Magnetic Resonance Imaging* (2.ª ed. 2009 recomendada); es comercial, así que serviría solo como mapa, como Kandel en el Semestre 0.

Las 16 unidades propuestas (numeradas 35–50 para seguir a las 34 de los semestres I y II):

| Unidad | Título | HST.583 | Simulador / enlaces |
| --- | --- | --- | --- |
| 35 | Panorama: qué mide la neuroimagen estructural y la funcional | Parte 1 | portada de Imagen |
| 36 | Seguridad en RM y ética de la investigación con personas | ses. 2–3 | — |
| 37 | Física I: espín, resonancia y relajación | ses. 6 | `i:bloch` |
| 38 | Física II: el contraste (T1, T2, DP, inversión-recuperación) | ses. 7 | `i:resonancia` |
| 39 | Física III: gradientes, selección de corte y espacio k | ses. 8 | `i:espacio-k` |
| 40 | Secuencias rápidas y artefactos | ses. 8, lab. 4 | `i:espacio-k` (aliasing, espiga) |
| 41 | Anatomía cerebrovascular y regulación del flujo | ses. 5 | atlas: arterias (`vista:vasos`) |
| 42 | Fisiología de la señal: metabolismo basal y acoplamiento neurovascular | ses. 9–10 | `l:u0-07` |
| 43 | El contraste BOLD | ses. 11 | `i:fmri` |
| 44 | Más allá del BOLD: perfusión y difusión | ses. 12–13 | — (ver §4) |
| 45 | Diseño experimental: bloques y eventos | ses. 14–15 | `i:fmri` |
| 46 | Preprocesamiento: movimiento, registro, normalización y suavizado | ses. 16, 24 | — |
| 47 | Modelo lineal general (primer nivel) | ses. 16–18 | `i:fmri` |
| 48 | Análisis de grupo y comparaciones múltiples | ses. 19–20 | `i:fmri` (Bonferroni) |
| 49 | Análisis exploratorio y conectividad | ses. 21, 25 | — |
| 50 | Estructura y función: morfometría, superficie cortical y biomarcadores | ses. 22–23 | atlas |

## 3. Política de fuentes (igual que el Semestre 0)

- **Texto abierto para respaldar afirmaciones:** Hornak, *The Basics of MRI* (gratuito en línea, con derechos de autor: parafrasear y citar). Para fMRI no hay todavía un texto abierto equivalente a Neuroscience Online: hay que buscarlo (candidatos a evaluar en la Fase 2: materiales de acceso abierto de cursos y revisiones con licencia CC).
- **Literatura primaria y revisiones** verificadas con el MCP `openalex` / `semantic-scholar`, leyendo al menos el resumen; las cifras solo si se leyó el pasaje (tabla o texto) que las da.
- **No usar** OpenStax, Wikipedia como fuente, ni la memoria.
- Cada unidad: 3–4 objetivos, 500–700 palabras, un recuadro «Cómo se sabe» con el experimento o la técnica, ≥ 1 botón `v()`, ≥ 4 preguntas.

## 4. Simuladores que faltarían para cubrir todo el temario (propuestas, sin hacer)

1. **Artefactos de adquisición** (unidad 40): movimiento entre líneas de k, susceptibilidad cerca de los senos. Necesita un modelo de B₀ inhomogéneo con fuente.
2. **Difusión y tractografía** (unidad 44): tensor por vóxel en la sustancia blanca del atlas y seguimiento de fibras. El atlas no tiene orientación de fibras; habría que tomarla de las vías existentes (`data/vias.js`) o de un atlas abierto con licencia compatible.
3. **Grupo y comparaciones múltiples** (unidad 48): varios sujetos simulados, análisis de segundo nivel y FDR además de Bonferroni.
4. **Conectividad en reposo** (unidad 49): series acopladas entre regiones y matriz de correlación.

## 5. Preguntas para ti antes de la Fase 2

1. ¿Apruebas el temario de 16 unidades (35–50) o prefieres reordenar/fusionar (por ejemplo, 40 dentro de 39, o 49 y 50 juntas)?
2. ¿«Semestre III · Neuroimagen» como nombre, o algo como «Semestre III · Neuroimagen funcional»?
3. ¿Hago alguno de los simuladores de §4 antes de redactar (el de difusión es el más grande)?
4. ¿El orden 0 → I → II → III te sirve, o quieres que la neuroimagen pueda cursarse después del I sin el II?
