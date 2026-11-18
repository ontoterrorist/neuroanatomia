// Semestre 0 · unidades 0.1 a 0.5. Cada afirmación está respaldada en docs/unidad-0/fuentes.md.
import { v, clave, clin, tabla } from './ayudas-curso.js';

const NSO = 'Neuroscience Online (Departamento de Neurobiología y Anatomía, Universidad de Texas en Houston)';

export const LECCIONES_0_A = [
  { id: 'u0-01', n: 'Las células del sistema nervioso', baj: 'Neuronas, glía y el debate sobre cuántas células hay de cada tipo.',
    obj: ['Nombrar las partes de una neurona modelo y su función', 'Clasificar neuronas por su morfología y por cómo se las nombra', 'Distinguir los tipos de glía por localización y función', 'Evaluar con criterio la cifra de glía por neurona'],
    rel: [],
    html: `<p>Antes de hablar de señales hay que saber quién las emite y quién las rodea. ${NSO} cuenta cientos de tipos de neuronas solo por su forma, y neuronas parecidas pueden usar y responder a transmisores distintos. ${v('m:n:neurona', 'Neurona en 3D')}</p>
<h3>La neurona modelo</h3>
<ul>
<li><strong>Soma.</strong> Núcleo, orgánulos y centro metabólico; también recibe aferencias.</li>
<li><strong>Dendritas.</strong> Son la superficie receptora y suelen llevar espinas, que multiplican el área disponible para sinapsis. Una motoneurona espinal con un árbol dendrítico moderado recibe unos 10 000 contactos: 2 000 en el soma y 8 000 en las dendritas.</li>
<li><strong>Cono axónico y segmento inicial.</strong> El cono casi no tiene orgánulos ni ribosomas. El segmento inicial va del cono al comienzo de la mielina y, en muchos casos, es donde nace el potencial de acción.</li>
<li><strong>Axón.</strong> Hay uno solo por neurona, más recto y liso que las dendritas. Pasado el segmento inicial no tiene retículo rugoso ni ribosomas libres.</li>
<li><strong>Terminal.</strong> Vesículas, densidad presináptica, mitocondrias y una hendidura sináptica de 20 a 40 nm.</li>
</ul>
<p>Cuidado: «axón» y «dendrita» no siempre se distinguen por la forma, y ni la posición del soma ni la mielina sirven como criterio general (hay procesos mielinizados que conducen hacia el soma). La guía más fiable es dónde se inicia el impulso: el proceso que contiene esa zona de disparo es el axón.</p>
<h3>Cómo se nombra una neurona</h3>
<p>Golgi las clasificó por el número de prolongaciones. Las sensoriales de los vertebrados nacen bipolares y maduran con una sola prolongación: son <strong>seudounipolares</strong>. Las <strong>bipolares</strong> están en la retina y el bulbo olfatorio. El resto son <strong>multipolares</strong>, el grupo más numeroso: las de tipo I son grandes y las de tipo II, pequeñas y normalmente interneuronas. También se nombran por la forma (piramidal), por quien las describió (Purkinje) o por su transmisor.</p>
<h3>La glía</h3>
<p>La glía se define por contraste: no forma sinapsis, tiene esencialmente un solo tipo de prolongación, conserva la capacidad de dividirse y es menos excitable que la neurona. La <strong>macroglía</strong> es de origen ectodérmico (astrocitos, oligodendrocitos, epéndimo) y la <strong>microglía</strong> es probablemente mesodérmica. ${v('m:n:glia', 'Glía en 3D')}</p>
${tabla(['Célula', 'Dónde está', 'Qué la distingue'], [
  ['Astrocito protoplásmico', 'Sustancia gris', 'Procesos irregulares que forman láminas entre axones y dendritas y pueden rodear sinapsis'],
  ['Astrocito fibroso', 'Sustancia blanca', 'Procesos radiales con pies sobre vasos, epéndimo y pía'],
  ['Oligodendrocito', 'Gris y blanca', 'Mielina del SNC; una célula mieliniza varios axones'],
  ['Célula de Schwann', 'SNP', 'Forma la mielina del SNP; cada célula forma un solo internodo'],
  ['Epéndimo', 'Ventrículos y conducto central', 'Epitelio con cilios que mueven el LCR; en los plexos coroideos secreta y transporta sustancias'],
  ['Microglía', 'Todo el SNC, más en la gris', 'Tras una lesión prolifera, migra y fagocita'],
])}
<p>Los astrocitos, además, mantienen el equilibrio iónico y de pH del espacio extracelular, forman la glía limitante y los pies perivasculares, guían la migración neuronal en el desarrollo y forman la cicatriz glial tras una lesión. Convierten el glutamato de la hendidura en glutamina, que vuelve a la neurona.</p>
<h3>Un debate: ¿cuánta glía hay?</h3>
<p>NSO da unas 90 000 millones de neuronas y unas 360 000 millones de células gliales (80 a 90 % de las células del SNC). Azevedo y colaboradores (2009) contaron en el cerebro de varones adultos 86,1 ± 8,1 mil millones de células NeuN positivas («neuronas») y 84,6 ± 9,8 mil millones de NeuN negativas («no neuronales»): un cociente cercano a 1:1.</p>
${clave('Cómo se sabe', `<p>Von Bartheld, Bahney y Herculano-Houzel (2016) revisaron 150 años de recuentos: los datos histológicos siempre apoyaron cerca de 1:1 en el cerebro entero (40 a 130 mil millones de células gliales), pero la cifra de un billón (10:1) se perpetuó medio siglo. Azevedo y cols. usaron el <em>fraccionador isotrópico</em>.</p><p>Cautelas: «NeuN negativa» no es sinónimo de glía (por eso las comillas) y la muestra son varones adultos. <em>Lo que sé del método viene de los resúmenes; no pude leer los textos completos.</em></p>`)}
<p>${v('l:u03', 'Resumen en la unidad 3')}</p>
<p><small>Fuentes: ${NSO}, cap. 8 (Waymire). Azevedo et al. 2009, <em>J Comp Neurol</em> 513:532. von Bartheld et al. 2016, <em>J Comp Neurol</em> 524:3865.</small></p>` },

  { id: 'u0-02', n: 'Organización subcelular de la neurona', baj: 'Orgánulos, citoesqueleto y el viaje de una proteína del retículo al terminal.',
    obj: ['Nombrar los orgánulos de la neurona y su función', 'Seguir una proteína de membrana desde el ribosoma hasta la vesícula sináptica', 'Distinguir microtúbulos, neurofilamentos y microfilamentos', 'Comparar el transporte axonal anterógrado y el retrógrado'],
    rel: [],
    html: `<p>El terminal sináptico puede quedar a un metro del núcleo, y casi todo lo que necesita se fabrica en el soma. Esta lección sigue ese camino. ${v('m:n:neurona', 'Neurona en 3D')}</p>
<h3>Los orgánulos del soma</h3>
${tabla(['Orgánulo', 'Qué hace en la neurona'], [
  ['Núcleo', 'Esférico, de 3 a 18 µm según el tamaño de la neurona; las neuronas de axón largo tienen soma y núcleo mayores. El nucléolo sintetiza ARN ribosómico'],
  ['Retículo rugoso', 'Sintetiza proteínas de membrana y de secreción; al microscopio óptico se ve como sustancia de Nissl'],
  ['Retículo liso', 'Sintetiza lípidos, amortigua el Ca²⁺ y participa en la biosíntesis y el reciclaje de vesículas sinápticas'],
  ['Golgi', 'Modifica y clasifica proteínas y lípidos que vienen del retículo'],
  ['Lisosomas', 'Digieren compuestos de dentro y fuera de la célula (250–700 nm); parte se degrada a lipofuscina, que se acumula con la edad'],
  ['Endosomas', 'Pasan lo ingerido a lisosomas y peroxisomas; en el terminal reciclan vesículas'],
  ['Mitocondrias', 'En toda la célula, especialmente abundantes en las especializaciones presinápticas'],
])}
<h3>De ribosoma a vesícula</h3>
<p>El ARNm sale del núcleo por los poros. Con ribosomas libres se hacen las proteínas solubles del citoplasma. Las proteínas de membrana, como las de la vesícula sináptica, se sintetizan en el retículo rugoso: un péptido señal ancla la cadena naciente a la membrana del retículo y la proteína acaba como proteína integral de membrana. Del retículo liso brotan vesículas de transporte hacia el Golgi; allí las cisternas avanzan de la cara <em>cis</em> a la <em>trans</em> mientras las proteínas se fosforilan, se glicosilan, se cortan o reciben ácidos grasos. De la cara trans salen vesículas que irán a la membrana plasmática, a los lisosomas, a los endosomas o a ser vesículas de neurotransmisor.</p>
<h3>El citoesqueleto</h3>
${tabla(['Filamento', 'Diámetro y composición', 'Dónde y para qué'], [
  ['Microtúbulos', '20–25 nm; dímeros de tubulina α y β', 'Haces paralelos en axón y dendritas; rieles del transporte. Las MAP regulan su polimerización: MAP2 en dendritas, tau en axón'],
  ['Neurofilamentos', '10 nm; tres subunidades', 'Dan forma y resistencia mecánica. Más abundantes que los microtúbulos en el axón; al revés en las dendritas'],
  ['Microfilamentos', '7 nm; actina', 'Terminales sinápticos, espinas y bajo el axolema; los cambios de forma de la espina en la plasticidad dependen de ellos'],
])}
<p>${v('m:p:1JFF', 'Tubulina αβ (PDB 1JFF)')}</p>
<h3>Transporte axonal</h3>
<p>Pasado el segmento inicial, el axoplasma no tiene retículo rugoso ni ribosomas libres, así que lo que el terminal necesita llega por transporte. El <strong>anterógrado rápido</strong> lleva vesículas hacia el terminal: la <strong>kinesina</strong> se une a la vesícula y avanza por el microtúbulo en pasos de unión y desunión, con gasto de energía y necesidad de Ca²⁺, a 0,5–1,5 cm por hora. El <strong>retrógrado</strong> devuelve proteínas al soma con otro motor, la <strong>dineína</strong>, algo más lento que el anterógrado rápido. Además de reciclar, comunica a los terminales con el soma: transporta señales que regulan el desarrollo y el mantenimiento de los contactos con las células postsinápticas.</p>
${clave('Cómo se sabe', `<p>NSO resume la evidencia del transporte axonal así: se observa el movimiento de proteínas radiactivas sintetizadas en el soma hacia las terminaciones del axón. Que los rieles son los microtúbulos se apoya en que la colchicina y la vinblastina, que los desorganizan, detienen el transporte. <em>NSO no atribuye estos experimentos a un autor ni a un año, y yo tampoco los inventé: queda pendiente encontrar la referencia primaria.</em></p>`)}
<p>${v('l:u03', 'Transporte axonal y lesión en la unidad 3')}</p>
<p><small>Fuentes: ${NSO}, caps. 8 (§8.3–8.11) y 10 (§10.1–10.9).</small></p>` },

  { id: 'u0-03', n: 'La membrana: mielina, adhesión y bombas', baj: 'Qué rodea a la neurona, qué la une a su entorno y qué mantiene sus gradientes.',
    obj: ['Describir la membrana plasmática y la mielina como estructura', 'Explicar por qué se necesitan bombas aunque un potencial de acción apenas mueva iones', 'Relacionar la velocidad de conducción con el diámetro y la mielina', 'Distinguir las tres familias de moléculas de adhesión'],
    rel: [],
    html: `<p>La membrana es mucho más que una pared. Aquí se ven tres de sus papeles: aislar (la mielina), unir (las moléculas de adhesión) y mantener los gradientes (las bombas). <em>Esta lección no trata la composición lipídica de la membrana: no encontré una fuente abierta que pudiera leer; está anotada en los pendientes de la unidad.</em></p>
<h3>La bicapa</h3>
<p>Al microscopio electrónico, la membrana plasmática de la neurona se ve como una bicapa típica de unos 10 nm de grosor. Todo lo que cruza ese límite lo hace por proteínas: canales (unidad 0.4), bombas y transportadores. ${v('m:p:2ZXE', 'Bomba de Na⁺/K⁺ (PDB 2ZXE)')}</p>
<h3>Bombas y fugas</h3>
<p>Un potencial de acción no vacía los gradientes: el sodio que entra y el potasio que sale en un solo impulso son una fracción insignificante de lo que hay dentro y fuera, así que los potenciales de equilibrio no cambian. Pero, sin un mecanismo compensador, tras muchos impulsos las concentraciones sí cambiarían. Las bombas de Na⁺/K⁺ mantienen a largo plazo el K⁺ alto y el Na⁺ bajo dentro de la célula, y con ello las «baterías» que sostienen el potencial de reposo y el de acción.</p>
<h3>La mielina</h3>
<p>La mielina es una manga de capas de membrana compactadas, con un collar de citoplasma por dentro y otro por fuera. En el SNC la forman oligodendrocitos: uno solo contribuye a varios segmentos de axones vecinos, y varios oligodendrocitos pueden contribuir a un mismo internodo. En el SNP, cada célula de Schwann forma un solo internodo y rodea al axón apretando su propio citoplasma hacia fuera; las células de Schwann también envuelven los axones amielínicos. El nodo de Ranvier no está desnudo: puede ser sitio de ramificación o de contactos sinápticos, estar cubierto por procesos gliales y concentrar orgánulos, sobre todo mitocondrias.</p>
<p>¿Para qué sirve? La velocidad de conducción varía de 100 m/s a menos de 0,1 m/s. NSO la relaciona con dos propiedades pasivas: aumenta con la constante de espacio y disminuye con la constante de tiempo. Aumentar el diámetro ayuda, pero para duplicar la velocidad hay que cuadruplicar el diámetro. La mielina baja la capacitancia de la membrana; como cubrir todo el axón taparía los canales de Na⁺, solo se cubren segmentos y se dejan nodos. En los internodos el potencial se propaga pasivamente y decrece; en el nodo siguiente se regenera un potencial de acción nuevo. En los axones mielinizados no hay canales de Na⁺ en la región internodal. Lo desarrollas en la unidad 0.6.</p>
${clave('Cómo se sabe', `<p>El argumento de las bombas es un razonamiento cuantitativo, no un experimento: se compara el flujo de iones de un impulso con las concentraciones totales y se concluye que solo la suma de muchos impulsos importa. De ahí la necesidad de un mecanismo de mantenimiento. Lo mismo vale para el diámetro: la relación «cuadruplicar para duplicar» sale de las ecuaciones de las propiedades pasivas (unidad 0.5). <em>NSO no cita aquí un experimento concreto, por eso no lo atribuyo.</em></p>`)}
<h3>Moléculas de adhesión</h3>
<p>NSO las presenta al hablar del crecimiento del axón, y son glicoproteínas de tres familias:</p>
${tabla(['Familia', 'Unión', 'Dependencia de Ca²⁺', 'Ejemplo'], [
  ['Superfamilia de las inmunoglobulinas', 'Homofílica', 'No', 'N-CAM (hay al menos 50 CAM en mamíferos)'],
  ['Cadherinas', 'Homofílica', 'Sí', 'N-cadherina, la principal del encéfalo, presente en casi todas las neuronas y muy temprana en el desarrollo'],
  ['Integrinas', 'Heterofílica (con la matriz extracelular)', '—', 'Se unen a fibronectina y laminina'],
])}
<p>La mayoría de las neuronas expresa N-CAM y N-cadherina, y la combinación de integrinas de una célula decide a qué moléculas de la matriz se une.</p>
<p>${v('l:u03', 'Mielina y su patología en la unidad 3')} ${v('l:u04', 'Conducción en la unidad 4')}</p>
<p><small>Fuentes: ${NSO}, caps. 2 (§2.6), 3 (§3.2–3.3), 8 (§8.11, §8.16) y 9 (§9.9).</small></p>` },

  { id: 'u0-04', n: 'Canales iónicos', baj: 'Cómo se abren, cómo eligen un ion y qué pasa cuando fallan.',
    obj: ['Clasificar los canales por lo que los abre', 'Interpretar los experimentos con TTX y TEA', 'Explicar cómo un canal de K⁺ distingue K⁺ de Na⁺', 'Reconocer qué es una canalopatía'],
    rel: [],
    html: `<p>Un canal es un poro proteico que se abre y se cierra. Casi todo lo que hace una neurona en el tiempo de los milisegundos pasa por uno. ${v('m:p:1K4C', 'Canal KcsA (PDB 1K4C)')}</p>
<h3>Tipos de canal</h3>
<p>NSO distingue tres clases. Los <strong>dependientes de voltaje</strong> (de Na⁺, de K⁺, de Ca²⁺, con varios subtipos de los dos últimos) están normalmente cerrados y un cambio de potencial abre el poro. Los <strong>independientes de voltaje</strong> son los que dan el potencial de reposo; no los bloquea el TEA. Los <strong>dependientes de ligando</strong> (activados por transmisor) se tratan en la unidad 0.8. Se conoce con detalle la secuencia de aminoácidos de los canales de voltaje y se han relacionado tramos concretos con la selectividad, la compuerta y la inactivación.</p>
<p>Con la técnica de fijación de voltaje se vieron dos comportamientos distintos. El canal de Na⁺ se abre rápido y luego <strong>se inactiva</strong> aunque la despolarización continúe. El de K⁺ se abre más lento y varios de ellos no se inactivan. Cuando se quita el pulso, el cierre de un canal activado es <strong>desactivación</strong>, no inactivación.</p>
<h3>Dos fármacos, dos canales</h3>
<p>La <strong>tetrodotoxina</strong> (TTX), del pez globo japonés, bloquea el cambio de permeabilidad al Na⁺ dependiente de voltaje y no toca el del K⁺. El <strong>tetraetilamonio</strong> (TEA) hace lo contrario. Que uno pueda bloquearse sin afectar al otro indica que son canales distintos. Con TTX no hay potencial de acción: sin canales de Na⁺ no puede iniciarse. Con TEA el potencial dura más y no tiene hiperpolarización posterior; su repolarización queda a cargo solo de la inactivación del Na⁺, y el potencial de reposo no cambia. ${v('m:q:tetrodotoxin', 'Tetrodotoxina en 3D')}</p>
<h3>Por dentro de un canal</h3>
<p>Doyle y colaboradores (1998) resolvieron por rayos X, a 3,2 Å, el canal de K⁺ de <em>Streptomyces lividans</em> (KcsA). Cuatro subunidades idénticas forman un cono invertido; el filtro de selectividad mide solo 12 Å y el resto del poro es más ancho, con una cavidad llena de agua. Los oxígenos carbonilo de la cadena principal recubren el filtro y coordinan K⁺ pero no el Na⁺, que es más pequeño. El filtro aloja dos K⁺ separados unos 7,5 Å, y la repulsión entre ellos ayuda a que crucen. La estructura del catálogo de la app (1K4C) es otra del mismo canal, a 2,0 Å (Zhou y cols., 2001).</p>
<p>${v('m:p:6AGF', 'Nav1.4 (6AGF)')} ${v('m:p:2R9R', 'Kv1.2–2.1 (2R9R)')} ${v('m:p:5GJV', 'Cav1.1 (5GJV)')} ${v('m:p:3J5P', 'TRPV1 (3J5P)')}</p>
${clave('Cómo se sabe', `<p>Dos líneas de evidencia, de épocas distintas. La primera es farmacológica: los efectos opuestos de TTX y TEA sobre las corrientes de Na⁺ y de K⁺ separan los canales sin verlos. La segunda es directa: Neher y Sakmann (1976) registraron corrientes de canales individuales en fibras musculares denervadas de rana. Y Doyle y cols. (1998) vieron el filtro de un canal de K⁺ átomo por átomo. <em>Del artículo de Neher y Sakmann solo pude verificar título, autores y año; no pude leer su texto, así que no describo más detalles.</em></p>`)}
<h3>Cuando el canal falla</h3>
${clin(`<p>Mutaciones en canales de Ca²⁺, Na⁺ y Cl⁻ y en receptores de acetilcolina se han asociado a trastornos de la excitabilidad del músculo; reciben el nombre de <strong>canalopatías</strong>. NSO sugiere que podrían estar detrás de algunos trastornos del movimiento, epilepsias y cefaleas, aunque lo plantea como posibilidad.</p>`)}
<p>${v('l:u04', 'El potencial de acción en la unidad 4')}</p>
<p><small>Fuentes: ${NSO}, cap. 2 (§2.2–2.3, §2.5, §2.7–2.8). Doyle et al. 1998, <em>Science</em> 280:69. Neher y Sakmann 1976, <em>Nature</em> 260:799 (solo título y resumen bibliográfico). Catálogo de moléculas de la app.</small></p>` },

  { id: 'u0-05', n: 'Potencial de reposo y propiedades pasivas', baj: 'Por qué la membrana está cargada y cómo se propaga una señal débil.',
    obj: ['Explicar el potencial de reposo con el equilibrio del K⁺ y la pequeña permeabilidad al Na⁺', 'Estimar cómo cambia el potencial de equilibrio del K⁺ al cambiar su concentración externa', 'Interpretar el cociente de permeabilidades α en la ecuación de GHK', 'Interpretar la constante de tiempo y la de espacio'],
    rel: [],
    html: `<p>El potencial de reposo se entiende con dos hechos: los iones están distribuidos de forma desigual dentro y fuera de la célula, y la membrana es permeable a cada ion en grado distinto. ${v('m:n:neurona', 'Neurona en 3D')}</p>
<h3>El K⁺ como protagonista</h3>
<p>A comienzos del siglo XX, Julius Bernstein propuso que el potencial de reposo (Vm) era igual al potencial de equilibrio del K⁺ (E<sub>K</sub>). La membrana es muy permeable al K⁺, que abunda dentro y escasea fuera. El K⁺ sale por difusión y deja atrás carga negativa que lo atrae de vuelta: una fuerza eléctrica hacia dentro contrarresta la fuerza de difusión hacia fuera. El potencial en que ambas se igualan es el <strong>potencial de equilibrio de Nernst</strong>.</p>
<h3>Poniendo a prueba la hipótesis</h3>
<p>Se varió sistemáticamente el K⁺ extracelular y se midió el potencial: los puntos quedaron muy cerca de la recta que predice Nernst. Como la relación es logarítmica, <strong>multiplicar por 10 la concentración de K⁺ cambia el potencial unos 60 mV</strong>. Con la misma regla, triplicarla lo cambia unos 29 mV (60 × log 3). Pero había desviaciones, así que Vm no puede ser exactamente E<sub>K</sub>: interviene otro ion, el Na⁺. Está concentrado fuera, y tiene un impulso químico y otro eléctrico (el interior es negativo) para entrar. Si la membrana tiene una pequeña permeabilidad al Na⁺, el potencial queda más despolarizado que E<sub>K</sub>.</p>
${tabla(['Valor', 'Cifra que da NSO'], [['E<sub>K</sub>', '−75 mV'], ['E<sub>Na</sub>', '+55 mV'], ['Potencial de reposo', '−60 mV'], ['Pico del potencial de acción', 'cerca de +40 mV, sin llegar a E<sub>Na</sub>']])}
<h3>La ecuación de Goldman, Hodgkin y Katz</h3>
<p>Cuando la membrana es permeable a dos iones, Nernst ya no basta y se usa la ecuación GHK, donde <strong>α = P<sub>Na</sub>/P<sub>K</sub></strong>. Si α = 0, GHK se reduce al Nernst del K⁺; si el Na⁺ domina, se reduce al del Na⁺. Con los datos del experimento anterior el mejor ajuste se obtiene con α = 0,01: la permeabilidad al K⁺ es 100 veces la del Na⁺. Por eso el reposo (−60 mV) queda algo más positivo que E<sub>K</sub> (−75 mV).</p>
<h3>Propiedades pasivas</h3>
<p>Se llaman pasivas porque no dependen de canales de voltaje ni de bombas: son propiedades de toda membrana.</p>
<ul>
<li><strong>Constante de tiempo (τ).</strong> Un cambio brusco de corriente no cambia el potencial al instante, sino de forma exponencial. τ es el tiempo en llegar al 63 % del cambio final y depende de la resistencia (R<sub>m</sub>) y de la capacitancia (C<sub>m</sub>) de la membrana. Ejemplo de NSO: de −60 a −50 mV con τ = 10 ms; a los 10 ms el potencial vale −53,7 mV. Menor τ, respuesta más rápida.</li>
<li><strong>Constante de espacio (λ).</strong> Un cambio localizado se atenúa con la distancia. Con λ = 1 mm y el soma fijado a −50 mV, a 1 mm el potencial es de unos −56 mV, y lejos del soma vuelve a −60 mV. λ depende del diámetro del axón, de R<sub>m</sub> y de la resistencia interna (R<sub>i</sub>). Con R<sub>m</sub> alta se escapa menos corriente y la señal llega más lejos: es como forrar una barra metálica para que el calor avance por dentro.</li>
</ul>
<p>La velocidad de propagación es proporcional a λ e inversa a τ, y de ahí sale la ventaja de la mielina vista en la unidad 0.3.</p>
${clave('Cómo se sabe', `<p>Dos pasos que se explican bien: la comparación entre datos y recta de Nernst al variar el K⁺ externo muestra que el K⁺ domina el reposo; las desviaciones empujan a añadir el Na⁺, y GHK con α = 0,01 reproduce los datos mucho mejor. Los números de τ y λ de arriba salen de la aritmética del ejemplo de NSO (63 % de 10 mV = 6,3 mV; 37 % de 10 mV ≈ 3,7 mV a 1 mm). <em>NSO no atribuye esas figuras a un artículo concreto, así que no las puedo citar. Los cálculos están comprobados en <code>calculos/u0-05.mjs</code>.</em></p>`)}
<p>${v('l:u04', 'Potencial de membrana en la unidad 4')}</p>
<p><small>Fuentes: ${NSO}, caps. 1 (§1.5–1.6) y 3 (§3.2).</small></p>` },
];
