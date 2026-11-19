# Pendientes · Semestre III y simuladores

Actualizado el 2026-11-19.

## Sin fuente leída (los simuladores lo declaran como supuesto)

| Tema | Dónde | Qué falta |
| --- | --- | --- |
| T2* de otros tejidos (LCR, grasa, músculo) | el fMRI usa T2 como respaldo cuando no hay T2* publicado (subestima el decaimiento) | Una tabla abierta de T2* a 3 T; el de sustancia blanca y gris ya está (Oros-Peusquens 2019) |
| Difusividades de tejido (D∥, D⊥) | el simulador de difusión las toma como parámetros ilustrativos | Una fuente con D∥ y D⊥ de sustancia blanca humana in vivo a b ≈ 1000 s/mm². Lo leído: agua libre (Le Bihan 1986), ADC escalar a b ≈ 100–180 y el tensor de un lomo de cerdo ex vivo (Basser 1994) |
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
| Ecuaciones y cifras de los clásicos | 35–50 | Los .md de Kwong, Friston, Worsley, Genovese y Basser traen las fórmulas sin decodificar; los tensores de cerebro de gato de Basser (Eq. 19–21) no se leyeron. El OCR de Raichle 2001 está desordenado |
| Normas actuales sobre implantes y marcapasos | 36 | Hornak y Hartwig no están al día; la unidad remite al protocolo del centro |

## Técnico

- Wiley (`onlinelibrary.wiley.com/doi/pdfdirect/...`) devuelve 403 a las descargas automáticas.
- El volumen es esquemático: el espacio subaracnoideo sale de que los rayos topen con hueso en 5 de 6 direcciones a ≤ 12 mm del encéfalo; la grasa subcutánea es la capa de 4 mm bajo la piel; los senos paranasales no existen en el modelo.
