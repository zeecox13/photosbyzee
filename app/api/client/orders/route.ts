/**
 * Client Orders API Routes
 * GET /api/client/orders - Get client's order history
 * POST /api/client/orders - Create a new order (purchase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireClient, validateRequest } from '@/lib/middleware';
import { createOrderSchema } from '@/lib/validations';

// GET - Get client's orders
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;

    const orders = await prisma.order.findMany({
      where: { userId: user.userId },
      include: {
        gallery: {
          select: {
            id: true,
            title: true,
          },
        },
        items: {
          include: {
            image: {
              select: {
                id: true,
                url: true,
                thumbnailUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Get client orders error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new order
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireClient(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { user } = authResult;
    const body = await request.json();
    const validation = validateRequest(createOrderSchema, body);
    
    if (!validation.success) {
      return validation.error;
    }

    const { galleryId, imageIds, totalAmount } = validation.data;

    // If purchasing entire gallery
    if (galleryId) {
      const gallery = await prisma.gallery.findUnique({
        where: { id: galleryId },
        include: { images: true },
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

      // Create order for entire gallery
      const order = await prisma.order.create({
        data: {
          userId: user.userId,
          galleryId: galleryId,
          totalAmount: gallery.price || totalAmount,
          status: 'PENDING', // Will be updated when payment is confirmed
          items: {
            create: gallery.images.map((img) => ({
              imageId: img.id,
              price: img.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              image: true,
            },
          },
        },
      });

      return NextResponse.json({ order }, { status: 201 });
    }

    // If purchasing individual images
    if (imageIds && imageIds.length > 0) {
      // Verify all images exist and belong to client's galleries
      const images = await prisma.image.findMany({
        where: {
          id: { in: imageIds },
          gallery: {
            userId: user.userId, // Ensure images belong to client's galleries
          },
        },
        include: {
          gallery: true,
        },
      });

      if (images.length !== imageIds.length) {
        return NextResponse.json(
          { error: 'Some images not found or access denied' },
          { status: 400 }
        );
      }

      // Calculate total from image prices
      const calculatedTotal = images.reduce((sum, img) => sum + img.price, 0);
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        return NextResponse.json(
          { error: 'Total amount mismatch' },
          { status: 400 }
        );
      }

      // Create order for individual images
      const order = await prisma.order.create({
        data: {
          userId: user.userId,
          galleryId: images[0].galleryId, // Use first image's gallery
          totalAmount: calculatedTotal,
          status: 'PENDING',
          items: {
            create: images.map((img) => ({
              imageId: img.id,
              price: img.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              image: true,
            },
          },
        },
      });

      return NextResponse.json({ order }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Either galleryId or imageIds must be provided' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Create client order error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

