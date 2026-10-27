// Timeline & frame markers for "What if the Battle of Surabaya never happened?"
// 1080x1920 (Portrait), 30 fps, 900 frames (30 seconds)
export const FPS = 30;
export const W = 1080;
export const H = 1920;

export const F = {
  // Act 1: The Historical Flashpoint (Jembatan Merah 1945)
  intro: 0,
  carArrive: 45,
  standoff: 90,
  flashpoint: 180, // Countdown hits zero / Incident occurs
  
  // Act 2: The Fork in History (Simulation: What if Mallaby lived / Pejuang negotiated?)
  fork: 210,
  peaceTalks: 270,
  britishWithdraw: 390,
  
  // Act 3: The Price of Avoiding War (Historical Consequence)
  reoccupation: 510,
  sovereigntyDelayed: 630,
  
  // Act 4: Recap & The Verdict
  recap: 720,
  end: 900,
} as const;

export const WHATIF_SURABAYA_FRAMES = F.end;

export type ShotName = 'standoff' | 'incident' | 'negotiation' | 'alternateHistory' | 'recap';

export const shotAt = (frame: number): ShotName => {
  if (frame < 180) return 'standoff';
  if (frame < 270) return 'incident';
  if (frame < 510) return 'negotiation';
  if (frame < 720) return 'alternateHistory';
  return 'recap';
};
