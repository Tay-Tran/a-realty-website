import { NextResponse } from 'next/server';
import { getListingsByCodes, getStations } from '@/lib/data';

/** GET /api/listings?codes=A1001,A1002 – used by the favorites page. */
export async function GET(request: Request) {
  const codes = (new URL(request.url).searchParams.get('codes') ?? '')
    .split(',')
    .map((c) => c.trim())
    .filter((c) => /^[A-Za-z]\d{4}$/.test(c))
    .slice(0, 100);
  const [listings, stations] = await Promise.all([getListingsByCodes(codes), getStations()]);
  return NextResponse.json({ listings, stations });
}
