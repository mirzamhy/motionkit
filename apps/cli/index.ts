import path from 'node:path';
import { ROOT } from './paths';
import { ambientcgFetch, ambientcgSearch, checkModel, listAssets, noteAsset, optimizeModel, polyhavenFetch, polyhavenSearch } from './asset';
import { asetBaru, asetFind, asetPeta, asetPrompt, gayaList, gayaShow } from './aset';
import { filmList, filmShow } from './film';
import { gate } from './gate';
import { gridView } from './grid';
import { itemFind, itemList, itemPreview } from './item';
import { decode, detectOnsets, snapShots } from './onsets';
import { sceneAudio, sceneList, sceneStills, sceneVideo, voCut } from './scene';
import { storyboard } from './storyboard';
import { findKit, KIT } from '../../packages/core/src/scenes/catalog';

export const HELP = `mk — MotionKit scene mode and reusable asset library

  mk scene list
  mk scene stills <Id> <f1,f2,…> [--grid] [--region x,y,w,h] [--guides thirds,phi,center,diag,spiral,spiralx]
  mk scene video <Id>
  mk scene audio <Id>
  mk storyboard "<brief>" [--format 9:16|16:9] [--detik N] [--gaya <slug>] [--slug <nama>]
  mk film list | show <id>
  mk gaya list | show <slug>
  mk aset find <kata> [--gaya <slug>]
  mk aset baru <benda> <gaya>
  mk aset prompt <benda> <gaya> [--target kode|gambar|3d]
  mk aset peta
  mk item list | find <words> | preview <id>
  mk kit find <words>
  mk asset polyhaven search <words> | get <id…> [--res 1k] [--project p]
  mk asset ambientcg search <words> | get <id…> [--res 1K-JPG] [--project p]
  mk asset list [--project p] | note <dir> --license L --source URL
  mk asset check <model…> [--expect metres]
  mk asset optimize <model.gltf|glb> [--ratio 0.5]
  mk beats <music> [--fps 60] [--durs a,b,…] [--window 20]
  mk vo-cut <file.mp3> [--pause 0.22]
  mk gate [--only A,B] [--no-render]
`;

const value = (args: string[], name: string) => {
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : undefined;
};

const positionals = (args: string[]) => args.filter((entry, index) => !entry.startsWith('--') && !(index > 0 && args[index - 1].startsWith('--')));

const requireValue = (actual: string | undefined, usage: string) => {
  if (!actual) throw new Error(usage);
  return actual;
};

export const main = async (args = process.argv.slice(2)) => {
  const [command] = args;
  if (!command || command === 'help' || command === '--help' || command === '-h') {
    console.log(HELP);
    return;
  }

  if (command === 'scene') {
    const [, subcommand, id, frames = '0'] = args;
    if (!subcommand || subcommand === 'list') return sceneList();
    if (subcommand === 'stills') {
      requireValue(id, 'usage: mk scene stills <Id> <frames>');
      const files = await sceneStills(id, frames.split(',').map(Number));
      if (args.includes('--grid')) {
        const region = value(args, 'region')?.split(',').map(Number);
        const guides = value(args, 'guides')?.split(',') ?? ['thirds', 'phi'];
        for (const file of files) console.log(`  grid → ${gridView(file, region, 1600, guides)}`);
      }
      return;
    }
    if (subcommand === 'video') return sceneVideo(requireValue(id, 'usage: mk scene video <Id>'));
    if (subcommand === 'audio') return sceneAudio(requireValue(id, 'usage: mk scene audio <Id>'));
    throw new Error('usage: mk scene list | stills <Id> <frames> | video <Id> | audio <Id>');
  }

  if (command === 'kit') {
    const query = args.slice(2).join(' ');
    if (args[1] !== 'find' || !query) throw new Error('usage: mk kit find <words>');
    const hits = findKit(query);
    if (!hits.length) console.log(`  nothing in the kit for "${query}" (${KIT.length} parts listed)`);
    for (const entry of hits) {
      const file = path.relative(ROOT, path.join(ROOT, 'packages/core/src/scenes', entry.file)).split(path.sep).join('/');
      console.log(['', `  ${entry.id}  [${entry.kind}]  ${file}`, `    ${entry.role}`, `    use: ${entry.use}`, ...(entry.avoid ? [`    avoid: ${entry.avoid}`] : [])].join('\n'));
    }
    return;
  }

  if (command === 'beats') {
    const file = requireValue(args[1], 'usage: mk beats <music.wav|mp3> [--fps 60] [--durs 600,630,…] [--window 20]');
    const fps = Number(value(args, 'fps') ?? 60);
    const sampleRate = 22050;
    const onsets = detectOnsets(decode(file, sampleRate), sampleRate);
    const gaps = onsets.slice(1).map((onset, index) => onset.sec - onsets[index].sec).sort((a, b) => a - b);
    const median = gaps[Math.floor(gaps.length / 2)];
    console.log(`  ${onsets.length} onsets${median ? `, median gap ${median.toFixed(3)} s (≈ ${(60 / median).toFixed(0)} BPM)` : ''}`);
    console.log(`  frames @${fps}: ${onsets.slice(0, 24).map((onset) => Math.round(onset.sec * fps)).join(', ')}${onsets.length > 24 ? ' …' : ''}`);
    const durations = value(args, 'durs');
    if (durations) {
      const snapped = snapShots(durations.split(',').map(Number), onsets, fps, { window: Number(value(args, 'window') ?? 20) });
      for (const move of snapped.moves) console.log(`  shot ${move.shot}: cut ${move.from} → ${move.to} (${move.to - move.from > 0 ? '+' : ''}${move.to - move.from})`);
      console.log(`  durs: ${snapped.durs.join(',')}`);
    }
    return;
  }

  if (command === 'asset') {
    const [, source, subcommand, ...rest] = args;
    if (source === 'list') return listAssets(value(args, 'project'));
    if (source === 'note') {
      const license = requireValue(value(args, 'license'), 'usage: mk asset note <dir> --license L --source URL');
      const origin = requireValue(value(args, 'source'), 'usage: mk asset note <dir> --license L --source URL');
      return noteAsset(requireValue(subcommand, 'usage: mk asset note <dir> --license L --source URL'), { license, source: origin, type: value(args, 'type') });
    }
    if (source === 'check') {
      for (const file of positionals(args.slice(2))) await checkModel(file, { expect: value(args, 'expect') ? Number(value(args, 'expect')) : undefined });
      return;
    }
    if (source === 'optimize') return optimizeModel(requireValue(subcommand, 'usage: mk asset optimize <model> [--ratio 0.5]'), { ratio: Number(value(args, 'ratio') ?? 0.5) });
    if (source === 'ambientcg' && subcommand === 'search') {
      for (const match of await ambientcgSearch(positionals(rest).join(' '))) console.log(`  ${match.id.padEnd(18)} ${match.title}  (${match.tags.join(', ')})`);
      return;
    }
    if (source === 'ambientcg' && subcommand === 'get') {
      for (const id of positionals(rest)) await ambientcgFetch(id, { res: value(args, 'res') ?? '1K-JPG', project: value(args, 'project') ?? 'asset-lab' });
      return;
    }
    if (source === 'polyhaven' && subcommand === 'search') {
      for (const match of await polyhavenSearch(positionals(rest).join(' '))) console.log(`  ${match.id.padEnd(28)} ${String(match.polycount ?? '').padStart(7)} polys  ${match.categories.join(', ')}`);
      return;
    }
    if (source === 'polyhaven' && subcommand === 'get') {
      for (const id of positionals(rest)) await polyhavenFetch(id, { res: value(args, 'res') ?? '1k', project: value(args, 'project') ?? 'asset-lab' });
      return;
    }
    throw new Error('usage: mk asset polyhaven|ambientcg search|get … | list | note | check | optimize');
  }

  if (command === 'item') {
    const [, subcommand, ...rest] = args;
    if (subcommand === 'list') return itemList();
    if (subcommand === 'find' && rest.length) return itemFind(rest.join(' '));
    if (subcommand === 'preview' && rest[0]) return itemPreview(rest[0]);
    throw new Error('usage: mk item list | find <words> | preview <id>');
  }

  if (command === 'gaya') {
    const [, subcommand, slug] = args;
    if (subcommand === 'list') return gayaList();
    if (subcommand === 'show' && slug) return gayaShow(slug);
    throw new Error('usage: mk gaya list | show <slug>');
  }

  if (command === 'storyboard') {
    const brief = positionals(args.slice(1)).join(' ');
    if (!brief) throw new Error('usage: mk storyboard "<brief>" [--format 9:16|16:9] [--detik N] [--gaya <slug>] [--slug <nama>] [--timpa]');
    return storyboard(brief, { format: value(args, 'format'), detik: value(args, 'detik'), gaya: value(args, 'gaya'), slug: value(args, 'slug'), timpa: args.includes('--timpa') });
  }

  if (command === 'film') {
    const [, subcommand, id] = args;
    if (subcommand === 'list') return filmList();
    if (subcommand === 'show' && id) return filmShow(id);
    throw new Error('usage: mk film list | show <id>');
  }

  if (command === 'aset') {
    const [, subcommand, ...rest] = args;
    const words = positionals(rest);
    if (subcommand === 'find' && words.length) return asetFind(words.join(' '), value(args, 'gaya'));
    if (subcommand === 'baru' && words.length === 2) return asetBaru(words[0], words[1]);
    if (subcommand === 'peta') return asetPeta();
    if (subcommand === 'prompt' && words.length === 2) return asetPrompt(words[0], words[1], { target: value(args, 'target'), ukuran: value(args, 'ukuran'), catatan: value(args, 'catatan') });
    throw new Error('usage: mk aset find <kata> [--gaya <slug>] | baru <benda> <gaya> | prompt <benda> <gaya> | peta');
  }

  if (command === 'gate') return gate({ only: value(args, 'only')?.split(','), skipRender: args.includes('--no-render') });
  if (command === 'vo-cut') return voCut(requireValue(args[1], 'usage: mk vo-cut <file.mp3> [--pause 0.22]'), Number(value(args, 'pause') ?? 0.22));

  throw new Error(`unknown command "${command}"; run mk help`);
};

main().catch((error) => {
  console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
