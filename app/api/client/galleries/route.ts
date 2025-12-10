/**
 * Client Galleries API Route
 * GET /api/client/galleries - Get client's assigned galleries
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

    const { user } = authResult;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {
      userId: user.userId,
      visibility: { not: 'HIDDEN' }, // Don't show hidden galleries
    };
    if (status) where.status = status;

    const galleries = await prisma.gallery.findMany({
      where,
      include: {
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ galleries });
  } catch (error: any) {
    console.error('Get client galleries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

