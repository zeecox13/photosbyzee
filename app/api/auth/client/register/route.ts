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

    const { email, password, name, firstName, lastName, phone, location } = validation.data;

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
      finalFirstName = nameParts[0] || undefined;
      finalLastName = nameParts.slice(1).join(' ') || undefined;
    }

    // Create new client user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName: finalFirstName || null,
        lastName: finalLastName || null,
        phone: phone || null,
        location: location || null,
        role: 'CLIENT',
      } as any, // Type assertion needed until Prisma client is regenerated after migration
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
      token: token, // Also return token for localStorage
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    }, { status: 201 });
    return setAuthCookieInResponse(response, token);
  } catch (error: any) {
    console.error('Client registration error:', error);
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    if (error.message?.includes('location')) {
      return NextResponse.json(
        { error: 'Database migration required. Please run: npx prisma migrate dev' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}

