// mobil-kuno-poly3d: Mobil dinas / sedan patroli militer & sedan sipil era 1940-an (Ford V8 / Buick / Chevrolet Master 1942).
// Terkenal sebagai jenis mobil yang digunakan Brigadir Mallaby saat insiden Jembatan Merah.
// Ciri: hidung kap mesin melengkung tinggi (radiator grille tegak), fender roda bulat lebar, lampu bulat, kaca depan terbelah dua (split windshield), dan ban serep samping.
// Dimensi: ~4.9m panjang x 1.7m tinggi x 1.9m lebar.
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';
import { flat } from './kit';

export const meta: ItemMeta = {
  id: 'mobil-kuno-poly3d',
  name: 'Mobil Sedan Kuno 1940-an (Mobil Dinas Mallaby / Sipil)',
  category: 'kendaraan-darat',
  benda: 'mobil-kuno',
  gaya: 'poly3d',
  tags: ['mobil', 'kuno', 'sedan', 'mallaby', '1945', 'surabaya', 'ford', 'buick', 'militer', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [4.9, 1.7, 1.9],
  variants: ['mallaby', 'sipil', 'hangus'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/mobil-kuno.tsx',
  invented: [
    'penyederhanaan lengkung bodi sedan 1940-an menjadi susunan kubus bertingkat',
    'varian hangus merepresentasikan mobil Mallaby setelah insiden granat/ledakan di Jembatan Merah',
  ],
};

type V3 = [number, number, number];

const Box: React.FC<{ p: V3; s: V3; c: string }> = ({ p, s, c }) => (
  <mesh position={p} material={flat(c)} castShadow receiveShadow>
    <boxGeometry args={s} />
  </mesh>
);

const wheelGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.22, 10);
const lightGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 8);

const LOOK = {
  mallaby: { body: '#3b4334', dark: '#242b1e', chrome: '#cbd5e1', glass: '#334155' }, // hijau militer staff car
  sipil: { body: '#1e293b', dark: '#0f172a', chrome: '#e2e8f0', glass: '#64748d' }, // sedan hitam elegan kolonial
  hangus: { body: '#1c1917', dark: '#0c0a09', chrome: '#44403c', glass: '#0c0a09' }, // rangka terbakar hangus
} as const;

export const Item3D: React.FC<Item3DProps> = ({ variant = 'mallaby' }) => {
  const L = variant === 'hangus' ? LOOK.hangus : variant === 'sipil' ? LOOK.sipil : LOOK.mallaby;
  const isBurnt = variant === 'hangus';

  const wheelPositions: V3[] = [
    [-1.4, 0.36, -0.92],
    [-1.4, 0.36, 0.92],
    [1.4, 0.36, -0.92],
    [1.4, 0.36, 0.92],
  ];

  return (
    <group>
      {/* --- RODA & FENDER --- */}
      {wheelPositions.map((p, i) => (
        <group key={`wheel-${i}`} position={p}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={flat('#1c1917')} castShadow>
            <primitive object={wheelGeo} attach="geometry" />
          </mesh>
          {/* Dop velg roda chrome */}
          <Box p={[0, 0, p[2] > 0 ? 0.12 : -0.12]} s={[0.22, 0.22, 0.04]} c={L.chrome} />
        </group>
      ))}

      {/* Fender samping pelindung roda memanjang */}
      <Box p={[0, 0.46, -0.92]} s={[4.4, 0.22, 0.26]} c={L.dark} />
      <Box p={[0, 0.46, 0.92]} s={[4.4, 0.22, 0.26]} c={L.dark} />
      {/* Pijakan samping kaki (running boards) */}
      <Box p={[0, 0.32, -0.9]} s={[2.0, 0.06, 0.24]} c="#1e293b" />
      <Box p={[0, 0.32, 0.9]} s={[2.0, 0.06, 0.24]} c="#1e293b" />

      {/* --- BODI UTAMA (CHASSIS & KABIN) --- */}
      {/* Sasis bawah */}
      <Box p={[0, 0.48, 0]} s={[4.6, 0.28, 1.6]} c={L.dark} />

      {/* Kap mesin depan (Engine Hood ke arah +X) */}
      <Box p={[1.2, 0.82, 0]} s={[1.9, 0.48, 1.4]} c={L.body} />
      {/* Radiator Grille depan tegak */}
      <Box p={[2.16, 0.8, 0]} s={[0.06, 0.52, 1.0]} c={L.chrome} />
      {/* Bumper depan & belakang chrome */}
      <Box p={[2.34, 0.4, 0]} s={[0.1, 0.12, 1.8]} c={L.chrome} />
      <Box p={[-2.34, 0.4, 0]} s={[0.1, 0.12, 1.8]} c={L.chrome} />

      {/* Lampu depan bulat (Headlamps) */}
      <mesh position={[2.15, 0.88, -0.62]} rotation={[0, 0, Math.PI / 2]} material={flat(isBurnt ? '#27272a' : '#fef08a')} castShadow>
        <primitive object={lightGeo} attach="geometry" />
      </mesh>
      <mesh position={[2.15, 0.88, 0.62]} rotation={[0, 0, Math.PI / 2]} material={flat(isBurnt ? '#27272a' : '#fef08a')} castShadow>
        <primitive object={lightGeo} attach="geometry" />
      </mesh>

      {/* Kabin penumpang tengah & belakang */}
      <Box p={[-0.45, 0.9, 0]} s={[2.3, 0.58, 1.62]} c={L.body} />
      {/* Atap kabin melengkung */}
      <Box p={[-0.55, 1.42, 0]} s={[1.9, 0.48, 1.46]} c={L.body} />

      {/* Kaca depan miring (Windshield) */}
      <Box p={[0.42, 1.34, 0]} s={[0.12, 0.38, 1.38]} c={L.glass} />
      {/* Pilar pemisah kaca depan split */}
      <Box p={[0.43, 1.34, 0]} s={[0.13, 0.38, 0.08]} c={L.body} />
      {/* Kaca samping & belakang */}
      <Box p={[-0.55, 1.38, -0.74]} s={[1.6, 0.32, 0.04]} c={L.glass} />
      <Box p={[-0.55, 1.38, 0.74]} s={[1.6, 0.32, 0.04]} c={L.glass} />
      <Box p={[-1.52, 1.36, 0]} s={[0.06, 0.32, 1.1]} c={L.glass} />

      {/* Bagasi belakang melengkung turun */}
      <Box p={[-1.85, 0.82, 0]} s={[0.7, 0.42, 1.42]} c={L.body} />
      {/* Ban serep terpasang di belakang */}
      <mesh position={[-2.22, 0.84, 0]} rotation={[0, 0, Math.PI / 2]} material={flat('#18181b')}>
        <primitive object={wheelGeo} attach="geometry" />
      </mesh>

      {/* Efek terbakar / asap untuk varian hangus Mallaby */}
      {isBurnt && (
        <group>
          {/* Pintu jebol / miring */}
          <Box p={[0.1, 0.85, 0.88]} s={[0.8, 0.45, 0.1]} c="#262626" />
          {/* Sisa jelaga hitam di kap */}
          <Box p={[1.1, 1.07, 0.1]} s={[1.2, 0.04, 0.9]} c="#09090b" />
        </group>
      )}
    </group>
  );
};
