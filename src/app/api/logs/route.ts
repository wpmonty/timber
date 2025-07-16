import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';

// POST /api/logs – create log
export async function POST(request: NextRequest) {
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: created, error } = await supabase.from('logs').insert(body).select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!created) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}
