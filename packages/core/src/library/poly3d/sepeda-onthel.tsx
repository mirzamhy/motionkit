// sepeda-onthel-poly3d: Sepeda onthel kuno (sepeda kumbang / Fongers / Gazelle era 1940-an) alat transportasi utama rakyat & kurir pemuda Surabaya.
// Ciri: rangka besi tinggi (diamond frame), setang melengkung tinggi dengan bel & lampu dinamo kuno, sadel pegas kulit, boncengan besi belakang, dan penutup rantai (katengkas).
// Dimensi: ~1.85m panjang x 1.05m tinggi x 0.65m lebar.
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'sepeda-onthel-poly3d',
  name: 'Sepeda Onthel Kuno 1940-an (Kurir Pemuda / Rakyat)',
  category: 'kendaraan-darat',
  benda: 'sepeda-onthel',
  gaya: 'poly3d',
  tags: ['sepeda', 'onthel', 'kuno', 'kurir', 'pemuda', '1945', 'surabaya', 'fongers', 'gazelle', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [1.85, 1.05, 0.65],
  variants: ['hitam', 'kurir'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/sepeda-onthel.tsx',
  invented: [
    'penyederhanaan jeruji roda menjadi piringan tipis solid flat-shaded',
    'varian kurir dilengkapi tas kanvas surat / amunisi di boncengan belakang dan bendera Merah Putih kecil',
  ],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.05, 12);
const lampGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.06, 8);

const C_FRAME = '#1c1917'; // cat hitam klasik onthel
const C_CHROME = '#cbd5e1';
const C_SADDLE = '#451a03'; // kulit cokelat tua
const C_BAG = '#78716c'; // kanvas abu-abu khaki

export const Item3D: React.FC<Item3DProps> = ({ variant = 'kurir' }) => {
  const isCourier = variant === 'kurir';

  return (
    <group>
      {/* --- DUA RODA BESAR 28 INCH --- */}
      {/* Roda belakang (X = -0.65) */}
      <group position={[-0.65, 0.35, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={flat('#0f172a')} castShadow>
          <primitive object={wheelGeo} attach="geometry" />
        </mesh>
        <Box p={[0, 0, 0]} s={[0.55, 0.55, 0.02]} c={C_CHROME} /> {/* velg tengah */}
      </group>

      {/* Roda depan (X = +0.65) */}
      <group position={[0.65, 0.35, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={flat('#0f172a')} castShadow>
          <primitive object={wheelGeo} attach="geometry" />
        </mesh>
        <Box p={[0, 0, 0]} s={[0.55, 0.55, 0.02]} c={C_CHROME} />
      </group>

      {/* Spatbor roda melengkung */}
      <Box p={[-0.65, 0.52, 0]} s={[0.72, 0.04, 0.08]} c={C_FRAME} />
      <Box p={[0.65, 0.52, 0]} s={[0.72, 0.04, 0.08]} c={C_FRAME} />

      {/* --- RANGKA BESI TINGGI (DIAMOND FRAME) --- */}
      {/* Tiang sadel (Seat tube dari as tengah ke sadel) */}
      <Box p={[-0.15, 0.58, 0]} s={[0.04, 0.46, 0.04]} c={C_FRAME} />
      {/* Pipa atas mendatar (Top tube) */}
      <Box p={[0.12, 0.76, 0]} s={[0.62, 0.04, 0.04]} c={C_FRAME} />
      {/* Pipa bawah miring (Down tube) */}
      <Box p={[0.14, 0.55, 0]} s={[0.68, 0.04, 0.04]} c={C_FRAME} />
      {/* Garpu belakang (Chainstay & Seatstay) */}
      <Box p={[-0.42, 0.42, 0]} s={[0.54, 0.03, 0.08]} c={C_FRAME} />
      <Box p={[-0.42, 0.56, 0]} s={[0.54, 0.03, 0.08]} c={C_FRAME} />
      {/* Garpu depan (Front fork) */}
      <Box p={[0.56, 0.58, 0]} s={[0.04, 0.5, 0.08]} c={C_FRAME} />

      {/* --- PEDAL & KATENGKAS (PENUTUP RANTAI) --- */}
      <Box p={[-0.15, 0.35, 0]} s={[0.5, 0.12, 0.04]} c={C_FRAME} />
      <Box p={[-0.15, 0.35, 0.08]} s={[0.16, 0.04, 0.03]} c={C_CHROME} /> {/* pedal kanan */}
      <Box p={[-0.15, 0.35, -0.08]} s={[0.16, 0.04, 0.03]} c={C_CHROME} /> {/* pedal kiri */}

      {/* --- SADEL KULIT PEGELAS --- */}
      <Box p={[-0.18, 0.83, 0]} s={[0.24, 0.06, 0.18]} c={C_SADDLE} />
      <Box p={[-0.24, 0.8, 0]} s={[0.08, 0.04, 0.12]} c={C_CHROME} /> {/* per sadel */}

      {/* --- SETANG MELENGKUNG & LAMPU DINAMO DEPAN --- */}
      {/* Batang leher setang */}
      <Box p={[0.44, 0.84, 0]} s={[0.04, 0.22, 0.04]} c={C_CHROME} />
      {/* Palang setang melengkung */}
      <Box p={[0.42, 0.94, 0]} s={[0.08, 0.03, 0.56]} c={C_CHROME} />
      {/* Handgrip hitam */}
      <Box p={[0.38, 0.93, 0.26]} s={[0.1, 0.04, 0.04]} c="#0f172a" />
      <Box p={[0.38, 0.93, -0.26]} s={[0.1, 0.04, 0.04]} c="#0f172a" />
      {/* Lampu dinamo kuno bulat di depan setang */}
      <mesh position={[0.54, 0.88, 0]} rotation={[0, 0, Math.PI / 2]} material={flat('#fef08a')} castShadow>
        <primitive object={lampGeo} attach="geometry" />
      </mesh>

      {/* --- BONCENGAN BELAKANG BESI --- */}
      <Box p={[-0.62, 0.72, 0]} s={[0.46, 0.04, 0.16]} c={C_FRAME} />
      <Box p={[-0.62, 0.54, 0.07]} s={[0.02, 0.36, 0.02]} c={C_FRAME} />
      <Box p={[-0.62, 0.54, -0.07]} s={[0.02, 0.36, 0.02]} c={C_FRAME} />

      {/* Aksesoris Varian Kurir (Tas pos perjuangan & Bendera kecil) */}
      {isCourier && (
        <group>
          {/* Tas kanvas samping boncengan */}
          <Box p={[-0.62, 0.56, 0.14]} s={[0.34, 0.28, 0.12]} c={C_BAG} />
          <Box p={[-0.62, 0.56, -0.14]} s={[0.34, 0.28, 0.12]} c={C_BAG} />
          {/* Tiang bendera merah putih mini di boncengan */}
          <Box p={[-0.82, 0.95, 0.06]} s={[0.015, 0.46, 0.015]} c={C_CHROME} />
          <Box p={[-0.72, 1.1, 0.06]} s={[0.18, 0.08, 0.01]} c="#b91c1c" />
          <Box p={[-0.72, 1.02, 0.06]} s={[0.18, 0.08, 0.01]} c="#f8fafc" />
        </group>
      )}
    </group>
  );
};
