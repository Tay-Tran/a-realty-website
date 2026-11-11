'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CurrencySwitcher } from './CurrencySwitcher';

export type NavItem = { href: string | { pathname: string; hash?: string }; label: string };

export function MobileMenu({ links, menuLabel, closeLabel }: { links: NavItem[]; menuLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? closeLabel : menuLabel}
        className="grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-base">
        <span aria-hidden>{open ? '✕' : '☰'}</span>
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-16 border-b border-line bg-paper px-4 pb-4 shadow-sm">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block border-b border-line py-3 text-ink">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 md:hidden"><CurrencySwitcher /></div>
        </nav>
      )}
    </div>
  );
}
