import { z } from 'zod';

export const MAX_CV_BYTES = 5 * 1024 * 1024;
export const CV_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;

type Field = 'name' | 'email' | 'position' | 'cv';
type ErrorCode = 'required' | 'invalidEmail' | 'fileType' | 'fileSize';

export interface ApplicationInput {
  name: string; email: string; phone: string; position: string; message: string;
  cv: { name: string; size: number } | null;
}

/** Job application. A CV is optional, but if attached it must be PDF/Word and at most 5 MB. */
export function validateApplication(input: ApplicationInput):
  { ok: true } | { ok: false; errors: Partial<Record<Field, ErrorCode>> } {
  const errors: Partial<Record<Field, ErrorCode>> = {};
  if (!input.name.trim()) errors.name = 'required';
  if (!input.email.trim()) errors.email = 'required';
  else if (!z.email().safeParse(input.email.trim()).success) errors.email = 'invalidEmail';
  if (!input.position) errors.position = 'required';
  if (input.cv) {
    const ext = input.cv.name.split('.').pop()?.toLowerCase() ?? '';
    if (!(CV_EXTENSIONS as readonly string[]).includes(ext)) errors.cv = 'fileType';
    else if (input.cv.size > MAX_CV_BYTES) errors.cv = 'fileSize';
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true };
}
