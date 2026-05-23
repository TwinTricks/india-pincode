import { isValidPincode, normalizePincode } from './validate';
import { loadDataset } from './data';
import { PincodeError, type PincodeResult, type PostOffice } from './types';

function buildResult(pin: string, entry: [number, string, [string, string][]], states: string[]): PincodeResult {
  const [stateIdx, district, offices] = entry;
  const state = states[stateIdx]!;
  return {
    pincode: pin,
    state,
    district,
    offices: offices.map(([name, city]) => ({ name, city, district, state, pincode: pin })),
  };
}

export function getByPincode(pincode: string | number): PincodeResult {
  const pin = normalizePincode(pincode);
  if (!isValidPincode(pin)) {
    throw new PincodeError('INVALID_FORMAT', `"${pin}" is not a valid 6-digit Indian pincode`);
  }

  const ds = loadDataset();
  const entry = ds.pincodes[pin];
  if (!entry) {
    throw new PincodeError('NOT_FOUND', `Pincode ${pin} not found in dataset`);
  }

  return buildResult(pin, entry, ds.states);
}

export function findByPincode(pincode: string | number): PincodeResult | null {
  try {
    return getByPincode(pincode);
  } catch (err) {
    if (err instanceof PincodeError && err.code === 'NOT_FOUND') return null;
    throw err;
  }
}

export interface SearchOptions {
  limit?: number;
  fuzzy?: boolean;
}

export function searchByCity(query: string, options: SearchOptions = {}): PostOffice[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const limit = options.limit ?? 50;
  const fuzzy = options.fuzzy !== false;
  const ds = loadDataset();

  const matchedCities: string[] = [];
  for (const city of Object.keys(ds.cityIndex)) {
    if (fuzzy ? city.includes(q) : city.startsWith(q)) {
      matchedCities.push(city);
    }
    if (matchedCities.length >= limit * 2) break;
  }

  const seen = new Set<string>();
  const results: PostOffice[] = [];
  for (const city of matchedCities) {
    const pins = ds.cityIndex[city]!;
    for (const pin of pins) {
      const entry = ds.pincodes[pin];
      if (!entry) continue;
      const [stateIdx, district, offices] = entry;
      const state = ds.states[stateIdx]!;
      for (const [name, officeCity] of offices) {
        const key = `${pin}|${name}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (officeCity.toLowerCase() !== city) continue;
        results.push({ name, city: officeCity, district, state, pincode: pin });
        if (results.length >= limit) return results;
      }
    }
  }
  return results;
}

export function listStates(): string[] {
  return [...loadDataset().states];
}

export function listPincodesByCity(city: string): string[] {
  const ds = loadDataset();
  const pins = ds.cityIndex[city.trim().toLowerCase()];
  return pins ? [...pins] : [];
}
