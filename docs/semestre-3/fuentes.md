# Libro de fuentes · Semestre III y simuladores de neuroimagen

Reglas: las mismas del Semestre 0. Cada número de los simuladores tiene su entrada; lo que es decisión del modelo está marcado como **supuesto** en `data/neuroimagen.js` y en el recuadro «Límites del modelo» de cada simulador.

## A. Temario

| Clave | Obra | URL | Qué se leyó (2026-11-18) |
| --- | --- | --- | --- |
| HST583 | MIT OCW HST.583 *Functional Magnetic Resonance Imaging: Data Acquisition and Analysis*, otoño 2008 (Gollub y otros) | https://ocw.mit.edu/courses/hst-583-functional-magnetic-resonance-imaging-data-acquisition-and-analysis-fall-2008/pages/syllabus/ | Descripción, sílabo y calendario completo (25 sesiones en 7 partes). Apuntes sin abrir |

## B. Parámetros de los simuladores

| Dato en la app | Valor | Fuente y pasaje |
| --- | --- | --- |
| Ecuaciones de señal de eco de espín e inversión-recuperación (180-90-180) | S = kρ(1−e^(−TR/T1))e^(−TE/T2); S = kρ(1−2e^(−TI/T1)+e^(−TR/T1))e^(−TE/T2) | Hornak, *The Basics of MRI*, cap. 10 «Image Contrast», lista de ecuaciones de señal. https://www.cis.rit.edu/htbooks/mri/chap-10/chap-10.htm |
| Regla de ponderación de los presets | T1: TR ≤ T1, TE ≪ T2 · T2: TR ≫ T1, TE ≥ T2 · ρ: TR ≫ T1, TE ≪ T2 | Hornak cap. 10, tabla de condiciones para imágenes ponderadas. Los valores concretos de TR y TE son **ilustrativos** |
| Rangos de T1, T2 y ρ a 1,5 T de músculo y grasa | músculo T1 0,95–1,82 s, T2 20–67 ms; adiposo T1 0,2–0,75 s, T2 53–94 ms | Hornak cap. 10, tabla de tejidos de la cabeza a 1,5 T. La app usa el **punto medio** (supuesto) |
| Sustancia blanca, gris y LCR a 1,5 y 3 T | T1 = 1/R1, T2 = 1/R2, PD | West et al. 2013, *PLoS ONE*, tabla 1 (CC BY 4.0), filas «Average white matter», «Frontal Cortex» y «CSF». Europe PMC PMC3774721. 1,5 T: R1 1,62 / 0,81 / 0,24 s⁻¹; R2 12,84 / 10,29 / 0,87 s⁻¹; PD 64,51 / 88,06 / 103,76 %. 3 T: R1 1,38 / 0,77 / 0,32; R2 13,76 / 10,69 / 0,79; PD 65,60 / 86,88 / 94,40 % |
| Grasa subcutánea y músculo a 3 T | grasa T1 403,8 ms, T2 48,3 ms; músculo (gastrocnemio lateral) T1 1255,9 ms, T2 29,3 ms | Jordan et al., *Eur J Radiol* (en línea 2011), tablas 3 y 4, columna 3,0T. PMC3310288 (leído vía NCBI efetch; licencia: minería de texto y uso legítimo) |
| HRF canónica | doble gamma, parámetros [6 16 1 1 6 0 32], normalizada a suma 1; «el pico … alrededor de 5 segundos» (paráfrasis del comentario) | `spm_hrf.m` de SPM (GitHub spm/spm, rama main), leído completo |
| Modelo lineal general para mapas estadísticos | Y = Xβ + ε; t por contraste | Friston et al. 1994, *Hum Brain Mapp*, doi:10.1002/hbm.460020402 (resumen leído) |
| Contraste BOLD | la desoxihemoglobina venosa es un contraste paramagnético natural | Ogawa et al. 1990, *PNAS*, doi:10.1073/pnas.87.24.9868 (resumen leído) |
| Equilibrio tras varios TR | «a few equilibrating cycles» antes de adquirir | Hornak cap. 10 |
| T2* de sustancia blanca y gris a 3 T (fMRI y Bloch) | blanca 50,0 ± 2,2 ms; gris 55,7 ± 2,6 ms (21 voluntarios) | Oros-Peusquens et al. 2019, PMC6934004 (CC BY), texto completo. El eco de gradiente del fMRI usa estos T2*; para los tejidos sin T2* publicado cae a T2, **supuesto** que subestima el decaimiento (T2* ≤ T2) |
| Señal de difusión | S/S0 = exp(−b·D); b ≈ 1000 s/mm²; ≥ 6 direcciones no colineales y una imagen sin gradiente | Hornak cap. 13 «Diffusion imaging»; Soares 2013 (texto completo) |
| MD y FA | MD = (λ₁+λ₂+λ₃)/3; FA = √(3/2)·√Σ(λᵢ−MD)² / √Σλᵢ² | Soares 2013 |
| Criterios de término de la tractografía | FA mínima 0,1–0,3 (adulto); giro máximo 40–70° | Soares 2013 (texto completo) |
| Cruces de fibras | direcciones erróneas y terminaciones abruptas; afectan más a FA, axial y radial que a MD | Soares 2013 |
| Ejes del tejido y autovectores | los ejes coinciden con los autovectores del tensor | Basser et al. 1994 (resumen) |
| Difusividades D∥, D⊥ y de fondo, campo de 24×24, tensor plano, ruido de Rice | **supuestos**: parámetros ilustrativos, sin valor leído | Declarados en el recuadro «Límites del modelo» del simulador y en `FUENTES.difusion` |
| Agentes de contraste y supresión de grasa (unidad 38) | relaxividad r₁, Gd³⁺, agentes ferromagnéticos que alteran T2*, cautela por FSN; saturación frente a inversión-recuperación | Hornak cap. 8 «Chemical Contrast Agents» y «Fat Suppression» (texto completo; paráfrasis) |

## C. Comprobado con código (tools/probar-imagen.mjs, 53 pruebas)

A lo anterior se suman: T2* de eco de gradiente frente a eco de espín con los valores publicados; en difusión, ADC a lo largo y a través de la fibra, autovalores, S/S0, MD, FA, ajuste del tensor sin ruido, caída de la FA en un cruce, ruido reproducible por semilla, trayectoria que cruza el arco y umbrales de FA y de giro.

Orden de contraste en T1 y T2 a ambos campos; el TI calculado anula LCR y grasa; TI → T1·ln 2 cuando TR → ∞; FFT ida y vuelta y Parseval; la HRF suma 1, tiene el pico a 5,0 s y rebote negativo; el GLM recupera β conocidos; la t de Student da P(T > 1,96) ≈ 0,025 con muchos grados de libertad.

## D. Referencias consultadas que no se usaron

| Referencia | Motivo |
| --- | --- |
| Wansapura et al. 1999, *JMRI* (relajación a 3 T) | El resumen en OpenAlex y Europe PMC perdió los asteriscos de T2*: no se puede saber qué cifras son T2 y cuáles T2*. El PDF de Wiley devolvió 403 |
| Stanisz et al. 2005, *MRM* | El resumen no trae cifras; texto no accesible |
| Lu et al. 2005, *JMRI* | Ídem (403) |
| Peters et al. 2007, *MRI* (T2* a 1,5, 3 y 7 T) | Sin resumen en OpenAlex ni Semantic Scholar |
| Gold et al. 2004, *AJR* | El resumen no trae cifras |

## E. Textos abiertos leídos para las unidades (2026-11-18)

| Clave | Obra | Acceso | Licencia o condición |
| --- | --- | --- | --- |
| HORNAK | Hornak JP, *The Basics of MRI*, caps. 1, 3–11, 12 («Fast imaging techniques», archivo `chap-8a`), 13 («Advanced imaging techniques», archivo `chap-12`) y 14 («Your MRI exam», archivo `chap-13`) | https://www.cis.rit.edu/htbooks/mri/ | © Hornak, lectura libre: paráfrasis y cita |
| GLOVER | Glover GH, «Overview of functional magnetic resonance imaging», *Neurosurg Clin N Am* 2011, doi:10.1016/j.nec.2010.11.001 | PMC3073717 (texto completo vía NCBI) | Minería de texto y uso legítimo |
| SOARES16 | Soares JM et al., «A hitchhiker’s guide to functional magnetic resonance imaging», *Front Neurosci* 2016, doi:10.3389/fnins.2016.00515 | PMC5102908 | CC BY |
| SOARES13 | Soares JM et al., «A hitchhiker’s guide to diffusion tensor imaging», *Front Neurosci* 2013, doi:10.3389/fnins.2013.00031 | PMC3594764 | CC BY |
| OROS | Oros-Peusquens AM et al., T2* de la sustancia blanca y gris a 3 T, 2019 | PMC6934004 | CC BY |
| POWER | Power JD et al., «Spurious but systematic correlations in functional connectivity MRI networks arise from subject motion», *NeuroImage* 2012 | PMC3254728 (manuscrito de autor, vía NCBI efetch): **texto completo** | Mínera de texto y uso legítimo |
| LINDQUIST | Lindquist MA, «The statistical analysis of fMRI data», *Statistical Science* 2008 | arXiv:0906.3662 (PDF completo) | arXiv |
| ATTWELL | Attwell D et al., «Glial and neuronal control of brain blood flow», *Nature* 2010, doi:10.1038/nature09613 | PMC3206737 (manuscrito) | Minería de texto y uso legítimo |
| ALSOP | Alsop DC et al., «Recommended implementation of arterial spin-labeled perfusion MRI for clinical applications», *Magn Reson Med* 2015, doi:10.1002/mrm.25197 | PMC4190138 (manuscrito) | Minería de texto y uso legítimo |
| HARTWIG | Hartwig V et al., «Biological effects and safety in magnetic resonance imaging: a review», *Int J Environ Res Public Health* 2009, doi:10.3390/ijerph6061778 | PMC2705217 | CC BY |
| FISCHL | Fischl B, «FreeSurfer», *NeuroImage* 2012, doi:10.1016/j.neuroimage.2012.01.021 | PMC3685476 (manuscrito) | Minería de texto y uso legítimo |
| HELSINKI | Asociación Médica Mundial, Declaración de Helsinki, enmendada en Helsinki, octubre de 2024 | https://www.wma.net/policies-post/wma-declaration-of-helsinki/ | © AMM: paráfrasis |
| WEST | Ver sección B | | CC BY 4.0 |

Resúmenes leídos (Europe PMC, OpenAlex o Semantic Scholar): Kwong et al. 1992 *PNAS* (doi:10.1073/pnas.89.12.5675) · Ogawa et al. 1990 *PNAS* · Fox y Raichle 1986 *PNAS* (doi:10.1073/pnas.83.4.1140) · Raichle et al. 2001 *PNAS* (doi:10.1073/pnas.98.2.676) · Logothetis et al. 2001 *Nature* (doi:10.1038/35084005) · Buxton, Wong y Frank 1998 *Magn Reson Med* (doi:10.1002/mrm.1910390602) · Detre et al. 1992 *Magn Reson Med* (doi:10.1002/mrm.1910230106) · Le Bihan et al. 1986 *Radiology* (doi:10.1148/radiology.161.2.3763909) · Basser, Mattiello y Le Bihan 1994 *Biophys J* (doi:10.1016/s0006-3495(94)80775-1) · Glover 1999 *NeuroImage* (doi:10.1006/nimg.1998.0419) · Friston et al. 1994 *Hum Brain Mapp* · Worsley et al. 1992 *J Cereb Blood Flow Metab* (doi:10.1038/jcbfm.1992.127) · Genovese, Lazar y Nichols 2002 *NeuroImage* (doi:10.1006/nimg.2001.1037) · Eklund, Nichols y Knutsson 2016 *PNAS* (doi:10.1073/pnas.1602413113) · Biswal et al. 1995 *Magn Reson Med* (doi:10.1002/mrm.1910340409) · Power et al. 2012 *NeuroImage* (doi:10.1016/j.neuroimage.2011.10.018) · Ashburner y Friston 2000 *NeuroImage* (doi:10.1006/nimg.2000.0582).

Solo cita verificada (Crossref): Hahn EL, «Spin Echoes», *Phys Rev* 80: 580–594, 1950 (doi:10.1103/PhysRev.80.580) · Lauterbur PC, «Image formation by induced local interactions», *Nature* 242: 190–191, 1973 (doi:10.1038/242190a0).

## F. Respaldo por unidad (paráfrasis; cifras con su fuente)

| Unidad | Afirmaciones | Fuente y pasaje |
| --- | --- | --- |
| 35 | ~63 % de los átomos del cuerpo son H; vóxel y píxel; corte tomográfico | HORNAK cap. 1 |
| 35 | Ventajas de la fMRI (1,5 T clínico, sin radioisótopo, costo, resolución); tabla: fMRI 3–4 mm, ≤0,5 mm a 7 T; PET ≥5–10 mm y minutos; NIRS 10–20 mm; EEG/MEG >10–20 mm y ms; pico BOLD 5–6 s; debilidades | GLOVER, «Introduction», «Comparisons with other functional imaging modalities», «Strengths and weaknesses» |
| 35 | BOLD indirecto y compuesto (flujo, volumen, oxigenación) | SOARES16, «Introduction» |
| 35 | Cómo se sabe: 1,8 % ± 0,8 % en V1 con 8 Hz, siete voluntarios; M1 al apretar la mano | Kwong 1992, resumen |
| 36 | Riesgos; guías FDA 2003 (B₀ 8 T; SAR 4 W/kg cuerpo en 15 min, 3 W/kg cabeza en 10 min); el balde atraído desde ~10 pies (3 m) por un imán de 1,5 T | HORNAK cap. 9 «Safety» |
| 36 | Cribado; peso y talla para la SAR; esquirlas o clips pueden girar | HORNAK cap. 14 «Screening» |
| 36 | Gradientes 100–1000 Hz y RF 10–400 MHz; vértigo, náuseas, sabor metálico; nervios periféricos y umbral cardíaco; ojos y testículos; quemaduras por cables; implantes alargados o activos; 4 W/kg para ≤0,6 °C en 20–30 min | HARTWIG |
| 36 | Comité de ética, riesgos y beneficios, consentimiento, derecho a retirarse, privacidad | HELSINKI |
| 37 | ν = γB, γ = 42,58 MHz/T; Boltzmann; magnetización neta; marco rotatorio; pulso de 90°; T1 y T2, T2 ≤ T1; T2*; T1 depende del campo; ecuaciones de Bloch | HORNAK cap. 3 |
| 37 | Eco de espín, TE; inversión-recuperación y TI = T1·ln 2 | HORNAK cap. 4 |
| 37 | Eco de gradiente decae con T2*, más sensible a inhomogeneidades | HORNAK cap. 10 (ecuaciones) y cap. 12 |
| 37 | Cálculos de Larmor y T1/T2 | `calculos/s3-37.mjs` con WEST |
| 38 | Variables intrínsecas e instrumentales; C = SA − SB; ecuaciones; reglas de ponderación; ciclos de equilibrio | HORNAK cap. 10 |
| 38 | Estudio de qMRI (10 voluntarios, 1,5 y 3 T; segmentación en el espacio R1–R2–PD; volumen parcial) | WEST, resumen y tabla 1 |
| 39 | Gradientes, isocentro, codificación en frecuencia, selección de corte (espectro sinc), retroproyección (Radon inversa) | HORNAK cap. 6 |
| 39 | Secuencia de 5 piezas, 128 o 256 repeticiones, TR; FOV/N y límites de la resolución | HORNAK cap. 7 |
| 39 | 2D-FT y espacio k | HORNAK caps. 5 y 12 |
| 39 | 1 s × 256 = 4 min 16 s | HORNAK cap. 8 |
| 39 | Primeros equipos comerciales en los años ochenta | HORNAK cap. 9 |
| 40 | Eco de gradiente con ángulo pequeño; eco de espín rápido; EPI en un TR; imagen en paralelo | HORNAK cap. 12 |
| 40 | Tabla de artefactos (desplazamiento químico 3,5 ppm ≈ 220 Hz a 1,5 T) | HORNAK cap. 11 |
| 40 | EPI ~60 ms por imagen; ~32 cortes con TR 2 s; ~9 ppm aire-tejido y regiones afectadas | GLOVER |
| 40 | Tres artefactos de la EPI; remedios; el movimiento como artefacto principal | SOARES16 «Artifacts» |
| 41 | 2 % de la masa y 20 % de la energía; señalización anticipatoria (glutamato, NO, derivados del araquidónico; efecto según O₂, en debate); pericitos cada ~50 μm; 8–23 μm frente a 70–160 μm; regulación capilar no demostrada in vivo fisiológicamente; daño de pericitos tras el ictus; experimentos con pericitos | ATTWELL |
| 41 | Modelo metabólico (CO₂, NO, H⁺ sobre las arteriolas) | GLOVER |
| 42 | r = 0,87 en reposo; +29 % FSC frente a +5 % CMRO₂ | Fox y Raichle 1986, resumen |
| 42 | FEO uniforme en reposo; modo por defecto | Raichle 2001, resumen |
| 42 | Flujo ≥ 4 veces el ATP; glucólisis frente a fosforilación oxidativa; BOLD y potenciales de campo; ejemplo del cerebelo | ATTWELL |
| 42 | LFP frente a espigas | Logothetis 2001, resumen |
| 43 | Hb y HbO₂; secuencia temporal; eco de gradiente y vénulas; eco de espín a campos altos; < 1 % | GLOVER |
| 43 | TE óptimo ≈ T2* local; T2* de 50,0 y 55,7 ms a 3 T | SOARES16; OROS |
| 38 | Agentes de contraste, relaxividad, supresión de grasa | HORNAK cap. 8 |
| 43 | BOLD ≈ hiperemia − consumo de O₂ | ATTWELL |
| 43 | Caída inicial, sobrepaso y rebote | Buxton 1998, resumen |
| 43 | Cómo se sabe | Ogawa 1990, resumen; «en ratas»: GLOVER |
| 44 | Contraste inyectado o ASL; desventajas del ASL | GLOVER |
| 44 | Saturación en el cuello, trazador endógeno | Detre 1992, resumen |
| 44 | < 1 %; movimiento; consenso de Ámsterdam 2012; recomendaciones; PLD 2000 ms; validación con PET | ALSOP |
| 44 | Secuencia de difusión | HORNAK cap. 13 |
| 44 | ADC | Le Bihan 1986, resumen |
| 44 | Anisotropía; tensor; MD, FA; FACT y probabilística; varias orientaciones; HARDI, DSI, QBI; umbrales de FA y de giro; cruces | SOARES13 |
| 44 | Simulador de difusión (`i:difusion`) | Hornak cap. 13, SOARES13, Basser 1994; supuestos en `FUENTES.difusion` |
| 44 | Cómo se sabe | Basser 1994, resumen |
| 45 | Diseños, jitter, comparaciones, líneas de base, recomendaciones, potencia | SOARES16 «Experimental design», «Power analyses» |
| 45 | Bloques para detectar, eventos para caracterizar; control de confusiones; ruido del escáner | GLOVER |
| 45 | Cómo se sabe | Glover 1999, resumen |
| 46 | Lista de pasos | GLOVER |
| 46 | Tiempo de corte, cuerpo rígido, regla de un vóxel, scrubbing; Talairach y MNI152; normalización; suavizado; frecuencias; filtros; plegamiento del ruido | SOARES16 |
| 46 | Cómo se sabe: FD (6 parámetros, esfera de 50 mm), DVARS, umbrales FD > 0,5 mm y DVARS > 0,5 %, 1 volumen antes y 2 después, ~25 % de datos perdidos en niños a 3 T | POWER, texto completo |
| 47 | Y = Xβ + ε; convolución con HRF; primer nivel; crítica | SOARES16 |
| 47 | Sistema lineal invariante; AR(p), ARMA(1,1); deriva | LINDQUIST |
| 47 | Ruido, regresores sin interés, blanqueado | GLOVER |
| 47 | Cómo se sabe | Friston 1994, resumen |
| 48 | Dos niveles y efectos mixtos | LINDQUIST |
| 48 | Pruebas de grupo y permutación; 100 000 pruebas; FWER, FDR, cúmulos, ROI; tamaño del efecto | SOARES16 |
| 48 | Inferencias de grupo | GLOVER |
| 48 | p del máximo y resels; FDR | Worsley 1992 y Genovese 2002, resúmenes |
| 48 | Cómo se sabe | Eklund 2016, resumen |
| 49 | Conectividad funcional y efectiva | LINDQUIST § 6.3 |
| 49 | Métodos; ICA; redes en reposo; Granger, DCM, SEM, PPI, MVPA | SOARES16 |
| 49 | Redes y enfermedad | GLOVER |
| 49 | Cómo se sabe | Biswal 1995, resumen; Raichle 2001 |
| 50 | Pasos de la VBM | Ashburner y Friston 2000, resumen |
| 50 | FreeSurfer y validación del grosor | FISCHL |
| 50 | Registro de superficie | SOARES16 |
| 50 | Integración multimodal | SOARES13 |
| 50 | Biomarcadores y planificación prequirúrgica | GLOVER |
