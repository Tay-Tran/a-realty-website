'use client';

import { useTranslations } from 'next-intl';
import { usePreferences } from '@/components/providers/PreferencesProvider';

export function FavoriteButton({ code, withLabel = false, className = '' }: { code: string; withLabel?: boolean; className?: string }) {
  const t = useTranslations('listing');
  const { favorites, toggleFavorite } = usePreferences();
  const saved = favorites.includes(code);
  return (
    <button type="button" aria-pressed={saved} aria-label={saved ? t('saved') : t('save')}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(code); }}
      className={`inline-flex items-center gap-1.5 rounded-full border border-line bg-white/95 text-sm shadow-sm transition hover:border-accent ${withLabel ? 'px-4 py-2' : 'h-9 w-9 justify-center'} ${className}`}>
      <span aria-hidden className={saved ? 'text-sky' : 'text-ink-soft'}>{saved ? '♥' : '♡'}</span>
      {withLabel && <span>{saved ? t('saved') : t('save')}</span>}
    </button>
  );
}
