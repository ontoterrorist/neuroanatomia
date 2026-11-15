// Créditos, fuentes y licencias.
export const CREDITOS = `
<div class="sobre">Créditos y fuentes</div>
<h1>Neuroatlas</h1>
<p>Atlas interactivo de neuroanatomía funcional, de la anatomía macroscópica a la molécula. Material educativo: no es un dispositivo médico ni sustituye a los textos de referencia ni a la formación clínica supervisada.</p>
<h3>Modelos anatómicos</h3>
<ul>
<li><strong>Encéfalo (141 estructuras por hemisferio):</strong> Allen Human Reference Atlas – 3D, Allen Institute for Brain Science, en la versión del <em>3D Reference Object Library</em> del Human Reference Atlas (HuBMAP), objeto «brain-male» v1.4, modelado por Kristen Browne y Heidi Schlehlein. Licencia <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>. <a href="https://humanatlas.io/3d-reference-library" target="_blank" rel="noopener">humanatlas.io</a>.<br><em>Cambios:</em> escalado afín (4–7 %) para ajustarlo al cráneo del modelo corporal; como el atlas es simétrico, el lado de cada malla se asignó por su posición (izquierda del sujeto = +x); ocho mallas cuyo nombre venía permutado en el archivo (radiación óptica, polo frontal, atrio ventricular, giros paracingular, rostral, frontomarginal y perirrinal, y putamen posteroventral) se reetiquetaron según su geometría.</li>
<li><strong>Médula espinal (30 segmentos):</strong> objeto «spinal-cord-male» v1.1 del Human Reference Atlas (Visible Human Male, NLM). CC BY 4.0. <em>Cambios:</em> eje ajustado al conducto vertebral del modelo corporal.</li>
<li><strong>Cráneo, columna, esqueleto, piel, arterias cerebrales, globo ocular, nervios de la órbita, hipófisis, cápsula interna, plexos coroideos, tentorio y vísceras:</strong> BodyParts3D 4.0. <em>BodyParts3D, © The Database Center for Life Science licensed under CC Attribution-Share Alike 2.1 Japan.</em> <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/" target="_blank" rel="noopener">dbarchive.biosciencedbc.jp</a>. Mitsuhashi N. et al., <em>Nucleic Acids Res.</em> 2009; 37: D782–5. <em>Cambios:</em> piezas agrupadas, simplificadas y convertidas a glTF. Las mallas derivadas se distribuyen bajo la misma licencia (<a href="https://creativecommons.org/licenses/by-sa/2.1/jp/deed.es" target="_blank" rel="noopener">CC BY-SA 2.1 JP</a>).</li>
<li><strong>Nervios craneales (salvo los de la órbita), raíces y nervios espinales, plexos, nervios de los miembros y sistema autónomo:</strong> trayectos <em>esquemáticos</em> generados por este proyecto a partir de referencias óseas del modelo. Son una aproximación didáctica, no una segmentación.</li>
</ul>
<h3>Nivel molecular</h3>
<ul>
<li><strong>Proteínas:</strong> coordenadas experimentales del <a href="https://www.rcsb.org" target="_blank" rel="noopener">RCSB Protein Data Bank</a> (dominio público, CC0): 6AGF, 2R9R, 1K4C, 5GJV, 3J5P, 2ZXE, 4M48, 5I6X, 3KG2, 4PE5, 6HUO, 3JAD, 2BG9, 6DDF, 6CM4, 6N51, 1F88, 1SFC, 4EY7 y 1JFF. Cada ficha cita a sus autores. Se muestra la traza de carbonos α; la posición de la membrana es una estimación propia.</li>
<li><strong>Moléculas pequeñas:</strong> confórmeros 3D de <a href="https://pubchem.ncbi.nlm.nih.gov" target="_blank" rel="noopener">PubChem</a> (NCBI, dominio público).</li>
</ul>
<h3>Escenas celulares y simulador</h3>
<p>La neurona, la glía, las sinapsis y los microcircuitos son modelos procedurales a escala aproximada. El simulador implementa las ecuaciones de Hodgkin y Huxley (<em>J. Physiol.</em> 1952; 117: 500–44) con sus parámetros originales.</p>
<h3>Contenido</h3>
<p>Los textos se redactaron para esta aplicación siguiendo el temario habitual de los cursos universitarios de neuroanatomía y neurociencia, y no han pasado por una revisión de especialistas. Obras de consulta recomendadas: Kandel et al., <em>Principles of Neural Science</em>; Purves et al., <em>Neuroscience</em>; Blumenfeld, <em>Neuroanatomy through Clinical Cases</em>; Haines, <em>Neuroanatomía: atlas de estructuras, secciones y sistemas</em>; Snell, <em>Neuroanatomía clínica</em>; Nieuwenhuys et al., <em>El sistema nervioso central humano</em>. Si encuentras un error, avisa en el repositorio.</p>
<h3>Software</h3>
<p><a href="https://threejs.org" target="_blank" rel="noopener">three.js</a> (MIT) para el render; <a href="https://meshoptimizer.org" target="_blank" rel="noopener">meshoptimizer</a> y <a href="https://gltf-transform.dev" target="_blank" rel="noopener">glTF-Transform</a> (MIT) para preparar las mallas. Código de la aplicación: licencia MIT. Textos: CC BY-SA 4.0.</p>
`;
