import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

interface Params {
  params: { propertyId: string };
}

// GET /api/logs – returns all maintenance logs
export async function GET(_request: NextRequest, { params }: Params) {
  const { data, error } = await supabaseServer
    .from('logs')
    .select('*')
    .eq('property_id', params.propertyId);
  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ message: 'Not found' }, { status: 404 });
  return NextResponse.json(data);
}
