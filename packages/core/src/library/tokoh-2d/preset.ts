// Preset tokoh untuk rig gaya 'tokoh' (rig.ts). Preset hanya titik awal: tiap film menyesuaikan warna, rambut, pose,
// dan pegangan dengan spread, misalnya figure({ ...TOKOH.muridSma, view: 'side', pose: 'sit', head: { hair: 'ikal' } }).
// Aturan: tanpa mata, alis, atau hidung (wajah polos, hanya mulut); kerudung membingkai wajah dan turun ke bahu.
// Pilihan yang tersedia di rig:
//   rambut  belah blangkon bob cepak hijab ikal kakak kerudung kuncir peci pet raka sanggul selendang
//   atasan  shirt batik daster jas kaos kebaya tunik · bawahan pants skirt kain · lengan short long none
//   tampak  front side back q (tiga perempat) · pose stand sit
import { dk } from './rig';

const KHAKI = '#a8925f';

export const TOKOH = {
  /** murid SMA putra: kemeja putih, celana abu-abu, badge OSIS */
  muridSma: { cloth: '#eef0f2', pants: '#7d8894', belt: '#1f1d1c', badge: 1, sleeve: 'short', head: { hair: 'cepak' } },
  /** murid SMA putri berkerudung: kemeja putih lengan panjang, rok abu-abu */
  muridSmaPutri: { cloth: '#eef0f2', pants: '#7d8894', belt: '#1f1d1c', badge: 1, legs: 'skirt', sleeve: 'long', head: { hair: 'hijab', hijabc: '#eef0f2' } },
  /** guru perempuan berjilbab, kemeja batik, rok panjang */
  guru: { cloth: '#7a4636', top: 'batik', pants: '#2f3442', legs: 'skirt', sleeve: 'long', head: { hair: 'hijab', hijabc: '#c08a86' } },
  /** ibu di rumah: daster dan kerudung instan */
  ibu: { cloth: '#7b4a52', top: 'daster', pants: '#7b4a52', legs: 'skirt', sleeve: 'long', head: { hair: 'kerudung', hijabc: '#6f8c74' } },
  /** remaja di rumah: kaos dan celana panjang */
  remaja: { cloth: '#2f3d55', top: 'kaos', pants: '#3c5677', sleeve: 'short', head: { hair: 'kakak' } },
  /** dokter/petugas kesehatan berjilbab: jas putih di atas baju biru muda */
  dokter: { cloth: '#f6f6f4', top: 'jas', inner: '#9ac4d8', pants: '#2a3a5a', sleeve: 'long', head: { hair: 'hijab', hijabc: '#2a4a6a' } },
  /** pemuda 1928: jas putih, dasi, peci (seperti foto Kongres Pemuda II) */
  pemuda1928: { cloth: '#efe9dc', top: 'jas', inner: '#ffffff', tie: '#2a2a2a', pants: '#e6dcc6', sleeve: 'long', shoes: '#3a2a1e', head: { hair: 'peci' } },
  /** pemuda 1928 berbeskap: jas gelap, kain, blangkon */
  pemuda1928Jawa: { cloth: '#3a3530', top: 'jas', inner: '#efe9dc', pants: '#6b4a2e', legs: 'kain', sleeve: 'long', shoes: '#2a1e16', head: { hair: 'blangkon' } },
  /** pemudi 1928: kebaya, kain, sanggul */
  pemudi1928: { cloth: '#f1e6d2', top: 'kebaya', pants: '#6b4a2e', legs: 'kain', sleeve: 'long', shoes: '#3a2a1e', head: { hair: 'sanggul' } },
  /** pemudi 1928 berselendang: kebaya dan selendang di kepala */
  pemudi1928Selendang: { cloth: '#e8dcc4', top: 'kebaya', pants: '#4a3a5a', legs: 'kain', sleeve: 'long', shoes: '#3a2a1e', head: { hair: 'selendang', hijabc: '#c9b48a' } },
  /** polisi kolonial (PID) 1920-an: tunik khaki, sepatu bot, pet */
  polisiKolonial: { cloth: KHAKI, top: 'tunik', pants: dk(KHAKI, 0.08), sleeve: 'long', belt: '#4a3520', boots: true, shoes: '#3a2a1e', head: { hair: 'pet', capc: dk(KHAKI, 0.25) } },
} as const;

export type TokohPreset = keyof typeof TOKOH;

/** warna kulit dan rambut untuk figuran supaya tidak seragam (pilih dengan seed) */
export const KULIT = ['#c4936c', '#b07f58', '#d2a47c', '#9c6c48', '#c99a74'];
export const RAMBUT_PUTRA = ['cepak', 'ikal', 'belah', 'kakak', 'raka'];
export const RAMBUT_PUTRI = ['hijab', 'kuncir', 'bob', 'hijab', 'kerudung'];
