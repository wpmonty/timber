import { NextRequest, NextResponse } from 'next/server';
import { createProperty, getProperties } from '@/data/fake-db';

// GET /api/properties – returns list of properties
export function GET() {
  return NextResponse.json(getProperties());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = createProperty(body);
  return NextResponse.json(created, { status: 201 });
}
