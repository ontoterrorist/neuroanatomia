// Vías y circuitos funcionales trazados sobre el modelo 3D.
// Un punto es: 'id_de_malla' (su centroide) | p(id, lado, m, v, a) (posición dentro de la caja de la malla:
// m 0 medial … 1 lateral · v 0 inferior … 1 superior · a 0 posterior … 1 anterior) | [x, y, z] en cm.
// Recordatorio: L = izquierda del sujeto (+x). Cada vía se describe partiendo de un lado concreto.
const p = (id, S, m, v, a) => ({ en: id + '_' + S, f: [S === 'L' ? m : 1 - m, v, a] });
const mid = (id, m, v, a) => ({ en: id, f: [m, v, a] });   // mallas de línea media: m = fracción en x
const GLU = '#6fd08c', GABA = '#ef6b62', DA = '#b58cf0', NA = '#5db7e8', HT = '#f2c14e', ACH = '#f08fc0', N1 = '#f2c14e', N2 = '#5db7e8', N3 = '#f08fc0', MS = '#ef6b62', MI = '#f6a560';
/** punto dentro de un segmento medular: m 0 centro … 1 borde lateral · a 0 posterior … 1 anterior */
const cord = (seg, S, m, a) => ({ en: 'me_' + seg, f: [S === 'L' ? 0.5 + m * 0.42 : 0.5 - m * 0.42, 0.5, a] });
const sube = (S, m, a, segs) => segs.map(s => cord(s, S, m, a));
const SEG_UP = ['L5', 'L3', 'L1', 'T11', 'T9', 'T7', 'T5', 'T3', 'T1', 'C7', 'C5', 'C3', 'C1'];

export const GRUPOS_VIAS = [['motor', 'Sistemas motores'], ['somato', 'Somatosensorial y dolor'], ['sentidos', 'Sentidos especiales'], ['reflejos', 'Reflejos'], ['limbico', 'Memoria, emoción y lenguaje'], ['modul', 'Sistemas moduladores y autónomo'], ['lcr', 'Líquido cefalorraquídeo']];

export const VIAS = [
  // ───────────────────────────────────────────── motor
  { id: 'corticoespinal', g: 'motor', n: 'Vía corticoespinal (piramidal)', sub: 'Movimiento voluntario fino de las extremidades',
    res: 'Dos neuronas llevan la orden motora desde la corteza hasta el músculo. La motoneurona superior nace en la corteza motora y cruza al lado opuesto en la decusación de las pirámides; la motoneurona inferior sale del asta anterior de la médula. Se muestra la vía desde el hemisferio izquierdo hasta la mano derecha.',
    solidos: ['primary_motor_cortex', 'capsula_interna', 'cerebral_peduncle_crus_cerebri', 'basilar_part_of_pons', 'pyramidal_part_of_medulla_oblongata'], capas: { medula: 2, columna: 0, esqueleto: 2 },
    tramos: [
      { n: 'Motoneurona superior', col: MS, pts: [p('primary_motor_cortex', 'L', 0.75, 0.72, 0.5), p('white_matter_of_forebrain', 'L', 0.52, 0.72, 0.42), p('capsula_interna', 'L', 0.45, 0.45, 0.22), p('cerebral_peduncle_crus_cerebri', 'L', 0.5, 0.5, 0.6), p('basilar_part_of_pons', 'L', 0.35, 0.5, 0.6), p('pyramidal_part_of_medulla_oblongata', 'L', 0.5, 0.6, 0.6), p('pyramidal_part_of_medulla_oblongata', 'L', 0.2, 0.05, 0.5), cord('C1', 'R', 0.55, 0.4), ...sube('R', 0.6, 0.38, ['C3', 'C5', 'C7']), cord('C8', 'R', 0.35, 0.7)] },
      { n: 'Motoneurona inferior', col: MI, pts: [cord('C8', 'R', 0.35, 0.7), p('ne_C8', 'R', 0.8, 0.3, 0.5), 'plexo_braquial_R', p('humero', 'R', 0.2, 0.55, 0.6), p('cubito', 'R', 0.5, 0.6, 0.6), p('mano', 'R', 0.5, 0.75, 0.5)] }],
    pasos: [
      { t: 'Corteza motora primaria', d: 'Las células piramidales de la capa V (entre ellas las gigantes de Betz) del giro precentral originan cerca del 40 % de las fibras; el resto procede de las áreas premotora, motora suplementaria y somatosensorial.', en: p('primary_motor_cortex', 'L', 0.75, 0.72, 0.5) },
      { t: 'Corona radiada y cápsula interna', d: 'Las fibras convergen en el brazo posterior de la cápsula interna, con somatotopía: cara (rodilla), brazo y pierna de anterior a posterior. Aquí un infarto lacunar pequeño produce una hemiparesia completa.', en: p('capsula_interna', 'L', 0.45, 0.45, 0.22) },
      { t: 'Pie del pedúnculo cerebral', d: 'Ocupan los tres quintos centrales del pedúnculo, flanqueadas por las fibras corticopontinas.', en: 'cerebral_peduncle_crus_cerebri_L' },
      { t: 'Base del puente', d: 'El tracto se dispersa en fascículos entre los núcleos pontinos y las fibras pontocerebelosas transversas.', en: 'basilar_part_of_pons_L' },
      { t: 'Pirámide bulbar', d: 'Las fibras vuelven a reunirse y forman la pirámide: de ahí el nombre de vía piramidal.', en: 'pyramidal_part_of_medulla_oblongata_L' },
      { t: 'Decusación de las pirámides', d: 'En la unión bulbomedular, 85–90 % de las fibras cruzan la línea media. Por eso una lesión por encima de este punto causa déficit contralateral, y una por debajo, ipsilateral.', en: cord('C1', 'R', 0.2, 0.5) },
      { t: 'Tracto corticoespinal lateral', d: 'Desciende por el cordón lateral de la médula (fibras del brazo mediales, de la pierna laterales). Las fibras que no cruzaron forman el tracto corticoespinal anterior, para la musculatura axial.', en: cord('C5', 'R', 0.6, 0.38) },
      { t: 'Asta anterior', d: 'Sinapsis (glutamato) con la motoneurona α, directamente o a través de interneuronas. Las conexiones monosinápticas directas son la base de los movimientos fraccionados de los dedos.', en: cord('C8', 'R', 0.35, 0.7) },
      { t: 'Motoneurona inferior y músculo', d: 'Su axón sale por la raíz anterior, recorre el plexo braquial y el nervio periférico, y libera acetilcolina en la placa motora.', en: p('mano', 'R', 0.5, 0.75, 0.5) }],
    clin: 'Lesión de motoneurona superior: paresia, espasticidad, hiperreflexia, clonus y signo de Babinski, sin atrofia marcada. Lesión de motoneurona inferior: parálisis flácida, arreflexia, atrofia y fasciculaciones. La ELA combina ambas.' },

  { id: 'corticobulbar', g: 'motor', n: 'Vía corticobulbar del nervio facial', sub: 'Por qué la parálisis central respeta la frente',
    res: 'Las motoneuronas faciales que inervan la mitad inferior de la cara reciben órdenes solo del hemisferio contralateral; las de la mitad superior (frontal, orbicular de los párpados), de ambos hemisferios.',
    solidos: ['primary_motor_cortex', 'pontine_tegmentum', 'n_facial'], capas: { craneales: 1, craneo: 2 },
    tramos: [
      { n: 'Corteza izquierda → núcleo facial derecho (cara inferior y superior)', col: MS, pts: [p('primary_motor_cortex', 'L', 0.92, 0.25, 0.6), p('capsula_interna', 'L', 0.5, 0.5, 0.45), p('cerebral_peduncle_crus_cerebri', 'L', 0.3, 0.5, 0.6), p('basilar_part_of_pons', 'L', 0.2, 0.5, 0.5), p('pontine_tegmentum', 'R', 0.55, 0.12, 0.5)] },
      { n: 'Corteza izquierda → núcleo facial izquierdo (solo cara superior)', col: '#f4b0a8', pts: [p('basilar_part_of_pons', 'L', 0.2, 0.5, 0.5), p('pontine_tegmentum', 'L', 0.55, 0.12, 0.5)] },
      { n: 'Nervio facial derecho', col: MI, pts: [p('pontine_tegmentum', 'R', 0.55, 0.12, 0.5), p('pontine_tegmentum', 'R', 0.12, 0.2, 0.15), p('n_facial', 'R', 0.05, 0.75, 0.25), p('n_facial', 'R', 0.55, 0.6, 0.2), p('n_facial', 'R', 0.6, 0.3, 0.6)] },
      { n: 'Nervio facial izquierdo', col: MI, pts: [p('pontine_tegmentum', 'L', 0.55, 0.12, 0.5), p('pontine_tegmentum', 'L', 0.12, 0.2, 0.15), p('n_facial', 'L', 0.05, 0.75, 0.25), p('n_facial', 'L', 0.55, 0.6, 0.2), p('n_facial', 'L', 0.6, 0.3, 0.6)] }],
    pasos: [
      { t: 'Área de la cara', d: 'Parte inferolateral del giro precentral, irrigada por la arteria cerebral media.', en: p('primary_motor_cortex', 'L', 0.92, 0.25, 0.6) },
      { t: 'Rodilla de la cápsula interna', d: 'Las fibras corticobulbares (corticonucleares) pasan por la rodilla, delante de las corticoespinales.', en: p('capsula_interna', 'L', 0.5, 0.5, 0.45) },
      { t: 'Núcleo motor del facial', d: 'En el tegmento pontino caudal. Su porción dorsal (músculos de la frente) recibe fibras de los dos hemisferios; la ventral (boca), solo del contralateral.', en: p('pontine_tegmentum', 'R', 0.55, 0.12, 0.5) },
      { t: 'Rodilla interna del facial', d: 'Los axones rodean por detrás al núcleo del abducens (colículo facial) antes de salir por el ángulo pontocerebeloso.', en: p('pontine_tegmentum', 'R', 0.12, 0.2, 0.15) },
      { t: 'Nervio facial', d: 'Conducto auditivo interno → conducto del facial → foramen estilomastoideo → cinco ramas en la parótida.', en: p('n_facial', 'R', 0.6, 0.3, 0.6) }],
    clin: 'Lesión supranuclear (ictus): parálisis de la mitad inferior de la hemicara contralateral; el paciente puede arrugar la frente y cerrar el ojo. Lesión del núcleo o del nervio (parálisis de Bell): parálisis de toda la hemicara ipsilateral.' },

  { id: 'ganglios', g: 'motor', n: 'Circuito motor de los ganglios basales', sub: 'Vías directa, indirecta e hiperdirecta',
    res: 'Los ganglios basales no inician el movimiento: lo autorizan. Su salida (GPi y sustancia negra reticular) inhibe tónicamente al tálamo. La vía directa retira ese freno; la indirecta y la hiperdirecta lo refuerzan. Verde = glutamato (excita), rojo = GABA (inhibe), violeta = dopamina.',
    solidos: ['putamen', 'external_segment_of_globus_pallidus', 'internal_segment_of_globus_pallidus', 'subthalamic_nucleus', 'substantia_nigra', 'ventral_lateral_nucleus_of_thalamus', 'primary_motor_cortex'], lado: 'L', dir: [0.25, 0.25, 1],
    tramos: [
      { n: 'Corteza → putamen (glutamato)', col: GLU, pts: [p('primary_motor_cortex', 'L', 0.6, 0.6, 0.5), p('white_matter_of_forebrain', 'L', 0.6, 0.62, 0.5), 'putamen_L'] },
      { n: 'Sustancia negra compacta → putamen (dopamina)', col: DA, pts: ['substantia_nigra_L', p('capsula_interna', 'L', 0.5, 0.15, 0.4), p('putamen', 'L', 0.4, 0.2, 0.4)] },
      { n: 'Vía directa: putamen → GPi (GABA)', col: GABA, pts: ['putamen_L', p('external_segment_of_globus_pallidus', 'L', 0.5, 0.25, 0.5), 'internal_segment_of_globus_pallidus_L'] },
      { n: 'Vía indirecta: putamen → GPe (GABA)', col: '#f09a94', pts: [p('putamen', 'L', 0.5, 0.75, 0.6), p('external_segment_of_globus_pallidus', 'L', 0.5, 0.7, 0.6)] },
      { n: 'GPe → núcleo subtalámico (GABA)', col: '#f09a94', pts: [p('external_segment_of_globus_pallidus', 'L', 0.5, 0.7, 0.6), p('capsula_interna', 'L', 0.35, 0.2, 0.35), 'subthalamic_nucleus_L'] },
      { n: 'Subtalámico → GPi (glutamato)', col: '#a8e6b8', pts: ['subthalamic_nucleus_L', p('internal_segment_of_globus_pallidus', 'L', 0.4, 0.3, 0.4)] },
      { n: 'Vía hiperdirecta: corteza → subtalámico', col: '#a8e6b8', pts: [p('primary_motor_cortex', 'L', 0.45, 0.7, 0.5), p('capsula_interna', 'L', 0.4, 0.55, 0.3), 'subthalamic_nucleus_L'] },
      { n: 'GPi → tálamo VA/VL (GABA, freno tónico)', col: GABA, pts: ['internal_segment_of_globus_pallidus_L', p('zona_incerta', 'L', 0.5, 0.5, 0.6), 'ventral_lateral_nucleus_of_thalamus_L'] },
      { n: 'Tálamo → corteza motora (glutamato)', col: GLU, pts: ['ventral_lateral_nucleus_of_thalamus_L', p('capsula_interna', 'L', 0.4, 0.85, 0.4), p('white_matter_of_forebrain', 'L', 0.45, 0.72, 0.5), p('primary_motor_cortex', 'L', 0.5, 0.65, 0.5)] }],
    pasos: [
      { t: 'Entrada: el estriado', d: 'La corteza excita a las neuronas espinosas medianas del putamen. Hay dos poblaciones: las que expresan receptores D1 (vía directa) y las que expresan D2 (vía indirecta).', en: 'putamen_L' },
      { t: 'Vía directa: «adelante»', d: 'Putamen (D1) ⊣ GPi ⊣ tálamo. Dos inhibiciones seguidas equivalen a una desinhibición: el tálamo queda libre para excitar la corteza y el movimiento elegido se facilita.', en: 'internal_segment_of_globus_pallidus_L' },
      { t: 'Vía indirecta: «alto»', d: 'Putamen (D2) ⊣ GPe ⊣ subtalámico → GPi ⊣ tálamo. Al liberar al núcleo subtalámico aumenta la inhibición del tálamo y se suprimen los movimientos que compiten.', en: 'subthalamic_nucleus_L' },
      { t: 'Vía hiperdirecta: freno de emergencia', d: 'La corteza excita directamente al núcleo subtalámico y detiene con rapidez una acción ya iniciada.', en: 'subthalamic_nucleus_L' },
      { t: 'Dopamina: el modulador', d: 'La dopamina nigroestriada excita la vía directa (D1, Gs) e inhibe la indirecta (D2, Gi). El efecto neto es facilitar el movimiento. Además codifica el error de predicción de la recompensa y refuerza las sinapsis corticoestriatales.', en: 'substantia_nigra_L' },
      { t: 'Salida: tálamo y corteza', d: 'El GPi proyecta por el asa y el fascículo lenticulares a los núcleos VA/VL, que cierran el circuito sobre las áreas motora suplementaria, premotora y motora.', en: 'ventral_lateral_nucleus_of_thalamus_L' }],
    clin: 'Parkinson (pérdida de dopamina): la vía directa se debilita y la indirecta se refuerza → GPi hiperactivo → bradicinesia y rigidez. Huntington (degeneran primero las neuronas D2 de la vía indirecta) → corea. Lesión del núcleo subtalámico → hemibalismo contralateral. La estimulación cerebral profunda del subtalámico o del GPi normaliza la salida.' },

  { id: 'cerebelo', g: 'motor', n: 'Circuito cerebrocerebeloso', sub: 'Cortico-ponto-cerebeloso y dentato-tálamo-cortical',
    res: 'El cerebelo recibe una copia del plan motor, la compara con el movimiento real y devuelve correcciones a la corteza. El circuito cruza dos veces la línea media (en el puente y en el mesencéfalo), y la vía corticoespinal vuelve a cruzar: por eso cada hemisferio cerebeloso coordina el lado IPSILATERAL del cuerpo.',
    solidos: ['basilar_part_of_pons', 'middle_cerebellar_peduncle', 'lateral_hemisphere_of_cerebellum', 'cerebellar_deep_nuclei', 'superior_cerebellar_peduncle_brachium_conjunctivum', 'red_nucleus', 'ventral_lateral_nucleus_of_thalamus', 'inferior_olive', 'inferior_cerebellar_peduncle'], dir: [0.3, 0.3, -1],
    tramos: [
      { n: 'Corteza izquierda → núcleos pontinos', col: GLU, pts: [p('middle_frontal_gyrus', 'L', 0.6, 0.5, 0.3), p('capsula_interna', 'L', 0.45, 0.5, 0.6), p('cerebral_peduncle_crus_cerebri', 'L', 0.15, 0.5, 0.6), 'basilar_part_of_pons_L'] },
      { n: 'Fibras pontocerebelosas (cruzan) → hemisferio derecho', col: '#a8e6b8', pts: ['basilar_part_of_pons_L', p('basilar_part_of_pons', 'R', 0.6, 0.5, 0.4), 'middle_cerebellar_peduncle_R', p('lateral_hemisphere_of_cerebellum', 'R', 0.6, 0.6, 0.6)] },
      { n: 'Células de Purkinje → núcleo dentado (GABA)', col: GABA, pts: [p('lateral_hemisphere_of_cerebellum', 'R', 0.6, 0.6, 0.6), p('cerebellar_deep_nuclei', 'R', 0.75, 0.5, 0.5)] },
      { n: 'Dentado → tálamo VL izquierdo (cruza en el mesencéfalo)', col: GLU, pts: [p('cerebellar_deep_nuclei', 'R', 0.75, 0.5, 0.5), 'superior_cerebellar_peduncle_brachium_conjunctivum_R', p('midbrain_tegmentum', 'R', 0.1, 0.2, 0.4), 'red_nucleus_L', 'ventral_lateral_nucleus_of_thalamus_L'] },
      { n: 'Tálamo → corteza motora', col: GLU, pts: ['ventral_lateral_nucleus_of_thalamus_L', p('capsula_interna', 'L', 0.4, 0.85, 0.35), p('primary_motor_cortex', 'L', 0.6, 0.65, 0.5)] },
      { n: 'Oliva inferior izquierda → fibras trepadoras', col: '#f2c14e', pts: ['inferior_olive_L', p('tegmentum_of_medulla_oblongata', 'R', 0.6, 0.6, 0.4), 'inferior_cerebellar_peduncle_R', p('lateral_hemisphere_of_cerebellum', 'R', 0.5, 0.35, 0.6)] }],
    pasos: [
      { t: 'Proyección corticopontina', d: 'Unos 20 millones de fibras de las cortezas frontal, parietal, temporal y occipital descienden por la cápsula interna y el pedúnculo cerebral hasta los núcleos pontinos ipsilaterales.', en: 'basilar_part_of_pons_L' },
      { t: 'Pedúnculo cerebeloso medio', d: 'Las fibras pontocerebelosas cruzan la línea media y entran al hemisferio cerebeloso opuesto como fibras musgosas, que excitan a las células granulares.', en: 'middle_cerebellar_peduncle_R' },
      { t: 'Corteza cerebelosa', d: 'Granulares → fibras paralelas → células de Purkinje. La célula de Purkinje, GABAérgica, es la única salida de la corteza cerebelosa.', en: p('lateral_hemisphere_of_cerebellum', 'R', 0.6, 0.6, 0.6) },
      { t: 'Núcleo dentado', d: 'Recibe la inhibición de Purkinje y la excitación de las colaterales de fibras musgosas y trepadoras; su descarga es el resultado de esa comparación.', en: p('cerebellar_deep_nuclei', 'R', 0.75, 0.5, 0.5) },
      { t: 'Pedúnculo cerebeloso superior', d: 'Decusa en el tegmento del mesencéfalo caudal. Parte de las fibras termina en el núcleo rojo; la mayoría sigue al núcleo ventral lateral del tálamo.', en: 'superior_cerebellar_peduncle_brachium_conjunctivum_R' },
      { t: 'Oliva inferior', d: 'Cada célula de Purkinje recibe una sola fibra trepadora, que señala errores y dirige el aprendizaje motor (depresión a largo plazo de la sinapsis fibra paralela–Purkinje).', en: 'inferior_olive_L' }],
    clin: 'Lesión hemisférica: ataxia de las extremidades IPSILATERALES (dismetría, temblor de intención, disdiadococinesia). Triángulo de Guillain-Mollaret (dentado → rojo → oliva): su lesión produce mioclonía palatina.' },

  // ───────────────────────────────────────────── somatosensorial
  { id: 'lemnisco', g: 'somato', n: 'Columnas dorsales – lemnisco medial', sub: 'Tacto fino, vibración y propiocepción consciente',
    res: 'Tres neuronas llevan la información táctil discriminativa hasta la corteza. La primera asciende sin cruzar por las columnas dorsales; la segunda cruza en el bulbo. Se muestra la vía desde la mano derecha hasta el hemisferio izquierdo.',
    solidos: ['tegmentum_of_medulla_oblongata', 'ventral_posterior_lateral_nucleus', 'postcentral_gyrus'], capas: { medula: 2, esqueleto: 2, nervios: 2 },
    tramos: [
      { n: '1.ª neurona (ganglio de la raíz dorsal)', col: N1, pts: [p('mano', 'R', 0.5, 0.7, 0.5), p('cubito', 'R', 0.5, 0.6, 0.6), p('humero', 'R', 0.2, 0.55, 0.6), 'plexo_braquial_R', p('ne_C7', 'R', 0.75, 0.25, 0.5), cord('C7', 'R', 0.3, 0.12), ...sube('R', 0.3, 0.12, ['C5', 'C3', 'C1']), p('tegmentum_of_medulla_oblongata', 'R', 0.35, 0.12, 0.08)] },
      { n: '2.ª neurona (núcleo cuneiforme → lemnisco medial)', col: N2, pts: [p('tegmentum_of_medulla_oblongata', 'R', 0.35, 0.12, 0.08), p('tegmentum_of_medulla_oblongata', 'R', 0.05, 0.3, 0.5), p('tegmentum_of_medulla_oblongata', 'L', 0.1, 0.6, 0.75), p('pontine_tegmentum', 'L', 0.25, 0.5, 0.9), p('midbrain_tegmentum', 'L', 0.75, 0.5, 0.5), 'ventral_posterior_lateral_nucleus_L'] },
      { n: '3.ª neurona (tálamo → corteza)', col: N3, pts: ['ventral_posterior_lateral_nucleus_L', p('capsula_interna', 'L', 0.5, 0.8, 0.15), p('white_matter_of_forebrain', 'L', 0.55, 0.75, 0.35), p('postcentral_gyrus', 'L', 0.75, 0.7, 0.5)] }],
    pasos: [
      { t: 'Receptores', d: 'Corpúsculos de Meissner y Pacini, discos de Merkel, terminaciones de Ruffini y husos musculares. Fibras gruesas y mielínicas Aα y Aβ, de conducción rápida.', en: p('mano', 'R', 0.5, 0.7, 0.5) },
      { t: 'Ganglio de la raíz dorsal', d: 'Soma de la neurona seudounipolar. Su rama central entra por la división medial de la raíz posterior.', en: p('ne_C7', 'R', 0.75, 0.25, 0.5) },
      { t: 'Columna dorsal', d: 'Asciende IPSILATERAL sin hacer sinapsis. Fascículo grácil (medial): pierna y tronco inferior. Fascículo cuneiforme (lateral, desde T6 hacia arriba): brazo.', en: cord('C3', 'R', 0.3, 0.12) },
      { t: 'Núcleos grácil y cuneiforme', d: 'Primera sinapsis, en el bulbo caudal.', en: p('tegmentum_of_medulla_oblongata', 'R', 0.35, 0.12, 0.08) },
      { t: 'Decusación sensitiva', d: 'Los axones de segundo orden cruzan como fibras arqueadas internas y forman el lemnisco medial del lado opuesto.', en: p('tegmentum_of_medulla_oblongata', 'R', 0.05, 0.3, 0.5) },
      { t: 'Lemnisco medial', d: 'Asciende junto a la línea media en el bulbo, se aplana en el puente y se lateraliza en el mesencéfalo.', en: p('pontine_tegmentum', 'L', 0.25, 0.5, 0.9) },
      { t: 'Núcleo ventral posterolateral', d: 'Segunda sinapsis. La cara llega al ventral posteromedial por el lemnisco trigeminal.', en: 'ventral_posterior_lateral_nucleus_L' },
      { t: 'Corteza somatosensorial primaria', d: 'Las fibras talamocorticales suben por el brazo posterior de la cápsula interna hasta la capa IV de las áreas 3, 1 y 2.', en: p('postcentral_gyrus', 'L', 0.75, 0.7, 0.5) }],
    clin: 'Lesión de las columnas dorsales (déficit de B12, tabes dorsal, esclerosis múltiple): pérdida IPSILATERAL de vibración y propiocepción, ataxia sensitiva y signo de Romberg. Lesión por encima del bulbo: déficit contralateral.' },

  { id: 'espinotalamica', g: 'somato', n: 'Sistema anterolateral (espinotalámico)', sub: 'Dolor, temperatura y tacto grosero',
    res: 'La segunda neurona cruza en la propia médula, uno o dos segmentos por encima de la entrada, y asciende por el cordón anterolateral contrario. Se muestra la vía desde el pie izquierdo hasta el hemisferio derecho.',
    solidos: ['ventral_posterior_lateral_nucleus', 'paracentral_lobule_caudal_part', 'long_insular_gyri'], capas: { medula: 2, esqueleto: 2, nervios: 2 },
    tramos: [
      { n: '1.ª neurona (nociceptor)', col: N1, pts: [p('pie', 'L', 0.5, 0.5, 0.6), p('tibia', 'L', 0.5, 0.55, 0.1), p('femur', 'L', 0.4, 0.5, 0.1), p('n_ciatico', 'L', 0.35, 0.9, 0.3), p('ne_L5', 'L', 0.85, 0.1, 0.4), p('ne_L5', 'L', 0.15, 0.95, 0.5), cord('L5', 'L', 0.4, 0.2)] },
      { n: '2.ª neurona (asta posterior → tracto espinotalámico)', col: N2, pts: [cord('L5', 'L', 0.4, 0.2), cord('L4', 'L', 0.05, 0.62), cord('L3', 'R', 0.6, 0.72), ...sube('R', 0.62, 0.72, ['L1', 'T10', 'T7', 'T4', 'T1', 'C6', 'C3', 'C1']), p('tegmentum_of_medulla_oblongata', 'R', 0.85, 0.5, 0.55), p('pontine_tegmentum', 'R', 0.8, 0.5, 0.6), p('midbrain_tegmentum', 'R', 0.9, 0.6, 0.35), 'ventral_posterior_lateral_nucleus_R'] },
      { n: '3.ª neurona (tálamo → corteza)', col: N3, pts: ['ventral_posterior_lateral_nucleus_R', p('capsula_interna', 'R', 0.5, 0.8, 0.12), p('paracentral_lobule_caudal_part', 'R', 0.5, 0.5, 0.5)] }],
    pasos: [
      { t: 'Nociceptores y termorreceptores', d: 'Terminaciones nerviosas libres. Fibras Aδ (mielínicas finas; dolor rápido y punzante, frío) y C (amielínicas; dolor lento y quemante, calor). Canales TRPV1 (calor, capsaicina), TRPM8 (frío, mentol).', en: p('pie', 'L', 0.5, 0.5, 0.6) },
      { t: 'Entrada por la raíz posterior', d: 'Las fibras entran por la división lateral, ascienden o descienden 1–2 segmentos en el tracto de Lissauer y terminan en las láminas I, II (sustancia gelatinosa) y V. Transmisores: glutamato y sustancia P.', en: cord('L5', 'L', 0.4, 0.2) },
      { t: 'Cruce en la comisura blanca anterior', d: 'El axón de la segunda neurona cruza por delante del conducto central. Una cavidad que crece ahí (siringomielia) interrumpe estas fibras de ambos lados.', en: cord('L4', 'L', 0.05, 0.62) },
      { t: 'Tracto espinotalámico', d: 'Asciende por el cordón anterolateral CONTRALATERAL, con somatotopía: sacro lateral, cervical medial.', en: cord('T4', 'R', 0.62, 0.72) },
      { t: 'Tronco encefálico', d: 'Discurre por la parte lateral del bulbo y del tegmento. Da colaterales a la formación reticular, la sustancia gris periacueductal y el núcleo parabraquial (componente afectivo y de alerta del dolor).', en: p('tegmentum_of_medulla_oblongata', 'R', 0.85, 0.5, 0.55) },
      { t: 'Tálamo', d: 'Vía lateral (VPL): localización e intensidad. Vía medial (núcleos intralaminares y dorsomedial): sufrimiento.', en: 'ventral_posterior_lateral_nucleus_R' },
      { t: 'Corteza', d: 'SI y SII localizan el dolor; la ínsula posterior y el cíngulo anterior elaboran su dimensión afectiva.', en: p('paracentral_lobule_caudal_part', 'R', 0.5, 0.5, 0.5) }],
    clin: 'Hemisección medular (Brown-Séquard): analgesia y termoanestesia CONTRALATERALES desde uno o dos segmentos bajo la lesión, con parálisis y pérdida propioceptiva ipsilaterales. Síndrome de Wallenberg: analgesia de la hemicara ipsilateral y del hemicuerpo contralateral.' },

  { id: 'trigeminal', g: 'somato', n: 'Vía trigeminal', sub: 'Sensibilidad de la cara',
    res: 'El trigémino reproduce en la cara los dos sistemas del cuerpo: el núcleo principal equivale a los núcleos de las columnas dorsales (tacto fino) y el núcleo espinal al asta posterior (dolor y temperatura). Se muestra la vía desde la mejilla izquierda.',
    solidos: ['pontine_tegmentum', 'tegmentum_of_medulla_oblongata', 'ventral_posterior_medial_nucleus', 'postcentral_gyrus', 'n_trigemino', 'n_maxilar'], capas: { craneales: 1, craneo: 2 },
    tramos: [
      { n: '1.ª neurona (ganglio trigeminal)', col: N1, pts: [p('n_maxilar', 'L', 0.75, 0.2, 0.95), p('n_maxilar', 'L', 0.6, 0.5, 0.6), p('n_trigemino', 'L', 0.9, 0.3, 0.6), p('n_trigemino', 'L', 0.2, 0.6, 0.3), p('pontine_tegmentum', 'L', 0.85, 0.5, 0.45)] },
      { n: 'Tracto espinal del trigémino (dolor y temperatura)', col: '#f6a560', pts: [p('pontine_tegmentum', 'L', 0.85, 0.5, 0.45), p('tegmentum_of_medulla_oblongata', 'L', 0.85, 0.8, 0.25), p('tegmentum_of_medulla_oblongata', 'L', 0.8, 0.3, 0.2)] },
      { n: '2.ª neurona (lemnisco trigeminal, cruza)', col: N2, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.8, 0.3, 0.2), p('tegmentum_of_medulla_oblongata', 'R', 0.3, 0.6, 0.6), p('pontine_tegmentum', 'R', 0.45, 0.5, 0.75), p('midbrain_tegmentum', 'R', 0.6, 0.5, 0.5), 'ventral_posterior_medial_nucleus_R'] },
      { n: '2.ª neurona desde el núcleo principal (tacto)', col: '#9fd4f0', pts: [p('pontine_tegmentum', 'L', 0.85, 0.5, 0.45), p('pontine_tegmentum', 'R', 0.4, 0.55, 0.7)] },
      { n: '3.ª neurona (tálamo → corteza)', col: N3, pts: ['ventral_posterior_medial_nucleus_R', p('capsula_interna', 'R', 0.5, 0.75, 0.2), p('postcentral_gyrus', 'R', 0.92, 0.25, 0.5)] }],
    pasos: [
      { t: 'Divisiones periféricas', d: 'V1 (frente y córnea), V2 (mejilla y labio superior) y V3 (mandíbula). A diferencia de los dermatomas, apenas se superponen.', en: p('n_maxilar', 'L', 0.75, 0.2, 0.95) },
      { t: 'Ganglio trigeminal', d: 'Equivale a un ganglio de la raíz dorsal: contiene los somas seudounipolares.', en: p('n_trigemino', 'L', 0.9, 0.3, 0.6) },
      { t: 'Núcleo sensitivo principal', d: 'En el puente. Recibe las fibras gruesas del tacto discriminativo.', en: p('pontine_tegmentum', 'L', 0.85, 0.5, 0.45) },
      { t: 'Tracto y núcleo espinal', d: 'Las fibras de dolor y temperatura descienden hasta C2 antes de hacer sinapsis. Su porción caudal continúa el asta posterior de la médula.', en: p('tegmentum_of_medulla_oblongata', 'L', 0.8, 0.3, 0.2) },
      { t: 'Lemnisco trigeminal', d: 'Las segundas neuronas cruzan y ascienden junto al lemnisco medial hasta el núcleo ventral posteromedial.', en: 'ventral_posterior_medial_nucleus_R' },
      { t: 'Corteza', d: 'Representación de la cara, en la parte inferolateral del giro postcentral, junto a la de la mano.', en: p('postcentral_gyrus', 'R', 0.92, 0.25, 0.5) }],
    clin: 'Síndrome bulbar lateral (Wallenberg): el tracto espinal del trigémino se lesiona antes de cruzar → analgesia de la hemicara IPSILATERAL, junto con analgesia del hemicuerpo contralateral (espinotalámico, ya cruzado). Este patrón alterno localiza la lesión en el tronco.' },

  { id: 'espinocerebelosa', g: 'somato', n: 'Vía espinocerebelosa posterior', sub: 'Propiocepción inconsciente',
    res: 'Informa al cerebelo, momento a momento, de la longitud y la tensión de los músculos. Solo dos neuronas, sin cruce: llega al cerebelo del mismo lado.',
    solidos: ['inferior_cerebellar_peduncle', 'paravermis_of_cerebellum', 'cerebellar_vermis'], capas: { medula: 2, esqueleto: 2, nervios: 2 }, dir: [0.4, 0.1, -1],
    tramos: [
      { n: '1.ª neurona (huso muscular → núcleo de Clarke)', col: N1, pts: [p('femur', 'L', 0.5, 0.5, 0.8), p('n_femoral', 'L', 0.5, 0.8, 0.5), p('ne_L3', 'L', 0.85, 0.1, 0.4), p('ne_L3', 'L', 0.15, 0.95, 0.5), cord('L3', 'L', 0.25, 0.15), cord('L2', 'L', 0.2, 0.4)] },
      { n: '2.ª neurona (tracto espinocerebeloso posterior)', col: N2, pts: [cord('L2', 'L', 0.2, 0.4), ...sube('L', 0.85, 0.3, ['L1', 'T10', 'T7', 'T4', 'T1', 'C6', 'C3', 'C1']), 'inferior_cerebellar_peduncle_L', p('paravermis_of_cerebellum', 'L', 0.4, 0.7, 0.6)] }],
    pasos: [
      { t: 'Husos musculares y órganos tendinosos', d: 'Fibras Ia, II (longitud y velocidad de estiramiento) y Ib (tensión).', en: p('femur', 'L', 0.5, 0.5, 0.8) },
      { t: 'Núcleo dorsal de Clarke', d: 'Columna de neuronas en la lámina VII, solo entre C8 y L2. Las fibras de niveles más bajos ascienden primero por la columna dorsal para alcanzarla.', en: cord('L2', 'L', 0.2, 0.4) },
      { t: 'Tracto espinocerebeloso posterior', d: 'Asciende por la periferia del cordón lateral IPSILATERAL. Sus axones están entre los de conducción más rápida del sistema nervioso.', en: cord('T4', 'L', 0.85, 0.3) },
      { t: 'Pedúnculo cerebeloso inferior', d: 'Entra al cerebelo y termina como fibras musgosas en el vermis y la zona paravermiana (espinocerebelo). El miembro superior usa una vía equivalente: el tracto cuneocerebeloso.', en: 'inferior_cerebellar_peduncle_L' }],
    clin: 'Ataxia de Friedreich: degeneración de los tractos espinocerebelosos, las columnas dorsales y la vía corticoespinal. Ataxia de la marcha con arreflexia, pie cavo y miocardiopatía.' },

  // ───────────────────────────────────────────── sentidos
  { id: 'visual', g: 'sentidos', n: 'Vía visual', sub: 'De la retina a la corteza calcarina',
    res: 'Cada hemisferio ve el hemicampo visual contralateral de ambos ojos. Para lograrlo, las fibras de la mitad nasal de cada retina cruzan en el quiasma. Se muestra la vía que termina en el hemisferio izquierdo (campo visual derecho).',
    solidos: ['optic_chiasm', 'optic_tract', 'dorsal_lateral_geniculate_nucleus', 'optic_radiation', 'cuneus', 'lingual_gyrus_medial_occipitotemporal_gyrus', 'occipital_pole', 'n_optico', 'esclera'], capas: { craneales: 1, ojos: 1 }, dir: [0.15, 1, 0.25],
    tramos: [
      { n: 'Retina temporal izquierda (no cruza)', col: N1, pts: [p('esclera', 'L', 0.75, 0.5, 0.12), p('n_optico', 'L', 0.75, 0.4, 0.75), p('n_optico', 'L', 0.2, 0.6, 0.15), mid('optic_chiasm', 0.75, 0.5, 0.5), p('optic_tract', 'L', 0.55, 0.5, 0.5), 'dorsal_lateral_geniculate_nucleus_L'] },
      { n: 'Retina nasal derecha (cruza en el quiasma)', col: '#f6a560', pts: [p('esclera', 'R', 0.25, 0.5, 0.12), p('n_optico', 'R', 0.7, 0.4, 0.75), p('n_optico', 'R', 0.2, 0.6, 0.15), mid('optic_chiasm', 0.5, 0.5, 0.45), mid('optic_chiasm', 0.8, 0.5, 0.35), p('optic_tract', 'L', 0.55, 0.5, 0.45), 'dorsal_lateral_geniculate_nucleus_L'] },
      { n: 'Radiación óptica, fibras superiores (campo inferior)', col: N2, pts: ['dorsal_lateral_geniculate_nucleus_L', p('white_matter_of_forebrain', 'L', 0.62, 0.55, 0.2), p('white_matter_of_forebrain', 'L', 0.45, 0.55, 0.08), p('cuneus', 'L', 0.3, 0.15, 0.4)] },
      { n: 'Asa de Meyer, fibras inferiores (campo superior)', col: N3, pts: ['dorsal_lateral_geniculate_nucleus_L', p('inferior_horn_of_lateral_ventricle', 'L', 0.9, 0.9, 0.85), p('white_matter_of_forebrain', 'L', 0.7, 0.3, 0.25), p('white_matter_of_forebrain', 'L', 0.5, 0.35, 0.1), p('lingual_gyrus_medial_occipitotemporal_gyrus', 'L', 0.3, 0.85, 0.3)] }],
    pasos: [
      { t: 'Retina', d: 'Fotorreceptores → bipolares → células ganglionares. La imagen se invierte: el campo temporal cae sobre la retina nasal y el superior sobre la inferior.', en: p('esclera', 'L', 0.75, 0.5, 0.12) },
      { t: 'Nervio óptico', d: 'Lesión: ceguera monocular. ① en el esquema clásico de defectos campimétricos.', en: p('n_optico', 'L', 0.5, 0.5, 0.5) },
      { t: 'Quiasma óptico', d: 'Cruzan las fibras nasales. Su compresión central (adenoma de hipófisis) produce hemianopsia bitemporal heterónima.', en: 'optic_chiasm' },
      { t: 'Tracto óptico', d: 'Contiene todo el hemicampo contralateral. Lesión: hemianopsia homónima contralateral, incongruente.', en: 'optic_tract_L' },
      { t: 'Cuerpo geniculado lateral', d: 'Seis capas; mantiene separada la información de cada ojo y de los canales magno, parvo y koniocelular.', en: 'dorsal_lateral_geniculate_nucleus_L' },
      { t: 'Asa de Meyer', d: 'Las fibras del campo visual superior rodean el asta temporal del ventrículo. Lesión temporal: cuadrantanopsia homónima superior contralateral.', en: p('inferior_horn_of_lateral_ventricle', 'L', 0.9, 0.9, 0.85) },
      { t: 'Fibras parietales', d: 'Las del campo inferior siguen un curso directo por el lóbulo parietal. Lesión: cuadrantanopsia inferior.', en: p('white_matter_of_forebrain', 'L', 0.62, 0.55, 0.2) },
      { t: 'Corteza visual primaria (V1)', d: 'Labios del surco calcarino: el cúneo (arriba) recibe el campo inferior y el giro lingual (abajo) el superior. La mácula ocupa el polo occipital. Lesión por infarto de la ACP: hemianopsia homónima con respeto macular.', en: p('cuneus', 'L', 0.3, 0.15, 0.4) }],
    clin: 'Regla de localización: defecto monocular → prequiasmático; bitemporal → quiasma; homónimo → retroquiasmático, del lado opuesto al campo perdido. Cuanto más posterior la lesión, más congruente el defecto.' },

  { id: 'fotomotor', g: 'reflejos', n: 'Reflejo fotomotor', sub: 'Por qué la respuesta pupilar es consensual',
    res: 'Al iluminar un ojo se contraen las dos pupilas. La vía aferente va por el nervio óptico y la eferente por el oculomotor; el pretectum proyecta a ambos núcleos de Edinger-Westphal.',
    solidos: ['pretectal_region', 'midbrain_tegmentum', 'optic_chiasm', 'optic_tract', 'n_optico', 'n_oculomotor_tronco', 'n_oculomotor', 'ganglio_ciliar', 'esclera'], capas: { craneales: 1, ojos: 1 }, dir: [0.2, 1, 0.35],
    tramos: [
      { n: 'Aferente: retina → pretectum', col: N1, pts: [p('esclera', 'L', 0.5, 0.5, 0.12), p('n_optico', 'L', 0.2, 0.6, 0.15), mid('optic_chiasm', 0.7, 0.5, 0.5), p('optic_tract', 'L', 0.55, 0.5, 0.5), p('superior_colliculus', 'L', 0.8, 0.9, 0.9), 'pretectal_region_L'] },
      { n: 'Pretectum → Edinger-Westphal ipsilateral', col: N2, pts: ['pretectal_region_L', p('midbrain_tegmentum', 'L', 0.06, 0.72, 0.45)] },
      { n: 'Pretectum → Edinger-Westphal contralateral (comisura posterior)', col: N2, pts: ['pretectal_region_L', 'pretectal_region_R', p('midbrain_tegmentum', 'R', 0.06, 0.72, 0.45)] },
      { n: 'Eferente izquierdo: III → ganglio ciliar → esfínter', col: N3, pts: [p('midbrain_tegmentum', 'L', 0.06, 0.72, 0.45), p('n_oculomotor_tronco', 'L', 0.1, 0.3, 0.05), p('n_oculomotor_tronco', 'L', 0.7, 0.6, 0.9), 'ganglio_ciliar_L', p('esclera', 'L', 0.5, 0.5, 0.6)] },
      { n: 'Eferente derecho', col: N3, pts: [p('midbrain_tegmentum', 'R', 0.06, 0.72, 0.45), p('n_oculomotor_tronco', 'R', 0.1, 0.3, 0.05), p('n_oculomotor_tronco', 'R', 0.7, 0.6, 0.9), 'ganglio_ciliar_R', p('esclera', 'R', 0.5, 0.5, 0.6)] }],
    pasos: [
      { t: 'Células ganglionares', d: 'Incluidas las que contienen melanopsina, intrínsecamente fotosensibles.', en: p('esclera', 'L', 0.5, 0.5, 0.12) },
      { t: 'Brazo del colículo superior', d: 'Las fibras pupilares abandonan el tracto óptico antes del cuerpo geniculado lateral: por eso una lesión de la radiación óptica o de la corteza no altera el reflejo.', en: p('superior_colliculus', 'L', 0.8, 0.9, 0.9) },
      { t: 'Núcleo pretectal olivar', d: 'Proyecta a los dos núcleos de Edinger-Westphal; las fibras cruzadas pasan por la comisura posterior.', en: 'pretectal_region_L' },
      { t: 'Núcleo de Edinger-Westphal', d: 'Neuronas parasimpáticas preganglionares, dorsales al núcleo oculomotor.', en: p('midbrain_tegmentum', 'L', 0.06, 0.72, 0.45) },
      { t: 'Nervio oculomotor', d: 'Las fibras pupilares viajan en la superficie del nervio: la compresión externa las afecta primero.', en: p('n_oculomotor_tronco', 'L', 0.5, 0.5, 0.5) },
      { t: 'Ganglio ciliar', d: 'Sinapsis colinérgica. Los nervios ciliares cortos llegan al esfínter de la pupila (receptores M3): miosis.', en: 'ganglio_ciliar_L' }],
    clin: 'Defecto pupilar aferente relativo (pupila de Marcus Gunn): al alternar la luz, ambas pupilas se dilatan cuando se ilumina el ojo con neuritis óptica. Lesión eferente (III): pupila midriática fija en ese ojo, con consensual conservado en el otro. Pupila de Argyll Robertson: lesión pretectal.' },

  { id: 'auditiva', g: 'sentidos', n: 'Vía auditiva', sub: 'De la cóclea al giro de Heschl',
    res: 'A partir de los núcleos cocleares la información asciende por ambos lados, con predominio contralateral. Por eso una lesión central unilateral no produce sordera de un oído.',
    solidos: ['tegmentum_of_medulla_oblongata', 'pontine_tegmentum', 'inferior_colliculus', 'medial_geniculate_nuclei', 'transverse_temporal_gyrus_Heschls_gyrus', 'n_vestibulococlear'], capas: { craneales: 1, craneo: 0 }, dir: [0.1, 0.4, -1],
    tramos: [
      { n: '1.ª neurona: ganglio espiral → núcleos cocleares', col: N1, pts: [p('n_vestibulococlear', 'L', 0.9, 0.3, 0.6), p('n_vestibulococlear', 'L', 0.4, 0.5, 0.4), p('tegmentum_of_medulla_oblongata', 'L', 0.97, 0.97, 0.2)] },
      { n: 'Cuerpo trapezoide → complejo olivar superior (ambos lados)', col: N2, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.97, 0.97, 0.2), p('pontine_tegmentum', 'L', 0.5, 0.1, 0.7), p('pontine_tegmentum', 'R', 0.5, 0.1, 0.7)] },
      { n: 'Lemnisco lateral derecho → colículo inferior', col: N2, pts: [p('pontine_tegmentum', 'R', 0.5, 0.1, 0.7), p('pontine_tegmentum', 'R', 0.9, 0.6, 0.4), 'inferior_colliculus_R'] },
      { n: 'Lemnisco lateral izquierdo (vía ipsilateral)', col: '#9fd4f0', pts: [p('pontine_tegmentum', 'L', 0.5, 0.1, 0.7), p('pontine_tegmentum', 'L', 0.9, 0.6, 0.4), 'inferior_colliculus_L'] },
      { n: 'Brazo del colículo inferior → geniculado medial', col: N3, pts: ['inferior_colliculus_R', 'medial_geniculate_nuclei_R'] },
      { n: 'Radiación acústica → corteza auditiva', col: '#f4b6dc', pts: ['medial_geniculate_nuclei_R', p('capsula_interna', 'R', 0.9, 0.2, 0.05), p('transverse_temporal_gyrus_Heschls_gyrus', 'R', 0.4, 0.5, 0.5)] }],
    pasos: [
      { t: 'Cóclea', d: 'La membrana basilar separa las frecuencias (agudos en la base, graves en el ápex). Las células ciliadas internas transducen; las externas amplifican. El potencial endococlear (+80 mV) impulsa la entrada de K⁺.', en: p('n_vestibulococlear', 'L', 0.9, 0.3, 0.6) },
      { t: 'Núcleos cocleares', d: 'Dorsal y ventral, en la unión bulbopontina, sobre el pedúnculo cerebeloso inferior.', en: p('tegmentum_of_medulla_oblongata', 'L', 0.97, 0.97, 0.2) },
      { t: 'Complejo olivar superior', d: 'Primer lugar donde converge la información de los dos oídos. La oliva medial compara tiempos de llegada (frecuencias bajas) y la lateral, intensidades (frecuencias altas): así se localiza el sonido.', en: p('pontine_tegmentum', 'R', 0.5, 0.1, 0.7) },
      { t: 'Lemnisco lateral y colículo inferior', d: 'Relevo obligado de toda la vía ascendente.', en: 'inferior_colliculus_R' },
      { t: 'Cuerpo geniculado medial', d: 'Relevo talámico.', en: 'medial_geniculate_nuclei_R' },
      { t: 'Corteza auditiva primaria', d: 'Giro de Heschl (áreas 41 y 42), tonotópica.', en: p('transverse_temporal_gyrus_Heschls_gyrus', 'R', 0.4, 0.5, 0.5) }],
    clin: 'Hipoacusia de conducción (oído externo o medio) frente a neurosensorial (cóclea o nervio): pruebas de Rinne y Weber. Sordera unilateral = lesión periférica o del nervio (schwannoma vestibular). Potenciales evocados auditivos del tronco: ondas I–V.' },

  { id: 'vor', g: 'reflejos', n: 'Reflejo vestibuloocular', sub: 'Estabiliza la mirada cuando gira la cabeza',
    res: 'Arco de tres neuronas, uno de los reflejos más rápidos (~10 ms). Si la cabeza gira a la izquierda, los ojos giran a la derecha con la misma velocidad y la imagen no se mueve sobre la retina.',
    solidos: ['tegmentum_of_medulla_oblongata', 'pontine_tegmentum', 'midbrain_tegmentum', 'n_vestibulococlear', 'n_abducens', 'n_oculomotor_tronco', 'n_oculomotor', 'esclera'], capas: { craneales: 1, ojos: 1 }, dir: [0.1, 1, 0.1],
    tramos: [
      { n: '1.ª: conducto horizontal izquierdo → núcleos vestibulares', col: N1, pts: [p('n_vestibulococlear', 'L', 0.95, 0.75, 0.3), p('n_vestibulococlear', 'L', 0.4, 0.5, 0.4), p('tegmentum_of_medulla_oblongata', 'L', 0.6, 0.95, 0.15)] },
      { n: '2.ª: vestibular medial → núcleo abducens derecho', col: N2, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.6, 0.95, 0.15), p('pontine_tegmentum', 'R', 0.12, 0.15, 0.1)] },
      { n: '3.ª: abducens derecho → recto lateral derecho', col: N3, pts: [p('pontine_tegmentum', 'R', 0.12, 0.15, 0.1), p('n_abducens', 'R', 0.1, 0.1, 0.1), p('n_abducens', 'R', 0.5, 0.6, 0.5), p('esclera', 'R', 0.95, 0.5, 0.3)] },
      { n: 'Interneurona abducens → FLM izquierdo → núcleo oculomotor', col: '#9fd4f0', pts: [p('pontine_tegmentum', 'R', 0.12, 0.15, 0.1), p('pontine_tegmentum', 'L', 0.04, 0.5, 0.15), p('midbrain_tegmentum', 'L', 0.05, 0.7, 0.4)] },
      { n: 'Oculomotor izquierdo → recto medial izquierdo', col: '#f4b6dc', pts: [p('midbrain_tegmentum', 'L', 0.05, 0.7, 0.4), p('n_oculomotor_tronco', 'L', 0.1, 0.3, 0.05), p('n_oculomotor_tronco', 'L', 0.7, 0.6, 0.9), p('esclera', 'L', 0.05, 0.5, 0.3)] }],
    pasos: [
      { t: 'Conducto semicircular horizontal', d: 'Al girar la cabeza a la izquierda la endolinfa se rezaga, desvía la cúpula y despolariza las células ciliadas del conducto izquierdo (y silencia las del derecho).', en: p('n_vestibulococlear', 'L', 0.95, 0.75, 0.3) },
      { t: 'Núcleos vestibulares', d: 'Cuatro núcleos en el suelo del cuarto ventrículo. También proyectan a la médula (tractos vestibuloespinales: postura) y al cerebelo.', en: p('tegmentum_of_medulla_oblongata', 'L', 0.6, 0.95, 0.15) },
      { t: 'Núcleo abducens contralateral', d: 'Contiene motoneuronas para el recto lateral e interneuronas cuyo axón cruza y asciende por el fascículo longitudinal medial (FLM).', en: p('pontine_tegmentum', 'R', 0.12, 0.15, 0.1) },
      { t: 'Fascículo longitudinal medial', d: 'Une el núcleo del VI con el subnúcleo del recto medial del III contralateral: garantiza que los dos ojos se muevan juntos.', en: p('pontine_tegmentum', 'L', 0.04, 0.5, 0.15) },
      { t: 'Resultado', d: 'Recto lateral derecho y recto medial izquierdo se contraen: ambos ojos giran a la derecha.', en: p('esclera', 'R', 0.95, 0.5, 0.3) }],
    clin: 'Oftalmoplejía internuclear (lesión del FLM; esclerosis múltiple en jóvenes, ictus en mayores): el ojo del lado lesionado no aduce en la mirada lateral y el otro muestra nistagmo en abducción; la convergencia se conserva. Reflejo oculocefálico («ojos de muñeca») y prueba calórica en el coma: evalúan la integridad del tronco.' },

  { id: 'gusto', g: 'sentidos', n: 'Vía gustativa', sub: 'Una vía sensorial que no cruza',
    res: 'Tres nervios craneales recogen el gusto y convergen en el núcleo del tracto solitario. La proyección al tálamo y a la corteza es ipsilateral.',
    solidos: ['tegmentum_of_medulla_oblongata', 'ventral_posterior_medial_nucleus', 'short_insular_gyri', 'frontal_operculum', 'n_facial', 'n_glosofaringeo', 'n_mandibular'], capas: { craneales: 1 }, lado: 'L',
    tramos: [
      { n: 'VII (cuerda del tímpano): 2/3 anteriores de la lengua', col: N1, pts: [p('n_mandibular', 'L', 0.05, 0.2, 0.9), p('n_mandibular', 'L', 0.5, 0.45, 0.5), p('n_facial', 'L', 0.3, 0.65, 0.2), p('n_facial', 'L', 0.03, 0.75, 0.25), p('tegmentum_of_medulla_oblongata', 'L', 0.35, 0.9, 0.3)] },
      { n: 'IX: tercio posterior de la lengua', col: '#f6a560', pts: [p('n_glosofaringeo', 'L', 0.15, 0.1, 0.9), p('n_glosofaringeo', 'L', 0.8, 0.6, 0.3), p('tegmentum_of_medulla_oblongata', 'L', 0.35, 0.8, 0.3)] },
      { n: 'Núcleo del tracto solitario → VPM parvocelular', col: N2, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.35, 0.85, 0.3), p('pontine_tegmentum', 'L', 0.35, 0.5, 0.5), p('midbrain_tegmentum', 'L', 0.5, 0.5, 0.5), p('ventral_posterior_medial_nucleus', 'L', 0.1, 0.4, 0.5)] },
      { n: 'Tálamo → ínsula anterior y opérculo frontal', col: N3, pts: [p('ventral_posterior_medial_nucleus', 'L', 0.1, 0.4, 0.5), p('capsula_interna', 'L', 0.6, 0.5, 0.4), 'short_insular_gyri_L', 'frontal_operculum_L'] }],
    pasos: [
      { t: 'Botones gustativos', d: 'Cinco cualidades. Salado y ácido usan canales iónicos (ENaC, canales de protones). Dulce, amargo y umami usan receptores acoplados a proteína G (T1R, T2R) → gustducina → PLCβ2 → canal TRPM5.', en: p('n_mandibular', 'L', 0.05, 0.2, 0.9) },
      { t: 'Nervios', d: 'Facial (cuerda del tímpano, que viaja con el nervio lingual), glosofaríngeo y vago (epiglotis).', en: p('n_facial', 'L', 0.3, 0.65, 0.2) },
      { t: 'Núcleo del tracto solitario', d: 'Su parte rostral (núcleo gustativo) recibe el gusto; la caudal, las aferencias viscerales.', en: p('tegmentum_of_medulla_oblongata', 'L', 0.35, 0.85, 0.3) },
      { t: 'Tálamo', d: 'Asciende por el tracto tegmental central ipsilateral al VPM parvocelular.', en: p('ventral_posterior_medial_nucleus', 'L', 0.1, 0.4, 0.5) },
      { t: 'Corteza gustativa', d: 'Ínsula anterior y opérculo frontal. El sabor se construye en la corteza orbitofrontal, donde convergen gusto, olfato y textura.', en: 'short_insular_gyri_L' }],
    clin: 'Parálisis de Bell proximal a la cuerda del tímpano: ageusia de los 2/3 anteriores de la hemilengua. Aura gustativa en la epilepsia insular.' },

  { id: 'olfatoria', g: 'sentidos', n: 'Vía olfatoria', sub: 'El único sentido sin relevo talámico obligado',
    res: 'Solo dos neuronas separan el aire inspirado de la corteza. Las proyecciones directas a la amígdala y a la corteza entorrinal explican la fuerza con que los olores evocan emociones y recuerdos.',
    solidos: ['olfactory_bulb', 'olfactory_tract', 'piriform_region', 'amygdaloid_complex', 'anterior_parahippocampal_gyrus', 'medial_orbital_gyrus', 'n_olfatorio'], capas: { craneales: 1 }, lado: 'L', dir: [0.3, -1, 0.5],
    tramos: [
      { n: 'Neurona receptora olfatoria', col: N1, pts: [p('n_olfatorio', 'L', 0.5, 0, 0.5), p('n_olfatorio', 'L', 0.5, 1, 0.5), 'olfactory_bulb_L'] },
      { n: 'Célula mitral: bulbo → corteza piriforme', col: N2, pts: ['olfactory_bulb_L', 'olfactory_tract_L', p('piriform_region', 'L', 0.4, 0.5, 0.6)] },
      { n: '→ amígdala', col: '#9fd4f0', pts: [p('piriform_region', 'L', 0.4, 0.5, 0.6), 'amygdaloid_complex_L'] },
      { n: '→ corteza entorrinal (hipocampo)', col: '#9fd4f0', pts: [p('piriform_region', 'L', 0.4, 0.5, 0.6), 'anterior_parahippocampal_gyrus_L'] },
      { n: 'Piriforme → tálamo dorsomedial → corteza orbitofrontal', col: N3, pts: [p('piriform_region', 'L', 0.4, 0.5, 0.6), 'mediodorsal_nucleus_of_thalamus_L', p('white_matter_of_forebrain', 'L', 0.3, 0.35, 0.85), 'medial_orbital_gyrus_L'] }],
    pasos: [
      { t: 'Epitelio olfatorio', d: 'Neuronas bipolares con cilios. Cada una expresa uno solo de unos 400 receptores acoplados a G_olf → adenilato ciclasa → AMPc → canal CNG.', en: p('n_olfatorio', 'L', 0.5, 0, 0.5) },
      { t: 'Glomérulos del bulbo', d: 'Todas las neuronas con el mismo receptor convergen en uno o dos glomérulos: mapa químico del olor.', en: 'olfactory_bulb_L' },
      { t: 'Corteza piriforme', d: 'Corteza olfatoria primaria, de tres capas; representa los olores de forma distribuida.', en: p('piriform_region', 'L', 0.4, 0.5, 0.6) },
      { t: 'Amígdala y corteza entorrinal', d: 'Valor emocional y memoria del olor.', en: 'amygdaloid_complex_L' },
      { t: 'Corteza orbitofrontal', d: 'Percepción consciente e identificación del olor; integración con el gusto.', en: 'medial_orbital_gyrus_L' }],
    clin: 'Anosmia postraumática, posviral, o como pródromo de la enfermedad de Parkinson y de Alzheimer. Crisis uncinadas.' },

  // ───────────────────────────────────────────── reflejos
  { id: 'miotatico', g: 'reflejos', n: 'Reflejo miotático (rotuliano)', sub: 'El arco reflejo monosináptico',
    res: 'La percusión del tendón rotuliano estira el cuádriceps; el huso muscular lo detecta y excita directamente a la motoneurona del mismo músculo. Evalúa los segmentos L3–L4 y el nervio femoral.',
    solidos: ['me_L3', 'me_L4', 'n_femoral', 'ne_L4', 'femur', 'rotula', 'tibia'], capas: { medula: 1, nervios: 2, esqueleto: 1, columna: 2 }, dir: [1, 0.1, 0.6],
    tramos: [
      { n: 'Aferente Ia (huso muscular)', col: N1, pts: [p('femur', 'L', 0.5, 0.35, 0.95), p('n_femoral', 'L', 0.55, 0.75, 0.6), p('ne_L4', 'L', 0.85, 0.1, 0.4), p('ne_L4', 'L', 0.15, 0.95, 0.5), cord('L4', 'L', 0.35, 0.15), cord('L4', 'L', 0.4, 0.72)] },
      { n: 'Motoneurona α → cuádriceps', col: MI, pts: [cord('L4', 'L', 0.4, 0.72), p('ne_L4', 'L', 0.2, 0.9, 0.6), p('ne_L4', 'L', 0.9, 0.05, 0.5), p('n_femoral', 'L', 0.45, 0.7, 0.6), p('femur', 'L', 0.5, 0.5, 0.95)] },
      { n: 'Interneurona inhibidora Ia → motoneurona de los isquiotibiales', col: GABA, pts: [cord('L4', 'L', 0.35, 0.3), cord('L5', 'L', 0.4, 0.7)] }],
    pasos: [
      { t: 'Huso muscular', d: 'Fibras intrafusales en paralelo con las extrafusales. Su estiramiento abre canales mecanosensibles (Piezo2) en las terminaciones anuloespirales de las fibras Ia.', en: p('femur', 'L', 0.5, 0.35, 0.95) },
      { t: 'Raíz posterior', d: 'La fibra Ia entra a la médula por la raíz posterior de L4.', en: cord('L4', 'L', 0.35, 0.15) },
      { t: 'Sinapsis única', d: 'Excita (glutamato) a las motoneuronas α del cuádriceps. Un solo relevo: latencia de ~20 ms.', en: cord('L4', 'L', 0.4, 0.72) },
      { t: 'Inhibición recíproca', d: 'Una colateral activa una interneurona glicinérgica que inhibe a las motoneuronas del antagonista.', en: cord('L5', 'L', 0.4, 0.7) },
      { t: 'Control descendente', d: 'Las motoneuronas γ ajustan la sensibilidad del huso. Las vías descendentes modulan todo el arco: por eso su lesión exalta el reflejo.', en: cord('L3', 'L', 0.6, 0.4) }],
    clin: 'Arreflexia o hiporreflexia: lesión del arco (neuropatía, radiculopatía, motoneurona inferior). Hiperreflexia y clonus: lesión de motoneurona superior. Niveles: bicipital C5–C6, tricipital C7, rotuliano L3–L4, aquíleo S1.' },

  // ───────────────────────────────────────────── límbico y lenguaje
  { id: 'papez', g: 'limbico', n: 'Circuito de Papez', sub: 'Memoria episódica',
    res: 'Propuesto en 1937 como sustrato de la emoción, hoy se entiende como el circuito central de la memoria declarativa. La lesión de cualquiera de sus eslabones produce amnesia anterógrada.',
    solidos: ['head_of_hippocampus', 'body_of_hippocampus', 'tail_of_hippocampus', 'fornix', 'mammillary_region_of_HTH', 'mammillothalamic_tract', 'anterior_nuclear_complex_of_thalamus', 'cingulate_gyrus_rostral_anterior_part', 'cingulate_gyrus_caudal_posterior_part', 'ingulo_parahippocampal_isthmus', 'anterior_parahippocampal_gyrus', 'posterior_parahippocampal_gyrus'], lado: 'L', dir: [-1, 0.15, 0.2], hemi: 'L',
    tramos: [
      { n: 'Subículo → fórnix → cuerpo mamilar', col: N1, pts: ['body_of_hippocampus_L', 'tail_of_hippocampus_L', p('fornix', 'L', 0.6, 0.75, 0.15), p('fornix', 'L', 0.2, 1, 0.5), p('fornix', 'L', 0.2, 0.6, 0.95), 'mammillary_region_of_HTH_L'] },
      { n: 'Tracto mamilotalámico', col: N2, pts: ['mammillary_region_of_HTH_L', 'mammillothalamic_tract_L', 'anterior_nuclear_complex_of_thalamus_L'] },
      { n: 'Tálamo anterior → giro del cíngulo', col: N3, pts: ['anterior_nuclear_complex_of_thalamus_L', p('capsula_interna', 'L', 0.2, 0.9, 0.8), p('cingulate_gyrus_rostral_anterior_part', 'L', 0.4, 0.7, 0.4)] },
      { n: 'Cíngulo → corteza entorrinal → hipocampo', col: '#6fd08c', pts: [p('cingulate_gyrus_rostral_anterior_part', 'L', 0.4, 0.7, 0.4), p('cingulate_gyrus_caudal_posterior_part', 'L', 0.4, 0.8, 0.5), 'ingulo_parahippocampal_isthmus_L', 'posterior_parahippocampal_gyrus_L', 'anterior_parahippocampal_gyrus_L', 'head_of_hippocampus_L'] }],
    pasos: [
      { t: 'Hipocampo y subículo', d: 'La información cortical entra por la corteza entorrinal (vía perforante), recorre el circuito trisináptico y sale por el subículo.', en: 'body_of_hippocampus_L' },
      { t: 'Fórnix', d: 'Álveo → fimbria → pilar → cuerpo → columna. Las fibras poscomisurales terminan en el cuerpo mamilar.', en: p('fornix', 'L', 0.2, 1, 0.5) },
      { t: 'Cuerpo mamilar', d: 'Blanco de la encefalopatía de Wernicke (déficit de tiamina).', en: 'mammillary_region_of_HTH_L' },
      { t: 'Tracto mamilotalámico', d: 'Su lesión en infartos talámicos anteriores predice amnesia.', en: 'mammillothalamic_tract_L' },
      { t: 'Núcleos anteriores del tálamo', d: 'Proyectan por el brazo anterior de la cápsula interna a la corteza cingulada.', en: 'anterior_nuclear_complex_of_thalamus_L' },
      { t: 'Giro del cíngulo y haz del cíngulo', d: 'El haz del cíngulo rodea el cuerpo calloso hasta el giro parahipocampal.', en: p('cingulate_gyrus_caudal_posterior_part', 'L', 0.4, 0.8, 0.5) },
      { t: 'Corteza entorrinal', d: 'Cierra el circuito de vuelta al hipocampo.', en: 'anterior_parahippocampal_gyrus_L' }],
    clin: 'Paciente H. M. (resección temporal medial bilateral): amnesia anterógrada con memoria de trabajo, procedimental e inteligencia intactas. Síndrome de Korsakoff: cuerpos mamilares y tálamo dorsomedial. Enfermedad de Alzheimer: comienza en la corteza entorrinal.' },

  { id: 'lenguaje', g: 'limbico', n: 'Red perisilviana del lenguaje', sub: 'Vías dorsal y ventral (hemisferio izquierdo)',
    res: 'El modelo clásico de Wernicke-Geschwind se ha ampliado a un modelo de doble vía: una dorsal que convierte el sonido en articulación y una ventral que convierte el sonido en significado.',
    solidos: ['transverse_temporal_gyrus_Heschls_gyrus', 'superior_temporal_gyrus', 'planum_temporale', 'supramarginal_gyrus', 'angular_gyrus', 'inferior_frontal_gyrus_opercular_part', 'inferior_frontal_gyrus_triangular_part', 'middle_temporal_gyrus', 'temporal_pole', 'primary_motor_cortex'], lado: 'L', dir: [1, 0.15, 0.1], hemi: 'L', opaco: true,
    tramos: [
      { n: 'Corteza auditiva → área de Wernicke', col: N1, pts: ['transverse_temporal_gyrus_Heschls_gyrus_L', p('planum_temporale', 'L', 0.7, 0.6, 0.4), p('superior_temporal_gyrus', 'L', 0.95, 0.6, 0.2)] },
      { n: 'Vía dorsal: fascículo arqueado', col: N2, pts: [p('superior_temporal_gyrus', 'L', 0.95, 0.6, 0.2), p('supramarginal_gyrus', 'L', 0.85, 0.5, 0.4), p('postcentral_gyrus', 'L', 0.9, 0.25, 0.5), p('primary_motor_cortex', 'L', 0.92, 0.2, 0.5), p('inferior_frontal_gyrus_opercular_part', 'L', 0.9, 0.5, 0.5)] },
      { n: 'Vía ventral: del sonido al significado', col: N3, pts: [p('superior_temporal_gyrus', 'L', 0.95, 0.6, 0.2), p('middle_temporal_gyrus', 'L', 0.95, 0.5, 0.5), p('temporal_pole', 'L', 0.8, 0.6, 0.5), p('inferior_frontal_gyrus_triangular_part', 'L', 0.9, 0.3, 0.5)] },
      { n: 'Área de Broca → corteza motora orofacial', col: MS, pts: [p('inferior_frontal_gyrus_opercular_part', 'L', 0.9, 0.5, 0.5), p('primary_motor_cortex', 'L', 0.95, 0.25, 0.6)] }],
    pasos: [
      { t: 'Corteza auditiva primaria', d: 'Análisis acústico de la señal del habla.', en: 'transverse_temporal_gyrus_Heschls_gyrus_L' },
      { t: 'Área de Wernicke', d: 'Parte posterior del giro temporal superior y plano temporal: reconocimiento fonológico de las palabras.', en: p('superior_temporal_gyrus', 'L', 0.95, 0.6, 0.2) },
      { t: 'Fascículo arqueado', d: 'Rodea el extremo del surco lateral bajo el giro supramarginal y une las áreas temporales y frontales. Sostiene la repetición.', en: p('supramarginal_gyrus', 'L', 0.85, 0.5, 0.4) },
      { t: 'Área de Broca', d: 'Porciones opercular y triangular del giro frontal inferior: programación articulatoria y sintaxis.', en: p('inferior_frontal_gyrus_opercular_part', 'L', 0.9, 0.5, 0.5) },
      { t: 'Vía ventral', d: 'Giro temporal medio y polo temporal: acceso al significado. Conecta con el frontal inferior por la cápsula extrema y el fascículo uncinado.', en: p('middle_temporal_gyrus', 'L', 0.95, 0.5, 0.5) },
      { t: 'Giro angular', d: 'Convergencia visual-auditiva: lectura y escritura.', en: 'angular_gyrus_L' }],
    clin: 'Clasificación de las afasias con tres preguntas: ¿es fluente?, ¿comprende?, ¿repite? Broca: no fluente, comprende, no repite. Wernicke: fluente, no comprende, no repite. Conducción: fluente, comprende, no repite. Transcorticales: la repetición está conservada. Global: todo alterado.' },

  // ───────────────────────────────────────────── moduladores y autónomo
  { id: 'dopamina', g: 'modul', n: 'Vías dopaminérgicas', sub: 'Nigroestriada, mesolímbica, mesocortical y tuberoinfundibular',
    res: 'Cuatro sistemas, cuatro funciones y cuatro grupos de efectos de los fármacos que bloquean o estimulan los receptores de dopamina.',
    solidos: ['substantia_nigra', 'putamen', 'head_of_caudate', 'nucleus_accumbens', 'amygdaloid_complex', 'superior_frontal_gyrus', 'middle_frontal_gyrus', 'tuberal_region_of_HTH', 'hipofisis', 'midbrain_tegmentum'], lado: 'L', dir: [1, 0.2, 0.4], hemi: 'L',
    tramos: [
      { n: 'Nigroestriada (A9): movimiento', col: '#b58cf0', pts: ['substantia_nigra_L', p('capsula_interna', 'L', 0.5, 0.2, 0.4), 'putamen_L'] },
      { n: 'Nigroestriada → caudado', col: '#b58cf0', pts: ['substantia_nigra_L', p('capsula_interna', 'L', 0.3, 0.4, 0.55), 'head_of_caudate_L'] },
      { n: 'Mesolímbica (A10): recompensa', col: '#f08fc0', pts: [p('midbrain_tegmentum', 'L', 0.12, 0.25, 0.85), p('tuberal_region_of_HTH', 'L', 0.9, 0.5, 0.5), 'nucleus_accumbens_L'] },
      { n: 'Mesolímbica → amígdala', col: '#f08fc0', pts: [p('midbrain_tegmentum', 'L', 0.12, 0.25, 0.85), 'amygdaloid_complex_L'] },
      { n: 'Mesocortical: funciones ejecutivas', col: '#5db7e8', pts: [p('midbrain_tegmentum', 'L', 0.12, 0.25, 0.85), p('tuberal_region_of_HTH', 'L', 0.9, 0.6, 0.6), p('head_of_caudate', 'L', 0.3, 0.2, 0.9), p('white_matter_of_forebrain', 'L', 0.3, 0.55, 0.9), p('middle_frontal_gyrus', 'L', 0.5, 0.5, 0.7)] },
      { n: 'Tuberoinfundibular: inhibe la prolactina', col: '#f2c14e', pts: [p('tuberal_region_of_HTH', 'L', 0.2, 0.3, 0.5), mid('hipofisis', 0.5, 0.9, 0.5), mid('hipofisis', 0.5, 0.5, 0.7)] }],
    pasos: [
      { t: 'Vía nigroestriada', d: 'Sustancia negra compacta → caudado y putamen. Facilita el movimiento. Su degeneración causa la enfermedad de Parkinson; su bloqueo por antipsicóticos, parkinsonismo y discinesia tardía.', en: 'substantia_nigra_L' },
      { t: 'Área tegmental ventral', d: 'Grupo A10, medial a la sustancia negra. Origen de las vías mesolímbica y mesocortical.', en: p('midbrain_tegmentum', 'L', 0.12, 0.25, 0.85) },
      { t: 'Vía mesolímbica', d: 'Hacia el núcleo accumbens, la amígdala y el hipocampo. Señala el error de predicción de la recompensa. Su hiperactividad se relaciona con los síntomas positivos de la esquizofrenia; todas las drogas de abuso la activan.', en: 'nucleus_accumbens_L' },
      { t: 'Vía mesocortical', d: 'Hacia la corteza prefrontal. Su hipofunción se asocia a los síntomas negativos y cognitivos de la esquizofrenia; la memoria de trabajo sigue una curva en «U» invertida respecto de la dopamina (receptor D1).', en: p('middle_frontal_gyrus', 'L', 0.5, 0.5, 0.7) },
      { t: 'Vía tuberoinfundibular', d: 'Del núcleo arcuato a la eminencia media. La dopamina llega por el sistema porta a la adenohipófisis e inhibe (D2) la secreción de prolactina.', en: p('tuberal_region_of_HTH', 'L', 0.2, 0.3, 0.5) }],
    clin: 'Antagonistas D2 (antipsicóticos): mejoran la psicosis (mesolímbica), pero causan parkinsonismo (nigroestriada), hiperprolactinemia (tuberoinfundibular) y pueden agravar los síntomas negativos (mesocortical). Levodopa y agonistas dopaminérgicos: mejoran el Parkinson, pero pueden causar alucinaciones y trastornos del control de impulsos.' },

  { id: 'moduladores', g: 'modul', n: 'Sistemas moduladores difusos', sub: 'Noradrenalina, serotonina, acetilcolina e histamina',
    res: 'Unos pocos miles de neuronas del tronco encefálico y del prosencéfalo basal inervan todo el encéfalo. No transmiten información puntual: regulan el estado global (vigilia, atención, ánimo) en que la corteza procesa esa información.',
    solidos: ['pontine_tegmentum', 'midbrain_tegmentum', 'tegmentum_of_medulla_oblongata', 'basal_forebrain', 'septal_nuclei', 'mammillary_region_of_HTH', 'thalamus'], lado: 'L', dir: [1, 0.2, 0.15], hemi: 'L',
    tramos: [
      { n: 'Noradrenalina: locus cerúleo → corteza', col: NA, pts: [p('pontine_tegmentum', 'L', 0.35, 0.9, 0.12), p('midbrain_tegmentum', 'L', 0.4, 0.6, 0.5), p('tuberal_region_of_HTH', 'L', 0.9, 0.7, 0.5), p('head_of_caudate', 'L', 0.2, 0.3, 0.9), p('cingulate_gyrus_rostral_anterior_part', 'L', 0.5, 0.6, 0.6), p('cingulate_gyrus_caudal_posterior_part', 'L', 0.5, 0.8, 0.5), p('precuneus', 'L', 0.4, 0.5, 0.3)] },
      { n: 'Noradrenalina → cerebelo y médula', col: NA, pts: [p('pontine_tegmentum', 'L', 0.35, 0.9, 0.12), p('tegmentum_of_medulla_oblongata', 'L', 0.6, 0.5, 0.4), cord('C3', 'L', 0.5, 0.4)] },
      { n: 'Serotonina: núcleos del rafe → prosencéfalo', col: HT, pts: [p('pontine_tegmentum', 'L', 0.03, 0.7, 0.5), p('midbrain_tegmentum', 'L', 0.05, 0.45, 0.6), p('tuberal_region_of_HTH', 'L', 0.6, 0.5, 0.5), p('septal_nuclei', 'L', 0.5, 0.5, 0.5), p('medial_orbital_gyrus', 'L', 0.5, 0.6, 0.4), p('superior_frontal_gyrus', 'L', 0.2, 0.5, 0.75)] },
      { n: 'Serotonina: rafe magno → asta posterior', col: HT, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.03, 0.75, 0.6), cord('C1', 'L', 0.55, 0.3), cord('C5', 'L', 0.5, 0.25)] },
      { n: 'Acetilcolina: núcleo basal de Meynert → neocorteza', col: ACH, pts: ['basal_forebrain_L', p('white_matter_of_forebrain', 'L', 0.75, 0.45, 0.6), p('middle_temporal_gyrus', 'L', 0.6, 0.6, 0.6)] },
      { n: 'Acetilcolina: septum medial → hipocampo (fórnix)', col: ACH, pts: ['septal_nuclei_L', p('fornix', 'L', 0.2, 1, 0.5), 'tail_of_hippocampus_L', 'body_of_hippocampus_L'] },
      { n: 'Acetilcolina: tegmento pedunculopontino → tálamo', col: '#f4b6dc', pts: [p('midbrain_tegmentum', 'L', 0.6, 0.15, 0.3), 'centromedian_nucleus_of_thalamus_L'] },
      { n: 'Histamina: núcleo tuberomamilar → corteza', col: '#6fd08c', pts: ['mammillary_region_of_HTH_L', p('thalamus', 'L', 0.2, 0.9, 0.7), p('white_matter_of_forebrain', 'L', 0.4, 0.8, 0.6), p('superior_frontal_gyrus', 'L', 0.5, 0.7, 0.4)] }],
    pasos: [
      { t: 'Locus cerúleo', d: 'Unas 15 000 neuronas pigmentadas por lado en el puente dorsal. Descargan ante estímulos novedosos o relevantes: alerta, atención y respuesta al estrés. Silentes en el sueño REM.', en: p('pontine_tegmentum', 'L', 0.35, 0.9, 0.12) },
      { t: 'Núcleos del rafe', d: 'En la línea media del tronco. Los rostrales (dorsal y mediano) proyectan al prosencéfalo: ánimo, saciedad, ciclo sueño-vigilia. Los caudales (magno) modulan el dolor en la médula.', en: p('pontine_tegmentum', 'L', 0.03, 0.7, 0.5) },
      { t: 'Núcleo basal de Meynert', d: 'Fuente de la acetilcolina cortical: atención y plasticidad. Degenera en la enfermedad de Alzheimer.', en: 'basal_forebrain_L' },
      { t: 'Septum medial', d: 'Marca el ritmo theta del hipocampo.', en: 'septal_nuclei_L' },
      { t: 'Tegmento pedunculopontino y laterodorsal', d: 'Neuronas colinérgicas que despolarizan el tálamo: abren el paso de la información a la corteza durante la vigilia y el sueño REM.', en: p('midbrain_tegmentum', 'L', 0.6, 0.15, 0.3) },
      { t: 'Núcleo tuberomamilar', d: 'Única fuente de histamina; mantiene la vigilia junto con las neuronas de orexina del hipotálamo lateral.', en: 'mammillary_region_of_HTH_L' }],
    clin: 'Antidepresivos: ISRS (bloquean SERT), duales (SERT y NET), IMAO. Anticolinesterásicos en el Alzheimer. Los antihistamínicos H1 sedan. El conjunto forma el sistema activador reticular ascendente: su lesión bilateral en el tegmento pontomesencefálico produce coma.' },

  { id: 'dolor-desc', g: 'modul', n: 'Modulación descendente del dolor', sub: 'La analgesia endógena',
    res: 'El encéfalo puede cerrar la «compuerta» por la que el dolor entra a la médula. Esta vía explica la analgesia del estrés, el efecto placebo y la acción de los opioides.',
    solidos: ['midbrain_tegmentum', 'tegmentum_of_medulla_oblongata', 'cingulate_gyrus_rostral_anterior_part', 'amygdaloid_complex', 'hypothalamus'], capas: { medula: 2 }, lado: 'L', dir: [1, 0.1, 0.1], hemi: 'L',
    tramos: [
      { n: 'Corteza prefrontal y cingulada → sustancia gris periacueductal', col: GLU, pts: [p('cingulate_gyrus_rostral_anterior_part', 'L', 0.4, 0.4, 0.6), p('hypothalamus', 'L', 0.5, 0.7, 0.5), p('midbrain_tegmentum', 'L', 0.06, 0.85, 0.25)] },
      { n: 'Amígdala e hipotálamo → periacueductal', col: '#a8e6b8', pts: ['amygdaloid_complex_L', p('hypothalamus', 'L', 0.7, 0.4, 0.4), p('midbrain_tegmentum', 'L', 0.06, 0.85, 0.25)] },
      { n: 'Periacueductal → bulbo rostroventromedial (rafe magno)', col: N2, pts: [p('midbrain_tegmentum', 'L', 0.06, 0.85, 0.25), p('pontine_tegmentum', 'L', 0.05, 0.5, 0.5), p('tegmentum_of_medulla_oblongata', 'L', 0.04, 0.8, 0.65)] },
      { n: 'Rafe magno → asta posterior (serotonina)', col: HT, pts: [p('tegmentum_of_medulla_oblongata', 'L', 0.04, 0.8, 0.65), cord('C1', 'L', 0.6, 0.3), ...sube('L', 0.6, 0.28, ['C4', 'C7', 'T3', 'T7', 'T11', 'L2']), cord('L4', 'L', 0.4, 0.2)] }],
    pasos: [
      { t: 'Sustancia gris periacueductal', d: 'Rica en receptores opioides μ. Los opioides (endógenos o administrados) inhiben interneuronas GABAérgicas y así desinhiben las neuronas de proyección.', en: p('midbrain_tegmentum', 'L', 0.06, 0.85, 0.25) },
      { t: 'Bulbo rostroventromedial', d: 'Núcleo del rafe magno y formación reticular vecina. Contiene células «OFF» (inhiben el dolor) y «ON» (lo facilitan): la modulación es bidireccional.', en: p('tegmentum_of_medulla_oblongata', 'L', 0.04, 0.8, 0.65) },
      { t: 'Funículo dorsolateral', d: 'Fibras serotoninérgicas y noradrenérgicas (desde el locus cerúleo) descienden hasta el asta posterior.', en: cord('T3', 'L', 0.6, 0.28) },
      { t: 'Asta posterior', d: 'Activan interneuronas de encefalina que inhiben, pre y postsinápticamente, la sinapsis entre el nociceptor y la neurona de proyección. Teoría de la compuerta (Melzack y Wall): las fibras Aβ también cierran la compuerta, por eso frotar alivia.', en: cord('L4', 'L', 0.4, 0.2) }],
    clin: 'Morfina y otros agonistas μ actúan en la sustancia gris periacueductal, el bulbo y el asta posterior. Los antidepresivos duales y tricíclicos refuerzan la inhibición descendente (dolor neuropático). La naloxona revierte parte de la analgesia por placebo.' },

  { id: 'horner', g: 'modul', n: 'Vía oculosimpática', sub: 'Las tres neuronas del síndrome de Horner',
    res: 'La inervación simpática del ojo hace un largo rodeo: baja hasta la médula torácica alta, sale al tórax y vuelve a subir junto a la carótida. Una lesión en cualquier punto produce ptosis leve, miosis y anhidrosis ipsilaterales.',
    solidos: ['hypothalamus', 'tegmentum_of_medulla_oblongata', 'me_C8', 'me_T1', 'me_T2', 'tronco_simpatico', 'a_carotida_interna', 'esclera'], capas: { medula: 2, autonomo: 1, arterias: 1, ojos: 1, craneo: 2, columna: 2, esqueleto: 0 }, lado: 'L', dir: [1, 0.1, 0.5],
    tramos: [
      { n: '1.ª neurona (central): hipotálamo → centro cilioespinal', col: N1, pts: [p('hypothalamus', 'L', 0.6, 0.4, 0.3), p('midbrain_tegmentum', 'L', 0.7, 0.5, 0.4), p('pontine_tegmentum', 'L', 0.75, 0.5, 0.4), p('tegmentum_of_medulla_oblongata', 'L', 0.8, 0.5, 0.45), cord('C2', 'L', 0.6, 0.4), cord('C6', 'L', 0.6, 0.4), cord('T1', 'L', 0.55, 0.5)] },
      { n: '2.ª neurona (preganglionar): T1 → ganglio cervical superior', col: N2, pts: [cord('T1', 'L', 0.55, 0.5), p('ne_T1', 'L', 0.8, 0.3, 0.5), p('tronco_simpatico', 'L', 0.9, 0.86, 0.6), p('tronco_simpatico', 'L', 0.85, 0.93, 0.7), p('tronco_simpatico', 'L', 0.8, 0.985, 0.75)] },
      { n: '3.ª neurona (posganglionar): plexo carotídeo → órbita', col: N3, pts: [p('tronco_simpatico', 'L', 0.8, 0.985, 0.75), p('a_carotida_interna', 'L', 0.6, 0.4, 0.3), p('a_carotida_interna', 'L', 0.4, 0.9, 0.6), p('n_oftalmico', 'L', 0.5, 0.5, 0.5), p('esclera', 'L', 0.5, 0.6, 0.6)] }],
    pasos: [
      { t: 'Hipotálamo', d: 'Las fibras hipotalamoespinales descienden sin cruzar por la parte lateral del tronco encefálico.', en: p('hypothalamus', 'L', 0.6, 0.4, 0.3) },
      { t: 'Bulbo lateral', d: 'Aquí las interrumpe el síndrome de Wallenberg (Horner central, con anhidrosis de la hemicara y el hemicuerpo).', en: p('tegmentum_of_medulla_oblongata', 'L', 0.8, 0.5, 0.45) },
      { t: 'Centro cilioespinal de Budge', d: 'Columna intermediolateral de C8–T2.', en: cord('T1', 'L', 0.55, 0.5) },
      { t: 'Vértice pulmonar y cadena cervical', d: 'La fibra preganglionar sale por T1, pasa sobre el vértice del pulmón y asciende sin hacer sinapsis hasta el ganglio cervical superior. Tumor de Pancoast: Horner preganglionar.', en: p('tronco_simpatico', 'L', 0.9, 0.86, 0.6) },
      { t: 'Ganglio cervical superior', d: 'Sinapsis. Las fibras para las glándulas sudoríparas de la cara siguen a la carótida externa: por eso el Horner posganglionar casi no produce anhidrosis.', en: p('tronco_simpatico', 'L', 0.8, 0.985, 0.75) },
      { t: 'Plexo carotídeo interno', d: 'Disección carotídea: Horner doloroso. Las fibras atraviesan el seno cavernoso y entran en la órbita con el nervio oftálmico y los ciliares largos.', en: p('a_carotida_interna', 'L', 0.4, 0.9, 0.6) },
      { t: 'Efectores', d: 'Músculo dilatador de la pupila (α1) y músculo tarsal superior de Müller.', en: p('esclera', 'L', 0.5, 0.6, 0.6) }],
    clin: 'Localización farmacológica: la apraclonidina revierte la anisocoria (hipersensibilidad por denervación); la hidroxianfetamina dilata la pupila solo si la tercera neurona está intacta. Todo Horner agudo y doloroso es una disección carotídea hasta demostrar lo contrario.' },

  // ───────────────────────────────────────────── LCR
  { id: 'lcr', g: 'lcr', n: 'Circulación del líquido cefalorraquídeo', sub: 'Del plexo coroideo a los senos venosos',
    res: 'Unos 150 mL de LCR, renovados tres o cuatro veces al día, amortiguan el encéfalo (lo hacen «flotar»: su peso efectivo baja de 1400 a unos 50 g), eliminan desechos y mantienen el medio iónico.',
    solidos: ['anterior_horn_of_lateral_ventricle', 'body_of_lateral_ventricle', 'atrium_of_lateral_ventricle', 'posterior_horn_of_lateral_ventricle', 'inferior_horn_of_lateral_ventricle', 'third_ventricle', 'cerebral_aqueduct', 'fourth_ventricle', 'central_canal_of_medulla_oblongata', 'plexo_coroideo'], lado: 'L', dir: [1, 0.2, 0.2], hemi: 'L',
    tramos: [
      { n: 'Ventrículo lateral → foramen interventricular', col: '#7ec8e3', pts: [p('atrium_of_lateral_ventricle', 'L', 0.5, 0.5, 0.5), p('body_of_lateral_ventricle', 'L', 0.5, 0.5, 0.5), p('anterior_horn_of_lateral_ventricle', 'L', 0.2, 0.3, 0.3), p('third_ventricle', 'L', 0.2, 0.8, 0.85)] },
      { n: 'Tercer ventrículo → acueducto → cuarto ventrículo', col: '#7ec8e3', pts: [p('third_ventricle', 'L', 0.2, 0.8, 0.85), p('third_ventricle', 'L', 0.2, 0.5, 0.4), p('cerebral_aqueduct', 'L', 0.2, 0.9, 0.9), p('cerebral_aqueduct', 'L', 0.2, 0.1, 0.1), p('fourth_ventricle', 'L', 0.1, 0.5, 0.5), p('fourth_ventricle', 'L', 0.1, 0.05, 0.3)] },
      { n: 'Abertura media → cisterna magna → espacio subaracnoideo', col: '#a9dcf0', pts: [p('fourth_ventricle', 'L', 0.1, 0.05, 0.3), p('cerebellar_vermis', 'L', 0.3, -0.12, 0.25), p('cerebellar_vermis', 'L', 0.3, 0.3, -0.12), p('occipital_pole', 'L', 0.3, 0.9, -0.25), p('precuneus', 'L', 0.2, 1.15, 0.5), p('paracentral_lobule_rostral_part', 'L', 0.1, 1.2, 0.5)] },
      { n: 'Espacio subaracnoideo espinal', col: '#a9dcf0', pts: [p('cerebellar_vermis', 'L', 0.3, -0.12, 0.25), cord('C2', 'L', 0.1, -0.3), cord('C6', 'L', 0.1, -0.3)] }],
    pasos: [
      { t: 'Plexos coroideos', d: 'Producen ~0,35 mL/min por secreción activa. El LCR tiene menos proteínas, glucosa (2/3 de la plasmática) y K⁺ que el plasma, y más Cl⁻ y Mg²⁺.', en: p('atrium_of_lateral_ventricle', 'L', 0.5, 0.5, 0.5) },
      { t: 'Foramen interventricular (de Monro)', d: 'Comunica cada ventrículo lateral con el tercero. Un quiste coloide puede obstruirlo de forma intermitente.', en: p('third_ventricle', 'L', 0.2, 0.8, 0.85) },
      { t: 'Acueducto cerebral', d: 'El punto más estrecho. Su estenosis causa hidrocefalia obstructiva con dilatación de los ventrículos laterales y el tercero.', en: 'cerebral_aqueduct_L' },
      { t: 'Cuarto ventrículo', d: 'El LCR sale por la abertura media (de Magendie) y las dos laterales (de Luschka).', en: 'fourth_ventricle_L' },
      { t: 'Espacio subaracnoideo y cisternas', d: 'Entre la aracnoides y la piamadre. Cisterna magna, pontina, interpeduncular, cuadrigémina y lumbar (donde se hace la punción).', en: p('cerebellar_vermis', 'L', 0.3, -0.12, 0.25) },
      { t: 'Reabsorción', d: 'Por las granulaciones aracnoideas hacia el seno sagital superior, impulsada por el gradiente de presión, y por vías linfáticas (nervios craneales, linfáticos meníngeos). Durante el sueño aumenta el intercambio con el líquido intersticial (sistema glinfático).', en: p('paracentral_lobule_rostral_part', 'L', 0.1, 1.2, 0.5) }],
    clin: 'Hidrocefalia no comunicante (obstrucción dentro del sistema ventricular) frente a comunicante (falla de reabsorción: hemorragia subaracnoidea, meningitis). Hidrocefalia normotensiva: marcha, demencia, incontinencia. Punción lumbar: presión de apertura normal 10–18 cm H₂O; contraindicada si hay masa con riesgo de herniación.' },
];
