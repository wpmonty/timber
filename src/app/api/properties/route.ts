// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockPropertyData } from '@/data/mock-property-data';

// GET /api/properties – returns list of properties (single mock for now)
export async function GET() {
  return NextResponse.json([mockPropertyData]);
}