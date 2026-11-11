import { useTranslations } from 'next-intl';
import { Container } from '@/components/ui/Container';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { CategoryTiles } from './CategoryTiles';

/** Category photo tiles beside the inquiry form, as on the reference layout. */
export function CategoriesAndContact() {
  const t = useTranslations('form');
  return (
    <section className="py-14">
      <Container className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <CategoryTiles />
        <div id="contact" className="scroll-mt-24 self-start rounded-3xl border border-line bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <p className="mt-1 text-sm text-ink-soft">{t('subtitle')}</p>
          <div className="mt-5"><InquiryForm /></div>
        </div>
      </Container>
    </section>
  );
}
