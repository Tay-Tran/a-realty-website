import { z } from 'zod';

export const PARTNER_TYPES = ['agency', 'school', 'company', 'individual', 'broker', 'relocation', 'community', 'union', 'other'] as const;
export type PartnerType = (typeof PARTNER_TYPES)[number];
export const PARTNER_VOLUMES = ['1-3', '4-10', '10-30', '30+'] as const;

type Field = 'organization' | 'contact' | 'email' | 'phone' | 'type' | 'volume';
type ErrorCode = 'required' | 'invalidEmail';

export interface PartnerInput {
  organization: string; contact: string; email: string; phone: string; type: string; volume: string; network: string;
}

/** Partner / collaborator sign-up. Individuals (collaborators, creators) need no organization name. */
export function validatePartner(input: PartnerInput):
  { ok: true } | { ok: false; errors: Partial<Record<Field, ErrorCode>> } {
  const errors: Partial<Record<Field, ErrorCode>> = {};
  if (input.type !== 'individual' && input.type !== '' && !input.organization.trim()) errors.organization = 'required';
  if (!input.contact.trim()) errors.contact = 'required';
  if (!input.email.trim()) errors.email = 'required';
  else if (!z.email().safeParse(input.email.trim()).success) errors.email = 'invalidEmail';
  if (!input.phone.trim()) errors.phone = 'required';
  if (!input.type) errors.type = 'required';
  if (!input.volume) errors.volume = 'required';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}
