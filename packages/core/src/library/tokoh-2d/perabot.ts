// Perabot dan bangunan untuk gaya 'tokoh', dibangun di kamera 3D (kamera.ts) dalam meter.
// Ukuran perabot diambil dari rig, bukan dari ukuran asli: kaki tokoh hanya ±0,58 m (docs/scenes/2D-TOKOH.md §2).
import { type Kam, kotak, PX } from './kamera';

/** tinggi dudukan = bawah pantat tokoh duduk (y 448 di rig) */
export const SEAT_H = (520 - 448) * PX;
/** daun meja murid setinggi siku saat duduk (y 385 di rig) */
export const DESK_H = (520 - 385) * PX;
export const BACK_LO = SEAT_H + 0.1;
export const BACK_HI = SEAT_H + 0.36;

const lighten = (c: string, k: number) => {
  const n = parseInt(c.slice(1), 16);
  const m = (v: number) => Math.round(v + (255 - v) * k).toString(16).padStart(2, '0');
  return `#${m((n >> 16) & 255)}${m((n >> 8) & 255)}${m(n & 255)}`;
};

export type WarnaMeja = { daun: string; tepi: string; kaki: string; laci: string };
export const MEJA_KAYU: WarnaMeja = { daun: '#a27a52', tepi: '#7a5a3a', kaki: '#4a3a2c', laci: '#3b2b1e' };

/** meja murid tunggal 0,64 × 0,48 m berpusat di (x, z), laci terbuka ke arah +z (murid) */
export const mejaMurid = (K: Kam, x: number, z: number, w: WarnaMeja = MEJA_KAYU) => {
  const hw = 0.32, hd = 0.24, h = DESK_H;
  let s = '';
  for (const [lx, lz] of [[-hw + 0.03, z - hd + 0.03], [hw - 0.03, z - hd + 0.03], [-hw + 0.03, z + hd - 0.03], [hw - 0.03, z + hd - 0.03]]) {
    const a = K.pj(x + lx, 0, lz);
    s += K.seg(a, K.pj(x + lx, h, lz), w.kaki, Math.max(1.5, (K.cam.F * 0.04) / a[2]));
  }
  s += K.quad([x - hw + 0.02, h - 0.17, z + hd - 0.03], [x + hw - 0.02, h - 0.17, z + hd - 0.03], [x + hw - 0.02, h - 0.03, z + hd - 0.03], [x - hw + 0.02, h - 0.03, z + hd - 0.03], w.laci);
  s += K.quad([x - hw, h, z - hd], [x + hw, h, z - hd], [x + hw, h, z + hd], [x - hw, h, z + hd], w.daun);
  s += K.quad([x - hw, h, z + hd], [x + hw, h, z + hd], [x + hw, h - 0.03, z + hd], [x - hw, h - 0.03, z + hd], w.tepi);
  return s;
};

/** kursi murid berpusat di (x, z), sandaran di sisi +z. Dua lapis supaya tokoh duduk bisa diselipkan:
 *  gambar `dudukan`, lalu tokoh `part: 'body'`, lalu `sandaran` (atau kaki tokoh dulu bila tampak samping) */
export const kursiMurid = (K: Kam, x: number, z: number, warna = '#8a2f2a', rangka = '#3a3a3c') => {
  const hw = 0.21;
  let dudukan = '';
  for (const lx of [-hw + 0.02, hw - 0.02])
    for (const lz of [z - 0.18, z + 0.2]) {
      const a = K.pj(x + lx, 0, lz);
      dudukan += K.seg(a, K.pj(x + lx, SEAT_H, lz), rangka, Math.max(1.2, (K.cam.F * 0.027) / a[2]));
    }
  dudukan += K.quad([x - hw, SEAT_H, z - 0.2], [x + hw, SEAT_H, z - 0.2], [x + hw, SEAT_H, z + 0.2], [x - hw, SEAT_H, z + 0.2], warna);
  const bz = z + 0.2;
  let sandaran = '';
  for (const lx of [-hw + 0.02, hw - 0.02]) {
    const a = K.pj(x + lx, SEAT_H, bz);
    sandaran += K.seg(a, K.pj(x + lx, BACK_HI, bz), rangka, Math.max(1.2, (K.cam.F * 0.027) / a[2]));
  }
  sandaran += K.quad([x - hw, BACK_LO, bz], [x + hw, BACK_LO, bz], [x + hw, BACK_HI, bz], [x - hw, BACK_HI, bz], warna);
  sandaran += K.quad([x - hw, BACK_HI - 0.03, bz], [x + hw, BACK_HI - 0.03, bz], [x + hw, BACK_HI, bz], [x - hw, BACK_HI, bz], lighten(warna, 0.25));
  return { dudukan, sandaran };
};

export type Rumah = {
  /** sudut muka kiri-depan di (x, z); lebar ke +x, dalam ke -z, tinggi dinding h (meter) */
  x: number; z: number; lebar: number; dalam: number; h: number;
  dinding: string; atap: string;
  /** jumlah jendela di dinding muka; pintu di tengah */
  jendela?: number;
};

/** rumah solid: badan balok tertutup + atap pelana menutup penuh, pintu dan jendela di dinding muka (+z).
 *  Koreksi "rumah tidak solid": semua sisi dari kotak(), atap dua bidang plus segitiga ujung, tanpa celah. */
export const rumah = (K: Kam, r: Rumah) => {
  const { x, z, lebar, dalam, h } = r;
  const x1 = x + lebar, zb = z - dalam, ov = 0.35, R = Math.min(2.2, lebar * 0.42), xm = x + lebar / 2;
  let g = kotak(K, x, x1, zb, z, h, r.dinding);
  // atap pelana: dua bidang dari ujung ke ujung (+ overhang), segitiga ujung menutup kolong atap
  const za = zb - ov, zf = z + ov;
  const tri = (zz: number, fill: string) => K.poly([K.pj(x, h, zz), K.pj(xm, h + R, zz), K.pj(x1, h, zz)], fill);
  const cam = K.cam;
  const sisi = [
    { pts: [[x - ov, h - 0.12, za], [x - ov, h - 0.12, zf], [xm, h + R, zf], [xm, h + R, za]], d: Math.hypot(cam.x - (x + xm) / 2, cam.z - z) },
    { pts: [[x1 + ov, h - 0.12, za], [x1 + ov, h - 0.12, zf], [xm, h + R, zf], [xm, h + R, za]], d: Math.hypot(cam.x - (x1 + xm) / 2, cam.z - z) },
  ].sort((a, b) => b.d - a.d);
  // segitiga ujung lebih dulu: tritisan atap menjorok di depannya, jadi bidang atap digambar sesudahnya
  if (cam.z < zb) g += tri(zb, r.dinding);
  if (cam.z > z) g += tri(z, r.dinding);
  g += sisi.map((s, i) => K.quad(s.pts[0], s.pts[1], s.pts[2], s.pts[3], i === 0 ? r.atap : lighten(r.atap, 0.12))).join('');
  // pintu di tengah, jendela merata di kiri-kanannya, menempel di dinding muka
  const zf0 = z + 0.005;
  g += K.quad([xm - 0.45, 0, zf0], [xm + 0.45, 0, zf0], [xm + 0.45, 2.1, zf0], [xm - 0.45, 2.1, zf0], '#4a3a2c');
  const n = r.jendela ?? 2;
  for (let i = 0; i < n; i++) {
    const side = i % 2 === 0 ? -1 : 1, k = Math.floor(i / 2) + 1;
    const cx = xm + side * (0.45 + k * (lebar / 2 - 0.45) / (Math.ceil(n / 2) + 1));
    if (cx - 0.35 < x + 0.1 || cx + 0.35 > x1 - 0.1) continue;
    g += K.quad([cx - 0.35, 0.95, zf0], [cx + 0.35, 0.95, zf0], [cx + 0.35, 1.95, zf0], [cx - 0.35, 1.95, zf0], '#5f6f6a');
    g += K.line3([cx, 0.95, zf0 + 0.002], [cx, 1.95, zf0 + 0.002], '#f4efe4', 0.04);
  }
  return g;
};
