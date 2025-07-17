import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { validatePropertyData } from '@/lib/validation/property.validation';
import { Property } from '@/types/property.types';

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

export async function POST(request: NextRequest & { json(): Promise<Property> }) {
  try {
    const body = await request.json();
    const validated = validatePropertyData(body.data);

    if (!validated.success) {
      return NextResponse.json({ error: validated.errors }, { status: 400 });
    }
    if (!validated.data) {
      return NextResponse.json({ error: 'Invalid property data' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase
      .from('properties')
      .insert({
        owner_id: body.owner_id, // uses RLS to restrict access to the user
        address: `${validated.data.address.line1}, ${validated.data.address.city}, ${validated.data.address.state} ${validated.data.address.zip}`,
        data: validated.data,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(created || [])), { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
