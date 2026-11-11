import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, permanentRedirect } from '@/i18n/navigation';
import { getAreas, getListing, getListingRefs, getSimilarListings, getStations } from '@/lib/data';
import type { Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { codeFromSlug, listingPath } from '@/lib/listing/paths';
import { buildAlternates } from '@/lib/seo';
import { ConditionBadges } from '@/components/listing/ConditionBadges';
import { Gallery } from '@/components/listing/Gallery';
import { InitialCostTable } from '@/components/listing/InitialCostTable';
import { KeyFacts } from '@/components/listing/KeyFacts';
import { MapEmbed } from '@/components/listing/MapEmbed';
import { PriceCard } from '@/components/listing/PriceCard';
import { SimilarListings } from '@/components/listing/SimilarListings';
import { StatusBadge } from '@/components/listing/StatusBadge';
import { Container } from '@/components/ui/Container';

type Props = { params: Promise<{ locale: string; area: string; slug: string }> };

async function load(slug: string) {
  const code = codeFromSlug(slug);
  return code ? getListing(code) : null;
}

export async function generateStaticParams() {
  return (await getListingRefs()).map(({ areaSlug, slug }) => ({ area: areaSlug, slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const listing = await load(slug);
  if (!listing) return {};
  const l = locale as Locale;
  return {
    title: pickText(listing.title, l),
    description: pickText(listing.description, l).slice(0, 155),
    alternates: buildAlternates(l, listingPath(listing)),
    openGraph: { images: [listing.images[0]] },
  };
}

export default async function ListingPage({ params }: Props) {
  const { locale, area, slug } = await params;
  setRequestLocale(locale);
  const listing = await load(slug);
  if (!listing) notFound();
  if (listing.areaSlug !== area || listing.slug !== slug) {
    permanentRedirect({ href: listingPath(listing), locale });
  }

  const l = locale as Locale;
  const [t, similar, stations, areas] = await Promise.all([
    getTranslations(),
    getSimilarListings(listing, 4),
    getStations(),
    getAreas(),
  ]);
  const stationMap = Object.fromEntries(stations.map((s) => [s.slug, s]));
  const areaName = areas.find((a) => a.slug === listing.areaSlug);
  const title = pickText(listing.title, l);

  return (
    <main>
      <Container className="py-6">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/rent" className="hover:text-ink">{t('nav.findRoom')}</Link>
          {' › '}
          <Link href={`/rent?area=${listing.areaSlug}`} className="hover:text-ink">{areaName ? pickText(areaName.name, l) : listing.areaSlug}</Link>
          {' › '}
          <span className="text-ink">{t('common.code', { code: listing.code })}</span>
        </nav>

        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <Gallery images={listing.images} alt={title} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={listing.status} />
                <span className="text-sm text-ink-soft">{t('common.code', { code: listing.code })}</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
              {listing.status === 'applied' && <p className="mt-3 rounded-xl bg-warn/10 p-3 text-sm text-warn">{t('status.appliedNote')}</p>}
              {listing.status === 'rented' && <p className="mt-3 rounded-xl bg-ink/10 p-3 text-sm text-ink">{t('status.rentedNote')}</p>}
              <p className="mt-4 text-ink-soft">{pickText(listing.description, l)}</p>
            </div>
            {listing.status === 'rented' && <SimilarListings listings={similar} stations={stationMap} />}
            <KeyFacts listing={listing} stations={stationMap} />
            <InitialCostTable listing={listing} />
            <ConditionBadges listing={listing} />
            <MapEmbed address={listing.address} />
          </div>
          <aside>
            <div className="lg:sticky lg:top-24"><PriceCard listing={listing} /></div>
          </aside>
        </div>

        {listing.status !== 'rented' && <div className="mt-12"><SimilarListings listings={similar} stations={stationMap} /></div>}
      </Container>
    </main>
  );
}
