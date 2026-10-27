// gedung-kolonial-poly3d: Bangunan kolonial Belanda di kawasan Jembatan Merah (Willemsplein / Kaliasin 1945).
// Ciri arsitektur: pilar arcade lengkung di lantai bawah, jendela louvre kayu berbaris di lantai atas, dinding kapur tebal, cornice klasik, atap pelana genteng terakota, dan menara atap jam sudut.
// Dimensi: ~14m panjang x 11m tinggi x 9m lebar.
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'gedung-kolonial-poly3d',
  name: 'Gedung Kolonial Belanda Surabaya (Kawasan Jembatan Merah)',
  category: 'bangunan',
  benda: 'gedung-kolonial',
  gaya: 'poly3d',
  tags: ['gedung', 'kolonial', 'belanda', 'jembatan merah', 'internatio', 'willemsplein', 'surabaya 1945', 'kota tua', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [14, 11, 9],
  variants: ['utuh', 'hancur'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/gedung-kolonial.tsx',
  invented: [
    'penyederhanaan ornamen kolonial Belanda (arcade pilar dan lis jendela kotak)',
    'varian hancur menyertakan lubang kawah artileri di dinding dan puing bata merah',
  ],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const roofGeo = new THREE.ConeGeometry(2.2, 3.2, 4);

const C_WALL = '#f1ece1'; // putih kapur krem kolonial
const C_WALL_DARK = '#dcd5c7';
const C_PILLAR = '#e2dacb';
const C_WOOD = '#3e2723'; // kusen kayu jati tua
const C_WINDOW_GLASS = '#475569';
const C_ROOF = '#9c412e'; // genteng terakota merah bata
const C_STONE = '#52525b';
const C_RUBBLE = '#854d0e';

export const Item3D: React.FC<Item3DProps> = ({ variant = 'utuh' }) => {
  const isRuined = variant === 'hancur';
  const windowXs = [-4.8, -2.4, 0, 2.4, 4.8];

  return (
    <group>
      {/* --- PONDASI & LANTAI DASAR --- */}
      <Box p={[0, 0.4, 0]} s={[14.4, 0.8, 9.4]} c={C_STONE} />

      {/* --- LANTAI 1 (ARCADE KOLONIAL) --- */}
      {/* Dinding utama lantai 1 */}
      <Box p={[0, 2.8, -0.6]} s={[13.8, 4.0, 7.8]} c={C_WALL} />

      {/* Pilar-pilar arcade di fasad depan (+Z = 3.6) */}
      {windowXs.map((x, i) => (
        <group key={`arcade-${i}`}>
          <Box p={[x, 2.8, 3.8]} s={[0.8, 4.0, 0.8]} c={C_PILLAR} />
          {/* Lengkungan atas arcade */}
          <Box p={[x, 4.5, 3.8]} s={[1.6, 0.4, 0.82]} c={C_PILLAR} />
          {/* Pintu/jendela lantai 1 di balik pilar */}
          <Box p={[x, 2.3, 3.32]} s={[1.2, 3.0, 0.1]} c={C_WOOD} />
          <Box p={[x, 2.8, 3.38]} s={[0.9, 1.8, 0.05]} c={C_WINDOW_GLASS} />
        </group>
      ))}

      {/* Cornice pembatas lantai 1 dan 2 */}
      <Box p={[0, 4.9, 0.2]} s={[14.6, 0.35, 9.6]} c={C_WALL_DARK} />

      {/* --- LANTAI 2 (BARISAN JENDELA LOUVRE TINGGI) --- */}
      <Box p={[0, 7.2, 0]} s={[13.8, 4.2, 8.8]} c={C_WALL} />

      {/* Barisan jendela lantai 2 fasad depan */}
      {windowXs.map((x, i) => (
        <group key={`win2-${i}`}>
          <Box p={[x, 7.4, 4.42]} s={[1.4, 2.6, 0.1]} c={C_WOOD} />
          <Box p={[x, 7.4, 4.48]} s={[1.1, 2.2, 0.05]} c={C_WINDOW_GLASS} />
          {/* Topi pelindung hujan jendela */}
          <Box p={[x, 8.8, 4.6]} s={[1.6, 0.18, 0.35]} c={C_WALL_DARK} />
        </group>
      ))}

      {/* Cornice atap mahkota bangunan */}
      <Box p={[0, 9.4, 0]} s={[14.8, 0.45, 9.8]} c={C_WALL_DARK} />

      {/* --- ATAP UTAMA PELANA MANSARD --- */}
      <Box p={[0, 10.3, 0]} s={[13.6, 1.4, 8.4]} c={C_ROOF} />
      <Box p={[0, 11.2, 0]} s={[11.8, 0.6, 6.8]} c={C_ROOF} />

      {/* --- MENARA SUDUT MAHKOTA (CORNER TOWER) --- */}
      <group position={[-5.8, 10.2, 3.4]}>
        <Box p={[0, 0.8, 0]} s={[2.2, 1.8, 2.2]} c={C_WALL} />
        {/* Jam dinding bundar fasad sudut */}
        <Box p={[0, 0.9, 1.12]} s={[0.9, 0.9, 0.06]} c="#1e293b" />
        <Box p={[0, 0.9, 1.15]} s={[0.7, 0.7, 0.02]} c="#f8fafc" />
        {/* Kubah puncak menara */}
        <mesh position={[0, 2.6, 0]} rotation={[0, Math.PI / 4, 0]} material={flat(C_ROOF)} castShadow>
          <primitive object={roofGeo} attach="geometry" />
        </mesh>
      </group>

      {/* --- DETAIL VARIAN HANCUR (BEKAS MERIAM & JEBOL ARTILERI) --- */}
      {isRuined && (
        <group>
          {/* Kawah jebol di lantai 2 sebelah kanan */}
          <Box p={[2.6, 7.2, 4.4]} s={[2.2, 2.2, 0.5]} c="#18181b" />
          <Box p={[2.6, 6.1, 4.6]} s={[1.8, 0.4, 0.6]} c={C_RUBBLE} />
          {/* Retakan hitam di dinding */}
          <Box p={[3.9, 8.2, 4.45]} s={[0.1, 1.2, 0.02]} c="#27272a" />
          <Box p={[1.3, 6.4, 4.45]} s={[0.1, 0.9, 0.02]} c="#27272a" />
          {/* Tumpukan puing batu bata runtuh di trotoar bawah */}
          <Box p={[2.6, 0.6, 4.8]} s={[3.2, 0.6, 1.6]} c={C_RUBBLE} />
          <Box p={[3.2, 0.9, 5.0]} s={[1.4, 0.5, 1.0]} c={C_STONE} />
        </group>
      )}
    </group>
  );
};
