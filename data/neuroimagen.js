// Parámetros de los simuladores de neuroimagen. Cada número lleva su fuente; lo que es una decisión del modelo
// está marcado como «supuesto». Detalle y pasajes en docs/semestre-3/fuentes.md.

export const FUENTES = {
  west: 'West J, Blystad I, Engström M, Warntjes JBM, Lundberg P. Application of quantitative MRI for brain tissue segmentation at 1.5 T and 3.0 T field strengths. PLoS ONE 2013, tabla 1 (CC BY 4.0). doi:10.1371/journal.pone.0074795',
  jordan: 'Jordan CD, Saranathan M, Bangerter NK, Hargreaves BA, Gold GE. Musculoskeletal MRI at 3.0 T and 7.0 T: a comparison of relaxation times and image contrast. Eur J Radiol (en línea 2011), tablas 3 y 4 (grasa subcutánea y gastrocnemio a 3 T). doi:10.1016/j.ejrad.2011.09.021',
  hornak: 'Hornak JP. The Basics of MRI, cap. 10 «Image Contrast» (ecuaciones de señal, rangos de T1, T2 y ρ a 1,5 T y regla de ponderación). https://www.cis.rit.edu/htbooks/mri/chap-10/chap-10.htm',
  spm: 'SPM, función spm_hrf.m (Friston; Wellcome Centre for Human Neuroimaging): HRF canónica como diferencia de dos funciones gamma, parámetros por defecto [6 16 1 1 6 0 32]. https://github.com/spm/spm/blob/main/spm_hrf.m',
  friston: 'Friston KJ, Holmes AP, Worsley KJ, Poline JB, Frith CD, Frackowiak RSJ. Statistical parametric maps in functional imaging: a general linear approach. Hum Brain Mapp 1994. doi:10.1002/hbm.460020402',
  ogawa: 'Ogawa S, Lee TM, Kay AR, Tank DW. Brain magnetic resonance imaging with contrast dependent on blood oxygenation. PNAS 1990. doi:10.1073/pnas.87.24.9868',
  atlas: 'Volumen de etiquetas de 1 mm generado por tools/build-volumen.mjs a partir de las mallas del atlas (Allen Human Reference Atlas, CC BY 4.0; BodyParts3D, CC BY-SA 2.1 JP).',
};

// T1 y T2 en ms; PD relativa al agua. West 2013 da R1 (s⁻¹), R2 (s⁻¹) y PD (%); aquí T1 = 1/R1 y T2 = 1/R2.
// sb = «Average white matter», sg = «Frontal cortex», lcr = «CSF».
export const TEJIDOS = {
  sg: { n: 'Sustancia gris', c: '#9aa1ab', '1.5': { T1: 1235, T2: 97.2, PD: 0.881 }, '3': { T1: 1299, T2: 93.5, PD: 0.869 }, f: 'west' },
  sb: { n: 'Sustancia blanca', c: '#e8e3d6', '1.5': { T1: 617, T2: 77.9, PD: 0.645 }, '3': { T1: 725, T2: 72.7, PD: 0.656 }, f: 'west' },
  lcr: { n: 'Líquido cefalorraquídeo', c: '#5b82f2', '1.5': { T1: 4167, T2: 1149, PD: 1.038 }, '3': { T1: 3125, T2: 1266, PD: 0.944 }, f: 'west' },
  // tronco del encéfalo y médula: el atlas no separa gris y blanca; supuesto: mezcla 50/50
  mixto: { n: 'Tronco y médula (mezcla 50/50, supuesto)', c: '#c4c2c0', mezcla: ['sg', 'sb'] },
  // 3 T: Jordan 2011. 1,5 T: punto medio del rango de Hornak (no hay medición única en las fuentes leídas). PD: supuesto, dentro del rango de Hornak.
  grasa: { n: 'Grasa subcutánea', c: '#e6b566', '1.5': { T1: 475, T2: 73.5, PD: 0.9 }, '3': { T1: 404, T2: 48.3, PD: 0.9 }, f: 'jordan', supuesto: 'PD; T1 y T2 a 1,5 T = punto medio del rango de Hornak' },
  musculo: { n: 'Tejido blando (modelado como músculo)', c: '#b5564f', '1.5': { T1: 1385, T2: 43.5, PD: 0.7 }, '3': { T1: 1256, T2: 29.3, PD: 0.7 }, f: 'jordan', supuesto: 'PD; T1 y T2 a 1,5 T = punto medio del rango de Hornak; todo el tejido blando de la cabeza se trata como músculo' },
  hueso: { n: 'Hueso cortical', c: '#d68ad6', cero: true, supuesto: 'sin señal' },
  vaso: { n: 'Arterias', c: '#e05050', cero: true, supuesto: 'sin señal; no se simula el flujo' },
  ojo: { n: 'Globo ocular (modelado como LCR)', c: '#7fd68a', igual: 'lcr', supuesto: 'parámetros del LCR' },
  aire: { n: 'Aire', c: '#000000', cero: true },
};

const RE = {
  lcr: /^(lcr_externo|.*ventricle.*|cerebral_aqueduct|fourth_ventricle|central_canal.*|plexo_coroideo)$/,
  sb: /white_matter|corpus_callosum|commissure|fornix|_tract$|radiation|peduncle|capsula_interna|crus_cerebri|mammillothalamic|n_optico/,
  mixto: /^(basilar_part_of_pons|pontine_tegmentum|tegmentum_of_medulla_oblongata|pyramidal_part_of_medulla_oblongata|me_C1|me_C2|tentorio)$/,
  hueso: /^(frontal|parietal|occipital|temporal|esfenoides|etmoides|maxilar|cigomatico|nasal|lagrimal|palatino|cornete_inferior|vomer|mandibula|dientes|C1|C2)$/,
  vaso: /^a_/, ojo: /^(esclera|cornea|cristalino)$/,
};
/** Tejido de una etiqueta del volumen. */
export function tejidoDe(nombre) {
  if (nombre === 'aire') return 'aire';
  if (nombre === 'piel_grasa') return 'grasa';
  if (nombre === 'tejido_blando') return 'musculo';
  for (const k of ['lcr', 'sb', 'mixto', 'hueso', 'vaso', 'ojo']) if (RE[k].test(nombre)) return k;
  return 'sg';
}

/** Parámetros efectivos {T1, T2, PD} de un tejido a un campo dado ('1.5' o '3'); null si no da señal. */
export function params(tej, B0) {
  const t = TEJIDOS[tej];
  if (t.cero) return null;
  if (t.igual) return params(t.igual, B0);
  return t[B0];
}

// Secuencias de ejemplo. Valores ilustrativos elegidos con la regla de ponderación de Hornak (cap. 10):
// T1 → TR ≤ T1 y TE ≪ T2; T2 → TR ≫ T1 y TE ≥ T2; densidad protónica → TR ≫ T1 y TE ≪ T2.
// En FLAIR y STIR el TI se calcula para anular el LCR o la grasa (ver tiNulo en js/imagen-fisica.js).
export const PRESETS = [
  { id: 't1', n: 'Ponderada en T1', sec: 'se', TR: 500, TE: 10 },
  { id: 'dp', n: 'Densidad protónica', sec: 'se', TR: 4000, TE: 10 },
  { id: 't2', n: 'Ponderada en T2', sec: 'se', TR: 4000, TE: 100 },
  { id: 'flair', n: 'FLAIR (anula el LCR)', sec: 'ir', TR: 9000, TE: 100, anula: 'lcr' },
  { id: 'stir', n: 'STIR (anula la grasa)', sec: 'ir', TR: 4000, TE: 30, anula: 'grasa' },
];

// HRF canónica de SPM (spm_hrf.m, valores por defecto): retardo de la respuesta 6 s, del rebote 16 s,
// dispersiones 1 y 1, razón respuesta/rebote 6, inicio 0 s, longitud 32 s.
export const HRF_SPM = { p1: 6, p2: 16, d1: 1, d2: 1, razon: 6, largo: 32 };
