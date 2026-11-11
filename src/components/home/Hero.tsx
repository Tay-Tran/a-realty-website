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
    <section className="relative isolate overflow-hidden bg-ink">
      <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-40" />
      <Container className="py-16 sm:py-24">
        <h1 className="max-w-2xl text-3xl font-bold text-white sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-xl text-white/85 sm:text-lg">{t('subtitle')}</p>
        <div className="mt-8"><SearchBox options={options} /></div>
      </Container>
    </section>
  );
}
