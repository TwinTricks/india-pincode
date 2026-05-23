import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

interface CompactDataset {
  version: number;
  generatedAt: string;
  states: string[];
  pincodes: Record<string, [number, string, [string, string][]]>;
  cityIndex: Record<string, string[]>;
}

let cached: CompactDataset | null = null;

function resolveDataPath(): string {
  if (typeof __dirname !== 'undefined') {
    return resolve(__dirname, '../data/pincodes.json');
  }
  const here = dirname(fileURLToPath(import.meta.url));
  return resolve(here, '../data/pincodes.json');
}

declare const __dirname: string;

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
