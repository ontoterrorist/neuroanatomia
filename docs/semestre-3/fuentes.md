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

## C. Comprobado con código (tools/probar-imagen.mjs, 32 pruebas)

Orden de contraste en T1 y T2 a ambos campos; el TI calculado anula LCR y grasa; TI → T1·ln 2 cuando TR → ∞; FFT ida y vuelta y Parseval; la HRF suma 1, tiene el pico a 5,0 s y rebote negativo; el GLM recupera β conocidos; la t de Student da P(T > 1,96) ≈ 0,025 con muchos grados de libertad.

## D. Referencias consultadas que no se usaron

| Referencia | Motivo |
| --- | --- |
| Wansapura et al. 1999, *JMRI* (relajación a 3 T) | El resumen en OpenAlex y Europe PMC perdió los asteriscos de T2*: no se puede saber qué cifras son T2 y cuáles T2*. El PDF de Wiley devolvió 403 |
| Stanisz et al. 2005, *MRM* | El resumen no trae cifras; texto no accesible |
| Lu et al. 2005, *JMRI* | Ídem (403) |
| Peters et al. 2007, *MRI* (T2* a 1,5, 3 y 7 T) | Sin resumen en OpenAlex ni Semantic Scholar |
| Gold et al. 2004, *AJR* | El resumen no trae cifras |
