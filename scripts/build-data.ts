import { readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';

const SOURCE_URL = 'https://raw.githubusercontent.com/kishorek/India-Codes/master/csv/pincodes.csv';
const RAW_CSV = 'raw-pincodes.csv';

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  out.push(cur);
  return out;
}

async function main() {
  const csv = await readFile(RAW_CSV, 'utf8');
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = parseCSVLine(lines[0]!);
  const cols = {
    office: header.indexOf('PostOfficeName'),
    pin: header.indexOf('Pincode'),
    district: header.indexOf('DistrictsName'),
    city: header.indexOf('City'),
    state: header.indexOf('State'),
  };

  const byPincode = new Map<string, { state: string; district: string; offices: { name: string; city: string }[] }>();
  const stateSet = new Set<string>();
  const cityIndex = new Map<string, Set<string>>();

  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]!);
    const pin = row[cols.pin]!.trim();
    if (!/^[1-9][0-9]{5}$/.test(pin)) continue;

    const state = row[cols.state]!.trim();
    const district = row[cols.district]!.trim();
    const city = row[cols.city]!.trim();
    const office = row[cols.office]!.trim();

    stateSet.add(state);

    let entry = byPincode.get(pin);
    if (!entry) {
      entry = { state, district, offices: [] };
      byPincode.set(pin, entry);
    }
    entry.offices.push({ name: office, city });

    const cityKey = city.toLowerCase();
    if (cityKey.length >= 2) {
      let pins = cityIndex.get(cityKey);
      if (!pins) {
        pins = new Set();
        cityIndex.set(cityKey, pins);
      }
      pins.add(pin);
    }
  }

  const states = [...stateSet].sort();
  const stateById: Record<string, number> = {};
  states.forEach((s, i) => (stateById[s] = i));

  const compact: Record<string, [number, string, [string, string][]]> = {};
  for (const [pin, entry] of byPincode) {
    compact[pin] = [
      stateById[entry.state]!,
      entry.district,
      entry.offices.map((o) => [o.name, o.city] as [string, string]),
    ];
  }

  const cityIdx: Record<string, string[]> = {};
  for (const [city, pins] of cityIndex) {
    cityIdx[city] = [...pins];
  }

  const dataset = {
    version: 1,
    generatedAt: new Date().toISOString(),
    states,
    pincodes: compact,
    cityIndex: cityIdx,
  };

  const json = JSON.stringify(dataset);
  await writeFile('data/pincodes.json', json);

  const gz = gzipSync(Buffer.from(json));
  await writeFile('data/pincodes.json.gz', gz);

  console.log(`Source URL: ${SOURCE_URL}`);
  console.log(`Records:     ${byPincode.size} unique pincodes / ${lines.length - 1} post offices`);
  console.log(`States:      ${states.length}`);
  console.log(`Cities:      ${cityIndex.size} indexed`);
  console.log(`JSON size:   ${(json.length / 1024).toFixed(1)} KB`);
  console.log(`Gzip size:   ${(gz.length / 1024).toFixed(1)} KB`);
}

main().catch(console.error);
