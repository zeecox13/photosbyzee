/**
 * Client Availability API Route
 * GET /api/client/availability - Get available booking slots
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireClient } from '@/lib/middleware';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Default to next 30 days
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const start = startDate ? new Date(startDate) : new Date();

    // Get available slots
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        isAvailable: true,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    // Get existing bookings to show which slots are taken
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        date: true,
        status: true,
      },
    });

    // Group slots by date
    const slotsByDate: Record<string, any[]> = {};
    slots.forEach((slot) => {
      const dateKey = slot.date.toISOString().split('T')[0];
      if (!slotsByDate[dateKey]) {
        slotsByDate[dateKey] = [];
      }
      slotsByDate[dateKey].push({
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isRecurring: slot.isRecurring,
      });
    });

    return NextResponse.json({
      slots: slotsByDate,
      bookedDates: bookings.map((b) => b.date.toISOString()),
    });
  } catch (error: any) {
    console.error('Get availability error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

