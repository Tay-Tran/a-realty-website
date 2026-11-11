import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { Carousel } from './Carousel';
import { ReviewCard } from './ReviewCard';

// Sample reviews in the style of a Google reviews widget, labelled "Sample" on every card.
// Production replaces them with real reviews from the client's Google Business profile.
const SAMPLES = [
  { n: 1, daysAgo: 4, color: 'bg-[#9b72cf]' },
  { n: 2, daysAgo: 6, color: 'bg-ink' },
  { n: 3, daysAgo: 10, color: 'bg-success' },
  { n: 4, daysAgo: 15, color: 'bg-accent' },
  { n: 5, daysAgo: 21, color: 'bg-[#4285F4]' },
  { n: 6, daysAgo: 30, color: 'bg-warn' },
];

export function Reviews() {
  const t = useTranslations('home');
  return (
    <section className="bg-white py-14">
      <Container>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">{t('reviewsTitle')}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-ink-soft">{t('reviewsSubtitle')}</p>
        <p className="mt-8 text-center text-lg font-semibold text-ink-soft/70">{t('reviewsKicker')}</p>
        <div className="mt-2">
          <Carousel>
            {SAMPLES.map(({ n, daysAgo, color }) => (
              <div key={n} className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-[31.5%]">
                <ReviewCard name={t(`review${n}Name`)} from={t(`review${n}From`)} text={t(`review${n}Text`)} daysAgo={daysAgo} color={color} />
              </div>
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
