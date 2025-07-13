// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockMaintainables } from '@/data/mock-property-data';

// Handles GET /api/systems – returns all mocked systems (maintainables)
export async function GET() {
  return NextResponse.json(mockMaintainables);
}

// Handles POST /api/systems – stubbed create behaviour
export async function POST(request: Request) {
  const body = await request.json();

  // In a real implementation you would persist to DB. For now we just echo back
  const created = {
    ...body,
    id: body.id ?? `temp-${Date.now()}`,
  };

  return NextResponse.json(created, { status: 201 });
}