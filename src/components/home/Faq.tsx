import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';

export function Faq() {
  const t = useTranslations('faq');
  return (
    <section id="faq" className="scroll-mt-20 py-14">
      <Container className="max-w-3xl">
        <h2 className="text-2xl font-bold">{t('title')}</h2>
        <div className="mt-6 divide-y divide-line rounded-2xl border border-line">
          {[1, 2, 3, 4, 5].map((n) => (
            <details key={n} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {t(`q${n}`)}<span className="text-accent transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-ink-soft">{t(`a${n}`)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
