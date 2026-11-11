'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { site } from '@/config/site';
import { whatsappLink } from '@/lib/contact';

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
const SendGlyph = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M3.4 20.4 21 12 3.4 3.6 3 10l12 2-12 2z" /></svg>
);

type Message = { from: 'agent' | 'me'; text: string; time: string; channels?: boolean };

/**
 * Floating contact widget like the reference site. Closed: channel pills (desktop) above a
 * round chat button with a red dot. Open: a chat window; the button turns into a dark ✕.
 * The demo has no chat backend: a sent message gets an auto-reply that hands the visitor to
 * WhatsApp (message pre-filled), LINE or Messenger.
 */
export function FloatingContact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [chatOpen, setChatOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const [lastSent, setLastSent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const now = () =>
    new Intl.DateTimeFormat(locale === 'my' ? 'en' : locale, { hour: '2-digit', minute: '2-digit' }).format(new Date());

  useEffect(() => {
    if (!chatOpen) return;
    if (messages.length === 0) setMessages([{ from: 'agent', text: t('chatGreeting'), time: now() }]);
    requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setChatOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [chatOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  function send(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: 'me', text, time: now() }]);
    setLastSent(text);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: 'agent', text: t('chatReply'), time: now(), channels: true }]);
    }, 900);
  }

  const pills = [
    { href: site.contact.line, label: t('line'), icon: <LineGlyph />, bg: 'bg-[#06c755]', external: true },
    { href: site.contact.whatsapp, label: t('whatsapp'), icon: <WhatsAppGlyph />, bg: 'bg-[#25d366]', external: true },
    { href: site.contact.messenger, label: t('messenger'), icon: <MessengerGlyph />, bg: 'bg-[#0084ff]', external: true },
    { href: site.contact.phoneHref, label: t('call'), icon: <PhoneGlyph />, bg: 'bg-ink', external: false },
  ];
  const handoff = [
    { href: whatsappLink(site.contact.whatsapp, lastSent), label: t('whatsapp'), icon: <WhatsAppGlyph />, bg: 'bg-[#25d366]' },
    { href: site.contact.line, label: t('line'), icon: <LineGlyph />, bg: 'bg-[#06c755]' },
    { href: site.contact.messenger, label: t('messenger'), icon: <MessengerGlyph />, bg: 'bg-[#0084ff]' },
  ];

  return (
    <div className="fixed bottom-5 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {chatOpen ? (
        <section role="dialog" aria-label={site.name}
          className="fixed inset-x-3 bottom-24 flex h-[min(520px,70vh)] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 sm:static sm:inset-auto sm:h-[480px] sm:w-[360px]">
          <header className="flex items-center gap-3 bg-accent px-4 py-3 text-white">
            <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white bg-ink text-lg font-bold">
              暮<span aria-hidden className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#22c55e]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{site.name}</p>
              <p className="text-xs text-white/85">{t('chatOnline')}</p>
            </div>
            <button type="button" onClick={() => setChatOpen(false)} aria-label={t('chatClose')}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg hover:bg-white/30">✕</button>
          </header>

          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite">
            {messages.map((m, i) => m.from === 'agent' ? (
              <div key={i} className="flex gap-2">
                <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">暮</span>
                <div className="max-w-[85%]">
                  <p className="whitespace-pre-line rounded-2xl rounded-tl-sm bg-paper px-3.5 py-2.5 text-sm text-ink">{m.text}</p>
                  {m.channels && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {handoff.map((c) => (
                        <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-full border border-line bg-white py-1 pl-1 pr-3 text-xs font-semibold text-ink hover:border-accent">
                          <span className={`grid h-6 w-6 place-items-center rounded-full ${c.bg} [&>svg]:h-3.5 [&>svg]:w-3.5`}>{c.icon}</span>{c.label}
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-[11px] text-ink-soft">{m.time}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex flex-col items-end">
                <p className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-tr-sm bg-accent px-3.5 py-2.5 text-sm text-white">{m.text}</p>
                <p className="mt-1 text-[11px] text-ink-soft">{m.time}</p>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-xs text-ink-soft">
                <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-ink text-sm font-bold text-white">暮</span>
                <span className="rounded-2xl bg-paper px-3 py-2">{t('chatTyping')}</span>
              </div>
            )}
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
            <input ref={inputRef} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={t('chatPlaceholder')} aria-label={t('chatPlaceholder')}
              className="min-w-0 flex-1 rounded-full border border-line px-4 py-2.5 text-sm focus:border-accent focus:outline-none" />
            <button type="submit" aria-label={t('chatSend')} disabled={!draft.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-white hover:bg-accent-dark disabled:opacity-40">
              <SendGlyph />
            </button>
          </form>
        </section>
      ) : (
        <ul className="hidden flex-col items-end gap-2.5 md:flex">
          {pills.map((c) => (
            <li key={c.label}>
              <a href={c.href} {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center gap-3 rounded-full bg-white py-1.5 pl-1.5 pr-5 text-sm font-semibold text-ink shadow-lg ring-1 ring-black/5 transition hover:-translate-x-0.5 hover:shadow-xl">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${c.bg}`}>{c.icon}</span>
                {c.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={() => setChatOpen((o) => !o)} aria-expanded={chatOpen} aria-label={chatOpen ? t('chatClose') : t('chatOpen')}
        className={`relative grid h-14 w-14 place-items-center rounded-full text-white shadow-xl transition hover:scale-105 sm:h-16 sm:w-16 ${chatOpen ? 'bg-ink' : 'bg-accent hover:bg-accent-dark'}`}>
        {chatOpen ? <span aria-hidden className="text-2xl leading-none">✕</span> : <ChatGlyph />}
        {!chatOpen && <span aria-hidden className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full border-2 border-white bg-[#ef4444]" />}
      </button>
    </div>
  );
}
