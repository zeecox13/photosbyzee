/**
 * Manager Availability API Routes
 * GET /api/manager/availability - Get available time slots
 * POST /api/manager/availability - Create availability slot
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager, validateRequest } from '@/lib/middleware';
import { createAvailabilitySchema } from '@/lib/validations';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// GET - Get availability slots
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = { isAvailable: true };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json({ slots });
  } catch (error: any) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create availability slot
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(createAvailabilitySchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;

    const slot = await prisma.availabilitySlot.create({
      data: {
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        isRecurring: data.isRecurring,
        recurringDay: data.recurringDay,
        isAvailable: true,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error: any) {
    console.error('Create availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

