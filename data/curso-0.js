// Curso · Semestre 0: neurobiología celular. Sus 16 unidades viven en curso-0-*.js para mantener cada archivo corto.
import { LECCIONES_0_A } from './curso-0-a.js';
import { LECCIONES_0_B } from './curso-0-b.js';
import { LECCIONES_0_C } from './curso-0-c.js';
import { LECCIONES_0_D } from './curso-0-d.js';

export const SEMESTRE_0 = {
  n: 'Semestre 0',
  sub: 'Neurobiología celular',
  unidades: [...LECCIONES_0_A, ...LECCIONES_0_B, ...LECCIONES_0_C, ...LECCIONES_0_D],
};
