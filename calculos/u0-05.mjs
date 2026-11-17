// Comprueba la aritmética de la lección 0.5 con las cifras que da Neuroscience Online (cap. 1 y 3).
// Uso: node calculos/u0-05.mjs
const casi = (a, b, tol) => Math.abs(a - b) <= tol;
let mal = 0;
const verifica = (texto, ok) => { console.log(ok ? 'ok ' : 'MAL', texto); if (!ok) mal++; };

// Nernst: la pendiente es ~60 mV por década de concentración (NSO 1.5). Triple concentración:
const mVporDecada = 60;
verifica(`triplicar [K+]o: ${(mVporDecada * Math.log10(3)).toFixed(1)} mV (texto: 29)`, casi(mVporDecada * Math.log10(3), 29, 0.5));

// Constante de tiempo: de -60 a -50 mV, tau = 10 ms (NSO 3.2). V(t) = Vf + (Vi - Vf) * exp(-t/tau)
const Vi = -60, Vf = -50, tau = 10;
const V = (t) => Vf + (Vi - Vf) * Math.exp(-t / tau);
verifica(`V(tau) = ${V(tau).toFixed(2)} mV (NSO: -53,7)`, casi(V(tau), -53.7, 0.05));

// Constante de espacio: soma fijado a -50 mV, lambda = 1 mm (NSO 3.2). V(x) = -60 + 10 * exp(-x/lambda)
const lambda = 1;
const Vx = (x) => -60 + 10 * Math.exp(-x / lambda);
verifica(`V(1 mm) = ${Vx(1).toFixed(2)} mV (NSO: -56)`, casi(Vx(1), -56, 0.5));
verifica(`V(2 mm) = ${Vx(2).toFixed(2)} mV (NSO: "aun mas cerca de -60")`, Vx(2) < Vx(1) && Vx(2) > -60);

// alpha = PNa/PK = 0,01 -> PK es 100 veces PNa (NSO 1.6)
verifica(`PK/PNa = ${1 / 0.01}`, 1 / 0.01 === 100);

console.log(mal ? `${mal} errores` : 'todo coincide con NSO');
process.exit(mal ? 1 : 0);
