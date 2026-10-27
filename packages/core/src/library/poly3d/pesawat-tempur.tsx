// pesawat-tempur-poly3d: Pesawat tempur Sekutu / RAF (Royal Air Force) era Pertempuran Surabaya November 1945.
// Terinspirasi dari Hawker Sea Fury / Supermarine Spitfire / Thunderbolt P-47 yang membombardir Surabaya dari pangkalan udara & kapal induk.
// Ciri: baling-baling putar moncong depan, sayap eliptik/lebar dengan kanon meriam sayap, kanopi kokpit kaca teardrop, ekor kemudi vertikal, dan lambang roundel Sekutu (lingkaran merah-putih-biru).
// Dimensi: ~9.8m panjang x 3.2m tinggi x 11.2m rentang sayap.
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'pesawat-tempur-poly3d',
  name: 'Pesawat Tempur Pembom Sekutu (RAF Spitfire / Thunderbolt 1945)',
  category: 'properti',
  benda: 'pesawat-tempur',
  gaya: 'poly3d',
  tags: ['pesawat', 'tempur', 'raf', 'sekutu', 'spitfire', 'thunderbolt', 'surabaya 1945', 'bombardir', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [9.8, 3.2, 11.2],
  variants: ['terbang', 'mendarat'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/pesawat-tempur.tsx',
  invented: [
    'penyederhanaan bodi aerodinamis menjadi fuselage bertingkat flat-shaded',
    'putaran baling-baling disederhanakan dengan piringan transparan berbaling empat',
  ],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const propGeo = new THREE.BoxGeometry(0.08, 2.4, 0.16);
const spinnerGeo = new THREE.ConeGeometry(0.35, 0.7, 8);
const cannonGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 6);

const C_CAMO_DARK = '#3d4436'; // hijau kamuflase hutan militer
const C_CAMO_GREY = '#535c68'; // kelabu RAF
const C_UNDER = '#718093'; // perut bawah pesawat abu-abu langit
const C_GLASS = '#38bdf8'; // kaca kokpit
const C_SPINNER = '#b91c1c'; // moncong merah
const C_ROUNDEL_BLUE = '#1e3a8a';
const C_ROUNDEL_WHITE = '#f8fafc';
const C_ROUNDEL_RED = '#dc2626';

export const Item3D: React.FC<Item3DProps> = ({ variant = 'terbang' }) => {
  const isLanded = variant === 'mendarat';

  return (
    <group>
      {/* --- FUSELAGE / BADAN PESAWAT UTAMA (MENGARAH KE +X) --- */}
      {/* Moncong mesin & cowl depan */}
      <Box p={[3.2, 1.4, 0]} s={[2.2, 1.3, 1.3]} c={C_CAMO_DARK} />
      {/* Spinner kerucut moncong merah depan (+X) */}
      <mesh position={[4.6, 1.4, 0]} rotation={[0, 0, -Math.PI / 2]} material={flat(C_SPINNER)} castShadow>
        <primitive object={spinnerGeo} attach="geometry" />
      </mesh>
      {/* 4 Bilah Baling-baling (Propeller) */}
      <mesh position={[4.35, 1.4, 0]} material={flat('#1c1917')}>
        <primitive object={propGeo} attach="geometry" />
      </mesh>
      <mesh position={[4.35, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={flat('#1c1917')}>
        <primitive object={propGeo} attach="geometry" />
      </mesh>

      {/* Badan tengah pesawat (Kokpit) */}
      <Box p={[1.0, 1.4, 0]} s={[2.6, 1.35, 1.25]} c={C_CAMO_DARK} />
      {/* Kanopi kaca kokpit teardrop */}
      <Box p={[0.8, 2.25, 0]} s={[1.6, 0.5, 0.7]} c={C_GLASS} />
      <Box p={[0.2, 2.15, 0]} s={[0.8, 0.35, 0.65]} c={C_CAMO_DARK} />

      {/* Badan belakang meruncing ke ekor */}
      <Box p={[-1.8, 1.45, 0]} s={[3.4, 1.0, 0.85]} c={C_CAMO_GREY} />
      <Box p={[-3.8, 1.55, 0]} s={[1.8, 0.6, 0.45]} c={C_CAMO_GREY} />

      {/* --- SAYAP UTAMA (MAIN WINGS di sumbu Z, rentang ~11.2m) --- */}
      {/* Sayap kiri & kanan terintegrasi */}
      <Box p={[1.4, 1.05, 0]} s={[2.2, 0.16, 11.0]} c={C_CAMO_DARK} />
      {/* Ujung sayap menirus */}
      <Box p={[1.5, 1.06, 5.0]} s={[1.4, 0.12, 1.2]} c={C_CAMO_GREY} />
      <Box p={[1.5, 1.06, -5.0]} s={[1.4, 0.12, 1.2]} c={C_CAMO_GREY} />

      {/* Lambang Roundel Sekutu di atas sayap kiri & kanan */}
      {/* Kanan (Z = +3.4) */}
      <group position={[1.4, 1.15, 3.4]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.02, 0.9]} c={C_ROUNDEL_BLUE} />
        <Box p={[0, 0.01, 0]} s={[0.6, 0.02, 0.6]} c={C_ROUNDEL_WHITE} />
        <Box p={[0, 0.02, 0]} s={[0.3, 0.02, 0.3]} c={C_ROUNDEL_RED} />
      </group>
      {/* Kiri (Z = -3.4) */}
      <group position={[1.4, 1.15, -3.4]}>
        <Box p={[0, 0, 0]} s={[0.9, 0.02, 0.9]} c={C_ROUNDEL_BLUE} />
        <Box p={[0, 0.01, 0]} s={[0.6, 0.02, 0.6]} c={C_ROUNDEL_WHITE} />
        <Box p={[0, 0.02, 0]} s={[0.3, 0.02, 0.3]} c={C_ROUNDEL_RED} />
      </group>

      {/* 2 Laras Kanon Meriam Hispano 20mm menjorok ke depan di sayap */}
      <mesh position={[2.7, 1.05, 2.2]} rotation={[0, 0, Math.PI / 2]} material={flat('#1c1917')}>
        <primitive object={cannonGeo} attach="geometry" />
      </mesh>
      <mesh position={[2.7, 1.05, -2.2]} rotation={[0, 0, Math.PI / 2]} material={flat('#1c1917')}>
        <primitive object={cannonGeo} attach="geometry" />
      </mesh>

      {/* --- SIRIP EKOR & STABILIZER (TAIL ASSEMBLY) --- */}
      {/* Fin vertikal kemudi atas */}
      <Box p={[-4.3, 2.5, 0]} s={[1.2, 1.4, 0.12]} c={C_CAMO_DARK} />
      {/* Stabilizer horizontal kiri & kanan */}
      <Box p={[-4.2, 1.75, 0]} s={[1.1, 0.1, 3.6]} c={C_CAMO_GREY} />

      {/* --- RODA PENDARAT (LANDING GEAR) bila mendarat --- */}
      {isLanded && (
        <group>
          {/* Roda depan kiri & kanan */}
          <Box p={[1.5, 0.5, 1.8]} s={[0.1, 1.0, 0.1]} c="#27272a" />
          <Box p={[1.5, 0.25, 1.8]} s={[0.4, 0.4, 0.18]} c="#0f172a" />
          <Box p={[1.5, 0.5, -1.8]} s={[0.1, 1.0, 0.1]} c="#27272a" />
          <Box p={[1.5, 0.25, -1.8]} s={[0.4, 0.4, 0.18]} c="#0f172a" />
          {/* Roda ekor kecil */}
          <Box p={[-4.4, 0.8, 0]} s={[0.08, 0.8, 0.08]} c="#27272a" />
          <Box p={[-4.4, 0.2, 0]} s={[0.2, 0.2, 0.1]} c="#0f172a" />
        </group>
      )}
    </group>
  );
};
