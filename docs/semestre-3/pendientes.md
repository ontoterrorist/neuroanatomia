# Pendientes · Semestre III y simuladores

Actualizado el 2026-11-18.

## Sin fuente leída (los simuladores lo declaran como supuesto)

| Tema | Dónde | Qué falta |
| --- | --- | --- |
| T2* de sustancia gris y blanca | fMRI usa T2 en lugar de T2*; Bloch modela T2* solo como desfase | Una tabla legible de T2* a 3 T (Peters 2007 o equivalente abierto) |
| DP de grasa y músculo | `data/neuroimagen.js` | Medición en la misma escala que West 2013 |
| T1/T2 de grasa y músculo a 1,5 T | se usa el punto medio del rango de Hornak | Medición concreta a 1,5 T |
| Amplitud típica del BOLD, ruido y deriva | parámetros libres del simulador | Valores publicados con su campo y su TE |
| Hueso, arterias y ojo | sin señal / como LCR | Parámetros y un modelo de flujo |

## Unidades

Las 16 unidades están redactadas. Quedó fuera por falta de fuente leída:

| Tema | Unidad | Qué falta |
| --- | --- | --- |
| Anatomía de las arterias y sus territorios | 41 | Se remite a la unidad 8 y al atlas; no se reescribió |
| Agentes de contraste (gadolinio) y supresión de grasa | 38 | No se leyeron esos apartados de Hornak cap. 8 |
| Hallazgos incidentales en estudios de investigación | 36 | Sin fuente abierta leída |
| Contenido de Hahn 1950 y Lauterbur 1973 | 37, 39 | Solo cita verificada en Crossref |
| Mansfield 1977 (origen de la EPI) | 40 | Solo metadatos; no se usó |
| Texto completo de los trabajos clásicos de los recuadros «Cómo se sabe» | 35–50 | Solo se leyeron sus resúmenes |
| Normas actuales sobre implantes y marcapasos | 36 | Hornak y Hartwig no están al día; la unidad remite al protocolo del centro |

## Técnico

- Wiley (`onlinelibrary.wiley.com/doi/pdfdirect/...`) devuelve 403 a las descargas automáticas.
- El volumen es esquemático: el espacio subaracnoideo sale de que los rayos topen con hueso en 5 de 6 direcciones a ≤ 12 mm del encéfalo; la grasa subcutánea es la capa de 4 mm bajo la piel; los senos paranasales no existen en el modelo.
