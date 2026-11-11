import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';

const AVATAR_COLORS = ['bg-accent', 'bg-ink', 'bg-success'];

// Sample reviews for the demo (labelled as such on the page); real reviews come from the client / Google later.
export function Reviews() {
  const t = useTranslations('home');
  return (
    <section className="bg-white py-14">
      <Container>
        <h2 className="text-center text-2xl font-bold">{t('reviewsTitle')}</h2>
        <p className="mt-2 text-center text-sm text-ink-soft">{t('reviewsSubtitle')}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => {
            const name = t(`review${n}Name`);
            return (
              <figure key={n} className="relative flex flex-col rounded-2xl border border-line bg-paper p-6 shadow-sm">
                <span aria-hidden className="absolute right-5 top-2 font-serif text-6xl leading-none text-accent/20">”</span>
                <p aria-label="5/5" className="text-sm tracking-wider text-accent">★★★★★</p>
                <blockquote className="mt-3 flex-1 text-ink">{t(`review${n}Text`)}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                  <span aria-hidden className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-bold text-white ${AVATAR_COLORS[n - 1]}`}>
                    {name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{name}</span>
                    <span className="block truncate text-sm text-ink-soft">{t(`review${n}From`)}</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
