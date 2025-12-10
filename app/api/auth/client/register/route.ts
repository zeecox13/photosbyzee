/**
 * Client Registration API Route
 * POST /api/auth/client/register
 * Creates a new client account
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, createAuthToken, setAuthCookieInResponse } from '@/lib/auth';
import { validateRequest } from '@/lib/middleware';
import { registerSchema } from '@/lib/validations';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(registerSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { email, password, name, firstName, lastName, phone } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Split name if provided and firstName/lastName not provided
    let finalFirstName = firstName;
    let finalLastName = lastName;
    if (name && !firstName && !lastName) {
      const nameParts = name.trim().split(' ');
      finalFirstName = nameParts[0] || null;
      finalLastName = nameParts.slice(1).join(' ') || null;
    }

    // Create new client user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: finalFirstName || null,
        lastName: finalLastName || null,
        phone,
        role: 'CLIENT',
      },
    });

    // Generate JWT token
    const token = createAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Create response and set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
    }, { status: 201 });
    return setAuthCookieInResponse(response, token);
  } catch (error: any) {
    console.error('Client registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

