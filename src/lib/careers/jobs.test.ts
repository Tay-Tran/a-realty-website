import { describe, expect, it } from 'vitest';
import { getJob, getJobs } from '@/lib/data';
import { LOCALES } from '@/lib/data/types';

describe('jobs', () => {
  it('lists only open jobs, newest first', async () => {
    const jobs = await getJobs();
    expect(jobs.length).toBeGreaterThan(0);
    expect(jobs.every((j) => j.open)).toBe(true);
    const dates = jobs.map((j) => j.postedAt);
    expect([...dates].sort().reverse()).toEqual(dates);
  });
  it('finds a job by slug and hides closed or unknown ones', async () => {
    const [first] = await getJobs();
    expect((await getJob(first.slug))?.slug).toBe(first.slug);
    expect(await getJob('no-such-job')).toBeNull();
  });
  it('has every text in all three languages', async () => {
    for (const job of await getJobs()) {
      for (const text of [job.title, job.location, job.salary, job.summary, ...job.duties, ...job.requirements, ...job.benefits]) {
        for (const l of LOCALES) expect(text[l], `${job.slug} ${l}`).toBeTruthy();
      }
    }
  });
});
