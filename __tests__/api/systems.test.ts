// @ts-nocheck
import { GET } from '@/app/api/systems/route';
import { mockMaintainables } from '@/data/mock-property-data';

describe('Systems API', () => {
  it('GET returns all systems', async () => {
    // The route handler returns a Response compatible object
    // @ts-ignore – NextResponse extends Response but TS may not know in Jest env
    const res: Response = await GET();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(mockMaintainables);
  });
});