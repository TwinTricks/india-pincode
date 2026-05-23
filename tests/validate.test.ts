import { describe, expect, test } from 'bun:test';
import { isValidPincode, normalizePincode } from '../src/validate';

describe('isValidPincode', () => {
  test('accepts valid 6-digit pincodes', () => {
    expect(isValidPincode('110001')).toBe(true);
    expect(isValidPincode('560001')).toBe(true);
    expect(isValidPincode(400001)).toBe(true);
  });

  test('rejects pincodes starting with 0', () => {
    expect(isValidPincode('010001')).toBe(false);
  });

  test('rejects pincodes with wrong length', () => {
    expect(isValidPincode('11001')).toBe(false);
    expect(isValidPincode('1100012')).toBe(false);
  });

  test('rejects non-numeric input', () => {
    expect(isValidPincode('abc123')).toBe(false);
    expect(isValidPincode('')).toBe(false);
  });

  test('trims whitespace', () => {
    expect(isValidPincode(' 110001 ')).toBe(true);
  });
});

describe('normalizePincode', () => {
  test('converts numbers to strings', () => {
    expect(normalizePincode(110001)).toBe('110001');
  });

  test('trims whitespace', () => {
    expect(normalizePincode(' 110001 ')).toBe('110001');
  });
});
