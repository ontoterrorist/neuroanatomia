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

## Lecciones

Ninguna redactada: esperan tu visto bueno al temario de `diseno.md`.

## Técnico

- Wiley (`onlinelibrary.wiley.com/doi/pdfdirect/...`) devuelve 403 a las descargas automáticas.
- El volumen es esquemático: el espacio subaracnoideo sale de que los rayos topen con hueso en 5 de 6 direcciones a ≤ 12 mm del encéfalo; la grasa subcutánea es la capa de 4 mm bajo la piel; los senos paranasales no existen en el modelo.
