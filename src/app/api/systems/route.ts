import { NextRequest, NextResponse } from 'next/server';
import { getSystems, createSystem } from '@/data/fake-db';

// GET /api/systems – list systems
export function GET() {
  return NextResponse.json(getSystems());
}

// POST /api/systems – create system
export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = createSystem(body);
  return NextResponse.json(created, { status: 201 });
}
