import { NextRequest, NextResponse } from 'next/server';
import { getProperty, updateProperty } from '@/data/fake-db';
import { supabaseServer } from '@/lib/supabase';

interface Params {
  params: { propertyId: string };
}

// GET /api/property/:id – returns property by id (only one mock property)
export async function GET(_request: NextRequest, { params }: Params) {
  const { data, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', 'ec5aab9e-c5f4-473d-b557-8b72ea83e77d');
  console.log(data);
  console.log(error);
  const prop = getProperty(params.propertyId);
  if (!prop) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(prop);
}

// POST /api/property/:id – create property (stub)
export async function POST(request: NextRequest, { params }: Params) {
  const body = await request.json();
  // For demo we reuse updateProperty
  const created = updateProperty(params.propertyId, body);
  return NextResponse.json(created, { status: 201 });
}

// PATCH /api/property/:id – update property (stub)
export async function PATCH(request: NextRequest, { params }: Params) {
  const body = await request.json();
  const updated = updateProperty(params.propertyId, body);
  if (!updated) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

// DELETE /api/property/:id – delete property
export function DELETE(_request: NextRequest, { params }: Params) {
  // For now we don't remove property from fake DB
  return NextResponse.json({ message: `Property ${params.propertyId} deleted` });
}
