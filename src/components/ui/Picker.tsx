'use client';

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { filterByLabel } from '@/lib/search/places';
import { ChevronDownIcon, SearchIcon } from './icons';

export interface PickerOption { value: string; label: string; hint?: string; dots?: string[] }

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: PickerOption[];
  /** Shown when nothing is chosen, and as the first "any" row. */
  placeholder: string;
  /** Accessible name; also the tile title in the "tile" variant. */
  label: string;
  /** tile: hero search tile · field: form/filter box · pill: compact rounded control (header, sort). */
  variant?: 'tile' | 'field' | 'pill';
  icon?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  noResults?: string;
  align?: 'left' | 'right';
  /** Adds the placeholder as a first "any" row; off for controls that always hold a value. */
  allowEmpty?: boolean;
  /** Submits the value with a surrounding form under this name. */
  name?: string;
}

/**
 * Styled dropdown that replaces the native <select> (whose OS list ignores the site design).
 * Opens below its trigger; keyboard: ↓/↑ to move, Enter to pick, Esc to close.
 */
export function Picker({
  value, onChange, options, placeholder, label, variant = 'field', icon,
  searchable = false, searchPlaceholder, noResults = '—', align = 'left', allowEmpty = true, name,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const head: PickerOption[] = allowEmpty ? [{ value: '', label: placeholder }] : [];
  const rows: PickerOption[] = [...head, ...filterByLabel(options, query)];
  const selected = options.find((o) => o.value === value);

  function openWith(seed = '') {
    setQuery(seed);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, [...head, ...options].findIndex((o) => o.value === value)));
    // Focus the search box (or the list) so the keyboard works immediately.
    requestAnimationFrame(() => (searchable ? searchRef.current : listRef.current)?.focus());
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function pick(v: string) {
    onChange(v);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(i + 1, rows.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter') { e.preventDefault(); if (rows[active]) pick(rows[active].value); }
  }

  const trigger = variant === 'tile' ? (
    <>
      <span className="flex items-center gap-2 text-sm font-bold text-sky">
        {icon}{label}<ChevronDownIcon className={`ml-auto h-4 w-4 text-ink-soft transition ${open ? 'rotate-180' : ''}`} />
      </span>
      <span className={`mt-1 block truncate text-sm ${selected ? 'font-medium text-ink' : 'text-ink-soft'}`}>{selected?.label ?? placeholder}</span>
    </>
  ) : (
    <span className="flex items-center gap-2">
      <span className={`flex-1 truncate text-left ${selected ? 'text-ink' : 'text-ink-soft'}`}>{selected?.label ?? placeholder}</span>
      <ChevronDownIcon className={`h-4 w-4 shrink-0 text-ink-soft transition ${open ? 'rotate-180' : ''}`} />
    </span>
  );

  return (
    <div className="relative min-w-0">
      {name && <input type="hidden" name={name} value={value} />}
      <button ref={triggerRef} type="button" aria-haspopup="listbox" aria-expanded={open} aria-controls={listId}
        aria-label={`${label}: ${selected?.label ?? placeholder}`}
        onClick={() => (open ? setOpen(false) : openWith())}
        onKeyDown={(e) => {
          // Letters typed while focus is still on the trigger go into the filter box instead of being lost.
          if (searchable && e.key.length === 1 && e.key !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            if (open) { setQuery((q) => q + e.key); searchRef.current?.focus(); } else openWith(e.key);
            return;
          }
          if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openWith(); }
        }}
        className={variant === 'tile'
          ? 'block w-full px-4 py-3 text-left'
          : `block w-full border bg-white text-sm focus:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 ${variant === 'pill' ? 'rounded-full py-1.5 pl-3.5 pr-2.5' : 'rounded-xl px-3 py-2.5'} ${open ? 'border-accent ring-2 ring-accent/20' : 'border-line hover:border-ink/30'}`}>
        {trigger}
      </button>

      {open && (
        <>
          <div aria-hidden className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute top-full z-50 mt-2 w-full ${variant === 'pill' ? 'min-w-[180px]' : 'min-w-[240px]'} overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-line ${align === 'right' ? 'right-0' : 'left-0'}`}>
            {searchable && (
              <div className="relative border-b border-line p-2">
                <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
                <input ref={searchRef} type="text" value={query} placeholder={searchPlaceholder} aria-label={searchPlaceholder}
                  aria-controls={listId} aria-activedescendant={`${listId}-${active}`}
                  onChange={(e) => { setQuery(e.target.value); setActive(e.target.value ? head.length : 0); }} onKeyDown={onKey}
                  className="w-full rounded-lg bg-paper py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
              </div>
            )}
            <ul ref={listRef} id={listId} role="listbox" aria-label={label} tabIndex={-1} onKeyDown={onKey}
              aria-activedescendant={`${listId}-${active}`} className="max-h-72 overflow-y-auto py-1 focus:outline-none">
              {rows.map((o, i) => {
                const isSelected = o.value === value;
                return (
                  <li key={o.value || '__any'} id={`${listId}-${i}`} data-index={i} role="option" aria-selected={isSelected}
                    onMouseEnter={() => setActive(i)} onClick={() => pick(o.value)}
                    className={`flex cursor-pointer items-center gap-2 px-4 py-2 text-sm ${i === active ? 'bg-paper' : ''} ${isSelected ? 'font-semibold text-accent-dark' : 'text-ink'} ${allowEmpty && i === 0 ? 'text-ink-soft' : ''}`}>
                    <span aria-hidden className="w-4 shrink-0 text-sky">{isSelected ? '✓' : ''}</span>
                    {o.dots?.map((c) => <span key={c} aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: c }} />)}
                    <span className="flex-1 truncate">{o.label}</span>
                    {o.hint && <span className="shrink-0 text-xs text-ink-soft">{o.hint}</span>}
                  </li>
                );
              })}
              {rows.length === head.length && query && <li className="px-4 py-3 text-sm text-ink-soft">{noResults}</li>}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
