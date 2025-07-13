import { NextRequest, NextResponse } from 'next/server';
import { getProperty, updateProperty } from '@/data/fake-db';

interface Params {
  params: { id: string };
}

// GET /api/property/:id – returns property by id (only one mock property)
export function GET(_request: NextRequest, { params }: Params) {
  const prop = getProperty(params.id);
  if (!prop) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(prop);
}

// POST /api/property/:id – create property (stub)
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  // For demo we reuse updateProperty
  const created = updateProperty(params.id, body);
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/property/:id – update property (stub)
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const updated = updateProperty(params.id, body);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/property/:id – delete property
export function DELETE(_request: NextRequest, { params }: Params) {
  // For now we don't remove property from fake DB
  return NextResponse.json({ message: `Property ${params.id} deleted` });
}
