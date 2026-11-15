// Piezas de BodyParts3D que se incluyen en assets/cuerpo.glb.
// n: regex sobre el nombre inglés del elemento · lr: genera _L y _R anteponiendo Left/Right
// c: nombre exacto de concepto (isa_element_parts) · t: triángulos objetivo · g: grupo
const V = ['Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'First', 'Second', 'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth'];
const ord = { First: 1, Second: 2, Third: 3, Fourth: 4, Fifth: 5, Sixth: 6, Seventh: 7, Eighth: 8, Ninth: 9, Tenth: 10, Eleventh: 11, Twelfth: 12 };
const vert = [];
vert.push({ id: 'C1', n: /^Atlas$/, t: 1800, g: 'columna' }, { id: 'C2', n: /^Axis$/, t: 1800, g: 'columna' });
for (const [reg, pre, max] of [['cervical', 'C', 7], ['thoracic', 'T', 12], ['lumbar', 'L', 5]])
  for (const o of V) { const k = ord[o]; if (k > max || (pre === 'C' && k < 3)) continue; vert.push({ id: pre + k, n: new RegExp(`^${o} ${reg} vertebra$`), t: pre === 'L' ? 2200 : 1600, g: 'columna' }); }
vert.sort((a, b) => 'CTL'.indexOf(a.id[0]) - 'CTL'.indexOf(b.id[0]) || +a.id.slice(1) - +b.id.slice(1));

export const VERTEBRAS = vert.map(v => v.id);

export const PIEZAS = [
  // ── cráneo
  { id: 'frontal', n: /^Frontal bone$/, t: 7000, g: 'craneo' },
  { id: 'parietal', lr: 'parietal bone', t: 4500, g: 'craneo' },
  { id: 'occipital', n: /^Occipital bone$/, t: 7000, g: 'craneo' },
  { id: 'temporal', lr: 'temporal bone', t: 6000, g: 'craneo' },
  { id: 'esfenoides', n: /^Sphenoid bone$/, t: 7000, g: 'craneo' },
  { id: 'etmoides', n: /^Ethmoid$/, t: 3500, g: 'craneo' },
  { id: 'maxilar', lr: 'maxilla', t: 3500, g: 'craneo' },
  { id: 'cigomatico', lr: 'zygomatic bone', t: 1000, g: 'craneo' },
  { id: 'nasal', lr: 'nasal bone', t: 300, g: 'craneo' },
  { id: 'lagrimal', lr: 'lacrimal bone', t: 300, g: 'craneo' },
  { id: 'palatino', lr: 'palatine bone', t: 800, g: 'craneo' },
  { id: 'cornete_inferior', lr: 'inferior nasal concha', t: 400, g: 'craneo' },
  { id: 'vomer', n: /^Vomer$/, t: 700, g: 'craneo' },
  { id: 'mandibula', n: /^Mandible$/, t: 5000, g: 'craneo' },
  { id: 'dientes', n: /(incisor|canine|premolar|molar) tooth$/i, t: 6000, g: 'craneo' },
  // ── columna
  ...vert,
  { id: 'sacro', n: /^Sacrum$/, t: 5000, g: 'columna' },
  { id: 'discos', n: /^Intervertebral disk/, t: 5000, g: 'columna' },
  // ── resto del esqueleto
  { id: 'costillas', n: /^(Left|Right) (first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|eleventh|twelfth) rib$/i, t: 16000, g: 'esqueleto' },
  { id: 'esternon', n: /^(Manubrium|Body of sternum|Xiphoid process)$/, t: 1500, g: 'esqueleto' },
  { id: 'clavicula', lr: 'clavicle', t: 600, g: 'esqueleto' },
  { id: 'escapula', lr: 'scapula', t: 2200, g: 'esqueleto' },
  { id: 'humero', lr: 'humerus', t: 1600, g: 'esqueleto' },
  { id: 'radio', lr: 'radius', t: 900, g: 'esqueleto' },
  { id: 'cubito', lr: 'ulna', t: 900, g: 'esqueleto' },
  { id: 'mano', lrn: '(scaphoid|lunate|triquetral|pisiform|trapezium|trapezoid|capitate|hamate|(first|second|third|fourth|fifth) metacarpal bone|(proximal|middle|distal) phalanx of (thumb|index finger|middle finger|ring finger|little finger))', t: 4500, g: 'esqueleto' },
  { id: 'coxal', lr: 'hip bone', t: 3500, g: 'esqueleto' },
  { id: 'femur', lr: 'femur', t: 2200, g: 'esqueleto' },
  { id: 'rotula', lr: 'patella', t: 250, g: 'esqueleto' },
  { id: 'tibia', lr: 'tibia', t: 1600, g: 'esqueleto' },
  { id: 'perone', lr: 'fibula', t: 900, g: 'esqueleto' },
  { id: 'pie', lrn: '(calcaneus|talus|cuboid bone|navicular bone of foot|(medial|intermediate|lateral) cuneiform bone|(first|second|third|fourth|fifth) metatarsal bone|(proximal|middle|distal) phalanx of (big toe|second toe|third toe|fourth toe|little toe))', t: 4500, g: 'esqueleto' },
  // ── piel
  { id: 'piel', n: /^Skin$/, t: 36000, g: 'piel' },
  // ── arterias del encéfalo
  { id: 'a_carotida_interna', lr: 'internal carotid artery', t: 900, g: 'arterias' },
  { id: 'a_cerebral_anterior', lr: 'anterior cerebral artery', t: 500, g: 'arterias' },
  { id: 'a_comunicante_anterior', n: /^Anterior communicating artery$/, t: 120, g: 'arterias' },
  { id: 'a_cerebral_media', lrn: '(sphenoid part of middle cerebral artery|insular part of middle cerebral artery|trunk of inferior terminal branch of middle cerebral artery|(middle temporal|posterior temporal|temporo-occipital) branch of middle cerebral artery|branch of middle cerebral artery to angular gyrus)', t: 6000, g: 'arterias' },
  { id: 'a_lenticuloestriadas', lrn: 'anterolateral central branch of middle cerebral artery', t: 1500, g: 'arterias' },
  { id: 'a_cerebral_posterior', lrn: '((precommunicating|postcommunicating) part of posterior cerebral artery|posteromedial central branch of posterior cerebral artery)', t: 900, g: 'arterias' },
  { id: 'a_comunicante_posterior', lrn: '(posterior communicating artery|hypothalamic branch of posterior communicating artery)', t: 400, g: 'arterias' },
  { id: 'a_coroidea_anterior', lrn: '(anterior choroidal artery|branch of anterior choroidal artery to posterior limb of internal capsule)', t: 700, g: 'arterias' },
  { id: 'a_coroidea_posterior', lr: 'posterior medial choroidal artery', t: 600, g: 'arterias' },
  { id: 'a_oftalmica', lr: 'ophthalmic artery', t: 1200, g: 'arterias' },
  { id: 'a_basilar', n: /^Basilar artery$/, t: 500, g: 'arterias' },
  { id: 'a_pontinas', n: /branch of (left|right) pontine artery$/i, t: 1200, g: 'arterias' },
  { id: 'a_cerebelosa_superior', lrn: '(superior cerebellar artery|(lateral|medial) branch of superior cerebellar artery|superior vermian branch of medial branch of superior cerebellar artery)', t: 1400, g: 'arterias' },
  { id: 'a_cerebelosa_anteroinferior', n: /^Anterior inferior cerebellar artery$/, t: 700, g: 'arterias' },
  { id: 'a_cerebelosa_posteroinferior', lr: 'posterior inferior cerebellar artery', t: 2500, g: 'arterias' },
  { id: 'a_vertebral', lr: 'vertebral artery', t: 700, g: 'arterias' },
  { id: 'a_espinal_anterior', n: /^(Left|Right) anterior spinal artery$/, t: 300, g: 'arterias' },
  { id: 'a_carotida_comun', lr: 'common carotid artery', t: 400, g: 'arterias' },
  // ── ojo y nervios de la órbita
  { id: 'esclera', lr: 'sclera', t: 2500, g: 'ojo' },
  { id: 'cornea', lr: 'cornea', t: 700, g: 'ojo' },
  { id: 'cristalino', lr: 'lens', t: 300, g: 'ojo' },
  { id: 'n_optico', fj: { L: ['FJ1772'], R: ['FJ1819'] }, t: 1500, g: 'nc' },
  { id: 'n_oculomotor', lrn: '(inferior|superior) branch of oculomotor nerve', t: 2200, g: 'nc' },
  { id: 'n_troclear', lr: 'trochlear nerve', t: 1500, g: 'nc' },
  { id: 'n_oftalmico', lr: 'ophthalmic nerve', t: 900, g: 'nc' },
  { id: 'n_frontal', lrn: '(frontal nerve|supra-orbital nerve|supratrochlear nerve)', t: 3000, g: 'nc' },
  { id: 'n_lagrimal', lr: 'lacrimal nerve', t: 1000, g: 'nc' },
  { id: 'n_nasociliar', lrn: '(nasociliary nerve|infratrochlear nerve|anterior ethmoidal nerve|posterior ethmoidal nerve|long ciliary nerve|communicating branch of nasociliary nerve with ciliary ganglion)', t: 1800, g: 'nc' },
  { id: 'ganglio_ciliar', lrn: 'ciliary ganglion', t: 200, g: 'nc', extra: /^Short ciliary nerve$/ },
  // ── complementos del encéfalo (nativos de BodyParts3D)
  { id: 'hipofisis', n: /^Pituitary gland$/, t: 700, g: 'bp_encefalo' },
  { id: 'tentorio', n: /^Tentorium cerebelli$/, t: 4000, g: 'bp_encefalo', espejo: true },
  { id: 'capsula_interna', lr: 'internal capsule', t: 3000, g: 'bp_encefalo' },
  { id: 'plexo_coroideo', n: /^Choroid plexus of cerebral hemisphere$/, t: 3000, g: 'bp_encefalo', porLado: true },
  // ── vísceras (órganos diana del sistema nervioso autónomo)
  { id: 'corazon', c: 'heart', t: 6000, g: 'visceras' },
  { id: 'pulmon', cl: { L: 'left lung', R: 'right lung' }, t: 3500, g: 'visceras' },
  { id: 'traquea', c: 'trachea', t: 800, g: 'visceras' },
  { id: 'esofago', c: 'esophagus', t: 500, g: 'visceras' },
  { id: 'estomago', c: 'stomach', t: 1500, g: 'visceras' },
  { id: 'higado', c: 'liver', t: 3000, g: 'visceras' },
  { id: 'intestino_delgado', c: 'small intestine', t: 6000, g: 'visceras' },
  { id: 'intestino_grueso', c: 'large intestine', t: 5000, g: 'visceras' },
  { id: 'rinon', cl: { L: 'left kidney', R: 'right kidney' }, t: 900, g: 'visceras' },
  { id: 'vejiga', c: 'urinary bladder', t: 500, g: 'visceras' },
  { id: 'diafragma', c: 'diaphragm', t: 2500, g: 'visceras' },
];
