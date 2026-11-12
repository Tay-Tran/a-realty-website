import type { ListingStatus } from '../types';
import { JK_RECORDS_API, jkStatus } from './jk';
import { LEOPALACE_API, leopalaceStatus } from './leopalace';
import type { LeopalaceDetail } from './types';

/** Cache tag for every status request, so one call can force a fresh check. */
export const STATUS_TAG = 'source-status';
/** Seconds a status answer is reused before the source is asked again. */
export const STATUS_MAX_AGE = 1800;
const TIMEOUT_MS = 8000;

export interface LiveCheck { status: ListingStatus; checkedAt: string }

type Fetch = typeof fetch;

async function getJson(url: string, f: Fetch): Promise<{ body: unknown; checkedAt: string }> {
  const res = await f(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    next: { revalidate: STATUS_MAX_AGE, tags: [STATUS_TAG] },
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  // A cached answer keeps the source's Date header, i.e. when the source was really asked.
  const date = res.headers.get('date');
  return { body: await res.json(), checkedAt: date ? new Date(date).toISOString() : new Date().toISOString() };
}

/** Asks Leopalace21 for one room; null when the source cannot be reached. */
export async function checkLeopalace(propertyNo: string, f: Fetch = fetch): Promise<LiveCheck | null> {
  try {
    const { body, checkedAt } = await getJson(`${LEOPALACE_API}/properties/${propertyNo}?contractType=chintai&language=en`, f);
    return { status: leopalaceStatus(body as LeopalaceDetail), checkedAt };
  } catch {
    return null;
  }
}

interface JkPage { records: { $id: { value: string }; 申込の有無?: { value: string | null } }[]; totalCount: number; num: number }

/** Loads J&K's whole open-room list and reports each requested room; null when any page fails. */
export async function checkJk(ids: string[], f: Fetch = fetch): Promise<Map<string, LiveCheck> | null> {
  try {
    const first = await getJson(`${JK_RECORDS_API}/1`, f);
    const page1 = first.body as JkPage;
    const pageCount = Math.ceil(page1.totalCount / Math.max(1, page1.num));
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => getJson(`${JK_RECORDS_API}/${i + 2}`, f)),
    );
    const records = [page1, ...rest.map((p) => p.body as JkPage)].flatMap((p) => p.records);
    const checkedAt = [first, ...rest].map((p) => p.checkedAt).sort()[0];
    const byId = new Map(records.map((r) => [r.$id.value, r]));
    return new Map(ids.map((id) => {
      const r = byId.get(id);
      return [id, { status: jkStatus(r ? { 申込の有無: r.申込の有無?.value ?? null } : undefined), checkedAt }];
    }));
  } catch {
    return null;
  }
}
