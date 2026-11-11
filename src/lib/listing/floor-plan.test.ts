import { describe, expect, it } from 'vitest';
import { LAYOUTS } from '@/lib/data/types';
import { bedroomsOf } from './derived';
import { PLAN_HEIGHT, PLAN_WIDTH, planRooms } from './floor-plan';

const kinds = (layout: Parameters<typeof planRooms>[0]) => planRooms(layout).map((r) => r.kind);

describe('planRooms', () => {
  it('draws one room per bedroom for every layout', () => {
    for (const layout of LAYOUTS) {
      expect(kinds(layout).filter((k) => k === 'room'), layout).toHaveLength(bedroomsOf(layout));
    }
  });

  it('adds the kitchen type the layout names (none for 1R)', () => {
    expect(kinds('1R')).not.toContain('kitchen');
    expect(kinds('1K')).toContain('kitchen');
    expect(kinds('2DK')).toContain('dk');
    expect(kinds('3LDK')).toContain('ldk');
  });

  it('always includes bath, toilet, entrance and balcony', () => {
    for (const layout of LAYOUTS) {
      expect(kinds(layout), layout).toEqual(expect.arrayContaining(['bath', 'toilet', 'entrance', 'balcony']));
    }
  });

  it('keeps every room inside the canvas with positive size', () => {
    for (const layout of LAYOUTS) {
      for (const r of planRooms(layout)) {
        expect(r.w > 0 && r.h > 0, `${layout} ${r.kind}`).toBe(true);
        expect(r.x >= 0 && r.y >= 0 && r.x + r.w <= PLAN_WIDTH && r.y + r.h <= PLAN_HEIGHT, `${layout} ${r.kind}`).toBe(true);
      }
    }
  });

  it('numbers rooms when there are several', () => {
    expect(planRooms('2LDK').filter((r) => r.kind === 'room').map((r) => r.index)).toEqual([1, 2]);
  });
});
