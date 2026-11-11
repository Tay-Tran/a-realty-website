import { describe, expect, it } from 'vitest';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';
import my from '../../messages/my.json';

type Tree = { [k: string]: string | Tree };
const keys = (t: Tree, prefix = ''): string[] =>
  Object.entries(t).flatMap(([k, v]) => (typeof v === 'string' ? [`${prefix}${k}`] : keys(v, `${prefix}${k}.`)));

describe('messages', () => {
  const enKeys = keys(en as Tree).sort();
  it.each([['my', my], ['ja', ja]])('%s has exactly the same keys as en', (_name, messages) => {
    expect(keys(messages as Tree).sort()).toEqual(enKeys);
  });
});
