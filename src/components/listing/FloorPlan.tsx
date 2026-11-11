import { useTranslations } from 'next-intl';
import type { Layout } from '@/lib/data/types';
import { PLAN_HEIGHT, PLAN_WIDTH, planRooms, type RoomKind } from '@/lib/listing/floor-plan';

const FILL: Record<RoomKind, string> = {
  room: '#ffffff', kitchen: '#fff7e8', dk: '#fff7e8', ldk: '#fff7e8',
  bath: '#e9f2f9', toilet: '#e9f2f9', entrance: '#eef1f5', balcony: '#edf5e8',
};

/** Schematic plan drawn from the layout code. Works in server and client components. */
export function FloorPlan({ layout, labels = true, className = '' }: { layout: Layout; labels?: boolean; className?: string }) {
  const t = useTranslations('floorPlan');
  const rooms = planRooms(layout);
  return (
    <svg viewBox={`-4 -4 ${PLAN_WIDTH + 8} ${PLAN_HEIGHT + 8}`} role="img" aria-label={`${t('title')} ${layout}`} className={className}>
      {rooms.map((r, i) => (
        <g key={i}>
          <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={FILL[r.kind]}
            stroke="#1f2a44" strokeWidth={r.kind === 'balcony' ? 2 : 4} strokeDasharray={r.kind === 'balcony' ? '6 5' : undefined} />
          {labels && (
            <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle"
              fontSize={r.kind === 'balcony' ? 12 : 14} fill="#1f2a44" fontWeight={r.kind === 'room' || r.kind === 'ldk' ? 700 : 500}>
              {r.kind === 'room' ? (r.index ? t('roomN', { index: r.index }) : t('room')) : t(r.kind)}
            </text>
          )}
        </g>
      ))}
      {labels && (
        <text x={PLAN_WIDTH - 6} y={PLAN_HEIGHT - 6} textAnchor="end" fontSize={11} fill="#4a5468">{layout}</text>
      )}
    </svg>
  );
}
