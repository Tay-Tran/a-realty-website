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
