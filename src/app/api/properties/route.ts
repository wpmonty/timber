import { NextResponse } from 'next/server';
import { getProperties } from '@/data/fake-db';

// GET /api/properties – returns list of properties
export function GET() {
  return NextResponse.json(getProperties());
}
