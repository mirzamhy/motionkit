// amunisi-granat-poly3d: Perlengkapan amunisi tempur, granat nanas (Mills bomb), peti peluru kayu militer, dan mortir 1945.
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'amunisi-granat-poly3d',
  name: 'Peti Amunisi, Granat Nanas, dan Mortir Perang (1945)',
  category: 'properti',
  benda: 'amunisi-granat',
  gaya: 'poly3d',
  tags: ['amunisi', 'granat', 'mills bomb', 'peti peluru', 'mortir', '1945', 'surabaya', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [1.2, 0.6, 0.8],
  variants: ['peti', 'granat'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/amunisi-granat.tsx',
  invented: ['penyederhanaan tekstur cor granat Mills bomb menjadi oktagon flat-shaded'],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const grenadeGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.18, 8);
const shellGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.45, 8);

const C_WOOD_BOX = '#5a4d3b';
const C_WOOD_DARK = '#3d3427';
const C_GRENADE = '#2f3b26';
const C_SHELL_BRASS = '#d4af37';
const C_SHELL_TIP = '#475569';

export const Item3D: React.FC<Item3DProps> = ({ variant = 'peti' }) => {
  if (variant === 'granat') {
    return (
      <group>
        {/* Tiga granat nanas tergeletak */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <group key={`gr-${i}`} position={[x, 0.1, 0]} rotation={[0.2, i * 0.4, 0]}>
            <mesh material={flat(C_GRENADE)} castShadow>
              <primitive object={grenadeGeo} attach="geometry" />
            </mesh>
            {/* Pemantik / tuas granat */}
            <Box p={[0, 0.11, 0]} s={[0.04, 0.04, 0.04]} c="#71717a" />
            <Box p={[0.03, 0.08, 0]} s={[0.02, 0.08, 0.03]} c="#a1a1aa" />
          </group>
        ))}
      </group>
    );
  }

  return (
    <group>
      {/* Peti kayu amunisi terbuka */}
      <Box p={[0, 0.25, 0]} s={[1.1, 0.48, 0.7]} c={C_WOOD_BOX} />
      {/* Rangka besi penguat peti */}
      <Box p={[0, 0.25, 0.36]} s={[1.12, 0.5, 0.04]} c={C_WOOD_DARK} />
      <Box p={[0, 0.25, -0.36]} s={[1.12, 0.5, 0.04]} c={C_WOOD_DARK} />
      <Box p={[-0.56, 0.25, 0]} s={[0.04, 0.5, 0.72]} c={C_WOOD_DARK} />
      <Box p={[0.56, 0.25, 0]} s={[0.04, 0.5, 0.72]} c={C_WOOD_DARK} />

      {/* Selongsong peluru artileri/mortir berjajar di atas peti */}
      {[-0.32, -0.16, 0, 0.16, 0.32].map((x, i) => (
        <group key={`sh-${i}`} position={[x, 0.52, 0]}>
          <mesh material={flat(C_SHELL_BRASS)}>
            <primitive object={shellGeo} attach="geometry" />
          </mesh>
          <Box p={[0, 0.24, 0]} s={[0.06, 0.06, 0.06]} c={C_SHELL_TIP} />
        </group>
      ))}
    </group>
  );
};
