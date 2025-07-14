import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

interface Params {
  params: { propertyId: string };
}

// GET /api/systems/:id – return all systems for a property
export async function GET(_request: NextRequest, { params }: Params) {
  const { data, error } = await supabaseServer
    .from('systems')
    .select('*')
    .eq('property_id', params.propertyId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}

// PATCH /api/systems/:id – update system
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { data: updated, error } = await supabaseServer
    .from('systems')
    .update(body)
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/systems/:id – delete system
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { data: deleted, error } = await supabaseServer
    .from('systems')
    .delete()
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `System ${params.propertyId} deleted` });
}
