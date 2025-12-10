/**
 * Manager Gallery Detail API Routes
 * GET /api/manager/galleries/[id] - Get gallery details
 * PUT /api/manager/galleries/[id] - Update gallery
 * DELETE /api/manager/galleries/[id] - Delete gallery
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager, validateRequest } from '@/lib/middleware';
import { updateGallerySchema } from '@/lib/validations';

// GET - Get gallery by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const gallery = await prisma.gallery.findUnique({
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
        booking: {
          select: {
            id: true,
            date: true,
            serviceType: true,
            location: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            images: true,
            orders: true,
            pageViews: true,
          },
        },
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ gallery });
  } catch (error: any) {
    console.error('Get gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update gallery
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
    const validation = validateRequest(updateGallerySchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const data = validation.data;

    // If publishing, set publishedAt
    const updateData: any = { ...data };
    if (data.status === 'PUBLISHED') {
      updateData.publishedAt = new Date();
    }

    const gallery = await prisma.gallery.update({
      where: { id: params.id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({ gallery });
  } catch (error: any) {
    console.error('Update gallery error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete gallery
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    await prisma.gallery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete gallery error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

