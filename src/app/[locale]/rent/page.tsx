import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getAreas, getLines, getListings, getStations } from '@/lib/data';
import { buildSearchOptions } from '@/lib/data/search-options';
import type { ConditionKey } from '@/lib/data/types';
import { isLocale, requireLocale } from '@/i18n/locale';
import { parseFilters, serializeFilters, toggleCondition } from '@/lib/listing/filters';
import { buildAlternates } from '@/lib/seo';
import { ListingRow } from '@/components/listing/ListingRow';
import { CATEGORY_KEYS } from '@/components/search/constants';
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
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  // Filtered URLs canonicalize to /rent; per-station SEO pages arrive in week 4.
  return { title: t('rentTitle'), description: t('rentDescription'), alternates: buildAlternates(locale, '/rent') };
}

export default async function RentPage({ params, searchParams }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const filters = parseFilters(await searchParams);
  const [t, tc, result, options, stations, areas, lines] = await Promise.all([
    getTranslations('search'),
    getTranslations('categories'),
    getListings(filters),
    buildSearchOptions(locale),
    getStations(),
    getAreas(),
    getLines(),
  ]);
  const stationMap = Object.fromEntries(stations.map((s) => [s.slug, s]));
  const areaMap = Object.fromEntries(areas.map((a) => [a.slug, a]));
  const lineMap = Object.fromEntries(lines.map((l) => [l.slug, l]));
  const panelKey = serializeFilters({ ...filters, sort: undefined, page: undefined });
  const chipHref = (key: ConditionKey) => {
    const qs = serializeFilters(toggleCondition(filters, key));
    return qs ? `/rent?${qs}` : '/rent';
  };

  return (
    <main>
      <Container className="py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{t('title')}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-ink-soft">{t('related')}</span>
          {[...CATEGORY_KEYS, 'shortTermOk' as const].map((key) => {
            const active = filters.conditions?.includes(key) ?? false;
            return (
              <Link key={key} href={chipHref(key)} aria-pressed={active}
                className={`rounded-full border px-3 py-1 ${active ? 'border-accent bg-accent text-white' : 'border-line bg-white hover:border-accent'}`}>
                {active && <span aria-hidden className="mr-1">✓</span>}{tc(key)}{active && <span aria-hidden className="ml-1.5">×</span>}
              </Link>
            );
          })}
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            {/* Flows with the page (no nested scroll box); the action bar inside FilterPanel sticks to the viewport bottom. */}
            <div className="rounded-2xl border border-line bg-white p-5 pb-0">
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
              <div className="mt-5 space-y-4">
                {result.items.map((l) => <ListingRow key={l.code} listing={l} stations={stationMap} areas={areaMap} lines={lineMap} />)}
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
