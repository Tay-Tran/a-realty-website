import { describe, expect, it } from 'vitest';
import { mergeMessages } from './merge';

describe('mergeMessages', () => {
  it('deep-merges and falls back to base for missing or empty strings', () => {
    const base = { a: 'A', nested: { b: 'B', c: 'C' } };
    const override = { a: 'á', nested: { b: '' } };
    expect(mergeMessages(base, override)).toEqual({ a: 'á', nested: { b: 'B', c: 'C' } });
  });
});
