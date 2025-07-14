import { supabaseServer } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: { logId: string };
}

// GET /api/log/:id – return single log
export async function GET(_request: NextRequest, { params }: Params) {
  const { data: log, error } = await supabaseServer.from('logs').select('*').eq('id', params.logId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!log) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(log);
}

// POST /api/log/:id – create log with provided id
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { data: created, error } = await supabaseServer.from('logs').insert(body).select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!created) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/log/:id – update log
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { data: updated, error } = await supabaseServer
    .from('logs')
    .update(body)
    .eq('id', params.logId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/log/:id – delete log
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { data: deleted, error } = await supabaseServer
    .from('logs')
    .delete()
    .eq('id', params.logId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `Log ${params.logId} deleted` });
}
