import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import en from '../../messages/en.json';
import { mergeMessages, type Messages } from './merge';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const messages = (await import(`../../messages/${locale}.json`)).default as Messages;
  return { locale, messages: locale === 'en' ? messages : mergeMessages(en as Messages, messages) };
});
