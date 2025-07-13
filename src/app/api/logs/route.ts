import { NextRequest, NextResponse } from 'next/server';
import { createLog } from '@/data/fake-db';

// POST /api/logs – create log
export async function POST(request: NextRequest) {
  const body = await request.json();
  const created = createLog(body);
  return NextResponse.json(created, { status: 201 });
}
