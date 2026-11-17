import { describe, expect, it } from 'vitest';
import { JOBS } from '@/lib/data/mock/jobs';
import { jobPostingJsonLd } from './structured-data';

const office = JOBS.find((j) => j.slug === 'rental-agent')!;
const remote = JOBS.find((j) => j.remote)!;

describe('jobPostingJsonLd', () => {
  it('describes an office job for Google for Jobs in the page language', () => {
    const ld = jobPostingJsonLd(office, 'ja', { name: 'Kurashi Homes', url: 'https://example.com' });
    expect(ld).toMatchObject({
      '@context': 'https://schema.org', '@type': 'JobPosting',
      title: office.title.ja, datePosted: office.postedAt, employmentType: 'FULL_TIME',
      hiringOrganization: { '@type': 'Organization', name: 'Kurashi Homes', sameAs: 'https://example.com' },
      jobLocation: { '@type': 'Place', address: { addressRegion: 'Tokyo', addressCountry: 'JP' } },
    });
    expect(ld.description).toContain(office.duties[0].ja);
    expect(ld).not.toHaveProperty('jobLocationType');
  });
  it('marks remote jobs as telecommute within Japan', () => {
    const ld = jobPostingJsonLd(remote, 'en', { name: 'K', url: 'https://example.com' });
    expect(ld).toMatchObject({ employmentType: 'CONTRACTOR', jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'JP' } });
  });
});
