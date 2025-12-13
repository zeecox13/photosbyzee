/**
 * Database client initialization
 * Uses Prisma Client with singleton pattern for Next.js
 * Lazy initialization to prevent crashes when DATABASE_URL is not set
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Get or create Prisma client instance
 * Only initializes when actually accessed, not at module load time
 */
function getPrismaClient(): PrismaClient {
  // Use existing instance if available (for Next.js hot reload)
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  // Check if DATABASE_URL is available
  if (!process.env.DATABASE_URL) {
    // Return a proxy that throws helpful errors when database methods are called
    // This allows the app to start and serve static pages without crashing
    const errorProxy = new Proxy({} as PrismaClient, {
      get(_target, prop) {
        // Handle special properties that don't need database
        if (prop === 'then' || prop === 'catch' || prop === 'finally') {
          return undefined;
        }
        if (typeof prop === 'string' && prop.startsWith('$')) {
          // Prisma transaction methods
          return () => {
            throw new Error(
              'DATABASE_URL environment variable is not set. Please configure it in Vercel Settings → Environment Variables.'
            );
          };
        }
        // For any model access (user, gallery, etc.), return another proxy
        return new Proxy({}, {
          get() {
            throw new Error(
              'DATABASE_URL environment variable is not set. Please configure it in Vercel Settings → Environment Variables.'
            );
          },
        });
      },
    });
    
    // Store in global to prevent re-creating
    globalForPrisma.prisma = errorProxy;
    return errorProxy;
  }

  // Initialize real Prisma client
  const client = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  // Store in global for Next.js hot reload
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }

  return client;
}

// Export a proxy that lazily initializes Prisma only when accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

