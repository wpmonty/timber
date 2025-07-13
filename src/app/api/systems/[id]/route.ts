import { NextRequest, NextResponse } from 'next/server';
import { getSystems, updateSystem, deleteSystem } from '@/data/fake-db';

interface Params {
  params: { id: string };
}

// GET /api/systems/:id – return all systems for a property
export function GET(_request: NextRequest, { params }: Params) {
  const systems = getSystems(params.id);
  return NextResponse.json(systems);
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
