import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { site } from '@/config/site';
import { Link } from '@/i18n/navigation';
import { isLocale, requireLocale } from '@/i18n/locale';
import { jobPostingJsonLd } from '@/lib/careers/structured-data';
import { getJob, getJobs } from '@/lib/data';
import type { Job, Locale } from '@/lib/data/types';
import { pickText } from '@/lib/listing/format';
import { buildAlternates } from '@/lib/seo';
import { ApplicationForm } from '@/components/careers/ApplicationForm';
import { JobMeta, formatPosted } from '@/components/careers/JobMeta';
import { Container } from '@/components/ui/Container';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return (await getJobs()).map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const job = await getJob(slug);
  if (!job || !isLocale(locale)) return {};
  return {
    title: pickText(job.title, locale),
    description: pickText(job.summary, locale),
    alternates: buildAlternates(locale, `/careers/${job.slug}`),
  };
}

function Section({ title, items, locale }: { title: string; items: Job['duties']; locale: Locale }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-8">
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="mt-3 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2"><span aria-hidden className="text-sky">✓</span><span>{pickText(item, locale)}</span></li>
        ))}
      </ul>
    </section>
  );
}

export default async function JobPage({ params }: Props) {
  const { locale: raw, slug } = await params;
  const locale = requireLocale(raw);
  setRequestLocale(locale);
  const job = await getJob(slug);
  if (!job) notFound();
  const t = await getTranslations('careers');
  const jobs = await getJobs();
  const positions = jobs.map((j) => ({ value: j.slug, label: pickText(j.title, locale) }));
  const others = jobs.filter((j) => j.slug !== job.slug);
  const jsonLd = jobPostingJsonLd(job, locale, { name: site.name, url: site.url });

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="border-b border-line bg-mist">
        <Container className="py-8 sm:py-10">
          <Link href="/careers" className="text-sm text-sky hover:underline">‹ {t('back')}</Link>
          <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{pickText(job.title, locale)}</h1>
          <JobMeta job={job} className="mt-3" />
          <p className="mt-2 text-xs text-ink-soft">{t('posted', { date: formatPosted(job.postedAt, locale) })}</p>
          <a href="#apply" className="mt-5 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark lg:hidden">{t('applyNow')}</a>
        </Container>
      </section>

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <article className="min-w-0 text-ink">
          <p className="text-lg text-ink-soft">{pickText(job.summary, locale)}</p>
          <Section title={t('duties')} items={job.duties} locale={locale} />
          <Section title={t('requirements')} items={job.requirements} locale={locale} />
          <Section title={t('benefits')} items={job.benefits} locale={locale} />
        </article>

        <aside id="apply" className="scroll-mt-20 lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-3xl border border-line bg-white p-5 sm:p-6">
            <h2 className="text-xl font-bold">{t('applyTitle')}</h2>
            <div className="mt-4"><ApplicationForm positions={positions} defaultPosition={job.slug} /></div>
          </div>
        </aside>
      </Container>

      {others.length > 0 && (
        <Container className="pb-4">
          <h2 className="text-xl font-bold">{t('related')}</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/careers/${o.slug}`} className="group block rounded-2xl border border-line bg-white p-5 hover:border-sky">
                  <p className="font-semibold text-ink group-hover:text-sky">{pickText(o.title, locale)}</p>
                  <JobMeta job={o} className="mt-2" />
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}
    </main>
  );
}
