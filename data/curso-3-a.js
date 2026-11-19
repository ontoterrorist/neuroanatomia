// Semestre III · unidades 35 a 38. Cada afirmación está respaldada en docs/semestre-3/fuentes.md.
import { v, clave, tabla } from './ayudas-curso.js';

const HORNAK = 'Hornak, <em>The Basics of MRI</em> (cis.rit.edu/htbooks/mri)';

export const UNIDADES_3_A = [
  { id: 'u35', n: 'Panorama: qué mide la neuroimagen', baj: 'Imagen estructural y funcional, y qué puede y qué no puede ver cada técnica.',
    obj: ['Explicar de dónde sale la señal de una resonancia magnética', 'Distinguir la imagen estructural de la funcional', 'Comparar la resonancia funcional con PET, NIRS, EEG y MEG en resolución espacial y temporal', 'Reconocer que el BOLD es una medida indirecta de la actividad neuronal'],
    rel: [],
    html: `<p>Este semestre cambia la pregunta. Hasta aquí estudiamos cómo es y cómo funciona el sistema nervioso; ahora, cómo se lo observa en una persona viva sin abrirle el cráneo. La herramienta central es la <strong>resonancia magnética</strong> (RM), que sirve tanto para ver la forma del encéfalo como para seguir, de modo indirecto, su actividad. ${v('i:resonancia', 'Simulador de contraste en RM')}</p>
<h3>De dónde sale la señal</h3>
<p>La RM se basa en la resonancia magnética nuclear de los núcleos de hidrógeno. El cuerpo humano tiene muchísima agua y grasa: según Hornak, cerca del 63 % de sus átomos son de hidrógeno, cuyo núcleo, un solo protón, emite señal de resonancia. Por eso la RM mira, ante todo, el hidrógeno del agua y de la grasa.</p>
<p>La imagen clásica es <strong>tomográfica</strong>: representa un corte de cierto grosor, como si se retirara la anatomía de arriba y de abajo. El corte se divide en elementos de volumen, los <strong>vóxeles</strong>, y la intensidad de cada píxel de la imagen es proporcional a la señal del vóxel que le corresponde.</p>
<h3>Estructural y funcional</h3>
<p>La <strong>imagen estructural</strong> muestra la anatomía. Combinando pulsos y gradientes, la RM puede hacer que la imagen dependa de propiedades distintas de los tejidos: T1, T2, susceptibilidad magnética o flujo (unidades 37 y 38). La <strong>imagen funcional</strong> busca cambios en el tiempo ligados a la actividad. La resonancia funcional (fMRI) aprovecha que la actividad neuronal aumenta el consumo de energía, y que el flujo sanguíneo local sube más de lo necesario, con lo que cambia la oxigenación de la sangre y, con ella, la señal: es el <strong>contraste BOLD</strong> (unidad 43).</p>
<p>Conviene recordarlo desde el principio: el BOLD no es la actividad neuronal, sino una señal compuesta que refleja cambios de flujo, volumen y oxigenación de la sangre en la región.</p>
<h3>Qué ve cada técnica</h3>
${tabla(['Técnica', 'Qué registra', 'Resolución espacial', 'Resolución temporal'], [
  ['fMRI (BOLD)', 'Oxigenación de la sangre', 'Vóxeles típicos de 3–4 mm; ≤0,5 mm a 7 T', 'Limitada por la respuesta hemodinámica, que culmina a los 5–6 s'],
  ['PET', 'Radiotrazadores inyectados', '≥5–10 mm', 'Minutos por estudio'],
  ['NIRS', 'Oxigenación, con luz infrarroja', '10–20 mm, solo corteza superficial', 'Parecida a la fMRI'],
  ['EEG y MEG', 'Campos eléctricos o magnéticos en el cuero cabelludo', '>10–20 mm', 'Milisegundos'],
])}
<p>Las cifras son las de la revisión de Glover (2011). La fMRI gana en resolución espacial y pierde en temporal; EEG y MEG, al revés. Por eso hay estudios que combinan ambas.</p>
<h3>Por qué se usa tanto</h3>
<p>Glover resume sus ventajas: se puede hacer en un equipo clínico de 1,5 T, no requiere inyectar radioisótopos ni fármacos, es relativamente barata y permite obtener en la misma sesión imágenes anatómicas de alta resolución, incluidas las de difusión para la sustancia blanca. Sus debilidades son la lentitud de la respuesta hemodinámica, la pérdida de señal cerca de los senos aéreos (unidad 40) y el ruido del equipo.</p>
${clave('Cómo se sabe', `<p>En 1992, Kwong y colaboradores obtuvieron mapas tomográficos de actividad en el cerebro humano sin ninguna inyección, con imagen ecoplanar de alta velocidad. Con un estímulo luminoso de 8 Hz, la señal de la corteza visual primaria subió alrededor de un 1,8 % en siete voluntarios, y se vieron cambios parecidos en la corteza motora primaria al apretar la mano (Kwong et al., <em>PNAS</em> 1992; leído el resumen).</p>`)}
<p>${v('i:fmri', 'Simulador de fMRI')} ${v('l:u08', 'Repaso: irrigación del encéfalo (unidad 8)')}</p>
<p><small>Fuentes: ${HORNAK}, cap. 1; Glover GH, «Overview of functional magnetic resonance imaging», <em>Neurosurg Clin N Am</em> 2011 (PMC3073717); Soares et al. 2016, <em>Front Neurosci</em> (CC BY); Kwong et al. 1992 (resumen).</small></p>` },

  { id: 'u36', n: 'Seguridad en RM y ética de la investigación', baj: 'Imán, gradientes y radiofrecuencia; y las reglas para investigar con personas.',
    obj: ['Nombrar los tres campos de un resonador y el riesgo principal de cada uno', 'Explicar qué es la SAR y por qué se limita', 'Describir el cribado previo al examen', 'Enumerar los requisitos éticos de la Declaración de Helsinki para investigar con personas'],
    rel: [],
    html: `<p>La RM no usa radiación ionizante, pero tampoco es inocua. Hornak enumera sus riesgos: el campo magnético intenso, la energía de radiofrecuencia, los campos que varían en el tiempo, los gradientes y los líquidos criogénicos del imán. A esto se suma, cuando se investiga, la obligación ética de proteger a quienes participan.</p>
<h3>Tres campos, tres riesgos</h3>
${tabla(['Campo', 'Para qué sirve', 'Riesgo principal'], [
  ['Estático (B₀)', 'Crea la magnetización neta', 'Atrae objetos ferromagnéticos; vértigo, náuseas y sabor metálico'],
  ['Gradientes (100–1000 Hz)', 'Localizan la señal en el espacio', 'Estimulación de nervios periféricos (hormigueo); ruido'],
  ['Radiofrecuencia (10–400 MHz)', 'Excita la magnetización para detectarla', 'Calentamiento de los tejidos'],
])}
<p>Las frecuencias son las de la revisión de Hartwig y colaboradores (2009). Según esa revisión, el umbral para estimular el corazón es mucho mayor que el de los nervios periféricos, y la estimulación cardíaca es muy improbable con los equipos actuales. El riesgo más grave es mecánico: un imán de diámetro grande puede levantar y arrastrar objetos de hierro. Hornak cuenta el caso de un balde con escurridor que el imán de 1,5 T atrajo desde unos tres metros. Por eso no entra nada ferromagnético a la sala.</p>
<h3>Calor y SAR</h3>
<p>Durante el examen no se puede medir la temperatura del paciente, así que se controla la <strong>tasa de absorción específica</strong> (SAR, en W/kg): el equipo la calcula y detiene la secuencia si supera el límite. Los ojos y los testículos son especialmente sensibles al calor porque tienen poca perfusión. Las quemaduras descritas suelen ocurrir donde la piel toca cables o sensores de monitorización, y el riesgo crece con implantes alargados o activos, como neuroestimuladores o marcapasos.</p>
<h3>El cribado</h3>
<p>Antes del examen se pregunta por todo objeto o dispositivo dentro del cuerpo: es el <strong>cribado</strong>. También se piden peso y talla, que el equipo usa para respetar los límites de SAR. Hornak señala que esquirlas metálicas o clips ferromagnéticos pueden girar con el campo y causar lesiones graves. Las reglas concretas cambian con los dispositivos: siempre manda el protocolo del centro.</p>
<h3>Investigar con personas</h3>
<p>La Declaración de Helsinki de la Asociación Médica Mundial (revisada en octubre de 2024) fija los principios. Los más pertinentes para un estudio de neuroimagen:</p>
<ul>
<li><strong>Comité de ética.</strong> El protocolo se presenta a un comité de ética independiente, que debe aprobarlo antes de empezar y puede vigilarlo y suspenderlo.</li>
<li><strong>Riesgos y beneficios.</strong> Solo se investiga si la importancia del objetivo supera los riesgos y cargas para los participantes, que deben evaluarse antes y vigilarse durante el estudio.</li>
<li><strong>Consentimiento libre e informado.</strong> Cada persona recibe, en lenguaje sencillo, los objetivos, métodos, beneficios y riesgos, la financiación y los posibles conflictos de interés, y sabe que puede negarse o retirarse en cualquier momento sin represalias.</li>
<li><strong>Privacidad.</strong> Se toman todas las precauciones para proteger la confidencialidad de sus datos.</li>
</ul>
${clave('Cómo se sabe', `<p>¿Cómo se fija un límite de calor que no se puede medir en el paciente? Se modela cuánto sube la temperatura del cuerpo con una potencia absorbida dada. Según Hartwig y colaboradores, el límite habitual de 4 W/kg para el cuerpo entero se calculó para un aumento de temperatura de hasta 0,6 °C en un examen de 20 a 30 minutos. Hornak recoge los límites de la FDA de 2003: 4 W/kg para el cuerpo entero promediado en 15 minutos y 3 W/kg para la cabeza en 10 minutos.</p>`)}
<p>${v('i:bloch', 'Qué hace el pulso de radiofrecuencia')}</p>
<p><small>Fuentes: ${HORNAK}, cap. 9 («Safety») y cap. 14 («Your MRI exam»); Hartwig V et al., «Biological effects and safety in magnetic resonance imaging: a review», <em>Int J Environ Res Public Health</em> 2009 (CC BY); Asociación Médica Mundial, Declaración de Helsinki, versión de octubre de 2024 (wma.net).</small></p>` },

  { id: 'u37', n: 'Física I: espín, resonancia y relajación', baj: 'Por qué los protones dan señal y cómo la pierden: T1, T2 y T2*.',
    obj: ['Calcular la frecuencia de Larmor del hidrógeno a 1,5 y 3 T', 'Explicar qué es la magnetización neta y cómo la inclina un pulso', 'Distinguir la relajación T1, T2 y T2*', 'Explicar por qué el pulso de 180° produce un eco'],
    rel: [],
    html: `<p>Toda la RM descansa en una propiedad del núcleo atómico: el <strong>espín</strong>. Un protón con espín se comporta como un pequeño imán. Esta unidad explica, sin ecuaciones difíciles, cómo esos imanes producen una señal y cómo la pierden. ${v('i:bloch', 'Simulador del espín')}</p>
<h3>Resonancia</h3>
<p>En un campo magnético B₀, cada espín del hidrógeno puede orientarse de dos maneras con distinta energía. La frecuencia del fotón que provoca la transición entre ambas es la <strong>frecuencia de Larmor</strong>, ν = γB₀. Para el hidrógeno, γ = 42,58 MHz/T, así que la resonancia ocurre a unos 63,9 MHz en un equipo de 1,5 T y a unos 127,7 MHz en uno de 3 T.</p>
<p>A temperatura ambiente, el estado de menor energía tiene apenas un ligero exceso de espines (estadística de Boltzmann). Ese pequeño exceso, sumado sobre muchísimos protones, forma la <strong>magnetización neta</strong>, que en equilibrio apunta en la dirección de B₀ (el eje z). Es lo que se mide.</p>
<h3>El pulso</h3>
<p>Una bobina que conduce corriente alterna a la frecuencia de Larmor crea un segundo campo, B₁. Visto desde un marco de referencia que gira a esa frecuencia (el <strong>marco rotatorio</strong>), B₁ queda quieto y hace girar la magnetización a su alrededor. El ángulo depende de cuánto dura el pulso y de su intensidad: un <strong>pulso de 90°</strong> deja la magnetización en el plano transversal, donde precesa y genera la señal.</p>
<h3>Dos relajaciones</h3>
<ul>
<li><strong>T1 (espín-red).</strong> La magnetización longitudinal vuelve a su valor de equilibrio: Mz = M₀(1 − e<sup>−t/T1</sup>). Depende de movimientos moleculares a la frecuencia de Larmor, y como esta crece con B₀, T1 cambia con el campo.</li>
<li><strong>T2 (espín-espín).</strong> La magnetización transversal decae: Mxy = Mxy₀·e<sup>−t/T2</sup>, porque cada paquete de espines siente un campo levemente distinto y se desfasa de los demás. T2 es siempre menor o igual que T1.</li>
<li><strong>T2*.</strong> Las imperfecciones del propio campo añaden desfase: 1/T2* = 1/T2 + 1/T2<sub>inhomo</sub>. Por eso la señal tras un pulso cae más rápido de lo que dicta T2.</li>
</ul>
${tabla(['Tejido (West et al. 2013)', 'T1 a 1,5 T', 'T1 a 3 T', 'T2 a 3 T'], [['Sustancia blanca', '617 ms', '725 ms', '73 ms'], ['Sustancia gris (frontal)', '1235 ms', '1299 ms', '94 ms'], ['LCR', '4167 ms', '3125 ms', '1266 ms']])}
<h3>El eco</h3>
<p>En la secuencia de <strong>eco de espín</strong>, un pulso de 90° pone la magnetización en el plano transversal; empieza a desfasarse, y un pulso de 180° posterior la vuelve a poner en fase, al menos en parte, y aparece una señal: el eco. El tiempo entre el pulso de 90° y el máximo del eco es el <strong>TE</strong>. Fíjate en las ecuaciones de señal del capítulo 10 de Hornak: la del eco de espín decae con T2, mientras que la del <strong>eco de gradiente</strong>, que reenfoca con un gradiente en vez de un pulso de 180°, decae con T2*. Por eso el eco de gradiente es más sensible a las imperfecciones del campo, una propiedad que la fMRI aprovecha (unidad 43).</p>
<p>En la <strong>inversión-recuperación</strong>, un pulso de 180° invierte primero la magnetización; mientras se recupera se aplica un pulso de 90°. La señal pasa por cero cuando el tiempo de inversión vale TI = T1·ln 2 (si la secuencia no se repite): así se anula un tejido elegido.</p>
${clave('Cómo se sabe', `<p>Las <strong>ecuaciones de Bloch</strong> son un sistema de ecuaciones diferenciales acopladas que, integradas, dan las tres componentes de la magnetización en el tiempo bajo cualquier condición (Hornak, cap. 3). El simulador de esta unidad las integra para quince grupos de espines. El eco de espín fue descrito por Hahn en «Spin Echoes», <em>Physical Review</em> 80: 580–594 (1950); <em>de este artículo solo verifiqué la cita, no leí el texto</em>.</p>`)}
<p><small>Fuentes: ${HORNAK}, caps. 1, 3, 4, 10 y 12 («Fast imaging techniques»); West et al. 2013, <em>PLoS ONE</em>, tabla 1 (CC BY; T1 = 1/R1, T2 = 1/R2); cálculos en <code>calculos/s3-37.mjs</code>; Hahn 1950 (cita verificada en Crossref).</small></p>` },

  { id: 'u38', n: 'Física II: el contraste', baj: 'Cómo TR, TE y TI deciden qué tejido brilla: T1, T2, densidad protónica, FLAIR y STIR.',
    obj: ['Distinguir variables intrínsecas e instrumentales, y elegir TR y TE para ponderar en T1, T2 o densidad protónica', 'Calcular el TI que anula un tejido y comparar la inversión-recuperación con la saturación de grasa', 'Explicar cómo un agente paramagnético acorta T1 (relaxividad)', 'Explicar por qué el contraste cambia de 1,5 T a 3 T'],
    rel: ['white_matter_of_forebrain', 'body_of_lateral_ventricle'],
    html: `<p>Una lesión, o cualquier tejido, solo se ve si su señal difiere de la de su vecino: el <strong>contraste</strong> es esa diferencia, C = S<sub>A</sub> − S<sub>B</sub>. Esta unidad muestra cómo se lo controla. ${v('i:resonancia', 'Simulador de contraste: prueba cada secuencia')}</p>
<h3>Dos tipos de variables</h3>
<p>Hornak separa las variables <strong>intrínsecas</strong>, propias del tejido (T1, T2, densidad de espines ρ y T2*), de las <strong>instrumentales</strong>, que elige quien adquiere la imagen: tiempo de repetición (TR), tiempo de eco (TE), tiempo de inversión (TI) y ángulo de giro.</p>
<h3>Las ecuaciones de señal</h3>
<p>Para un eco de espín repetido: S = kρ(1 − e<sup>−TR/T1</sup>)·e<sup>−TE/T2</sup>, válida cuando TR es mucho mayor que TE. Para la inversión-recuperación con eco: S = kρ(1 − 2e<sup>−TI/T1</sup> + e<sup>−TR/T1</sup>)·e<sup>−TE/T2</sup>. La constante k depende de la sensibilidad del equipo. El primer paréntesis premia a los tejidos que recuperan rápido su magnetización (T1 corto); el segundo factor, a los que la pierden lento (T2 largo).</p>
<h3>Ponderar</h3>
${tabla(['Ponderación', 'TR', 'TE', 'Qué brilla'], [
  ['T1', '≤ T1 (corto)', '≪ T2 (corto)', 'Tejidos de T1 corto: sustancia blanca, grasa'],
  ['T2', '≫ T1 (largo)', '≥ T2 (largo)', 'Tejidos de T2 largo: el LCR'],
  ['Densidad protónica', '≫ T1 (largo)', '≪ T2 (corto)', 'Lo que más protones tiene'],
])}
<p>Las reglas de TR y TE son de Hornak; la última columna se deduce con los valores de West: a 3 T la sustancia blanca (T1 de 725 ms) se recupera más que la gris (1299 ms) y con TR corto se ve más clara, y el LCR (T2 de 1266 ms, frente a menos de 100 ms del parénquima) domina las imágenes en T2.</p>
<h3>Anular un tejido y suprimir la grasa</h3>
<p>En inversión-recuperación, la señal de un tejido es cero cuando el paréntesis se anula; si la secuencia no se repite, con TI = T1·ln 2. Un TI largo apaga el LCR (FLAIR); uno corto, la grasa (STIR). Hornak describe además la <strong>saturación</strong>: un pulso selectivo en frecuencia anula la magnetización de la grasa justo antes de la secuencia habitual, y un gradiente desfasa lo que quede en el plano transversal. La inversión-recuperación solo sirve si los T1 de los dos componentes difieren.</p>
<h3>Agentes de contraste</h3>
<p>Un <strong>agente de contraste</strong> es una sustancia inyectada que modifica el contraste entre tejidos. Los paramagnéticos, sobre todo complejos de gadolinio (Gd³⁺, con siete electrones desapareados), aceleran la relajación T1 y T2 del agua vecina: 1/T1 medido = 1/T1 del agua + r₁·[Gd], donde r₁ es la <strong>relaxividad</strong>. Los ferromagnéticos, en cambio, distorsionan B₀ y cambian el T2* del agua que los rodea. Como los iones libres son tóxicos, se unen a ligandos; Hornak señala que, en dosis grandes y con riñón dañado, ciertos agentes se consideran causa de fibrosis sistémica nefrogénica. Los extracelulares salen al líquido extracelular; los tumores, más vascularizados, reciben más agente y su T1 cambia más.</p>
<h3>El campo importa</h3>
<p>West y colaboradores midieron los mismos diez voluntarios a 1,5 y 3 T: R1 (= 1/T1) bajó en la sustancia blanca de 1,62 a 1,38 s⁻¹, es decir, T1 se alargó. Por eso una secuencia «T1» copiada de un equipo a otro no da el mismo contraste. Además, conviene repetir la secuencia unos ciclos sin registrar, hasta que la magnetización se estabilice (Hornak, cap. 10).</p>
${clave('Cómo se sabe', `<p>Los tiempos de relajación se miden con <strong>RM cuantitativa</strong>: en lugar de una imagen ponderada se calculan, vóxel por vóxel, R1, R2 y la densidad protónica. West y colaboradores (2013) lo hicieron en 10 voluntarios sanos con equipos de 1,5 y 3 T, en regiones de interés de sustancia blanca, corteza frontal y LCR, y usaron esos parámetros para segmentar el encéfalo: los tejidos forman grupos en el espacio R1–R2–DP, y los vóxeles con mezcla de tejidos (volumen parcial) quedan en medio.</p>`)}
<p>${v('i:espacio-k', 'Siguiente paso: cómo se forma la imagen')}</p>
<p><small>Fuentes: ${HORNAK}, caps. 4, 8 («Basic imaging techniques»: agentes de contraste y supresión de grasa) y 10; West J, Blystad I, Engström M, Warntjes JBM, Lundberg P, <em>PLoS ONE</em> 2013, tabla 1 (CC BY 4.0).</small></p>` },
];
