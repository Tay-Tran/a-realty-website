import { useTranslations } from 'next-intl';
import { site } from '@/config/site';

export function MobileContactBar() {
  const t = useTranslations('contact');
  const items = [
    { href: site.contact.line, label: t('line'), className: 'bg-[#06c755]' },
    { href: site.contact.whatsapp, label: t('whatsapp'), className: 'bg-[#25d366]' },
    { href: site.contact.messenger, label: t('messenger'), className: 'bg-[#0084ff]' },
    { href: site.contact.phoneHref, label: t('call'), className: 'bg-ink' },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 gap-1 border-t border-line bg-white p-1.5 md:hidden">
      {items.map((i) => (
        <a key={i.label} href={i.href} target={i.href.startsWith('tel:') ? undefined : '_blank'} rel="noopener noreferrer"
          className={`rounded-lg py-2.5 text-center text-xs font-semibold text-white ${i.className}`}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
