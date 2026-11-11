import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/lib/data/types';

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Narrow the [locale] route param or render 404. Pages must call this before using the
 * locale: requests such as /favicon.ico reach the [locale] segment and would otherwise
 * be rendered with "favicon.ico" as the locale.
 */
export function requireLocale(value: string): Locale {
  if (!isLocale(value)) notFound();
  return value;
}
