import type { ConditionKey } from '@/lib/data/types';

export const RENT_STEPS = [50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 200000];
export const WALK_STEPS = [5, 10, 15, 20];
export const CATEGORY_KEYS: ConditionKey[] = ['studentOk', 'noKeyMoney', 'noGuarantor', 'petOk', 'newlyBuilt', 'furnished'];
export const CATEGORY_ICONS: Record<string, string> = {
  studentOk: '🎓', noKeyMoney: '🔑', noGuarantor: '🤝', petOk: '🐾', newlyBuilt: '✨', furnished: '🛋️',
};
