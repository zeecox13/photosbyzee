/**
 * Logout API Route
 * POST /api/auth/logout
 * Clears the auth cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookieInResponse } from '@/lib/auth';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    return clearAuthCookieInResponse(response);
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

