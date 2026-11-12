import type { Listing, ListingStatus } from '../types';
import { mapJk } from './jk';
import { mapLeopalace } from './leopalace';
import { checkJk, checkLeopalace, type LiveCheck } from './live';
import rawSnapshot from './snapshot.json';
import type { Snapshot } from './types';

// Rooms pulled from outside sites for the demo. Run `node scripts/fetch-source-snapshot.mjs` to refresh
// snapshot.json; the room's status is then checked live against the source (see live.ts).

const snapshot = rawSnapshot as Snapshot;

export const SNAPSHOT_FETCHED_AT = snapshot.fetchedAt;

export function buildSourceListings(s: Snapshot): Listing[] {
  const day = s.fetchedAt.slice(0, 10);
  return [
    ...s.leopalace.map((room, i) => mapLeopalace(room, `L${5001 + i}`, day, i === 0)),
    ...s.jk.map((room, i) => mapJk(room, `J${6001 + i}`, day, i === 0)),
  ];
}

/** Source rooms as of the snapshot, without asking the sources again. */
export const SOURCE_LISTINGS: Listing[] = buildSourceListings(snapshot);

export interface SourceState {
  listing: Listing;
  /** Status when the snapshot was taken. */
  snapshotStatus: ListingStatus;
  /** Latest answer from the source; null when it could not be reached (the snapshot status is kept). */
  live: LiveCheck | null;
}

export async function getSourceStates(): Promise<SourceState[]> {
  const jkIds = SOURCE_LISTINGS.filter((l) => l.source?.name === 'jk').map((l) => l.source!.id);
  const [leo, jk] = await Promise.all([
    Promise.all(SOURCE_LISTINGS.map((l) => (l.source?.name === 'leopalace21' ? checkLeopalace(l.source.id) : null))),
    jkIds.length ? checkJk(jkIds) : null,
  ]);
  return SOURCE_LISTINGS.map((listing, i) => ({
    listing,
    snapshotStatus: listing.status,
    live: listing.source?.name === 'jk' ? jk?.get(listing.source.id) ?? null : leo[i],
  }));
}

/** Source rooms with their latest known status. */
export async function getSourceListings(): Promise<Listing[]> {
  return (await getSourceStates()).map(({ listing, live }) => (live ? { ...listing, status: live.status } : listing));
}
