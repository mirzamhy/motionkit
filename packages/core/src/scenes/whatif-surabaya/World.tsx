import React from 'react';
import * as THREE from 'three';
import { interpolate } from 'remotion';
import { Aset3D } from '../../library/aset';
import { CameraController } from '../CameraController';
import { F, ShotName } from './timeline';

export const World: React.FC<{ frame: number; shot: ShotName }> = ({ frame, shot }) => {
  // Kamera Sinematik Portrait (1080x1920) dengan CameraController
  let camPos: [number, number, number] = [0, 16, 26];
  let camTarget: [number, number, number] = [0, 1.8, 0];

  if (shot === 'standoff') {
    // Shot 1: High-angle Portrait menatap jembatan & kepungan laskar
    const p = frame / 180;
    camPos = [-6 + p * 3, 14 - p * 2, 22 - p * 3];
    camTarget = [0.8, 1.8, 0.4];
  } else if (shot === 'incident') {
    // Shot 2: Freeze-frame divergence / Flashpoint di dekat mobil
    const p = (frame - 180) / 90;
    camPos = [4.2 - p * 0.4, 3.2, 4.0 - p * 0.5];
    camTarget = [1.8, 1.8, 0.4];
  } else if (shot === 'negotiation') {
    // Shot 3: Skenario Alternatif Damai (Pencahayaan terang tenang)
    const p = (frame - 270) / 240;
    camPos = [-1.0 + p * 2.0, 6.5, 14.0 - p * 1.5];
    camTarget = [1.8, 1.8, 0.4];
  } else {
    // Shot 4: Re-okupasi & Peringatan Sejarah
    const p = (frame - 510) / 210;
    camPos = [2.0 + p * 2.5, 10.0 + p * 1.0, 20.0 - p * 2.0];
    camTarget = [0, 1.8, 0];
  }

  // Atmosfer & Cuaca
  const isAltHistory = frame >= 270 && frame < 510;
  const isDarkReoccupation = frame >= 510;
  
  const lightColor = isAltHistory ? '#fed7aa' : isDarkReoccupation ? '#e2e8f0' : '#fef08a';
  const lightIntensity = isAltHistory ? 2.5 : isDarkReoccupation ? 1.5 : 2.0;

  // Formasi Laskar Pejuang
  const pejuangGrid = [
    { p: [-4.2, 1.8, -1.2], r: [0, Math.PI / 2.2, 0], v: 'serang' },
    { p: [-4.4, 1.8, -0.4], r: [0, Math.PI / 2.1, 0], v: 'serang' },
    { p: [-4.3, 1.8, 0.4], r: [0, Math.PI / 2.0, 0], v: 'serang' },
    { p: [-4.5, 1.8, 1.2], r: [0, Math.PI / 1.9, 0], v: 'serang' },
    { p: [-5.6, 1.8, -1.6], r: [0, Math.PI / 2.3, 0], v: 'siap' },
    { p: [-5.7, 1.8, -0.7], r: [0, Math.PI / 2.2, 0], v: 'serang' },
    { p: [-5.5, 1.8, 0.2], r: [0, Math.PI / 2.0, 0], v: 'serang' },
    { p: [-5.8, 1.8, 1.1], r: [0, Math.PI / 2.1, 0], v: 'siap' },
    { p: [-7.0, 1.8, -1.4], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-7.2, 1.8, -0.4], r: [0, Math.PI / 2.1, 0], v: 'siap' },
    { p: [-7.1, 1.8, 0.6], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-7.3, 1.8, 1.5], r: [0, Math.PI / 1.9, 0], v: 'siap' },
  ];

  return (
    <>
      <CameraController pos={camPos} target={camTarget} />

      {/* Pencahayaan simulasi */}
      <ambientLight color="#cbd5e1" intensity={0.9} />
      <directionalLight position={[-20, 45, 20]} color={lightColor} intensity={lightIntensity} castShadow />

      {/* Sungai Kali Mas & Jalan */}
      <group position={[0, -0.6, 0]}>
        <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[0, -0.4, 0]} />
        <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, 18]} />
        <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, -18]} />
      </group>

      {/* Jembatan Merah */}
      <Aset3D id="jembatan-merah-poly3d" variant="perang" position={[0, 0, 0]} />

      {/* Gedung Kolonial Belanda */}
      <Aset3D id="gedung-kolonial-poly3d" variant={isDarkReoccupation ? 'hancur' : 'utuh'} position={[-14, 0, -18]} rotation={[0, 0.08, 0]} />
      <Aset3D id="gedung-kolonial-poly3d" variant="utuh" position={[16, 0, -19]} rotation={[0, -0.12, 0]} />

      {/* Mobil Mallaby & Tank */}
      <Aset3D id="mobil-kuno-poly3d" variant={isDarkReoccupation ? 'hangus' : 'mallaby'} position={[1.8, 1.62, 0.4]} rotation={[0, 0.35, 0]} />
      <Aset3D id="tank-poly3d" variant="sekutu" position={[12.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Laskar Pejuang Surabaya */}
      {pejuangGrid.map((pj, i) => (
        <Aset3D
          key={`pj-${i}`}
          id="pejuang-poly3d"
          variant={pj.v as any}
          position={pj.p as any}
          rotation={pj.r as any}
        />
      ))}

      {/* Senjata Bambu Runcing */}
      <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-8.8, 1.8, -2.4]} />
      <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-11.5, 1.8, 2.5]} />

      {/* Tentara Sekutu */}
      <Aset3D id="tentara-sekutu-poly3d" variant="bidik" position={[6.6, 1.8, -1.3]} rotation={[0, -Math.PI / 2.1, 0]} />
      <Aset3D id="tentara-sekutu-poly3d" variant="siap" position={[10.2, 1.8, -1.6]} rotation={[0, -Math.PI / 2, 0]} />
    </>
  );
};
