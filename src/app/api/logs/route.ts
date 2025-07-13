import { NextResponse } from 'next/server';
import { getLogs } from '@/data/fake-db';

// GET /api/logs – returns all maintenance logs
export function GET() {
  return NextResponse.json(getLogs());
}
