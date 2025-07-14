import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
      user: session.user,
      message: 'User authenticated successfully',
    });
  } catch (error) {
    console.error('Error in auth user route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
