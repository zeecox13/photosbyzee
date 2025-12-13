/**
 * Manager Login API Route
 * POST /api/auth/manager/login
 * Authenticates a manager/admin and returns a JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createAuthToken, setAuthCookieInResponse } from '@/lib/auth';
import { validateRequest } from '@/lib/middleware';
import { loginSchema } from '@/lib/validations';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(loginSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { email, password } = validation.data;

    // Find user with manager role
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.role !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response with token in body (for localStorage) and HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      token, // Include token in response body for client-side storage
    });
    return setAuthCookieInResponse(response, token);
  } catch (error: any) {
    console.error('Manager login error:', error);
    console.error('Error stack:', error?.stack);
    console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Return more specific error message for debugging
    const errorMessage = error?.message || 'Internal server error';
    const errorStack = error?.stack || '';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        // Only show details in development or if explicitly enabled
        details: (process.env.NODE_ENV === 'development' || process.env.SHOW_ERROR_DETAILS === 'true') 
          ? `${errorMessage}${errorStack ? `\nStack: ${errorStack.substring(0, 200)}` : ''}` 
          : 'Check server logs for details'
      },
      { status: 500 }
    );
  }
}

