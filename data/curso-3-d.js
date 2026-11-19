// Semestre III · unidades 47 a 50. Cada afirmación está respaldada en docs/semestre-3/fuentes.md.
import { v, clave, clin, tabla } from './ayudas-curso.js';

const GLOVER = 'Glover GH, «Overview of functional magnetic resonance imaging», <em>Neurosurg Clin N Am</em> 2011 (PMC3073717)';
const SOARES = 'Soares JM et al., «A hitchhiker’s guide to functional magnetic resonance imaging», <em>Front Neurosci</em> 2016 (CC BY)';
const LINDQUIST = 'Lindquist MA, «The statistical analysis of fMRI data», <em>Statistical Science</em> 2008 (arXiv:0906.3662)';

export const UNIDADES_3_D = [
  { id: 'u47', n: 'El modelo lineal general', baj: 'Cómo se convierte una serie temporal por vóxel en un mapa estadístico.',
    obj: ['Escribir el modelo lineal general y nombrar sus partes', 'Construir un regresor convolucionando el estímulo con la HRF', 'Explicar para qué sirven los regresores sin interés', 'Reconocer los supuestos del modelo y cuándo fallan'],
    rel: [],
    html: `<p>Como el contraste BOLD es pequeño, restar el promedio de una condición del de otra no basta: el ruido produciría falsos positivos y falsos negativos (Glover). Hace falta un modelo estadístico. El más usado es el <strong>modelo lineal general</strong> (MLG). ${v('i:fmri', 'Simulador: ajusta el MLG vóxel por vóxel')}</p>
<h3>La ecuación</h3>
<p class="formula">Y = Xβ + ε</p>
<p><strong>Y</strong> es la serie temporal observada en un vóxel; <strong>X</strong>, la <strong>matriz de diseño</strong>, con una columna por cada regresor; <strong>β</strong>, los parámetros que se estiman (cuánto aporta cada regresor), y <strong>ε</strong>, el error. Se ajusta un modelo así en cada vóxel, con la misma matriz de diseño (Soares et al. 2016).</p>
<h3>Construir los regresores</h3>
<p>El paso clave es predecir cómo debería verse la señal. Se toman los inicios y duraciones de los estímulos y se los convoluciona con una <strong>respuesta hemodinámica canónica</strong>: el resultado es la serie BOLD esperada para cada condición de interés. Esto supone que el sistema es lineal e invariante en el tiempo: la actividad neuronal es la entrada y la respuesta hemodinámica, la respuesta al impulso (Lindquist 2008). Glover (1999) mostró que el supuesto no se cumple del todo (unidad 45), pero los modelos lineales dan caracterizaciones robustas e interpretables en datos ruidosos.</p>
<p>A la matriz se añaden <strong>regresores sin interés</strong>: la deriva lenta del equipo, los parámetros de movimiento, señales fisiológicas o la señal de la sustancia blanca. Así se separa lo que interesa de lo que no.</p>
<h3>Del ajuste al mapa</h3>
<p>Para cada vóxel se estiman los β y se forma una estadística de prueba, habitualmente una t para un <strong>contraste</strong>: una combinación de parámetros que expresa la pregunta, por ejemplo «tarea mayor que reposo» o «A mayor que B». El conjunto de esas estadísticas forma un <strong>mapa estadístico paramétrico</strong>. Este análisis de cada persona se llama de <strong>primer nivel</strong>.</p>
${tabla(['Pieza', 'En el simulador'], [['Y', 'La serie gris del vóxel que eliges'], ['X', 'La imagen de tres columnas: tarea, constante y deriva'], ['β de la tarea', 'Se muestra bajo la serie'], ['t', 'El color del mapa, si supera el umbral']])}
<h3>El ruido no es blanco</h3>
<p>El ruido de la fMRI viene de fuentes térmicas, del movimiento de la cabeza, del pulso y la respiración y de variaciones del metabolismo basal (Glover). Además, la deriva del equipo produce cambios lentos de intensidad. Las series quedan <strong>autocorrelacionadas</strong>: el error de un instante se parece al del siguiente. Lindquist señala que se las suele modelar con procesos AR(p) o ARMA(1,1), y que si se eliminan bien los componentes de ruido el residuo se acerca al ruido blanco. Por eso se blanquean los datos antes de la prueba o se usan mínimos cuadrados generalizados.</p>
<p>La principal crítica al MLG es que descansa en supuestos de las pruebas paramétricas que no suelen comprobarse (Soares et al.). En el simulador, el ruido es blanco a propósito: es el caso ideal.</p>
${clave('Cómo se sabe', `<p>Friston y colaboradores (1994) propusieron analizar las imágenes funcionales con un solo marco: el modelo lineal general, del que pruebas como el ANCOVA, las correlaciones o la t son casos particulares, combinado con la teoría de campos gaussianos para la inferencia. Su ventaja, según los autores, es que el mismo puñado de ecuaciones sirve para casi cualquier diseño. <em>Leí el resumen.</em></p>`)}
<p><small>Fuentes: ${SOARES}; ${LINDQUIST}; ${GLOVER}; Glover 1999, <em>NeuroImage</em> (resumen); Friston et al., <em>Hum Brain Mapp</em> 1994 (resumen).</small></p>` },

  { id: 'u48', n: 'Análisis de grupo y comparaciones múltiples', baj: 'De una persona a una población, y cómo no engañarse con cien mil pruebas.',
    obj: ['Describir el modelo de dos niveles para el análisis de grupo', 'Explicar el problema de las comparaciones múltiples', 'Comparar el control de la tasa de error por familia, la tasa de falsos descubrimientos y la inferencia por cúmulos', 'Explicar qué mostró el estudio de Eklund y colaboradores'],
    rel: [],
    html: `<p>Las respuestas BOLD de los procesos cognitivos son pequeñas, así que la mayoría de los estudios hace inferencias sobre grupos más que sobre individuos (Glover). Esta unidad explica cómo se pasa de una persona a un grupo y cómo se controla el error cuando se hace una prueba por vóxel. ${v('i:fmri', 'Simulador: compara p < 0,05, p < 0,001 y Bonferroni')}</p>
<h3>Dos niveles</h3>
<p>En el <strong>primer nivel</strong> se ajusta el MLG de cada persona: muchos datos, autocorrelacionados. En el <strong>segundo nivel</strong>, los parámetros de cada persona se tratan como datos y se modelan con una matriz de diseño de grupo, por ejemplo pacientes frente a controles: pocos datos, independientes. Ambos niveles pueden combinarse en un solo <strong>modelo de efectos mixtos</strong>, que permite inferencias válidas sobre la población (Lindquist 2008). Las pruebas de grupo habituales son la t, la regresión múltiple y el ANOVA. Cuando los supuestos paramétricos no se cumplen, se usan <strong>pruebas de permutación</strong>, que estiman la distribución nula a partir de los propios datos (Soares et al. 2016).</p>
<h3>Cien mil pruebas</h3>
<p>Un estudio típico hace más de 100 000 pruebas, una por vóxel. Con un umbral de p &lt; 0,001 en cada una, cabría esperar hasta unos 100 vóxeles falsamente significativos (Soares et al.). En el simulador lo ves con p &lt; 0,05: aparecen puntos activos dispersos por todo el corte.</p>
${tabla(['Estrategia', 'Qué controla', 'Comentario'], [
  ['Bonferroni', 'La probabilidad de algún falso positivo', 'Divide α entre el número de pruebas; ignora que los vóxeles vecinos se parecen'],
  ['Tasa de error por familia con campos aleatorios', 'Lo mismo, contando elementos de resolución («resels»)', 'Tiene en cuenta la suavidad de la imagen; a menudo conservadora'],
  ['Tasa de falsos descubrimientos (FDR)', 'La proporción de falsos positivos entre los resultados significativos', 'Menos estricta y con más potencia; el procedimiento usual supone pruebas independientes'],
  ['Umbral por cúmulos', 'La probabilidad de un cúmulo de cierto tamaño bajo la hipótesis nula', 'Requiere un umbral primario arbitrario; cuanto mayor el cúmulo, menos específica la inferencia'],
])}
<p>Worsley y colaboradores (1992) dieron un valor p aproximado para el máximo de una imagen estadística, proporcional al volumen explorado dividido por el producto de los anchos a media altura de la suavidad: en la práctica, al número de elementos de resolución. Genovese, Lazar y Nichols (2002) introdujeron la FDR en neuroimagen. El análisis de regiones de interés definidas de antemano reduce el número de pruebas, a costa de ignorar el resto del cerebro.</p>
<p>Soares y colaboradores recomiendan publicar los mapas de tamaño del efecto, no solo los resultados significativos, para poder combinar estudios.</p>
${clave('Cómo se sabe', `<p>Eklund, Nichols y Knutsson (2016) tomaron datos de reposo de 499 controles sanos (datos sin ninguna tarea, donde no debería haber efectos) y les aplicaron 3 millones de análisis de grupo con diseños de tarea inventados. Con un umbral nominal del 5 %, los métodos paramétricos de SPM, FSL y AFNI resultaron conservadores en la inferencia por vóxel pero inválidos en la inferencia por cúmulos, con tasas de falsos positivos de hasta el 70 %. La causa principal: la autocorrelación espacial de los datos no tiene la forma gaussiana supuesta. La prueba no paramétrica de permutación dio resultados nominales. El borrador previo (1 920 000 análisis, tasas de hasta 60 %) añade que el umbral que define el cúmulo es el parámetro que más pesa: cuanto más liberal, más falsos positivos, mientras que la permutación no cambia. <em>Leí el resumen de PNAS y el borrador completo (arXiv, CC BY), cuyas cifras difieren de las de la versión publicada.</em></p>`)}
<p><small>Fuentes: ${LINDQUIST}; ${SOARES}; ${GLOVER}; Worsley et al., <em>J Cereb Blood Flow Metab</em> 1992 (resumen); Genovese et al., <em>NeuroImage</em> 2002 (resumen); Eklund et al., <em>PNAS</em> 2016 (resumen) y arXiv:1511.01863 v1 (texto completo, CC BY).</small></p>` },

  { id: 'u49', n: 'Análisis exploratorio y conectividad', baj: 'Redes en reposo, componentes independientes y quién influye sobre quién.',
    obj: ['Distinguir conectividad funcional y efectiva', 'Describir el análisis por semilla, PCA, ICA y teoría de grafos', 'Explicar qué son las redes en reposo y cómo se adquieren', 'Reconocer los límites de los métodos de causalidad'],
    rel: ['precuneus', 'primary_motor_cortex'],
    html: `<p>No todo análisis parte de una tarea. Los métodos exploratorios buscan patrones en los datos sin un modelo previo, y los de conectividad preguntan cómo se relacionan las regiones entre sí. ${v('l:u42', 'El estado basal y el modo por defecto (unidad 42)')}</p>
<h3>Dos clases de conectividad</h3>
<p>Lindquist (2008) las define así: la <strong>conectividad funcional</strong> es la asociación no dirigida entre dos o más series temporales; la <strong>conectividad efectiva</strong>, la influencia dirigida de una región sobre otras. Una correlación no dice quién causa qué.</p>
<h3>Métodos de conectividad funcional</h3>
${tabla(['Método', 'Idea', 'Cuidado'], [
  ['Semilla', 'Se correlaciona la serie de una región elegida con todos los vóxeles', 'Requiere elegir la región de antemano'],
  ['PCA', 'Patrones espaciales que explican la mayor variabilidad (descomposición en valores singulares)', 'Supone linealidad, ortogonalidad y buena señal/ruido'],
  ['ICA', 'Separa los datos en componentes espacial o temporalmente independientes', 'Elegir los componentes de interés no es trivial'],
  ['Agrupamiento', 'Junta vóxeles con series parecidas', 'Difícil de reproducir entre sujetos'],
  ['Grafos', 'Mide propiedades de la red: agrupamiento, longitud de camino, centralidad, modularidad', 'Más difícil de interpretar en tareas'],
  ['Conectividad dinámica', 'Correlaciones en ventanas deslizantes', 'Sensible al ruido fisiológico'],
])}
<p>Según Soares y colaboradores (2016), la ICA es el método más usado en los estudios de conectividad en reposo, y también sirve para separar artefactos.</p>
<h3>Redes en reposo</h3>
<p>En reposo aparecen <strong>redes</strong> estables y reproducibles entre personas, sesiones, equipos y métodos. La condición importa: ojos cerrados, abiertos o fijos en una cruz dan resultados comparables, pero conviene usar la misma con todos los participantes. Adquisiciones de 5 a 7 minutos ofrecen un compromiso razonable, y unos 13 minutos aumentan la fiabilidad. Entre esas redes está la del <strong>modo por defecto</strong>, un grupo de áreas que reduce su actividad durante muchas tareas dirigidas (Raichle et al. 2001). Glover advierte que estas redes despiertan interés por sus cambios en enfermedades como el Alzheimer o la depresión, pero que su dinámica es más compleja de lo que se pensaba.</p>
<h3>Conectividad efectiva</h3>
<p>La <strong>causalidad de Granger</strong> infiere dirección por precedencia temporal, sin modelo previo; la limitan las diferencias de latencia de la respuesta hemodinámica entre regiones, el muestreo lento y el ruido. El <strong>modelado causal dinámico</strong> (DCM) trabaja en el nivel neuronal y con estimación bayesiana, pero necesita modelos especificados de antemano y mucho cálculo. Otras opciones son los modelos de ecuaciones estructurales y las interacciones psicofisiológicas (Soares et al.).</p>
<p>Por último, el <strong>análisis de patrones multivóxel</strong> usa a la vez la actividad de muchos vóxeles para decodificar estados mentales, en lugar de mirar cada vóxel por separado.</p>
${clave('Cómo se sabe', `<p>Biswal y colaboradores (1995) adquirieron 512 imágenes ecoplanares del cerebro en reposo, una cada 250 ms. Primero localizaron con una tarea de mover la mano las regiones sensitivomotoras. En reposo, las fluctuaciones lentas (menores de 0,1 Hz) de esas regiones estaban muy correlacionadas entre sí y con otras regiones motoras. Concluyeron que esa correlación es una manifestación de la conectividad funcional del cerebro. <em>Leí el resumen.</em></p>`)}
<p>${v('e:primary_motor_cortex', 'Corteza motora primaria')} ${v('e:precuneus', 'Precúneo')}</p>
<p><small>Fuentes: ${LINDQUIST}; ${SOARES}; ${GLOVER}; Biswal et al., <em>Magn Reson Med</em> 1995 (resumen); Raichle et al., <em>PNAS</em> 2001 (resumen).</small></p>` },

  { id: 'u50', n: 'Estructura y función: morfometría y superficie cortical', baj: 'Medir la forma del cerebro y combinar estructura, conexiones y función.',
    obj: ['Describir los pasos de la morfometría basada en vóxeles', 'Explicar qué hace un programa de reconstrucción de la superficie cortical', 'Explicar cómo se valida una medida como el grosor cortical', 'Valorar con prudencia el uso de la neuroimagen como biomarcador individual'],
    rel: ['white_matter_of_forebrain', 'body_of_hippocampus'],
    html: `<p>La imagen estructural no solo sirve para ver: también para <strong>medir</strong>. Esta última unidad trata la morfometría, los modelos de la superficie cortical y la integración de estructura y función. ${v('vista:encefalo', 'El encéfalo del atlas en 3D')}</p>
<h3>Morfometría basada en vóxeles</h3>
<p>Ashburner y Friston (2000) la describen, en su forma más simple, como la comparación vóxel a vóxel de la concentración local de sustancia gris entre dos grupos. Los pasos:</p>
<ol>
<li>Normalizar las imágenes de alta resolución de todos los sujetos al mismo espacio estereotáctico.</li>
<li>Segmentar la sustancia gris, corrigiendo la falta de uniformidad de la intensidad.</li>
<li>Suavizar los segmentos de sustancia gris.</li>
<li>Hacer pruebas estadísticas por vóxel y corregir las comparaciones múltiples con la teoría de campos gaussianos (unidad 48).</li>
</ol>
<h3>La superficie cortical</h3>
<p>La corteza es una lámina plegada, y muchas preguntas se responden mejor sobre su superficie que en una rejilla de vóxeles. FreeSurfer, un programa libre y de código abierto, construye modelos de la superficie cortical a partir de cualquier imagen ponderada en T1 razonable (Fischl 2012). Además:</p>
<ul>
<li>segmenta en volumen la mayoría de las estructuras visibles a simple vista, e incluso los subcampos del hipocampo;</li>
<li>alinea a distintas personas según el patrón de sus pliegues;</li>
<li>divide la corteza en regiones según sus pliegues (parcelación);</li>
<li>mide el <strong>grosor de la sustancia gris</strong> en cada punto;</li>
<li>segmenta fascículos de sustancia blanca con imágenes de difusión.</li>
</ul>
<p>Registrar las series funcionales sobre esos modelos de superficie, en vez de en volumen, mejora el mapeo de la corteza en los pasos siguientes (Soares et al. 2016). Las imágenes de difusión pueden integrarse con las funcionales y las estructurales en análisis multimodales (Soares et al. 2013).</p>
<h3>¿Biomarcadores?</h3>
<p>La fMRI se usa ya en la clínica, por ejemplo para planificar cirugías, y se estudia como biomarcador de enfermedad o para seguir tratamientos. Glover pide prudencia: como las respuestas de los procesos cognitivos son pequeñas, la mayoría de los estudios solo permite inferencias sobre grupos, y el uso individual se limita, por ahora, a tareas con respuestas fuertes, como las de los sistemas sensoriales primarios.</p>
${clin(`<p>En la planificación prequirúrgica, la fMRI con una tarea sensitiva busca localizar funciones importantes para preservarlas durante la cirugía; ahí la intensidad de la señal importa menos que su localización (Glover 2011).</p>`)}
<p>Un recordatorio sobre esta misma aplicación: el volumen de los simuladores de neuroimagen se obtuvo segmentando las mallas del atlas, no midiendo a una persona. Es un modelo, con los supuestos que cada simulador declara.</p>
${clave('Cómo se sabe', `<p>¿Cómo saber que el grosor que calcula un programa es de verdad el grosor de la corteza? Fischl relata que se comparó con mediciones histológicas en el mismo tejido y con los grosores promedio publicados por von Economo en 1929 para la corteza motora, la somatosensitiva y la de giros y surcos. Sin esa validación, ninguna interpretación neurobiológica del grosor sería fiable. <em>Leí el texto de Fischl; no los estudios de validación que cita.</em></p>`)}
<p>${v('i:resonancia', 'Simulador: de dónde sale el contraste gris-blanca')}</p>
<p><small>Fuentes: Ashburner J, Friston KJ, «Voxel-based morphometry—the methods», <em>NeuroImage</em> 2000 (resumen); Fischl B, «FreeSurfer», <em>NeuroImage</em> 2012 (PMC3685476); ${SOARES}; Soares et al. 2013, <em>Front Neurosci</em> (CC BY); ${GLOVER}.</small></p>` },
];
