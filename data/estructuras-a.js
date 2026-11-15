// Catálogo de estructuras · Parte A: corteza cerebral y sustancia blanca.
// Claves = nombre de la malla en el atlas Allen (sin lado).
// n nombre · la latín (Terminologia Anatomica) · g grupo · s sistema funcional principal · ba áreas de Brodmann
// a territorio arterial · d descripción · f funciones · c conexiones · cl clínica
export const A = {
  // ───────────────────────────── Lóbulo frontal
  primary_motor_cortex: {
    n: 'Corteza motora primaria (giro precentral)', la: 'Gyrus precentralis', g: 'ctx.frontal', s: 'motor', ba: '4', a: 'acm',
    d: 'Franja de corteza agranular inmediatamente anterior al surco central. Su capa V contiene las células piramidales gigantes de Betz. Está organizada somatotópicamente (homúnculo motor): pierna y pie en la cara medial, tronco, brazo, mano y cara en la convexidad, de dorsal a ventral.',
    f: ['Origen de ~30–40 % de las fibras del tracto corticoespinal y corticobulbar', 'Ejecución de movimientos voluntarios finos y fraccionados, sobre todo de la mano y la cara contralaterales', 'Codifica fuerza, dirección y velocidad del movimiento (codificación poblacional)'],
    c: 'Aferencias: núcleo ventral lateral del tálamo (relevo cerebeloso y palidal), corteza premotora y motora suplementaria, corteza somatosensorial. Eferencias: médula espinal y núcleos motores del tronco (vía piramidal), estriado, núcleo rojo, núcleos pontinos.',
    cl: 'Lesión: síndrome de motoneurona superior contralateral (paresia, espasticidad, hiperreflexia, signo de Babinski). Infarto de ACM: predominio faciobraquial; infarto de ACA: predominio crural. Foco epiléptico: crisis motoras con marcha jacksoniana.'
  },
  superior_frontal_gyrus: {
    n: 'Giro frontal superior', la: 'Gyrus frontalis superior', g: 'ctx.frontal', s: 'ejecutivo', ba: '6, 8, 9', a: 'aca',
    d: 'Giro longitudinal del borde superior del lóbulo frontal, que continúa en la cara medial. Su parte posterior contiene el área motora suplementaria (AMS, área 6 medial) y la pre-AMS; su parte anterior pertenece a la corteza prefrontal dorsomedial.',
    f: ['AMS: planificación y secuenciación de movimientos autoiniciados, coordinación bimanual', 'Campo ocular suplementario', 'Prefrontal dorsomedial: iniciativa, memoria de trabajo, monitoreo de la acción'],
    c: 'Conexiones recíprocas con corteza motora primaria, cíngulo anterior, ganglios basales (circuito motor) y núcleos VA/VL y dorsomedial del tálamo.',
    cl: 'Lesión de la AMS: mutismo acinético transitorio, dificultad para iniciar el movimiento, síndrome de la mano ajena. Lesión bilateral medial: abulia.'
  },
  middle_frontal_gyrus: {
    n: 'Giro frontal medio', la: 'Gyrus frontalis medius', g: 'ctx.frontal', s: 'ejecutivo', ba: '6, 8, 9, 46', a: 'acm',
    d: 'Ocupa la convexidad frontal entre los surcos frontal superior e inferior. Contiene la corteza prefrontal dorsolateral (áreas 9 y 46), el campo ocular frontal (área 8) y parte de la corteza premotora (área 6).',
    f: ['Funciones ejecutivas: memoria de trabajo, planificación, flexibilidad cognitiva, razonamiento', 'Campo ocular frontal: sacadas voluntarias hacia el lado contralateral', 'Premotora: selección de movimientos guiados por estímulos externos'],
    c: 'Circuito prefrontal dorsolateral: corteza → cabeza del caudado → pálido/SNr → núcleos VA y dorsomedial → corteza. Conexiones con corteza parietal posterior por el fascículo longitudinal superior.',
    cl: 'Síndrome disejecutivo (perseveración, mala planificación, memoria de trabajo reducida). Lesión del campo ocular frontal: desviación conjugada de la mirada hacia el lado de la lesión.'
  },
  inferior_frontal_gyrus_triangular_part: {
    n: 'Giro frontal inferior, porción triangular', la: 'Pars triangularis gyri frontalis inferioris', g: 'ctx.frontal', s: 'lenguaje', ba: '45', a: 'acm',
    d: 'Porción media del giro frontal inferior, entre las ramas anterior y ascendente del surco lateral. En el hemisferio dominante (izquierdo en ~95 % de los diestros) forma, junto a la porción opercular, el área de Broca.',
    f: ['Procesamiento semántico y selección léxica', 'Sintaxis y producción del lenguaje (hemisferio dominante)', 'Hemisferio no dominante: prosodia expresiva; control inhibitorio'],
    c: 'Unida a las áreas temporales y parietales del lenguaje por el fascículo arqueado (vía dorsal) y por el fascículo uncinado y la cápsula extrema (vía ventral).',
    cl: 'Afasia de Broca (no fluente, agramatical, con comprensión relativamente conservada y repetición alterada) por lesión de la división superior de la ACM izquierda.'
  },
  inferior_frontal_gyrus_opercular_part: {
    n: 'Giro frontal inferior, porción opercular', la: 'Pars opercularis gyri frontalis inferioris', g: 'ctx.frontal', s: 'lenguaje', ba: '44', a: 'acm',
    d: 'Porción posterior del giro frontal inferior, inmediatamente delante de la representación de la cara del giro precentral. Núcleo del área de Broca en el hemisferio dominante.',
    f: ['Programación fonológica y articulatoria del habla', 'Procesamiento sintáctico', 'Sistema de neuronas espejo: comprensión e imitación de acciones'],
    c: 'Fascículo arqueado hacia el giro supramarginal y temporal superior; conexiones con la corteza premotora ventral y la ínsula anterior.',
    cl: 'Afasia de Broca; apraxia del habla. La estimulación intraoperatoria produce detención del habla.'
  },
  frontal_operculum: {
    n: 'Opérculo frontal', la: 'Operculum frontale', g: 'ctx.frontal', s: 'gusto', ba: '43, 44', a: 'acm',
    d: 'Labio frontal que cubre la ínsula por arriba y por delante. Junto con la ínsula anterior constituye la corteza gustativa primaria.',
    f: ['Percepción consciente del gusto (junto con la ínsula anterior)', 'Control motor orofacial y deglución'],
    c: 'Recibe del núcleo ventral posteromedial parvocelular del tálamo (vía gustativa desde el núcleo del tracto solitario).',
    cl: 'Síndrome opercular (Foix-Chavany-Marie): parálisis facio-faringo-gloso-masticatoria voluntaria con conservación de los movimientos automáticos, en lesiones bilaterales.'
  },
  frontal_pole: {
    n: 'Polo frontal', la: 'Polus frontalis', g: 'ctx.frontal', s: 'ejecutivo', ba: '10', a: 'aca',
    d: 'Extremo anterior del hemisferio. El área 10 es la región prefrontal proporcionalmente más expandida en el ser humano.',
    f: ['Metacognición y pensamiento prospectivo', 'Gestión de metas múltiples (multitarea, «branching»)', 'Memoria prospectiva'],
    c: 'Conexiones con el resto de la corteza prefrontal, corteza temporal anterior y cíngulo; núcleo dorsomedial del tálamo.',
    cl: 'Lesiones (p. ej. contusiones por contragolpe): mala organización de la conducta en situaciones abiertas con rendimiento normal en pruebas estructuradas.'
  },
  frontomarginal_gyrus: {
    n: 'Giro frontomarginal', la: 'Gyrus frontomarginalis', g: 'ctx.frontal', s: 'ejecutivo', ba: '10, 11', a: 'aca',
    d: 'Pequeño giro transverso en el borde entre el polo frontal y la cara orbitaria.',
    f: ['Forma parte de la corteza prefrontal anterior: integración de metas y valor'],
    c: 'Conexiones corticocorticales prefrontales y con el núcleo dorsomedial del tálamo.',
    cl: 'Sin síndrome focal propio; se afecta en contusiones frontopolares y degeneración frontotemporal.'
  },
  rostral_gyrus: {
    n: 'Giro rostral', la: 'Gyrus rostralis', g: 'ctx.frontal', s: 'emocion', ba: '10, 12, 32', a: 'aca',
    d: 'Giro de la cara medial del lóbulo frontal, por debajo y delante de la rodilla del cuerpo calloso; forma parte de la corteza prefrontal ventromedial.',
    f: ['Valoración afectiva y toma de decisiones basada en el valor', 'Regulación emocional (inhibición de la amígdala)', 'Nodo de la red neuronal por defecto'],
    c: 'Recíprocas con amígdala, hipotálamo, estriado ventral, hipocampo y cíngulo anterior.',
    cl: 'Lesión ventromedial: decisiones personales y sociales desventajosas con inteligencia conservada (caso Phineas Gage, pacientes de Damasio).'
  },
  paracingulate_gyrus: {
    n: 'Giro paracingular', la: 'Gyrus paracingularis', g: 'ctx.frontal', s: 'ejecutivo', ba: '32', a: 'aca',
    d: 'Giro inconstante de la cara medial, dorsal al cíngulo anterior; más frecuente en el hemisferio izquierdo.',
    f: ['Monitoreo de la realidad y de las propias acciones', 'Teoría de la mente (cognición social)'],
    c: 'Corteza prefrontal medial y dorsolateral, cíngulo anterior.',
    cl: 'Su ausencia o reducción se ha asociado a alucinaciones en la esquizofrenia.'
  },
  paracentral_lobule_rostral_part: {
    n: 'Lóbulo paracentral, parte anterior (motora)', la: 'Lobulus paracentralis, pars anterior', g: 'ctx.frontal', s: 'motor', ba: '4, 6', a: 'aca',
    d: 'Continuación del giro precentral en la cara medial del hemisferio. Contiene la representación motora de la pierna, el pie y los esfínteres.',
    f: ['Control motor voluntario de la pierna y el pie contralaterales', 'Control voluntario de la micción y defecación (esfínteres externos)'],
    c: 'Fibras corticoespinales hacia los segmentos lumbosacros; conexiones con AMS y tálamo VL.',
    cl: 'Infarto de la ACA: paresia de predominio crural contralateral e incontinencia urinaria. Un meningioma parasagital puede causar paraparesia espástica bilateral.'
  },
  gyrus_rectus_straight_gyrus: {
    n: 'Giro recto', la: 'Gyrus rectus', g: 'ctx.frontal', s: 'emocion', ba: '11, 14', a: 'aca',
    d: 'Giro longitudinal de la cara orbitaria, medial al surco olfatorio (que aloja el bulbo y el tracto olfatorios).',
    f: ['Corteza orbitofrontal medial: valor de recompensa, regulación afectiva y autonómica'],
    c: 'Amígdala, hipotálamo, estriado ventral, cíngulo subcalloso.',
    cl: 'Vulnerable en la rotura de aneurismas de la arteria comunicante anterior y en meningiomas del surco olfatorio (anosmia + cambios de personalidad).'
  },
  medial_orbital_gyrus: {
    n: 'Giro orbitario medial', la: 'Gyrus orbitalis medialis', g: 'ctx.frontal', s: 'emocion', ba: '11, 13', a: 'aca',
    d: 'Parte medial de la corteza orbitofrontal, lateral al surco olfatorio.',
    f: ['Codifica el valor subjetivo de recompensas (comida, dinero, estímulos sociales)', 'Actualiza el valor cuando cambia el estado interno (saciedad)'],
    c: 'Recibe de corteza olfatoria, gustativa y visceral; conexiones con amígdala y estriado ventral.',
    cl: 'Lesión orbitofrontal: desinhibición, impulsividad, conducta social inapropiada, hiperfagia.'
  },
  anterior_intermediate_orbital_gyrus: {
    n: 'Giro orbitario anterior', la: 'Gyrus orbitalis anterior', g: 'ctx.frontal', s: 'emocion', ba: '11', a: 'acm',
    d: 'Porción anterior de la corteza orbitofrontal, por delante del surco orbitario en «H».',
    f: ['Representación de recompensas abstractas y de resultados esperados'],
    c: 'Corteza prefrontal lateral, temporal anterior (fascículo uncinado), amígdala.',
    cl: 'Síndrome orbitofrontal (desinhibición, juicio social alterado).'
  },
  posterior_intermediate_orbital_gyrus: {
    n: 'Giro orbitario posterior', la: 'Gyrus orbitalis posterior', g: 'ctx.frontal', s: 'emocion', ba: '13', a: 'acm',
    d: 'Porción posterior de la corteza orbitofrontal, vecina a la ínsula anterior y a la corteza olfatoria.',
    f: ['Convergencia olfatoria, gustativa y visceral: representación del sabor', 'Asociación estímulo–recompensa'],
    c: 'Corteza piriforme, ínsula agranular, amígdala, hipotálamo lateral.',
    cl: 'Su daño altera la conducta alimentaria y el aprendizaje de inversión.'
  },
  lateral_orbital_gyrus: {
    n: 'Giro orbitario lateral', la: 'Gyrus orbitalis lateralis', g: 'ctx.frontal', s: 'ejecutivo', ba: '47, 12', a: 'acm',
    d: 'Parte lateral de la cara orbitaria; se continúa con la porción orbitaria del giro frontal inferior (área 47).',
    f: ['Inhibición de respuestas y aprendizaje de inversión (cambio de reglas cuando el refuerzo cambia)', 'Procesamiento semántico (hemisferio dominante)'],
    c: 'Fascículo uncinado hacia el polo temporal; estriado ventral y caudado.',
    cl: 'Perseveración e incapacidad de modificar la conducta ante castigo o falta de recompensa.'
  },
  // ───────────────────────────── Lóbulo parietal
  postcentral_gyrus: {
    n: 'Giro postcentral (corteza somatosensorial primaria)', la: 'Gyrus postcentralis', g: 'ctx.parietal', s: 'somato', ba: '3, 1, 2', a: 'acm',
    d: 'Corteza granular (koniocorteza) inmediatamente posterior al surco central. Áreas 3a (propiocepción), 3b (tacto), 1 (textura) y 2 (forma y tamaño). Organización somatotópica (homúnculo sensitivo) con gran representación de mano, labios y lengua.',
    f: ['Percepción consciente del tacto fino, vibración, presión y propiocepción del hemicuerpo contralateral', 'Localización y discriminación de estímulos (discriminación de dos puntos, grafestesia)', 'Contribuye con fibras al tracto corticoespinal (modulación sensitiva en el asta posterior)'],
    c: 'Aferencias: núcleos ventral posterolateral (cuerpo) y ventral posteromedial (cara) del tálamo. Eferencias: área somatosensorial secundaria, corteza parietal posterior (áreas 5 y 7), corteza motora.',
    cl: 'Lesión: pérdida contralateral de la discriminación táctil, propiocepción y estereognosia, con dolor y temperatura relativamente conservados (pérdida sensitiva «cortical»). Crisis sensitivas con marcha jacksoniana.'
  },
  paracentral_lobule_caudal_part: {
    n: 'Lóbulo paracentral, parte posterior (sensitiva)', la: 'Lobulus paracentralis, pars posterior', g: 'ctx.parietal', s: 'somato', ba: '3, 1, 2, 5', a: 'aca',
    d: 'Continuación medial del giro postcentral. Contiene la representación somatosensorial de la pierna, el pie y los genitales.',
    f: ['Sensibilidad discriminativa de la extremidad inferior y región perineal contralaterales'],
    c: 'Núcleo ventral posterolateral del tálamo; corteza parietal posterior.',
    cl: 'Infarto de la ACA: hipoestesia cortical de la pierna contralateral.'
  },
  supraparietal_lobule: {
    n: 'Lóbulo parietal superior', la: 'Lobulus parietalis superior', g: 'ctx.parietal', s: 'atencion', ba: '5, 7', a: 'acm',
    d: 'Corteza de asociación somatosensorial y visuoespacial, dorsal al surco intraparietal. Forma parte de la vía visual dorsal («dónde/cómo»).',
    f: ['Integración visuomotora: guiar el alcance y la prensión con información visual y propioceptiva', 'Esquema corporal y atención espacial', 'Estereognosia (junto con el área 2)'],
    c: 'Recibe de la corteza somatosensorial y de las áreas visuales extraestriadas; proyecta a la corteza premotora dorsal por el fascículo longitudinal superior.',
    cl: 'Ataxia óptica (error al alcanzar objetos bajo guía visual), astereognosia. Lesión bilateral parietooccipital: síndrome de Bálint (ataxia óptica, apraxia oculomotora, simultagnosia).'
  },
  supramarginal_gyrus: {
    n: 'Giro supramarginal', la: 'Gyrus supramarginalis', g: 'ctx.parietal', s: 'lenguaje', ba: '40', a: 'acm',
    d: 'Parte anterior del lóbulo parietal inferior; rodea el extremo posterior del surco lateral.',
    f: ['Hemisferio dominante: almacén fonológico de la memoria de trabajo verbal, conversión fonema–articulación', 'Praxias: programas de uso de herramientas y gestos', 'Hemisferio no dominante: atención espacial'],
    c: 'El fascículo arqueado discurre por su sustancia blanca; conexiones con el área de Broca, corteza premotora ventral y temporal superior.',
    cl: 'Afasia de conducción (repetición muy alterada con comprensión y fluidez conservadas, parafasias fonémicas); apraxia ideomotora (lesión izquierda).'
  },
  angular_gyrus: {
    n: 'Giro angular', la: 'Gyrus angularis', g: 'ctx.parietal', s: 'lenguaje', ba: '39', a: 'acm',
    d: 'Parte posterior del lóbulo parietal inferior; rodea el extremo del surco temporal superior. Zona de convergencia multimodal (visual, auditiva, somatosensorial).',
    f: ['Lectura y escritura, cálculo, integración semántica (hemisferio dominante)', 'Atención espacial y conciencia del hemiespacio contralateral (hemisferio no dominante)', 'Nodo de la red por defecto'],
    c: 'Fascículos longitudinal superior y medio; conexiones con corteza temporal, occipital y prefrontal.',
    cl: 'Síndrome de Gerstmann (lesión dominante): agrafia, acalculia, agnosia digital y confusión derecha–izquierda. Alexia con agrafia. Lesión derecha: heminegligencia izquierda, anosognosia.'
  },
  parietal_operculum: {
    n: 'Opérculo parietal (área somatosensorial secundaria)', la: 'Operculum parietale', g: 'ctx.parietal', s: 'somato', ba: '43, 40 (SII)', a: 'acm',
    d: 'Labio superior del surco lateral, por detrás del surco central. Contiene el área somatosensorial secundaria (SII), con representación bilateral del cuerpo.',
    f: ['Reconocimiento táctil de objetos y aprendizaje táctil', 'Integración sensitivomotora; procesamiento del dolor (junto con la ínsula posterior)'],
    c: 'Recibe de SI y del tálamo ventral posterior; proyecta a la ínsula y, por ella, a la amígdala e hipocampo (memoria táctil).',
    cl: 'Agnosia táctil; las lesiones operculoinsulares pueden producir dolor central o asimbolia al dolor.'
  },
  precuneus: {
    n: 'Precúneo', la: 'Precuneus', g: 'ctx.parietal', s: 'atencion', ba: '7 medial, 31', a: 'acp',
    d: 'Cara medial del lóbulo parietal, entre el lóbulo paracentral y el surco parietooccipital. Una de las regiones de mayor metabolismo basal del encéfalo.',
    f: ['Imaginería visuoespacial y navegación', 'Recuperación de memoria episódica', 'Procesamiento autorreferencial; nodo central de la red neuronal por defecto'],
    c: 'Cíngulo posterior, corteza retroesplenial, parietal lateral, prefrontal medial; pulvinar y núcleo lateral posterior del tálamo.',
    cl: 'Hipometabolismo temprano en la enfermedad de Alzheimer; su actividad disminuye en anestesia, sueño profundo y estado vegetativo.'
  },
  // ───────────────────────────── Lóbulo temporal
  superior_temporal_gyrus: {
    n: 'Giro temporal superior', la: 'Gyrus temporalis superior', g: 'ctx.temporal', s: 'lenguaje', ba: '22', a: 'acm',
    d: 'Giro lateral inmediatamente bajo el surco lateral. Corteza auditiva de asociación; en el hemisferio dominante su parte posterior es el núcleo del área de Wernicke.',
    f: ['Análisis de sonidos complejos y de la voz', 'Comprensión del lenguaje hablado (hemisferio dominante)', 'Prosodia receptiva y música (hemisferio no dominante)', 'El surco temporal superior procesa movimiento biológico y mirada'],
    c: 'Recibe de la corteza auditiva primaria; proyecta al lóbulo parietal inferior y al área de Broca por el fascículo arqueado.',
    cl: 'Afasia de Wernicke (fluente, con parafasias y neologismos, comprensión y repetición muy alteradas, anosognosia) por lesión de la división inferior de la ACM izquierda.'
  },
  transverse_temporal_gyrus_Heschls_gyrus: {
    n: 'Giro temporal transverso (de Heschl)', la: 'Gyrus temporalis transversus', g: 'ctx.temporal', s: 'auditivo', ba: '41, 42', a: 'acm',
    d: 'Giro oculto en la cara superior del lóbulo temporal, dentro del surco lateral. Contiene la corteza auditiva primaria (A1), con organización tonotópica: frecuencias graves anterolaterales, agudas posteromediales.',
    f: ['Percepción consciente del sonido: frecuencia, intensidad y patrones temporales', 'Cada hemisferio recibe información de ambos oídos (predominio contralateral)'],
    c: 'Aferencias: núcleo geniculado medial del tálamo a través de la radiación acústica (porción sublenticular de la cápsula interna). Eferencias: cinturón auditivo, giro temporal superior.',
    cl: 'La lesión unilateral no produce sordera (representación bilateral), sino dificultad para localizar sonidos. Lesión bilateral: sordera cortical o agnosia auditiva.'
  },
  planum_temporale: {
    n: 'Plano temporal', la: 'Planum temporale', g: 'ctx.temporal', s: 'lenguaje', ba: '22, 42', a: 'acm',
    d: 'Superficie triangular de la cara superior del lóbulo temporal, posterior al giro de Heschl. Es mayor en el hemisferio izquierdo en la mayoría de las personas: la asimetría anatómica más marcada del cerebro humano.',
    f: ['Corteza auditiva de asociación: análisis espectrotemporal de fonemas', 'Forma parte del área de Wernicke en el hemisferio dominante'],
    c: 'Recibe de A1; conexión con el lóbulo parietal inferior y la corteza premotora (vía dorsal del habla).',
    cl: 'Asimetría reducida descrita en dislexia y esquizofrenia. Lesión: sordera pura para las palabras.'
  },
  planum_polare: {
    n: 'Plano polar', la: 'Planum polare', g: 'ctx.temporal', s: 'auditivo', ba: '22, 38', a: 'acm',
    d: 'Superficie de la cara superior del lóbulo temporal, anterior al giro de Heschl.',
    f: ['Corteza auditiva de asociación anterior: procesamiento de melodía y tono', 'Vía auditiva ventral («qué»): identificación de objetos sonoros'],
    c: 'Corteza auditiva primaria, polo temporal, ínsula, corteza prefrontal ventrolateral.',
    cl: 'Su lesión (sobre todo derecha) puede causar amusia.'
  },
  middle_temporal_gyrus: {
    n: 'Giro temporal medio', la: 'Gyrus temporalis medius', g: 'ctx.temporal', s: 'lenguaje', ba: '21, 37', a: 'acm',
    d: 'Giro de la convexidad temporal entre los surcos temporal superior e inferior. En su extremo posterior, hacia la unión temporooccipital, se ubica el área visual del movimiento (MT/V5).',
    f: ['Acceso léxico-semántico: significado de las palabras (hemisferio dominante)', 'Memoria semántica', 'MT/V5: percepción del movimiento visual'],
    c: 'Fascículos longitudinal inferior y medio, arqueado; conexiones con hipocampo y corteza prefrontal.',
    cl: 'Anomia y afasia transcortical sensitiva (comprensión alterada con repetición conservada). Lesión bilateral de V5: acinetopsia.'
  },
  inferior_temporal_gyrus: {
    n: 'Giro temporal inferior', la: 'Gyrus temporalis inferior', g: 'ctx.temporal', s: 'visual', ba: '20, 37', a: 'acp',
    d: 'Giro del borde inferolateral del lóbulo temporal. Estación final de la vía visual ventral («qué»).',
    f: ['Reconocimiento visual de objetos, con invariancia a tamaño y posición', 'Memoria visual a largo plazo y categorización'],
    c: 'Recibe de V4 por el fascículo longitudinal inferior; proyecta a la corteza perirrinal, amígdala y prefrontal ventrolateral.',
    cl: 'Agnosia visual asociativa (el objeto se percibe y copia, pero no se reconoce).'
  },
  occipitotemporal_fusiform_gyrus_temporal_part: {
    n: 'Giro fusiforme, parte temporal', la: 'Gyrus fusiformis (occipitotemporalis lateralis)', g: 'ctx.temporal', s: 'visual', ba: '37, 20', a: 'acp',
    d: 'Giro de la cara inferior del hemisferio, entre el surco occipitotemporal y el surco colateral. Contiene el área fusiforme de las caras (predominio derecho) y el área de la forma visual de las palabras (izquierda).',
    f: ['Reconocimiento de caras', 'Reconocimiento de palabras escritas', 'Pericia visual: categorías sobreaprendidas'],
    c: 'Vía visual ventral: desde V4 y la corteza occipital lateral hacia el polo temporal, amígdala e hipocampo.',
    cl: 'Prosopagnosia (lesión bilateral o derecha). Alexia pura sin agrafia (lesión izquierda o desconexión por el esplenio).'
  },
  perirhinal_gyrus_rostral_part_of_FuGt: {
    n: 'Corteza perirrinal', la: 'Cortex perirhinalis', g: 'ctx.temporal', s: 'memoria', ba: '35, 36', a: 'acp',
    d: 'Banda de corteza en el surco colateral y parte rostral del giro fusiforme, lateral a la corteza entorrinal.',
    f: ['Memoria de reconocimiento por familiaridad de objetos', 'Asociación entre atributos de un objeto; puente entre la vía visual ventral y el hipocampo'],
    c: 'Recibe de áreas de asociación unimodal y polimodal; proyecta a la corteza entorrinal lateral y de ahí al hipocampo.',
    cl: 'Sede temprana de ovillos neurofibrilares en la enfermedad de Alzheimer (estadios transentorrinales de Braak I–II).'
  },
  temporal_pole: {
    n: 'Polo temporal', la: 'Polus temporalis', g: 'ctx.temporal', s: 'memoria', ba: '38', a: 'acm',
    d: 'Extremo anterior del lóbulo temporal; corteza de transición paralímbica.',
    f: ['Centro («hub») de la memoria semántica: conocimiento de personas, objetos y conceptos', 'Cognición social y emocional; reconocimiento de personas famosas y nombres propios'],
    c: 'Fascículo uncinado hacia la corteza orbitofrontal; amígdala; fascículo longitudinal inferior.',
    cl: 'Demencia semántica (atrofia temporal anterior). Encefalitis herpética. Lesión bilateral con amígdala: síndrome de Klüver-Bucy.'
  },
  // ───────────────────────────── Lóbulo occipital
  occipital_pole: {
    n: 'Polo occipital', la: 'Polus occipitalis', g: 'ctx.occipital', s: 'visual', ba: '17, 18', a: 'acp',
    d: 'Extremo posterior del hemisferio. Aquí la corteza visual primaria representa la mácula (visión central), con enorme magnificación cortical.',
    f: ['Visión central de alta agudeza'],
    c: 'Recibe del núcleo geniculado lateral a través de la radiación óptica.',
    cl: 'Zona limítrofe entre ACP y ACM: en un infarto de la ACP puede conservarse la visión macular («respeto macular»). Su lesión aislada produce escotomas centrales homónimos.'
  },
  cuneus: {
    n: 'Cuña (cúneo)', la: 'Cuneus', g: 'ctx.occipital', s: 'visual', ba: '17, 18, 19', a: 'acp',
    d: 'Giro en forma de cuña de la cara medial occipital, entre los surcos parietooccipital y calcarino. Su labio inferior forma el banco superior de la corteza visual primaria (V1).',
    f: ['Representa el cuadrante inferior del hemicampo visual contralateral', 'Áreas V2 y V3 dorsales: procesamiento visual temprano'],
    c: 'Recibe las fibras superiores (parietales) de la radiación óptica; proyecta a la vía dorsal.',
    cl: 'Lesión: cuadrantanopsia homónima inferior contralateral.'
  },
  lingual_gyrus_medial_occipitotemporal_gyrus: {
    n: 'Giro lingual', la: 'Gyrus lingualis', g: 'ctx.occipital', s: 'visual', ba: '17, 18, 19', a: 'acp',
    d: 'Giro inferior al surco calcarino; su labio superior forma el banco inferior de V1. Se continúa hacia delante con el giro parahipocampal.',
    f: ['Representa el cuadrante superior del hemicampo visual contralateral', 'V4 ventral: percepción del color', 'Reconocimiento de lugares y escenas'],
    c: 'Recibe el asa de Meyer (fibras temporales de la radiación óptica).',
    cl: 'Cuadrantanopsia homónima superior contralateral; acromatopsia cerebral; desorientación topográfica.'
  },
  lateral_occipitotemporal_fusiform_gyrus_occipital_part: {
    n: 'Giro fusiforme, parte occipital', la: 'Gyrus fusiformis, pars occipitalis', g: 'ctx.occipital', s: 'visual', ba: '19, 37', a: 'acp',
    d: 'Porción posterior del giro fusiforme en la cara inferior del lóbulo occipital.',
    f: ['Área V4 y complejo del color', 'Procesamiento de forma en la vía ventral'],
    c: 'Desde V1/V2 hacia la corteza temporal inferior.',
    cl: 'Acromatopsia central (hemiacromatopsia contralateral), a menudo con prosopagnosia.'
  },
  superior_occipital_gyrus: {
    n: 'Giro occipital superior', la: 'Gyrus occipitalis superior', g: 'ctx.occipital', s: 'visual', ba: '19', a: 'acp',
    d: 'Corteza visual de asociación de la convexidad occipital dorsal (áreas V3, V3A).',
    f: ['Vía visual dorsal: análisis de movimiento, profundidad y posición espacial'],
    c: 'Proyecta a la corteza parietal posterior (surco intraparietal).',
    cl: 'Su lesión, junto con la parietal, contribuye al síndrome de Bálint.'
  },
  inferior_occipital_gyrus: {
    n: 'Giro occipital inferior', la: 'Gyrus occipitalis inferior', g: 'ctx.occipital', s: 'visual', ba: '18, 19', a: 'acp',
    d: 'Corteza visual de asociación de la convexidad occipital ventrolateral. Contiene el área occipital de las caras y el complejo occipital lateral.',
    f: ['Vía visual ventral: forma de los objetos; primer análisis de los rasgos faciales'],
    c: 'Proyecta al giro fusiforme y a la corteza temporal inferior.',
    cl: 'Agnosia visual aperceptiva; prosopagnosia.'
  },
  // ───────────────────────────── Ínsula
  short_insular_gyri: {
    n: 'Giros cortos de la ínsula (ínsula anterior)', la: 'Gyri breves insulae', g: 'ctx.insula', s: 'emocion', ba: '13, 14, 16', a: 'acm',
    d: 'Tres giros cortos por delante del surco central de la ínsula, ocultos por los opérculos. La ínsula anterior es agranular/disgranular y contiene neuronas de von Economo.',
    f: ['Conciencia interoceptiva: representación subjetiva del estado del cuerpo', 'Emociones (asco, empatía), saliencia: nodo de la red de saliencia junto al cíngulo anterior', 'Gusto (corteza gustativa primaria junto al opérculo frontal)', 'Control autonómico'],
    c: 'Recíprocas con amígdala, cíngulo anterior, corteza orbitofrontal e hipotálamo; aferencias viscerales por el tálamo VPMpc y VMpo.',
    cl: 'Degenera en la variante conductual de la demencia frontotemporal. Infarto insular: arritmias y disautonomía. Su lesión puede abolir la adicción al tabaco.'
  },
  long_insular_gyri: {
    n: 'Giros largos de la ínsula (ínsula posterior)', la: 'Gyri longi insulae', g: 'ctx.insula', s: 'somato', ba: '13', a: 'acm',
    d: 'Dos giros largos por detrás del surco central de la ínsula; corteza granular.',
    f: ['Corteza interoceptiva primaria: dolor, temperatura, picor, sensación visceral', 'Corteza vestibular (región parietoinsular)', 'Integración somatosensorial y auditiva'],
    c: 'Recibe del tálamo ventral posterior y ventromedial posterior (vía espinotalámica); conexiones con SII.',
    cl: 'Dolor central postictal (síndrome operculoinsular), asimbolia al dolor; vértigo y lateropulsión.'
  },
  limen_insula: {
    n: 'Limen de la ínsula', la: 'Limen insulae', g: 'ctx.insula', s: 'olfato', ba: '—', a: 'acm',
    d: 'Umbral anteroinferior de la ínsula, donde ésta se continúa con la sustancia perforada anterior y la corteza piriforme. Por él pasa la ACM (segmento M1 → M2) y debajo corre el fascículo uncinado.',
    f: ['Transición entre alocorteza olfatoria e ínsula'],
    c: 'Corteza piriforme, amígdala, corteza orbitofrontal.',
    cl: 'Referencia quirúrgica clave en el abordaje transilviano y en la resección de gliomas insulares.'
  },
  frontal_agranular_insular_cortex_area_Fl: {
    n: 'Corteza insular agranular frontal', la: 'Cortex insularis agranularis (pars frontalis)', g: 'ctx.insula', s: 'emocion', ba: '—', a: 'acm',
    d: 'Zona de transición frontoinsular de corteza agranular (sin capa IV), rica en neuronas de von Economo.',
    f: ['Integración visceromotora y afectiva; detección de saliencia'],
    c: 'Corteza orbitofrontal posterior, cíngulo anterior, amígdala.',
    cl: 'Pérdida selectiva de neuronas de von Economo en la demencia frontotemporal conductual.'
  },
  temporal_agranular_insular_cortex_area_Tl: {
    n: 'Corteza insular agranular temporal', la: 'Cortex insularis agranularis (pars temporalis)', g: 'ctx.insula', s: 'olfato', ba: '—', a: 'acm',
    d: 'Zona de transición temporoinsular, adyacente a la corteza piriforme.',
    f: ['Integración olfatoria–gustativa–visceral'],
    c: 'Corteza piriforme, amígdala, polo temporal.',
    cl: 'Participa en las auras olfatorias y epigástricas de la epilepsia temporal medial.'
  },
  // ───────────────────────────── Lóbulo límbico
  cingulate_gyrus_rostral_anterior_part: {
    n: 'Giro del cíngulo, parte anterior', la: 'Gyrus cinguli, pars anterior', g: 'ctx.limbico', s: 'emocion', ba: '24, 32, 33', a: 'aca',
    d: 'Rodea la rodilla y la parte anterior del cuerpo calloso. Subdivisión dorsal «cognitiva» y pregenual/subgenual «afectiva».',
    f: ['Monitoreo de conflicto y detección de errores', 'Motivación e iniciación de la conducta', 'Componente afectivo del dolor', 'Regulación autonómica y emocional'],
    c: 'Núcleos anterior y dorsomedial del tálamo, amígdala, corteza prefrontal, estriado ventral; forma parte del circuito de Papez.',
    cl: 'Lesión bilateral: mutismo acinético y abulia. Cingulotomía para el dolor crónico refractario y el TOC. La región subgenual (área 25) es blanco de estimulación cerebral profunda en depresión.'
  },
  cingulate_gyrus_caudal_posterior_part: {
    n: 'Giro del cíngulo, parte posterior', la: 'Gyrus cinguli, pars posterior', g: 'ctx.limbico', s: 'memoria', ba: '23, 31', a: 'acp',
    d: 'Porción del giro del cíngulo por encima del cuerpo y esplenio del cuerpo calloso. Región de muy alto consumo metabólico en reposo.',
    f: ['Nodo central de la red neuronal por defecto', 'Memoria episódica y autobiográfica', 'Orientación espacial y atención interna'],
    c: 'Haz del cíngulo hacia la corteza parahipocampal y entorrinal; núcleos anterior y laterodorsal del tálamo; precúneo.',
    cl: 'Hipometabolismo precoz en la enfermedad de Alzheimer.'
  },
  ingulo_parahippocampal_isthmus: {
    n: 'Istmo del giro del cíngulo', la: 'Isthmus gyri cinguli', g: 'ctx.limbico', s: 'memoria', ba: '26, 29, 30', a: 'acp',
    d: 'Estrechamiento que, por detrás del esplenio, une el giro del cíngulo con el giro parahipocampal. Contiene la corteza retroesplenial.',
    f: ['Navegación espacial: traducción entre marcos egocéntrico y alocéntrico', 'Memoria episódica'],
    c: 'Núcleos anteriores del tálamo, hipocampo, corteza parietal posterior.',
    cl: 'Lesión retroesplenial: amnesia y desorientación topográfica (el paciente reconoce los lugares pero no sabe orientarse).'
  },
  subcallosal_gyrus_parolfactory_gyrus: {
    n: 'Área subcallosa (giro paraolfatorio)', la: 'Area subcallosa', g: 'ctx.limbico', s: 'emocion', ba: '25', a: 'aca',
    d: 'Pequeña región bajo la rodilla y el rostro del cuerpo calloso, delante de la lámina terminal.',
    f: ['Regulación del estado de ánimo y de las respuestas autonómicas y endocrinas al estrés'],
    c: 'Hipotálamo, amígdala, sustancia gris periacueductal, núcleos del rafe, corteza orbitofrontal.',
    cl: 'Hiperactiva en la depresión mayor; blanco de estimulación cerebral profunda (área 25).'
  },
  anterior_parahippocampal_gyrus: {
    n: 'Giro parahipocampal anterior (corteza entorrinal)', la: 'Gyrus parahippocampalis, pars anterior · Area entorhinalis', g: 'ctx.limbico', s: 'memoria', ba: '28, 34', a: 'acp',
    d: 'Parte anterior del giro parahipocampal, que incluye la corteza entorrinal y, medialmente, el uncus. Es la puerta de entrada y salida del hipocampo.',
    f: ['Principal interfaz entre la neocorteza y el hipocampo (vía perforante)', 'Células de rejilla (grid cells): métrica del espacio', 'Memoria declarativa'],
    c: 'Recibe de cortezas perirrinal y parahipocampal; capa II → giro dentado y CA3; capa III → CA1; recibe de CA1 y subículo.',
    cl: 'Primera región neocortical afectada en la enfermedad de Alzheimer. La herniación del uncus comprime el III nervio (midriasis ipsilateral) y el pedúnculo cerebral.'
  },
  posterior_parahippocampal_gyrus: {
    n: 'Giro parahipocampal posterior', la: 'Gyrus parahippocampalis, pars posterior', g: 'ctx.limbico', s: 'memoria', ba: '36, 37 (TH/TF)', a: 'acp',
    d: 'Parte posterior del giro parahipocampal, medial al surco colateral. Contiene el área parahipocampal de lugares.',
    f: ['Procesamiento de escenas y contexto espacial', 'Memoria espacial y contextual (vía «dónde» hacia el hipocampo)'],
    c: 'Recibe de corteza parietal posterior y retroesplenial; proyecta a la corteza entorrinal medial.',
    cl: 'Desorientación topográfica anterógrada.'
  },
  gyrus_ambiens: {
    n: 'Giro ambiens', la: 'Gyrus ambiens', g: 'ctx.olf', s: 'olfato', ba: '34', a: 'acp',
    d: 'Pequeña eminencia del uncus anterior, parte de la corteza periamigdalina.',
    f: ['Corteza olfatoria primaria (junto con la corteza piriforme)'],
    c: 'Recibe de la estría olfatoria lateral; conecta con la amígdala y la corteza entorrinal.',
    cl: 'Foco de las crisis uncinadas: alucinaciones olfatorias desagradables (cacosmia).'
  },
  // ───────────────────────────── Corteza olfatoria
  olfactory_bulb: {
    n: 'Bulbo olfatorio', la: 'Bulbus olfactorius', g: 'ctx.olf', s: 'olfato', ba: '—', a: 'aca',
    d: 'Estructura alocortical sobre la lámina cribosa del etmoides. Recibe los axones de las neuronas receptoras olfatorias (I nervio craneal), que convergen en glomérulos según el receptor que expresan.',
    f: ['Primer relevo y procesamiento del olfato: sinapsis con células mitrales y en penacho', 'Inhibición lateral por células periglomerulares y granulares (afina el contraste entre olores)'],
    c: 'Eferencias por el tracto olfatorio hacia la corteza piriforme, amígdala y corteza entorrinal, sin relevo talámico previo.',
    cl: 'Anosmia por traumatismo (cizallamiento de los filetes olfatorios) o meningioma del surco olfatorio. Hiposmia precoz en la enfermedad de Parkinson y de Alzheimer.'
  },
  olfactory_tract: {
    n: 'Tracto olfatorio', la: 'Tractus olfactorius', g: 'ctx.olf', s: 'olfato', ba: '—', a: 'aca',
    d: 'Cinta de sustancia blanca en el surco olfatorio que lleva los axones de las células mitrales y en penacho. Se divide en las estrías olfatorias medial y lateral delante de la sustancia perforada anterior.',
    f: ['Conduce la información olfatoria hacia la corteza olfatoria primaria'],
    c: 'Estría lateral → corteza piriforme, amígdala, corteza entorrinal. Estría medial → área septal.',
    cl: 'Síndrome de Foster Kennedy: anosmia y atrofia óptica ipsilaterales con papiledema contralateral (tumor frontal basal).'
  },
  anterior_olfactory_nucleus: {
    n: 'Núcleo olfatorio anterior', la: 'Nucleus olfactorius anterior', g: 'ctx.olf', s: 'olfato', ba: '—', a: 'aca',
    d: 'Grupo neuronal en la parte posterior del bulbo y a lo largo del tracto olfatorio.',
    f: ['Relevo y coordinación interhemisférica de la información olfatoria'],
    c: 'Proyecta al bulbo contralateral por la comisura anterior y a la corteza piriforme.',
    cl: 'Sitio temprano de cuerpos de Lewy en la enfermedad de Parkinson (estadio 1 de Braak).'
  },
  lateral_olfactory_gyrus: {
    n: 'Giro olfatorio lateral', la: 'Gyrus olfactorius lateralis', g: 'ctx.olf', s: 'olfato', ba: '—', a: 'acm',
    d: 'Delgada capa de sustancia gris que cubre la estría olfatoria lateral hasta el limen de la ínsula.',
    f: ['Parte de la corteza olfatoria primaria'],
    c: 'Continúa con la corteza piriforme y el giro ambiens.',
    cl: 'Sin síndrome aislado.'
  },
  piriform_region: {
    n: 'Corteza piriforme', la: 'Cortex piriformis', g: 'ctx.olf', s: 'olfato', ba: '—', a: 'acm',
    d: 'Paleocorteza de tres capas en la unión frontotemporal. Es la mayor área de la corteza olfatoria primaria.',
    f: ['Identificación y discriminación de olores (codificación distribuida, sin mapa espacial)', 'Memoria olfatoria'],
    c: 'Recibe directamente del bulbo olfatorio (única modalidad sensorial que llega a la corteza sin pasar antes por el tálamo); proyecta al tálamo dorsomedial, corteza orbitofrontal, amígdala e hipotálamo.',
    cl: 'Región de muy bajo umbral epileptógeno; auras olfatorias.'
  },
  // ───────────────────────────── Sustancia blanca y comisuras
  white_matter_of_forebrain: {
    n: 'Sustancia blanca cerebral', la: 'Substantia alba cerebri', g: 'sb', s: 'conexion', ba: '—', a: 'acm',
    d: 'Centro semioval, corona radiada y cápsulas interna, externa y extrema. Contiene fibras de proyección (cápsula interna), de asociación (fascículos longitudinal superior, arqueado, uncinado, longitudinal inferior, cíngulo) y comisurales.',
    f: ['Cápsula interna, brazo anterior: fibras frontopontinas y radiación talámica anterior', 'Rodilla: fibras corticobulbares', 'Brazo posterior: tracto corticoespinal y radiaciones somatosensoriales', 'Porciones retro- y sublenticular: radiaciones óptica y acústica'],
    c: 'Conecta la corteza con tálamo, tronco y médula (proyección), con otras áreas del mismo hemisferio (asociación) y con el hemisferio opuesto (comisuras).',
    cl: 'Infarto lacunar del brazo posterior de la cápsula interna (arterias lenticuloestriadas o coroidea anterior): hemiparesia motora pura contralateral. Esclerosis múltiple y leucodistrofias: desmielinización.'
  },
  corpus_callosum: {
    n: 'Cuerpo calloso', la: 'Corpus callosum', g: 'sb', s: 'conexion', ba: '—', a: 'aca',
    d: 'Mayor comisura del encéfalo (~200 millones de axones). Partes: rostro, rodilla, cuerpo (tronco) y esplenio. Las fibras de la rodilla forman el fórceps menor (frontal) y las del esplenio el fórceps mayor (occipital).',
    f: ['Conecta áreas homólogas de ambos hemisferios', 'Permite integrar la información sensorial, motora y cognitiva entre hemisferios'],
    c: 'Rodilla: cortezas prefrontales. Cuerpo: motoras y somatosensoriales. Esplenio: occipitales, temporales y parietales posteriores.',
    cl: 'Síndromes de desconexión («cerebro dividido»): anomia táctil izquierda, apraxia izquierda. Lesión del esplenio + corteza occipital izquierda: alexia sin agrafia. Agenesia; callosotomía en epilepsia refractaria; enfermedad de Marchiafava-Bignami.'
  },
  anterior_commissure: {
    n: 'Comisura anterior', la: 'Commissura anterior', g: 'sb', s: 'conexion', ba: '—', a: 'aca',
    d: 'Haz compacto que cruza la línea media por delante de las columnas del fórnix, en la lámina terminal.',
    f: ['Conecta los bulbos olfatorios y la corteza temporal anterior e inferior de ambos lados, además de las amígdalas'],
    c: 'Parte anterior (olfatoria) y parte posterior (temporal).',
    cl: 'Referencia de la línea comisura anterior–comisura posterior (CA–CP) en neuroimagen y estereotaxia.'
  },
  fornix: {
    n: 'Fórnix', la: 'Fornix', g: 'sb', s: 'memoria', ba: '—', a: 'aca',
    d: 'Principal vía eferente del hipocampo (~1,2 millones de axones). Trayecto: álveo → fimbria → pilar → cuerpo (bajo el cuerpo calloso) → columnas, que descienden hacia el hipotálamo.',
    f: ['Lleva las eferencias del subículo e hipocampo a los cuerpos mamilares, núcleos septales y tálamo anterior', 'Trae aferencias colinérgicas septales al hipocampo'],
    c: 'Fibras poscomisurales → cuerpo mamilar; precomisurales → núcleos septales, accumbens y corteza prefrontal medial. Eslabón del circuito de Papez.',
    cl: 'Lesión bilateral (cirugía de quiste coloide, tumores): amnesia anterógrada.'
  },
  optic_radiation: {
    n: 'Radiación óptica', la: 'Radiatio optica (tractus geniculocalcarinus)', g: 'sb', s: 'visual', ba: '—', a: 'acp',
    d: 'Fibras desde el núcleo geniculado lateral a la corteza visual primaria. Las fibras inferiores (campo visual superior) hacen un rodeo anterior en el lóbulo temporal alrededor del asta inferior del ventrículo: asa de Meyer.',
    f: ['Conduce la información visual del hemicampo contralateral a la corteza calcarina'],
    c: 'Fibras superiores (parietales) → labio superior del surco calcarino (cúneo); fibras inferiores (temporales) → labio inferior (giro lingual).',
    cl: 'Lesión temporal (asa de Meyer): cuadrantanopsia homónima superior contralateral. Lesión parietal: cuadrantanopsia inferior. Lesión completa: hemianopsia homónima contralateral.'
  },
};
