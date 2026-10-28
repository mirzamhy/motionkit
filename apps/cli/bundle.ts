import { bundle } from '@remotion/bundler';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './paths';
import { sweepOnce } from './tempSweep';

const cached = new Map<string, Promise<string>>();
const owned = new Set<string>();

const removeOwnedBundle = (directory: string) => {
  if (!owned.delete(directory)) return;
  try {
    rmSync(directory, { recursive: true, force: true });
  } catch {
    // Chromium can briefly hold files open; the operating system cleans its temp directory later.
  }
};

process.on('exit', () => owned.forEach(removeOwnedBundle));
// Ctrl+C or a stopped task: still remove this process's bundle (a hard kill skips this; the next sweep catches it)
for (const sig of ['SIGINT', 'SIGTERM', 'SIGBREAK'] as const)
  process.once(sig, () => {
    owned.forEach(removeOwnedBundle);
    process.exit(130);
  });

export const getBundle = (publicDir: string) => {
  const key = path.resolve(publicDir);
  const existing = cached.get(key);
  if (existing) return existing;
  // folders left by earlier renders (stopped, crashed, or older MotionKit versions)
  sweepOnce();

  const pending = bundle({
    entryPoint: path.join(ROOT, 'packages', 'core', 'src', 'index.ts'),
    publicDir: key,
    onProgress: () => undefined,
    webpackOverride: (config) => ({
      ...config,
      resolve: {
        ...config.resolve,
        modules: [...(config.resolve?.modules ?? ['node_modules']), path.join(ROOT, 'node_modules')],
      },
    }),
  }).then((directory) => {
    owned.add(directory);
    return directory;
  });
  cached.set(key, pending);
  return pending;
};

export const forgetBundle = (publicDir: string) => {
  const key = path.resolve(publicDir);
  const pending = cached.get(key);
  cached.delete(key);
  void pending?.then(removeOwnedBundle, () => undefined);
};
