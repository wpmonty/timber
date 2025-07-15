import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase.middleware';

export async function middleware(request: NextRequest) {
  console.log('🔥 MIDDLEWARE TRIGGERED for:', request.nextUrl.pathname);

  try {
    console.log('🔥 About to call updateSession...');
    const result = await updateSession(request);
    console.log('🔥 updateSession returned:', result.status);
    return result;
  } catch (error) {
    console.error('🔥 Error in middleware:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
