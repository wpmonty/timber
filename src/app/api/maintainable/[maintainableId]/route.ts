import { listMaintainableTypeNames } from '@/lib/maintainable-registry';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: { maintainableId: string };
}

// GET /api/maintainable/:id – return single maintainable
export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: maintainable, error } = await supabase
    .from('maintainables')
    .select('*')
    .eq('id', params.maintainableId)
    .single();
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned (404)
      return NextResponse.json({ error: 'Maintainable not found' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(maintainable);
}

// PATCH /api/maintainable/:id – update maintainable
export async function PATCH(request: NextRequest, { params }: Params) {
  const registeredTypes = listMaintainableTypeNames();
  console.log('registeredTypes', registeredTypes);
  // TODO validate the request body against the registered subtypes
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from('maintainables')
    .update(body)
    .eq('id', params.maintainableId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/maintainable/:id – delete maintainable
export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from('maintainables')
    .delete()
    .eq('id', params.maintainableId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `Maintainable ${params.maintainableId} deleted` });
}
