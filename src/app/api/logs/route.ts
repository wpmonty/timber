// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockMaintenanceLogs } from '@/data/mock-property-data';

// GET /api/logs – returns all maintenance logs
export async function GET() {
  return NextResponse.json(mockMaintenanceLogs);
}