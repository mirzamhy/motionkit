import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import test from 'node:test';

const root = resolve(import.meta.dirname, '../..');
const run = (...args: string[]) => spawnSync(process.execPath, ['bin/mk.mjs', ...args], { cwd: root, encoding: 'utf8' });

test('help describes the retained scene and asset workflow', () => {
  const result = run();
  assert.equal(result.status, 0);
  assert.match(result.stdout, /mk scene stills/);
  assert.match(result.stdout, /mk storyboard/);
  assert.match(result.stdout, /mk aset find/);
  assert.doesNotMatch(result.stdout, /Vikey|mk concept|mk code/);
});

test('removed pipeline commands fail clearly instead of falling through to help', () => {
  const result = run('concept', 'old-project');
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}${result.stderr}`, /unknown command.*concept/i);
});
