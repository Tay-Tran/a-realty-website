'use server';

import { updateTag } from 'next/cache';
import { STATUS_TAG } from '@/lib/data/sources/live';

const MIN_GAP_MS = 60_000;
let lastRecheck = 0;

/** Drops the cached status answers so the page asks Leopalace21 and J&K again (at most once a minute). */
export async function recheckSources(): Promise<void> {
  const now = Date.now();
  if (now - lastRecheck < MIN_GAP_MS) return;
  lastRecheck = now;
  updateTag(STATUS_TAG);
}
