import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

interface CompactDataset {
  version: number;
  generatedAt: string;
  states: string[];
  pincodes: Record<string, [number, string, [string, string][]]>;
  cityIndex: Record<string, string[]>;
}

declare const __dirname: string | undefined;

let cached: CompactDataset | null = null;

function resolveDataPath(): string {
  if (typeof __dirname !== 'undefined') {
    return resolve(__dirname, '../data/pincodes.json');
  }
  const url: string = (0, eval)('import.meta.url');
  return resolve(dirname(fileURLToPath(url)), '../data/pincodes.json');
}

export function loadDataset(): CompactDataset {
  if (cached) return cached;
  const path = resolveDataPath();
  const raw = readFileSync(path, 'utf8');
  cached = JSON.parse(raw) as CompactDataset;
  return cached;
}

export function getDatasetMeta(): { version: number; generatedAt: string; states: number; pincodes: number } {
  const ds = loadDataset();
  return {
    version: ds.version,
    generatedAt: ds.generatedAt,
    states: ds.states.length,
    pincodes: Object.keys(ds.pincodes).length,
  };
}
