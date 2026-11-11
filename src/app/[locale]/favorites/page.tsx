import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { isLocale, requireLocale } from '@/i18n/locale';
import { buildAlternates } from '@/lib/seo';
import { FavoritesList } from '@/components/listing/FavoritesList';
import { Container } from '@/components/ui/Container';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'favorites' });
  // Personal list: never indexed, even in production.
  return { title: t('title'), alternates: buildAlternates(locale, '/favorites'), robots: { index: false, follow: true } };
}

export default async function FavoritesPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('favorites');
  return (
    <main>
      <Container className="py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
        <p className="mt-1 text-sm text-ink-soft">{t('emptyHint')}</p>
        <FavoritesList />
      </Container>
    </main>
  );
}
