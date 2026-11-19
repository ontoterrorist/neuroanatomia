# Neuroatlas

Atlas interactivo en 3D para aprender **neuroanatomía funcional**, de la anatomía macroscópica a la molécula. Aplicación web estática, en español, sin servidor ni registro.

**Abrir:** https://ontoterrorist.github.io/neuroanatomia/

## Qué contiene

| Sección | Contenido |
| --- | --- |
| **Atlas 3D** | 332 estructuras con ficha (descripción, función, conexiones, irrigación y clínica): encéfalo del atlas humano Allen (141 estructuras por hemisferio), médula espinal segmento a segmento, 12 pares craneales, raíces, plexos y nervios periféricos, cadena simpática, arterias cerebrales, cráneo, columna, esqueleto y vísceras. Capas con tres estados, plano de corte, separación de hemisferios, vista explosionada y cuatro códigos de color (natural, regiones, función, irrigación). |
| **Vías** | 22 vías y circuitos animados sobre el modelo, con recorrido paso a paso: corticoespinal, lemnisco medial, espinotalámica, visual, auditiva, ganglios basales, cerebelo, Papez, dopaminérgicas, LCR, reflejos… |
| **Microescala** | Columna cortical, corteza cerebelosa y sección medular con tractos; neurona con simulador de Hodgkin-Huxley; glía y barrera hematoencefálica; cuatro sinapsis animadas; 20 proteínas con sus estructuras experimentales del PDB (canales, bombas, receptores, SNARE) y 31 neurotransmisores y fármacos en 3D. |
| **Imagen** | Cuatro simuladores sobre un volumen de 1 mm generado desde las mallas del atlas: contraste en RM (eco de espín e inversión-recuperación a 1,5 y 3 T, con T1, DP, T2, FLAIR y STIR), espacio k y reconstrucción por Fourier, ecuaciones de Bloch (T1, T2, T2* y eco de espín) y fMRI (diseño, BOLD con la HRF canónica de SPM, modelo lineal general y comparaciones múltiples). |
| **Curso** | Cuatro semestres enlazados con el modelo: Semestre 0 de neurobiología celular (16 unidades, 0.1–0.16), Semestre I de estructura y Semestre II de función (unidades 1–34), y Semestre III de neuroimagen (unidades 35–50), enlazado con los simuladores. |
| **Evaluación** | 272 preguntas (por semestre y por unidad), 18 casos clínicos de localización e identificación de estructuras sobre el modelo 3D. |

## Desarrollo

Es una página estática: basta servir la carpeta.

```bash
python -m http.server 8830
```

No hay paso de compilación para la aplicación (`index.html`, `css/`, `js/`, `data/`, `vendor/`, `assets/`). Las herramientas de `tools/` solo se usan para regenerar los modelos a partir de las fuentes originales, que no se incluyen en el repositorio (carpeta `raw/`):

```bash
npm install
python tools/extraer.py           # descomprime raw/bp3d-isa/isa.zip (solo si falta la carpeta extraída)
python tools/build-mol.py        # proteínas (PDB) y moléculas (PubChem) -> assets/prot, assets/moleculas.json
node tools/build-meshes.mjs      # encéfalo, cuerpo y médula -> assets/encefalo.glb, assets/cuerpo.glb
node tools/build-nervios.mjs     # nervios esquemáticos -> assets/nervios.glb
node tools/build-volumen.mjs     # volumen de etiquetas de 1 mm para los simuladores -> assets/volumen.bin
node tools/probar-imagen.mjs     # pruebas numéricas de la física de los simuladores
node tools/validar.mjs           # comprueba todas las referencias cruzadas del contenido
```

## Fuentes y licencias

- **Encéfalo:** Allen Human Reference Atlas – 3D (Allen Institute for Brain Science), objeto «brain-male» v1.4 del *3D Reference Object Library* del Human Reference Atlas (HuBMAP). CC BY 4.0. Modificado: ajuste afín al cráneo del modelo corporal y reetiquetado de ocho mallas cuyo nombre venía permutado en el archivo original (ver `tools/allen-fix.mjs`).
- **Médula espinal:** objeto «spinal-cord-male» v1.1 del Human Reference Atlas (Visible Human Male). CC BY 4.0. Modificado: ajustada al conducto vertebral.
- **Cráneo, columna, esqueleto, piel, arterias, ojo, nervios de la órbita, vísceras:** *BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.* Las mallas derivadas (`assets/cuerpo.glb`) se distribuyen bajo esa misma licencia.
- **Volumen de neuroimagen** (`assets/volumen.bin`): voxelización propia de las mallas anteriores; al derivar de BodyParts3D se distribuye bajo CC BY-SA 2.1 JP. Parámetros de tejidos y modelos: ver `data/neuroimagen.js` y `docs/semestre-3/fuentes.md`.
- **Nervios** (`assets/nervios.glb`): trayectos esquemáticos generados por este proyecto sobre referencias óseas; no son una segmentación.
- **Proteínas:** RCSB Protein Data Bank (CC0). **Moléculas:** PubChem (dominio público).
- **Software:** three.js, meshoptimizer y glTF-Transform (MIT).
- **Código de esta aplicación:** MIT. **Textos:** CC BY-SA 4.0.

## Advertencia

Material educativo. Los textos se redactaron para esta aplicación siguiendo el temario habitual de los cursos universitarios y no han pasado por una revisión de especialistas. No es un dispositivo médico ni sustituye a los textos de referencia ni a la formación clínica supervisada.
