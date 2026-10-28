// Remotion leaves two kinds of folders in the system temp directory:
//   remotion-webpack-bundle-*  one per render command, holding a full copy of the project's public dir
//   react-motion-render*       the frames of a video render, left behind when the render is stopped or crashes
// (plus remotion-v*-assets*, downloaded and converted audio/video assets). Nothing reuses them, so they pile up:
// a film whose public dir held other films' media cost 1.5 GB per render. This sweep removes such folders once
// they are old enough not to belong to a render that is still running. It only ever looks in the temp directory:
// project files (projects/<slug>/public, refs, footage frames) and still frames in out/ are never touched.
import { readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const PREFIXES = ['remotion-webpack-bundle-', 'react-motion-render', 'remotion-v'];
/** a render that started longer ago than this is not running any more */
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

const sizeOf = (dir: string): number => {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    try {
      n += e.isDirectory() ? sizeOf(p) : statSync(p).size;
    } catch {
      // a file vanished while counting
    }
  }
  return n;
};

/** remove Remotion temp folders older than MAX_AGE_MS; returns how many went and how many bytes they held */
export const sweepRemotionTemp = (now = Date.now(), dir = tmpdir()) => {
  let count = 0;
  let bytes = 0;
  let names: string[] = [];
  try {
    names = readdirSync(dir);
  } catch {
    return { count, bytes };
  }
  for (const name of names) {
    if (!PREFIXES.some((p) => name.startsWith(p))) continue;
    if (name.startsWith('remotion-v') && !name.includes('-assets')) continue;
    const p = join(dir, name);
    try {
      const st = statSync(p);
      if (!st.isDirectory() || now - st.mtimeMs < MAX_AGE_MS) continue;
      const size = sizeOf(p);
      rmSync(p, { recursive: true, force: true });
      count++;
      bytes += size;
    } catch {
      // still in use (Windows keeps open files locked) or already gone: leave it for the next sweep
    }
  }
  return { count, bytes };
};

let swept = false;
/** sweep once per process, unless MK_KEEP_TEMP=1 */
export const sweepOnce = (log: (s: string) => void = console.log) => {
  if (swept || process.env.MK_KEEP_TEMP === '1') return;
  swept = true;
  const { count, bytes } = sweepRemotionTemp();
  if (count) log(`  · removed ${count} old Remotion temp folders (${(bytes / 1e9).toFixed(1)} GB)`);
};
