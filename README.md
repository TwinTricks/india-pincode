# @twin.techies/india-pincode

[![npm](https://img.shields.io/npm/v/@twin.techies/india-pincode.svg)](https://www.npmjs.com/package/@twin.techies/india-pincode)
[![Live Demo](https://img.shields.io/badge/live%20demo-storybook-ff4785)](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-lookup--default)
[![Try on RunKit](https://badge.runkitcdn.com/@twin.techies/india-pincode.svg)](https://npm.runkit.com/@twin.techies/india-pincode)

Offline Indian pincode lookup library — **23,915 pincodes** and **39,736 post offices** bundled. Zero network calls at runtime, zero runtime dependencies, fully synchronous API.

## 🚀 Try it live (no install)

**[👉 Interactive playground on Storybook](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-lookup--default)** — search real pincodes, see results instantly, no setup.

Stories available:
- [Pincode Lookup](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-lookup--default) — type a pincode → state, district, all post offices
- [City Search](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-city-search--default) — fuzzy / prefix search by city name
- [Form Autofill](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-form-autofill--default) — checkout-form auto-fill pattern
- [Format Validation](https://6a132a7cd42582454e1f297c-tfbgytflvw.chromatic.com/?path=/story/pincode-format-validation--default) — live `isValidPincode` examples

Or **[open a RunKit notebook →](https://npm.runkit.com/@twin.techies/india-pincode)** and paste:

```js
const { getByPincode, searchByCity } = require('@twin.techies/india-pincode');

// Look up Mumbai
getByPincode('400001');
// → { pincode: '400001', state: 'Maharashtra', district: 'Mumbai', offices: [...94 offices] }

// Search by city
searchByCity('pune', { limit: 3 });
// → [{ pincode: '411035', name: 'Akurdi', city: 'Pune', ... }, ...]
```

Or **[open a full StackBlitz Node sandbox →](https://stackblitz.com/fork/node?title=india-pincode-demo)** then run `npm install @twin.techies/india-pincode` and paste the code above into `index.js`.

## Why offline?

The free India Post API has frequent SSL certificate issues that break Node and Bun clients on many setups. This library ships the data with the package so it just works — air-gapped, fast (<1ms lookups), and reliable.

## Features

- **Offline-first** — full Indian post office dataset bundled (~2 MB)
- **Synchronous API** — no Promises, no `await`
- **Fuzzy city search** with configurable limit
- **Zero runtime dependencies**
- **TypeScript-first** with full type definitions
- ESM + CJS dual build, works in Node 18+, Bun, Deno
- Lazy-loaded data (loads on first call, then cached in memory)

## Install

```bash
npm install @twin.techies/india-pincode
# or
bun add @twin.techies/india-pincode
```

## Usage

### Look up by pincode

```ts
import { getByPincode } from '@twin.techies/india-pincode';

const result = getByPincode('400001');
console.log(result.state);    // "Maharashtra"
console.log(result.district); // "Mumbai"
console.log(result.offices);  // [{ name, city, district, state, pincode }, ...]
```

### Non-throwing variant

```ts
import { findByPincode } from '@twin.techies/india-pincode';

const result = findByPincode('999999');  // returns null instead of throwing
```

### Search by city

```ts
import { searchByCity } from '@twin.techies/india-pincode';

const offices = searchByCity('pune', { limit: 10 });
// Returns post offices in Pune

const exact = searchByCity('mumbai', { fuzzy: false });
// Only exact city-name matches (faster)
```

### Validate pincode format

```ts
import { isValidPincode } from '@twin.techies/india-pincode';

isValidPincode('400001');  // true
isValidPincode('010001');  // false (cannot start with 0)
```

### Other helpers

```ts
import { listStates, listPincodesByCity, getDatasetMeta } from '@twin.techies/india-pincode';

listStates();                       // ['Andhra Pradesh', 'Assam', ...]
listPincodesByCity('Bangalore');    // ['560001', '560002', ...]
getDatasetMeta();                   // { version, generatedAt, states, pincodes }
```

### Handle errors

```ts
import { getByPincode, PincodeError } from '@twin.techies/india-pincode';

try {
  getByPincode('abc');
} catch (err) {
  if (err instanceof PincodeError) {
    if (err.code === 'INVALID_FORMAT') /* ... */;
    if (err.code === 'NOT_FOUND')      /* ... */;
  }
}
```

## API

| Function | Returns | Notes |
|---|---|---|
| `getByPincode(pin)` | `PincodeResult` | Throws `PincodeError` if format invalid or not found |
| `findByPincode(pin)` | `PincodeResult \| null` | Same as above but returns null on not-found |
| `searchByCity(query, options?)` | `PostOffice[]` | Min 2-char query, default fuzzy + limit 50 |
| `listStates()` | `string[]` | All states in the dataset |
| `listPincodesByCity(city)` | `string[]` | All pincodes for a city |
| `isValidPincode(pin)` | `boolean` | Format check only |
| `getDatasetMeta()` | `object` | Version, generation date, counts |

## Types

```ts
interface PincodeResult {
  pincode: string;
  state: string;
  district: string;
  offices: PostOffice[];
}

interface PostOffice {
  name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface SearchOptions {
  limit?: number;    // default 50
  fuzzy?: boolean;   // default true (substring match); false = prefix only
}
```

## Performance

- **First lookup**: ~30–50ms (loads + parses 2 MB JSON once)
- **Subsequent lookups**: <1ms (in-memory)
- **Memory**: ~6–8 MB after load

For most apps this is negligible — the data loads on the first call and stays in memory for the process lifetime.

## Bundle size

- npm package: **~426 KB** (gzipped)
- Unpacked: **~2 MB** (mostly the dataset)
- Code only: **~5 KB**

If you don't need the offline dataset and want to fetch from an API, use a different library — this one is built for reliability over byte-savings.

## Roadmap

- v0.2 — React `<PincodeInput />` autocomplete component
- v0.3 — Data refresh script (`npm run sync-data`) to pull latest from data.gov.in

## Data Source & Attribution

Dataset compiled from [kishorek/India-Codes](https://github.com/kishorek/India-Codes), ultimately sourced from India Post (Department of Posts, Government of India). Pincode data is public information.

This package is not affiliated with India Post or the Government of India.

## License

MIT
