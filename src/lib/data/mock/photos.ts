// Unsplash photos (free license), each checked by eye on 2026-11-11.
const url = (id: string) => `https://images.unsplash.com/photo-${id}?w=1600&q=75&auto=format&fit=crop`;

/** Living rooms and bedrooms – the first photo of every listing comes from here. */
export const INTERIORS: string[] = [
  '1502672260266-1c1ef2d93688', '1522708323590-d24dbb6b0267', '1560448204-e02f11c3d0e2',
  '1493809842364-78817add7ffb', '1505691938895-1758d7feb511', '1586023492125-27b2c045efd7',
  '1554995207-c18c203602cb', '1556020685-ae41abfc9365', '1540518614846-7eded433c457',
  '1536376072261-38c75010e6c9', '1513694203232-719a280e022f', '1567767292278-a4f21aa2d36e',
  '1617104678098-de229db51175', '1600210492486-724fe5c67fb0', '1600607687939-ce8a6c25118c',
  '1598928506311-c55ded91a20c', '1631049307264-da0ec9d70304',
].map(url);

/** Kitchens and bathrooms. */
export const DETAILS: string[] = [
  '1484154218962-a197022b5858', '1556912172-45b7abe8b7e1', '1584622650111-993a426fbf0a',
].map(url);

/** Apartment building exteriors. */
export const EXTERIORS: string[] = [
  '1545324418-cc1a3fa10c00', '1460317442991-0ec209397118', '1574362848149-11496d93a7c7',
].map(url);

export function photosFor(index: number): string[] {
  const n = INTERIORS.length;
  return [
    INTERIORS[index % n],
    INTERIORS[(index + 5) % n],
    DETAILS[index % DETAILS.length],
    INTERIORS[(index + 11) % n],
    EXTERIORS[index % EXTERIORS.length],
  ];
}
