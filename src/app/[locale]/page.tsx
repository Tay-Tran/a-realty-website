import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { countListingsByArea, getAreas, getFeaturedListings, getStations } from '@/lib/data';
import { buildSearchOptions } from '@/lib/data/search-options';
import type { Locale } from '@/lib/data/types';
import { buildAlternates } from '@/lib/seo';
import { AreaGrid } from '@/components/home/AreaGrid';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { Faq } from '@/components/home/Faq';
import { Hero } from '@/components/home/Hero';
import { InquirySection } from '@/components/home/InquirySection';
import { RentalSteps } from '@/components/home/RentalSteps';
import { ListingCard } from '@/components/listing/ListingCard';
import { Container } from '@/components/ui/Container';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return { title: { absolute: `${t('homeTitle')} | ${site.name}` }, alternates: buildAlternates(locale as Locale) };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, options, featured, areas, counts, stations] = await Promise.all([
    getTranslations('home'),
    buildSearchOptions(locale as Locale),
    getFeaturedListings(6),
    getAreas(),
    countListingsByArea(),
    getStations(),
  ]);
  const stationMap = Object.fromEntries(stations.map((s) => [s.slug, s]));

  return (
    <main>
      <Hero options={options} />
      <CategoryTiles />
      <Container className="py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">{t('featuredTitle')}</h2>
          <Link href="/rent" className="text-sm font-semibold text-accent hover:underline">{t('viewAll')} →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((l) => <ListingCard key={l.code} listing={l} stations={stationMap} />)}
        </div>
      </Container>
      <AreaGrid areas={areas} counts={counts} />
      <RentalSteps />
      <Faq />
      <InquirySection />
    </main>
  );
}
