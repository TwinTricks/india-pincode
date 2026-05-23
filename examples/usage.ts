/**
 * @twin.techies/india-pincode — full usage examples
 *
 * Run with: bun run examples/usage.ts
 */

import {
  getByPincode,
  findByPincode,
  searchByCity,
  listStates,
  listPincodesByCity,
  isValidPincode,
  normalizePincode,
  getDatasetMeta,
  PincodeError,
} from '../src/index';

function section(title: string) {
  console.log('\n' + '='.repeat(60));
  console.log(' ' + title);
  console.log('='.repeat(60));
}

// ─────────────────────────────────────────────────────────────
section('1. Dataset metadata');
// ─────────────────────────────────────────────────────────────
const meta = getDatasetMeta();
console.log(`Version:     v${meta.version}`);
console.log(`Generated:   ${meta.generatedAt}`);
console.log(`States:      ${meta.states}`);
console.log(`Pincodes:    ${meta.pincodes.toLocaleString('en-IN')}`);

// ─────────────────────────────────────────────────────────────
section('2. Look up by pincode (throws if not found)');
// ─────────────────────────────────────────────────────────────
const mumbai = getByPincode('400001');
console.log(`Pincode:     ${mumbai.pincode}`);
console.log(`State:       ${mumbai.state}`);
console.log(`District:    ${mumbai.district}`);
console.log(`Offices:     ${mumbai.offices.length}`);
console.log(`First 3 office names:`);
mumbai.offices.slice(0, 3).forEach((o) => console.log(`  • ${o.name}`));

// ─────────────────────────────────────────────────────────────
section('3. Form auto-fill pattern (use findByPincode for null-safe)');
// ─────────────────────────────────────────────────────────────
function onPincodeChange(pin: string) {
  const result = findByPincode(pin);
  if (result) {
    return { ok: true, state: result.state, district: result.district };
  }
  return { ok: false };
}

console.log('User typed 110001 →', onPincodeChange('110001'));
console.log('User typed 999999 →', onPincodeChange('999999'));

// ─────────────────────────────────────────────────────────────
section('4. Strict validation with typed errors');
// ─────────────────────────────────────────────────────────────
function validatePincode(input: unknown): string {
  try {
    const result = getByPincode(input as string);
    return `✓ ${result.pincode} (${result.state})`;
  } catch (err) {
    if (err instanceof PincodeError) {
      if (err.code === 'INVALID_FORMAT') return '✗ Bad format';
      if (err.code === 'NOT_FOUND')      return '✗ Not in directory';
    }
    return '✗ Unexpected error';
  }
}

console.log('Input "560001":', validatePincode('560001'));
console.log('Input "abc":   ', validatePincode('abc'));
console.log('Input "999999":', validatePincode('999999'));

// ─────────────────────────────────────────────────────────────
section('5. City search (autocomplete pattern)');
// ─────────────────────────────────────────────────────────────
const puneOffices = searchByCity('pune', { limit: 5 });
console.log(`Top 5 offices in Pune:`);
puneOffices.forEach((o) => console.log(`  ${o.pincode}  ${o.name}`));

console.log('\nUsing prefix-only search (faster):');
const prefixOnly = searchByCity('mum', { limit: 3, fuzzy: false });
prefixOnly.forEach((o) => console.log(`  ${o.pincode}  ${o.name}, ${o.city}`));

// ─────────────────────────────────────────────────────────────
section('6. Format-only validation (no lookup)');
// ─────────────────────────────────────────────────────────────
console.log(`isValidPincode('110001'):  ${isValidPincode('110001')}`);
console.log(`isValidPincode('010001'):  ${isValidPincode('010001')}  (cannot start with 0)`);
console.log(`isValidPincode('abc'):     ${isValidPincode('abc')}`);
console.log(`isValidPincode(' 110001 '):${isValidPincode(' 110001 ')}  (whitespace trimmed)`);

console.log(`\nnormalizePincode(110001):   "${normalizePincode(110001)}"  (number → string)`);

// ─────────────────────────────────────────────────────────────
section('7. Reverse lookup — pincodes for a city');
// ─────────────────────────────────────────────────────────────
const blrPins = listPincodesByCity('Bangalore');
console.log(`Bangalore has ${blrPins.length} pincodes`);
console.log(`First 5: ${blrPins.slice(0, 5).join(', ')}`);

// ─────────────────────────────────────────────────────────────
section('8. List all states');
// ─────────────────────────────────────────────────────────────
const states = listStates();
console.log(`${states.length} states / UTs in dataset:`);
console.log(states.slice(0, 6).join(' • ') + ' • ...');

// ─────────────────────────────────────────────────────────────
section('9. Real-world: Indian e-commerce checkout snippet');
// ─────────────────────────────────────────────────────────────
type CheckoutForm = { name: string; address: string; pincode: string };

function enrichCheckout(form: CheckoutForm) {
  if (!isValidPincode(form.pincode)) {
    return { ok: false, error: 'Pincode must be 6 digits' };
  }
  const location = findByPincode(form.pincode);
  if (!location) {
    return { ok: false, error: 'Pincode not in directory' };
  }
  return {
    ok: true,
    enriched: {
      ...form,
      state: location.state,
      district: location.district,
      nearestPostOffice: location.offices[0]?.name,
    },
  };
}

const order = { name: 'Rahul', address: 'A-1, MG Road', pincode: '400001' };
console.log('Input:', order);
console.log('Result:', enrichCheckout(order));

console.log('\n' + '─'.repeat(60));
console.log(' ✓ All examples ran successfully');
console.log('─'.repeat(60));
