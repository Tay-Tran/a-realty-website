import { describe, expect, it } from 'vitest';
import { validateInquiry } from './inquiry';

describe('validateInquiry', () => {
  it('accepts a complete inquiry; phone is optional', () => {
    expect(validateInquiry({ name: 'Aung', email: 'aung@example.com', phone: '', message: 'Looking for 1K' })).toEqual({ ok: true });
  });
  it('reports required fields and bad email', () => {
    expect(validateInquiry({ name: ' ', email: 'nope', phone: '', message: '' })).toEqual({
      ok: false, errors: { name: 'required', email: 'invalidEmail', message: 'required' },
    });
    expect(validateInquiry({ name: 'A', email: '', phone: '', message: 'x' })).toEqual({
      ok: false, errors: { email: 'required' },
    });
  });
});
