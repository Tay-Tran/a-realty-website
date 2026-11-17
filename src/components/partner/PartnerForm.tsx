'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { PARTNER_TYPES, PARTNER_VOLUMES, validatePartner, type PartnerInput } from '@/lib/forms/partner';
import { Picker } from '@/components/ui/Picker';

type Errors = Partial<Record<keyof PartnerInput, 'required' | 'invalidEmail'>>;

/**
 * Partner / collaborator sign-up, styled for the dark application section of the partner page.
 * Demo: validates and shows the thank-you message; in production it emails the team and lists
 * the application in the CMS ("Partners").
 */
export function PartnerForm() {
  const t = useTranslations('partner');
  const tf = useTranslations('form');
  const [type, setType] = useState('');
  const [volume, setVolume] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The form shrinks to a thank-you line; bring it into view so the visitor sees it.
  useEffect(() => {
    if (status !== 'sent') return;
    doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    doneRef.current?.focus({ preventScroll: true });
  }, [status]);

  const clear = (k: string) => setErrors((e) => (k in e ? Object.fromEntries(Object.entries(e).filter(([key]) => key !== k)) : e));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? '');
    const input: PartnerInput = {
      organization: value('organization'), contact: value('contact'), email: value('email'),
      phone: value('phone'), type, volume, network: value('network'),
    };
    const result = validatePartner(input);
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors({});
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 600));
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <p ref={doneRef} role="status" tabIndex={-1}
        className="scroll-mt-24 border border-glow/30 bg-glow/10 p-4 text-sm text-glow focus:outline-none">{t('success')}</p>
    );
  }

  const label = 'block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60';
  const field = 'mt-2 w-full rounded-none border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/30 focus:border-glow focus:outline-none';
  const plain = 'font-normal normal-case tracking-normal';
  const error = (k: keyof Errors) => errors[k] && <p className={`mt-1 text-xs text-[#ffb4b4] ${plain}`}>{tf(errors[k]!)}</p>;
  const individual = type === 'individual';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5" onInput={(e) => clear((e.target as HTMLInputElement).name)}>
      <div className="grid gap-5 sm:grid-cols-2">
        {!individual && (
          <label className={label}>{t('organization')} *
            <input name="organization" autoComplete="organization" className={field} />
            {errors.organization ? error('organization') : <span className={`mt-1 block text-xs text-white/40 ${plain}`}>{t('organizationHint')}</span>}
          </label>
        )}
        <label className={label}>{t('contact')} *<input name="contact" autoComplete="name" className={field} />{error('contact')}</label>
        <label className={label}>{t('email')} *<input name="email" type="email" autoComplete="email" className={field} />{error('email')}</label>
        <label className={label}>{t('phone')} *<input name="phone" type="tel" autoComplete="tel" className={field} />{error('phone')}</label>
      </div>
      <div className={label}>
        <span>{t('type')} *</span>
        <div className={`mt-2 ${plain}`}>
          <Picker name="type" tone="dark" allowEmpty={false} label={t('type')} placeholder={t('typePlaceholder')} value={type}
            onChange={(v) => { setType(v); clear('type'); clear('organization'); }}
            options={PARTNER_TYPES.map((k) => ({ value: k, label: t(`types.${k}.title`) }))} />
        </div>
        {error('type')}
      </div>
      <div className={label}>
        <span>{t('volume')} *</span>
        <div className={`mt-2 ${plain}`}>
          <Picker name="volume" tone="dark" allowEmpty={false} label={t('volume')} placeholder={t('volumePlaceholder')} value={volume}
            onChange={(v) => { setVolume(v); clear('volume'); }}
            options={PARTNER_VOLUMES.map((v) => ({ value: v, label: t('volumeOption', { range: v.replace('-', '–') }) }))} />
        </div>
        {error('volume')}
      </div>
      <label className={label}>{t('network')}
        <textarea name="network" rows={4} placeholder={t('networkPlaceholder')} className={field} />
      </label>
      <button type="submit" disabled={status === 'sending'}
        className="inline-flex items-center gap-2 bg-sky px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-accent disabled:opacity-60">
        {status === 'sending' ? tf('sending') : t('submit')} <span aria-hidden>→</span>
      </button>
    </form>
  );
}
