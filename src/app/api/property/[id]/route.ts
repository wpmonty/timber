// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockPropertyData } from '@/data/mock-property-data';

interface Params {
  params: { id: string };
}

// GET /api/property/:id – returns property by id (only one mock property)
export async function GET(_request: Request, { params }: Params) {
  if (params.id !== mockPropertyData.id) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(mockPropertyData);
}

// POST /api/property/:id – create property (stub)
export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  return NextResponse.json({ ...body, id: params.id }, { status: 201 });
}

// PATCH /api/property/:id – update property (stub)
export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  return NextResponse.json({ ...body, id: params.id });
}

// DELETE /api/property/:id – delete property
export async function DELETE(_request: Request, { params }: Params) {
  return NextResponse.json({ message: `Property ${params.id} deleted` });
}