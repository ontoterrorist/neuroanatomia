// Jerarquía anatómica, capas y paletas de color del atlas.
export const ARBOL = [
  { id: 'snc', n: 'Sistema nervioso central', h: [
    { id: 'tel', n: 'Telencéfalo', h: [
      { id: 'ctx', n: 'Corteza cerebral', h: [
        { id: 'ctx.frontal', n: 'Lóbulo frontal' }, { id: 'ctx.parietal', n: 'Lóbulo parietal' }, { id: 'ctx.temporal', n: 'Lóbulo temporal' },
        { id: 'ctx.occipital', n: 'Lóbulo occipital' }, { id: 'ctx.insula', n: 'Ínsula' }, { id: 'ctx.limbico', n: 'Lóbulo límbico' }, { id: 'ctx.olf', n: 'Corteza y vías olfatorias' } ] },
      { id: 'hipocampo', n: 'Formación hipocampal' }, { id: 'amigdala', n: 'Complejo amigdalino' }, { id: 'gb', n: 'Ganglios basales' },
      { id: 'pb', n: 'Prosencéfalo basal y septum' }, { id: 'sb', n: 'Sustancia blanca y comisuras' } ] },
    { id: 'di', n: 'Diencéfalo', h: [
      { id: 'di.talamo', n: 'Tálamo' }, { id: 'di.hipo', n: 'Hipotálamo e hipófisis' }, { id: 'di.epi', n: 'Epitálamo' }, { id: 'di.sub', n: 'Subtálamo' }, { id: 'di.optico', n: 'Vía óptica' } ] },
    { id: 'tronco', n: 'Tronco encefálico', h: [{ id: 'mes', n: 'Mesencéfalo' }, { id: 'pon', n: 'Puente' }, { id: 'bul', n: 'Bulbo raquídeo' }] },
    { id: 'cb', n: 'Cerebelo' },
    { id: 'ven', n: 'Sistema ventricular y LCR' },
    { id: 'medula', n: 'Médula espinal', h: [{ id: 'medula.C', n: 'Segmentos cervicales' }, { id: 'medula.T', n: 'Segmentos torácicos' }, { id: 'medula.L', n: 'Segmentos lumbares' }, { id: 'medula.S', n: 'Segmentos sacros' }] } ] },
  { id: 'snp', n: 'Sistema nervioso periférico', h: [
    { id: 'nc', n: 'Nervios craneales' }, { id: 'raices', n: 'Raíces y nervios espinales' }, { id: 'plexos', n: 'Plexos y nervios de los miembros' }, { id: 'sna', n: 'Sistema nervioso autónomo' } ] },
  { id: 'soporte', n: 'Envolturas, vasos y órganos', h: [
    { id: 'meninges', n: 'Meninges' }, { id: 'arterias', n: 'Arterias del encéfalo' }, { id: 'ojo', n: 'Globo ocular' }, { id: 'craneo', n: 'Cráneo' },
    { id: 'columna', n: 'Columna vertebral' }, { id: 'esqueleto', n: 'Esqueleto' }, { id: 'visceras', n: 'Vísceras (órganos diana)' }, { id: 'piel', n: 'Piel' } ] },
];

// Capas: [id, nombre, grupos (prefijos), estado inicial 0 oculta · 1 visible · 2 translúcida]
export const CAPAS = [
  ['corteza', 'Corteza', ['ctx'], 1], ['blanca', 'Sustancia blanca', ['sb'], 1], ['nucleos', 'Núcleos profundos', ['hipocampo', 'amigdala', 'gb', 'pb', 'di'], 1],
  ['tronco', 'Tronco encefálico', ['mes', 'pon', 'bul'], 1], ['cerebelo', 'Cerebelo', ['cb'], 1], ['ventriculos', 'Ventrículos', ['ven'], 1],
  ['medula', 'Médula espinal', ['medula'], 0], ['craneales', 'Nervios craneales', ['nc'], 0], ['nervios', 'Nervios espinales', ['raices', 'plexos'], 0], ['autonomo', 'S. autónomo', ['sna'], 0],
  ['arterias', 'Arterias', ['arterias'], 0], ['meninges', 'Meninges', ['meninges'], 0], ['ojos', 'Ojos', ['ojo'], 0],
  ['craneo', 'Cráneo', ['craneo'], 0], ['columna', 'Columna', ['columna'], 0], ['esqueleto', 'Esqueleto', ['esqueleto'], 0], ['visceras', 'Vísceras', ['visceras'], 0], ['piel', 'Piel', ['piel'], 0],
];

export const VISTAS = {
  encefalo: { n: 'Encéfalo', capas: { corteza: 1, blanca: 1, nucleos: 1, tronco: 1, cerebelo: 1, ventriculos: 1 }, caja: 'encefalo', dir: [1, 0.25, 0.75] },
  interior: { n: 'Estructuras profundas', capas: { corteza: 2, blanca: 2, nucleos: 1, tronco: 1, cerebelo: 2, ventriculos: 1 }, caja: 'encefalo', dir: [1, 0.3, 0.8] },
  cabeza: { n: 'Cabeza', capas: { corteza: 1, blanca: 1, nucleos: 1, tronco: 1, cerebelo: 1, ventriculos: 1, medula: 1, craneales: 1, arterias: 1, ojos: 1, craneo: 2, columna: 2 }, caja: 'cabeza', dir: [1, 0.15, 0.9] },
  vasos: { n: 'Irrigación', capas: { corteza: 2, blanca: 0, nucleos: 2, tronco: 1, cerebelo: 2, ventriculos: 0, arterias: 1 }, caja: 'encefalo', dir: [0.2, -0.9, 0.6], color: 'irrigacion' },
  neuroeje: { n: 'Neuroeje', capas: { corteza: 1, blanca: 1, nucleos: 1, tronco: 1, cerebelo: 1, ventriculos: 1, medula: 1, nervios: 1, craneo: 2, columna: 2 }, caja: 'neuroeje', dir: [1, 0.05, -0.55] },
  cuerpo: { n: 'Cuerpo entero', capas: { corteza: 1, blanca: 1, nucleos: 1, tronco: 1, cerebelo: 1, ventriculos: 1, medula: 1, craneales: 1, nervios: 1, autonomo: 1, ojos: 1, craneo: 2, columna: 2, esqueleto: 2, piel: 2 }, caja: 'cuerpo', dir: [0.55, 0.1, 1] },
};

export const NATURAL = {
  ctx: '#d9a79b', sb: '#eee4cf', hipocampo: '#d6b08c', amigdala: '#c98f86', gb: '#c39a94', pb: '#c9a39a', di: '#cfa29a', mes: '#d8b8a2', pon: '#dcbfa8', bul: '#dcc2ac', cb: '#cf978a', ven: '#7db9dc',
  medula: '#ead9b8', nc: '#f0d66b', raices: '#f0d66b', plexos: '#eccb58', sna: '#b9a0e8', meninges: '#9fb6cc', arterias: '#cf4038', ojo: '#f1efe8', craneo: '#e9dfc8', columna: '#e9dfc8', esqueleto: '#e4d9c1', visceras: '#bd7b7c', piel: '#d7b59c',
};
export const REGIONES = {
  'ctx.frontal': ['#5b8fd9', 'Lóbulo frontal'], 'ctx.parietal': ['#e0b34a', 'Lóbulo parietal'], 'ctx.temporal': ['#5fb37a', 'Lóbulo temporal'], 'ctx.occipital': ['#d9665f', 'Lóbulo occipital'],
  'ctx.insula': ['#a77bd1', 'Ínsula'], 'ctx.limbico': ['#e58a4f', 'Lóbulo límbico'], 'ctx.olf': ['#c4bd55', 'Corteza olfatoria'], hipocampo: ['#f0d24a', 'Hipocampo'], amigdala: ['#e2574c', 'Amígdala'],
  gb: ['#4fb5b0', 'Ganglios basales'], pb: ['#8f9bd6', 'Prosencéfalo basal'], sb: ['#e3ddca', 'Sustancia blanca'], 'di.talamo': ['#d98ac0', 'Tálamo'], 'di.hipo': ['#f29d7a', 'Hipotálamo'],
  'di.epi': ['#9c7fd0', 'Epitálamo'], 'di.sub': ['#6fa8dc', 'Subtálamo'], 'di.optico': ['#f3e08a', 'Vía óptica'], mes: ['#7fbf8f', 'Mesencéfalo'], pon: ['#5aa0c8', 'Puente'], bul: ['#b08fd0', 'Bulbo'],
  cb: ['#e39a6a', 'Cerebelo'], ven: ['#7ec8e3', 'Ventrículos'], 'medula.C': ['#f2c14e', 'Médula cervical'], 'medula.T': ['#78c2ad', 'Médula torácica'], 'medula.L': ['#6c9bd9', 'Médula lumbar'], 'medula.S': ['#d97bb0', 'Médula sacra'],
};
export const SISTEMAS = {
  motor: ['#e2574c', 'Motor'], somato: ['#4f9bd9', 'Somatosensorial'], visual: ['#9b6fd6', 'Visual'], auditivo: ['#e0b34a', 'Auditivo y vestibular'], lenguaje: ['#e58a4f', 'Lenguaje'],
  memoria: ['#f0d24a', 'Memoria'], emocion: ['#e06aa8', 'Emoción'], ejecutivo: ['#5b8fd9', 'Ejecutivo'], atencion: ['#58c4c0', 'Atención y asociación'], olfato: ['#a9c25a', 'Olfato'], gusto: ['#d98f5f', 'Gusto'],
  recompensa: ['#f27fb0', 'Recompensa'], autonomo: ['#b9a0e8', 'Autónomo y homeostasis'], vigilia: ['#7fd1e8', 'Vigilia y activación'], sueno: ['#6a79d9', 'Sueño y ritmos'], cerebelo: ['#6fc78a', 'Coordinación (cerebelo)'],
  relevo: ['#d98ac0', 'Relevo talámico'], conexion: ['#d9d4c4', 'Sustancia blanca'], lcr: ['#7ec8e3', 'LCR'], hueso: ['#e4d9c1', 'Hueso'], vaso: ['#cf4038', 'Vasos'], meninge: ['#9fb6cc', 'Meninges'],
};
export const ARTERIAS = {
  aca: ['#e8c04d', 'A. cerebral anterior'], acm: ['#e2574c', 'A. cerebral media'], acp: ['#4f9bd9', 'A. cerebral posterior'], coroidea: ['#a77bd1', 'A. coroidea anterior'], lenticulo: ['#f29d7a', 'Aa. lenticuloestriadas'],
  perf: ['#5fb37a', 'Perforantes (ACP, comunicantes)'], basilar: ['#4fb5b0', 'A. basilar (paramedianas)'], sca: ['#9bd67a', 'A. cerebelosa superior'], aica: ['#d9a05f', 'AICA'], pica: ['#d98ac0', 'PICA'],
  vert: ['#8f9bd6', 'A. vertebral / espinal anterior'], espinal: ['#8f9bd6', 'Aa. espinales'],
};
export const LADO = { L: 'izquierdo', R: 'derecho', M: '' };
