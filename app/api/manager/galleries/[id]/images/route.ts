/**
 * Manager Gallery Images API Routes
 * POST /api/manager/galleries/[id]/images - Upload/add images to gallery
 * GET /api/manager/galleries/[id]/images - List images in gallery
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager } from '@/lib/middleware';
import { z } from 'zod';

const addImageSchema = z.object({
  url: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  filename: z.string(),
  price: z.number().min(0).default(0),
  order: z.number().int().optional(),
});

// GET - List images in gallery
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const images = await prisma.image.findMany({
      where: { galleryId: params.id },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add image to gallery
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    // Verify gallery exists
    const gallery = await prisma.gallery.findUnique({
      where: { id: params.id },
    });

    if (!gallery) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = addImageSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const image = await prisma.image.create({
      data: {
        ...data,
        galleryId: params.id,
      },
    });

    return NextResponse.json({ image }, { status: 201 });
  } catch (error: any) {
    console.error('Add image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

