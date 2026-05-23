export interface PostOffice {
  name: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface PincodeResult {
  pincode: string;
  state: string;
  district: string;
  offices: PostOffice[];
}

export class PincodeError extends Error {
  code: 'INVALID_FORMAT' | 'NOT_FOUND' | 'DATA_ERROR';
  constructor(code: PincodeError['code'], message: string) {
    super(message);
    this.code = code;
    this.name = 'PincodeError';
  }
}
