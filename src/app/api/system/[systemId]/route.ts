import { NextRequest, NextResponse } from 'next/server';
import { getSystem, updateSystem, deleteSystem, createSystem } from '@/data/fake-db';

interface Params {
  params: { systemId: string };
}

// GET /api/log/:id – return single log
export function GET(_request: NextRequest, { params }: Params) {
  const system = getSystem(params.systemId);
  if (!system) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(system);
}

// POST /api/log/:id – create log with provided id
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const created = createSystem({ ...body, id: params.systemId });
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/log/:id – update log
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const updated = updateSystem(params.systemId, body);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/log/:id – delete log
export function DELETE(_request: NextRequest, { params }: Params) {
  const ok = deleteSystem(params.systemId);
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `System ${params.systemId} deleted` });
}
