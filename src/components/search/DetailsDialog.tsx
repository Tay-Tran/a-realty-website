'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { LAYOUTS, type ConditionKey, type Layout } from '@/lib/data/types';

const GROUPS: { key: 'groupContract' | 'groupBuilding' | 'groupRoom'; items: ConditionKey[] }[] = [
  { key: 'groupContract', items: ['noGuarantor', 'noKeyMoney', 'overseasApplication', 'studentOk'] },
  { key: 'groupBuilding', items: ['newlyBuilt', 'autoLock', 'luxury', 'family'] },
  { key: 'groupRoom', items: ['furnished', 'petOk'] },
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

/** Modal (bottom sheet on phones) for layouts and extra conditions; replaces the overflowing popover. */
export function DetailsDialog({ layouts, conditions, onChange, onClose }: {
  layouts: Layout[];
  conditions: ConditionKey[];
  onChange: (next: { layouts: Layout[]; conditions: ConditionKey[] }) => void;
  onClose: () => void;
}) {
  const t = useTranslations('hero');
  const tc = useTranslations('conditions');
  const count = layouts.length + conditions.length;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden'; // keep the page from scrolling behind
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = prev; };
  }, [onClose]);

  const chip = (on: boolean) =>
    `flex items-center justify-center gap-1 rounded-xl border px-3 py-2.5 text-sm transition ${on ? 'border-accent bg-accent font-semibold text-white shadow-sm' : 'border-line bg-white text-ink hover:border-accent/60'}`;

  // Portal to <body>: inside the hero's stacking context (isolate z-10) the sticky header would cover the dialog.
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 sm:items-center sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={t('detailsTitle')} onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="text-lg font-bold">{t('detailsTitle')}</h2>
          <button type="button" onClick={onClose} aria-label={t('close')} className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper">✕</button>
        </div>

        <div className="space-y-6 overflow-y-auto px-6 py-5">
          <section>
            <h3 className="text-sm font-semibold text-ink-soft">{t('layout')}</h3>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {LAYOUTS.map((l) => (
                <button key={l} type="button" aria-pressed={layouts.includes(l)} className={chip(layouts.includes(l))}
                  onClick={() => onChange({ layouts: toggle(layouts, l), conditions })}>
                  {layouts.includes(l) && <span aria-hidden>✓</span>}{l}
                </button>
              ))}
            </div>
          </section>
          {GROUPS.map((g) => (
            <section key={g.key}>
              <h3 className="text-sm font-semibold text-ink-soft">{t(g.key)}</h3>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {g.items.map((c) => (
                  <button key={c} type="button" aria-pressed={conditions.includes(c)} className={`${chip(conditions.includes(c))} justify-start text-left`}
                    onClick={() => onChange({ layouts, conditions: toggle(conditions, c) })}>
                    <span aria-hidden className="w-4">{conditions.includes(c) ? '✓' : ''}</span>{tc(c)}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
          <button type="button" onClick={() => onChange({ layouts: [], conditions: [] })} className="text-sm font-medium text-ink-soft underline-offset-4 hover:underline">
            {t('reset')}
          </button>
          <button type="button" onClick={onClose} className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-dark">
            {t('apply')}{count > 0 && ` (${count})`}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
