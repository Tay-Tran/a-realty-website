import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, permanentRedirect } from '@/i18n/navigation';
import { getAreas, getListing, getListingRefs, getSimilarListings, getStations } from '@/lib/data';
import { isLocale, requireLocale } from '@/i18n/locale';
import { pickText } from '@/lib/listing/format';
import { codeFromSlug, listingPath } from '@/lib/listing/paths';
import { buildAlternates } from '@/lib/seo';
import { Amenities } from '@/components/listing/Amenities';
import { Details } from '@/components/listing/Details';
import { FavoriteButton } from '@/components/listing/FavoriteButton';
import { FloorPlan } from '@/components/listing/FloorPlan';
import { Gallery } from '@/components/listing/Gallery';
import { InquiryBlock } from '@/components/listing/InquiryBlock';
import { MapEmbed } from '@/components/listing/MapEmbed';
import { Overview } from '@/components/listing/Overview';
import { SimilarListings } from '@/components/listing/SimilarListings';
import { SourceLine } from '@/components/listing/SourceTag';
import { StatusBadge } from '@/components/listing/StatusBadge';
import { SummaryBar } from '@/components/listing/SummaryBar';
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
  if (!listing || !isLocale(locale)) return {};
  const l = locale;
  return {
    title: pickText(listing.title, l),
    description: pickText(listing.description, l).slice(0, 155),
    alternates: buildAlternates(l, listingPath(listing)),
    openGraph: { images: [listing.images[0]] },
  };
}

export default async function ListingPage({ params }: Props) {
  const { area, slug } = await params;
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const listing = await load(slug);
  if (!listing) notFound();
  if (listing.areaSlug !== area || listing.slug !== slug) {
    permanentRedirect({ href: listingPath(listing), locale });
  }

  const l = locale;
  const [t, similar, stations, areas] = await Promise.all([
    getTranslations(),
    getSimilarListings(listing, 4),
    getStations(),
    getAreas(),
  ]);
  const stationMap = Object.fromEntries(stations.map((s) => [s.slug, s]));
  const areaObj = areas.find((a) => a.slug === listing.areaSlug);
  const title = pickText(listing.title, l);
  const rented = listing.status === 'rented';

  return (
    <main>
      <Container className="pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-ink-soft">
          <Link href="/rent" className="hover:text-ink">{t('nav.findRoom')}</Link>
          {' › '}
          <Link href={`/rent?area=${listing.areaSlug}`} className="hover:text-ink">{areaObj ? pickText(areaObj.name, l) : listing.areaSlug}</Link>
          {' › '}
          <span className="text-ink">{t('common.code', { code: listing.code })}</span>
        </nav>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <StatusBadge status={listing.status} />
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
          </div>
          <FavoriteButton code={listing.code} withLabel />
        </div>
        {listing.source && <SourceLine source={listing.source} />}
        <div className="mt-4">
          <Gallery images={listing.images} alt={title} floorPlan={
            listing.floorPlan
              ? <Image src={listing.floorPlan} alt={t('floorPlan.title')} width={600} height={800} className="h-full max-h-[70vh] w-full object-contain" />
              : <FloorPlan layout={listing.layout} className="h-full max-h-[70vh] w-full" />
          } />
        </div>
      </Container>

      <div className="mt-6"><SummaryBar listing={listing} area={areaObj} /></div>

      <Container className="space-y-6 py-6">
        {listing.status === 'applied' && <p className="rounded-xl bg-warn/10 p-3 text-sm text-warn">{t('status.appliedNote')}</p>}
        {rented && <p className="rounded-xl bg-ink/10 p-3 text-sm text-ink">{t('status.rentedNote')}</p>}
        {rented && <SimilarListings listings={similar} stations={stationMap} />}
        <p className="text-ink-soft">{pickText(listing.description, l)}</p>
        <Overview listing={listing} stations={stationMap} />
        <Amenities listing={listing} />
        <Details listing={listing} />
        <MapEmbed address={listing.address} />
        {!rented && <InquiryBlock code={listing.code} />}
        {!rented && <SimilarListings listings={similar} stations={stationMap} />}
      </Container>
    </main>
  );
}
