export type Messages = { [key: string]: string | Messages };

/** Deep-merge translations over a base (English); missing or empty strings fall back to base. */
export function mergeMessages(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    if (value === '') continue;
    out[key] = typeof value === 'object' && typeof baseValue === 'object'
      ? mergeMessages(baseValue, value)
      : value;
  }
  return out;
}
