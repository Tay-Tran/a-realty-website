import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';

// Sample reviews for the demo (labelled as such on the page); real reviews come from the client / Google later.
export function Reviews() {
  const t = useTranslations('home');
  return (
    <section className="bg-white py-14">
      <Container>
        <h2 className="text-center text-2xl font-bold">{t('reviewsTitle')}</h2>
        <p className="mt-2 text-center text-sm text-ink-soft">{t('reviewsSubtitle')}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <figure key={n} className="rounded-2xl border border-line bg-paper p-6">
              <p aria-hidden className="text-accent">★★★★★</p>
              <blockquote className="mt-3 text-ink">“{t(`review${n}Text`)}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold">{t(`review${n}Name`)}</span>
                <span className="text-ink-soft"> · {t(`review${n}From`)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
