import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, HudFrame, HudHeader, Stat } from '../../templates/whatif-sim';
import { F } from './timeline';

export const Hud: React.FC = () => {
  const f = useCurrentFrame();

  // Phase 1: Real-time countdown to the historical explosion (frame 0 to 180 = 6 seconds)
  const remainingSec = Math.max(0, (180 - f) / 30).toFixed(1);

  return (
    <HudFrame>
      {f < F.flashpoint && (
        <>
          <HudHeader
            label="FLASHPOINT · COUNTDOWN"
            value={`${remainingSec} s`}
            sub="Hingga ledakan Jembatan Merah"
            color={f >= 120 ? C.red : C.white}
          />
          <Stat frame={f} enter={15} exit={F.flashpoint} title="KEKUATAN LASKAR" value="~20.000" note="Pejuang Arek Suroboyo" />
          <Stat frame={f} enter={45} exit={F.flashpoint} title="PASUKAN SEKUTU" value="BRIGADE 49" note="Gurkha Rifles" />
          <Stat frame={f} enter={75} exit={F.flashpoint} title="STATUS MALLABY" value="TERKEPUNG" note="Di dalam sedan dinas" />
        </>
      )}

      {f >= F.flashpoint && f < F.fork && (
        <HudHeader
          label="SIMULATION · DIVERGENCE"
          value="WHAT IF?"
          sub="Gencatan senjata berhasil ditegakkan"
          color={C.red}
        />
      )}

      {f >= F.fork && f < F.reoccupation && (
        <>
          <HudHeader
            label="SCENARIO A · GENCATAN SENJATA"
            value="DAMAI PALSU"
            sub="Inggris mundur tanpa perang terbuka"
            color={C.gold}
          />
          <Stat frame={f} enter={F.fork + 15} exit={F.reoccupation} title="KORBAN 10 NOV" value="0 JIWA" note="Gencatan senjata bertahan" />
          <Stat frame={f} enter={F.fork + 45} exit={F.reoccupation} title="SOROTAN PBB" value="0 LIPUTAN" note="Dunia mengabaikan RI" />
        </>
      )}

      {f >= F.reoccupation && f < F.recap && (
        <>
          <HudHeader
            label="KONSEKUENSI · RE-OKUPASI"
            value="+15 TAHUN"
            sub="Kedaulatan RI tertunda / terancam"
            color={C.red}
          />
          <Stat frame={f} enter={F.reoccupation + 15} exit={F.recap} title="AGRESI MILITER" value="NICA MASUK" note="Invasi tanpa rintangan" />
          <Stat frame={f} enter={F.reoccupation + 45} exit={F.recap} title="STATUS RI" value="DIANGGAP HILANG" note="Re-kolonisasi total" />
        </>
      )}
    </HudFrame>
  );
};
