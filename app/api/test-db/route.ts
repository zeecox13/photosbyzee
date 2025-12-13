import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Try a simple query
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: userCount,
      databaseUrl: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
        : 'NOT SET',
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      errorName: error?.name || 'UnknownError',
      errorMessage: error?.message || 'Unknown error',
      errorStack: error?.stack?.substring(0, 500) || 'No stack trace',
      databaseUrl: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
        : 'NOT SET',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

