import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';

export function RentalSteps() {
  const t = useTranslations('home');
  return (
    <section id="steps" className="scroll-mt-20 py-14">
      <Container>
        <h2 className="text-2xl font-bold">{t('stepsTitle')}</h2>
        <p className="mt-2 text-ink-soft">{t('stepsSubtitle')}</p>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {[1, 2, 3, 4, 5].map((n) => (
            <li key={n} className="rounded-2xl border border-line bg-white p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-accent font-bold text-white">{n}</span>
              <p className="mt-3 font-semibold">{t(`step${n}Title`)}</p>
              <p className="mt-1 text-sm text-ink-soft">{t(`step${n}Text`)}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
