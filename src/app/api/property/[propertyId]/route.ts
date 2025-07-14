import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

interface Params {
  params: { propertyId: string };
}

// GET /api/property/:id – returns property by id (only one mock property)
export async function GET(_request: NextRequest, { params }: Params) {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', params.propertyId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(data[0]);
}

// POST /api/property/:id – create property (stub)
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  // For demo we reuse updateProperty
  const { data: created, error } = await supabaseServer.from('properties').insert(body).select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!created) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/property/:id – update property (stub)
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const { data: updated, error } = await supabaseServer
    .from('properties')
    .update(body)
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/property/:id – delete property
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { data: deleted, error } = await supabaseServer
    .from('properties')
    .delete()
    .eq('id', params.propertyId)
    .select();
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!deleted) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: `Property ${params.propertyId} deleted` });
}
