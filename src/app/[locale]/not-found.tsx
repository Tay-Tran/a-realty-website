import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t('title')}</h1>
      <p className="mt-2 text-ink-soft">{t('text')}</p>
      <Link href="/" className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-white">{t('backHome')}</Link>
    </main>
  );
}
