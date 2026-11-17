import type { EmploymentType, Job, Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';

const EMPLOYMENT: Record<EmploymentType, string> = { fullTime: 'FULL_TIME', partTime: 'PART_TIME', contract: 'CONTRACTOR' };

/** schema.org JobPosting so open positions can show in Google's job search. */
export function jobPostingJsonLd(job: Job, locale: Locale, org: { name: string; url: string }) {
  const list = (items: Job['duties']) => items.map((i) => `<li>${pickText(i, locale)}</li>`).join('');
  const description = `<p>${pickText(job.summary, locale)}</p><ul>${list(job.duties)}</ul><ul>${list(job.requirements)}</ul><ul>${list(job.benefits)}</ul>`;
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: pickText(job.title, locale),
    description,
    datePosted: job.postedAt,
    employmentType: EMPLOYMENT[job.employment],
    hiringOrganization: { '@type': 'Organization', name: org.name, sameAs: org.url },
    ...(job.remote
      ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'JP' } }
      : { jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Shinjuku', addressRegion: 'Tokyo', addressCountry: 'JP' } } }),
  };
}
