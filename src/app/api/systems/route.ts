import { listRegisteredSubtypes } from '@/lib/maintainable-registry';
import { createSupabaseServerClient } from '@/lib/supabase.server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/systems – create system
export async function POST(request: NextRequest) {
  const registeredSubtypes = listRegisteredSubtypes();
  console.log(
    'registeredSubtypes',
    registeredSubtypes.map(s => s.subtype)
  );
  // TODO validate the request body against the registered subtypes
  const body = await request.json();
  const supabase = await createSupabaseServerClient();
  const { data: created, error } = await supabase.from('systems').insert(body).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!created) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(created, { status: 201 });
}
