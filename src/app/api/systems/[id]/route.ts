// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockMaintainables } from '@/data/mock-property-data';

interface Params {
  params: { id: string };
}

// GET /api/systems/:id – return single system
export async function GET(_request: Request, { params }: Params) {
  const system = mockMaintainables.find(m => m.id === params.id);
  if (!system) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(system);
}

// PATCH /api/systems/:id – stub update
export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  const updated = { ...body, id: params.id };
  return NextResponse.json(updated);
}

// DELETE /api/systems/:id – stub delete
export async function DELETE(_request: Request, { params }: Params) {
  return NextResponse.json({ message: `System ${params.id} deleted` });
}