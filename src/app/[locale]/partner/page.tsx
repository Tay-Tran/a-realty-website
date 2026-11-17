import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { site } from '@/config/site';
import { isLocale, requireLocale } from '@/i18n/locale';
import { getFeaturedListings } from '@/lib/data';
import { buildAlternates } from '@/lib/seo';
import { PartnerForm } from '@/components/partner/PartnerForm';
import { Container } from '@/components/ui/Container';
import { PARTNER_ICONS } from '@/components/ui/feature-icons';

type Props = { params: Promise<{ locale: string }> };

// Layout follows arealty.jp/partner (agreed reference); wording and visuals are our own.
const DARK_TYPES = ['agency', 'school', 'company', 'individual'] as const;
const LIGHT_TYPES = ['broker', 'relocation', 'community', 'union'] as const;
const HERO_TAGS = ['agency', 'school', 'company', 'community', 'broker'] as const;
const BENEFITS = ['fee', 'scale', 'care', 'language', 'upfront'] as const;
const TIERS = [['fee', 'all'], ['manager', 'all'], ['materials', 'all'], ['rate', 'volume'], ['advisor', 'volume']] as const;
const STEPS = ['s1', 's2', 's3'] as const;
const CLIENT_STEPS = ['search', 'application', 'contract', 'movein'] as const;
const STATS = [['6+', 'statYears'], ['100+', 'statPartners'], ['3', 'statLanguages']] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: 'partner' });
  return { title: t('metaTitle'), description: t('metaDescription'), alternates: buildAlternates(locale, '/partner') };
}

/** "— Label" line above headings, as on the reference page. */
function Eyebrow({ children, tone = 'dark' }: { children: React.ReactNode; tone?: 'dark' | 'light' }) {
  return (
    <p className={`flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone === 'dark' ? 'text-glow' : 'text-sky'}`}>
      <span aria-hidden className={`h-px w-8 ${tone === 'dark' ? 'bg-glow/60' : 'bg-sky/60'}`} />{children}
    </p>
  );
}

/** Two-tone display heading: an italic first line and an upright accent line. */
function Display({ line1, accent, tone = 'dark', size = 'lg', as: Tag = 'h2' }: {
  line1: string; accent: string; tone?: 'dark' | 'light'; size?: 'xl' | 'lg' | 'md'; as?: 'h1' | 'h2' | 'h3';
}) {
  const sizes = { xl: 'display-hero text-5xl sm:text-7xl lg:text-8xl', lg: 'display-lg text-4xl sm:text-5xl lg:text-6xl', md: 'display-md text-3xl sm:text-4xl' };
  return (
    <Tag className={`font-display font-bold leading-[1.02] ${sizes[size]}`}>
      <span className={`display-it block ${tone === 'dark' ? 'text-white' : 'text-ink'}`}>{line1}</span>
      <span className={`block ${tone === 'dark' ? 'text-glow' : 'text-sky'}`}>{accent}</span>
    </Tag>
  );
}

export default async function PartnerPage({ params }: Props) {
  const locale = requireLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations('partner');
  const photos = (await getFeaturedListings(4)).map((l) => l.images[0]).filter(Boolean);
  const grid = { backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '64px 64px' };

  return (
    <main className="-mb-20">
      {/* 1. Hero */}
      <section className="relative overflow-hidden bg-night text-white" style={grid}>
        <Container className="relative z-10 pb-10 pt-14 sm:pt-20">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="display-hero mt-6 font-display text-5xl font-bold leading-[0.98] sm:text-7xl lg:text-[6.5rem]">
            <span className="display-it block">{t('heroLine1')}</span>
            <span className="display-it block">{t('heroLine2')}</span>
            <span className="block text-glow">{t('heroAccent')}</span>
          </h1>
          <p className="mt-8 max-w-xl leading-relaxed text-white/70">{t('heroText')}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#apply" className="inline-flex items-center gap-2 bg-sky px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-accent">
              {t('ctaApply')} <span aria-hidden>→</span>
            </a>
            <a href="#benefits" className="border border-white/20 px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/80 hover:border-white/50">
              {t('ctaBenefits')}
            </a>
          </div>
          <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-sm text-white/45">
            {HERO_TAGS.map((k) => <li key={k}>{t(`types.${k}.title`)}</li>)}
          </ul>
        </Container>
        <p aria-hidden className="pointer-events-none absolute -bottom-6 right-0 select-none font-display text-[22vw] font-extrabold leading-none text-white/[0.035] sm:-bottom-10">
          {t('watermark')}
        </p>
      </section>

      {/* 2. Who we work with */}
      <section className="bg-mist py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow tone="light">{t('whoEyebrow')}</Eyebrow>
              <div className="mt-5"><Display line1={t('whoLine1')} accent={t('whoAccent')} tone="light" /></div>
            </div>
            <p className="leading-relaxed text-ink-soft">{t('whoText')}</p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...DARK_TYPES, ...LIGHT_TYPES].map((k, i) => {
              const Icon = PARTNER_ICONS[k];
              const dark = i < DARK_TYPES.length;
              return (
                <li key={k} className={`rounded-2xl p-6 ${dark ? 'bg-deep text-white' : 'border border-line bg-white text-ink'}`}>
                  <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-lg ${dark ? 'bg-white/10 text-glow' : 'bg-tint text-sky'}`}><Icon className="h-5 w-5" /></span>
                  <h3 className="mt-6 text-lg font-semibold">{t(`types.${k}.title`)}</h3>
                  <ul className={`mt-3 space-y-2.5 text-sm leading-relaxed ${dark ? 'text-white/70' : 'text-ink-soft'}`}>
                    {(['b1', 'b2', 'b3'] as const).map((b) => (
                      <li key={b} className="flex gap-2.5"><span aria-hidden className={dark ? 'text-glow' : 'text-sky'}>→</span>{t(`types.${k}.${b}`)}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* 3. Photos */}
      {photos.length >= 4 && (
        <section className="bg-deep py-16 sm:py-20">
          <Container>
            <Eyebrow>{t('photosEyebrow')}</Eyebrow>
            <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4">
              {photos.slice(0, 4).map((src) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image src={src} alt="" fill sizes="(min-width: 1024px) 500px, 50vw" className="object-cover" />
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 4. Benefits */}
      <section id="benefits" className="relative scroll-mt-16 overflow-hidden bg-night py-16 text-white sm:py-24">
        <p aria-hidden className="display-it pointer-events-none absolute -top-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display text-[17vw] font-extrabold leading-none text-white/[0.035]">
          {t('watermarkBenefits')}
        </p>
        <Container className="relative">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow>{t('benefitsEyebrow')}</Eyebrow>
              <div className="mt-5"><Display line1={t('benefitsLine1')} accent={t('benefitsAccent')} /></div>
            </div>
            <div>
              <p className="leading-relaxed text-white/65">{t('benefitsText')}</p>
              <a href="#apply" className="mt-6 inline-flex items-center gap-2 bg-sky px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-accent">
                {t('benefitsCta')} <span aria-hidden>→</span>
              </a>
            </div>
          </div>
          <ol className="mt-14 border-b border-white/10">
            {BENEFITS.map((k, i) => (
              <li key={k} className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-[90px_minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-center md:gap-8">
                <span aria-hidden className="display-it font-display text-5xl font-bold text-white/25 md:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className={`font-display text-2xl font-bold leading-snug sm:text-3xl ${i % 2 ? 'text-glow' : 'display-it text-white'}`}>{t(`benefits.${k}.title`)}</h3>
                <p className="leading-relaxed text-white/65">{t(`benefits.${k}.text`)}</p>
                <span className="w-fit border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-glow">{t(`benefits.${k}.tag`)}</span>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-10 border border-white/10 bg-white/[0.03] p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-glow">{t('scaleEyebrow')}</p>
              <div className="mt-4"><Display line1={t('scaleLine1')} accent={t('scaleAccent')} size="md" as="h3" /></div>
              <p className="mt-4 leading-relaxed text-white/65">{t('scaleText')}</p>
            </div>
            <ul className="space-y-3">
              {TIERS.map(([k, tier]) => (
                <li key={k} className="flex items-center justify-between gap-4 border border-white/10 bg-white/[0.04] px-5 py-3.5">
                  <span className="flex items-center gap-3 text-sm text-white"><span aria-hidden className={`h-2 w-2 rounded-full ${tier === 'all' ? 'bg-glow' : 'bg-white/70'}`} />{t(`tiers.${k}`)}</span>
                  <span className="shrink-0 text-xs text-white/50">{t(tier === 'all' ? 'tierAll' : 'tierVolume')}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-4 text-xs text-white/40">{t('benefitsNote')}</p>
        </Container>
      </section>

      {/* 5. How it works */}
      <section className="bg-mist py-16 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <Eyebrow tone="light">{t('stepsEyebrow')}</Eyebrow>
              <div className="mt-5"><Display line1={t('stepsLine1')} accent={t('stepsAccent')} tone="light" /></div>
            </div>
            <p className="leading-relaxed text-ink-soft">{t('stepsText')}</p>
          </div>
          <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
            {STEPS.map((k, i) => (
              <li key={k} className="md:px-8 md:first:pl-0">
                <span aria-hidden className="display-it font-display text-7xl font-bold text-sky/15">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{t(`steps.${k}.title`)}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{t(`steps.${k}.text`)}</p>
                <a href="#apply" className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky hover:underline">
                  <span aria-hidden>→</span>{t(`steps.${k}.link`)}
                </a>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 6. What we do for your clients */}
      <section className="bg-deep py-16 text-white sm:py-24">
        <Container>
          <Eyebrow>{t('clientsEyebrow')}</Eyebrow>
          <div className="mt-5"><Display line1={t('clientsLine1')} accent={t('clientsAccent')} /></div>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {CLIENT_STEPS.map((k, i) => (
              <li key={k} className="lg:border-l lg:border-white/10 lg:px-6 lg:first:border-l-0 lg:first:pl-0">
                <span aria-hidden className="block h-0.5 w-8 bg-glow" />
                <span className="display-it mt-6 block font-display text-sm font-bold text-glow">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 text-lg font-semibold">{t(`clients.${k}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{t(`clients.${k}.text`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 7. Partner contact */}
      <section className="bg-mist py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="text-center">
            <div className="mx-auto grid aspect-square max-w-md place-items-center rounded-3xl border-2 border-dashed border-sky/25 bg-white">
              <div>
                <span aria-hidden className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-tint font-display text-3xl font-bold text-sky">{site.name.slice(0, 1)}</span>
                <p className="mx-auto mt-4 max-w-[16rem] text-sm text-ink-soft">{t('managerPhoto')}</p>
              </div>
            </div>
            <p className="display-it mt-6 font-display text-3xl font-bold text-ink">{t('managerName')}</p>
          </div>
          <div>
            <Eyebrow tone="light">{t('managerEyebrow')}</Eyebrow>
            <div className="mt-5"><Display line1={t('managerLine1')} accent={t('managerAccent')} tone="light" size="md" /></div>
            <blockquote className="display-it mt-8 border-l-2 border-sky pl-6 font-display text-xl leading-relaxed text-ink-soft">{t('managerQuote')}</blockquote>
            <p className="mt-6 leading-relaxed text-ink-soft">{t('managerBio')}</p>
            <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
              {STATS.map(([value, key]) => (
                <div key={key}>
                  <dt className="sr-only">{t(key)}</dt>
                  <dd className="font-display text-3xl font-bold text-ink sm:text-4xl">{value}</dd>
                  <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-soft">{t(key)}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 text-xs text-ink-soft">{t('statsNote')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#apply" className="inline-flex items-center gap-2 bg-sky px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-accent">
                {t('ctaApply')} <span aria-hidden>→</span>
              </a>
              <a href={`mailto:${site.contact.email}`} className="border border-line bg-white px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-ink hover:border-sky">
                {t('ctaEmail')}
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. Partner logos (placeholders until the company supplies real ones) */}
      <section className="bg-white py-16 sm:py-20">
        <Container className="text-center">
          <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky">
            <span aria-hidden className="h-px w-8 bg-sky/60" />{t('logosEyebrow')}<span aria-hidden className="h-px w-8 bg-sky/60" />
          </p>
          <h2 className="display-it mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">{t('logosTitle')}</h2>
          <p className="mt-3 text-ink-soft">{t('logosText')}</p>
          <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="grid h-16 place-items-center rounded-lg border border-dashed border-line text-xs text-ink-soft">{t('logoPlaceholder')}</li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 9. Application form + direct contact */}
      <section id="apply" className="scroll-mt-16 bg-night text-white">
        <Container className="grid lg:grid-cols-2 lg:divide-x lg:divide-white/10">
          <div className="py-16 sm:py-20 lg:pr-12">
            <Eyebrow>{t('formEyebrow')}</Eyebrow>
            <div className="mt-5"><Display line1={t('formLine1')} accent={t('formAccent')} size="md" /></div>
            <p className="mt-4 max-w-lg leading-relaxed text-white/65">{t('formSubtitle')}</p>
            <div className="mt-10"><PartnerForm /></div>
          </div>
          <div className="border-t border-white/10 py-16 sm:py-20 lg:border-t-0 lg:pl-12">
            <Eyebrow>{t('talkEyebrow')}</Eyebrow>
            <div className="mt-5"><Display line1={t('talkLine1')} accent={t('talkAccent')} size="md" /></div>
            <p className="mt-4 max-w-md leading-relaxed text-white/65">{t('talkText')}</p>
            <dl className="mt-10 space-y-6">
              <div className="border-l border-glow/40 pl-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-glow">{t('emailLabel')}</dt>
                <dd className="mt-1"><a href={`mailto:${site.contact.email}`} className="text-lg hover:underline">{site.contact.email}</a></dd>
                <dd className="mt-0.5 text-xs text-white/45">{t('emailNote')}</dd>
              </div>
              <div className="border-l border-glow/40 pl-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-glow">{t('chatLabel')}</dt>
                <dd className="mt-1 flex flex-wrap gap-x-4 text-lg">
                  <a href={site.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:underline">WhatsApp</a>
                  <a href={site.contact.line} target="_blank" rel="noopener noreferrer" className="hover:underline">LINE {site.contact.lineId}</a>
                </dd>
                <dd className="mt-0.5 text-xs text-white/45">{t('chatNote')}</dd>
              </div>
              <div className="border-l border-glow/40 pl-5">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-glow">{t('officeLabel')}</dt>
                <dd className="mt-1 text-lg">{t('officeValue')}</dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-2">
              {[['LINE', site.contact.line], ['WhatsApp', site.contact.whatsapp], ['Messenger', site.contact.messenger]].map(([name, href]) => (
                <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                  className="border border-white/15 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70 hover:border-white/40 hover:text-white">{name}</a>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
