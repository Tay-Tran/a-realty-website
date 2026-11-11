import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { SERVICE_ICONS } from '@/components/ui/feature-icons';

export function Services() {
  const t = useTranslations('home');
  return (
    <section className="bg-white py-14">
      <Container>
        <h2 className="text-2xl font-bold">{t('servicesTitle')}</h2>
        <p className="mt-2 text-ink-soft">{t('servicesSubtitle')}</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_ICONS.map((Icon, i) => {
            const n = i + 1;
            return (
            <div key={n} className="rounded-2xl border border-line bg-white p-5">
              <span aria-hidden className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent"><Icon className="h-6 w-6" /></span>
              <p className="mt-4 font-semibold">{t(`service${n}Title`)}</p>
              <p className="mt-1 text-sm text-ink-soft">{t(`service${n}Text`)}</p>
            </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
