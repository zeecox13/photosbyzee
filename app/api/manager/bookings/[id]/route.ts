/**
 * Manager Booking Detail API Routes
 * GET /api/manager/bookings/[id] - Get booking details
 * PUT /api/manager/bookings/[id] - Update booking
 * DELETE /api/manager/bookings/[id] - Cancel/delete booking
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager, validateRequest } from '@/lib/middleware';
import { updateBookingSchema } from '@/lib/validations';

// Mark route as dynamic
export const dynamic = 'force-dynamic';

// GET - Get booking by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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
          include: {
            images: {
              select: {
                id: true,
                url: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(updateBookingSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;
    const updateData: any = {};
    
    if (data.date) updateData.date = new Date(data.date);
    if (data.duration !== undefined) updateData.duration = data.duration;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.status) updateData.status = data.status;
    if (data.serviceType !== undefined) updateData.serviceType = data.serviceType;
    if (data.totalPrice !== undefined) updateData.totalPrice = data.totalPrice;

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
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

    return NextResponse.json({ booking });
  } catch (error: any) {
    console.error('Update booking error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Cancel/delete booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    // Soft delete by setting status to CANCELLED
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

