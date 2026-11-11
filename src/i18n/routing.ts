import { defineRouting } from 'next-intl/routing';
import { LOCALES } from '@/lib/data/types';

export const routing = defineRouting({ locales: LOCALES, defaultLocale: 'en', localePrefix: 'always' });
