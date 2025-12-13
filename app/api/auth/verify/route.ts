/**
 * Token Verification API Route
 * GET /api/auth/verify
 * Verifies a JWT token and returns user information
 */

import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/middleware';
import { prisma } from '@/lib/db';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 503 }
      );
    }

    const authResult = await authenticate(request);
    
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    // Fetch fresh user data from database
    // Wrap in try-catch in case Prisma fails
    let dbUser;
    try {
      dbUser = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
        },
      });
    } catch (dbError: any) {
      console.error('Database error in verify route:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check DATABASE_URL.' },
        { status: 503 }
      );
    }

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

