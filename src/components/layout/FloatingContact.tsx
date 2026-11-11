import { useTranslations } from 'next-intl';
import { site } from '@/config/site';

/** Desktop-only floating contact buttons; mobile uses MobileContactBar. */
export function FloatingContact() {
  const t = useTranslations('contact');
  const items = [
    { href: site.contact.line, label: t('line'), className: 'bg-[#06c755]' },
    { href: site.contact.whatsapp, label: t('whatsapp'), className: 'bg-[#25d366]' },
    { href: site.contact.messenger, label: t('messenger'), className: 'bg-[#0084ff]' },
  ];
  return (
    <nav aria-label={t('chat')} className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-2 md:flex">
      {items.map((i) => (
        <a key={i.label} href={i.href} target="_blank" rel="noopener noreferrer"
          className={`rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 ${i.className}`}>
          {i.label}
        </a>
      ))}
    </nav>
  );
}
