// Cálculos de la unidad 37 (Semestre III). Uso: node calculos/s3-37.mjs
// γ del hidrógeno = 42,58 MHz/T (Hornak, cap. 3). Tiempos de West et al. 2013, tabla 1 (T1 = 1/R1, T2 = 1/R2).
const gamma = 42.58;
for (const B0 of [1.5, 3]) console.log(`Larmor a ${B0} T: ${(gamma * B0).toFixed(2)} MHz`);
const R = { '1.5': { sb: [1.62, 12.84], sg: [0.81, 10.29], lcr: [0.24, 0.87] }, '3': { sb: [1.38, 13.76], sg: [0.77, 10.69], lcr: [0.32, 0.79] } };
for (const [B0, o] of Object.entries(R)) for (const [k, [r1, r2]] of Object.entries(o)) console.log(`${B0} T ${k}: T1 ${Math.round(1000 / r1)} ms · T2 ${(1000 / r2).toFixed(1)} ms · TI nulo (sin repetir) ${Math.round(1000 / r1 * Math.LN2)} ms`);
