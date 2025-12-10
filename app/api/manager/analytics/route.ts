/**
 * Manager Analytics API Route
 * GET /api/manager/analytics
 * Returns analytics data for a date range
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireManager } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireManager(request);
    if ('error' in authResult) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const galleryId = searchParams.get('galleryId');

    // Default to last 30 days if no date range provided
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Build where clause for date range
    const dateFilter: any = {
      gte: start,
      lte: end,
    };

    // Get bookings count and revenue
    const bookings = await prisma.booking.findMany({
      where: {
        date: dateFilter,
      },
      include: {
        user: true,
      },
    });

    const sessionsBooked = bookings.length;
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
    const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');

    // Calculate revenue from orders
    const ordersWhere: any = {
      createdAt: dateFilter,
      status: 'COMPLETED',
    };
    if (galleryId) {
      ordersWhere.galleryId = galleryId;
    }

    const orders = await prisma.order.findMany({
      where: ordersWhere,
      include: {
        items: true,
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get page views
    const pageViewsWhere: any = {
      viewedAt: dateFilter,
    };
    if (galleryId) {
      pageViewsWhere.galleryId = galleryId;
    }

    const pageViews = await prisma.pageView.findMany({
      where: pageViewsWhere,
    });

    const totalPageViews = pageViews.length;
    const uniqueVisitors = new Set(pageViews.map((pv) => pv.userId).filter(Boolean)).size;

    // Get gallery-specific stats if galleryId provided
    let galleryStats = null;
    if (galleryId) {
      const gallery = await prisma.gallery.findUnique({
        where: { id: galleryId },
        include: {
          _count: {
            select: {
              images: true,
              orders: true,
              pageViews: true,
            },
          },
        },
      });

      if (gallery) {
        galleryStats = {
          id: gallery.id,
          title: gallery.title,
          imageCount: gallery._count.images,
          orderCount: gallery._count.orders,
          viewCount: gallery._count.pageViews,
        };
      }
    }

    // Get overall gallery stats
    const allGalleries = await prisma.gallery.findMany({
      where: {
        createdAt: dateFilter,
      },
      include: {
        _count: {
          select: {
            pageViews: true,
            orders: true,
          },
        },
      },
    });

    const galleryViews = allGalleries.reduce(
      (sum, g) => sum + g._count.pageViews,
      0
    );
    const publishedGalleries = allGalleries.filter(
      (g) => g.status === 'PUBLISHED'
    ).length;

    return NextResponse.json({
      dateRange: {
        start: start.toISOString(),
        end: end.toISOString(),
      },
      kpis: {
        sessionsBooked,
        confirmedSessions: confirmedBookings.length,
        completedSessions: completedBookings.length,
        totalRevenue,
        totalPageViews,
        uniqueVisitors,
        publishedGalleries,
        galleryViews,
      },
      bookings: {
        total: sessionsBooked,
        byStatus: {
          pending: bookings.filter((b) => b.status === 'PENDING').length,
          confirmed: confirmedBookings.length,
          completed: completedBookings.length,
          cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
        },
      },
      revenue: {
        total: totalRevenue,
        orderCount: orders.length,
      },
      traffic: {
        totalViews: totalPageViews,
        uniqueVisitors,
        galleryViews,
      },
      gallery: galleryStats,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

