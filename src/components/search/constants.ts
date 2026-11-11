import type { ConditionKey } from '@/lib/data/types';

export const RENT_STEPS = [50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000];
export const WALK_STEPS = [5, 10, 15, 20];
export const SIZE_STEPS = [15, 20, 25, 30, 40, 50];
export const BEDROOM_STEPS = [1, 2, 3];
export const AGE_STEPS = [3, 5, 10, 20];

/** Home-page categories, same set as the reference site and the team's quote. */
export const CATEGORY_KEYS: ConditionKey[] = ['studentOk', 'family', 'newlyBuilt', 'noKeyMoney', 'luxury', 'petOk'];

// Unsplash photos (free license), checked by eye on 2026-11-11.
const photo = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&q=70&auto=format&fit=crop`;
export const CATEGORY_IMAGES: Partial<Record<ConditionKey, string>> = {
  studentOk: photo('1522708323590-d24dbb6b0267'),
  family: photo('1600210492486-724fe5c67fb0'),
  newlyBuilt: photo('1600607687939-ce8a6c25118c'),
  noKeyMoney: photo('1502672260266-1c1ef2d93688'),
  luxury: photo('1631049307264-da0ec9d70304'),
  petOk: photo('1586023492125-27b2c045efd7'),
};
export const ABOUT_IMAGE = photo('1560448204-e02f11c3d0e2');
