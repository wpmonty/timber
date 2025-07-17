import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';

interface Params {
  params: { propertyId: string };
}

// GET /api/systems/:id – return all systems for a property
export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('systems')
    .select('*')
    .eq('property_id', params.propertyId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/systems/:id – update system
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: updated, error } = await supabase
    .from('systems')
    .update(body)
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/systems/:id – delete system
export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data: deleted, error } = await supabase
    .from('systems')
    .delete()
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `System ${params.propertyId} deleted` });
}
