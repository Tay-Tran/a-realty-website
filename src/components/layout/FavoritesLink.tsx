'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { usePreferences } from '@/components/providers/PreferencesProvider';

export function FavoritesLink() {
  const t = useTranslations('nav');
  const { favorites } = usePreferences();
  return (
    <Link href="/favorites" aria-label={t('favorites')} title={t('favorites')}
      className="relative grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-soft hover:text-sky">
      <span aria-hidden>♡</span>
      {favorites.length > 0 && (
        <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
          {favorites.length}
        </span>
      )}
    </Link>
  );
}
