/**
 * Database client initialization
 * Uses Prisma Client with singleton pattern for Next.js
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only initialize Prisma if DATABASE_URL is available
// This allows the app to start even if database is not configured (for static pages)
const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is not set. Database features will be unavailable.');
    // Return a mock client that throws helpful errors
    return new Proxy({} as PrismaClient, {
      get() {
        throw new Error('DATABASE_URL environment variable is not set. Please configure it in Vercel.');
      },
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

export const prisma =
  globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

