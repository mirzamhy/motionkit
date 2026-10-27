import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import {
  C,
  Captions,
  Cta,
  Flash,
  Leaderboard,
  Sky,
  Stamp,
  Title,
  Vignette,
} from '../../templates/whatif-sim';
import { CAPS } from './captions';
import { Hud } from './Hud';
import { F, H, shotAt, W, WHATIF_SURABAYA_FRAMES } from './timeline';
import { World } from './World';

export const WHATIF_SURABAYA_FRAMES_TOTAL = F.end;

const RECAP_ROWS: [string, string][] = [
  ['Korban 10 November', '0 Jiwa (Terhindar)'],
  ['Perhatian Dunia', 'Nol (Diabaikan)'],
  ['Kembalinya Belanda', 'Tanpa Rintangan'],
  ['Kedaulatan RI', 'Tertunda / Gugur'],
  ['Arek Suroboyo', 'Penentu Eksistensi Bangsa'],
];

export const WhatIfSurabaya: React.FC = () => {
  const frame = useCurrentFrame();
  const shot = shotAt(frame);

  return (
    <AbsoluteFill style={{ background: C.navy }}>
      {/* 1. Sky & 3D ThreeCanvas */}
      <Sky t={frame} />
      <ThreeCanvas
        width={W}
        height={H}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 46, near: 0.1, far: 2000 }}
      >
        <World frame={frame} shot={shot} />
      </ThreeCanvas>

      {/* 2. Overlays & HUD Template What-If */}
      <Flash at={F.flashpoint} />

      <Title until={F.standoff} loopEnd={F.end}>
        Bagaimana jika pertempuran
        <br />
        <span style={{ color: C.red }}>Surabaya 1945</span>
        <br />tidak pernah terjadi?
      </Title>

      <Captions caps={CAPS} />

      <Hud />

      {/* Stamps: Efek stempel miring berbingkai khas what-if template */}
      <div style={{ transform: 'rotate(-3deg)' }}>
        <Stamp
          at={F.flashpoint + 10}
          exit={F.fork}
          small="Insiden Nyata"
          big="Mallaby Gugur"
          color={C.red}
          left={64}
          top={810}
        />

        <Stamp
          at={F.peaceTalks + 15}
          exit={F.peaceTalks + 90}
          small="Skenario Simulasi"
          big="Damai Palsu"
          color={C.gold}
          left={64}
          top={810}
        />

        <Stamp
          at={F.reoccupation + 15}
          exit={F.reoccupation + 90}
          small="Dampak Sejarah"
          big="Re-Okupasi"
          color={C.red}
          left={64}
          top={810}
        />
      </div>

      {/* Dark Translucent Scrim Panel di belakang Leaderboard agar teks 100% terbaca tajam */}
      {frame >= F.recap && (
        <div
          style={{
            position: 'absolute',
            inset: '380px 48px 340px 48px',
            background: 'rgba(10, 18, 32, 0.88)',
            borderRadius: 24,
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.8)',
            zIndex: 4,
          }}
        />
      )}

      {/* Leaderboard Rekap Hasil Simulasi */}
      <div style={{ position: 'relative', zIndex: 5 }}>
        <Leaderboard
          rows={RECAP_ROWS}
          timing={{
            start: F.recap,
            rowsIn: F.recap + 20,
            focus: F.recap + 80,
            rowsOut: F.end - 30,
            firstOut: F.recap + 140,
          }}
        />
      </div>

      {/* CTA penutup */}
      <Cta
        at={F.end - 80}
        end={F.end}
        before="Apakah menurutmu kemerdekaan bisa diraih"
        word="tanpa perang?"
        line1="Komentar pendapatmu di bawah"
        line2="Surabaya membuktikan kedaulatan bangsa"
      />

      {/* Vinyet sinematik gelap tepi layar */}
      <Vignette />
    </AbsoluteFill>
  );
};
