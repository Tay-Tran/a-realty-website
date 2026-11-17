import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { isLocale, requireLocale } from '@/i18n/locale';
import { getJobs } from '@/lib/data';
import { pickText } from '@/lib/listing/format';
import { buildAlternates } from '@/lib/seo';
import { ApplicationForm } from '@/components/careers/ApplicationForm';
import { JobMeta, formatPosted } from '@/components/careers/JobMeta';
import { Container } from '@/components/ui/Container';
import { WHY_ICONS } from '@/components/ui/feature-icons';

type Props = { params: Promise<{ locale: string }> };

const WHY = ['languages', 'support', 'growth'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'careers' });
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: buildAlternates(locale, '/careers') };
}

export default async function CareersPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('careers');
  const jobs = await getJobs();
  const positions = jobs.map((j) => ({ value: j.slug, label: pickText(j.title, locale) }));

  return (
    <main>
      <section className="border-b border-line bg-mist">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl font-bold text-ink sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">{t('subtitle')}</p>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {WHY.map((k) => {
              const Icon = WHY_ICONS[k];
              return (
                <li key={k} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-line">
                  <Icon className="h-6 w-6 shrink-0 text-sky" />
                  <div>
                    <p className="font-semibold">{t(`why.${k}.title`)}</p>
                    <p className="mt-0.5 text-sm text-ink-soft">{t(`why.${k}.text`)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <Container className="py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-2xl font-bold">{t('openingsTitle')}</h2>
          <p className="text-sm text-ink-soft">{t('openingsCount', { count: jobs.length })}</p>
        </div>
        {jobs.length === 0 ? (
          <p className="mt-6 rounded-2xl border border-line bg-white p-6 text-ink-soft">{t('empty')}</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {jobs.map((job) => (
              <li key={job.slug}>
                <Link href={`/careers/${job.slug}`}
                  className="group flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 transition hover:border-sky sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-ink group-hover:text-sky">{pickText(job.title, locale)}</p>
                    <p className="mt-1 text-sm text-ink-soft">{pickText(job.summary, locale)}</p>
                    <JobMeta job={job} className="mt-3" />
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <span className="text-xs text-ink-soft">{t('posted', { date: formatPosted(job.postedAt, locale) })}</span>
                    <span className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white group-hover:bg-accent-dark">{t('viewJob')}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <section id="apply" className="scroll-mt-20">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-white p-5 sm:p-8">
            <h2 className="text-2xl font-bold">{t('openApplyTitle')}</h2>
            <p className="mt-1 text-sm text-ink-soft">{t('openApplyText')}</p>
            <div className="mt-6"><ApplicationForm positions={positions} defaultPosition="open" /></div>
          </div>
        </Container>
      </section>
    </main>
  );
}
