import type { Listing } from '@/lib/data/types';

export function listingPath(listing: Pick<Listing, 'areaSlug' | 'slug'>): string {
  return `/rent/${listing.areaSlug}/${listing.slug}`;
}

export function codeFromSlug(slug: string): string | null {
  const match = /(?:^|-)([a-z]\d{4})$/i.exec(slug);
  return match ? match[1].toUpperCase() : null;
}
