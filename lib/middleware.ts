/**
 * Authentication middleware
 * Protects API routes and validates user permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractTokenFromHeader, JWTPayload } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * Middleware to authenticate requests
 * Checks for valid JWT token in Authorization header
 */
export async function authenticate(
  request: NextRequest
): Promise<{ user: JWTPayload } | { error: NextResponse }> {
  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  return { user: payload };
}

/**
 * Middleware to ensure user is a manager/admin
 */
export async function requireManager(
  request: NextRequest
): Promise<{ user: JWTPayload } | { error: NextResponse }> {
  const authResult = await authenticate(request);
  if ('error' in authResult) {
    return authResult;
  }

  if (authResult.user.role !== 'MANAGER') {
    return {
      error: NextResponse.json(
        { error: 'Manager access required' },
        { status: 403 }
      ),
    };
  }

  return { user: authResult.user };
}

/**
 * Middleware to ensure user is a client
 */
export async function requireClient(
  request: NextRequest
): Promise<{ user: JWTPayload } | { error: NextResponse }> {
  const authResult = await authenticate(request);
  if ('error' in authResult) {
    return authResult;
  }

  if (authResult.user.role !== 'CLIENT') {
    return {
      error: NextResponse.json(
        { error: 'Client access required' },
        { status: 403 }
      ),
    };
  }

  return { user: authResult.user };
}

/**
 * Helper to validate request body with Zod schema
 */
export function validateRequest<T>(
  schema: { parse: (data: unknown) => T },
  data: unknown
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error: any) {
    return {
      success: false,
      error: NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      ),
    };
  }
}

