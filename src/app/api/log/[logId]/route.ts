import { createSupabaseServerClient } from '@/lib/supabase.server';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: { logId: string };
}

// GET /api/log/:id – return single log
export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: log, error } = await supabase.from('logs').select('*').eq('id', params.logId);
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned (404)
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json(log);
}

// POST /api/log/:id – create log with provided id
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: created, error } = await supabase.from('logs').insert(body).select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!created) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/log/:id – update log
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
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
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from('logs')
    .delete()
    .eq('id', params.logId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `Log ${params.logId} deleted` });
}
