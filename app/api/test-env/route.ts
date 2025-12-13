import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  // Get ALL environment variables (for debugging)
  const allEnvKeys = Object.keys(process.env).sort();
  
  // Filter to show only relevant ones (without exposing values)
  const relevantKeys = allEnvKeys.filter(key => 
    key.includes('DATABASE') || 
    key.includes('JWT') || 
    key.includes('VERCEL') ||
    key.includes('NODE')
  );

  return NextResponse.json({
    totalEnvVars: allEnvKeys.length,
    relevantEnvVars: relevantKeys,
    // Show first 20 env var names (without values) for debugging
    sampleEnvVars: allEnvKeys.slice(0, 20),
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    // Check for common variations
    hasDatabaseUrlLower: !!process.env.database_url,
    hasJwtSecretLower: !!process.env.jwt_secret,
  });
}

