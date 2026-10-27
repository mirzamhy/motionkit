import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const FONT = process.platform === 'win32' ? '/Windows/Fonts/arialbd.ttf' : '';
export const GUIDES = ['thirds', 'phi', 'center', 'diag', 'spiral', 'spiralx'] as const;

const guideOverlay = (dir: string, extra: string[]) => {
  const terms: string[] = [];
  const W = 1920;
  const H = 1080;
  const line = (slope: number, intercept: number) =>
    `lt(abs(Y-(${slope}*X+${intercept}))/${Math.sqrt(1 + slope * slope).toFixed(4)},2)`;

  if (extra.includes('center')) terms.push(`lt(abs(X-${W / 2}),2)`, `lt(abs(Y-${H / 2}),2)`);
  if (extra.includes('diag')) {
    const slope = H / W;
    const reciprocal = W / H;
    terms.push(line(slope, 0), line(-slope, H), line(reciprocal, 0), line(-reciprocal, H), line(-reciprocal, reciprocal * W), line(reciprocal, H - reciprocal * W));
  }

  for (const direction of ['spiral', 'spiralx'].filter((guide) => extra.includes(guide))) {
    const scaleX = W / 1.618;
    const scaleY = H;
    let [x, y, width, height] = [0, 0, 1.618, 1];
    for (let index = 0; index < 9; index++) {
      const turn = index % 4;
      const side = turn % 2 === 0 ? height : width;
      let centerX = 0;
      let centerY = 0;
      let compareX = '';
      let compareY = '';
      if (turn === 0) { centerX = x + side; centerY = y + height; compareX = 'lte'; compareY = 'lte'; x += side; width -= side; }
      else if (turn === 1) { centerX = x; centerY = y + side; compareX = 'gte'; compareY = 'lte'; y += side; height -= side; }
      else if (turn === 2) { centerX = x + width - side; centerY = y; compareX = 'gte'; compareY = 'gte'; width -= side; }
      else { centerX = x + side; centerY = y + height - side; compareX = 'lte'; compareY = 'gte'; height -= side; }
      const px = (centerX * scaleX).toFixed(1);
      const py = (centerY * scaleY).toFixed(1);
      const sourceX = direction === 'spiralx' ? `(${W}-X)` : 'X';
      terms.push(`${compareX}(${sourceX},${px})*${compareY}(Y,${py})*lt(abs(hypot((${sourceX}-${px})/${scaleX.toFixed(2)},(Y-${py})/${scaleY})-${side.toFixed(5)}),${(2 / scaleY).toFixed(5)})`);
    }
  }

  if (!terms.length) return null;
  mkdirSync(dir, { recursive: true });
  const output = path.join(dir, `guides-${[...extra].sort().join('-')}.png`);
  if (!existsSync(output)) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i', `color=c=black@0:s=${W}x${H},format=rgba`, '-vf', `geq=r='0':g='220':b='255':a='if(gt(${terms.join('+')},0),230,0)'`, '-frames:v', '1', output]);
  }
  return output;
};

const imageSize = (file: string): [number, number] => {
  try {
    const values = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file])
      .toString()
      .trim()
      .split(',')
      .map(Number);
    if (values[0] > 0 && values[1] > 0) return [values[0], values[1]];
  } catch {
    // A useful fallback keeps inspection available for ordinary landscape stills.
  }
  return [1920, 1080];
};

export const gridView = (file: string, region?: number[], outWidth = 1600, guides: string[] = ['thirds', 'phi']) => {
  const [frameWidth, frameHeight] = imageSize(file);
  const [x, y, width, height] = region?.length === 4
    ? region.map((value) => Math.max(0, Math.round(value)))
    : [0, 0, frameWidth, frameHeight];
  const major = [10, 20, 50, 100, 200].find((step) => width / step <= 12) ?? 200;
  const minor = major / 5;
  const scale = Math.max(1, Math.round((outWidth / width) * minor)) / minor;
  const offset = (value: number, step: number) => Math.round(((step - (value % step)) % step) * scale);
  const label = (text: number, left: number, top: number, color: string) =>
    `drawtext=${FONT ? `fontfile='${FONT}':` : ''}text='${text}':x=${Math.round(left)}:y=${Math.round(top)}:fontsize=20:fontcolor=${color}:box=1:boxcolor=black@0.65:boxborderw=3`;
  const marks = (from: number, length: number) =>
    Array.from({ length: Math.ceil(length / major) + 1 }, (_, index) => Math.ceil(from / major) * major + index * major)
      .filter((value) => value < from + length);

  const filters = [
    `crop=${width}:${height}:${x}:${y}`,
    `scale=${Math.round(width * scale)}:${Math.round(height * scale)}:flags=lanczos`,
    `drawgrid=x=${offset(x, minor)}:y=${offset(y, minor)}:w=${minor * scale}:h=${minor * scale}:t=1:c=white@0.22`,
    `drawgrid=x=${offset(x, major)}:y=${offset(y, major)}:w=${major * scale}:h=${major * scale}:t=2:c=red@0.75`,
    ...marks(x, width).map((value) => label(value, (value - x) * scale + 4, 4, 'yellow')),
    ...marks(y, height).map((value) => label(value, 4, (value - y) * scale + 4, 'cyan')),
    ...[
      ...(guides.includes('thirds') ? [1 / 3, 2 / 3].map((position) => ({ X: frameWidth * position, Y: frameHeight * position, color: 'lime@0.8' })) : []),
      ...(guides.includes('phi') ? [0.382, 0.618].map((position) => ({ X: frameWidth * position, Y: frameHeight * position, color: 'magenta@0.8' })) : []),
    ].flatMap((guide) => [
      ...(guide.X > x && guide.X < x + width ? [`drawbox=x=${Math.round((guide.X - x) * scale) - 1}:y=0:w=3:h=ih:color=${guide.color}:t=fill`] : []),
      ...(guide.Y > y && guide.Y < y + height ? [`drawbox=x=0:y=${Math.round((guide.Y - y) * scale) - 1}:w=iw:h=3:color=${guide.color}:t=fill`] : []),
    ]),
  ].join(',');

  const output = `${file}.grid.jpg`;
  const overlay = guideOverlay(path.join(path.dirname(file), '.guides'), guides.filter((guide) => !['thirds', 'phi'].includes(guide)));
  if (!overlay) {
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-vf', filters, '-q:v', '5', output]);
  } else {
    const [first, ...rest] = filters.split(/,(?=crop=|scale=|drawgrid=|drawtext=|drawbox=)/);
    const cropAndScale = [first, rest[0]].join(',');
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', file, '-i', overlay, '-filter_complex', `[0]${cropAndScale}[base];[1]${cropAndScale}[guide];[base][guide]overlay,${rest.slice(1).join(',')}`, '-q:v', '5', output]);
  }
  return output;
};
