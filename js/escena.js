// Escenario 3D compartido por todos los niveles (un solo renderizador WebGL).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export { THREE };

export class Escenario {
  constructor(canvas) {
    this.canvas = canvas;
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(devicePixelRatio, 2));
    r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.0;
    r.localClippingEnabled = true;
    r.setClearColor(0x000000, 0);
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 5000);
    this.controls = new OrbitControls(this.camera, canvas);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: 0.09, rotateSpeed: 0.75, zoomSpeed: 0.9, panSpeed: 0.8, screenSpacePanning: true });
    const pm = new THREE.PMREMGenerator(r);
    this.env = pm.fromScene(new RoomEnvironment(), 0.04).texture; pm.dispose();
    this.scene = new THREE.Scene();
    this.modo = null;               // {objetos(), onHover(hit, ev), onClick(hit, ev), onDbl(hit)}
    this.metrosPorUnidad = 0.01;
    this.frames = new Set();
    this.ray = new THREE.Raycaster();
    this.vuelo = null;
    this._estados = new Map();
    this.visible = () => true;      // lo define la app: si el lienzo está oculto no se dibuja
    this._t0 = performance.now() / 1000; this._tp = this._t0;
    this._eventos();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement);
    this.resize();
    r.setAnimationLoop(() => this._frame());
  }

  /** Crea una escena con iluminación estándar de estudio. */
  nuevaEscena(intensidadEnv = 0.55) {
    const s = new THREE.Scene();
    s.environment = this.env; s.environmentIntensity = intensidadEnv;
    const k = new THREE.DirectionalLight(0xfff4e6, 1.9); k.position.set(0.6, 1, 0.8); k.name = 'luz-clave';
    const f = new THREE.DirectionalLight(0xbfd4ff, 0.55); f.position.set(-0.8, 0.2, -0.6);
    s.add(k, f, new THREE.HemisphereLight(0xffffff, 0x30343c, 0.35));
    s.userData.clave = k;
    return s;
  }

  /** Cambia de escena conservando la cámara de cada una. */
  usar(clave, scene, modo, metrosPorUnidad, camIni) {
    if (this.clave) this._estados.set(this.clave, { p: this.camera.position.clone(), t: this.controls.target.clone(), near: this.camera.near, far: this.camera.far });
    this.clave = clave; this.scene = scene; this.modo = modo; this.metrosPorUnidad = metrosPorUnidad; this.vuelo = null;
    const e = this._estados.get(clave) || camIni;
    if (e) { this.camera.position.copy(e.p); this.controls.target.copy(e.t); this.camera.near = e.near ?? 0.1; this.camera.far = e.far ?? 5000; this.camera.updateProjectionMatrix(); }
    this.controls.update();
  }

  resize() {
    const p = this.canvas.parentElement; const w = p.clientWidth || 1, h = p.clientHeight || 1;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix(); this.w = w; this.h = h;
  }

  /** Vuelo suave de la cámara hacia un objetivo. */
  volar(objetivo, distancia, dir, ms = 700) {
    const t0 = this.controls.target.clone(), p0 = this.camera.position.clone();
    const d = (dir ? dir.clone() : p0.clone().sub(t0)).normalize();
    const dist = distancia ?? p0.distanceTo(t0);
    this.vuelo = { t0, p0, t1: objetivo.clone(), p1: objetivo.clone().addScaledVector(d, dist), i: performance.now(), ms };
  }
  /** Encuadra una caja (Box3). */
  encuadrar(box, dir, margen = 1.25, ms = 700) {
    const s = box.getBoundingSphere(new THREE.Sphere());
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const d = s.radius * margen / Math.sin(Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * this.camera.aspect)) / 2);
    this.volar(s.center, d, dir, ms);
  }

  proyectar(v) {
    const p = v.clone().project(this.camera);
    return { x: (p.x * 0.5 + 0.5) * this.w, y: (-p.y * 0.5 + 0.5) * this.h, delante: p.z < 1 && p.z > -1 };
  }

  picar(cx, cy) {
    if (!this.modo?.objetos) return null;
    const r = this.canvas.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1), this.camera);
    const hits = this.ray.intersectObjects(this.modo.objetos(), false);
    const planos = this.modo.planos?.() || [];
    for (const h of hits) { if (planos.every(pl => pl.distanceToPoint(h.point) >= 0)) return h; }
    return null;
  }

  _eventos() {
    const c = this.canvas; let abajo = null, ultimo = 0, rafHover = 0, ev0 = null;
    c.addEventListener('pointerdown', e => { abajo = { x: e.clientX, y: e.clientY, t: performance.now() }; c.classList.add('agarra'); this.vuelo = null; });
    addEventListener('pointerup', e => {
      c.classList.remove('agarra');
      if (!abajo || e.target !== c) { abajo = null; return; }
      const mov = Math.hypot(e.clientX - abajo.x, e.clientY - abajo.y); const dt = performance.now() - abajo.t; abajo = null;
      if (mov < 5 && dt < 500) {
        const hit = this.picar(e.clientX, e.clientY);
        const ahora = performance.now();
        if (ahora - ultimo < 320 && this.modo?.onDbl) this.modo.onDbl(hit, e); else this.modo?.onClick?.(hit, e);
        ultimo = ahora;
      }
    });
    c.addEventListener('pointermove', e => {
      if (abajo || e.pointerType === 'touch') return;
      ev0 = e;
      if (!rafHover) rafHover = requestAnimationFrame(() => { rafHover = 0; const hit = this.picar(ev0.clientX, ev0.clientY); c.classList.toggle('apunta', !!hit); this.modo?.onHover?.(hit, ev0); });
    });
    c.addEventListener('pointerleave', () => { this.modo?.onHover?.(null, null); c.classList.remove('apunta'); });
  }

  _frame() {
    const ahora = performance.now() / 1000; const dt = Math.min(ahora - this._tp, 0.1), t = ahora - this._t0; this._tp = ahora;
    if (!this.visible()) return;   // curso y evaluación tapan el lienzo: no gastar GPU
    if (this.vuelo) {
      const v = this.vuelo; let k = (performance.now() - v.i) / v.ms; if (k >= 1) { k = 1; this.vuelo = null; }
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      this.controls.target.lerpVectors(v.t0, v.t1, e); this.camera.position.lerpVectors(v.p0, v.p1, e);
    }
    this.controls.update();
    // la luz clave acompaña a la cámara para que el relieve siempre se lea
    const k = this.scene.userData.clave;
    if (k) { k.position.copy(this.camera.position).sub(this.controls.target).normalize().add(new THREE.Vector3(0.35, 0.6, 0).applyQuaternion(this.camera.quaternion)); }
    for (const f of this.frames) f(dt, t);
    this.modo?.frame?.(dt, t);
    this.renderer.render(this.scene, this.camera);
    this._escala();
  }

  _escala() {
    const el = this._elEscala ||= document.getElementById('escala'); if (!el) return;
    const d = this.camera.position.distanceTo(this.controls.target);
    const mpp = 2 * d * Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) / this.h * this.metrosPorUnidad; // metros por pixel
    let m = mpp * 110; const e = Math.pow(10, Math.floor(Math.log10(m))); const n = m / e; const nice = (n >= 5 ? 5 : n >= 2 ? 2 : 1) * e;
    const px = nice / mpp; const txt = fmtLong(nice);
    if (txt !== this._txtEsc || Math.abs(px - (this._pxEsc || 0)) > 0.5) { el.firstElementChild.style.width = px.toFixed(0) + 'px'; el.lastElementChild.textContent = txt; this._txtEsc = txt; this._pxEsc = px; }
  }
}

export function fmtLong(m) {
  const u = [[1, 'm'], [1e-2, 'cm'], [1e-3, 'mm'], [1e-6, 'µm'], [1e-9, 'nm'], [1e-10, 'Å']];
  for (const [f, s] of u) if (m >= f * 0.999) return (+(m / f).toPrecision(2)) + ' ' + s;
  return (+(m / 1e-10).toPrecision(2)) + ' Å';
}

/** Tubo a lo largo de una curva Catmull-Rom. */
export function tubo(puntos, radio, color, seg = 0, lados = 8, opts = {}) {
  const curva = new THREE.CatmullRomCurve3(puntos.map(p => p.isVector3 ? p : new THREE.Vector3(...p)), false, 'centripetal');
  const g = new THREE.TubeGeometry(curva, seg || Math.max(8, puntos.length * 6), radio, lados, false);
  const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0, ...opts }));
  m.userData.curva = curva;
  return m;
}

/** PRNG determinista. */
export function azar(semilla = 1) { let s = semilla >>> 0; return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
