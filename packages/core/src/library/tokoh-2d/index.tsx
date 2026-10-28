// Aset gaya 'tokoh' (Tokoh 2D tanpa wajah): orang dari rig.ts + preset.ts, perabot dan bangunan dari perabot.ts
// di kamera 3D (kamera.ts). Dibuat untuk film Janji yang Belum Selesai (2026); kode filmnya tidak di repo.
// Pakai lewat <Aset id="murid-sma-tokoh" .../> untuk gambar cepat, atau langsung panggil figure()/kotak()/rumah()
// di adegan yang punya kamera sendiri. Aturan dan koreksi pengguna: docs/scenes/2D-TOKOH.md.
import React from 'react';
import type { Item2DProps, ItemMeta, LibraryItem } from '../types';
import { art, figure } from './rig';
import { TOKOH, KULIT, type TokohPreset } from './preset';
import { kameraItem, kotak } from './kamera';
import { DESK_H, kursiMurid, mejaMurid, rumah } from './perabot';

const REFS = 'packages/core/src/library/tokoh-2d/refs.md';
const FILE = 'packages/core/src/library/tokoh-2d/index.tsx';
/** rig: 520 satuan = 1,6 m */
const PER_M = 325;

const VIEW: Record<string, string> = { depan: 'front', samping: 'side', belakang: 'back', 'tiga-perempat': 'q', duduk: 'side' };
const VARIANTS = ['depan', 'tiga-perempat', 'samping', 'belakang', 'duduk'];

const Svg: React.FC<{ svg: string }> = ({ svg }) => <g dangerouslySetInnerHTML={{ __html: svg }} />;

const orang = (benda: string, preset: TokohPreset, name: string, tags: string[], o: Partial<ItemMeta> = {}): LibraryItem => {
  const p = TOKOH[preset] as Record<string, unknown> & { head: Record<string, unknown> };
  const Item2D: React.FC<Item2DProps> = ({ x, y, s, seed = 0, variant = 'depan', flip }) => {
    const view = VIEW[variant] ?? 'front';
    const skin = KULIT[Math.abs(seed) % KULIT.length];
    const svg = art(() => figure({ ...p, view, skin, pose: variant === 'duduk' ? 'sit' : 'stand', head: { ...p.head, view, skin } }));
    const sc = s / PER_M;
    return <g transform={`translate(${x} ${y - 520 * sc}) scale(${flip ? -sc : sc} ${sc})`}><Svg svg={svg} /></g>;
  };
  return {
    meta: {
      id: `${benda}-tokoh`, benda, gaya: 'tokoh', name, category: 'orang', tags, size: [0.55, 1.6, 0.3], variants: VARIANTS,
      refs: REFS, file: FILE, invented: ['wajah sengaja tanpa mata dan hidung (hanya mulut)', 'proporsi berkepala besar, bukan proporsi asli'], ...o,
    },
    Item2D,
  };
};

const benda3d = (meta: Omit<ItemMeta, 'gaya' | 'refs' | 'file' | 'id'>, draw: (K: ReturnType<typeof kameraItem>['K'], variant: string) => string): LibraryItem => ({
  meta: { ...meta, id: `${meta.benda}-tokoh`, gaya: 'tokoh', refs: REFS, file: FILE },
  Item2D: ({ x, y, s, variant }) => {
    const { K, wrap } = kameraItem(x, y, s);
    return <Svg svg={wrap(draw(K, variant ?? meta.variants?.[0] ?? ''))} />;
  },
});

export const ITEMS_TOKOH: LibraryItem[] = [
  orang('murid-sma', 'muridSma', 'Murid SMA putra (tokoh)', ['murid', 'siswa', 'sma', 'pelajar', 'sekolah', 'putih abu-abu', 'student', 'high school', 'boy']),
  orang('murid-sma-putri', 'muridSmaPutri', 'Murid SMA putri berkerudung (tokoh)', ['murid', 'siswi', 'sma', 'pelajar', 'kerudung', 'jilbab', 'hijab', 'student', 'girl']),
  orang('guru', 'guru', 'Guru perempuan berjilbab (tokoh)', ['guru', 'ibu guru', 'pengajar', 'jilbab', 'batik', 'teacher']),
  orang('ibu', 'ibu', 'Ibu rumah tangga berkerudung (tokoh)', ['ibu', 'mama', 'daster', 'kerudung', 'rumah', 'mother']),
  orang('remaja', 'remaja', 'Remaja berkaos (tokoh)', ['remaja', 'kakak', 'anak muda', 'kaos', 'teen', 'casual']),
  orang('dokter', 'dokter', 'Dokter/petugas kesehatan berjilbab (tokoh)', ['dokter', 'perawat', 'petugas', 'posko', 'jas putih', 'doctor', 'nurse', 'health']),
  orang('pemuda-1928', 'pemuda1928', 'Pemuda 1928 berjas putih dan peci (tokoh)', ['pemuda', 'sumpah pemuda', 'kongres', '1928', 'jas', 'peci', 'youth', 'colonial'], { era: '1920-an', region: 'Batavia' }),
  orang('pemuda-1928-jawa', 'pemuda1928Jawa', 'Pemuda 1928 berbeskap dan blangkon (tokoh)', ['pemuda', '1928', 'beskap', 'blangkon', 'jawa', 'kain', 'youth'], { era: '1920-an' }),
  orang('pemudi-1928', 'pemudi1928', 'Pemudi 1928 berkebaya dan bersanggul (tokoh)', ['pemudi', 'sumpah pemuda', '1928', 'kebaya', 'sanggul', 'kain', 'young woman'], { era: '1920-an' }),
  orang('pemudi-1928-selendang', 'pemudi1928Selendang', 'Pemudi 1928 berkebaya dan berselendang (tokoh)', ['pemudi', '1928', 'kebaya', 'selendang', 'kerudung', 'young woman'], { era: '1920-an' }),
  orang('polisi-kolonial', 'polisiKolonial', 'Polisi kolonial 1920-an (tokoh)', ['polisi', 'kolonial', 'pid', 'belanda', 'khaki', 'police', 'colonial'], { era: '1920-an' }),
  benda3d(
    { benda: 'meja-murid', name: 'Meja murid tunggal (tokoh)', category: 'properti', tags: ['meja', 'meja sekolah', 'kelas', 'desk', 'school'], size: [0.64, Math.round(DESK_H * 100) / 100, 0.48], variants: ['kayu'] },
    (K) => mejaMurid(K, 0, 0),
  ),
  benda3d(
    { benda: 'kursi-murid', name: 'Kursi murid (tokoh)', category: 'properti', tags: ['kursi', 'kursi sekolah', 'kelas', 'chair', 'school'], size: [0.42, 0.5, 0.4], variants: ['merah', 'biru'] },
    (K, v) => {
      const k = kursiMurid(K, 0, 0, v === 'biru' ? '#2f5f9a' : '#8a2f2a');
      return k.dudukan + k.sandaran;
    },
  ),
  benda3d(
    { benda: 'kardus', name: 'Kardus bantuan (tokoh)', category: 'properti', tags: ['kardus', 'kotak', 'box', 'bantuan', 'donasi', 'cardboard'], size: [0.5, 0.35, 0.35], variants: ['kardus'] },
    (K) => kotak(K, -0.25, 0.25, -0.175, 0.175, 0.35, '#b88a58', { atas: '#c99a68' }) + K.line3([-0.25, 0.351, 0], [0.25, 0.351, 0], '#d8c9a0', 0.05),
  ),
  benda3d(
    { benda: 'rumah', name: 'Rumah solid berpelana (tokoh)', category: 'bangunan', tags: ['rumah', 'bangunan', 'batavia', 'kampung', 'house', 'building'], size: [6, 4.8, 5], variants: ['batavia', 'kampung'], invented: ['bentuk umum rumah berpelana, bukan bangunan tertentu'] },
    (K, v) =>
      v === 'kampung'
        ? rumah(K, { x: -3, z: 0, lebar: 6, dalam: 5, h: 2.8, dinding: '#c9a878', atap: '#7a4a32', jendela: 2 })
        : rumah(K, { x: -3, z: 0, lebar: 6, dalam: 5, h: 3.2, dinding: '#efe6d2', atap: '#a5503a', jendela: 4 }),
  ),
];
