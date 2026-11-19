// Semestre 0 · unidades 0.6 a 0.10. Cada afirmación está respaldada en docs/unidad-0/fuentes.md.
import { v, clave, clin, tabla } from './ayudas-curso.js';

const NSO = 'Neuroscience Online (Departamento de Neurobiología y Anatomía, Universidad de Texas en Houston)';

export const LECCIONES_0_B = [
  { id: 'u0-06', n: 'El potencial de acción', baj: 'Las conductancias de Na⁺ y K⁺, la refractariedad y cómo viaja el impulso.',
    obj: ['Describir el curso del potencial de acción a partir de las conductancias de Na⁺ y K⁺', 'Explicar la inactivación del Na⁺ y los dos periodos refractarios', 'Explicar cómo se propaga el impulso y por qué solo avanza en un sentido', 'Interpretar la fijación de voltaje como método'],
    rel: [],
    html: `<p>Un potencial de acción se inicia y se propaga «todo o nada»: si el estímulo alcanza el umbral, el impulso viaja sin decrecer hasta el terminal; por ejemplo, el que nace en el soma de una motoneurona espinal llega íntegro a sus terminales. Con un estímulo mantenido, la neurona dispara un tren de impulsos cuya frecuencia crece con la intensidad del estímulo. ${v('m:n:neurona', 'Simulador tipo Hodgkin-Huxley en la neurona 3D')}</p>
<h3>Las fases</h3>
${tabla(['Fase', 'Qué ocurre'], [
  ['Umbral', 'Valor del potencial que, si se alcanza, dispara el impulso'],
  ['Ascenso', 'Se abren canales de Na⁺ dependientes de voltaje y la permeabilidad al Na⁺ sube'],
  ['Sobretiro', 'Tramo entre 0 mV y el pico (cerca de +40 mV). No llega a E(Na) porque persiste la permeabilidad al K⁺'],
  ['Repolarización', 'Los canales de Na⁺ se inactivan y la conductancia al K⁺ aumenta'],
  ['Hiperpolarización posterior', 'El potencial queda más negativo que el reposo mientras cierran los canales de K⁺, que son lentos'],
])}
<h3>Por qué sube y por qué baja</h3>
<p>Una pequeña despolarización abre algunos canales de Na⁺; entra más Na⁺, la despolarización crece y se abren más canales: un ciclo de retroalimentación positiva que lleva el potencial desde −60 mV hacia E(Na) en menos de un milisegundo. La bajada tiene dos fuerzas. Primero, la conductancia de Na⁺ cae por inactivación, lo que a su vez permite repolarizar (otro ciclo, ahora hacia abajo). Segundo, la conductancia de K⁺, lenta, empieza a aumentar hacia el pico. Como los canales de K⁺ también tardan en cerrar, algunos siguen abiertos cuando el potencial ya vuelve a −60 mV, y de ahí la hiperpolarización posterior.</p>
<p>Un potencial de unos 1 ms de duración permite que la frecuencia de disparo varíe de una vez por segundo a mil por segundo: un gran rango dinámico para codificar información.</p>
<h3>Refractariedad</h3>
<ul>
<li><strong>Absoluta.</strong> Ningún estímulo, por grande que sea, produce otro impulso. Se debe a que los canales de Na⁺ tardan varios milisegundos en recuperarse de la inactivación. Es esencial para que el impulso avance en un solo sentido.</li>
<li><strong>Relativa.</strong> Otro impulso es posible, pero con más despolarización, en parte por la hiperpolarización posterior. Ejemplo de NSO: un estímulo de 15 mV lleva de −60 a −45 mV (umbral); si llega durante la hiperpolarización posterior se queda por debajo.</li>
</ul>
<h3>Propagación</h3>
<p>La región activa despolariza a su vecina por corriente local, y esa vecina dispara su propio impulso: es la mecha de pólvora que prende a lo largo del cable. Un impulso no cambia las concentraciones: lo que entra y sale es insignificante frente a lo que hay, y las bombas hacen el mantenimiento a largo plazo. En axones mielinizados, el potencial se propaga pasivamente por el internodo, decrece y se regenera en el nodo siguiente (unidad 0.3).</p>
${clave('Cómo se sabe', `<p>Hodgkin y Huxley usaron la fijación de voltaje: un amplificador mantiene el potencial en un valor deseado y mide la corriente necesaria, que informa de la permeabilidad. Fijaron el potencial en distintos niveles y vieron que, cuanto más despolarizaban, mayor era la conductancia de Na⁺ (y que decaía sola: inactivación), mientras que la de K⁺ subía más lento. Su descripción cuantitativa es Hodgkin y Huxley (1952), <em>J Physiol</em> 117:500. Antes, Hodgkin y Katz (1949) publicaron «El efecto de los iones sodio sobre la actividad eléctrica del axón gigante de calamar». NSO muestra un experimento del mismo tipo, sin atribuirlo: al reducir el Na⁺ externo los impulsos se achican y siguen la recta de Nernst para el Na⁺. <em>De los dos artículos solo pude verificar la cita, no leer el texto.</em></p>`)}
<p>${v('l:u04', 'Potencial de acción y conducción en la unidad 4')}</p>
<p><small>Fuentes: ${NSO}, caps. 1 (§1.3–1.4), 2 (§2.1–2.6, §2.9) y 3 (§3.1–3.3). Hodgkin y Huxley 1952; Hodgkin y Katz 1949 (solo cita verificada).</small></p>` },

  { id: 'u0-07', n: 'Energía del tejido nervioso', baj: 'Qué gasta más ATP y el debate sobre el lactato.',
    obj: ['Reconocer qué procesos consumen más energía en la sustancia gris', 'Explicar la hipótesis de Pellerin y Magistretti', 'Resumir los argumentos del debate sobre el lactato', 'Distinguir una predicción de un modelo de una medición directa'],
    rel: [],
    html: `<p><em>Esta lección se apoya en cuatro resúmenes y un título; no pude leer los textos completos (acceso cerrado) y NSO no trata el tema. Léela como un mapa de la discusión, no como una síntesis cerrada.</em></p>
<h3>¿En qué se gasta la energía?</h3>
<p>Attwell y Laughlin (2001) usaron datos anatómicos y fisiológicos para estimar el gasto energético de la señalización excitadora en la sustancia gris de roedor. Su modelo predice que los potenciales de acción consumen 47 % de la energía, los efectos postsinápticos del glutamato 34 %, el potencial de reposo 13 % y el reciclaje del glutamato 3 %. El gasto depende mucho de la tasa de disparo: aumentar en 1 impulso por segundo la actividad de cada neurona cortical eleva el consumo de oxígeno en 145 mL por 100 g de sustancia gris por hora. De ello se deduce que convienen códigos eficientes: el modelo predice que no más de 15 % de las neuronas debería estar activa a la vez, y que la señal de la resonancia magnética funcional probablemente esté dominada por cambios de gasto ligados a las corrientes sinápticas y a la propagación de los impulsos.</p>
<h3>El debate del lactato</h3>
<p>Pellerin y Magistretti (1994) propusieron que la captación de glutamato por los astrocitos estimula la glucólisis (más glucosa utilizada y más lactato producido). La señal no es el receptor sino el transportador: el Na⁺ que entra junto con el glutamato activa la Na⁺/K⁺-ATPasa. Sería un acople simple entre actividad neuronal y uso de glucosa, coherente con el uso de glucosa no oxidativo visto con imágenes funcionales. De aquí viene la idea de una «lanzadera» de lactato del astrocito a la neurona.</p>
${tabla(['Postura', 'Qué sostiene'], [
  ['Dienel (2012)', 'El papel del lactato cambió de desecho a combustible y molécula de señal, pero los modelos se debaten por resultados discordantes entre sistemas experimentales. La glucólisis estimulada por glutamato no es una propiedad de todos los cultivos de astrocitos; los sinaptosomas de cerebro adulto y muchos cultivos de neuronas tienen gran capacidad de aumentar el transporte de glucosa, la glucólisis y la respiración. El lactato que se acumula en el tejido activado es una fracción menor de la glucosa metabolizada y puede ser un sustrato oportunista, pero la mayor parte de la evidencia apoya la glucosa como combustible principal del cerebro normal activado'],
  ['Magistretti y Allaman (2018)', 'El lactato se forma sobre todo en los astrocitos, a partir de glucosa o glucógeno y como respuesta a señales de actividad neuronal; pasa a las neuronas para cubrir su demanda y aporta señales que modulan excitabilidad, plasticidad y consolidación de la memoria'],
])}
<p>Bonvento y colaboradores (2005) titulan su revisión «una hipótesis debatida pero aún valiosa para la imagen cerebral» (solo pude verificar el título). El desacuerdo no es una anécdota: depende del sistema experimental con que se pruebe.</p>
${clave('Cómo se sabe', `<p>El presupuesto energético <strong>no es una medición directa</strong>: es un cálculo que suma el costo de cada proceso con datos de roedor, y sus cifras (47, 34, 13, 3 %) cambian si cambian los datos de entrada. Lo del lactato se discute porque se estudió en cultivos de astrocitos, cultivos de neuronas, sinaptosomas y cerebro entero, con resultados que no coinciden. Antes de aceptar una cifra, pregunta: ¿medida o calculada?, ¿en qué sistema, en qué especie?</p>`)}
<p>${v('l:u0-03', 'Las bombas, en la unidad 0.3')}</p>
<p><small>Fuentes (solo resúmenes): Attwell y Laughlin 2001, <em>J Cereb Blood Flow Metab</em> 21:1133. Pellerin y Magistretti 1994, <em>PNAS</em> 91:10625. Dienel 2012, <em>JCBFM</em> 32:1107. Magistretti y Allaman 2018, <em>Nat Rev Neurosci</em> 19:235. Bonvento et al. 2005, <em>JCBFM</em> 25:1394 (solo título).</small></p>` },

  { id: 'u0-08', n: 'Sinapsis eléctricas y químicas; la unión neuromuscular', baj: 'La sinapsis mejor conocida: placa motora, ACh y potencial de placa.',
    obj: ['Comparar la sinapsis eléctrica con la química', 'Describir la anatomía de la placa motora', 'Seguir la secuencia desde el impulso motor hasta el impulso muscular', 'Interpretar con curare, neostigmina y TTX qué parte de la secuencia afecta cada uno'],
    rel: [],
    html: `<h3>Dos tipos de sinapsis</h3>
${tabla(['', 'Química', 'Eléctrica'], [
  ['Pasaje de la señal', 'Transmisor que difunde por la hendidura y se une a receptores', 'Uniones de hendidura (<em>gap junctions</em>): continuidad citoplasmática entre las células'],
  ['Retardo', 'Unos 0,5–1 ms (liberar, difundir, unirse)', 'Mínimo: el cambio de potencial se refleja de inmediato'],
  ['Qué pasa de una célula a otra', 'Un cambio en la presináptica libera transmisor; la postsináptica no devuelve nada. Generalmente unidireccional', 'Despolarización o hiperpolarización por la vía iónica directa'],
  ['Dónde', 'La mayoría de las sinapsis', 'En el sistema nervioso y entre células de músculo liso y cardíaco, donde propagan impulsos entre células'],
])}
<p><em>No incluyo conexinas ni panexinas: no encontré una fuente abierta que pudiera leer.</em></p>
<h3>La placa motora</h3>
<p>La sinapsis mejor conocida es la que une una motoneurona espinal con una fibra de músculo esquelético, porque es fácil de analizar. Los somas están en el asta ventral y el terminal da procesos muy finos a lo largo de la fibra. Tiene los tres rasgos de una sinapsis química: una hendidura que separa las membranas (así que debe haber un mensajero), una alta densidad de vesículas esféricas con transmisor junto a muchas mitocondrias y un engrosamiento de la membrana postsináptica, rica en receptores. ${v('m:s:ach', 'Sinapsis colinérgica')} ${v('m:p:2BG9', 'Receptor nicotínico (PDB 2BG9)')}</p>
<h3>La secuencia</h3>
<ol>
<li>El impulso de la motoneurona invade el terminal y libera acetilcolina (ACh).</li>
<li>La ACh difunde por la hendidura y se une a su receptor, un canal ionotrópico: el sitio de unión es parte del canal y suelen hacer falta dos moléculas de ACh. La unión abre un poro permeable por igual a Na⁺ y K⁺.</li>
<li>La membrana se despolariza: es el <strong>potencial de placa</strong> (EPP), un EPSP. Dura unos 10 ms.</li>
<li>Si alcanza el umbral, que es lo normal, dispara un impulso en la fibra muscular, con el mismo mecanismo de Na⁺ y K⁺ de la unidad 0.6, y de ahí la contracción.</li>
</ol>
<p>El EPP mide unos 50 mV y bastan unos 30 mV para llegar al umbral: los 20 mV sobrantes son el <strong>factor de seguridad</strong>. El EPP se esparce con decremento, de forma pasiva. Su duración la fijan dos procesos: la difusión de la ACh y la <strong>acetilcolinesterasa</strong> (AChE), que la hidroliza; una sola molécula de AChE degrada 600 000 moléculas por minuto. ${v('m:p:4EY7', 'Acetilcolinesterasa (PDB 4EY7)')}</p>
<h3>El potencial de inversión</h3>
<p>Katz y colaboradores propusieron que el canal de ACh tiene la misma permeabilidad para Na⁺ y K⁺, es decir, α = 1 en GHK y un potencial de unos 0 mV. Lo probaron variando el potencial de la fibra (unos −80 mV en reposo): a 0 mV el EPP desaparece y a +30 mV se invierte. La apertura de estos canales empuja el potencial hacia 0 mV desde donde esté. El EPP normal nunca llega a 0 mV porque los canales de ACh son pocos frente a los de K⁺ que sostienen el reposo.</p>
${clave('Cómo se sabe', `<p>La <strong>iontoforesis</strong> permite probar que la ACh es el transmisor: se expulsa ACh con un microelectrodo junto a la placa y se compara con el EPP. La respuesta es casi idéntica; la neostigmina la alarga y agranda, el curare la reduce, no pasa nada si la ACh se inyecta dentro de la fibra ni si se aplica lejos de la placa (los receptores están fuera y concentrados en la sinapsis). Y la TTX no cambia la respuesta a la ACh pero elimina el EPP: bloquea un paso previo a la liberación, el impulso del axón. <em>NSO no cita autores.</em></p>`)}
${clin(`<p><strong>Miastenia gravis</strong>: menos receptores de ACh en la fibra; el EPP queda por debajo del umbral y hay debilidad. La neostigmina y otros inhibidores de la AChE ayudan porque la ACh liberada alcanza mejor a los receptores que quedan. <strong>Soman</strong> y <strong>sarín</strong> bloquean la AChE casi sin reversión: la ACh se acumula en niveles extremos y la muerte llega por convulsiones y espasticidad, incluida la de los músculos respiratorios. El <strong>curare</strong>, inhibidor competitivo de la ACh, causa asfixia al bloquear la transmisión en los músculos respiratorios.</p>`)}
<p>${v('l:u05', 'Transmisión sináptica en la unidad 5')}</p>
<p><small>Fuentes: ${NSO}, caps. 4 (§4.1–4.8) y 6 (§6.9).</small></p>` },

  { id: 'u0-09', n: 'Liberación del neurotransmisor', baj: 'Del Ca²⁺ a la exocitosis: la hipótesis cuántica y la maquinaria SNARE.',
    obj: ['Explicar el papel del Ca²⁺ en la liberación', 'Interpretar la liberación cuántica a partir de los potenciales de placa en miniatura', 'Describir el ciclo de la vesícula y las proteínas SNARE', 'Relacionar cada toxina clásica con su proteína blanco'],
    rel: [],
    html: `<h3>La hipótesis del calcio</h3>
<p>Katz y colaboradores estudiaron el papel del Ca²⁺ en la sinapsis neuromuscular. Sin Ca²⁺ en el medio, estimular la motoneurona no produce EPSP. Eyectando Ca²⁺ con un microelectrodo justo antes del impulso, el EPSP es normal; eyectando el Ca²⁺ después, no hay EPSP: el calcio debe estar presente antes o durante el impulso. La hipótesis tiene dos partes. Primera: la despolarización del terminal abre canales de Ca²⁺ dependientes de voltaje, de estructura muy parecida a los de Na⁺ (unos pocos aminoácidos distinguen un canal de Ca²⁺ de uno de Na⁺). Segunda: el Ca²⁺ que entra por su gradiente interactúa con proteínas de las vesículas y desencadena la liberación.</p>
<h3>Liberación cuántica</h3>
<p>Con mucha amplificación, Katz vio deflexiones pequeñas, espontáneas y al azar, una cada 50 ms aproximadamente. Eran de unos 0,5 mV, con una sola distribución gaussiana, solo cerca de la unión, bloqueadas por curare, aumentadas por neostigmina y con una frecuencia sensible al Ca²⁺ basal: los <strong>potenciales de placa en miniatura</strong> (MEPP). Interpretó que cada uno es la liberación espontánea de una sola vesícula. Una vesícula tiene unas 10 000 moléculas de ACh, abre unos 1 000 canales y produce 0,5 mV (así que un canal produce unos 0,5 µV). Un EPP de 50 mV sería la suma de unas 100 vesículas a la vez.</p>
<p>Con poco Ca²⁺ extracelular el EPP evocado se encoge y varía de intento en intento: a veces 0, a veces 0,4 mV (una «unidad»), a veces 0,8 mV (un «doble»), a veces 1,6 mV. La respuesta más pequeña evocable tiene la amplitud de un MEPP. Eso es la <strong>hipótesis cuántica</strong>.</p>
<h3>El ciclo de la vesícula</h3>
<ul>
<li>Se llena de transmisor por captación y espera en la reserva.</li>
<li>La <strong>movilización</strong> la lleva a la zona activa. Se cree que el Ca²⁺ fosforila la sinapsina, que suelta a la vesícula de los microfilamentos de actina.</li>
<li>El <strong>acoplamiento</strong> (<em>docking</em>) la une a la membrana: VAMP en la vesícula, sintaxina y SNAP-25 en la membrana plasmática, que forman el complejo trimérico (SNARE). Una vesícula así está lista.</li>
<li>La fusión se dispara con Ca²⁺. Se propone que el sensor es la <strong>sinaptotagmina</strong>, que tiene dos sitios de unión al Ca²⁺; en ratones sin ella la exocitosis rápida está muy limitada. NSO subraya que el mecanismo del disparo no está resuelto.</li>
<li>La membrana se <strong>recicla</strong>: por «kiss and run» o por fosas de clatrina y endosomas. Evita que el terminal crezca, pero el reabastecimiento solo sostiene una transmisión intensa unos minutos.</li>
</ul>
<p>${v('m:p:1SFC', 'Complejo SNARE (PDB 1SFC)')} ${v('m:s:glu', 'Sinapsis glutamatérgica')} Sutton y cols. (1998) resolvieron el núcleo del complejo (sintaxina-1A, sinaptobrevina-II y SNAP-25B) a 2,4 Å: un haz de cuatro hélices retorcido y paralelo, con una capa iónica central formada por una arginina y tres glutaminas.</p>
<h3>Toxinas y proteínas blanco</h3>
${tabla(['Toxina', 'Proteína que corta o afecta', 'Dónde está'], [
  ['Botulínicas A y E', 'SNAP-25', 'Membrana plasmática'],
  ['Botulínica C1', 'Sintaxinas', 'Membrana plasmática'],
  ['Botulínicas B, D, F, G y tétanos', 'VAMP', 'Vesícula sináptica'],
])}
<p>Una sola molécula puede envenenar un terminal completo. La toxina tétanica es una proteása dependiente de zinc que corta proteínas de la vesícula en el SNC y bloquea la liberación.</p>
${clave('Cómo se sabe', `<p>El análisis cuántico es de Katz y su grupo; el artículo clásico es del Castillo y Katz (1954), «Quantal components of the end-plate potential», <em>J Physiol</em> 124:560. Lo que describo viene de la descripción de NSO; <em>del artículo original solo pude verificar la cita</em>. La estructura del complejo (Sutton, 1998) muestra cómo tres proteínas aportan cuatro hélices a un mismo haz; sus autores dicen que las características de la superficie del complejo <em>podrían</em> ser importantes para la fusión de membranas, no que lo demuestren.</p>`)}
<p>${v('l:u05', 'Transmisión sináptica en la unidad 5')}</p>
<p><small>Fuentes: ${NSO}, caps. 5 (§5.1–5.2), 6 (§6.10) y 10 (§10.7–10.8). Sutton et al. 1998, <em>Nature</em> 395:347 (resumen). del Castillo y Katz 1954 (solo cita verificada).</small></p>` },

  { id: 'u0-10', n: 'Integración sináptica en el SNC', baj: 'Qué hace una neurona con miles de entradas: EPSP, IPSP, sumación y respuestas lentas.',
    obj: ['Distinguir EPSP e IPSP y su mecanismo iónico', 'Explicar la sumación temporal y la espacial con las propiedades pasivas', 'Describir una respuesta sináptica metabotrópica lenta', 'Seguir el reflejo patelar como circuito de ejemplo'],
    rel: [],
    html: `<h3>Un circuito de ejemplo</h3>
<p>El golpe del martillo en el tendón rotuliano estira el músculo extensor y sus husos neuromusculares. Los impulsos viajan por fibras 1A cuyos somas están en el ganglio de la raíz dorsal y hacen sinapsis con dos células: la motoneurona extensora del asta ventral (que contrae el músculo por la placa motora de la unidad 0.8) y una interneurona inhibidora que inhibe a la motoneurona flexora. Es el <strong>reflejo de estiramiento monosináptico</strong>: un solo relevo excitador central.</p>
<h3>EPSP: lo parecido y lo distinto</h3>
<p>El mecanismo es esencialmente el mismo de la placa: el transmisor se une a un receptor ionotrópico y sube a la vez la permeabilidad al Na⁺ y al K⁺; la liberación también depende del Ca²⁺. Hay dos diferencias: el transmisor es <strong>glutamato</strong>, no ACh (en el SNC hay 50 o más transmisores, agrupables en acetilcolina, monoaminas, péptidos y aminoácidos), y la amplitud es de solo ~1 mV, frente a los 50 mV de la placa. ${v('m:s:glu', 'Sinapsis glutamatérgica')} ${v('m:p:3KG2', 'Receptor AMPA (3KG2)')}</p>
<h3>Sumación</h3>
<p>Un EPSP de 1 mV no basta para llegar al umbral. Lo logra la convergencia: el estiramiento activa muchos receptores (<strong>reclutamiento</strong>) y cada uno dispara trenes de impulsos.</p>
<ul>
<li><strong>Temporal.</strong> Dos impulsos seguidos dan EPSP que se suman sobre el flanco del primero (≈2 mV). Es pasiva: la membrana almacena carga, y la ventana depende de la constante de tiempo (unidad 0.5).</li>
<li><strong>Espacial.</strong> Dos neuronas activas a la vez dan un EPSP doble. Depende de la constante de espacio: la carga se propaga de una región a otra.</li>
</ul>
<h3>IPSP</h3>
<p>Despolarizar artificialmente la interneurona produce en la motoneurona una hiperpolarización transitoria con el mismo curso que un EPSP, pero de signo contrario: un <strong>IPSP</strong>. En esa sinapsis el mecanismo es un aumento selectivo de la permeabilidad al Cl⁻: el potencial pasa de −65 mV hacia E(Cl) ≈ −70 mV. El transmisor es <strong>glicina</strong>; el inhibidor más común del SNC es el <strong>GABA</strong>. En otros sitios, el K⁺ media algunos IPSP. ${v('m:s:gaba', 'Sinapsis GABA')} ${v('m:p:6HUO', 'Receptor GABA-A (6HUO)')}</p>
<h3>Respuestas lentas (metabotrópicas)</h3>
<p>Existen potenciales sinápticos cuya duración supera en más de tres órdenes de magnitud la de un EPSP clásico (unos 20 ms). El receptor está separado del canal y cambia el metabolismo celular. Ejemplo de NSO: el transmisor activa proteínas G, sube el AMPc, se activa la PKA y fosforila un canal de K⁺ normalmente abierto, que se cierra; sin esa conductancia de K⁺ pesa más la de Na⁺ y la célula se despolariza. La PKA puede incluso llegar al núcleo y fosforilar factores de transcripción.</p>
${clave('Cómo se sabe', `<p>NSO describe un experimento que se salta el receptor sensorial: se inyecta corriente despolarizante en la neurona sensorial, que dispara, y se registra el EPSP en la motoneurona; al despolarizar igual la interneurona, aparece el IPSP. Que el mecanismo del IPSP sea Cl⁻ y no K⁺ es una conclusión sobre esa sinapsis en particular. <em>NSO no cita autores ni años.</em></p>`)}
<p>${v('l:u05', 'Transmisión sináptica en la unidad 5')}</p>
<p><small>Fuentes: ${NSO}, cap. 6 (§6.1–6.8).</small></p>` },
];
