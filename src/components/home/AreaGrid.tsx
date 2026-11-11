import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Area, Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { Container } from '@/components/ui/Container';

export function AreaGrid({ areas, counts }: { areas: Area[]; counts: Record<string, number> }) {
  const t = useTranslations('home');
  const locale = useLocale() as Locale;
  return (
    <section id="areas" className="scroll-mt-20 py-14">
      <Container>
        <h2 className="text-2xl font-bold">{t('areasTitle')}</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {areas.map((a, i) => (
            <Link key={a.slug} href={`/rent?area=${a.slug}`}
              className={`rounded-2xl p-5 text-white transition hover:-translate-y-0.5 ${i % 2 ? 'bg-ink' : 'bg-accent'}`}>
              <p className="text-lg font-semibold">{pickText(a.name, locale)}</p>
              <p className="mt-1 text-sm text-white/80">{t('areaCount', { count: counts[a.slug] ?? 0 })}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
