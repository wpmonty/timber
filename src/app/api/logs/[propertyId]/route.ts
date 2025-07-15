import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase.server';

interface Params {
  params: { propertyId: string };
}

// GET /api/logs – returns all maintenance logs
export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('logs')
    .select('*')
    .eq('property_id', params.propertyId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
