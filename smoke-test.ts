import { getByPincode, searchByCity, getDatasetMeta, listStates } from './src/index';

console.log('=== Offline smoke test ===\n');

const meta = getDatasetMeta();
console.log(`Dataset: v${meta.version}, ${meta.pincodes} pincodes, ${meta.states} states\n`);

console.log('Mumbai (400001):');
const m = getByPincode('400001');
console.log(`  ${m.state} → ${m.district} → ${m.offices.length} offices`);
console.log(`  First: ${m.offices[0]?.name}\n`);

console.log('Delhi (110001):');
const d = getByPincode('110001');
console.log(`  ${d.state} → ${d.district}\n`);

console.log('Bengaluru (560001):');
const b = getByPincode('560001');
console.log(`  ${b.state} → ${b.district}\n`);

console.log('Search "pune" (limit 5):');
const offices = searchByCity('pune', { limit: 5 });
offices.forEach(o => console.log(`  ${o.pincode} ${o.name}, ${o.city}`));

console.log('\nStates (first 5):', listStates().slice(0, 5).join(', '));
console.log('\n✓ Offline lib working');
