import { describe, expect, it } from 'vitest';
import { validatePartner } from './partner';

const ok = { organization: 'Tokyo Language School', contact: 'Mya', email: 'mya@example.com', phone: '+81 90-0000-0000', type: 'school', volume: '1-3', network: 'Myanmar students in Tokyo' };

describe('validatePartner', () => {
  it('accepts a complete application', () => {
    expect(validatePartner(ok)).toEqual({ ok: true });
  });
  it('allows an individual collaborator without an organization name', () => {
    expect(validatePartner({ ...ok, organization: '', type: 'individual' })).toEqual({ ok: true });
  });
  it('requires an organization name for organizations', () => {
    expect(validatePartner({ ...ok, organization: ' ' })).toEqual({ ok: false, errors: { organization: 'required' } });
  });
  it('reports every missing or invalid field', () => {
    expect(validatePartner({ organization: '', contact: '', email: 'x', phone: '', type: '', volume: '', network: '' })).toEqual({
      ok: false,
      errors: { contact: 'required', email: 'invalidEmail', phone: 'required', type: 'required', volume: 'required' },
    });
  });
});
