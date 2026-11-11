'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { validateInquiry } from '@/lib/forms/inquiry';
import { Picker } from '@/components/ui/Picker';

const TYPES = [['rent', 'typeRent'], ['move', 'typeMove'], ['partner', 'typePartner'], ['other', 'typeOther']] as const;

type Errors = Partial<Record<'name' | 'email' | 'message', 'required' | 'invalidEmail'>>;

export function InquiryForm({ listingCode }: { listingCode?: string }) {
  const t = useTranslations('form');
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [type, setType] = useState('rent');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? '');
    const result = validateInquiry({ name: value('name'), email: value('email'), phone: value('phone'), message: value('message') });
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors({});
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 600)); // Demo: real sending arrives in week 3.
    setStatus('sent');
  }

  if (status === 'sent') {
    return <p role="status" className="rounded-xl bg-success/10 p-4 text-sm text-success">{t('success')}</p>;
  }

  const field = 'mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-ink focus:border-ink focus:outline-none';
  const error = (k: keyof Errors) => errors[k] && <p className="mt-1 text-xs text-danger">{t(errors[k]!)}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      {listingCode && (
        <p className="text-sm text-ink-soft">{t('listingCode')}: <strong className="text-ink">{listingCode}</strong></p>
      )}
      <input type="hidden" name="listingCode" value={listingCode ?? ''} />
      {!listingCode && (
        <div className="text-sm font-medium">
          <span id="inquiry-type">{t('type')}</span>
          <div className="mt-1 font-normal">
            <Picker name="type" allowEmpty={false} label={t('type')} placeholder={t('typeRent')} value={type} onChange={setType}
              options={TYPES.map(([value, key]) => ({ value, label: t(key) }))} />
          </div>
        </div>
      )}
      <label className="block text-sm font-medium">{t('name')}<input name="name" autoComplete="name" className={field} />{error('name')}</label>
      <label className="block text-sm font-medium">{t('email')}<input name="email" type="email" autoComplete="email" className={field} />{error('email')}</label>
      <label className="block text-sm font-medium">{t('phone')}<input name="phone" type="tel" autoComplete="tel" className={field} /></label>
      <label className="block text-sm font-medium">{t('message')}<textarea name="message" rows={4} placeholder={t('messagePlaceholder')} className={field} />{error('message')}</label>
      <button type="submit" disabled={status === 'sending'}
        className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
        {status === 'sending' ? t('sending') : t('submit')}
      </button>
    </form>
  );
}
