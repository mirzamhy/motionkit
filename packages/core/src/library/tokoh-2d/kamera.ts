// Kamera pinhole (meter) untuk ruangan dan bangunan 2D bergaya 'tokoh'. Dunia: y ke atas, kamera menghadap -z,
// layar 1920×1080. Tokoh 520 satuan = 1,6 m (docs/scenes/2D-TOKOH.md). Semua bangun dihitung dalam meter lalu
// diproyeksikan, jadi satu titik hilang berlaku untuk semuanya (koreksi "perspektif salah").
export type Cam = { x: number; y: number; z: number; pitch: number; F: number };
export type P3 = [number, number, number];

export const PX = 1.6 / 520;
export const f1 = (v: number) => v.toFixed(1);

export function makeCam(c: Cam) {
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const pj = (x: number, y: number, z: number): P3 => {
    const dx = x - c.x, dy = y - c.y, dz = z - c.z;
    const Zc = -dy * sp - dz * cp;
    const Yc = dy * cp - dz * sp;
    return [960 + (c.F * dx) / Zc, 540 - (c.F * Yc) / Zc, Zc];
  };
  /** poligon dari titik layar; dilewati bila ada titik di belakang kamera */
  const poly = (pts: P3[], fill: string, extra = '') =>
    pts.some((p) => p[2] < 0.15) ? '' : `<path d="M${pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L')}Z" fill="${fill}" ${extra}/>`;
  const quad = (a: number[], b: number[], cc: number[], d: number[], fill: string, extra = '') =>
    poly([pj(a[0], a[1], a[2]), pj(b[0], b[1], b[2]), pj(cc[0], cc[1], cc[2]), pj(d[0], d[1], d[2])], fill, extra);
  const seg = (a: P3, b: P3, stroke: string, w: number, extra = '') =>
    a[2] < 0.15 || b[2] < 0.15 ? '' : `<line x1="${f1(a[0])}" y1="${f1(a[1])}" x2="${f1(b[0])}" y2="${f1(b[1])}" stroke="${stroke}" stroke-width="${f1(w)}" stroke-linecap="round" ${extra}/>`;
  /** garis dunia dengan tebal dalam meter */
  const line3 = (a: number[], b: number[], stroke: string, wm: number) => {
    const A = pj(a[0], a[1], a[2]), B = pj(b[0], b[1], b[2]);
    return seg(A, B, stroke, Math.max(1, (c.F * wm) / Math.min(A[2], B[2])));
  };
  /** px per meter di kedalaman Zc */
  const k = (Zc: number) => c.F / Zc;
  /** tokoh: titik (0, ly) ruang tokoh di titik dunia (x, y, z); flip = menghadap -x */
  const put = (x: number, y: number, z: number, ly: number, s: string, flip = false) => {
    const [sx, sy, Zc] = pj(x, y, z);
    if (Zc < 0.3) return '';
    const sc = (c.F * PX) / Zc;
    return `<g transform="translate(${f1(sx)} ${f1(sy - ly * sc)}) scale(${(flip ? -sc : sc).toFixed(4)} ${sc.toFixed(4)})">${s}</g>`;
  };
  /** gambar datar menghadap kamera di bidang z: isi dalam meter lokal, y ke bawah, pusat (cx, cy) */
  const onZ = (cx: number, cy: number, z: number, inner: string) => {
    const [sx, sy, Zc] = pj(cx, cy, z);
    if (Zc < 0.3) return '';
    return `<g transform="translate(${f1(sx)} ${f1(sy)}) scale(${(c.F / Zc).toFixed(3)})">${inner}</g>`;
  };
  /** lingkaran di bidang x = konstan (roda dilihat dari belakang/samping) */
  const ringX = (x: number, y: number, z: number, r: number, fill: string, extra = '') =>
    poly([...Array(16)].map((_, i) => pj(x, y + r * Math.sin((i / 16) * Math.PI * 2), z + r * Math.cos((i / 16) * Math.PI * 2))), fill, extra);
  return { pj, poly, quad, seg, line3, k, put, onZ, ringX, cam: c };
}
export type Kam = ReturnType<typeof makeCam>;

/** bidang panjang dipecah per pita z: bidang yang sebagian ada di belakang kamera dibuang oleh poly(),
 *  jadi lantai atau dinding panjang harus dipotong supaya bagian di depan kamera tetap tergambar */
export const stripsZ = (f: (z0: number, z1: number) => string, z0: number, z1: number, step = 0.5) => {
  let s = '';
  for (let z = z0; z < z1 - 1e-6; z += step) s += f(z, Math.min(z1, z + step));
  return s;
};

/** gelap/terang sederhana untuk sisi balok tanpa bergantung rig.ts */
const shade = (c: string, k: number) => {
  const n = parseInt(c.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const t = k < 0 ? 0 : 255, a = Math.abs(k);
  const m = (v: number) => Math.round(v + (t - v) * a).toString(16).padStart(2, '0');
  return `#${m(r)}${m(g)}${m(b)}`;
};

/** balok solid: semua sisi yang menghadap kamera, digambar dari yang jauh ke yang dekat, tanpa celah.
 *  (x0..x1, 0..h dari y0, z0..z1) dalam meter. Atap, dinding, lemari, kardus, meja: mulai dari sini. */
export const kotak = (K: Kam, x0: number, x1: number, z0: number, z1: number, h: number, warna: string, o: { y0?: number; atas?: string; garis?: string } = {}) => {
  const y0 = o.y0 ?? 0, y1 = y0 + h, c = K.cam;
  const faces: { n: P3; pts: number[][]; fill: string; ctr: P3 }[] = [
    { n: [0, 1, 0], pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], fill: o.atas ?? shade(warna, 0.18), ctr: [(x0 + x1) / 2, y1, (z0 + z1) / 2] },
    { n: [0, -1, 0], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]], fill: shade(warna, -0.35), ctr: [(x0 + x1) / 2, y0, (z0 + z1) / 2] },
    { n: [0, 0, 1], pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], fill: warna, ctr: [(x0 + x1) / 2, (y0 + y1) / 2, z1] },
    { n: [0, 0, -1], pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], fill: shade(warna, -0.25), ctr: [(x0 + x1) / 2, (y0 + y1) / 2, z0] },
    { n: [-1, 0, 0], pts: [[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], fill: shade(warna, 0.06), ctr: [x0, (y0 + y1) / 2, (z0 + z1) / 2] },
    { n: [1, 0, 0], pts: [[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], fill: shade(warna, -0.14), ctr: [x1, (y0 + y1) / 2, (z0 + z1) / 2] },
  ];
  const ext = o.garis ? `stroke="${o.garis}" stroke-width="1" stroke-linejoin="round"` : `stroke-linejoin="round"`;
  return faces
    .filter((f) => f.n[0] * (c.x - f.ctr[0]) + f.n[1] * (c.y - f.ctr[1]) + f.n[2] * (c.z - f.ctr[2]) > 0)
    .map((f) => ({ f, d: Math.hypot(c.x - f.ctr[0], c.y - f.ctr[1], c.z - f.ctr[2]) }))
    .sort((a, b) => b.d - a.d)
    .map(({ f }) => K.quad(f.pts[0], f.pts[1], f.pts[2], f.pts[3], f.fill, ext))
    .join('');
};

/** urutkan apa saja yang punya posisi z (tokoh, perabot) dari jauh ke dekat sebelum digambar:
 *  koreksi "orang berdiri menimpa orang duduk" dan "meja tiba-tiba di tengah" */
export const urutZ = <T>(xs: T[], z: (x: T) => number) => [...xs].sort((a, b) => z(a) - z(b));

/** kamera pratinjau untuk Item2D pustaka: titik dunia (0,0,0) jatuh di (x, y) layar dengan s px per meter,
 *  dilihat sedikit dari atas-depan supaya bentuk 3D-nya terbaca */
export const kameraItem = (x: number, y: number, s: number, pitchDeg = 14) => {
  // jauh (30 m) dan agak ke kanan supaya hampir ortografis dan sisi kanan benda ikut terlihat
  const D = 30, pitch = (pitchDeg * Math.PI) / 180;
  const cam: Cam = { x: D * 0.22, y: D * Math.sin(pitch) + 0.9, z: D, pitch, F: s * D };
  const K = makeCam(cam);
  const [ox, oy] = K.pj(0, 0, 0);
  return { K, wrap: (svg: string) => `<g transform="translate(${f1(x - ox)} ${f1(y - oy)})">${svg}</g>` };
};
