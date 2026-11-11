'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { site } from '@/config/site';

/* Simple channel glyphs drawn here (no external logo files). */
const LineGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
    <path fill="#fff" d="M12 3.5C6.8 3.5 2.8 6.9 2.8 11c0 3.7 3.2 6.8 7.6 7.4.4.1.6.3.6.6l-.2 1.4c0 .3.3.5.6.4 2.9-1.4 7.8-4.8 9.2-7.3.4-.8.6-1.6.6-2.5 0-4.1-4-7.5-9.2-7.5z" />
    <text x="12" y="12.9" textAnchor="middle" fontSize="5.6" fontWeight="800" fill="#06c755" fontFamily="Arial, sans-serif">LINE</text>
  </svg>
);
const WhatsAppGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="none" stroke="#fff" strokeWidth="1.8" d="M4.5 19.5l1-3.6A8 8 0 1 1 8.4 18.7z" strokeLinejoin="round" /><path fill="#fff" d="M9.3 8.3c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.1.5-.4.7-.5.3-1.2.5-1.8.3-2.5-.7-4.6-2.8-5.3-5.3-.2-.6 0-1.3.3-1.8z" /></svg>
);
const MessengerGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden><path fill="#fff" d="M12 3C6.9 3 3 6.7 3 11.4c0 2.5 1.1 4.6 2.8 6.1V21l3.1-1.7c.9.2 1.9.4 3.1.4 5.1 0 9-3.7 9-8.4S17.1 3 12 3z" /><path fill="#0084ff" d="M6.8 13.9l2.7-4.3c.4-.7 1.3-.8 1.9-.4l2.1 1.6c.2.2.5.2.7 0l2.9-2.2c.4-.3.9.2.6.6l-2.7 4.3c-.4.7-1.3.8-1.9.4l-2.1-1.6c-.2-.2-.5-.2-.7 0l-2.9 2.2c-.4.3-.9-.2-.6-.6z" /></svg>
);
const PhoneGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
const ChatGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.4 8.4 0 1 1 21 11.5z" /></svg>
);

/**
 * Floating contact widget like the reference site: a round chat button with a red dot,
 * and a stack of channel pills. Open by default on desktop, collapsed on phones.
 */
export function FloatingContact() {
  const t = useTranslations('contact');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(window.matchMedia('(min-width: 768px)').matches);
  }, []);

  const channels = [
    { href: site.contact.line, label: t('line'), icon: <LineGlyph />, bg: 'bg-[#06c755]', external: true },
    { href: site.contact.whatsapp, label: t('whatsapp'), icon: <WhatsAppGlyph />, bg: 'bg-[#25d366]', external: true },
    { href: site.contact.messenger, label: t('messenger'), icon: <MessengerGlyph />, bg: 'bg-[#0084ff]', external: true },
    { href: site.contact.phoneHref, label: t('call'), icon: <PhoneGlyph />, bg: 'bg-ink', external: false },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <ul id="contact-channels" className={`flex flex-col items-end gap-2.5 transition-all duration-200 ${open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'}`}
        aria-hidden={!open}>
        {channels.map((c) => (
          <li key={c.label}>
            <a href={c.href} tabIndex={open ? 0 : -1} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:shadow-xl">
              <span className={`grid h-9 w-9 place-items-center rounded-full ${c.bg}`}>{c.icon}</span>
              {c.label}
            </a>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="contact-channels" aria-label={t('chat')}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-accent text-white shadow-xl transition hover:scale-105 hover:bg-accent-dark sm:h-16 sm:w-16">
        <ChatGlyph />
        <span aria-hidden className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#ef4444]" />
      </button>
    </div>
  );
}
