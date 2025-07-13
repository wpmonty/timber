import { NextRequest, NextResponse } from 'next/server';
import { getLog, updateLog, deleteLog, createLog } from '@/data/fake-db';

interface Params {
  params: { id: string };
}

// GET /api/log/:id – return single log
export function GET(_request: NextRequest, { params }: Params) {
  const log = getLog(params.id);
  if (!log) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(log);
}

// POST /api/log/:id – create log with provided id
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const created = createLog({ ...body, id: params.id });
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/log/:id – update log
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const updated = updateLog(params.id, body);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/log/:id – delete log
export function DELETE(_request: NextRequest, { params }: Params) {
  const ok = deleteLog(params.id);
  if (!ok) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `Log ${params.id} deleted` });
}
