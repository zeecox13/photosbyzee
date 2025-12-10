/**
 * Manager Login API Route
 * POST /api/auth/manager/login
 * Authenticates a manager/admin and returns a JWT token
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword, generateToken } from '@/lib/auth';
import { validateRequest } from '@/lib/middleware';
import { loginSchema } from '@/lib/validations';

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
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user data (excluding password)
    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error: any) {
    console.error('Manager login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

