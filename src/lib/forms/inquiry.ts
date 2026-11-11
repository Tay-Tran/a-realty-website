import { z } from 'zod';

type Field = 'name' | 'email' | 'message';
type ErrorCode = 'required' | 'invalidEmail';

export function validateInquiry(input: { name: string; email: string; phone: string; message: string }):
  { ok: true } | { ok: false; errors: Partial<Record<Field, ErrorCode>> } {
  const errors: Partial<Record<Field, ErrorCode>> = {};
  if (!input.name.trim()) errors.name = 'required';
  if (!input.email.trim()) errors.email = 'required';
  else if (!z.email().safeParse(input.email.trim()).success) errors.email = 'invalidEmail';
  if (!input.message.trim()) errors.message = 'required';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}
