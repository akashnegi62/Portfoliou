import {
  DISCIPLINES,
  STUDIO_ZONES,
  ERAS,
  PROJECTS,
  ARCHIVE_ITEMS,
  GLYPHS,
  GLYPHS_BOLD,
  type Discipline,
  type CareerEra,
  type ProjectItem,
  type ArchiveEntry,
} from '../data';

export function esc(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function normText(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function fmtTime(hhmm: string): string {
  return hhmm;
}

export function timeToMin(hhmm: string): number {
  const [h, m] = (hhmm || '0:0').split(':').map(Number);
  return h * 60 + (m || 0);
}

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet(key: string, val: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore storage errors in private mode
  }
}

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  return function (t: number): number {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let u = t;
    for (let i = 0; i < 12; i++) {
      u = (lo + hi) * 0.5;
      const mu = 1 - u;
      const x = 3 * mu * mu * u * x1 + 3 * mu * u * u * x2 + u * u * u;
      if (x < t) lo = u;
      else hi = u;
    }
    const mu = 1 - u;
    return 3 * mu * mu * u * y1 + 3 * mu * u * u * y2 + u * u * u;
  };
}

export const easeMorph = cubicBezier(0.7, 0, 0.3, 1);
export const easeAssemble = cubicBezier(0.2, 0, 0, 1);

export const TRACK_COLORS: Record<string, string> = {
  systems: '#2E5FCE',
  graphics: '#18B47E',
  product: '#F5B700',
  performance: '#A98BF7',
};

export const TRAIL_COLORS = [
  '#2E5FCE',
  '#D873B3',
  '#2BA676',
  '#A98BF7',
  '#FF5A5A',
  '#22C98A',
];

export const BADGE_PALETTE = [
  { id: '0', name: 'ink', hex: '#171919' },
  { id: '1', name: 'paper', hex: '#FEFEFF' },
  { id: '2', name: 'sodium', hex: '#2E5FCE' },
  { id: '3', name: 'blue', hex: '#2E5FCE' },
  { id: '4', name: 'pink', hex: '#D873B3' },
  { id: '5', name: 'green', hex: '#2BA676' },
  { id: '6', name: 'lavender', hex: '#A98BF7' },
  { id: '7', name: 'coral', hex: '#FF5A5A' },
  { id: '8', name: 'mint', hex: '#22C98A' },
];


export const trackById = (id: string): Discipline =>
  DISCIPLINES.find((t) => t.id === id) || DISCIPLINES[0];
export const zoneById = (id: string) =>
  STUDIO_ZONES.find((r) => r.id === id) || STUDIO_ZONES[0];
export const eraById = (id: string): CareerEra =>
  ERAS.find((d) => d.id === id) || ERAS[0];
export const projectById = (id: string): ProjectItem | undefined =>
  PROJECTS.find((s) => s.id === id);
export const archiveById = (id: string): ArchiveEntry | undefined =>
  ARCHIVE_ITEMS.find((s) => s.id === id);
export const archiveByTrack = (id: string): ArchiveEntry[] =>
  ARCHIVE_ITEMS.filter((s) => s.track === id);
export const archiveByEra = (id: string): ArchiveEntry[] =>
  ARCHIVE_ITEMS.filter((s) => s.era === id);
export const archiveByProject = (id: string): ArchiveEntry[] =>
  ARCHIVE_ITEMS.filter((s) => s.projects.includes(id));

export function defaultBadgeGrid(): string {
  const g = new Array(256).fill('1');
  const heart = [
    '011000110',
    '111101111',
    '111111111',
    '111111111',
    '111111111',
    '011111110',
    '001111100',
    '000111000',
    '000010000',
  ];
  for (let r = 0; r < heart.length; r++) {
    for (let c = 0; c < heart[r].length; c++) {
      if (heart[r][c] === '1') {
        g[(r + 3) * 16 + (c + 3)] = '4';
      }
    }
  }
  return g.join('');
}

export function layoutGlyphLines(lines: string[], gapRows: number, useBold: boolean) {
  const gap = gapRows || 2;
  const set = useBold ? GLYPHS_BOLD : GLYPHS;
  let maxCols = 0;
  const cells: Array<{ x: number; y: number }> = [];
  let rowOffset = 0;
  for (let l = 0; l < lines.length; l++) {
    const str = lines[l].toUpperCase();
    let colOffset = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      const g = set[ch] || set[' '];
      const w = g[0].length;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < w; c++) {
          if (g[r][c] === '#') {
            cells.push({ x: colOffset + c, y: rowOffset + r });
          }
        }
      }
      colOffset += w + (i < str.length - 1 ? 1 : 0);
    }
    if (colOffset > maxCols) maxCols = colOffset;
    rowOffset += 9 + (l < lines.length - 1 ? gap : 0);
  }
  return { cols: maxCols, rows: rowOffset, cells };
}

export function svgBitmapText(
  str: string | string[],
  cellH: number,
  fill: string,
  opts?: {
    bold?: boolean;
    perCell?: boolean;
    fluid?: boolean;
    className?: string;
    ariaHidden?: boolean;
  }
): string {
  const o = opts || {};
  const layout = layoutGlyphLines(Array.isArray(str) ? str : [str], 2, Boolean(o.bold));
  const vbW = layout.cols * 5;
  const vbH = layout.rows * 4;
  const color = fill || 'currentColor';
  let rects = '';
  if (o.perCell) {
    for (let i = 0; i < layout.cells.length; i++) {
      const cell = layout.cells[i];
      rects += `<rect x="${cell.x * 5}" y="${cell.y * 4}" width="5" height="4" data-gx="${cell.x}" data-gy="${cell.y}"/>`;
    }
  } else {
    const rowMap = new Map<number, number[]>();
    for (let i = 0; i < layout.cells.length; i++) {
      const cell = layout.cells[i];
      if (!rowMap.has(cell.y)) rowMap.set(cell.y, []);
      rowMap.get(cell.y)!.push(cell.x);
    }
    rowMap.forEach((xs, y) => {
      xs.sort((a, b) => a - b);
      let start = xs[0];
      let prev = xs[0];
      for (let k = 1; k <= xs.length; k++) {
        if (k < xs.length && xs[k] === prev + 1) {
          prev = xs[k];
        } else {
          const span = prev - start + 1;
          rects += `<rect x="${start * 5}" y="${y * 4}" width="${span * 5}" height="4.04"/>`;
          if (k < xs.length) {
            start = xs[k];
            prev = xs[k];
          }
        }
      }
    });
  }
  const wAttr = o.fluid
    ? `width="100%"`
    : `width="${layout.cols * cellH * 1.25}" height="${layout.rows * cellH}"`;
  const cls = o.className ? ` class="${esc(o.className)}"` : '';
  const aria = o.ariaHidden ? ` aria-hidden="true"` : '';
  return `<svg${cls} viewBox="0 0 ${vbW} ${vbH}" ${wAttr} shape-rendering="crispEdges" fill="${color}"${aria}>${rects}</svg>`;
}

export function svgPixelIcon(name: string, size = 15): string {
  const grids: Record<string, string[]> = {
    plus: ['..#..', '..#..', '#####', '..#..', '..#..'],
    minus: ['.....', '.....', '#####', '.....', '.....'],
    check: ['....#', '...#.', '#.#..', '.#...', '.....'],
    'arrow-right': ['..#..', '...#.', '#####', '...#.', '..#..'],
    'tri-up': ['..#..', '.###.', '#####', '.....', '.....'],
    'tri-down': ['.....', '.....', '#####', '.###.', '..#..'],
  };
  const g = grids[name] || grids.plus;
  let rects = '';
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      if (g[y][x] === '#') {
        rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
      }
    }
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 5 5" shape-rendering="crispEdges" fill="currentColor" aria-hidden="true">${rects}</svg>`;
}

export function svgStrike(): string {
  return `<svg class="btn-strike" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="100" x2="100" y2="0" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}

export class MotionCoordinator {
  private callbacks = new Set<(time: number) => void>();
  private handle: number | null = null;
  private running = false;

  private loop = (time: number) => {
    if (!this.running) return;
    this.callbacks.forEach((cb) => {
      try {
        cb(time);
      } catch (err) {
        console.error(err);
      }
    });
    this.handle = requestAnimationFrame(this.loop);
  };

  add(cb: (time: number) => void): void {
    this.callbacks.add(cb);
    if (!this.running) {
      this.running = true;
      this.handle = requestAnimationFrame(this.loop);
    }
  }

  remove(cb: (time: number) => void): void {
    this.callbacks.delete(cb);
    if (this.callbacks.size === 0 && this.running) {
      this.running = false;
      if (this.handle !== null) {
        cancelAnimationFrame(this.handle);
        this.handle = null;
      }
    }
  }
}

export const motion = new MotionCoordinator();
