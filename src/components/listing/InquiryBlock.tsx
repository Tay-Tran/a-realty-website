import { useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { InquiryForm } from '@/components/forms/InquiryForm';
import { PhoneIcon } from '@/components/ui/icons';

export function InquiryBlock({ code }: { code: string }) {
  const t = useTranslations();
  const contact = [
    { href: site.contact.line, label: t('contact.line'), className: 'bg-[#06c755]' },
    { href: site.contact.whatsapp, label: t('contact.whatsapp'), className: 'bg-[#25d366]' },
    { href: site.contact.messenger, label: t('contact.messenger'), className: 'bg-[#0084ff]' },
  ];
  return (
    <section id="inquiry" className="scroll-mt-48 grid gap-6 rounded-2xl border border-line bg-white p-5 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="text-xl font-bold">{t('listing.inquire')}</h2>
        <p className="mt-1 text-sm text-ink-soft">{t('form.subtitle')}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {contact.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
              className={`rounded-lg py-2.5 text-center text-xs font-semibold text-white ${c.className}`}>{c.label}</a>
          ))}
        </div>
        <a href={site.contact.phoneHref} className="mt-2 flex items-center justify-center gap-2 rounded-lg border border-line py-2.5 text-sm hover:border-accent">
          <PhoneIcon className="h-4 w-4 text-accent" />{site.contact.phoneDisplay}
        </a>
      </div>
      <InquiryForm listingCode={code} />
    </section>
  );
}
