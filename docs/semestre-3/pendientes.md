# Pendientes · Semestre III y simuladores

Actualizado el 2026-11-19.

## Sin fuente leída (los simuladores lo declaran como supuesto)

| Tema | Dónde | Qué falta |
| --- | --- | --- |
| T2* de otros tejidos (LCR, grasa, músculo) | el fMRI usa T2 como respaldo cuando no hay T2* publicado (subestima el decaimiento) | Una tabla abierta de T2* a 3 T; el de sustancia blanca y gris ya está (Oros-Peusquens 2019) |
| Difusividades de tejido (MD, ADC, D∥, D⊥) | el simulador de difusión las toma como parámetros ilustrativos | Una fuente abierta con valores a 3 T (Soares 2013 no trae cifras; Alexander 2007 no dio texto) |
| DP de grasa y músculo | `data/neuroimagen.js` | Medición en la misma escala que West 2013 |
| T1/T2 de grasa y músculo a 1,5 T | se usa el punto medio del rango de Hornak | Medición concreta a 1,5 T |
| Amplitud típica del BOLD, ruido y deriva | parámetros libres del simulador | Valores publicados con su campo y su TE |
| Hueso, arterias y ojo | sin señal / como LCR | Parámetros y un modelo de flujo |

## Unidades

Las 16 unidades están redactadas. Quedó fuera por falta de fuente leída:

| Tema | Unidad | Qué falta |
| --- | --- | --- |
| Anatomía de las arterias y sus territorios | 41 | Se remite a la unidad 8 y al atlas; no se reescribió |
| Hallazgos incidentales en estudios de investigación | 36 | Sin fuente abierta leída |
| Contenido de Hahn 1950 y Lauterbur 1973 | 37, 39 | Solo cita verificada en Crossref |
| Mansfield 1977 (origen de la EPI) | 40 | Solo metadatos; no se usó |
| Texto completo de los trabajos clásicos de los recuadros «Cómo se sabe» | 35–50 | Power 2012 (u46) se leyó completo; Eklund (u48) se leyó en su borrador de arXiv v1 (CC BY), que difiere de la versión de PNAS (1,92 millones de análisis y hasta 60 % frente a 3 millones y 70 %). Copias abiertas buscadas en OpenAlex: Genovese 2002 está en Figshare, pero el PDF es un escaneo sin texto y no hay OCR local; Basser y Le Bihan en HAL solo tienen metadatos (404); Friston y Ashburner en UCL Discovery no exponen PDF; Biswal, Buxton, Detre, Logothetis y Worsley sin copia abierta. Kwong, Ogawa, Fox y Raichle, Raichle 2001, Basser y Eklund tienen PMCID, pero PMC, Europe PMC y PNAS responden 403 o con desafío anti-bot y el XML no trae cuerpo: **no se eludió**. Logothetis, Buxton, Detre y Le Bihan no tienen copia en PMC. Friston 1994, Worsley, Genovese, Biswal y Ashburner siguen sin comprobar |
| Normas actuales sobre implantes y marcapasos | 36 | Hornak y Hartwig no están al día; la unidad remite al protocolo del centro |

## Técnico

- PMC, Europe PMC y PNAS bloquean la descarga automática de varios clásicos (403 o anti-bot).
- Wiley (`onlinelibrary.wiley.com/doi/pdfdirect/...`) devuelve 403 a las descargas automáticas.
- El volumen es esquemático: el espacio subaracnoideo sale de que los rayos topen con hueso en 5 de 6 direcciones a ≤ 12 mm del encéfalo; la grasa subcutánea es la capa de 4 mm bajo la piel; los senos paranasales no existen en el modelo.
