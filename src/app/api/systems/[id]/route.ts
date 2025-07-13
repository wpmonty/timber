import { NextRequest, NextResponse } from 'next/server';
import { getSystem, updateSystem, deleteSystem } from '@/data/fake-db';

interface Params {
  params: { id: string };
}

// GET /api/systems/:id – return single system
export function GET(_request: NextRequest, { params }: Params) {
  const system = getSystem(params.id);
  if (!system) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(system);
}

// PATCH /api/systems/:id – update system
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const updated = updateSystem(params.id, body);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/systems/:id – delete system
export function DELETE(_request: NextRequest, { params }: Params) {
  const ok = deleteSystem(params.id);
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `System ${params.id} deleted` });
}