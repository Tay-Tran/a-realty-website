'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { CV_EXTENSIONS, validateApplication, type ApplicationInput } from '@/lib/forms/application';
import { Picker } from '@/components/ui/Picker';

type Errors = Partial<Record<'name' | 'email' | 'position' | 'cv', 'required' | 'invalidEmail' | 'fileType' | 'fileSize'>>;

export const OPEN_APPLICATION = 'open';

/**
 * Job application with an optional CV. Demo: validates and shows the thank-you message;
 * in production the form posts to the CMS ("Applicants") and emails the team.
 */
export function ApplicationForm({ positions, defaultPosition = '' }: {
  positions: { value: string; label: string }[];
  defaultPosition?: string;
}) {
  const t = useTranslations('careers');
  const tf = useTranslations('form');
  const [position, setPosition] = useState(defaultPosition);
  const [cv, setCv] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const fileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);

  // The form shrinks to a thank-you line; bring it into view so the visitor sees it.
  useEffect(() => {
    if (status === 'sent') { doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); doneRef.current?.focus({ preventScroll: true }); }
  }, [status]);

  const clear = (k: string) => setErrors((e) => (k in e ? Object.fromEntries(Object.entries(e).filter(([key]) => key !== k)) : e));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? '');
    const input: ApplicationInput = {
      name: value('name'), email: value('email'), phone: value('phone'), position, message: value('message'),
      cv: cv ? { name: cv.name, size: cv.size } : null,
    };
    const result = validateApplication(input);
    if (!result.ok) { setErrors(result.errors); return; }
    setErrors({});
    setStatus('sending');
    await new Promise((r) => setTimeout(r, 700));
    setStatus('sent');
  }

  function pickFile(file: File | null) {
    setCv(file);
    clear('cv'); // re-checked on submit
  }

  if (status === 'sent') {
    return <p ref={doneRef} role="status" tabIndex={-1} className="scroll-mt-24 rounded-xl bg-success/10 p-4 text-sm text-success focus:outline-none">{t('success')}</p>;
  }

  const field = 'mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 font-normal text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15';
  const message = (code: NonNullable<Errors[keyof Errors]>) => (code === 'fileType' || code === 'fileSize' ? t(code) : tf(code));
  const error = (k: keyof Errors) => errors[k] && <p className="mt-1 text-xs font-normal text-danger">{message(errors[k]!)}</p>;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3" onInput={(e) => clear((e.target as HTMLInputElement).name)}>
      <div className="text-sm font-medium">
        <span>{t('position')}</span>
        <div className="mt-1 font-normal">
          <Picker name="position" allowEmpty={false} label={t('position')} placeholder={t('positionPlaceholder')}
            value={position} onChange={(v) => { setPosition(v); clear('position'); }}
            options={[...positions, { value: OPEN_APPLICATION, label: t('positionOpen') }]} />
        </div>
        {error('position')}
      </div>
      <label className="block text-sm font-medium">{t('name')}<input name="name" autoComplete="name" className={field} />{error('name')}</label>
      <label className="block text-sm font-medium">{t('email')}<input name="email" type="email" autoComplete="email" className={field} />{error('email')}</label>
      <label className="block text-sm font-medium">{t('phone')}<input name="phone" type="tel" autoComplete="tel" className={field} /></label>
      <label className="block text-sm font-medium">{t('message')}
        <textarea name="message" rows={3} placeholder={t('messagePlaceholder')} className={field} />
      </label>

      <div className="text-sm font-medium">
        <span>{t('cv')}</span>
        <input ref={fileRef} type="file" className="sr-only" tabIndex={-1} aria-hidden
          accept={CV_EXTENSIONS.map((e) => `.${e}`).join(',')}
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)} />
        <div className="mt-1 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-line bg-paper p-3 font-normal">
          {cv ? (
            <>
              <span className="min-w-0 flex-1 truncate text-ink">{cv.name}</span>
              <button type="button" className="text-sm text-sky hover:underline"
                onClick={() => { pickFile(null); if (fileRef.current) fileRef.current.value = ''; }}>{t('cvRemove')}</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink hover:border-accent">{t('cvChoose')}</button>
              <span className="text-xs text-ink-soft">{t('cvHint')}</span>
            </>
          )}
        </div>
        {error('cv')}
      </div>

      <button type="submit" disabled={status === 'sending'}
        className="w-full rounded-full bg-accent px-6 py-3 font-semibold text-white hover:bg-accent-dark disabled:opacity-60">
        {status === 'sending' ? tf('sending') : t('submit')}
      </button>
    </form>
  );
}
