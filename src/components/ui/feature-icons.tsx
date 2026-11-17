import type { AmenityKey } from '@/lib/data/types';

/**
 * Line icons for services and amenities, drawn in currentColor so they follow the site
 * palette (colour emoji render differently on every OS and clash with the brand colour).
 */
type P = { className?: string };
const svg = (children: React.ReactNode) => function Icon({ className = 'h-5 w-5' }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
  );
};

export const SERVICE_ICONS = [
  // Apartment search
  svg(<><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>),
  // Online viewing
  svg(<><rect x="3" y="6" width="13" height="12" rx="2" /><path d="m16 10 5-3v10l-5-3z" /></>),
  // Application support
  svg(<><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M10 13h6M10 17h4" /></>),
  // Moving support
  svg(<><path d="M2 7h11v9H2z" /><path d="M13 10h4l3 3v3h-7z" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></>),
];

export const AMENITY_ICONS: Record<AmenityKey, ReturnType<typeof svg>> = {
  aircon: svg(<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9" />),
  balcony: svg(<><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14z" /><path d="m5 19 8-8" /></>),
  deliveryBox: svg(<><path d="m3 8 9-5 9 5v8l-9 5-9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>),
  elevator: svg(<><rect x="5" y="3" width="14" height="18" rx="2" /><path d="m9 10 3-3 3 3M9 14l3 3 3-3" /></>),
  bikeParking: svg(<><circle cx="6" cy="16" r="3.5" /><circle cx="18" cy="16" r="3.5" /><path d="m6 16 4-7h5l3 7M10 9 8.5 6H6.5M12 16l3-7" /></>),
  separateToilet: svg(<><path d="M4 21V3h16v18" /><path d="M12 3v18" /><path d="M9 12h.01M15 12h.01" /></>),
  washlet: svg(<><path d="M6 3h5v7H6z" /><path d="M4 10h16a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z" /><path d="m9 16-1 5h8l-1-5" /></>),
  internet: svg(<><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0" /><circle cx="12" cy="19.5" r="1" /></>),
  systemKitchen: svg(<><circle cx="10" cy="13" r="6" /><path d="M16 13h6" /></>),
  flooring: svg(<><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M3 15h18M9 3v6M15 9v6M9 15v6" /></>),
  storage: svg(<><rect x="4" y="3" width="16" height="18" rx="1" /><path d="M4 12h16M10 7.5h4M10 16.5h4" /></>),
};

/** Partner types on the partner page (keys match PARTNER_TYPES). */
export const PARTNER_ICONS = {
  school: svg(<><path d="m2 9 10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /></>),
  agency: svg(<><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" /></>),
  community: svg(<><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><circle cx="17" cy="9" r="2.5" /><path d="M16 14.5a5 5 0 0 1 5 5.5" /></>),
  broker: svg(<><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><circle cx="12" cy="14" r="2" /><path d="M12 16v4" /></>),
  company: svg(<><path d="M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16" /><path d="M15 9h4a1 1 0 0 1 1 1v11M3 21h18M8 8h3M8 12h3M8 16h3" /></>),
  individual: svg(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>),
  relocation: svg(<><path d="M3 12h13" /><path d="m12 8 4 4-4 4" /><path d="M16 5h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" /></>),
  union: svg(<><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /><path d="M9 12h6M12 9v6" /></>),
};

/** Benefit cards on the partner page. */
export const BENEFIT_ICONS = {
  fee: svg(<><circle cx="12" cy="12" r="9" /><path d="M9 8l3 4 3-4M12 12v5M9.5 13.5h5" /></>),
  scale: svg(<><path d="M3 20h18" /><path d="M6 16v-3M11 16V9M16 16V5" /><path d="m14 7 2-2 2 2" /></>),
  care: svg(<><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" /></>),
  contact: svg(<><path d="M4 13v-1a8 8 0 0 1 16 0v1" /><rect x="3" y="13" width="4" height="6" rx="1.5" /><rect x="17" y="13" width="4" height="6" rx="1.5" /><path d="M19 19c0 1.5-2 2-5 2" /></>),
};

/** "Why work with us" points on the careers page. */
export const WHY_ICONS = {
  languages: svg(<><path d="M4 5h9M8.5 3v2M6 5c0 4 3 7 6 8M11 5c0 4-3 7-6 8" /><path d="m13 21 4-9 4 9M14.5 18h5" /></>),
  support: svg(<><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></>),
  growth: svg(<><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></>),
};
