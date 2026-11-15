// Catálogo de estructuras · Parte B: hipocampo, amígdala, ganglios basales, diencéfalo,
// tronco encefálico, cerebelo y sistema ventricular.
export const B = {
  // ───────────────────────────── Formación hipocampal
  head_of_hippocampus: {
    n: 'Hipocampo, cabeza', la: 'Hippocampus, caput (pes hippocampi)', g: 'hipocampo', s: 'memoria', a: 'coroidea',
    d: 'Extremo anterior ensanchado del hipocampo, con digitaciones, en el suelo del asta inferior del ventrículo lateral, justo detrás de la amígdala. El hipocampo es arquicorteza de tres capas: giro dentado, cuerno de Amón (CA1–CA4) y subículo.',
    f: ['Hipocampo anterior: memoria ligada a emoción, ansiedad y respuesta al estrés (conexión con amígdala e hipotálamo)', 'Codificación de memoria episódica'],
    c: 'Circuito trisináptico: corteza entorrinal → (vía perforante) giro dentado → (fibras musgosas) CA3 → (colaterales de Schaffer) CA1 → subículo → corteza entorrinal y fórnix.',
    cl: 'Esclerosis mesial temporal: causa más frecuente de epilepsia focal refractaria. CA1 (sector de Sommer) es muy vulnerable a hipoxia e isquemia.'
  },
  body_of_hippocampus: {
    n: 'Hipocampo, cuerpo', la: 'Hippocampus, corpus', g: 'hipocampo', s: 'memoria', a: 'acp',
    d: 'Porción media del hipocampo; en corte coronal muestra la clásica imagen de dos «C» entrelazadas (giro dentado y cuerno de Amón). Su superficie ventricular está cubierta por el álveo, que converge en la fimbria.',
    f: ['Consolidación de la memoria declarativa (episódica y semántica): de corto a largo plazo', 'Potenciación a largo plazo (LTP) dependiente de receptores NMDA: modelo celular del aprendizaje', 'Neurogénesis adulta en el giro dentado'],
    c: 'Aferencias: corteza entorrinal, septum medial (acetilcolina), locus cerúleo, rafe. Eferencias: fórnix → cuerpos mamilares, septum, tálamo anterior.',
    cl: 'Lesión bilateral (paciente H. M.): amnesia anterógrada grave con memoria procedimental e inteligencia conservadas. Atrofia hipocampal: marcador de la enfermedad de Alzheimer. Amnesia global transitoria.'
  },
  tail_of_hippocampus: {
    n: 'Hipocampo, cola', la: 'Hippocampus, cauda', g: 'hipocampo', s: 'memoria', a: 'acp',
    d: 'Extremo posterior adelgazado que se curva hacia arriba bajo el esplenio del cuerpo calloso, donde se continúa con el indusium griseum.',
    f: ['Hipocampo posterior: memoria y navegación espacial (células de lugar)', 'Mapa cognitivo del entorno'],
    c: 'Conexión preferente con la corteza parahipocampal posterior, retroesplenial y parietal.',
    cl: 'Su volumen aumenta con el entrenamiento en navegación (taxistas de Londres). Irrigado por ramas hipocampales de la ACP: infarto → amnesia.'
  },
  // ───────────────────────────── Complejo amigdalino
  amygdaloid_complex: {
    n: 'Complejo amigdalino (amígdala)', la: 'Corpus amygdaloideum', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Conjunto de núcleos con forma de almendra en el polo temporal medial, delante del hipocampo y bajo el uncus. Tres grupos: basolateral (entrada), corticomedial (olfatorio) y central (salida).',
    f: ['Asigna valor emocional a los estímulos; detección de amenazas', 'Condicionamiento del miedo (aprendizaje asociativo emocional)', 'Modula la consolidación de la memoria emocional en el hipocampo', 'Reconocimiento de expresiones faciales de miedo; conducta social'],
    c: 'Aferencias: tálamo (vía rápida), cortezas sensoriales de asociación, hipocampo, corteza prefrontal medial. Eferencias: estría terminal y vía amigdalofugal ventral → hipotálamo, tronco encefálico, estriado ventral, corteza orbitofrontal.',
    cl: 'Lesión bilateral: síndrome de Klüver-Bucy (docilidad, hiperoralidad, hipersexualidad, agnosia visual). Enfermedad de Urbach-Wiethe: incapacidad de reconocer y sentir miedo. Hiperreactividad en ansiedad y TEPT.'
  },
  lateral_nucleus: {
    n: 'Núcleo lateral de la amígdala', la: 'Nucleus lateralis amygdalae', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Núcleo más lateral del grupo basolateral; principal puerta de entrada sensorial de la amígdala.',
    f: ['Recibe y asocia el estímulo condicionado (p. ej. un tono) con el incondicionado (dolor)', 'Sede de la plasticidad sináptica (LTP) que sustenta el condicionamiento del miedo'],
    c: 'Aferencias de tálamo sensorial y cortezas auditiva, visual y somatosensorial; proyecta a los núcleos basal y central.',
    cl: 'Su lesión impide adquirir el miedo condicionado.'
  },
  basolateral_nucleus_basal_nucleus: {
    n: 'Núcleo basal (basolateral) de la amígdala', la: 'Nucleus basalis amygdalae', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Núcleo de neuronas glutamatérgicas de tipo cortical dentro del grupo basolateral.',
    f: ['Integra contexto (hipocampo) y valor; guía la conducta instrumental motivada', 'Modula la memoria emocional y la toma de decisiones'],
    c: 'Recíprocas con hipocampo, corteza prefrontal medial y orbitofrontal; proyecta al núcleo accumbens y al núcleo central.',
    cl: 'Blanco de modulación noradrenérgica: los betabloqueantes atenúan la consolidación de recuerdos emocionales.'
  },
  basomedial_nucleus_accessory_basal_nucleus: {
    n: 'Núcleo basomedial (basal accesorio)', la: 'Nucleus basalis accessorius', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Componente medial del grupo basolateral.',
    f: ['Integración de información olfatoria, visceral y contextual; regulación de la ansiedad'],
    c: 'Corteza prefrontal medial, hipocampo ventral, hipotálamo, núcleo del lecho de la estría terminal.',
    cl: 'Implicado en la supresión del miedo y la ansiedad por la corteza prefrontal.'
  },
  central_nuclear_group: {
    n: 'Núcleo central de la amígdala', la: 'Nucleus centralis amygdalae', g: 'amigdala', s: 'autonomo', a: 'coroidea',
    d: 'Principal núcleo de salida de la amígdala; neuronas GABAérgicas de tipo estriatal.',
    f: ['Genera las respuestas de miedo: congelamiento (sustancia gris periacueductal), taquicardia e hipertensión (hipotálamo lateral, bulbo), liberación de cortisol (núcleo paraventricular), sobresalto potenciado'],
    c: 'Recibe de los núcleos lateral y basal; proyecta al hipotálamo, sustancia gris periacueductal, núcleo parabraquial, núcleo del tracto solitario y núcleo dorsal del vago.',
    cl: 'Forma con el núcleo del lecho de la estría terminal la «amígdala extendida», clave en la ansiedad y en el estado afectivo negativo de la abstinencia.'
  },
  medial_nucleus: {
    n: 'Núcleo medial de la amígdala', la: 'Nucleus medialis amygdalae', g: 'amigdala', s: 'olfato', a: 'coroidea',
    d: 'Parte del grupo corticomedial, sexualmente dimórfico y rico en receptores de hormonas esteroideas.',
    f: ['Procesamiento de señales olfatorias sociales', 'Conductas reproductivas, agresivas y de defensa'],
    c: 'Recibe del bulbo olfatorio (y accesorio en otras especies); proyecta al hipotálamo medial por la estría terminal.',
    cl: 'Relevancia principalmente experimental.'
  },
  anterior_cortical_nucleus: {
    n: 'Núcleo cortical anterior de la amígdala', la: 'Nucleus corticalis anterior', g: 'amigdala', s: 'olfato', a: 'coroidea',
    d: 'Zona superficial de la amígdala de tipo cortical (grupo corticomedial).',
    f: ['Corteza olfatoria primaria: recibe directamente del bulbo olfatorio; valor emocional de los olores'],
    c: 'Estría olfatoria lateral; conexiones con hipotálamo y corteza piriforme.',
    cl: 'Explica el fuerte vínculo entre olor, emoción y memoria.'
  },
  posterior_cortical_nucleus: {
    n: 'Núcleo cortical posterior de la amígdala', la: 'Nucleus corticalis posterior', g: 'amigdala', s: 'olfato', a: 'coroidea',
    d: 'Porción posterior de la amígdala cortical, en continuidad con el área amigdalohipocampal.',
    f: ['Procesamiento olfatorio y quimiosensorial con significado conductual'],
    c: 'Bulbo olfatorio, corteza entorrinal, hipotálamo.',
    cl: 'Relevancia principalmente experimental.'
  },
  anterior_amygdaloid_area: {
    n: 'Área amigdalina anterior', la: 'Area amygdaloidea anterior', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Zona de transición entre la amígdala y la sustancia innominada / prosencéfalo basal.',
    f: ['Relevo entre amígdala, sistema olfatorio y prosencéfalo basal'],
    c: 'Vía amigdalofugal ventral hacia hipotálamo y tálamo dorsomedial.',
    cl: 'Sin síndrome aislado.'
  },
  amygdalohippocampal_area: {
    n: 'Área amigdalohipocampal', la: 'Area amygdalohippocampalis', g: 'amigdala', s: 'emocion', a: 'coroidea',
    d: 'Zona de transición entre la amígdala posterior y la cabeza del hipocampo.',
    f: ['Intercambio entre amígdala e hipocampo: memoria emocional y conductas neuroendocrinas'],
    c: 'Hipotálamo ventromedial, subículo, núcleo del lecho de la estría terminal.',
    cl: 'Se reseca en la amigdalohipocampectomía para la epilepsia temporal medial.'
  },
  bed_nucleus_of_stria_terminalis: {
    n: 'Núcleo del lecho de la estría terminal', la: 'Nucleus striae terminalis', g: 'pb', s: 'emocion', a: 'lenticulo',
    d: 'Grupo neuronal que acompaña a la estría terminal junto a la comisura anterior; continuación de la amígdala centromedial («amígdala extendida»).',
    f: ['Ansiedad sostenida ante amenazas inciertas o lejanas (a diferencia del miedo fásico de la amígdala)', 'Regulación del eje hipotálamo-hipófiso-suprarrenal', 'Conductas sexualmente dimórficas'],
    c: 'Recibe de amígdala, hipocampo y corteza prefrontal medial; proyecta al hipotálamo (núcleo paraventricular) y tronco encefálico.',
    cl: 'Implicado en trastornos de ansiedad y en la recaída de adicciones inducida por estrés.'
  },
  // ───────────────────────────── Ganglios basales
  head_of_caudate: {
    n: 'Núcleo caudado, cabeza', la: 'Caput nuclei caudati', g: 'gb', s: 'ejecutivo', a: 'lenticulo',
    d: 'Porción anterior voluminosa del caudado; forma la pared lateral del asta anterior del ventrículo lateral. Con el putamen forma el neoestriado, unido a él por puentes de sustancia gris que atraviesan el brazo anterior de la cápsula interna.',
    f: ['Circuitos cognitivo (prefrontal dorsolateral) y oculomotor de los ganglios basales', 'Conducta dirigida a metas, aprendizaje por refuerzo, cambio de estrategia'],
    c: 'Aferencias: corteza prefrontal (glutamato), SNc (dopamina), núcleos intralaminares. Eferencias GABAérgicas: GPi/SNr (vía directa, neuronas D1) y GPe (vía indirecta, neuronas D2).',
    cl: 'Enfermedad de Huntington: atrofia de la cabeza del caudado (astas frontales «en caja») con corea, demencia y trastornos psiquiátricos. Infarto de la arteria recurrente de Heubner: abulia.'
  },
  body_of_caudate: {
    n: 'Núcleo caudado, cuerpo', la: 'Corpus nuclei caudati', g: 'gb', s: 'ejecutivo', a: 'lenticulo',
    d: 'Porción que se arquea sobre el tálamo en el suelo del cuerpo del ventrículo lateral, separada del tálamo por la estría terminal y la vena talamoestriada.',
    f: ['Circuitos asociativos de los ganglios basales: aprendizaje de hábitos y de reglas'],
    c: 'Corteza de asociación parietal y frontal; pálido y sustancia negra.',
    cl: 'Se afecta en la enfermedad de Huntington y en infartos lacunares.'
  },
  tail_of_caudate: {
    n: 'Núcleo caudado, cola', la: 'Cauda nuclei caudati', g: 'gb', s: 'visual', a: 'coroidea',
    d: 'Porción delgada que desciende y avanza en el techo del asta inferior del ventrículo lateral hasta la amígdala.',
    f: ['Circuito visual de los ganglios basales: hábitos visuales, valor estable de los objetos'],
    c: 'Corteza temporal inferior (visual de asociación); SNr.',
    cl: 'Sin síndrome aislado bien definido.'
  },
  putamen: {
    n: 'Putamen', la: 'Putamen', g: 'gb', s: 'motor', a: 'lenticulo',
    d: 'Parte lateral del núcleo lenticular, entre la cápsula externa y el globo pálido. Es la principal estación de entrada del circuito motor de los ganglios basales, con somatotopía.',
    f: ['Circuito motor: selección e inicio del movimiento, escalado de amplitud y velocidad', 'Aprendizaje de habilidades y hábitos motores (memoria procedimental)'],
    c: 'Aferencias: cortezas motora, premotora y somatosensorial (glutamato); SNc (dopamina: D1 excitadora en la vía directa, D2 inhibidora en la indirecta); núcleo centromediano. Eferencias GABA: GPi (directa, con sustancia P/dinorfina) y GPe (indirecta, con encefalina).',
    cl: 'Enfermedad de Parkinson: la pérdida de dopamina afecta primero al putamen posterior (bradicinesia, rigidez). Hemorragia hipertensiva putaminal (arterias lenticuloestriadas): la más frecuente. Enfermedad de Wilson, distonías.'
  },
  posteroventral_putamen: {
    n: 'Putamen posteroventral', la: 'Putamen, pars posteroventralis', g: 'gb', s: 'motor', a: 'lenticulo',
    d: 'Subdivisión sensitivomotora caudal del putamen.',
    f: ['Territorio sensitivomotor del estriado: ejecución de movimientos automatizados'],
    c: 'Corteza motora y somatosensorial primaria; GPi posteroventral.',
    cl: 'Región con mayor denervación dopaminérgica en la enfermedad de Parkinson (visible en DaTSCAN / PET con F-DOPA).'
  },
  nucleus_accumbens: {
    n: 'Núcleo accumbens', la: 'Nucleus accumbens', g: 'gb', s: 'recompensa', a: 'lenticulo',
    d: 'Estriado ventral, donde la cabeza del caudado y el putamen se unen bajo el brazo anterior de la cápsula interna. Subregiones «core» y «shell».',
    f: ['Interfaz límbico-motora: convierte la motivación en acción', 'Recompensa, placer anticipatorio y aprendizaje por refuerzo (error de predicción de recompensa)'],
    c: 'Aferencias: dopamina del área tegmental ventral (vía mesolímbica), glutamato de corteza prefrontal, amígdala e hipocampo. Eferencias: pálido ventral, área tegmental ventral, hipotálamo lateral.',
    cl: 'Sustrato común de las adicciones: todas las drogas de abuso elevan la dopamina en el accumbens. Anhedonia en depresión; blanco de estimulación cerebral profunda en TOC.'
  },
  external_segment_of_globus_pallidus: {
    n: 'Globo pálido externo (GPe)', la: 'Globus pallidus lateralis', g: 'gb', s: 'motor', a: 'lenticulo',
    d: 'Segmento lateral del pálido, separado del putamen por la lámina medular lateral. Neuronas GABAérgicas de descarga tónica rápida.',
    f: ['Eslabón de la vía indirecta: inhibe tónicamente al núcleo subtalámico', 'Al ser inhibido por el estriado (neuronas D2) libera al subtalámico, que excita al GPi y frena el movimiento'],
    c: 'Aferencias: estriado (GABA/encefalina), núcleo subtalámico (glutamato). Eferencias: núcleo subtalámico, GPi, SNr.',
    cl: 'En el Parkinson su actividad disminuye (vía indirecta hiperactiva). Necrosis palidal bilateral en la intoxicación por monóxido de carbono.'
  },
  internal_segment_of_globus_pallidus: {
    n: 'Globo pálido interno (GPi)', la: 'Globus pallidus medialis', g: 'gb', s: 'motor', a: 'coroidea',
    d: 'Segmento medial del pálido. Junto con la sustancia negra reticular es el núcleo de salida de los ganglios basales.',
    f: ['Inhibe tónicamente (GABA) a los núcleos VA/VL del tálamo', 'La vía directa lo inhibe → desinhibe el tálamo → facilita el movimiento; la vía indirecta e hiperdirecta lo excitan → suprimen movimientos competidores'],
    c: 'Eferencias por el asa lenticular y el fascículo lenticular (campos H de Forel) → fascículo talámico → VA/VL; también al núcleo centromediano y al núcleo pedunculopontino.',
    cl: 'Hiperactivo en el Parkinson. Blanco de estimulación cerebral profunda y palidotomía (Parkinson, distonía).'
  },
  claustrum: {
    n: 'Claustro (antemuro)', la: 'Claustrum', g: 'gb', s: 'atencion', a: 'acm',
    d: 'Lámina delgada de sustancia gris entre la cápsula externa (medial) y la cápsula extrema (lateral), bajo la ínsula.',
    f: ['Conexiones recíprocas con casi toda la corteza: se le atribuye la coordinación de la actividad cortical, el control atencional y la sincronización de ondas lentas'],
    c: 'Recíprocas con cortezas prefrontal, cingulada, sensoriales y motoras.',
    cl: 'Función aún debatida; su estimulación eléctrica se ha asociado a alteración reversible de la conciencia.'
  },
  subthalamic_nucleus: {
    n: 'Núcleo subtalámico', la: 'Nucleus subthalamicus', g: 'di.sub', s: 'motor', a: 'perf',
    d: 'Núcleo en forma de lente biconvexa, ventral al tálamo y dorsal a la sustancia negra y al pedúnculo cerebral. Es el único núcleo glutamatérgico (excitador) de los ganglios basales.',
    f: ['Vía indirecta: excita al GPi/SNr y, con ello, frena el movimiento', 'Vía hiperdirecta (corteza → subtalámico): detención rápida de acciones'],
    c: 'Aferencias: GPe (GABA), corteza motora y frontal (hiperdirecta). Eferencias: GPi, SNr, GPe.',
    cl: 'Lesión (infarto lacunar): hemibalismo contralateral. Principal blanco de la estimulación cerebral profunda en la enfermedad de Parkinson.'
  },
  substantia_nigra: {
    n: 'Sustancia negra', la: 'Substantia nigra', g: 'mes', s: 'motor', a: 'perf',
    d: 'Lámina de sustancia gris entre el tegmento mesencefálico y el pie peduncular. Parte compacta (SNc): neuronas dopaminérgicas con neuromelanina (grupo A9). Parte reticular (SNr): neuronas GABAérgicas, homóloga funcional del GPi.',
    f: ['SNc: vía nigroestriada; la dopamina facilita la vía directa (D1) e inhibe la indirecta (D2) → efecto neto facilitador del movimiento; señal de aprendizaje', 'SNr: salida de los ganglios basales hacia tálamo y colículo superior (control de sacadas)'],
    c: 'SNc → estriado. SNr → VA/VL, dorsomedial, colículo superior, núcleo pedunculopontino. Recibe del estriado, subtalámico y pálido.',
    cl: 'Enfermedad de Parkinson: degeneración de la SNc con cuerpos de Lewy (α-sinucleína); síntomas cuando se pierde ~50–60 % de las neuronas. MPTP produce parkinsonismo selectivo.'
  },
  // ───────────────────────────── Prosencéfalo basal y septum
  basal_forebrain: {
    n: 'Prosencéfalo basal (núcleo basal de Meynert)', la: 'Substantia innominata · Nucleus basalis', g: 'pb', s: 'atencion', a: 'aca',
    d: 'Región bajo la comisura anterior y el pálido (sustancia innominada). Incluye el núcleo basal de Meynert, la principal fuente de acetilcolina de la neocorteza, y la banda diagonal de Broca.',
    f: ['Inervación colinérgica difusa de la corteza y la amígdala: atención, activación cortical y plasticidad', 'Promueve el sueño REM y la vigilia'],
    c: 'Recibe de amígdala, hipotálamo y tronco; proyecta a toda la neocorteza (Meynert) y al hipocampo (septum medial y banda diagonal).',
    cl: 'Degeneración temprana en la enfermedad de Alzheimer y la demencia con cuerpos de Lewy: fundamento de los inhibidores de la acetilcolinesterasa (donepezilo, rivastigmina).'
  },
  septal_nuclei: {
    n: 'Núcleos septales', la: 'Nuclei septales', g: 'pb', s: 'memoria', a: 'aca',
    d: 'Núcleos situados delante de la lámina terminal y bajo el septum pellucidum. Núcleo septal medial (colinérgico y GABAérgico) y lateral.',
    f: ['El septum medial genera el ritmo theta del hipocampo, necesario para la codificación de la memoria', 'Septum lateral: recompensa y modulación de la conducta emocional'],
    c: 'Recíprocas con el hipocampo por el fórnix; con el hipotálamo por el haz prosencefálico medial; con la habénula por la estría medular del tálamo.',
    cl: 'Rotura de aneurisma de la arteria comunicante anterior: amnesia con confabulación. En animales su lesión produce «furia septal».'
  },
  // ───────────────────────────── Diencéfalo · Tálamo
  thalamus: {
    n: 'Tálamo', la: 'Thalamus', g: 'di.talamo', s: 'relevo', a: 'perf',
    d: 'Masa ovoide de sustancia gris a cada lado del tercer ventrículo. La lámina medular interna, en forma de «Y», lo divide en grupos anterior, medial y lateral; contiene los núcleos intralaminares. El núcleo reticular lo envuelve lateralmente. Esta malla muestra el volumen talámico general.',
    f: ['Estación de relevo de toda la información sensorial que llega a la corteza (excepto el olfato)', 'Relevo motor desde cerebelo y ganglios basales', 'Regula la activación cortical, el sueño y la conciencia', 'Los núcleos de orden superior (pulvinar, dorsomedial) median la comunicación corticocortical'],
    c: 'Núcleos de relevo específico (VPL, VPM, CGL, CGM, VL, VA), de asociación (dorsomedial, pulvinar, lateral posterior) e inespecíficos (intralaminares, línea media). El núcleo reticular (GABA) no proyecta a la corteza: inhibe a los demás núcleos talámicos.',
    cl: 'Síndrome talámico de Déjerine-Roussy: hemianestesia contralateral seguida de dolor central. Infarto paramediano bilateral (arteria de Percheron): hipersomnia, amnesia y parálisis de la mirada vertical. Insomnio familiar fatal.'
  },
  anterior_nuclear_complex_of_thalamus: {
    n: 'Núcleos anteriores del tálamo', la: 'Nuclei anteriores thalami', g: 'di.talamo', s: 'memoria', a: 'perf',
    d: 'Grupo nuclear en el tubérculo anterior del tálamo, entre las ramas de la lámina medular interna.',
    f: ['Eslabón del circuito de Papez: memoria episódica', 'Células de dirección de la cabeza: orientación espacial'],
    c: 'Aferencias: cuerpo mamilar por el tracto mamilotalámico, y subículo por el fórnix. Eferencias: giro del cíngulo y corteza retroesplenial.',
    cl: 'Lesión: amnesia diencefálica. Blanco de estimulación cerebral profunda en epilepsia refractaria.'
  },
  lateral_dorsal_nucleus_of_thalamus: {
    n: 'Núcleo lateral dorsal', la: 'Nucleus lateralis dorsalis thalami', g: 'di.talamo', s: 'memoria', a: 'perf',
    d: 'Núcleo de la hilera dorsal del grupo lateral; funcionalmente es la continuación caudal de los núcleos anteriores.',
    f: ['Memoria espacial y funciones límbicas'],
    c: 'Hipocampo (fórnix) → cíngulo posterior, corteza retroesplenial y precúneo.',
    cl: 'Se afecta en infartos tuberotalámicos con déficit de memoria.'
  },
  mediodorsal_nucleus_of_thalamus: {
    n: 'Núcleo dorsomedial (mediodorsal)', la: 'Nucleus mediodorsalis thalami', g: 'di.talamo', s: 'ejecutivo', a: 'perf',
    d: 'Gran núcleo medial a la lámina medular interna. Parte magnocelular (medial) y parvocelular (lateral).',
    f: ['Principal relevo talámico de la corteza prefrontal: funciones ejecutivas, memoria de trabajo', 'Integración emocional y olfatoria; memoria'],
    c: 'Aferencias: amígdala, corteza piriforme, pálido ventral, SNr, colículo superior. Proyección recíproca masiva con toda la corteza prefrontal y orbitofrontal.',
    cl: 'Síndrome de Wernicke-Korsakoff (déficit de tiamina): lesión del dorsomedial y de los cuerpos mamilares, con amnesia y confabulación. Infarto paramediano: apatía, síndrome disejecutivo.'
  },
  midline_nuclear_complex: {
    n: 'Núcleos de la línea media del tálamo', la: 'Nuclei mediani thalami', g: 'di.talamo', s: 'vigilia', a: 'perf',
    d: 'Núcleos delgados adyacentes a la pared del tercer ventrículo y en la adhesión intertalámica (paraventricular, paratenial, romboide).',
    f: ['Activación cortical y límbica; relación con el estado visceral, el estrés y la motivación'],
    c: 'Reciben del hipotálamo, tronco (sistema reticular, parabraquial) y proyectan a amígdala, accumbens, hipocampo y corteza prefrontal medial.',
    cl: 'Participan en los cuadros de hipersomnia de los infartos talámicos paramedianos.'
  },
  reuniens_nucleus_medioventral_nucleus_of_thalamus: {
    n: 'Núcleo reuniens', la: 'Nucleus reuniens', g: 'di.talamo', s: 'memoria', a: 'perf',
    d: 'Núcleo ventral de la línea media.',
    f: ['Puente entre la corteza prefrontal medial y el hipocampo: coordina ambas regiones durante la memoria de trabajo espacial y la consolidación'],
    c: 'Recíproco con corteza prefrontal medial; proyecta a CA1 y subículo.',
    cl: 'Interés principalmente experimental (memoria, esquizofrenia).'
  },
  ventral_anterior_nucleus_of_thalamus: {
    n: 'Núcleo ventral anterior (VA)', la: 'Nucleus ventralis anterior thalami', g: 'di.talamo', s: 'motor', a: 'perf',
    d: 'Núcleo más rostral de la hilera ventral.',
    f: ['Relevo motor de los ganglios basales: planificación e inicio del movimiento'],
    c: 'Aferencias: GPi y SNr (GABA, inhibición tónica). Eferencias: cortezas premotora, motora suplementaria y prefrontal.',
    cl: 'Su desinhibición o inhibición excesiva explica, respectivamente, los trastornos hipercinéticos e hipocinéticos.'
  },
  ventral_lateral_nucleus_of_thalamus: {
    n: 'Núcleo ventral lateral (VL)', la: 'Nucleus ventralis lateralis thalami', g: 'di.talamo', s: 'motor', a: 'perf',
    d: 'Núcleo motor principal del tálamo. Su parte anterior (VLo) recibe del pálido; la posterior (VLc/VIM) del cerebelo.',
    f: ['Relevo cerebeloso hacia la corteza motora primaria: coordinación y corrección del movimiento', 'Relevo palidal hacia las cortezas motora y premotora'],
    c: 'Aferencias: núcleos dentado e interpósito contralaterales (pedúnculo cerebeloso superior → tracto dentatotalámico) y GPi. Eferencias: áreas 4 y 6.',
    cl: 'El núcleo ventral intermedio (VIM) es el blanco de la estimulación cerebral profunda y de la talamotomía (incluido el ultrasonido focalizado) para el temblor esencial.'
  },
  ventral_posterior_lateral_nucleus: {
    n: 'Núcleo ventral posterolateral (VPL)', la: 'Nucleus ventralis posterolateralis thalami', g: 'di.talamo', s: 'somato', a: 'perf',
    d: 'Parte lateral del complejo ventral posterior (ventrobasal), con somatotopía: pierna lateral, brazo medial.',
    f: ['Relevo somatosensorial del cuerpo y las extremidades contralaterales: tacto fino, vibración, propiocepción, dolor y temperatura'],
    c: 'Aferencias: lemnisco medial (núcleos grácil y cuneiforme) y tracto espinotalámico. Eferencias: corteza somatosensorial primaria por el brazo posterior de la cápsula interna.',
    cl: 'Infarto lacunar (arterias talamogeniculadas, de la ACP): síndrome sensitivo puro contralateral; posible dolor talámico posterior.'
  },
  ventral_posterior_medial_nucleus: {
    n: 'Núcleo ventral posteromedial (VPM)', la: 'Nucleus ventralis posteromedialis thalami', g: 'di.talamo', s: 'somato', a: 'perf',
    d: 'Parte medial del complejo ventral posterior. Su porción parvocelular (VPMpc) es el relevo gustativo.',
    f: ['Relevo somatosensorial de la cara y la cavidad oral contralaterales', 'VPMpc: gusto (ipsilateral) y sensibilidad visceral'],
    c: 'Aferencias: lemnisco trigeminal (núcleos principal y espinal del trigémino) y núcleo del tracto solitario. Eferencias: representación facial de SI; ínsula y opérculo (gusto).',
    cl: 'Hipoestesia facial contralateral; síndrome queiro-oral (mano y comisura bucal) por la vecindad de ambas representaciones.'
  },
  lateral_posterior_nucleus_of_thalamus: {
    n: 'Núcleo lateral posterior (LP)', la: 'Nucleus lateralis posterior thalami', g: 'di.talamo', s: 'atencion', a: 'perf',
    d: 'Núcleo de asociación de la hilera dorsal, rostral al pulvinar.',
    f: ['Integración sensorial y atención visuoespacial, junto con el pulvinar'],
    c: 'Recíproco con la corteza parietal posterior (áreas 5 y 7); aferencias del colículo superior.',
    cl: 'Su lesión puede contribuir a la negligencia espacial talámica.'
  },
  pulvinar_of_thalamus: {
    n: 'Pulvinar', la: 'Pulvinar thalami', g: 'di.talamo', s: 'atencion', a: 'perf',
    d: 'El mayor núcleo del tálamo humano; forma su polo posterior y sobresale sobre los cuerpos geniculados.',
    f: ['Atención visual selectiva y saliencia', 'Coordina y sincroniza la actividad entre áreas corticales visuales', 'Vía visual extrageniculada: retina → colículo superior → pulvinar → corteza (base de la «visión ciega»)'],
    c: 'Recíproco con cortezas occipital, parietal posterior y temporal; aferencias del colículo superior.',
    cl: 'Negligencia visual y déficit de atención; afasia talámica (pulvinar izquierdo). Signo del pulvinar en la variante de la enfermedad de Creutzfeldt-Jakob.'
  },
  dorsal_lateral_geniculate_nucleus: {
    n: 'Cuerpo geniculado lateral (CGL)', la: 'Corpus geniculatum laterale', g: 'di.talamo', s: 'visual', a: 'coroidea',
    d: 'Relevo talámico de la vía visual. Seis capas: 1–2 magnocelulares (movimiento, contraste), 3–6 parvocelulares (forma, color rojo-verde) e intercaladas koniocelulares (azul-amarillo). Las capas 1, 4 y 6 reciben del ojo contralateral; 2, 3 y 5 del ipsilateral.',
    f: ['Transmite a la corteza la información retiniana del hemicampo visual contralateral, con retinotopía precisa', 'Regula el flujo visual según atención y estado de vigilia'],
    c: 'Aferencias: tracto óptico (células ganglionares) y, mayoritariamente, retroalimentación de la capa VI de V1. Eferencias: radiación óptica → capa IV de V1.',
    cl: 'Lesión: hemianopsia homónima contralateral. Irrigación doble (coroidea anterior y coroidea posterior lateral): sectoranopsias características.'
  },
  medial_geniculate_nuclei: {
    n: 'Cuerpo geniculado medial (CGM)', la: 'Corpus geniculatum mediale', g: 'di.talamo', s: 'auditivo', a: 'perf',
    d: 'Relevo talámico de la vía auditiva, bajo el pulvinar. División ventral tonotópica.',
    f: ['Relevo auditivo hacia la corteza auditiva primaria', 'Su división medial participa en el condicionamiento auditivo del miedo (proyección a la amígdala)'],
    c: 'Aferencias: colículo inferior por su brazo. Eferencias: giro de Heschl por la radiación acústica.',
    cl: 'La lesión unilateral no produce sordera por la bilateralidad de la vía auditiva central.'
  },
  centromedian_nucleus_of_thalamus: {
    n: 'Núcleo centromediano', la: 'Nucleus centromedianus thalami', g: 'di.talamo', s: 'vigilia', a: 'perf',
    d: 'El mayor de los núcleos intralaminares, dentro de la lámina medular interna.',
    f: ['Activación cortical y atención: parte del sistema activador reticular ascendente', 'Circuito tálamo-estriatal: reorientación de la conducta ante estímulos relevantes'],
    c: 'Aferencias: formación reticular, GPi, corteza motora. Eferencias: putamen (masivas) y corteza de forma difusa.',
    cl: 'Blanco de estimulación cerebral profunda en epilepsia generalizada y síndrome de Tourette; se ha ensayado en estados de mínima conciencia.'
  },
  parafascicular_nucleus_of_thalamus: {
    n: 'Núcleo parafascicular', la: 'Nucleus parafascicularis thalami', g: 'di.talamo', s: 'vigilia', a: 'perf',
    d: 'Núcleo intralaminar caudal, alrededor del fascículo retroflexo; forma un complejo con el centromediano.',
    f: ['Proyección tálamo-estriatal al caudado: flexibilidad conductual y atención', 'Componente afectivo-motivacional del dolor (vía espinotalámica medial)'],
    c: 'Aferencias: tracto espinotalámico medial, formación reticular, colículo superior. Eferencias: caudado, cíngulo anterior.',
    cl: 'Degenera, junto al centromediano, en la enfermedad de Parkinson.'
  },
  zona_incerta: {
    n: 'Zona incerta', la: 'Zona incerta', g: 'di.sub', s: 'motor', a: 'perf',
    d: 'Lámina de sustancia gris entre los fascículos talámico (H1) y lenticular (H2), prolongación del núcleo reticular del tálamo.',
    f: ['Núcleo GABAérgico de conexiones muy amplias: integra información sensitivomotora y visceral; regula la transmisión talámica, la locomoción, la ingesta y el dolor'],
    c: 'Corteza, tálamo de orden superior, colículo superior, tronco, médula.',
    cl: 'La zona incerta caudal es blanco alternativo de estimulación cerebral profunda para temblor y Parkinson.'
  },
  // ───────────────────────────── Epitálamo
  habenular_nuclei: {
    n: 'Núcleos habenulares', la: 'Nuclei habenulares', g: 'di.epi', s: 'recompensa', a: 'perf',
    d: 'Pequeños núcleos (medial y lateral) en el trígono habenular, en la pared posterior del tercer ventrículo, delante de la glándula pineal.',
    f: ['Habénula lateral: señal de «anti-recompensa»; se activa ante la ausencia de una recompensa esperada o ante castigos e inhibe a las neuronas dopaminérgicas y serotoninérgicas', 'Habénula medial: aversión y abstinencia de nicotina'],
    c: 'Aferencias por la estría medular del tálamo (septum, pálido, hipotálamo lateral). Eferencias por el fascículo retroflexo → núcleo interpeduncular, área tegmental ventral (vía núcleo rostromedial tegmental), rafe.',
    cl: 'Hiperactividad de la habénula lateral en modelos de depresión; la ketamina la silencia. Blanco experimental de estimulación profunda.'
  },
  pineal_body: {
    n: 'Glándula pineal', la: 'Glandula pinealis (corpus pineale)', g: 'di.epi', s: 'sueno', a: 'acp',
    d: 'Glándula endocrina impar de la línea media, sobre los colículos superiores. Carece de barrera hematoencefálica. Se calcifica con la edad («arena cerebral»).',
    f: ['Secreta melatonina durante la oscuridad: señal circadiana y estacional que favorece el sueño'],
    c: 'Vía: retina → núcleo supraquiasmático → núcleo paraventricular → columna intermediolateral (T1–T2) → ganglio cervical superior → fibras simpáticas posganglionares (noradrenalina) a los pinealocitos.',
    cl: 'Tumores pineales (germinoma, pineocitoma): síndrome de Parinaud por compresión del techo mesencefálico e hidrocefalia obstructiva por compresión del acueducto.'
  },
  // ───────────────────────────── Hipotálamo
  hypothalamus: {
    n: 'Hipotálamo', la: 'Hypothalamus', g: 'di.hipo', s: 'autonomo', a: 'perf',
    d: 'Porción ventral del diencéfalo que forma el suelo y la parte inferior de las paredes del tercer ventrículo, por debajo del surco hipotalámico. Apenas 4 g, pero indispensable para la supervivencia. Esta malla marca el volumen hipotalámico general.',
    f: ['Homeostasis: temperatura, hambre y saciedad, sed y osmolaridad, ritmos circadianos, sueño-vigilia', 'Control endocrino a través de la hipófisis', 'Centro superior del sistema nervioso autónomo', 'Conductas motivadas: reproducción, defensa'],
    c: 'Aferencias: fórnix (hipocampo), estría terminal y vía amigdalofugal (amígdala), haz prosencefálico medial, retina, órganos circunventriculares, núcleo del tracto solitario. Eferencias: hipófisis, tracto mamilotalámico, fascículo longitudinal dorsal y vías hipotalamoespinales a los núcleos autonómicos.',
    cl: 'Diabetes insípida central, SIADH, alteraciones de la termorregulación, obesidad hipotalámica, pubertad precoz. Lesión de las fibras hipotalamoespinales: síndrome de Horner.'
  },
  preoptic_region_of_HTH: {
    n: 'Región preóptica', la: 'Area preoptica', g: 'di.hipo', s: 'autonomo', a: 'aca',
    d: 'Zona más rostral del hipotálamo, junto a la lámina terminal. Incluye los núcleos preóptico medial y ventrolateral (VLPO) y el órgano vasculoso de la lámina terminal.',
    f: ['Termorregulación: neuronas sensibles al calor desencadenan la pérdida de calor; aquí actúan los pirógenos (PGE₂) para producir fiebre', 'VLPO: inicia el sueño inhibiendo (GABA, galanina) los sistemas de vigilia', 'Secreción de GnRH y conducta sexual'],
    c: 'Proyecta a núcleos tuberomamilar, locus cerúleo, rafe (sueño) y a centros autonómicos.',
    cl: 'Lesión: hipertermia; insomnio grave (encefalitis letárgica de von Economo).'
  },
  supraoptic_region_of_HTH: {
    n: 'Región supraóptica (quiasmática)', la: 'Regio supraoptica hypothalami', g: 'di.hipo', s: 'autonomo', a: 'aca',
    d: 'Región hipotalámica anterior, sobre el quiasma óptico. Contiene los núcleos supraóptico, paraventricular, supraquiasmático y anterior.',
    f: ['Núcleos supraóptico y paraventricular: sintetizan vasopresina (ADH) y oxitocina, liberadas en la neurohipófisis', 'Núcleo paraventricular: CRH y TRH; control autonómico descendente', 'Núcleo supraquiasmático: reloj circadiano maestro, sincronizado por la luz', 'Núcleo anterior: disipación de calor'],
    c: 'Tracto supraóptico-hipofisario → neurohipófisis. Tracto retinohipotalámico (células ganglionares con melanopsina) → núcleo supraquiasmático.',
    cl: 'Diabetes insípida central por lesión de los núcleos o del tallo hipofisario (poliuria, polidipsia, orina diluida). Alteraciones del ritmo circadiano.'
  },
  tuberal_region_of_HTH: {
    n: 'Región tuberal', la: 'Regio tuberalis hypothalami', g: 'di.hipo', s: 'autonomo', a: 'perf',
    d: 'Región media del hipotálamo, sobre el túber cinéreo y la eminencia media. Contiene los núcleos arcuato (infundibular), ventromedial, dorsomedial y el área hipotalámica lateral.',
    f: ['Núcleo arcuato: neuronas POMC (saciedad) y NPY/AgRP (hambre), sensibles a leptina, insulina y grelina; libera hormonas hipofisotropas (GHRH, dopamina) al sistema porta', 'Núcleo ventromedial: saciedad', 'Área lateral: hambre; neuronas de orexina/hipocretina que estabilizan la vigilia'],
    c: 'Tracto tuberoinfundibular → sistema porta hipofisario → adenohipófisis.',
    cl: 'Lesión ventromedial: hiperfagia y obesidad. Lesión lateral: afagia y adelgazamiento. Pérdida de neuronas de orexina: narcolepsia tipo 1 con cataplejía. Craneofaringioma.'
  },
  mammillary_region_of_HTH: {
    n: 'Región mamilar (cuerpo mamilar)', la: 'Corpus mammillare', g: 'di.hipo', s: 'memoria', a: 'perf',
    d: 'Región posterior del hipotálamo. Los cuerpos mamilares son dos eminencias redondeadas en la fosa interpeduncular. Incluye el núcleo posterior y el núcleo tuberomamilar (histamina).',
    f: ['Cuerpos mamilares: memoria episódica (circuito de Papez)', 'Núcleo posterior: conservación y producción de calor', 'Núcleo tuberomamilar: única fuente de histamina del encéfalo, promueve la vigilia'],
    c: 'Aferencias: subículo por el fórnix poscomisural. Eferencias: tracto mamilotalámico → núcleos anteriores del tálamo; tracto mamilotegmental.',
    cl: 'Encefalopatía de Wernicke y síndrome de Korsakoff (déficit de tiamina, alcoholismo): hemorragias y atrofia de los cuerpos mamilares. Los antihistamínicos H1 que cruzan la barrera producen somnolencia.'
  },
  mammillothalamic_tract: {
    n: 'Tracto mamilotalámico (de Vicq d\'Azyr)', la: 'Fasciculus mammillothalamicus', g: 'di.hipo', s: 'memoria', a: 'perf',
    d: 'Haz compacto de fibras mielínicas que asciende desde el cuerpo mamilar hasta los núcleos anteriores del tálamo.',
    f: ['Eslabón del circuito de Papez: hipocampo → fórnix → cuerpo mamilar → tálamo anterior → cíngulo → corteza entorrinal → hipocampo'],
    c: 'Cuerpo mamilar → núcleos anteriores del tálamo.',
    cl: 'Su interrupción en infartos talámicos anteriores (arteria tuberotalámica) es el mejor predictor de amnesia.'
  },
  optic_chiasm: {
    n: 'Quiasma óptico', la: 'Chiasma opticum', g: 'di.optico', s: 'visual', a: 'aca',
    d: 'Cruce parcial de los nervios ópticos sobre la silla turca y la hipófisis, delante del infundíbulo. Decusan las fibras de las hemirretinas nasales (campos visuales temporales); las temporales permanecen ipsilaterales.',
    f: ['Reúne en cada tracto óptico la información de todo el hemicampo visual contralateral de ambos ojos'],
    c: 'Nervios ópticos → quiasma → tractos ópticos. Relación superior: núcleo supraquiasmático e hipotálamo; lateral: arterias carótidas internas.',
    cl: 'Compresión central (adenoma hipofisario, craneofaringioma): hemianopsia bitemporal. Compresión lateral (aneurisma carotídeo): hemianopsia nasal ipsilateral.'
  },
  optic_tract: {
    n: 'Tracto óptico', la: 'Tractus opticus', g: 'di.optico', s: 'visual', a: 'coroidea',
    d: 'Continuación posterior del quiasma; rodea el pedúnculo cerebral hasta el cuerpo geniculado lateral. Contiene fibras de la hemirretina temporal ipsilateral y nasal contralateral.',
    f: ['Lleva la información del hemicampo visual contralateral', '~10 % de las fibras siguen al colículo superior, al pretectum (reflejo fotomotor) y al hipotálamo'],
    c: 'Quiasma → cuerpo geniculado lateral (90 %), colículo superior, área pretectal, núcleo supraquiasmático.',
    cl: 'Lesión: hemianopsia homónima contralateral incongruente, con defecto pupilar aferente relativo contralateral.'
  },
  // ───────────────────────────── Mesencéfalo
  superior_colliculus: {
    n: 'Colículo superior', la: 'Colliculus superior', g: 'mes', s: 'visual', a: 'acp',
    d: 'Eminencia rostral del techo (tectum) mesencefálico. Estructura laminada con mapas visual, auditivo y somatosensorial en registro con un mapa motor de sacadas.',
    f: ['Orientación refleja de ojos y cabeza hacia estímulos visuales, auditivos o táctiles', 'Generación de movimientos sacádicos', 'Vía visual extrageniculada'],
    c: 'Aferencias: retina (por el brazo del colículo superior), corteza visual y campo ocular frontal, SNr (inhibición tónica), colículo inferior. Eferencias: formación reticular pontina paramediana, tracto tectoespinal, pulvinar.',
    cl: 'Síndrome mesencefálico dorsal (de Parinaud): parálisis de la mirada vertical hacia arriba, disociación luz-cerca pupilar, nistagmo de convergencia-retracción y retracción palpebral (signo de Collier).'
  },
  inferior_colliculus: {
    n: 'Colículo inferior', la: 'Colliculus inferior', g: 'mes', s: 'auditivo', a: 'sca',
    d: 'Eminencia caudal del techo mesencefálico. Su núcleo central es tonotópico. Bajo él emerge el nervio troclear (IV), único nervio craneal que sale por la cara dorsal.',
    f: ['Relevo obligado de la vía auditiva ascendente: integra las señales de frecuencia, intensidad y localización del sonido', 'Reflejo de sobresalto y orientación auditiva'],
    c: 'Aferencias: lemnisco lateral (núcleos cocleares, complejo olivar superior). Eferencias: brazo del colículo inferior → cuerpo geniculado medial.',
    cl: 'La lesión unilateral apenas altera la audición; dificulta la localización del sonido.'
  },
  pretectal_region: {
    n: 'Área pretectal', la: 'Area pretectalis', g: 'mes', s: 'visual', a: 'acp',
    d: 'Zona de transición entre el diencéfalo y el techo mesencefálico, rostral al colículo superior.',
    f: ['Centro del reflejo fotomotor: recibe de la retina y proyecta bilateralmente a los núcleos de Edinger-Westphal (por eso la respuesta es directa y consensual)', 'Reflejo optocinético'],
    c: 'Retina → núcleo pretectal olivar → (comisura posterior) → Edinger-Westphal bilateral → nervio oculomotor → ganglio ciliar → esfínter de la pupila.',
    cl: 'Pupila de Argyll Robertson (neurosífilis): no reacciona a la luz pero sí a la acomodación. Disociación luz-cerca en el síndrome de Parinaud.'
  },
  midbrain_tegmentum: {
    n: 'Tegmento mesencefálico', la: 'Tegmentum mesencephali', g: 'mes', s: 'vigilia', a: 'basilar',
    d: 'Porción del mesencéfalo ventral al acueducto y dorsal a la sustancia negra. Contiene los núcleos de los nervios III y IV, el núcleo de Edinger-Westphal, la sustancia gris periacueductal, el área tegmental ventral, la formación reticular, el fascículo longitudinal medial y la decusación de los pedúnculos cerebelosos superiores.',
    f: ['Movimientos oculares (III, IV; centro de la mirada vertical: riFLM)', 'Sustancia gris periacueductal: analgesia endógena por opioides, conductas defensivas, micción', 'Área tegmental ventral (A10): dopamina mesolímbica y mesocortical', 'Sistema activador reticular ascendente: vigilia y conciencia'],
    c: 'Lemniscos medial, espinal, trigeminal y lateral ascienden por su parte lateral.',
    cl: 'Síndrome de Weber: parálisis ipsilateral del III + hemiparesia contralateral. Síndrome de Benedikt: III ipsilateral + temblor y ataxia contralaterales (núcleo rojo). Lesiones bilaterales: coma.'
  },
  red_nucleus: {
    n: 'Núcleo rojo', la: 'Nucleus ruber', g: 'mes', s: 'motor', a: 'basilar',
    d: 'Núcleo esférico del tegmento mesencefálico, rosado en fresco por su vascularización y contenido en hierro. Parte parvocelular (predominante en humanos) y magnocelular.',
    f: ['Parte parvocelular: eslabón del triángulo de Guillain-Mollaret (dentado → rojo → oliva inferior → cerebelo): aprendizaje motor', 'Parte magnocelular: tracto rubroespinal, facilita los flexores del miembro superior (escaso en humanos)'],
    c: 'Aferencias: núcleos dentado e interpósito (pedúnculo cerebeloso superior), corteza motora. Eferencias: oliva inferior por el tracto tegmental central; médula por el tracto rubroespinal (cruzado).',
    cl: 'Síndromes de Benedikt y de Claude: temblor rúbrico (de Holmes) y ataxia contralaterales. Postura de decorticación (lesión por encima del núcleo rojo) frente a descerebración (por debajo). Lesión del triángulo: mioclonía palatina.'
  },
  cerebral_peduncle_crus_cerebri: {
    n: 'Pie del pedúnculo cerebral (crus cerebri)', la: 'Crus cerebri', g: 'mes', s: 'motor', a: 'acp',
    d: 'Gruesa columna de fibras descendentes en la parte ventral del mesencéfalo; continuación de la cápsula interna.',
    f: ['Los 3/5 centrales contienen los tractos corticoespinal y corticobulbar, con somatotopía (cara medial, pierna lateral)', 'El quinto medial lleva fibras frontopontinas y el lateral fibras parieto-témporo-occipitopontinas'],
    c: 'Corteza → núcleos motores del tronco, núcleos pontinos y médula espinal.',
    cl: 'Síndrome de Weber (ramas paramedianas de la ACP/basilar). Herniación del uncus: compresión del pedúnculo contralateral contra el tentorio (muesca de Kernohan) → hemiparesia ipsilateral a la lesión, un falso signo localizador.'
  },
  // ───────────────────────────── Puente
  basilar_part_of_pons: {
    n: 'Porción basilar del puente', la: 'Pars basilaris pontis', g: 'pon', s: 'motor', a: 'basilar',
    d: 'Parte ventral y abultada del puente. Contiene los núcleos pontinos, las fibras pontocerebelosas transversas y los fascículos corticoespinales, dispersos en haces. La arteria basilar discurre por su surco anterior.',
    f: ['Núcleos pontinos: relevo de la vía cortico-ponto-cerebelosa, que informa al cerebelo del plan motor (~20 millones de fibras)', 'Paso de los tractos corticoespinal y corticobulbar'],
    c: 'Corteza (frontal, parietal, temporal, occipital) → núcleos pontinos → pedúnculo cerebeloso medio contralateral → corteza cerebelosa.',
    cl: 'Infarto lacunar: hemiparesia motora pura, hemiparesia atáxica o disartria-mano torpe. Lesión bilateral: síndrome de enclaustramiento (conciencia intacta; solo se conservan el parpadeo y la mirada vertical). Mielinólisis central pontina por corrección rápida de la hiponatremia.'
  },
  pontine_tegmentum: {
    n: 'Tegmento pontino', la: 'Tegmentum pontis', g: 'pon', s: 'vigilia', a: 'basilar',
    d: 'Parte dorsal del puente, que forma el suelo del cuarto ventrículo. Contiene los núcleos de los nervios V, VI, VII y VIII, la formación reticular pontina paramediana (centro de la mirada horizontal), el locus cerúleo, los núcleos del rafe, el complejo olivar superior y el fascículo longitudinal medial.',
    f: ['Sensibilidad y motricidad de la cara; mirada horizontal; audición y equilibrio', 'Locus cerúleo: principal fuente de noradrenalina del encéfalo (alerta, atención)', 'Generación del sueño REM y de su atonía (núcleo sublaterodorsal)', 'Centro pontino de la micción (de Barrington); centro neumotáxico'],
    c: 'El lemnisco medial, el espinotalámico y el lateral lo atraviesan. El nervio facial rodea al núcleo del VI formando el colículo facial.',
    cl: 'Síndrome de Millard-Gubler (VI y VII ipsilaterales + hemiparesia contralateral), síndrome de Foville. Oftalmoplejía internuclear por lesión del fascículo longitudinal medial (esclerosis múltiple). Síndrome del uno y medio.'
  },
  middle_cerebellar_peduncle: {
    n: 'Pedúnculo cerebeloso medio', la: 'Pedunculus cerebellaris medius (brachium pontis)', g: 'pon', s: 'cerebelo', a: 'aica',
    d: 'El mayor de los tres pedúnculos cerebelosos; une el puente con el cerebelo. El nervio trigémino emerge por su cara lateral.',
    f: ['Exclusivamente aferente: fibras pontocerebelosas de los núcleos pontinos contralaterales hacia el neocerebelo (fibras musgosas)'],
    c: 'Segundo eslabón de la vía cortico-ponto-cerebelosa.',
    cl: 'Infarto de la AICA: ataxia ipsilateral, con parálisis facial, sordera y vértigo. Signo del pedúnculo medio en el síndrome de temblor-ataxia asociado a X frágil y en la atrofia multisistémica cerebelosa.'
  },
  // ───────────────────────────── Bulbo raquídeo
  pyramidal_part_of_medulla_oblongata: {
    n: 'Pirámide bulbar', la: 'Pyramis medullae oblongatae', g: 'bul', s: 'motor', a: 'vert',
    d: 'Columna longitudinal en la cara ventral del bulbo, a cada lado de la fisura media anterior. Contiene ~1 millón de axones corticoespinales. En el límite con la médula, 85–90 % de las fibras cruzan en la decusación de las pirámides.',
    f: ['Conduce el tracto corticoespinal: las fibras cruzadas forman el tracto corticoespinal lateral (musculatura distal, movimientos finos); las no cruzadas, el tracto corticoespinal anterior (musculatura axial)'],
    c: 'Corteza motora y premotora → cápsula interna → pie peduncular → base del puente → pirámide → médula espinal.',
    cl: 'Síndrome bulbar medial (de Déjerine; arteria espinal anterior o vertebral): hemiparesia contralateral que respeta la cara, pérdida contralateral de tacto fino y propiocepción (lemnisco medial) y parálisis ipsilateral de la lengua (XII).'
  },
  tegmentum_of_medulla_oblongata: {
    n: 'Tegmento bulbar', la: 'Tegmentum medullae oblongatae', g: 'bul', s: 'autonomo', a: 'pica',
    d: 'Porción del bulbo dorsal a las pirámides y las olivas. Contiene los núcleos de los nervios IX, X, XI y XII, el núcleo del tracto solitario, el núcleo ambiguo, el núcleo y tracto espinal del trigémino, los núcleos grácil y cuneiforme, núcleos vestibulares y la formación reticular bulbar.',
    f: ['Centros vitales: generación del ritmo respiratorio (complejo pre-Bötzinger) y control cardiovascular (bulbo ventrolateral rostral, barorreflejo)', 'Deglución, tos, vómito (área postrema), fonación', 'Relevo del tacto fino y la propiocepción (núcleos grácil y cuneiforme → lemnisco medial)'],
    c: 'Núcleo del tracto solitario: aferencias viscerales y gustativas (VII, IX, X). Núcleo ambiguo: motoneuronas de faringe y laringe. Núcleo dorsal del vago: parasimpático preganglionar.',
    cl: 'Síndrome bulbar lateral (de Wallenberg; PICA o arteria vertebral): vértigo, disfagia y disfonía, síndrome de Horner y ataxia ipsilaterales, analgesia facial ipsilateral y del hemicuerpo contralateral. Herniación amigdalina: paro respiratorio.'
  },
  inferior_olive: {
    n: 'Núcleo olivar inferior', la: 'Nucleus olivaris inferior', g: 'bul', s: 'cerebelo', a: 'vert',
    d: 'Lámina de sustancia gris plegada como una bolsa arrugada, con el hilio hacia medial; forma la eminencia de la oliva en la cara lateral del bulbo. Sus neuronas están acopladas por uniones gap.',
    f: ['Única fuente de las fibras trepadoras: cada célula de Purkinje recibe una sola, que produce espigas complejas', 'Señal de error y de temporización para el aprendizaje motor cerebeloso (depresión a largo plazo de la sinapsis fibra paralela–Purkinje)'],
    c: 'Aferencias: núcleo rojo parvocelular (tracto tegmental central), médula (espino-olivar), corteza. Eferencias: fibras olivocerebelosas cruzadas por el pedúnculo cerebeloso inferior.',
    cl: 'Degeneración olivar hipertrófica con mioclonía (temblor) palatina tras lesiones del triángulo de Guillain-Mollaret. Se afecta en la atrofia olivopontocerebelosa.'
  },
  inferior_cerebellar_peduncle: {
    n: 'Pedúnculo cerebeloso inferior', la: 'Pedunculus cerebellaris inferior (corpus restiforme)', g: 'bul', s: 'cerebelo', a: 'pica',
    d: 'Une el bulbo con el cerebelo. Incluye el cuerpo restiforme (aferente) y el cuerpo yuxtarrestiforme (conexiones vestibulocerebelosas en ambos sentidos).',
    f: ['Lleva al cerebelo información propioceptiva y vestibular y las fibras trepadoras'],
    c: 'Aferencias: tracto espinocerebeloso posterior, cuneocerebeloso, olivocerebeloso, vestibulocerebeloso, reticulocerebeloso. Eferencias: del núcleo fastigio y el flóculo a los núcleos vestibulares y la formación reticular.',
    cl: 'Lesión (síndrome de Wallenberg): ataxia de las extremidades ipsilaterales y lateropulsión.'
  },
  central_canal_of_medulla_oblongata: {
    n: 'Conducto central del bulbo', la: 'Canalis centralis', g: 'ven', s: 'lcr', a: 'vert',
    d: 'Continuación rostral del conducto ependimario de la médula espinal en la porción cerrada del bulbo; se abre en el cuarto ventrículo a nivel del óbex.',
    f: ['Vestigio de la luz del tubo neural, tapizado por epéndimo'],
    c: 'Cuarto ventrículo ↔ conducto central de la médula.',
    cl: 'Siringobulbia y siringomielia: cavitación que daña las fibras que cruzan en la comisura blanca anterior (pérdida disociada de dolor y temperatura «en capa»).'
  },
  // ───────────────────────────── Cerebelo
  cerebellar_vermis: {
    n: 'Vermis cerebeloso', la: 'Vermis cerebelli', g: 'cb', s: 'cerebelo', a: 'sca',
    d: 'Porción media e impar del cerebelo. Con los flóculos (lóbulo floculonodular, vestibulocerebelo) y la zona paravermiana forma el espinocerebelo. Proyecta al núcleo fastigio.',
    f: ['Control de la musculatura axial y proximal: postura, equilibrio y marcha', 'Coordinación de los movimientos oculares (vermis oculomotor) y del habla', 'Nódulo y flóculo: reflejo vestibuloocular, equilibrio'],
    c: 'Aferencias: tractos espinocerebelosos (tronco), núcleos vestibulares, vías visual y auditiva. Eferencias: núcleo fastigio → núcleos vestibulares y formación reticular → tractos vestibuloespinal y reticuloespinal.',
    cl: 'Ataxia troncal y de la marcha con base amplia. Degeneración alcohólica del vermis anterior. Meduloblastoma del vermis en niños. Síndrome floculonodular: desequilibrio, nistagmo.'
  },
  paravermis_of_cerebellum: {
    n: 'Zona paravermiana (intermedia)', la: 'Pars intermedia hemispherii cerebelli', g: 'cb', s: 'cerebelo', a: 'sca',
    d: 'Franja longitudinal de corteza cerebelosa a cada lado del vermis. Parte del espinocerebelo; proyecta a los núcleos interpósitos (globoso y emboliforme).',
    f: ['Compara la orden motora con el movimiento en curso y corrige errores de las extremidades', 'Regula el tono y la coordinación entre agonistas y antagonistas'],
    c: 'Aferencias: tractos espinocerebelosos posterior y anterior, cuneocerebeloso. Eferencias: núcleo interpósito → núcleo rojo magnocelular y VL → corteza motora.',
    cl: 'Temblor de intención y dismetría de las extremidades ipsilaterales.'
  },
  lateral_hemisphere_of_cerebellum: {
    n: 'Hemisferio cerebeloso lateral', la: 'Hemispherium cerebelli', g: 'cb', s: 'cerebelo', a: 'pica',
    d: 'Porción lateral, la más desarrollada en el ser humano (cerebrocerebelo o neocerebelo). Lóbulo anterior y posterior separados por la fisura primaria; láminas (folia) transversales. Proyecta al núcleo dentado.',
    f: ['Planificación, temporización y aprendizaje de movimientos complejos y precisos', 'Funciones cognitivas y lingüísticas (lóbulo posterior: Crus I y II)', 'Cada hemisferio controla el lado IPSILATERAL del cuerpo (doble cruce: decusación del pedúnculo superior y decusación piramidal)'],
    c: 'Aferencias: corteza cerebral → núcleos pontinos → pedúnculo cerebeloso medio. Eferencias: células de Purkinje (GABA) → núcleo dentado → pedúnculo cerebeloso superior → VL del tálamo contralateral → corteza motora y premotora.',
    cl: 'Síndrome hemisférico ipsilateral: dismetría, disdiadococinesia, temblor de intención, descomposición del movimiento, hipotonía, disartria escandida. Síndrome cognitivo-afectivo cerebeloso (Schmahmann).'
  },
  cerebellar_deep_nuclei: {
    n: 'Núcleos cerebelosos profundos', la: 'Nuclei cerebelli', g: 'cb', s: 'cerebelo', a: 'sca',
    d: 'Cuatro pares de núcleos en la sustancia blanca cerebelosa; de lateral a medial: dentado, emboliforme, globoso y fastigio. Son la salida del cerebelo (salvo la proyección directa del flóculo a los núcleos vestibulares).',
    f: ['Dentado: recibe del hemisferio lateral; planificación e inicio del movimiento', 'Interpósitos (emboliforme y globoso): zona paravermiana; corrección del movimiento en curso', 'Fastigio: vermis; postura, equilibrio y movimientos oculares'],
    c: 'Reciben inhibición (GABA) de las células de Purkinje y excitación de colaterales de las fibras musgosas y trepadoras. Eferencias: pedúnculo cerebeloso superior (dentado, interpósitos) y cuerpo yuxtarrestiforme (fastigio).',
    cl: 'La lesión de los núcleos profundos produce déficits más graves y duraderos que la de la corteza cerebelosa.'
  },
  superior_cerebellar_peduncle_brachium_conjunctivum: {
    n: 'Pedúnculo cerebeloso superior', la: 'Pedunculus cerebellaris superior (brachium conjunctivum)', g: 'cb', s: 'cerebelo', a: 'sca',
    d: 'Une el cerebelo con el mesencéfalo y forma la pared lateral de la parte superior del cuarto ventrículo. Sus fibras decusan en el tegmento del mesencéfalo caudal.',
    f: ['Principal vía eferente del cerebelo'],
    c: 'Eferencias: tractos dentatotalámico (→ VL) y dentatorrúbrico, cruzados. Aferencias: tracto espinocerebeloso anterior y fibras tectocerebelosas.',
    cl: 'Lesión antes de la decusación: ataxia ipsilateral; después de ella: ataxia contralateral. Temblor rúbrico.'
  },
  white_matter_of_hindbrain: {
    n: 'Sustancia blanca del cerebelo y del tronco', la: 'Corpus medullare cerebelli · Arbor vitae', g: 'cb', s: 'conexion', a: 'sca',
    d: 'Núcleo de sustancia blanca del cerebelo, cuyas ramificaciones en las láminas dibujan el «árbol de la vida» en el corte sagital, y haces de sustancia blanca del tronco encefálico.',
    f: ['Contiene las fibras aferentes (musgosas y trepadoras) y los axones de las células de Purkinje hacia los núcleos profundos', 'En el tronco: lemnisco medial, fascículo longitudinal medial, tractos espinotalámico y tegmental central'],
    c: 'Une la corteza cerebelosa con los núcleos profundos y los tres pedúnculos.',
    cl: 'Placas de esclerosis múltiple en los pedúnculos cerebelosos: ataxia, temblor y oftalmoplejía internuclear.'
  },
  // ───────────────────────────── Sistema ventricular
  anterior_horn_of_lateral_ventricle: {
    n: 'Ventrículo lateral, asta anterior (frontal)', la: 'Cornu frontale ventriculi lateralis', g: 'ven', s: 'lcr', a: 'coroidea',
    d: 'Porción del ventrículo lateral por delante del foramen interventricular (de Monro). Límites: techo y pared anterior, cuerpo calloso; pared medial, septum pellucidum; pared lateral, cabeza del caudado. No contiene plexo coroideo.',
    f: ['Contiene líquido cefalorraquídeo (LCR), que pasa al tercer ventrículo por el foramen interventricular'],
    c: 'Circulación del LCR: ventrículos laterales → forámenes de Monro → tercer ventrículo → acueducto → cuarto ventrículo → aberturas de Magendie y Luschka → espacio subaracnoideo → granulaciones aracnoideas → senos venosos.',
    cl: 'Dilatación «en caja» en la enfermedad de Huntington. Quiste coloide en el foramen de Monro: hidrocefalia obstructiva aguda, cefalea posicional.'
  },
  body_of_lateral_ventricle: {
    n: 'Ventrículo lateral, cuerpo', la: 'Pars centralis ventriculi lateralis', g: 'ven', s: 'lcr', a: 'coroidea',
    d: 'Porción central, desde el foramen interventricular hasta el atrio. Techo: cuerpo calloso; suelo: tálamo, cuerpo del caudado, estría terminal, plexo coroideo y fórnix.',
    f: ['El plexo coroideo produce LCR (~500 mL/día; volumen total ~150 mL, que se renueva 3–4 veces al día)'],
    c: 'Se continúa con el asta anterior y con el atrio.',
    cl: 'Hidrocefalia normotensiva (tríada de Hakim-Adams): alteración de la marcha, demencia e incontinencia urinaria. Hemorragia de la matriz germinal en prematuros.'
  },
  atrium_of_lateral_ventricle: {
    n: 'Ventrículo lateral, atrio (trígono)', la: 'Atrium ventriculi lateralis', g: 'ven', s: 'lcr', a: 'coroidea',
    d: 'Zona de confluencia del cuerpo con las astas posterior e inferior. Contiene el glomus coroideo, la porción más voluminosa del plexo coroideo, a menudo calcificada.',
    f: ['Producción de LCR'],
    c: 'Comunica cuerpo, asta occipital y asta temporal.',
    cl: 'Localización típica de los meningiomas intraventriculares. El glomus calcificado es una referencia radiológica.'
  },
  posterior_horn_of_lateral_ventricle: {
    n: 'Ventrículo lateral, asta posterior (occipital)', la: 'Cornu occipitale ventriculi lateralis', g: 'ven', s: 'lcr', a: 'acp',
    d: 'Prolongación del ventrículo dentro del lóbulo occipital. En su pared medial sobresalen el bulbo del asta posterior (fórceps mayor) y el calcar avis (surco calcarino). Sin plexo coroideo.',
    f: ['Contiene LCR'],
    c: 'Rodeada por la radiación óptica y el tapetum del cuerpo calloso.',
    cl: 'Colpocefalia (dilatación desproporcionada) en la agenesia del cuerpo calloso.'
  },
  inferior_horn_of_lateral_ventricle: {
    n: 'Ventrículo lateral, asta inferior (temporal)', la: 'Cornu temporale ventriculi lateralis', g: 'ven', s: 'lcr', a: 'coroidea',
    d: 'Prolongación del ventrículo dentro del lóbulo temporal. Suelo: hipocampo y eminencia colateral; techo: cola del caudado y estría terminal; extremo anterior: amígdala.',
    f: ['Contiene LCR y plexo coroideo (fisura coroidea)'],
    c: 'El asa de Meyer rodea su techo y pared lateral.',
    cl: 'Su dilatación es signo temprano de hidrocefalia y de atrofia hipocampal (enfermedad de Alzheimer).'
  },
  third_ventricle: {
    n: 'Tercer ventrículo', la: 'Ventriculus tertius', g: 'ven', s: 'lcr', a: 'perf',
    d: 'Cavidad media en forma de hendidura entre los dos tálamos y los hipotálamos. Recesos: óptico, infundibular, pineal y suprapineal. Techo: tela coroidea con plexo coroideo; pared anterior: lámina terminal.',
    f: ['Recibe el LCR de los ventrículos laterales y lo conduce al acueducto', 'En sus paredes se ubican órganos circunventriculares, sin barrera hematoencefálica (órgano subfornical, OVLT)'],
    c: 'Forámenes interventriculares → tercer ventrículo → acueducto cerebral.',
    cl: 'Ventriculostomía endoscópica del suelo del tercer ventrículo para tratar la hidrocefalia obstructiva.'
  },
  cerebral_aqueduct: {
    n: 'Acueducto cerebral (de Silvio)', la: 'Aqueductus mesencephali', g: 'ven', s: 'lcr', a: 'acp',
    d: 'Conducto de ~15 mm de largo y 1–2 mm de diámetro que atraviesa el mesencéfalo, rodeado por la sustancia gris periacueductal. Es el punto más estrecho del sistema ventricular.',
    f: ['Comunica el tercer ventrículo con el cuarto'],
    c: 'Separa el techo (tectum) del tegmento.',
    cl: 'Estenosis del acueducto (congénita, tumor pineal o tectal): hidrocefalia obstructiva triventricular.'
  },
  fourth_ventricle: {
    n: 'Cuarto ventrículo', la: 'Ventriculus quartus', g: 'ven', s: 'lcr', a: 'pica',
    d: 'Cavidad romboidal entre el puente y el bulbo (suelo: fosa romboidea) y el cerebelo (techo: velos medulares). En su suelo: colículo facial, trígonos del hipogloso y del vago, área postrema y estrías medulares.',
    f: ['El LCR sale al espacio subaracnoideo por la abertura media (de Magendie) hacia la cisterna magna y las dos aberturas laterales (de Luschka) hacia las cisternas pontocerebelosas'],
    c: 'Acueducto → cuarto ventrículo → espacio subaracnoideo y conducto central.',
    cl: 'Meduloblastoma y ependimoma del cuarto ventrículo: hidrocefalia obstructiva y vómitos por irritación del área postrema. Malformación de Dandy-Walker.'
  },
};
