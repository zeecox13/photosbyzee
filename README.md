# Photos by Zee - Full Stack Photography Site

A complete backend system for a photography business with secure manager and client dashboards, gallery management, booking system, and analytics.

## Features

### Manager Dashboard
- **Secure Authentication**: JWT-based login system for managers/admins
- **Gallery Management**: Create, edit, publish, unpublish, and delete galleries
- **Image Management**: Upload and manage images within galleries
- **Booking Management**: View, edit, and manage all bookings
- **Availability Management**: Set available time slots for bookings
- **Analytics & Reports**: View KPIs, revenue, page views, and booking statistics

### Client Dashboard
- **Secure Client Login**: Separate authentication system for clients
- **Account Management**: Clients can register and manage their accounts
- **Booking Requests**: Request new bookings based on available time slots
- **Gallery Access**: View assigned galleries and purchase photos
- **Order History**: View past purchases and orders

### Security Features
- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (Manager vs Client)
- Protected API routes with middleware
- Client data isolation (clients only see their own data)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas
- **Deployment**: Vercel-ready

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

1. Create a PostgreSQL database (local or use Vercel Postgres)
2. Copy `.env.example` to `.env` and fill in your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/photosbyzee?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

3. Generate Prisma Client:

```bash
npm run db:generate
```

4. Push the schema to your database:

```bash
npm run db:push
```

### 3. Create First Manager Account

Run the seed script to create your first manager:

```bash
npx ts-node scripts/create-manager.ts
```

Or manually create a manager using the Prisma Studio:

```bash
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Manager Login: http://localhost:3000/manager/login
- Client Login: http://localhost:3000/client/login

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── manager/           # Manager API routes
│   │   └── client/            # Client API routes
│   ├── manager/               # Manager dashboard pages
│   └── client/                # Client dashboard pages
├── lib/
│   ├── auth.ts                # JWT and password utilities
│   ├── db.ts                  # Prisma client
│   ├── middleware.ts          # Auth middleware
│   └── validations.ts         # Zod schemas
├── prisma/
│   └── schema.prisma          # Database schema
└── scripts/
    └── create-manager.ts      # Script to create manager account
```

## API Endpoints

### Authentication
- `POST /api/auth/manager/login` - Manager login
- `POST /api/auth/client/login` - Client login
- `POST /api/auth/client/register` - Client registration
- `GET /api/auth/verify` - Verify token

### Manager APIs
- `GET /api/manager/galleries` - List galleries
- `POST /api/manager/galleries` - Create gallery
- `GET /api/manager/galleries/[id]` - Get gallery
- `PUT /api/manager/galleries/[id]` - Update gallery
- `DELETE /api/manager/galleries/[id]` - Delete gallery
- `GET /api/manager/bookings` - List bookings
- `POST /api/manager/bookings` - Create booking
- `GET /api/manager/analytics` - Get analytics
- `GET /api/manager/availability` - Get availability slots
- `POST /api/manager/availability` - Create availability slot

### Client APIs
- `GET /api/client/bookings` - Get client's bookings
- `POST /api/client/bookings` - Create booking request
- `GET /api/client/galleries` - Get client's galleries
- `GET /api/client/galleries/[id]` - Get gallery details
- `GET /api/client/orders` - Get order history
- `POST /api/client/orders` - Create order
- `GET /api/client/availability` - Get available slots

## Database Models

- **User**: Managers and clients with role-based access
- **Gallery**: Photo collections assigned to clients
- **Image**: Individual photos within galleries
- **Booking**: Photo session appointments
- **Order**: Purchases of galleries or images
- **OrderItem**: Individual items in an order
- **PageView**: Analytics tracking
- **AvailabilitySlot**: Available booking time slots

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **Password Hashing**: All passwords are hashed with bcrypt (12 rounds)
4. **Role-Based Access**: Middleware enforces manager vs client permissions
5. **Data Isolation**: Clients can only access their own data
6. **Input Validation**: All API endpoints validate input with Zod

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL` (use Vercel Postgres)
   - `JWT_SECRET`
4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
5. Create your first manager account

## Next Steps

- [ ] Integrate Stripe for payment processing
- [ ] Add image upload functionality (S3, Cloudinary, etc.)
- [ ] Implement email notifications
- [ ] Add SMS notifications for bookings
- [ ] Create gallery password system
- [ ] Add image editing/cropping features
- [ ] Implement search and filtering
- [ ] Add export functionality for reports

## License

Private - All rights reserved

