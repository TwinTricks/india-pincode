import { describe, expect, test } from 'bun:test';
import {
  getByPincode,
  findByPincode,
  searchByCity,
  listStates,
  listPincodesByCity,
  getDatasetMeta,
  PincodeError,
} from '../src/index';

describe('getByPincode', () => {
  test('returns data for a known Mumbai pincode', () => {
    const result = getByPincode('400001');
    expect(result.pincode).toBe('400001');
    expect(result.state.toLowerCase()).toContain('maharashtra');
    expect(result.offices.length).toBeGreaterThan(0);
  });

  test('returns data for a known Delhi pincode', () => {
    const result = getByPincode('110001');
    expect(result.pincode).toBe('110001');
    expect(result.offices.length).toBeGreaterThan(0);
  });

  test('returns data for a known Bengaluru pincode', () => {
    const result = getByPincode('560001');
    expect(result.state.toLowerCase()).toContain('karnataka');
  });

  test('throws INVALID_FORMAT for malformed pincode', () => {
    try {
      getByPincode('abc');
      throw new Error('should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(PincodeError);
      expect((err as PincodeError).code).toBe('INVALID_FORMAT');
    }
  });

  test('throws NOT_FOUND for valid format but unknown pincode', () => {
    try {
      getByPincode('999999');
      throw new Error('should have thrown');
    } catch (err) {
      expect((err as PincodeError).code).toBe('NOT_FOUND');
    }
  });

  test('accepts numeric input', () => {
    const result = getByPincode(400001);
    expect(result.pincode).toBe('400001');
  });
});

describe('findByPincode', () => {
  test('returns null for unknown pincode instead of throwing', () => {
    expect(findByPincode('999999')).toBeNull();
  });

  test('still throws for invalid format', () => {
    expect(() => findByPincode('abc')).toThrow();
  });
});

describe('searchByCity', () => {
  test('finds offices by exact city name', () => {
    const results = searchByCity('Mumbai');
    expect(results.length).toBeGreaterThan(0);
  });

  test('returns empty array for unknown city', () => {
    const results = searchByCity('Atlantis');
    expect(results).toEqual([]);
  });

  test('rejects too-short queries', () => {
    expect(searchByCity('a')).toEqual([]);
  });

  test('respects limit option', () => {
    const results = searchByCity('mumbai', { limit: 3 });
    expect(results.length).toBeLessThanOrEqual(3);
  });
});

describe('listStates', () => {
  test('returns all states', () => {
    const states = listStates();
    expect(states.length).toBeGreaterThan(20);
    expect(states.some((s) => s.toLowerCase().includes('maharashtra'))).toBe(true);
  });
});

describe('listPincodesByCity', () => {
  test('lists pincodes for a city', () => {
    const pins = listPincodesByCity('Mumbai');
    expect(pins.length).toBeGreaterThan(0);
  });
});

describe('getDatasetMeta', () => {
  test('reports dataset metadata', () => {
    const meta = getDatasetMeta();
    expect(meta.version).toBe(1);
    expect(meta.pincodes).toBeGreaterThan(20000);
    expect(meta.states).toBeGreaterThan(20);
  });
});
