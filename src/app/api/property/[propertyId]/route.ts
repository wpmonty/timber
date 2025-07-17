import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { Property } from '@/types/property.types';
import { isValidProperty, validatePropertyData } from '@/lib/validation/property.validation';

interface Params {
  params: { propertyId: string };
}

// GET /api/property/:id – returns property by id (user-scoped)
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', params.propertyId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned (404)
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Ensure proper JSON serialization
    return NextResponse.json(JSON.parse(JSON.stringify(data)));
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/property/:id – create property
export async function POST() {
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
}

// PATCH /api/property/:id – update property
export async function PATCH(
  request: NextRequest & { json(): Promise<Property> },
  { params }: Params
) {
  const body: Property = await request.json();
  const isValid = isValidProperty(body);
  const validated = validatePropertyData(body.data);

  if (!isValid) {
    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }
    if (!validated.data) {
      return NextResponse.json({ error: 'Invalid property data' }, { status: 400 });
    }
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: updated, error } = await supabase
      .from('properties')
      .update(body)
      .eq('id', params.propertyId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(updated)));
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/property/:id – delete property
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: deleted, error } = await supabase
      .from('properties')
      .delete()
      .eq('id', params.propertyId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Property ${params.propertyId} deleted`,
      data: JSON.parse(JSON.stringify(deleted)),
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
