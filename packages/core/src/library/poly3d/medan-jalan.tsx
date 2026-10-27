// medan-jalan-poly3d: Ruas jalan aspal tua, trotoar batu, tanggul sungai Kali Mas, dan tanah berlumpur berpuing Surabaya 1945.
import React from 'react';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'medan-jalan-poly3d',
  name: 'Medan Jalan Kota & Tepi Sungai Kali Mas (1945)',
  category: 'alam',
  benda: 'medan-jalan',
  gaya: 'poly3d',
  tags: ['jalan', 'medan', 'aspal', 'tanah', 'kali mas', 'surabaya 1945', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [30, 1.2, 30],
  variants: ['jalan', 'sungai'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/medan-jalan.tsx',
  invented: ['sektor jalan modular dengan saluran air samping dan trotoar batu kolonial'],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const C_ASPHALT = '#27272a';
const C_STONE = '#52525b';
const C_DIRT = '#3f3a2c';
const C_WATER = '#1e3a5f';

export const Item3D: React.FC<Item3DProps> = ({ variant = 'jalan' }) => {
  if (variant === 'sungai') {
    return (
      <group>
        {/* Air sungai Kali Mas */}
        <Box p={[0, -0.4, 0]} s={[30, 0.4, 30]} c={C_WATER} />
        {/* Dinding tanggul batu kali di kedua sisi */}
        <Box p={[0, 0.2, -12]} s={[30, 1.0, 2.4]} c={C_STONE} />
        <Box p={[0, 0.2, 12]} s={[30, 1.0, 2.4]} c={C_STONE} />
      </group>
    );
  }

  return (
    <group>
      {/* Dasar tanah/lumpur kota */}
      <Box p={[0, -0.1, 0]} s={[30, 0.2, 30]} c={C_DIRT} />
      {/* Badan jalan aspal utama selebar 12m memanjang sumbu X */}
      <Box p={[0, 0.05, 0]} s={[30, 0.1, 12]} c={C_ASPHALT} />
      {/* Trotoar pejalan kaki utara dan selatan */}
      <Box p={[0, 0.15, -7]} s={[30, 0.18, 2.2]} c={C_STONE} />
      <Box p={[0, 0.15, 7]} s={[30, 0.18, 2.2]} c={C_STONE} />
    </group>
  );
};
