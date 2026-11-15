// Corrección de etiquetas del objeto 3D «brain-male» v1.4 del Human Reference Atlas.
// Ocho mallas (las últimas añadidas al archivo) traen el nombre permutado: su posición y forma
// no corresponden a la etiqueta. Se reasignan según su geometría (clave = nombre en el archivo).
//   p. ej. la malla «posteroventral_putamen» es un arco medial dorsal al cíngulo (giro paracingular),
//   y la malla «frontal_pole» va del cuerpo geniculado lateral al lóbulo occipital (radiación óptica).
export const CORRIGE = {
  optic_radiation: 'posteroventral_putamen',
  posteroventral_putamen: 'paracingulate_gyrus',
  atrium_of_lateral_ventricle: 'rostral_gyrus',
  paracingulate_gyrus: 'frontomarginal_gyrus',
  rostral_gyrus: 'frontal_pole',
  frontomarginal_gyrus: 'perirhinal_gyrus_rostral_part_of_FuGt',
  frontal_pole: 'optic_radiation',
  perirhinal_gyrus_rostral_part_of_FuGt: 'atrium_of_lateral_ventricle',
};
export const nombreAllen = (n) => { const b = n.replace(/^(Allen|VH_M)_/, '').replace(/_(L|R)$/, ''); return CORRIGE[b] || b; };
