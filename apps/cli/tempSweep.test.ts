import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { sweepRemotionTemp } from './tempSweep';

test('sweep removes only old Remotion folders and leaves everything else', () => {
  const dir = mkdtempSync(join(tmpdir(), 'motionkit-sweep-'));
  try {
    const make = (name: string, ageHours: number) => {
      const p = join(dir, name);
      mkdirSync(p);
      writeFileSync(join(p, 'f.jpg'), 'x'.repeat(100));
      const t = (Date.now() - ageHours * 3600_000) / 1000;
      utimesSync(p, t, t);
      return p;
    };
    const oldBundle = make('remotion-webpack-bundle-abc', 30);
    const oldFrames = make('react-motion-renderXYZ', 30);
    const oldAssets = make('remotion-v4.0.1-assetsq1', 30);
    const running = make('remotion-webpack-bundle-new', 1);
    const project = make('janji-belum-selesai', 30);
    const otherRemotion = make('remotion-version-notes', 30);

    const { count, bytes } = sweepRemotionTemp(Date.now(), dir);

    assert.equal(count, 3);
    assert.equal(bytes, 300);
    for (const gone of [oldBundle, oldFrames, oldAssets]) assert.equal(existsSync(gone), false);
    for (const kept of [running, project, otherRemotion]) assert.equal(existsSync(kept), true);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
