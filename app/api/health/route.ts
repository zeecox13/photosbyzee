import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Get all environment variables that start with DATABASE or JWT
  const envVars = Object.keys(process.env)
    .filter(key => key.includes('DATABASE') || key.includes('JWT'))
    .reduce((acc, key) => {
      acc[key] = process.env[key] ? 'SET (hidden)' : 'NOT SET';
      return acc;
    }, {} as Record<string, string>);

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    // Show all DATABASE and JWT related env vars (without values)
    envVarsFound: Object.keys(envVars),
    allEnvVars: envVars,
  });
}

