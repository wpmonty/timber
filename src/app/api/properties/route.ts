import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { validatePropertyData } from '@/lib/validation/property.validation';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the incoming data structure
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Extract and validate the property data
    const { data: propertyData, ...otherFields } = body;

    if (propertyData) {
      const validation = validatePropertyData(propertyData);

      if (!validation.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validation.errors,
          },
          { status: 400 }
        );
      }

      // Use validated data
      body.data = validation.data;
    }

    const supabase = await createSupabaseServerClient();
    const { data: created, error } = await supabase.from('properties').insert(body).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(JSON.parse(JSON.stringify(created || [])), { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
