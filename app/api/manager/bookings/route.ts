/**
 * Manager Bookings API Routes
 * GET /api/manager/bookings - List all bookings
 * POST /api/manager/bookings - Create a new booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager, validateRequest } from '@/lib/middleware';
import { createBookingSchema } from '@/lib/validations';

// GET - List all bookings with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
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
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(createBookingSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;

    // userId should be provided in body for manual bookings
    const userId = body.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        date: new Date(data.date),
        duration: data.duration,
        location: data.location,
        notes: data.notes,
        serviceType: data.serviceType,
        totalPrice: data.totalPrice,
        userId: userId,
        status: 'CONFIRMED', // Manual bookings are confirmed by default
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: any) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

