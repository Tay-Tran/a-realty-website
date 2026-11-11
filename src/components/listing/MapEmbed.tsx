import { useLocale, useTranslations } from 'next-intl';

export function MapEmbed({ address }: { address: string }) {
  const t = useTranslations('listing');
  const locale = useLocale();
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=${locale}&z=15&output=embed`;
  return (
    <section>
      <h2 className="text-xl font-bold">{t('map')}</h2>
      <iframe title={t('map')} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
        className="mt-3 aspect-[16/9] w-full rounded-2xl border border-line" />
    </section>
  );
}
