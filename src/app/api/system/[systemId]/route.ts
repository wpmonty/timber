import { listMaintainableTypeNames } from '@/lib/maintainable-registry';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: { systemId: string };
}

// GET /api/system/:id – return single system
export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: system, error } = await supabase
    .from('systems')
    .select('*')
    .eq('id', params.systemId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned (404)
      return NextResponse.json({ error: 'System not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(system);
}

// PATCH /api/system/:id – update system
export async function PATCH(request: NextRequest, { params }: Params) {
  const registeredTypes = listMaintainableTypeNames();
  console.log('registeredTypes', registeredTypes);
  // TODO validate the request body against the registered subtypes
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from('systems')
    .update(body)
    .eq('id', params.systemId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/system/:id – delete system
export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from('systems')
    .delete()
    .eq('id', params.systemId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `System ${params.systemId} deleted` });
}
