# Unidad 0 · Neurobiología celular — diseño (Fase 1)

> Redactado el 2026-11-17. **No se ha tocado la app.** Todo lo que aparece aquí como «verificado» se abrió y leyó en esta sesión; lo demás está marcado como *por leer* o va a `pendientes.md`.
> Estado: **esperando tu revisión** antes de pasar a la Fase 2.

## 1. Qué se verificó del temario (sección 3 del prompt)

| Fuente | Resultado |
| --- | --- |
| UNAM, *Comunicación Neuronal* (64 h, 3.er sem.) | Abierta y leída. Las 6 unidades y la numeración 1.1–6.4.3 coinciden con la tabla del prompt. Aviso: el PDF numera mal sus propios apartados (la unidad 3 usa «1.3–1.6» y la 4 repite «4.1.1»); lo cito por unidad y tema, no por ese número. Su bibliografía básica es Kandel **5.ª** ed. (2012) y Siegel 8.ª ed., no la 6.ª. |
| UNAM, *Biología Celular* (64 h, 1.er sem.) | Abierta y leída. Las unidades 1–4 y 7 que usa el prompt existen tal cual. |
| MIT OCW 7.29J (primavera 2012) | Sílabo leído. Las sesiones 1–12 y 17–19 son las que cita el prompt (1 Intro · 2 Canales · 3 Reposo · 4–5 PA · 6 Propagación · 7 Intro sináptica · 8 Liberación · 9 Mecanismos indirectos · 10 Bioquímica de transmisores/segundos mensajeros · 11–12 Aprendizaje y memoria · 17 Guía axonal · 18 Formación de sinapsis · 19 Ajuste fino). Los libros del curso son Squire 3.ª ed., Kandel 4.ª y Nicholls 2011. Los apuntes (lecture notes) no se abrieron. La licencia exacta de OCW no se leyó. |
| Neuroscience Online (NSO) §1 | Índice y **los 15 capítulos** descargados y leídos por apartados. La numeración de capítulos del prompt es correcta. |
| Kandel, 6.ª ed. (2021) | Solo se pudo leer el **índice** en la página de McGraw Hill. Los caps. 7–16 son exactamente los que cita el prompt (7 Células · 8 Canales · 9 Potencial de membrana y propiedades pasivas · 10 Potencial de acción · 11 Visión general de la transmisión sináptica · 12 Nervio-músculo · 13 Integración sináptica en el SNC · 14 Modulación y segundos mensajeros · 15 Liberación del transmisor · 16 Neurotransmisores). El libro es comercial: **no puedo leer pasajes**, así que Kandel sirve como mapa de capítulos, no como respaldo de afirmaciones. |
| PUC BIO4103 | Abierto con `curl -k` (sin `-k` la conexión falló con código 000; no investigué la causa). Es un curso de **doctorado**, en formato tutorial. Sus «contenidos» son solo seis títulos (1 Estructura y función sináptica · 2 Receptores · 3 Señalización · 4 Neurotoxicidad · 5 Patologías · 6 Metodologías). No da contenido detallado. |
| Purves (NCBI Bookshelf) | Devuelve el desafío «Checking your browser – reCAPTCHA». **No se resolvió ni se esquivó.** Purves queda fuera hasta que se pueda abrir de forma legítima. |

### Capítulos de Kandel que el prompt dejaba «por ubicar» (solo por índice, sin leer pasajes)

| Lección | Capítulos de la 6.ª ed. |
| --- | --- |
| 0.14 Plasticidad | 53 *Mecanismos celulares del almacenamiento de memoria implícita* · 54 *El hipocampo y la memoria explícita* |
| 0.15 Sinapsis y muerte neuronal | 46 *Diferenciación y supervivencia de las células nerviosas* · 47 *Crecimiento y guía de axones* · 48 *Formación y eliminación de sinapsis* |
| 0.16 Genética y enfermedad | 63 *Mecanismos genéticos en enfermedades neurodegenerativas* |

## 2. Lo que encontré y cambia el plan (léelo primero)

1. **El cap. 15 de NSO es genética, no neurotoxicidad.** Trata del genoma humano, mapeo de ligamiento, genes candidatos, rasgos complejos y terapia génica. La lección 0.16 del prompt mezcla «genética, neurotoxicidad y enfermedad», pero la única fuente abierta de neurotoxicidad que tengo es PUC, que son solo títulos. Propongo redefinirla (ver §4, 0.16).
2. **Temas que NSO no contiene** (búsqueda por texto en los 15 capítulos): lactato, sinapsis tripartita, gliotransmisión, excitotoxicidad, apoptosis y proporción glía:neurona. Afecta a 0.1 (debate), 0.7, 0.13, 0.15 (muerte neuronal) y 0.16. Se cubren con literatura primaria o revisiones, y **hay que leerlas**, no solo conocer su ficha.
3. **No tengo los MCP `openalex` ni `semantic-scholar` en esta sesión.** Usé sus APIs REST públicas (`api.openalex.org` y `api.semanticscholar.org`) con `curl`/Python. Cumplen lo mismo que `ver_paper` (autor, año, revista, DOI), pero lo dejo dicho para que decidas si te sirve.
4. **La búsqueda libre de OpenAlex falla con frecuencia.** En la primera pasada, con búsqueda libre, solo 4 de 19 consultas devolvieron el paper buscado; el resto trajo *otro* (por ejemplo, «Neher–Sakmann» devolvió una revisión de 2019). La segunda pasada, con el filtro por palabras del título, acertó 13 de 13. Regla para la Fase 2: ninguna referencia entra al libro sin comprobar que el título, el primer autor y el año coinciden con lo esperado.
5. **El número de unidad se calcula en 5 sitios, no en uno.** `curso.js` (4 veces), `main.js` (2 fichas del atlas, líneas 70 y 74) y `quiz.js` (`nombreU`) usan `findIndex + 1`. Si solo toco `curso.js`, el atlas y la evaluación mostrarían «Unidad 17» para lo que en el curso es la 1. Solución en §5.
6. **Extensión.** El prompt pide 500–900 palabras por lección «parecida a las actuales», pero u03–u06, u30 y u33 tienen **343, 415, 398, 349, 419 y 395**. Apunto a 500–700 y te aviso si alguna se pasa.
7. **Solapamiento real con el Semestre I.** u04 ya tiene «Potencial de reposo · Propiedades pasivas · Potencial de acción · Conducción», y u05 tiene «Plasticidad». 0.5, 0.6 y 0.14 van a repetir parte. No toco nada: u04/u05 quedan como resumen y la Unidad 0 como profundización, con la línea de enlace que pediste. Si prefieres recortar, dímelo.

## 3. Semáforo de fuentes por lección

Verde = hay texto abierto que ya leí por apartados. Amarillo = hay cobertura parcial; completo con literatura primaria *por leer*. Rojo = no tengo fuente abierta todavía.

| Lección | Estado | Respaldo principal (apartados NSO leídos como índice; contenido por leer en Fase 2) |
| --- | --- | --- |
| 0.1 | Verde | NSO 8.1–8.10, 8.12–8.18 |
| 0.2 | Amarillo | NSO 8.3–8.8, 8.11, 10.1–10.9. Orgánulos y citoesqueleto: poca profundidad |
| 0.3 | Amarillo | Mielina: NSO 8.16, 3.3. Adhesión: NSO 9.9. Bombas: NSO 2.6. **Lípidos de membrana: nada abierto** |
| 0.4 | Verde | NSO 2.5, 2.7, 2.8 |
| 0.5 | Verde | NSO 1.5, 1.6, 3.1–3.2 |
| 0.6 | Verde | NSO 1.1–1.4, 2.1–2.4, 2.9, 3.1–3.3 |
| 0.7 | Rojo | Ninguna en NSO. Solo revisiones *por leer* |
| 0.8 | Amarillo | NSO 4.1–4.8. Sinapsis eléctricas: una sola mención de «gap junction» en los caps. 4 y 6 |
| 0.9 | Verde | NSO 5.1–5.2, 10.7 |
| 0.10 | Verde | NSO 6.1–6.8 |
| 0.11 | Amarillo | NSO 6.8, 12.14–12.17, 13.15. Cascadas (AMPc, IP3, CaM, cinasas) con 32 menciones dispersas |
| 0.12 | Verde | NSO 11 (ACh), 12 (aminas), 13 (aminoácidos), 14 (péptidos y NO) |
| 0.13 | Rojo | Ninguna en NSO. Solo revisiones y artículos *por leer* |
| 0.14 | Amarillo | NSO 7.1–7.4. LTD y STDP casi no aparecen |
| 0.15 | Amarillo | NSO 9.14–9.24. Apoptosis ausente |
| 0.16 | Amarillo | NSO 15.1–15.11, 2.8, 6.10, 13.17–13.18 |

## 4. Las 16 lecciones

Formato común (sección 5 del prompt): `id` `u0-01`…`u0-16`, 3–4 objetivos, `<h3>` por apartado, ≥1 botón `v()`, un recuadro `clave('Cómo se sabe', …)`, ≥4 preguntas. Los recuadros `clin()` solo aparecen si la fuente lo relaciona. «Ref. verificada» significa que título, autores, año, revista y DOI se confirmaron con OpenAlex el 2026-11-17 (detalle en `fuentes.md`); **todavía no leí su texto**.

### 0.1 · Las células del sistema nervioso
- **Objetivos:** distinguir los tipos morfológicos y funcionales de neurona · describir las clases de glía · explicar cómo se organizan neuronas, glía y vasos.
- **Apartados:** modelo de neurona (soma, dendritas, segmento inicial, axón, terminal) · clasificación y nombre de las neuronas · macroglía y microglía · relación con los vasos.
- **Fuentes:** NSO 8 · UNAM CN 1.1 · Kandel 7 (solo mapa).
- **App:** `m:n:neurona`, `m:n:glia`.
- **Cómo se sabe:** por decidir en Fase 2 (candidato: doctrina de la neurona; ya está en u03, así que lo evito).
- **Debate:** proporción glía:neurona. Posturas candidatas, *por leer*: Azevedo et al. 2009 (*J Comp Neurol*) y von Bartheld, Bahney y Herculano-Houzel 2016 (*J Comp Neurol*). Ambas con ref. verificada.
- **Enlace:** u03.

### 0.2 · Organización subcelular de la neurona
- **Objetivos:** nombrar los orgánulos y su función en la neurona · seguir una proteína desde el RE hasta el terminal · distinguir transporte anterógrado y retrógrado.
- **Apartados:** soma y orgánulos · síntesis y tráfico de proteínas (RE rugoso, Golgi) · citoesqueleto · transporte axonal.
- **Fuentes:** NSO 8.3–8.8, 8.11, 10.1–10.9 · UNAM CN 1.2 · UNAM BC 2–3.
- **App:** `m:p:1JFF` (tubulina), `m:n:neurona`.
- **Cómo se sabe:** por decidir. Pendiente buscar experimento verificable de transporte axonal.
- **Nota:** orgánulos y filamentos intermedios van a quedar breves salvo que aparezca otra fuente abierta.

### 0.3 · La membrana
- **Objetivos:** describir la composición de la membrana neuronal · explicar la mielina y su función · reconocer las moléculas de adhesión · distinguir bombas y transportadores.
- **Apartados:** bicapa y lípidos (**solo si hay fuente**) · mielina · adhesión · bombas y transportadores.
- **Fuentes:** NSO 8.16, 3.3, 9.9, 2.6 · UNAM CN 2.1–2.4 · UNAM BC 1 y 4.
- **App:** `m:p:2ZXE` (Na⁺/K⁺-ATPasa), `m:p:4M48` (DAT).
- **Propuesta:** sin fuente abierta de lípidos, el apartado «Composición lipídica y patologías» **se saca** (va a pendientes). Si quieres mantenerlo, necesito que me autorices otra vía para leer Alberts o una revisión de acceso abierto.
- **Clínica:** esclerosis múltiple solo si la fuente enlaza mielina y enfermedad.

### 0.4 · Canales iónicos
- **Objetivos:** clasificar los canales por su compuerta · explicar selectividad y apertura · relacionar un canal con su toxina o fármaco · reconocer una canalopatía.
- **Apartados:** tipos de canal · farmacología (TTX, TEA) · estructura (KcsA, Nav, Cav, TRPV1) · canalopatías.
- **Fuentes:** NSO 2.5, 2.7, 2.8 · MIT 2 · UNAM CN 2.5.
- **App:** `m:p:1K4C`, `m:p:2R9R`, `m:p:6AGF`, `m:p:5GJV`, `m:p:3J5P`; molécula `m:q:tetrodotoxin`.
- **Cómo se sabe:** registro de canal único: Neher y Sakmann 1976, *Nature* (ref. verificada). Estructura de KcsA: Doyle et al. 1998, *Science* (ref. verificada).
- **Clínica:** canalopatías, NSO 2.8.
- **Enlace al final:** `l:u04`.

### 0.5 · Potencial de reposo y propiedades pasivas
- **Objetivos:** explicar por qué hay un potencial de reposo · calcular un potencial de equilibrio con Nernst · usar GHK · describir la constante de longitud.
- **Apartados:** gradientes iónicos · Nernst y GHK · propiedades pasivas.
- **Fuentes:** NSO 1.5, 1.6, 3.1–3.2 · MIT 3.
- **App:** `m:n:neurona`.
- **Cómo se sabe:** Hodgkin y Katz 1949, *J Physiol* (ref. verificada).
- **Cálculos:** script en `calculos/nernst.mjs` con concentraciones copiadas de NSO y especie indicada.
- **Enlace al final:** `l:u04`.

### 0.6 · El potencial de acción
- **Objetivos:** describir el curso iónico del potencial de acción · explicar la inactivación de Na⁺ y la refractariedad · explicar la propagación y el papel de la mielina.
- **Apartados:** fases del PA · conductancias · refractariedad · propagación y mielinización.
- **Fuentes:** NSO 1.1–1.4, 2.1–2.4, 2.9, 3.1–3.3 · MIT 4–6.
- **App:** `m:n:neurona` (simulador Hodgkin–Huxley).
- **Cómo se sabe:** fijación de voltaje y Hodgkin y Huxley 1952, *J Physiol* (ref. verificada). La app ya usa esos parámetros.
- **Enlace al final:** `l:u04`.

### 0.7 · Metabolismo energético del tejido nervioso — *condicional*
- **Objetivos:** reconocer qué procesos consumen más energía · describir el aporte de glucosa · presentar el debate sobre el lactato.
- **Fuentes:** sin NSO. Refs. verificadas, *por leer*: Attwell y Laughlin 2001 (*JCBFM*) · Pellerin y Magistretti 1994 (*PNAS*) · Dienel (*JCBFM*, OpenAlex da 2011; compruebo año de impresión) · Bonvento et al. 2005 (*JCBFM*, título: «debated but still valuable hypothesis») · Magistretti y Allaman 2018 (*Nat Rev Neurosci*).
- **Debate:** lanzadera de lactato astrocito–neurona. Se presenta como debate, sin resolverlo.
- **Condición:** solo se escribe si logro **leer** al menos dos de esas fuentes. Si no, se funde en 0.13 como «Glía y energía» o se elimina.
- **Clínica:** no, hasta que una fuente enlace mecanismo y enfermedad.

### 0.8 · Sinapsis eléctricas y químicas; unión neuromuscular
- **Objetivos:** comparar sinapsis eléctrica y química · describir la placa motora · explicar la secuencia del potencial de placa.
- **Apartados:** tipos de sinapsis · anatomía de la unión · potencial de placa · acetilcolinesterasa · mecanismos iónicos.
- **Fuentes:** NSO 4.1–4.8 · MIT 7 · UNAM CN 4.1–4.3.
- **App:** `m:s:ach`, `m:p:2BG9`, `m:p:4EY7`.
- **Cómo se sabe:** del Castillo y Katz 1954, *J Physiol* (ref. verificada), si lo uso aquí; si no, en 0.9.
- **Clínica:** miastenia, solo si NSO lo enlaza.
- **Enlace al final:** `l:u05`.
- **Hueco:** sinapsis eléctricas (conexinas, panexinas) casi sin texto abierto.

### 0.9 · Liberación del neurotransmisor
- **Objetivos:** explicar el papel del Ca²⁺ · describir el ciclo de la vesícula · distinguir liberación espontánea y evocada.
- **Apartados:** Ca²⁺ y exocitosis · maquinaria SNARE · liberación cuántica · reciclaje.
- **Fuentes:** NSO 5.1–5.2, 10.7 · MIT 8.
- **App:** `m:p:1SFC`, `m:s:glu`.
- **Cómo se sabe:** del Castillo y Katz 1954 (análisis cuántico) y Sutton et al. 1998 (*Nature*, estructura SNARE, 1SFC). Ambas con ref. verificada.
- **Clínica:** botulismo, solo si la fuente lo enlaza.
- **Enlace al final:** `l:u05`.

### 0.10 · Integración sináptica en el SNC
- **Objetivos:** distinguir EPSP e IPSP · explicar la sumación espacial y temporal · describir las respuestas metabotrópicas.
- **Fuentes:** NSO 6.1–6.8 · MIT 7 y 9.
- **App:** `m:s:glu`, `m:s:gaba`, `m:p:3KG2`, `m:p:6HUO`.
- **Cómo se sabe:** por decidir (circuito reflejo, NSO 6.1).
- **Enlace al final:** `l:u05`.

### 0.11 · Receptores metabotrópicos y segundos mensajeros
- **Objetivos:** describir el ciclo de la proteína G · seguir AMPc, IP3/DAG y Ca²⁺ · explicar cómo las cinasas modulan la excitabilidad.
- **Fuentes:** NSO 6.8, 12.14–12.17, 13.15 · UNAM CN 2.6 y 5 · MIT 9–10.
- **App:** `m:p:6DDF`, `m:p:6CM4`, `m:p:6N51`, `m:p:1F88`.
- **Cómo se sabe:** por decidir. Candidato: rodopsina o la cascada del AMPc; **sin ref. verificada todavía**.
- **Enlace al final:** `l:u06`.

### 0.12 · Neuroquímica de los transmisores
- **Objetivos:** seguir síntesis → almacenamiento → liberación → inactivación de ACh, aminas, aminoácidos y péptidos · identificar enzimas y transportadores · relacionar fármacos con cada paso.
- **Apartados (tabla):** familias de transmisores con precursor, enzima limitante, receptor e inactivación.
- **Fuentes:** NSO 11–14 · UNAM CN 4.4 y 4.5.
- **App:** `m:s:da`, `m:s:gaba`, `m:p:4M48`, `m:p:5I6X`; moléculas `m:q:dopamine`, `m:q:serotonin`, `m:q:acetylcholine`.
- **Clínica:** NSO 11.15, 12.31–12.34, 13.17–13.18.
- **Enlace al final:** `l:u06`.

### 0.13 · La glía en la señalización — *debate*
- **Objetivos:** describir la sinapsis tripartita · explicar la excitabilidad de astrocitos por Ca²⁺ · presentar el debate sobre gliotransmisión · describir la relación astrocito–vaso.
- **Fuentes:** sin NSO. Refs. verificadas, *por leer*: Araque et al. 1999 (*TINS*) · Fiacco y McCarthy 2018 (*J Neurosci*, «does not occur under physiological conditions») · Savtchouk y Volterra 2018 (*J Neurosci*, «beyond black-and-white»).
- **Debate:** gliotransmisión. Presento las dos posturas con su cita; no la resuelvo.
- **App:** `m:n:glia`.
- **Hueco:** acople astrocito–vaso y barrera hematoencefálica: nada leído.

### 0.14 · Plasticidad sináptica celular
- **Objetivos:** distinguir formas de corto y largo plazo · describir LTP · reconocer la regla heterosináptica.
- **Fuentes:** NSO 7.1–7.4 · MIT 11–12 · Kandel 53–54 (solo mapa).
- **App:** `m:p:4PE5` (NMDA), `m:p:3KG2` (AMPA).
- **Cómo se sabe:** Bliss y Lømo 1973, *J Physiol* (ref. verificada). **Ya aparece en u30**; aquí lo trato desde el mecanismo celular y enlazo a u30 en lugar de repetirlo.
- **Hueco:** LTD y STDP casi sin texto.
- **Enlace:** `l:u30`, `l:u33`.

### 0.15 · Formación, mantenimiento y eliminación de sinapsis; muerte neuronal
- **Objetivos:** describir la guía axonal · explicar la diferenciación pre y postsináptica (agrina) · explicar la dependencia de factores tróficos · distinguir regeneración periférica y central.
- **Fuentes:** NSO 9.1–9.24 · MIT 17–19 · UNAM BC 7.
- **App:** `m:n:neurona`.
- **Cómo se sabe:** NGF (NSO 9.19). Hamburger y Levi-Montalcini 1949 **no apareció** en OpenAlex → pendiente.
- **Hueco:** apoptosis (UNAM BC 7.4) sin fuente abierta.
- **Enlace:** `l:u02`, `l:u33`.

### 0.16 · Genética y enfermedad neuronal — *propuesta de redefinición*
- **Objetivos:** explicar cómo se localiza un gen de enfermedad · distinguir herencia mendeliana y rasgos complejos · describir excitotoxicidad como mecanismo de daño.
- **Fuentes:** NSO 15.1–15.11, 2.8, 6.10, 13.17–13.18 · Lau y Tymianski 2010 (*Pflügers Arch*, ref. verificada, *por leer*).
- **Cambio sugerido:** el prompt la nombra «Genética, neurotoxicidad y enfermedad neuronal». Propongo **«Genética y enfermedad neuronal»**, con neurotoxinas como apartado corto basado en NSO 6.10 y 2.5.
- **App:** `m:q:tetrodotoxin`, `m:q:strychnine`.
- **Enlace:** `l:u33`.

## 5. Cambios de código previstos (Fase 2, aún no aplicados)

1. **`data/curso-0.js`**: `UNIDAD_0 = { n: 'Unidad 0', sub: 'Neurobiología celular', unidades: [...] }`. Los helpers `v`, `clave`, `clin`, `tabla` hoy viven en `curso-1.js` y solo `v` está exportado. Para no duplicarlos (DRY) los muevo a `data/ayudas-curso.js` y `curso-1.js` los importa y reexporta `v`, así que los imports existentes siguen funcionando.
2. **Etiqueta de unidad única.** En `curso.js`, `UNIDADES` incluirá `num` (`'0.1'`… `'0.16'` para la Unidad 0 y `'1'`…`'34'` para el resto, contando solo las del Semestre I y II). Un `etiqueta(u)` exportado reemplaza los 5 `findIndex + 1` de `curso.js`, `main.js` y `quiz.js`. Así u01 sigue siendo «Unidad 1».
3. **`CURSO = [UNIDAD_0, SEMESTRE_1, SEMESTRE_2]`.** Ajustes: «Dos semestres…» → texto que incluya la Unidad 0; botones «Empezar por la 0.1» y «Empezar por la unidad 1»; «Unidad X de N» queda como «Lección 0.3 de 16» dentro de la Unidad 0 y «Unidad 5 de 34» fuera.
4. **Progreso.** Las claves de `mem('curso')` son por `id`, así que lo guardado sigue funcionando. **Una consecuencia:** el contador «N de M unidades completadas» pasa de 34 a 50 y la barra baja de golpe para quien ya avanzó. Propongo mostrar el avance de la Unidad 0 y el de los semestres por separado; dime si lo prefieres.
5. **Rutas.** `#curso/u0-03` funciona igual que `#curso/u05`. Las rutas viejas no cambian.
6. **Índice de búsqueda** (`app.indices`) y **`leccionesDe`**: usan `UNIDADES`, así que incluyen las nuevas lecciones. Si una lección declara `rel`, aparece en las fichas del atlas.
7. **`tools/validar.mjs`**: cargar `data/curso-0.js` y sumarlo a `U`. Además, un chequeo nuevo: cada unidad de la Unidad 0 debe tener ≥4 preguntas (hoy solo avisa si hay 0).
8. **Créditos y README:** solo la bibliografía realmente usada; la advertencia de «sin revisión de especialistas» se mantiene.

## 6. Preguntas para ti antes de la Fase 2

1. **0.7 y 0.13:** ¿las hago solo si logro leer las fuentes, o las fundo en una sola lección «Glía y energía»?
2. **0.3 lípidos:** ¿saco el apartado, o me autorizas otra ruta para leer Alberts (por ejemplo, Europe PMC, que sirve libros de Bookshelf por su propia API)? No la probé: el prompt dice que si no carga se use otra fuente.
3. **0.16:** ¿aceptas el cambio de nombre y alcance?
4. **Solapamiento con u04/u05/u30:** ¿mantengo todo y solo enlazo?
5. **Contador de progreso:** ¿separado para la Unidad 0, o un total de 50?
6. **Referencias:** ¿te sirve que use las APIs REST de OpenAlex y Semantic Scholar en lugar de los MCP?
