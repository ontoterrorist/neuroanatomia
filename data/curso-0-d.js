// Semestre 0 · unidades 0.14 a 0.16. Cada afirmación está respaldada en docs/unidad-0/fuentes.md.
import { v, clave, clin, tabla } from './ayudas-curso.js';

const NSO = 'Neuroscience Online (Departamento de Neurobiología y Anatomía, Universidad de Texas en Houston)';

export const LECCIONES_0_D = [
  { id: 'u0-14', n: 'Plasticidad sináptica celular', baj: 'Depresión, facilitación y potenciación a largo plazo (LTP) en la sinapsis.',
    obj: ['Distinguir plasticidad homosináptica y heterosináptica', 'Explicar la facilitación de pulso pareado con el Ca²⁺ residual', 'Describir el papel del receptor NMDA y del AMPA en la LTP', 'Interpretar el registro original de Bliss y Lømo'],
    rel: [],
    html: `<p>Durante mucho tiempo se pensó que, una vez formada, una sinapsis era como una soldadura entre dos componentes: fija. Hoy se sabe que casi todas cambian su fuerza, ya sea por su propia actividad o por la de otra vía; muchos creen que esto es central para el aprendizaje y la memoria. ${v('m:p:4PE5', 'Receptor NMDA (4PE5)')} ${v('m:p:3KG2', 'Receptor AMPA (3KG2)')}</p>
<h3>Homosináptica: la propia actividad</h3>
<ul>
<li><strong>Depresión.</strong> Entre una fibra 1A y una motoneurona espinal, un segundo impulso 200 ms después del primero produce un EPSP menor. Un mecanismo común es el agotamiento del transmisor disponible.</li>
<li><strong>Facilitación de pulso pareado.</strong> Con dos impulsos separados por unos 20 ms, el segundo EPSP es mayor (en el ejemplo de NSO, el doble: 2 mV frente a 1 mV; la suma temporal da 3 mV). Un mecanismo es el <strong>Ca²⁺ residual</strong>: tras el primer impulso el Ca²⁺ no vuelve al nivel basal al instante, y el influjo del segundo se suma al remanente, de modo que se libera más transmisor.</li>
<li><strong>Potenciación postetánica (PTP).</strong> Facilitación extrema: una mejora de minutos tras una breve salva de impulsos.</li>
</ul>
<h3>Heterosináptica: la actividad de otra vía</h3>
<p>Una neurona moduladora hace una sinapsis axoaxónica sobre el terminal presináptico. Si activa receptores metabotrópicos que fosforilan los canales de Ca²⁺ para que se abran con menos facilidad, entra menos Ca²⁺, se libera menos transmisor y el EPSP baja: es la <strong>inhibición presináptica</strong>, muy destacada en la médula espinal. Si el segundo mensajero hace que entre más Ca²⁺, es la <strong>facilitación presináptica</strong>. Es el mismo principio de las unidades 0.9 y 0.11 aplicado al terminal.</p>
<h3>Potenciación a largo plazo (LTP)</h3>
<p>Tras una tetanización, la PTP se apaga en minutos y queda una mejora muy duradera del EPSP: la LTP, con componentes homo y heterosinápticos. Para la sinapsis CA3-CA1 del hipocampo, NSO explica el mecanismo con los dos receptores de glutamato de la espina de CA1:</p>
<ol>
<li>Ambos dejan pasar Na⁺ y K⁺, pero el NMDA además deja pasar Ca²⁺ <em>y está tapado por Mg²⁺</em>. Con un estímulo débil, el EPSP lo genera solo el AMPA.</li>
<li>La tetanización suma EPSP en el espacio y el tiempo, la célula se despolariza mucho y expulsa al Mg²⁺ del canal.</li>
<li>Entra Ca²⁺ por el NMDA y activa proteína cinasas que desencadenan cambios duraderos, entre ellos la <strong>inserción de más receptores AMPA</strong>. El mismo glutamato abre más canales y el EPSP es mayor.</li>
<li>Hay indicios de que además se libera más transmisor en el lado presináptico.</li>
</ol>
<p>Como el receptor NMDA detecta a la vez el glutamato (actividad presináptica) y la despolarización (actividad postsináptica), actúa como <strong>detector de coincidencias</strong>: la asociatividad, un criterio central de una molécula implicada en aprender.</p>
${clave('Cómo se sabe', `<p>Bliss y Lømo (1973), «Long-lasting potentiation of synaptic transmission in the dentate area of the anaesthetized rabbit following stimulation of the perforant path», <em>J Physiol</em> 232:331. Con microelectrodos extracelulares en conejos anestesiados, registraron la respuesta de las células granulares del giro dentado a pulsos únicos de la vía perforante. En 15 de 18 conejos la respuesta quedó potenciada durante 30 min a 10 h tras uno o más trenes condicionantes. Midieron tres parámetros (amplitud del EPSP poblacional y amplitud y latencia de la espiga poblacional) y concluyeron que podían operar dos mecanismos independientes: más eficacia de la transmisión sináptica y más excitabilidad de la población de células granulares. <em>Solo pude leer el resumen.</em> Fíjate: ese es el giro dentado de conejo; el mecanismo NMDA/AMPA de arriba, según NSO, es el de CA3-CA1.</p>`)}
<p><em>No cubro la depresión a largo plazo (LTD) ni la plasticidad dependiente del momento de los impulsos (STDP): NSO casi no las trata y no tengo otra fuente abierta leída.</em></p>
<p>${v('l:u30', 'Bases celulares de la memoria en la unidad 30')} ${v('l:u33', 'Plasticidad en la unidad 33')}</p>
<p><small>Fuentes: ${NSO}, cap. 7 (§7.1–7.4). Bliss y Lømo 1973 (resumen).</small></p>` },

  { id: 'u0-15', n: 'Formación, mantenimiento y eliminación de sinapsis', baj: 'Del cono de crecimiento a la sinapsis madura; factores tróficos y regeneración.',
    obj: ['Describir cómo el cono de crecimiento encuentra su camino', 'Explicar el papel de la agrina en la diferenciación postsináptica', 'Explicar la dependencia de factores tróficos como el NGF', 'Contrastar la regeneración en el SNP y en el SNC'],
    rel: [],
    html: `<h3>El cono de crecimiento</h3>
<p>Una neurona joven extiende varias dendritas y un único axón. La punta del axón es el <strong>cono de crecimiento</strong>, rico en actina en sus láminas y filopodios. El cono se mueve con una especie de «oruga de tanque»: la actina se polimeriza en el borde delantero, se desplaza hacia atrás y se despolimeriza allí; si este movimiento se ancla al sustrato, el cono avanza. Cajal describió estos conos; Roger Sperry mostró que, tras lesionar el nervio óptico de la rana, los axones retinotectales regeneran, encuentran sus blancos y hacen sinapsis con precisión, y propuso que hay marcadores de superficie para reconocer rutas y blancos. El trayecto se parte en tramos con «puntos de decisión», células intermedias (<em>guidepost</em> en insectos) donde el axón frena y cambia de forma. ${v('m:n:neurona', 'Neurona 3D')}</p>
<h3>De cono a terminal</h3>
<p>Al llegar, el cono madura: cambia de forma, redistribuye vesículas y pasa de la secreción constitutiva a la regulada. NSO reconoce que se sabe poco de los mecanismos moleculares de esta diferenciación presináptica. Del lado postsináptico, andamios como la <strong>neuroligina</strong> (que se une a la <strong>neurexina</strong> y ancla ambos lados) alinean los componentes. En la unión neuromuscular los receptores de ACh pasan de unos 10 por µm² fuera de la sinapsis a 10 000–20 000 por µm² en ella, y no es la ACh la que lo causa: son moléculas liberadas por el terminal, la <strong>agrina</strong> (agrupa receptores ya presentes) y la ARIA (aumenta el total).</p>
<h3>Eliminación y supervivencia</h3>
<p>Al principio varios axones inervan una misma fibra muscular; en el adulto, casi siempre uno. La competencia favorece a las entradas más activas y a las que logran más factores tróficos del blanco, y cada sinapsis que queda se hace más grande y compleja. En el SNC se forman más sinapsis de las necesarias, y se eliminan las redundantes. Algo parecido pasa con las células: en casi todos los tejidos en desarrollo muere mucha, y NSO sugiere que la muerte puede ser la vía por defecto y que sobreviven las que reciben apoyo trófico. El prototipo es el <strong>NGF</strong>: lo secreta el tejido blanco, se une a un receptor tirosina cinasa (trkA) del axón, se internaliza y viaja por transporte retrógrado a lo largo de los microtúbulos hasta el soma, donde impide la muerte. BDNF, NT-3 y NT-4 actúan por receptores Trk distintos.</p>
<h3>Regeneración</h3>
<p>Los axones del SNP pueden regenerar; los del SNC casi no. En el SNC adulto faltan moléculas de adhesión como laminina y fibronectina, y los oligodendrocitos expresan moléculas que frenan el crecimiento; las células de Schwann secretan NGF y matriz y no frenan. Un injerto de nervio periférico unido al nervio óptico seccionado permitió que los axones retinianos reinervaran el colículo superior.</p>
${clave('Cómo se sabe', `<p>Dos experimentos, ambos descritos en NSO <strong>sin autor ni año</strong>: (1) lesionar el músculo y el axón y dejar que regenere: la lámina basal sola agrupa receptores de ACh sin nervio, y si el músculo no regenera los axones vuelven al sitio sináptico original; la lámina basal sináptica lleva señales para ambos lados. (2) Inyectar anticuerpos anti-NGF en recién nacidos reduce mucho las neuronas simpáticas, mientras que inyectar NGF evita la muerte natural; la colchicina, que despolimeriza los microtúbulos y bloquea el transporte retrógrado, inhibe la regeneración. Dejé fuera a Hamburger y Levi-Montalcini (1949): no pude verificar la cita.</p>`)}
<p><em>No cubro la apoptosis como tal: no encontré fuente abierta que pudiera leer.</em> NSO añade que el NGF parece importante para las neuronas colinérgicas del prosencéfalo basal, que degeneran en la enfermedad de Alzheimer.</p>
<p>${v('l:u02', 'Desarrollo del sistema nervioso en la unidad 2')} ${v('l:u33', 'Plasticidad y neurodegeneración en la unidad 33')}</p>
<p><small>Fuentes: ${NSO}, cap. 9 (§9.2–9.4, 9.14–9.22).</small></p>` },

  { id: 'u0-16', n: 'Genética y enfermedad neuronal', baj: 'Cómo se localiza un gen de enfermedad, la excitotoxicidad y las neurotoxinas.',
    obj: ['Distinguir las cuatro vías de identificación de un gen', 'Explicar la unidad centimorgan y el uso de marcadores', 'Diferenciar enfermedades de un solo gen y poligénicas', 'Describir la excitotoxicidad y reconocer neurotoxinas por su diana'],
    rel: [],
    html: `<h3>Cuatro rutas hacia un gen</h3>
<p>El genoma humano tiene unos 20 000 genes en unos 3×10⁹ nucleótidos, con exones e intrones, en 22 autosomas más X e Y. Asociar un rasgo con una posición en un cromosoma es el paso crítico para identificar un gen. NSO distingue cuatro rutas.</p>
${tabla(['Ruta', 'Idea', 'Ejemplo en NSO'], [
  ['Clonación funcional', 'Se conoce la función y se purifica la proteína', 'Fenilalanina hidroxilasa'],
  ['Gen candidato', 'Un gen conocido que parece cumplir la función alterada', 'Rodopsina en la retinitis pigmentosa'],
  ['Clonación posicional', 'Solo por mapeo, sin saber qué hace', 'Distrofina en la distrofia de Duchenne (Xp21)'],
  ['Candidato posicional', 'Mapa y gen candidato en la misma región', 'Fibrilina en el síndrome de Marfan (15q)'],
])}
<h3>Mapeo por ligamiento</h3>
<p>Dos cromosomas homólogos intercambian segmentos (recombinación). Una frecuencia de recombinación de 1 % es 1 centimorgan (cM) y equivale a unos 1000 kb (1 Mb). Los genes cercanos se heredan juntos, así que un marcador polimórfico vecino sirve para seguir una enfermedad en una familia. El ligamiento se evalúa con una puntuación LOD. La herencia puede ser autosómica dominante, recesiva o ligada al X. La <strong>penetrancia</strong> (probabilidad de que un portador tenga el fenotipo) y la edad de inicio variable dificultan el mapeo. Para probar que un candidato causa la enfermedad se usan comparación de secuencias, patrones de expresión, varios alelos mutantes, comparaciones entre especies y ratones transgénicos o <em>knockout</em>; NSO dice que esto no explica cómo la mutación produce el fenotipo.</p>
<h3>Un gen o muchos</h3>
<p>La gran mayoría de las enfermedades humanas <strong>no</strong> son mendelianas. NSO clasifica como de un solo gen la enfermedad de Huntington, el Parkinson, la ataxia espinocerebelosa y las enfermedades de depósito lipídico (Tay-Sachs); y como probablemente poligénicas el Alzheimer y la esquizofrenia. Dos estrategias para rasgos complejos: buscar un subtipo casi mendeliano (el Alzheimer de inicio temprano dio <em>APP</em>, presenilinas 1 y 2) o estudiar una población aislada. En Huntington, una familia del lago Maracaibo (Venezuela) de unas 12 000 personas permitió localizar el gen de la huntingtina; la mutación es una expansión de repeticiones CAG, más repeticiones, más gravedad. NSO subraya que cómo esta proteína mata a las neuronas del estriado sigue sin estar claro.</p>
<h3>Excitotoxicidad</h3>
${clin(`<p>El glutamato es tóxico para las neuronas si persiste. Tras un ictus o un trauma se libera en masa, y sin energía las bombas no lo retiran: los receptores se abren sin control, entra Na⁺ y agua (edema) y un influjo sostenido de Ca²⁺, sobre todo por el receptor NMDA, que activa enzimas dependientes de Ca²⁺. Bloquear específicamente el NMDA atenuó parte del daño tras un ictus; lo clave es restablecer el flujo sanguíneo de forma controlada, por ejemplo con activador tisular del plasminógeno (tPA). Lau y Tymianski (2010) revisan la hipótesis y la vinculan también con ELA, esclerosis múltiple y Parkinson; reconocen que hoy no hay una intervención farmacológica con neuroprotección clínica significativa.</p>`)}
<h3>Neurotoxinas como herramientas</h3>
${tabla(['Toxina', 'Diana'], [
  ['Tetrodotoxina, saxitoxina, μ-conotoxina', 'Poro del canal de Na⁺ dependiente de voltaje'],
  ['ω-conotoxina, ω-Aga (araña)', 'Algunos canales de Ca²⁺ dependientes de voltaje'],
  ['Curare, α-bungarotoxina', 'Receptor nicotínico de ACh'],
  ['Picrotoxina, estricnina', 'Receptor GABA<sub>A</sub>, receptor de glicina'],
  ['Botulínica, tetánica', 'Proteínas de la vesícula (unidad 0.9)'],
])}
<p>${v('m:q:tetrodotoxin', 'Tetrodotoxina')} ${v('m:q:strychnine', 'Estricnina')}</p>
${clave('Cómo se sabe', `<p>El caso de Huntington muestra el método: ligamiento en una familia muy grande, con muchas recombinaciones, para acotar la región. Lo anterior es un resumen de NSO, <em>sin autores ni años</em>; de la excitotoxicidad solo leí el resumen de Lau y Tymianski. Los alcances de «no hay terapia eficaz» y de ELA o Parkinson son los de sus autores, no míos.</p>`)}
<p>${v('l:u33', 'Neurodegeneración en la unidad 33')}</p>
<p><small>Fuentes: ${NSO}, caps. 2 (§2.5), 6 (§6.10), 13 (§13.17) y 15 (§15.1–15.11). Lau y Tymianski 2010, <em>Pflügers Arch</em> 460:525 (resumen).</small></p>` },
];
