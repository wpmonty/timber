// @ts-nocheck
import { NextResponse } from 'next/server';
import { mockMaintenanceLogs } from '@/data/mock-property-data';

interface Params {
  params: { id: string };
}

// GET /api/log/:id – return single log
export async function GET(_request: Request, { params }: Params) {
  const log = mockMaintenanceLogs.find(l => l.id === params.id);
  if (!log) {
    return NextResponse.json({ message: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(log);
}

// POST /api/log/:id – create log with provided id (stub)
export async function POST(request: Request, { params }: Params) {
  const body = await request.json();
  return NextResponse.json({ ...body, id: params.id }, { status: 201 });
}

// PATCH /api/log/:id – update log
export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();
  return NextResponse.json({ ...body, id: params.id });
}

// DELETE /api/log/:id – delete log
export async function DELETE(_request: Request, { params }: Params) {
  return NextResponse.json({ message: `Log ${params.id} deleted` });
}