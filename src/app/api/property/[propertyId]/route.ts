import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';

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
export async function POST(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from('properties')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(created)), { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/property/:id – update property
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
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
