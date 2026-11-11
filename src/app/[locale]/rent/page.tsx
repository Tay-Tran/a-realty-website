import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getListings, getStations } from '@/lib/data';
import { buildSearchOptions } from '@/lib/data/search-options';
import type { Locale } from '@/lib/data/types';
import { parseFilters, serializeFilters } from '@/lib/listing/filters';
import { buildAlternates } from '@/lib/seo';
import { ListingCard } from '@/components/listing/ListingCard';
import { FilterPanel } from '@/components/search/FilterPanel';
import { FilterSheet } from '@/components/search/FilterSheet';
import { Pagination } from '@/components/search/Pagination';
import { SortSelect } from '@/components/search/SortSelect';
import { Container } from '@/components/ui/Container';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  // Filtered URLs canonicalize to /rent; per-station SEO pages arrive in week 4.
  return { title: t('rentTitle'), description: t('rentDescription'), alternates: buildAlternates(locale as Locale, '/rent') };
}

export default async function RentPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const filters = parseFilters(await searchParams);
  const [t, result, options, stations] = await Promise.all([
    getTranslations('search'),
    getListings(filters),
    buildSearchOptions(locale as Locale),
    getStations(),
  ]);
  const stationMap = Object.fromEntries(stations.map((s) => [s.slug, s]));
  const panelKey = serializeFilters({ ...filters, sort: undefined, page: undefined });

  return (
    <main>
      <Container className="py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-5">
              <FilterPanel key={panelKey} options={options} filters={filters} />
            </div>
          </aside>
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-medium">{t('results', { count: result.total })}</p>
              <div className="flex items-center gap-2">
                <FilterSheet key={panelKey} options={options} filters={filters} />
                <SortSelect filters={filters} />
              </div>
            </div>
            {result.items.length > 0 ? (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((l) => <ListingCard key={l.code} listing={l} stations={stationMap} />)}
              </div>
            ) : (
              <div className="mt-10 rounded-2xl border border-dashed border-line bg-white p-10 text-center">
                <p className="font-semibold">{t('noResults')}</p>
                <p className="mt-1 text-sm text-ink-soft">{t('noResultsHint')}</p>
                <Link href="/rent" className="mt-4 inline-block rounded-full bg-ink px-5 py-2 text-sm text-white">{t('clear')}</Link>
              </div>
            )}
            <Pagination filters={filters} page={result.page} pageCount={result.pageCount} />
          </div>
        </div>
      </Container>
    </main>
  );
}
