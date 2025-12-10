/**
 * Client Bookings API Routes
 * GET /api/client/bookings - Get client's bookings
 * POST /api/client/bookings - Create a new booking request
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireClient, validateRequest } from '@/lib/middleware';
import { createBookingSchema } from '@/lib/validations';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// GET - Get client's bookings
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    const where: any = { userId: user.userId };
    if (status) where.status = status;
    if (upcoming) {
      where.date = { gte: new Date() };
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        galleries: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    return NextResponse.json({ bookings });
  } catch (error: any) {
    console.error('Get client bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a booking request
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const body = await request.json();
    const validation = validateRequest(createBookingSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;

    // Check if the time slot is available
    const bookingDate = new Date(data.date);
    const dateStr = bookingDate.toISOString().split('T')[0];
    
    // Check availability (simplified - you may want more complex logic)
    const availableSlots = await prisma.availabilitySlot.findMany({
      where: {
        date: {
          gte: new Date(dateStr),
          lt: new Date(new Date(dateStr).getTime() + 24 * 60 * 60 * 1000),
        },
        isAvailable: true,
      },
    });

    // For now, allow booking if any slot exists for that day
    // You can add more sophisticated time matching logic
    if (availableSlots.length === 0) {
      return NextResponse.json(
        { error: 'No available slots for this date' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        date: bookingDate,
        duration: data.duration,
        location: data.location,
        notes: data.notes,
        serviceType: data.serviceType,
        totalPrice: data.totalPrice,
        userId: user.userId,
        status: 'PENDING', // Client bookings start as pending
      },
      include: {
        galleries: true,
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error('Create client booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

