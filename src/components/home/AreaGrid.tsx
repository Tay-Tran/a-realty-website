import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Area, Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { Container } from '@/components/ui/Container';
import { PinIcon } from '@/components/ui/icons';

export function AreaGrid({ areas, counts }: { areas: Area[]; counts: Record<string, number> }) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  return (
    <section id="areas" className="scroll-mt-20 py-14">
      <Container>
        <h2 className="text-2xl font-bold">{t('areasTitle')}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {areas.map((a) => (
            <Link key={a.slug} href={`/rent?area=${a.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-line bg-white p-5 transition hover:border-sky">
              <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tint text-sky"><PinIcon /></span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold text-ink group-hover:text-sky">{pickText(a.name, locale)}</span>
                <span className="mt-0.5 block text-sm text-ink-soft">{t('areaCount', { count: counts[a.slug] ?? 0 })}</span>
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
