/**
 * Manager Galleries API Routes
 * GET /api/manager/galleries - List all galleries
 * POST /api/manager/galleries - Create a new gallery
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager, validateRequest } from '@/lib/middleware';
import { createGallerySchema } from '@/lib/validations';

// GET - List all galleries with filters
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const visibility = searchParams.get('visibility');

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (visibility) where.visibility = visibility;

    const galleries = await prisma.gallery.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        booking: {
          select: {
            id: true,
            date: true,
            serviceType: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            price: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            images: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ galleries });
  } catch (error: any) {
    console.error('Get galleries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new gallery
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const body = await request.json();
    const validation = validateRequest(createGallerySchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;

    // If userId not provided, return error (manager must specify client)
    if (!data.userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    const gallery = await prisma.gallery.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
        bookingId: data.bookingId,
        price: data.price,
        isFree: data.isFree,
        visibility: data.visibility,
        status: 'DRAFT',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ gallery }, { status: 201 });
  } catch (error: any) {
    console.error('Create gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

