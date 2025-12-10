/**
 * Client Gallery Detail API Route
 * GET /api/client/galleries/[id] - Get gallery details (only if owned by client)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireClient } from '@/lib/middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    const gallery = await prisma.gallery.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: {
            order: 'asc',
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
      },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    // Security check: ensure client owns this gallery
    if (gallery.userId !== user.userId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Track page view
    await prisma.pageView.create({
      data: {
        path: `/client/galleries/${params.id}`,
        userId: user.userId,
        galleryId: params.id,
      },
    });

    return NextResponse.json({ gallery });
  } catch (error: any) {
    console.error('Get client gallery error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

