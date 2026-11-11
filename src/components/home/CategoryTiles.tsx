import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';
import { CATEGORY_ICONS, CATEGORY_KEYS } from '@/components/search/constants';

export function CategoryTiles() {
  const t = useTranslations('categories');
  return (
    <Container className="py-12">
      <h2 className="text-2xl font-bold">{t('title')}</h2>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORY_KEYS.map((key) => (
          <Link key={key} href={`/rent?conditions=${key}`}
            className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-white p-4 text-center font-medium hover:border-accent">
            <span aria-hidden className="text-3xl">{CATEGORY_ICONS[key]}</span>
            <span className="text-sm">{t(key)}</span>
          </Link>
        ))}
      </div>
    </Container>
  );
}
