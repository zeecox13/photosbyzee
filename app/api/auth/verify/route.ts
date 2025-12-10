/**
 * Token Verification API Route
 * GET /api/auth/verify
 * Verifies a JWT token and returns user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticate(request);
    
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    // Fetch fresh user data from database
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: dbUser,
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

