import { NextRequest, NextResponse } from 'next/server';
import { getLogs } from '@/data/fake-db';

interface Params {
  params: { propertyId: string };
}

// GET /api/logs – returns all maintenance logs
export function GET(_request: NextRequest, { params }: Params) {
  const { propertyId } = params;
  return NextResponse.json(getLogs(propertyId));
}
