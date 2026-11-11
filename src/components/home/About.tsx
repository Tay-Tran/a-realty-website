import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { ABOUT_IMAGE } from '@/components/search/constants';

// Copy and figures are placeholders for the demo; the client supplies the real ones.
export function About() {
  const t = useTranslations('home');
  return (
    <section id="about" className="scroll-mt-20 bg-white py-14">
      <Container className="grid items-center gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink/5">
          <Image src={ABOUT_IMAGE} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-sky">{t('aboutTitle')}</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{t('aboutSubtitle')}</h2>
          <p className="mt-4 text-ink-soft">{t('aboutText')}</p>
          <ul className="mt-5 space-y-2">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex gap-2"><span aria-hidden className="text-sky">✓</span>{t(`aboutPoint${n}`)}</li>
            ))}
          </ul>
        </div>
      </Container>
      <Container className="mt-12">
        <h3 className="text-center text-xl font-bold">{t('statsTitle')}</h3>
        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-2xl border border-line bg-paper px-2 py-4 text-center sm:p-6">
              <p className="text-2xl font-bold text-sky sm:text-4xl">{t(`stat${n}Value`)}</p>
              <p className="mt-1 text-xs text-ink-soft sm:text-sm">{t(`stat${n}Label`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-ink-soft">{t('statsNote')}</p>
      </Container>
    </section>
  );
}
