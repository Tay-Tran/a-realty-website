'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';

export type NavItem = { href: string | { pathname: string; hash?: string }; label: string };

export function MobileMenu({ links, menuLabel, closeLabel }: { links: NavItem[]; menuLabel: string; closeLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className="whitespace-nowrap rounded-full border border-line bg-white px-3 py-1.5 text-sm">
        {open ? closeLabel : menuLabel}
      </button>
      {open && (
        <nav className="absolute inset-x-0 top-16 border-b border-line bg-paper px-4 pb-4 shadow-sm">
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)} className="block border-b border-line py-3 text-ink last:border-0">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
