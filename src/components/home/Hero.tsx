import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { SearchOptions } from '@/lib/data/search-options';
import { Container } from '@/components/ui/Container';
import { SearchBox } from '@/components/search/SearchBox';

// Unsplash (free license), checked by eye on 2026-11-11: Tokyo street at night.
const HERO_IMAGE = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=2000&q=70&auto=format&fit=crop';

export function Hero({ options }: { options: SearchOptions }) {
  const t = useTranslations('hero');
  return (
    // No overflow-hidden: it made the hero a hidden scroll container, so focusing inside the
    // Details popover scrolled the background up. z-10 keeps the popover above the next section.
    <section className="relative isolate z-10 bg-ink">
      <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
      <Container className="py-14 text-center sm:py-20">
        <h1 className="mx-auto max-w-3xl text-3xl font-bold text-white sm:text-5xl">{t('title')}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/85 sm:text-lg">{t('subtitle')}</p>
        <div className="mx-auto mt-8 max-w-4xl"><SearchBox options={options} /></div>
      </Container>
    </section>
  );
}
