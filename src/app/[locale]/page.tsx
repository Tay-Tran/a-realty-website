import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { countListingsByArea, getAreas, getFeaturedListings, getStations } from '@/lib/data';
import { buildSearchOptions } from '@/lib/data/search-options';
import type { Locale } from '@/lib/data/types';
import { buildAlternates } from '@/lib/seo';
import { About } from '@/components/home/About';
import { AreaGrid } from '@/components/home/AreaGrid';
import { Carousel } from '@/components/home/Carousel';
import { CategoriesAndContact } from '@/components/home/CategoriesAndContact';
import { Faq } from '@/components/home/Faq';
import { Hero } from '@/components/home/Hero';
import { PartnerCta } from '@/components/home/PartnerCta';
import { RentalSteps } from '@/components/home/RentalSteps';
import { Reviews } from '@/components/home/Reviews';
import { Services } from '@/components/home/Services';
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
      <CategoriesAndContact />
      <section className="bg-white py-14">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t('featuredTitle')}</h2>
              <p className="mt-1 text-sm text-ink-soft">{t('featuredSubtitle')}</p>
            </div>
            <Link href="/rent" className="shrink-0 text-sm font-semibold text-accent hover:underline">{t('viewAll')} →</Link>
          </div>
          <div className="mt-4">
            <Carousel>
              {featured.map((l) => (
                <div key={l.code} className="w-[80%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
                  <ListingCard listing={l} stations={stationMap} />
                </div>
              ))}
            </Carousel>
          </div>
        </Container>
      </section>
      <AreaGrid areas={areas} counts={counts} />
      <Services />
      <RentalSteps />
      <About />
      <PartnerCta />
      <Reviews />
      <Faq />
    </main>
  );
}
