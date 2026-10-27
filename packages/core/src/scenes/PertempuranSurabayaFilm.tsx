// PertempuranSurabayaFilm.tsx: Film sinematik 5-Shot Perang Surabaya 1945
// Fix tuntas:
//   - Memakai CameraController agar camera.lookAt bekerja sempurna di Remotion ThreeCanvas.
//   - Posisi kamera dikalibrasi di luar batas objek (tidak menembus bodi/clipping plane).
//   - Intensitas cahaya ledakan diturunkan ke nilai proporsional (tidak overexposure putih).
//   - Asap Shot 5 dikecilkan dan ditarik ke atas agar mobil hangus dan jembatan terlihat jelas.
import React from 'react';
import * as THREE from 'three';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Aset3D } from '../library/aset';
import { CameraController } from './CameraController';

export const PERTEMPURAN_FILM_FRAMES = 720; // 24 detik pada 30 fps

const skySphereGeo = new THREE.SphereGeometry(650, 16, 16);

export const PertempuranSurabayaFilm: React.FC = () => {
  const frame = useCurrentFrame();

  let camPos: [number, number, number] = [0, 15, 30];
  let camTarget: [number, number, number] = [0, 1.8, 0];
  let currentShot = 1;
  let shotTitle = '';
  let shotDesc = '';

  if (frame < 130) {
    // SHOT 1: WIDE AERIAL ISOMETRIK (Jembatan Merah & Kali Mas)
    currentShot = 1;
    shotTitle = 'Kawasan Jembatan Merah · 30 Oktober 1945';
    shotDesc = 'Konvoi militer Brigade 49 Sekutu pimpinan Brigadir Mallaby memasuki pusat pertahanan Surabaya.';
    const p = frame / 130;
    camPos = [-8 + p * 4, 14 - p * 2, 24 - p * 4];
    camTarget = [0, 1.8, 0];
  } else if (frame < 270) {
    // SHOT 2: OVER-THE-SHOULDER PEJUANG DARI BELAKANG BARIKADE
    currentShot = 2;
    shotTitle = 'Pengepungan Rakyat Arek Suroboyo';
    shotDesc = 'Ribuan laskar pemuda bersenjatakan bambu runcing memblokade ketat konvoi jenderal Sekutu.';
    const p = (frame - 130) / 140;
    camPos = [-8.5 + p * 1.0, 4.2 + p * 0.2, 3.2 - p * 0.4];
    camTarget = [1.8, 2.0, 0.4];
  } else if (frame < 410) {
    // SHOT 3: MEDIUM CLOSE-UP MOBIL MALLABY & GRANAT (Kamera sudut 3/4)
    currentShot = 3;
    shotTitle = 'Detik-Detik Insiden Genting';
    shotDesc = 'Baku tembak pecah. Sebuah granat nanas dilemparkan ke kolong mobil sang jenderal.';
    const p = (frame - 270) / 140;
    camPos = [5.5 - p * 0.6, 3.8 + p * 0.1, 4.2 - p * 0.4];
    camTarget = [1.8, 1.8, 0.4];
  } else if (frame < 560) {
    // SHOT 4: HIGH-ANGLE BLAST ACTION (Y=8.5m, Z=12m)
    currentShot = 4;
    shotTitle = 'Ledakan Maut & Gugurnya Mallaby';
    shotDesc = 'Granat meledak membakar mobil perwira tinggi Sekutu. Surabaya meletus menjadi neraka pertempuran.';
    const p = (frame - 410) / 150;
    const shake = frame < 445 ? Math.sin(frame * 1.5) * 0.2 : 0;
    camPos = [1.8 + shake, 8.5 + p * 0.8 + shake, 12.0 - p * 1.2];
    camTarget = [1.8, 1.8, 0.4];
  } else {
    // SHOT 5: WIDE CINEMATIC AFTERMATH
    currentShot = 5;
    shotTitle = 'Surabaya Membara: Pantang Menyerah';
    shotDesc = 'Gedung kolonial luluh lantak dihujani mortir. Gugurnya Mallaby menyulut perang semesta 10 November.';
    const p = (frame - 560) / 160;
    camPos = [-4.0 + p * 3.0, 9.5 + p * 1.0, 20.0 - p * 2.0];
    camTarget = [1.8, 2.0, 0.4];
  }

  // Atmosfer & Warna Langit:
  const skyColor =
    frame < 410 ? '#334155' : frame < 530 ? '#c2410c' : '#7f1d1d';
  const ambientColor =
    frame < 410 ? '#cbd5e1' : frame < 530 ? '#ff7a00' : '#ea580c';

  const isExploding = frame >= 410 && frame <= 490;
  const carVariant = frame < 420 ? 'mallaby' : 'hangus';
  const buildingWest = frame < 460 ? 'utuh' : 'hancur';

  // Pesawat RAF Spitfire terbang
  const planeActive = (frame >= 10 && frame <= 130) || (frame >= 415 && frame <= 540);
  const planeX = interpolate(frame % 140, [0, 140], [-80, 80]);

  // Formasi laskar pejuang arek Suroboyo
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
    { p: [-8.8, 1.8, -0.2], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-10.2, 1.8, 0.2], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-5.2, 0.35, 4.6], r: [0, Math.PI / 2.5, 0], v: 'serang' },
    { p: [-6.8, 0.35, 4.9], r: [0, Math.PI / 2.6, 0], v: 'siap' },
    { p: [-5.2, 0.35, -4.6], r: [0, Math.PI / 1.5, 0], v: 'serang' },
    { p: [-6.8, 0.35, -4.9], r: [0, Math.PI / 1.6, 0], v: 'siap' },
  ];

  return (
    <AbsoluteFill style={{ background: '#090d16' }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 45, near: 0.1, far: 2000 }}
      >
        <CameraController pos={camPos} target={camTarget} />

        {/* Sky Dome Raksasa 3D */}
        <mesh scale={[-1, 1, 1]}>
          <primitive object={skySphereGeo} attach="geometry" />
          <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
        </mesh>

        {/* Pencahayaan sinematik */}
        <ambientLight color={ambientColor} intensity={frame >= 410 ? 1.6 : 1.0} />
        <directionalLight position={[-25, 45, 25]} color={frame >= 410 ? '#fed7aa' : '#ffffff'} intensity={frame >= 410 ? 2.4 : 1.6} castShadow />

        {/* Dynamic Point Light ledakan terkontrol (tidak overexposure) */}
        {isExploding && (
          <pointLight position={[1.8, 3.5, 0.4]} intensity={16.0} color="#ff6a00" distance={60} castShadow />
        )}
        {/* Pendaran api bara di Shot 5 */}
        {frame >= 530 && (
          <pointLight position={[1.8, 2.8, 0.4]} intensity={12.0} color="#dc2626" distance={45} />
        )}

        {/* --- 1. LINGKUNGAN SUNGAI & JALAN --- */}
        <group position={[0, -0.6, 0]}>
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[0, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[30, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[-30, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, 18]} />
          <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, -18]} />
        </group>

        {/* --- 2. JEMBATAN MERAH --- */}
        <Aset3D id="jembatan-merah-poly3d" variant="perang" position={[0, 0, 0]} />

        {/* --- 3. GEDUNG KOLONIAL WILLEMSPLEIN --- */}
        <Aset3D id="gedung-kolonial-poly3d" variant={buildingWest} position={[-14, 0, -18]} rotation={[0, 0.08, 0]} />
        <Aset3D id="gedung-kolonial-poly3d" variant="utuh" position={[16, 0, -19]} rotation={[0, -0.12, 0]} />

        {/* --- 4. KENDARAAN: MOBIL MALLABY, TANK SEKUTU, & SEPEDA ONTHEL --- */}
        <Aset3D id="mobil-kuno-poly3d" variant={carVariant} position={[1.8, 1.62, 0.4]} rotation={[0, 0.35, 0]} />
        <Aset3D id="tank-poly3d" variant="sekutu" position={[12.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} />
        <Aset3D id="sepeda-onthel-poly3d" variant="kurir" position={[-3.6, 1.8, 2.1]} rotation={[0, 0.5, 1.4]} />

        {/* --- 5. PASUKAN & SENJATA --- */}
        {pejuangGrid.map((pj, i) => (
          <Aset3D
            key={`pj-${i}`}
            id="pejuang-poly3d"
            variant={pj.v as any}
            position={pj.p as any}
            rotation={pj.r as any}
          />
        ))}

        {/* Rumpun bambu runcing pejuang */}
        <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-8.8, 1.8, -2.4]} />
        <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-11.5, 1.8, 2.5]} />

        {/* Tentara Sekutu British Army di sayap timur */}
        <Aset3D id="tentara-sekutu-poly3d" variant="bidik" position={[6.6, 1.8, -1.3]} rotation={[0, -Math.PI / 2.1, 0]} />
        <Aset3D id="tentara-sekutu-poly3d" variant="bidik" position={[8.2, 1.8, 1.0]} rotation={[0, -Math.PI / 2.3, 0]} />
        <Aset3D id="tentara-sekutu-poly3d" variant="siap" position={[10.2, 1.8, -1.6]} rotation={[0, -Math.PI / 2, 0]} />
        <Aset3D id="amunisi-granat-poly3d" variant="peti" position={[7.8, 1.8, -2.2]} />

        {/* Granat nanas di depan mobil Mallaby di Shot 3 */}
        {frame >= 280 && frame <= 420 && (
          <Aset3D id="amunisi-granat-poly3d" variant="granat" position={[3.2, 1.62, 0.8]} scale={1.8} />
        )}

        {/* --- 6. EFEK PERANG: LEDAKAN HEBAT & ASAP HITAM --- */}
        {isExploding && (
          <Aset3D id="efek-ledakan-poly3d" variant="ledakan" position={[1.8, 2.2, 0.4]} scale={1.8} t={frame} />
        )}

        {/* Asap membubung dari mobil Mallaby yang terbakar (Shot 4 & 5) */}
        {frame >= 420 && (
          <Aset3D id="efek-ledakan-poly3d" variant="asap" position={[1.8, 2.8, 0.4]} scale={1.5} t={frame} />
        )}

        {/* Asap dari gedung kolonial yang tertembak mortir */}
        {frame >= 460 && (
          <Aset3D id="efek-ledakan-poly3d" variant="asap" position={[-11.4, 7.5, -13.5]} scale={2.4} t={frame} />
        )}

        {/* --- 7. PESAWAT TEMPUR RAF PEMBOM SEKUTU DI LANGIT --- */}
        {planeActive && (
          <Aset3D id="pesawat-tempur-poly3d" variant="terbang" position={[planeX, 26, -34]} rotation={[0.08, 0, -0.06]} scale={1.4} />
        )}
      </ThreeCanvas>

      {/* --- HUD NARRATIVE OVERLAY SINEMATIK --- */}
      <div style={{ position: 'absolute', top: 36, left: 48, color: '#f8fafc', fontFamily: 'system-ui, sans-serif', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ padding: '3px 8px', borderRadius: 4, background: '#b91c1c', fontSize: 11, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase' }}>
            SHOT {currentShot} / 5
          </span>
          <span style={{ fontSize: 13, letterSpacing: 2.2, textTransform: 'uppercase', color: '#fed7aa', fontWeight: 700 }}>
            {shotTitle}
          </span>
        </div>
        <h1 style={{ margin: '8px 0 0', fontSize: 28, fontWeight: 900, textShadow: '0 3px 12px rgba(0,0,0,0.95)' }}>
          {currentShot === 1 && 'Kedatangan Konvoi Sekutu di Jembatan Merah'}
          {currentShot === 2 && 'Pengepungan Ketat Laskar Arek Suroboyo'}
          {currentShot === 3 && 'Tembakan Peringatan & Granat Dilemparkan'}
          {currentShot === 4 && 'Ledakan Dahsyat: Gugurnya Brigadir Mallaby'}
          {currentShot === 5 && 'Kota Membara: Arek Suroboyo Siap Bertempur Habis-habisan'}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 14, color: '#fed7aa', maxWidth: 700, textShadow: '0 2px 8px rgba(0,0,0,0.9)', lineHeight: 1.45 }}>
          {shotDesc}
        </p>
      </div>

      {/* Letterbox Sinematik 2.39:1 (Black Bar Atas & Bawah) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 48, background: '#000000' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: '#000000' }} />

      {/* Vinyet sinematik perang */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 160px rgba(0,0,0,0.9)',
        }}
      />
    </AbsoluteFill>
  );
};
