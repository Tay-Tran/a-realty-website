export const FAVORITES_KEY = 'kurashi:favorites';
const MAX_FAVORITES = 100;
const CODE = /^[A-Z]\d{4}$/;

/** Read the stored list defensively: anything malformed becomes an empty list. */
export function parseFavorites(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const codes = value
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.toUpperCase())
      .filter((v) => CODE.test(v));
    return [...new Set(codes)].slice(0, MAX_FAVORITES);
  } catch {
    return [];
  }
}

export function toggleFavorite(list: string[], code: string): string[] {
  return list.includes(code) ? list.filter((c) => c !== code) : [...list, code].slice(-MAX_FAVORITES);
}
