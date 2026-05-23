const PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export function isValidPincode(pincode: string | number): boolean {
  if (pincode === null || pincode === undefined) return false;
  const value = String(pincode).trim();
  return PINCODE_REGEX.test(value);
}

export function normalizePincode(pincode: string | number): string {
  return String(pincode).trim();
}
