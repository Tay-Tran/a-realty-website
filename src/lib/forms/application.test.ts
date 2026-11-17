import { describe, expect, it } from 'vitest';
import { MAX_CV_BYTES, validateApplication } from './application';

const ok = { name: 'Aung', email: 'aung@example.com', phone: '', position: 'rental-agent', message: 'Hello', cv: null };

describe('validateApplication', () => {
  it('accepts an application without a CV (phone and message optional)', () => {
    expect(validateApplication({ ...ok, message: '' })).toEqual({ ok: true });
  });
  it('accepts a PDF or Word CV under the size limit', () => {
    expect(validateApplication({ ...ok, cv: { name: 'cv.pdf', size: 200_000 } })).toEqual({ ok: true });
    expect(validateApplication({ ...ok, cv: { name: 'CV.DOCX', size: 200_000 } })).toEqual({ ok: true });
  });
  it('rejects other file types and files that are too large', () => {
    expect(validateApplication({ ...ok, cv: { name: 'photo.png', size: 1000 } })).toEqual({ ok: false, errors: { cv: 'fileType' } });
    expect(validateApplication({ ...ok, cv: { name: 'cv.pdf', size: MAX_CV_BYTES + 1 } })).toEqual({ ok: false, errors: { cv: 'fileSize' } });
  });
  it('requires name, a valid email and a position', () => {
    expect(validateApplication({ ...ok, name: '', email: 'bad', position: '' })).toEqual({
      ok: false, errors: { name: 'required', email: 'invalidEmail', position: 'required' },
    });
  });
});
