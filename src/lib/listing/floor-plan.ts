import type { Layout } from '@/lib/data/types';
import { bedroomsOf } from './derived';

/**
 * Schematic floor plans drawn from the layout code (1R, 1K, 2DK, 3LDK…).
 * Used until the client uploads real floor-plan images; it shows the room
 * arrangement, not real dimensions.
 */

export const PLAN_WIDTH = 300;
export const PLAN_HEIGHT = 420;

export type RoomKind = 'room' | 'kitchen' | 'dk' | 'ldk' | 'bath' | 'toilet' | 'entrance' | 'balcony';

export interface PlanRoom { kind: RoomKind; x: number; y: number; w: number; h: number; index?: number }

const BALCONY_H = 30;
const SERVICE_Y = 330; // bath / toilet / entrance strip along the bottom

/** Split a horizontal band into n equal rooms. */
function roomsRow(n: number, y: number, h: number, x = 0, width = PLAN_WIDTH): PlanRoom[] {
  const w = width / n;
  return Array.from({ length: n }, (_, i) => ({
    kind: 'room' as const, x: x + i * w, y, w, h, index: n > 1 ? i + 1 : undefined,
  }));
}

export function planRooms(layout: Layout): PlanRoom[] {
  const n = bedroomsOf(layout);
  const kitchen = layout.slice(String(n).length); // 'R' | 'K' | 'DK' | 'LDK'
  const top = BALCONY_H;
  const middle = SERVICE_Y - top;

  let living: PlanRoom[];
  if (kitchen === 'R') {
    living = roomsRow(n, top, middle);
  } else if (kitchen === 'K') {
    living = [...roomsRow(n, top, 220), { kind: 'kitchen', x: 0, y: top + 220, w: PLAN_WIDTH, h: middle - 220 }];
  } else if (kitchen === 'DK') {
    living = [...roomsRow(n, top, 170), { kind: 'dk', x: 0, y: top + 170, w: PLAN_WIDTH, h: middle - 170 }];
  } else if (n === 1) {
    // 1LDK: bedroom beside the living-dining-kitchen
    living = [...roomsRow(1, top, middle, 0, 130), { kind: 'ldk', x: 130, y: top, w: PLAN_WIDTH - 130, h: middle }];
  } else {
    living = [...roomsRow(n, top, 140), { kind: 'ldk', x: 0, y: top + 140, w: PLAN_WIDTH, h: middle - 140 }];
  }

  return [
    { kind: 'balcony', x: 0, y: 0, w: PLAN_WIDTH, h: BALCONY_H },
    ...living,
    { kind: 'bath', x: 0, y: SERVICE_Y, w: 110, h: PLAN_HEIGHT - SERVICE_Y },
    { kind: 'toilet', x: 110, y: SERVICE_Y, w: 80, h: PLAN_HEIGHT - SERVICE_Y },
    { kind: 'entrance', x: 190, y: SERVICE_Y, w: PLAN_WIDTH - 190, h: PLAN_HEIGHT - SERVICE_Y },
  ];
}
