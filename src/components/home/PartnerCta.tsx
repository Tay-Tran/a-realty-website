import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Container } from '@/components/ui/Container';

export function PartnerCta() {
  const t = useTranslations('home');
  return (
    <section className="py-14">
      <Container>
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-ink px-6 py-10 text-center text-white">
          <h2 className="text-2xl font-bold">{t('partnerTitle')}</h2>
          <p className="max-w-xl text-white/80">{t('partnerText')}</p>
          <Link href={{ pathname: '/', hash: 'contact' }} className="rounded-full bg-white px-6 py-3 font-semibold text-accent hover:bg-tint">
            {t('partnerCta')}
          </Link>
        </div>
      </Container>
    </section>
  );
}
