// PertempuranSurabaya3D: Film animasi sinematik Pertempuran Jembatan Merah Surabaya 1945
// Fix tuntas:
//   1. Menggunakan SKY DOME BOLA RAKSASA 3D (radius 600m) langsung di dalam Three.js scene, sehingga warna langit merah-oranye bara api 100% aktif dan tercermin di pencahayaan!
//   2. Formasi padat puluhan laskar pejuang konsisten sejak frame 0 hingga 360.
//   3. Mesh api ledakan disesuaikan skalanya (tidak memotong batas frame atas) dan dipadukan dengan percikan api bara.
//   4. Ambient light & directional light warna oranye-merah panas di babak pertempuran.
import React from 'react';
import * as THREE from 'three';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { Aset3D } from '../library/aset';

export const PERTEMPURAN_SURABAYA_FRAMES = 360; // 12 detik pada 30 fps

const skySphereGeo = new THREE.SphereGeometry(600, 16, 16);

export const PertempuranSurabaya3D: React.FC = () => {
  const frame = useCurrentFrame();

  // Kamera HIGH-ANGLE ISOMETRIK KONSISTEN
  const camX = interpolate(frame, [0, 150, 240, 360], [-10, 0, 4, 1], { extrapolateRight: 'clamp' });
  const camY = interpolate(frame, [0, 150, 240, 360], [17, 13.5, 12, 11], { extrapolateRight: 'clamp' });
  const camZ = interpolate(frame, [0, 150, 240, 360], [30, 23, 19, 16], { extrapolateRight: 'clamp' });

  // Warna langit 3D: dari sore mendung perang kelabu -> transisi dramatis menjadi MERAH MEMBARA API KOTA SURABAYA
  const skyColorHex =
    frame < 145 ? '#334155' : frame < 220 ? '#991b1b' : '#7c2d12';
  const ambientLightColor =
    frame < 145 ? '#cbd5e1' : frame < 220 ? '#ff7a00' : '#ea580c';
  const sunLightColor =
    frame < 145 ? '#fed7aa' : '#ffedd5';

  // Pesawat tempur RAF Spitfire melintas di langit
  const planeX = interpolate(frame, [0, 190], [-80, 80], { extrapolateRight: 'clamp' });
  const planeY = 25 + Math.sin(frame * 0.05) * 1.5;

  const isExploding = frame >= 145 && frame <= 225;
  const carVariant = frame < 165 ? 'mallaby' : 'hangus';
  const buildingVariant = frame < 170 ? 'utuh' : 'hancur';

  // Formasi padat puluhan laskar pejuang arek Suroboyo (aktif konsisten sepanjang scene)
  const pejuangGrid = [
    // Barisan barikade jembatan barat
    { p: [-5.2, 1.8, -1.8], r: [0, Math.PI / 2.2, 0], v: 'serang' },
    { p: [-5.4, 1.8, -0.9], r: [0, Math.PI / 2.1, 0], v: 'serang' },
    { p: [-5.3, 1.8, 0.0], r: [0, Math.PI / 2.0, 0], v: 'serang' },
    { p: [-5.5, 1.8, 0.9], r: [0, Math.PI / 2.0, 0], v: 'serang' },
    { p: [-5.3, 1.8, 1.8], r: [0, Math.PI / 1.8, 0], v: 'serang' },

    // Barisan lapis kedua (rapat di belakang karung pasir)
    { p: [-6.8, 1.8, -2.1], r: [0, Math.PI / 2.3, 0], v: 'siap' },
    { p: [-6.9, 1.8, -1.2], r: [0, Math.PI / 2.2, 0], v: 'serang' },
    { p: [-6.7, 1.8, -0.3], r: [0, Math.PI / 2.0, 0], v: 'serang' },
    { p: [-7.0, 1.8, 0.6], r: [0, Math.PI / 2.1, 0], v: 'siap' },
    { p: [-6.8, 1.8, 1.5], r: [0, Math.PI / 1.9, 0], v: 'serang' },
    { p: [-6.7, 1.8, 2.3], r: [0, Math.PI / 1.8, 0], v: 'siap' },

    // Barisan lapis ketiga di jalan raya barat
    { p: [-8.4, 1.8, -2.0], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-8.5, 1.8, -1.0], r: [0, Math.PI / 2.1, 0], v: 'siap' },
    { p: [-8.3, 1.8, 0.0], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-8.6, 1.8, 1.0], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-8.4, 1.8, 2.0], r: [0, Math.PI / 1.9, 0], v: 'siap' },

    // Massa pejuang cadangan di sayap trotoar utara & selatan
    { p: [-9.8, 1.8, -1.5], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-10.0, 1.8, 0.2], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-9.9, 1.8, 1.6], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-11.5, 1.8, -0.6], r: [0, Math.PI / 2, 0], v: 'siap' },
    { p: [-11.6, 1.8, 0.8], r: [0, Math.PI / 2, 0], v: 'siap' },

    // Pasukan pejuang di bibir tanggul Kali Mas kiri & kanan
    { p: [-6.2, 0.35, 4.8], r: [0, Math.PI / 2.5, 0], v: 'serang' },
    { p: [-7.8, 0.35, 5.2], r: [0, Math.PI / 2.6, 0], v: 'siap' },
    { p: [-9.4, 0.35, 5.5], r: [0, Math.PI / 2.6, 0], v: 'siap' },
    { p: [-6.2, 0.35, -4.8], r: [0, Math.PI / 1.5, 0], v: 'serang' },
    { p: [-7.8, 0.35, -5.2], r: [0, Math.PI / 1.6, 0], v: 'siap' },
    { p: [-9.4, 0.35, -5.5], r: [0, Math.PI / 1.6, 0], v: 'siap' },
  ];

  return (
    <AbsoluteFill style={{ background: '#090d16' }}>
      <ThreeCanvas
        width={1920}
        height={1080}
        camera={{ fov: 44, position: [camX, camY, camZ], near: 0.1, far: 2000 }}
      >
        {/* Sky Dome Raksasa 3D di dalam Scene */}
        <mesh scale={[-1, 1, 1]}>
          <primitive object={skySphereGeo} attach="geometry" />
          <meshBasicMaterial color={skyColorHex} side={THREE.BackSide} />
        </mesh>

        {/* --- PENCAHAYAAN AMBIENCE KOTA MEMBARA --- */}
        <ambientLight color={ambientLightColor} intensity={frame > 145 ? 1.6 : 0.8} />
        <hemisphereLight args={[skyColorHex, '#1c1917', frame > 145 ? 1.8 : 1.0]} />
        <directionalLight position={[-25, 50, 25]} color={sunLightColor} intensity={frame > 145 ? 2.8 : 1.6} castShadow />

        {/* Dynamic Point Light pendaran api ledakan super intensif */}
        {isExploding && (
          <pointLight position={[1.8, 3.8, 0.4]} intensity={60.0} color="#ff6200" distance={80} castShadow />
        )}
        {/* Pendaran api merah membara pasca tragedi pada mobil Mallaby */}
        {frame > 225 && (
          <pointLight position={[1.8, 2.8, 0.4]} intensity={20.0} color="#f97316" distance={45} />
        )}

        {/* --- 1. LINGKUNGAN: SUNGAI KALI MAS KERUH & MEDAN JALAN KOTA --- */}
        <group position={[0, -0.6, 0]}>
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[0, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[30, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="sungai" position={[-30, -0.4, 0]} />
          <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, 18]} />
          <Aset3D id="medan-jalan-poly3d" variant="jalan" position={[0, 0, -18]} />
        </group>

        {/* --- 2. JEMBATAN MERAH (IKON SEJARAH PERTEMPURAN 1945) --- */}
        <Aset3D id="jembatan-merah-poly3d" variant="perang" position={[0, 0, 0]} />

        {/* --- 3. KAWASAN GEDUNG KOLONIAL BELANDA (GEDUNG INTERNATIO) --- */}
        {/* Gedung barat (terkena mortir perang pada babak akhir) */}
        <Aset3D id="gedung-kolonial-poly3d" variant={buildingVariant} position={[-14, 0, -18]} rotation={[0, 0.08, 0]} />
        {/* Gedung timur */}
        <Aset3D id="gedung-kolonial-poly3d" variant="utuh" position={[16, 0, -19]} rotation={[0, -0.12, 0]} />

        {/* --- 4. KENDARAAN: MOBIL MALLABY, TANK SEKUTU, DAN SEPEDA ONTHEL --- */}
        {/* Mobil Sedan Mallaby di tengah jembatan */}
        <Aset3D id="mobil-kuno-poly3d" variant={carVariant} position={[1.8, 1.62, 0.4]} rotation={[0, 0.35, 0]} />

        {/* Tank Tempur Sekutu di sayap timur */}
        <Aset3D id="tank-poly3d" variant="sekutu" position={[12.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Sepeda onthel kurir pemuda yang tergeletak di tepi jalan */}
        <Aset3D id="sepeda-onthel-poly3d" variant="kurir" position={[-4.2, 1.8, 2.3]} rotation={[0, 0.5, 1.4]} />

        {/* --- 5. PASUKAN: KEPUNGAN PULUHAN LASKAR RAKYAT vs TENTARA SEKUTU --- */}
        {pejuangGrid.map((pj, i) => (
          <Aset3D
            key={`pj-${i}`}
            id="pejuang-poly3d"
            variant={pj.v as any}
            position={pj.p as any}
            rotation={pj.r as any}
          />
        ))}

        {/* Rumpun senjata bambu runcing rakyat */}
        <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-8.8, 1.8, -2.4]} />
        <Aset3D id="bambu-runcing-poly3d" variant="ikatan" position={[-11.5, 1.8, 2.5]} />
        <Aset3D id="bambu-runcing-poly3d" variant="tunggal" position={[-4.6, 1.8, -2.2]} />
        <Aset3D id="bambu-runcing-poly3d" variant="tunggal" position={[-4.5, 1.8, 2.2]} />

        {/* Tentara Sekutu British Army di dekat tank */}
        <Aset3D id="tentara-sekutu-poly3d" variant="bidik" position={[6.6, 1.8, -1.3]} rotation={[0, -Math.PI / 2.1, 0]} />
        <Aset3D id="tentara-sekutu-poly3d" variant="bidik" position={[8.2, 1.8, 1.0]} rotation={[0, -Math.PI / 2.3, 0]} />
        <Aset3D id="tentara-sekutu-poly3d" variant="siap" position={[10.2, 1.8, -1.6]} rotation={[0, -Math.PI / 2, 0]} />
        <Aset3D id="amunisi-granat-poly3d" variant="peti" position={[7.8, 1.8, -2.2]} />
        <Aset3D id="amunisi-granat-poly3d" variant="granat" position={[3.2, 1.65, 0.2]} />

        {/* --- 6. EFEK PERANG: LEDAKAN API EMISSIVE & ASAP HITAM TEBAL --- */}
        {isExploding && (
          <Aset3D id="efek-ledakan-poly3d" variant="ledakan" position={[1.8, 2.0, 0.4]} scale={1.8} t={frame} />
        )}

        {/* Asap hitam tebal membubung dari mobil Mallaby yang terbakar */}
        {frame >= 165 && (
          <Aset3D id="efek-ledakan-poly3d" variant="asap" position={[1.8, 2.4, 0.4]} scale={1.9} t={frame} />
        )}

        {/* Kolom asap dari gedung kolonial yang jebol tertembak artileri */}
        {frame >= 170 && (
          <Aset3D id="efek-ledakan-poly3d" variant="asap" position={[-11.4, 7.5, -13.5]} scale={2.8} t={frame} />
        )}

        {/* --- 7. PESAWAT TEMPUR PEMBOM SEKUTU DI LANGIT --- */}
        {frame <= 220 && (
          <Aset3D id="pesawat-tempur-poly3d" variant="terbang" position={[planeX, planeY, -34]} rotation={[0.08, 0, -0.06]} scale={1.4} />
        )}
      </ThreeCanvas>

      {/* --- HUD NARRATIVE OVERLAY SINEMATIK --- */}
      <div style={{ position: 'absolute', top: 40, left: 52, color: '#f8fafc', fontFamily: 'system-ui, sans-serif', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626', boxShadow: '0 0 14px #dc2626' }} />
          <span style={{ fontSize: 13, letterSpacing: 2.2, textTransform: 'uppercase', color: '#fed7aa', fontWeight: 700 }}>
            Surabaya &bull; 30 Oktober &ndash; 10 November 1945
          </span>
        </div>
        <h1 style={{ margin: '8px 0 0', fontSize: 32, fontWeight: 900, textShadow: '0 3px 12px rgba(0,0,0,0.95)' }}>
          {frame < 140
            ? 'Konfrontasi di Jembatan Merah'
            : frame < 225
            ? 'Insiden Ledakan & Gugurnya Mallaby'
            : 'Kota Membara: Arek Suroboyo Pantang Menyerah'}
        </h1>
        <p style={{ margin: '6px 0 0', fontSize: 15, color: '#fed7aa', maxWidth: 660, textShadow: '0 2px 8px rgba(0,0,0,0.9)', lineHeight: 1.4 }}>
          {frame < 140
            ? 'Mobil dinas Brigadir Jenderal A.W.S. Mallaby terhadang barikade dan kepungan puluhan laskar rakyat pejuang di tepi Kali Mas.'
            : frame < 225
            ? 'Baku tembak pecah sengit di tengah jembatan. Ledakan granat menghancurkan mobil perwira tinggi Sekutu.'
            : 'Sekutu membalas dengan bombardir udara dan artileri. Perlawanan gigih rakyat Surabaya menyulut Hari Pahlawan 10 November.'}
        </p>
      </div>

      {/* Vinyet sinematik perang */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          boxShadow: 'inset 0 0 160px rgba(0,0,0,0.92)',
        }}
      />
    </AbsoluteFill>
  );
};
