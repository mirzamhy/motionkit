import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('klepon has no continuous raised seam across the plush body', async () => {
  const source = await readFile(new URL('./charm.ts', import.meta.url), 'utf8')
  const start = source.indexOf('function jahitKlepon')
  const end = source.indexOf('\nexport const R_RING', start)
  assert.notEqual(start, -1)
  assert.notEqual(end, -1)
  assert.doesNotMatch(source.slice(start, end), /new THREE\.TubeGeometry/)
})
