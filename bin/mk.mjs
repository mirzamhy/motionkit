#!/usr/bin/env node
import { register } from 'tsx/esm/api';

const run = async () => {
  register();
  await import('../apps/cli/index.ts');
};

await run();
