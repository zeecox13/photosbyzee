/**
 * Validation schemas using Zod
 * Used for request validation in API routes
 */

import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
});

// Gallery schemas
export const createGallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  userId: z.string().optional(), // Optional - defaults to current user
  bookingId: z.string().optional(),
  price: z.number().min(0).optional(),
  isFree: z.boolean().default(false),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'HIDDEN']).default('HIDDEN'),
});

export const updateGallerySchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'HIDDEN']).optional(),
  price: z.number().min(0).optional(),
  isFree: z.boolean().optional(),
});

// Booking schemas
export const createBookingSchema = z.object({
  date: z.string().datetime(), // ISO datetime string
  duration: z.number().int().min(15).max(480).default(60),
  location: z.string().optional(),
  notes: z.string().optional(),
  serviceType: z.string().optional(),
  totalPrice: z.number().min(0).optional(),
});

export const updateBookingSchema = z.object({
  date: z.string().datetime().optional(),
  duration: z.number().int().min(15).max(480).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']).optional(),
  serviceType: z.string().optional(),
  totalPrice: z.number().min(0).optional(),
});

// Availability schemas
export const createAvailabilitySchema = z.object({
  date: z.string().date(), // YYYY-MM-DD
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  isRecurring: z.boolean().default(false),
  recurringDay: z.string().optional(),
});

// Order schemas
export const createOrderSchema = z.object({
  galleryId: z.string().optional(),
  imageIds: z.array(z.string()).min(1, 'At least one image is required'),
  totalAmount: z.number().min(0),
});

// Analytics schemas
export const analyticsQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  galleryId: z.string().optional(),
});

