// efektivitas materi ledakan dengan emissive & mesh standar Three.js
import React from 'react';
import * as THREE from 'three';
import type { Item3DProps, ItemMeta } from '../types';

export const meta: ItemMeta = {
  id: 'efek-ledakan-poly3d',
  name: 'Efek Ledakan, Api Menyala & Asap Hitam Tebal (1945)',
  category: 'alam',
  benda: 'efek-ledakan',
  gaya: 'poly3d',
  tags: ['ledakan', 'api', 'asap', 'fire', 'smoke', 'artileri', 'perang', '1945', 'low-poly'],
  era: '1945',
  region: 'Surabaya, Jawa Timur',
  size: [5.0, 6.5, 5.0],
  variants: ['ledakan', 'asap'],
  refs: 'packages/core/src/library/poly3d/refs.md',
  file: 'packages/core/src/library/poly3d/efek-ledakan.tsx',
  invented: ['bola-bola low-poly berlapis dengan material MeshStandardMaterial emissive menyala'],
};

const sphereGeo = new THREE.DodecahedronGeometry(1.0, 1);

// Material api dengan pendaran cahaya kuat (Emissive glow)
const matFireCore = new THREE.MeshStandardMaterial({
  color: '#ffffff',
  emissive: '#fef08a',
  emissiveIntensity: 3.5,
  roughness: 0.1,
  flatShading: true,
});

const matFireMid = new THREE.MeshStandardMaterial({
  color: '#ea580c',
  emissive: '#f97316',
  emissiveIntensity: 2.5,
  roughness: 0.2,
  flatShading: true,
});

const matFireOuter = new THREE.MeshStandardMaterial({
  color: '#991b1b',
  emissive: '#dc2626',
  emissiveIntensity: 1.5,
  roughness: 0.3,
  flatShading: true,
});

const matSmokeDark = new THREE.MeshStandardMaterial({
  color: '#18181b',
  roughness: 0.9,
  flatShading: true,
});

const matSmokeGrey = new THREE.MeshStandardMaterial({
  color: '#3f3f46',
  roughness: 0.85,
  flatShading: true,
});

export const Item3D: React.FC<Item3DProps> = ({ variant = 'ledakan', t = 0 }) => {
  const isSmoke = variant === 'asap';
  const pulse = Math.sin(t * 0.15) * 0.12;

  if (isSmoke) {
    return (
      <group position={[0, 0, 0]} scale={[1.2 + pulse, 1.4 + pulse, 1.2 + pulse]}>
        {/* Kolom asap hitam tebal mengepul membubung tinggi */}
        <mesh position={[0, 1.2, 0]} scale={1.4} material={matSmokeDark} castShadow>
          <primitive object={sphereGeo} attach="geometry" />
        </mesh>
        <mesh position={[0.5, 2.8, 0.3]} scale={1.8} material={matSmokeDark} castShadow>
          <primitive object={sphereGeo} attach="geometry" />
        </mesh>
        <mesh position={[-0.4, 4.4, -0.3]} scale={2.2} material={matSmokeGrey}>
          <primitive object={sphereGeo} attach="geometry" />
        </mesh>
        <mesh position={[0.3, 6.2, 0.4]} scale={2.8} material={matSmokeGrey}>
          <primitive object={sphereGeo} attach="geometry" />
        </mesh>
        <mesh position={[-0.2, 8.0, -0.2]} scale={3.4} material={matSmokeGrey}>
          <primitive object={sphereGeo} attach="geometry" />
        </mesh>
      </group>
    );
  }

  // Varian ledakan bola api memancar bercahaya
  return (
    <group scale={[1.4 + pulse, 1.4 + pulse, 1.4 + pulse]}>
      {/* Inti putih menyala pijar */}
      <mesh position={[0, 1.5, 0]} scale={1.5} material={matFireCore}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
      {/* Lidah api oranye mengembang */}
      <mesh position={[0.8, 2.0, 0.6]} scale={2.0} material={matFireMid}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
      <mesh position={[-0.9, 1.8, -0.5]} scale={1.9} material={matFireMid}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
      <mesh position={[0.2, 3.2, -0.4]} scale={2.1} material={matFireMid}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
      {/* Tepi luar merah dan jelaga hitam */}
      <mesh position={[1.2, 2.8, -0.8]} scale={1.6} material={matFireOuter}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
      <mesh position={[-1.1, 3.6, 0.7]} scale={1.7} material={matSmokeDark}>
        <primitive object={sphereGeo} attach="geometry" />
      </mesh>
    </group>
  );
};
