/**
 * Authentication utilities
 * Handles JWT token generation, verification, and password hashing
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'MANAGER' | 'CLIENT';
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-change-in-production') {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!JWT_SECRET || JWT_SECRET === 'fallback-secret-change-in-production') {
      return null;
    }
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(
  authHeader: string | null | undefined
): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

/**
 * Create an auth token payload
 */
export function createAuthToken(payload: JWTPayload): string {
  return generateToken(payload);
}

/**
 * Set auth token as HTTP-only cookie
 * Note: This must be called within a server context (API route or server component)
 */
export function setAuthCookie(token: string): void {
  const cookieStore = cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

/**
 * Clear auth cookie
 * Note: This must be called within a server context (API route or server component)
 */
export function clearAuthCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
}

/**
 * Set auth cookie in a NextResponse (for API routes)
 */
export function setAuthCookieInResponse(response: NextResponse, token: string): NextResponse {
  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  return response;
}

/**
 * Clear auth cookie in a NextResponse (for API routes)
 */
export function clearAuthCookieInResponse(response: NextResponse): NextResponse {
  response.cookies.delete('auth_token');
  return response;
}

/**
 * Get current user from cookie (server-side only)
 */
export async function getCurrentUser(): Promise<{
  id: string;
  email: string;
  role: 'MANAGER' | 'CLIENT';
  firstName: string | null;
  lastName: string | null;
} | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
    });

    return user;
  } catch (error: any) {
    // Don't log DYNAMIC_SERVER_USAGE errors during build - they're expected
    // when pages using cookies aren't marked as dynamic
    if (error?.digest !== 'DYNAMIC_SERVER_USAGE') {
      console.error('Error getting current user:', error);
    }
    return null;
  }
}

