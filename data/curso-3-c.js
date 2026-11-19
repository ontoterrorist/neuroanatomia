// Semestre III · unidades 43 a 46. Cada afirmación está respaldada en docs/semestre-3/fuentes.md.
import { v, clave, clin, tabla } from './ayudas-curso.js';

const HORNAK = 'Hornak, <em>The Basics of MRI</em> (cis.rit.edu/htbooks/mri)';
const GLOVER = 'Glover GH, «Overview of functional magnetic resonance imaging», <em>Neurosurg Clin N Am</em> 2011 (PMC3073717)';
const SOARES = 'Soares JM et al., «A hitchhiker’s guide to functional magnetic resonance imaging», <em>Front Neurosci</em> 2016 (CC BY)';

export const UNIDADES_3_C = [
  { id: 'u43', n: 'El contraste BOLD', baj: 'La desoxihemoglobina como contraste natural y la forma de la respuesta hemodinámica.',
    obj: ['Explicar por qué la desoxihemoglobina altera la señal de RM', 'Describir la secuencia de cambios que siguen a la activación neuronal', 'Describir la forma de la respuesta hemodinámica y sus fases', 'Justificar el uso del eco de gradiente y la elección del TE'],
    rel: ['primary_motor_cortex', 'cuneus'],
    html: `<p>Casi toda la resonancia funcional usa un mismo contraste: el <strong>BOLD</strong> (dependiente del nivel de oxigenación de la sangre). Esta unidad explica de dónde sale y qué forma tiene en el tiempo. ${v('i:fmri', 'Simulador de fMRI con la HRF canónica')}</p>
<h3>Un contraste que ya está en la sangre</h3>
<p>La hemoglobina cambia sus propiedades magnéticas al perder el oxígeno. La oxihemoglobina es diamagnética y, magnéticamente, casi no se distingue del tejido. La desoxihemoglobina tiene cuatro electrones no apareados y es fuertemente paramagnética: crea gradientes de campo locales cuya intensidad depende de su concentración, y esos gradientes acortan el T2 y el T2* de la sangre y del tejido que la rodea (Glover 2011). Más desoxihemoglobina, menos señal.</p>
<h3>De la actividad a la señal</h3>
<ol>
<li>La actividad neuronal aumenta el consumo de oxígeno; al principio se acumula algo de desoxihemoglobina.</li>
<li>En uno o dos segundos se dilatan los vasos y el flujo sube, y llega más oxígeno del que se consume (unidad 42).</li>
<li>La sangre venosa queda más oxigenada que en reposo: baja la desoxihemoglobina y la señal aumenta.</li>
</ol>
<p>Attwell y colaboradores lo resumen así: la señal BOLD es, de forma simplificada, la diferencia entre la hiperemia funcional, que la aumenta, y el consumo de oxígeno, que la reduce; como domina la hiperemia, el BOLD refleja sobre todo sus causas.</p>
<h3>La forma de la respuesta</h3>
<p>Ante un estímulo breve, la respuesta BOLD tiene una anchura de unos 3 s y su pico llega 5–6 s después del inicio (Glover). La <strong>respuesta hemodinámica canónica</strong> de SPM, que usa el simulador, es la diferencia de dos funciones gamma: una para la respuesta principal y otra para un rebote negativo posterior; con sus parámetros por defecto, el pico queda hacia los 5 s. El modelo del globo de Buxton y colaboradores (1998) incorpora los cambios de oxigenación y de volumen de la sangre y explica los transitorios que a veces se ven: una caída inicial, un sobrepaso y un <strong>rebote posterior al estímulo</strong> prolongado.</p>
<p>El efecto es pequeño: menos del 1 % en muchos estudios de procesos cognitivos superiores (Glover). Por eso la fMRI necesita estadística (unidad 47).</p>
<h3>Cómo se adquiere</h3>
${tabla(['Elección', 'Motivo'], [
  ['Eco de gradiente', 'Es sensible a T2*, y a 1,5 y 3 T predomina el contraste T2*, mayor en las vénulas'],
  ['Eco de espín a campos altos', 'El contraste T2 se origina más en capilares y tejido: más especificidad espacial'],
  ['TE ≈ T2* del tejido', 'El contraste BOLD es óptimo cuando el TE iguala el T2* local (Soares et al.). A 3 T, en 21 voluntarios, el T2* medio fue de 50,0 ms en la sustancia blanca y 55,7 ms en la gris (Oros-Peusquens et al. 2019)'],
  ['Imagen ecoplanar', 'Cada imagen en ~60 ms, para no mezclar movimiento y respiración (unidad 40)'],
])}
${clave('Cómo se sabe', `<p>Ogawa y colaboradores (1990) mostraron que la desoxihemoglobina de la sangre venosa funciona como un agente de contraste natural. Con secuencias de eco de gradiente en campos altos obtuvieron imágenes de la microvasculatura cerebral, en ratas según Glover, cuyo contraste seguía los cambios de oxigenación provocados por anestésicos, por hipoglucemia inducida con insulina y por mezclas de gases inhalados. Propusieron usarlo para mapear la oxigenación en condiciones fisiológicas. Dos años después llegaron los primeros mapas en humanos (unidad 35). <em>Leí el resumen.</em></p>`)}
<p>${v('i:bloch', 'T2 y T2* en el simulador del espín')} ${v('e:primary_motor_cortex', 'Corteza motora primaria')}</p>
<p><small>Fuentes: Ogawa et al., <em>PNAS</em> 1990 (resumen); ${GLOVER}; Buxton, Wong y Frank, <em>Magn Reson Med</em> 1998 (resumen); Attwell et al., <em>Nature</em> 2010 (PMC3206737); ${SOARES}; Oros-Peusquens et al., <em>Front Neurol</em> 2019 (CC BY; T2* a 3 T); SPM, <code>spm_hrf.m</code>.</small></p>` },

  { id: 'u44', n: 'Más allá del BOLD: perfusión y difusión', baj: 'Medir el flujo con sangre marcada y seguir la sustancia blanca con el agua que difunde.',
    obj: ['Explicar el principio del marcaje arterial de espines (ASL)', 'Describir cómo se mide la difusión con gradientes', 'Definir la difusividad media, la anisotropía fraccional y el tensor de difusión', 'Reconocer los límites de la tractografía'],
    rel: ['corpus_callosum', 'white_matter_of_forebrain'],
    html: `<p>La RM puede medir otras dos cosas de interés funcional y estructural: cuánta sangre llega a cada región (<strong>perfusión</strong>) y cómo se mueve el agua en los tejidos (<strong>difusión</strong>). ${v('v:corticoespinal', 'La vía corticoespinal en 3D')}</p>
<h3>Perfusión con sangre marcada</h3>
<p>El flujo sanguíneo cerebral se puede medir inyectando un contraste o, sin inyección, con el <strong>marcaje arterial de espines</strong> (ASL). La idea de Detre y colaboradores (1992): saturar la magnetización del agua de la sangre a la altura del cuello, creando un trazador endógeno. Esa sangre marcada llega al encéfalo e intercambia con el agua del tejido; la señal resultante depende del flujo regional y del T1. Se resta una imagen marcada de una de control.</p>
<p>La diferencia es pequeña: suele ser menor del 1 % de la señal, y el movimiento del sujeto es su principal fuente de ruido. Glover señala que el ASL tiene menos sensibilidad que el BOLD, tarda más y sufre más con el movimiento, por lo que se usa sobre todo para medir el flujo basal en valores absolutos.</p>
${clave('Una recomendación de consenso', `<p>El Grupo de Estudio de Perfusión de la ISMRM y el consorcio europeo «ASL in Dementia» se reunieron en Ámsterdam en octubre de 2012 y recomendaron una implementación estándar para la clínica: marcaje pseudocontinuo, supresión del fondo, lectura 3D segmentada y presentación del flujo en unidades absolutas. Para adultos aconsejan un retardo tras el marcaje de 2000 ms. El método se ha validado frente a la PET con oxígeno-15 (Alsop et al. 2015).</p>`)}
<h3>Difusión</h3>
<p>La secuencia de difusión es un eco de espín con dos gradientes idénticos colocados simétricamente a cada lado del pulso de 180°. Un espín quieto adquiere con el primero una fase que el segundo deshace; uno que se movió en el intervalo no recupera su fase, y la señal cae. Cuanto más difunde el agua, más se apaga la señal (Hornak, cap. 13). Le Bihan y colaboradores (1986) llamaron <strong>coeficiente de difusión aparente</strong> (ADC) a lo que se mide así en el tejido, porque difiere del de agua pura.</p>
<h3>El tensor</h3>
<p>En la sustancia blanca el agua difunde más a lo largo de los axones que a través de ellos: la difusión es <strong>anisótropa</strong>. En la sustancia gris lo es menos y en el LCR es isótropa. Basser y colaboradores (1994) la modelaron con un <strong>tensor</strong>, un elipsoide representado por una matriz simétrica de 3 × 3. Sus vectores propios dan las direcciones de máxima y mínima difusión; sus valores propios, la magnitud en cada dirección. De ahí salen la <strong>difusividad media</strong> (MD o ADC), la <strong>anisotropía fraccional</strong> (FA), y las difusividades axial y radial (Soares et al. 2013).</p>
<h3>Tractografía y sus límites</h3>
<p>Siguiendo la dirección principal de vóxel en vóxel se reconstruyen haces: es la <strong>tractografía</strong>, determinista (por ejemplo, el algoritmo FACT) o probabilística. Un vóxel grande tiene más probabilidad de contener fibras con varias orientaciones, que un solo tensor no puede describir. Métodos como HARDI, DSI o QBI describen varias direcciones por vóxel, a costa de adquisiciones más largas. Cada trayectoria termina cuando la FA baja de un umbral (0,1–0,3 en el adulto) o cuando la dirección gira más de 40–70° (Soares et al.). ${v('i:difusion', 'Simulador: ruido, umbrales y cruce de fibras')}</p>
${clave('Cómo se sabe', `<p>Basser, Mattiello y Le Bihan (1994) estimaron un tensor de difusión efectivo por vóxel a partir de una serie de experimentos de eco de espín con gradientes pulsados. Mostraron que los tres ejes propios del tejido coinciden con los vectores propios del tensor, que eso permite determinar la orientación de los haces, y que los invariantes del tensor no dependen de la orientación del sujeto en el imán. <em>Leí el resumen.</em></p>`)}
<p><small>Fuentes: Detre et al., <em>Magn Reson Med</em> 1992 (resumen); Alsop et al., <em>Magn Reson Med</em> 2015 (PMC4190138); ${GLOVER}; ${HORNAK}, cap. 13; Le Bihan et al., <em>Radiology</em> 1986 (resumen); Basser et al., <em>Biophys J</em> 1994 (resumen); Soares JM et al., «A hitchhiker’s guide to diffusion tensor imaging», <em>Front Neurosci</em> 2013 (CC BY).</small></p>` },

  { id: 'u45', n: 'Diseño experimental: bloques y eventos', baj: 'Cómo se organiza una tarea para que el escáner pueda verla.',
    obj: ['Comparar los diseños en bloques, de eventos y mixtos', 'Explicar para qué sirve variar el intervalo entre estímulos', 'Distinguir sustracción, diseño factorial y diseño paramétrico', 'Explicar por qué importan la línea de base y el tamaño de la muestra'],
    rel: [],
    html: `<p>Un experimento de fMRI induce dos o más estados cognitivos mientras se adquieren volúmenes sin parar. La pregunta es si la señal difiere entre estados. Cómo se ordenan esos estados en el tiempo decide qué se puede concluir. ${v('i:fmri', 'Simulador: compara bloques y eventos')}</p>
<h3>Reposo y tarea</h3>
<p>En los estudios de <strong>reposo</strong> no hay tarea: la persona descansa, con los ojos cerrados o abiertos, y se analizan las fluctuaciones espontáneas (unidad 49). En los de <strong>tarea</strong> hay tres grandes diseños (Soares et al. 2016).</p>
${tabla(['Diseño', 'Cómo es', 'Ventajas', 'Limitaciones'], [
  ['Bloques', 'Épocas de una condición, habitualmente de 15–30 s, alternadas con otra o con reposo', 'Buena potencia estadística, señal amplia y robusta; óptimo para detectar activación', 'Habituación a la tarea; no permite definir bien el curso temporal de la respuesta'],
  ['Eventos lentos', 'Estímulos separados por más de 15 s', 'Las respuestas no se superponen', 'Menos estímulos por minuto y menos potencia'],
  ['Eventos rápidos', 'Estímulos más juntos que la duración de la respuesta', 'Más ensayos, menos anticipación y aburrimiento', 'Las respuestas se superponen y hay que separarlas'],
])}
<p>También se usan diseños mixtos, que combinan bloques y eventos. Glover lo resume: el diseño en bloques es el mejor para detectar una activación, y el de eventos con intervalos variables, para caracterizar su amplitud y su curso temporal.</p>
<h3>Variar el intervalo</h3>
<p>En los diseños rápidos se usa un intervalo variable entre estímulos (<em>jitter</em>). Así las respuestas se superponen de forma distinta en cada ensayo, se reduce la colinealidad entre regresores y se muestrea la respuesta con más finura. También ayuda a evitar respuestas anticipatorias. El orden aleatorio o seudoaleatorio de los estímulos reduce la habituación.</p>
<h3>Qué se compara</h3>
<ul>
<li><strong>Sustracción.</strong> La comparación más simple: condición A menos condición B, una de ellas de control.</li>
<li><strong>Diseño factorial.</strong> Dos o más factores con varios niveles; permite ver efectos principales e interacciones, por ejemplo (A − B) − (C − D).</li>
<li><strong>Diseño paramétrico.</strong> Una variable continua, como la dificultad, para ver si la respuesta crece o decrece con ella.</li>
</ul>
<p>La línea de base es crítica: la actividad neural fuera de la tarea puede variar de forma impredecible e incluso superar a la de la tarea. Solo debe cambiar entre condiciones el efecto de interés; la atención o la valencia deben quedar constantes (Glover). Se recomienda más de una línea de base, muchos ensayos (mejor varias series cortas que una larga) y mantener a la persona comprometida con la tarea. El ruido del escáner puede ser un factor de confusión en estudios auditivos.</p>
<h3>¿Cuántas personas?</h3>
<p>Soares y colaboradores advierten que muchos estudios publicados tienen poca potencia estadística por muestras pequeñas y muchas comparaciones, y recomiendan calcular la potencia con datos piloto antes de empezar.</p>
${clave('Cómo se sabe', `<p>Glover (1999) midió la respuesta BOLD en las cortezas sensitivomotora y auditiva mientras los sujetos golpeaban con los dedos al ritmo de un metrónomo, con estímulos de 167 ms a 16 s separados por 30 s. Encontró que el sistema no es lineal: la respuesta a un estímulo largo no se predice convolucionando la respuesta a uno de 1 s. Aun así, la deconvolución lineal funcionó cuando los estímulos estaban separados al menos 4 s. Es el supuesto que usan los análisis de diseños de eventos. <em>Leí el resumen.</em></p>`)}
<p><small>Fuentes: ${SOARES}; ${GLOVER}; Glover GH, «Deconvolution of impulse response in event-related BOLD fMRI», <em>NeuroImage</em> 1999 (resumen).</small></p>` },

  { id: 'u46', n: 'Preprocesamiento', baj: 'Lo que se hace con las imágenes antes de buscar activaciones: tiempo, movimiento, espacio y ruido.',
    obj: ['Ordenar los pasos habituales del preprocesamiento', 'Explicar la corrección de movimiento y sus límites', 'Distinguir los espacios de Talairach y MNI y la normalización lineal y no lineal', 'Justificar el suavizado espacial y el filtrado temporal'],
    rel: ['anterior_commissure'],
    html: `<p>Antes de cualquier prueba estadística, las imágenes pasan por una serie de correcciones. Glover las enumera: corrección del tiempo de adquisición de cada corte, corrección de movimiento, corrección del ruido fisiológico y filtrado temporal, suavizado espacial y blanqueado de la autocorrelación. ${v('i:fmri', 'Simulador: la deriva y el ruido')}</p>
<h3>Tiempo de cada corte</h3>
<p>Los cortes de un volumen no se adquieren a la vez. La <strong>corrección del tiempo de corte</strong> lleva todos al mismo instante. Su impacto es variable: importante en diseños de eventos, menor en bloques y mínimo en reposo; según Soares y colaboradores, nunca empeora los resultados. Cuándo hacerla, antes o después de corregir el movimiento, sigue en discusión porque ambos pasos están ligados.</p>
<h3>Movimiento</h3>
<p>Se realinea cada volumen con uno de referencia mediante una <strong>transformación de cuerpo rígido</strong>: tres traslaciones y tres rotaciones. Una regla práctica es descartar los conjuntos de datos con movimientos mayores que un vóxel. Los seis parámetros estimados se añaden además al modelo estadístico como regresores sin interés. Pero realinear no basta: movimientos pequeños dejan un ruido estructurado que altera las correlaciones según la distancia. Para eso se usa el <strong>«scrubbing»</strong>: se miden el desplazamiento entre volúmenes (FD) y el cambio global de señal (DVARS) y se marcan como atípicos los volúmenes que superan un umbral, comúnmente FD de 0,2–1 mm o DVARS de 0,3–0,5 %.</p>
<h3>Llevar a todos al mismo espacio</h3>
<p>Para comparar personas, cada cerebro se <strong>normaliza</strong> a una plantilla. Los dos sistemas más usados son el de <strong>Talairach</strong>, basado en el cerebro de una sola persona y con el eje principal en la línea que une las comisuras anterior y posterior, y el del <strong>MNI</strong>, basado en el promedio de imágenes T1 de muchas personas (la plantilla MNI152 es la más usada). Sus coordenadas no designan las mismas regiones, así que a menudo hay que convertir entre ambas. Las transformaciones pueden ser lineales (afines, iguales a lo largo de un eje) o no lineales (locales). Una alternativa es registrar sobre modelos de la superficie cortical (unidad 50).</p>
<h3>Suavizar y filtrar</h3>
<p>El <strong>suavizado espacial</strong> convoluciona la imagen con una gaussiana: mejora la relación señal/ruido y el ajuste a los supuestos estadísticos, pero reduce la resolución y puede borrar activaciones pequeñas o desplazar sus picos. Un punto de partida razonable es un ancho a media altura del doble del vóxel; en análisis de grupo se usan 5–10 mm.</p>
${tabla(['Fuente de ruido', 'Frecuencia típica (Soares et al.)'], [['Deriva del equipo', '< 0,01 Hz'], ['Pulso cardíaco', '~0,15 Hz'], ['Respiración', '~0,3 Hz']])}
<p>El <strong>filtro temporal</strong> de paso alto (típicamente 0,008–0,01 Hz, es decir, 100–128 s) elimina la deriva lenta en las tareas; en reposo se usa un filtro de paso de banda de 0,01–0,08 Hz. Con un TR de 2–3 s, el ruido cardíaco y respiratorio se pliega hacia frecuencias bajas y puede confundirse con señal.</p>
${clave('Cómo se sabe', `<p>Power y colaboradores (2012) mostraron que el movimiento de la cabeza cambia de forma sustancial las series de los estudios de conectividad en reposo aun después de realinear y de regresar los parámetros de movimiento: muchas correlaciones de larga distancia bajaban y muchas de corta distancia subían, de forma sistemática pero espuria. Propusieron dos índices por volumen: el <strong>FD</strong>, la suma de los valores absolutos de las derivadas de los seis parámetros de realineamiento (con las rotaciones convertidas a milímetros sobre una esfera de 50 mm de radio), y el <strong>DVARS</strong>, la raíz cuadrática media del cambio de señal entre volúmenes sucesivos en todo el encéfalo. Eliminaron los volúmenes con FD > 0,5 mm y DVARS > 0,5 %, junto con uno anterior y dos posteriores. Solo en la cohorte de niños de 3 T, esa regla descartó cerca del 25 % de los datos. <em>Leí el texto completo (manuscrito de autor).</em></p>`)}
<p>${v('e:anterior_commissure', 'Comisura anterior, referencia del espacio de Talairach')}</p>
<p><small>Fuentes: ${GLOVER}; ${SOARES}; Power et al., <em>NeuroImage</em> 2012 (texto completo; PMC3254728).</small></p>` },
];
