import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { InquiryForm } from '@/components/forms/InquiryForm';

export function InquirySection() {
  const t = useTranslations('form');
  return (
    <section id="contact" className="scroll-mt-20 py-12">
      <Container className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="mt-2 text-ink-soft">{t('subtitle')}</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-6"><InquiryForm /></div>
      </Container>
    </section>
  );
}
