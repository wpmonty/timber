import { NextRequest, NextResponse } from 'next/server';
import { createSystem } from '@/data/fake-db';

// POST /api/systems – create system
export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = createSystem(body);
  return NextResponse.json(created, { status: 201 });
}
