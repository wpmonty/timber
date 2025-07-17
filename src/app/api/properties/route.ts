import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { isValidProperty, validatePropertyData } from '@/lib/validation/property.validation';
import { PropertyInsert } from '@/types/property.types';

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.from('properties').select('*');

  if (error) {
    // TODO handle 404 missing record
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // TODO standardize supabase response parsing
  const parsedData = JSON.parse(JSON.stringify(data || []));

  return NextResponse.json(parsedData);
}

export async function POST(request: NextRequest & { json(): Promise<PropertyInsert> }) {
  const body: PropertyInsert = await request.json();
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
