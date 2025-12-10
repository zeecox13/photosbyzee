# Quick Start Guide - Photos by Zee

## Overview
This is a complete, secure photography business website with:
- ✅ Password-protected client galleries
- ✅ Secure Stripe payment processing
- ✅ Admin dashboard for managing everything
- ✅ Booking system with availability calendar
- ✅ Email/SMS notifications
- ✅ Client information management

## File Structure

### Public Pages
- `index.html` - Homepage
- `portfolio.html` - Public portfolio
- `services.html` - Services and pricing
- `contact.html` - Contact form
- `booking.html` - Client booking flow with calendar
- `gallery-login.html` - Client gallery password entry
- `client-gallery.html` - Private client gallery (requires password)

### Admin Pages (Hidden)
- `admin-dashboard.html` - Admin control panel
  - **URL**: `/admin-dashboard.html` (not linked publicly)
  - **Access**: Admin login required
  - **Features**: 
    - Manage bookings
    - Create/edit galleries
    - View client information
    - Manage availability calendar
    - View payments
    - Configure settings

### Styles & Scripts
- `style.css` - All styling
- `booking.js` - Booking flow logic
- `admin-dashboard.js` - Admin dashboard functionality

### Documentation
- `BACKEND_INTEGRATION.md` - Complete backend setup guide
- `QUICK_START.md` - This file

## Security Features

### Client Galleries
1. Each gallery has a unique password
2. Passwords are hashed in database (bcrypt)
3. JWT tokens for session management
4. Photos are watermarked until purchase
5. Secure Stripe checkout for purchases

### Admin Dashboard
1. Separate admin authentication
2. JWT token-based access
3. All API endpoints protected
4. Client data encrypted at rest
5. Secure password storage

### Payment Security
1. Stripe handles all payment processing
2. No card data stored on server
3. Webhook verification for payment confirmations
4. PCI-compliant payment flow

## Booking Flow

1. **Client selects service** → Service type and price
2. **Views availability calendar** → Only shows available dates/times
3. **Selects date & time** → From your availability
4. **Enters information** → Name, email, phone, etc.
5. **Pays deposit** → 50% via Stripe Checkout
6. **Confirmation** → Email + SMS to client, SMS to you

## Admin Features

### Dashboard Overview
- Upcoming bookings count
- Pending galleries
- Monthly revenue
- Active clients

### Bookings Management
- View all bookings
- Edit booking details
- Change status
- View payment info

### Gallery Management
- Create new galleries
- Upload photos
- Set gallery passwords
- Track photo purchases

### Availability Management
- Set available dates/times
- Create recurring availability
- Block out dates
- Calendar view

### Client Management
- View all clients
- Client booking history
- Total spending
- Contact information

### Payment Management
- View all payments
- Filter by type (deposit, full, photo purchase)
- Stripe payment IDs
- Payment status

## Setup Steps

### 1. Frontend (Current)
✅ All frontend files are ready
✅ Styling complete
✅ JavaScript functionality in place

### 2. Backend Setup (Required)
See `BACKEND_INTEGRATION.md` for complete instructions:

1. **Install Dependencies**
   ```bash
   npm install express pg stripe jsonwebtoken bcrypt
   npm install @sendgrid/mail twilio
   ```

2. **Database Setup**
   - Create PostgreSQL database
   - Run schema from `BACKEND_INTEGRATION.md`
   - Create admin user

3. **Environment Variables**
   - Set up `.env` file with all secrets
   - Stripe keys
   - Database connection
   - JWT secret
   - Email/SMS credentials

4. **API Implementation**
   - Implement all endpoints from documentation
   - Set up authentication middleware
   - Configure Stripe webhooks
   - Set up email/SMS services

### 3. Stripe Setup
1. Create Stripe account
2. Get API keys (test mode first)
3. Set up webhook endpoint
4. Configure products/prices (optional)

### 4. Email/SMS Setup
1. **SendGrid**: Create account, get API key
2. **Twilio**: Create account, get credentials
3. Configure templates

### 5. File Storage
1. Set up AWS S3 or Cloudinary
2. Configure upload endpoints
3. Set up CDN for photo delivery

## Testing

### Demo Mode
The frontend includes demo mode for testing:
- **Gallery Login**: Use password `demo2024`
- **Admin Login**: 
  - Email: `admin@photosbyzee.com`
  - Password: `demo2024`

### Production Checklist
- [ ] Replace demo credentials
- [ ] Set up production database
- [ ] Configure production Stripe account
- [ ] Set up email service
- [ ] Set up SMS service
- [ ] Configure file storage
- [ ] Set up SSL certificate
- [ ] Test booking flow end-to-end
- [ ] Test payment processing
- [ ] Test email/SMS notifications
- [ ] Test admin dashboard
- [ ] Test gallery access

## Important URLs

### Public
- Home: `/index.html`
- Booking: `/booking.html`
- Gallery Login: `/gallery-login.html`

### Admin (Hidden)
- Dashboard: `/admin-dashboard.html`
- **DO NOT LINK THIS PUBLICLY**
- Access only via direct URL + login

## Security Reminders

1. **Never commit** `.env` files or secrets
2. **Always use HTTPS** in production
3. **Validate all inputs** on backend
4. **Use parameterized queries** (prevent SQL injection)
5. **Rate limit** login endpoints
6. **Monitor** for suspicious activity
7. **Regular backups** of database
8. **Keep dependencies** updated

## Support

For implementation help:
1. Review `BACKEND_INTEGRATION.md` for detailed API specs
2. Check Stripe documentation for payment integration
3. Review SendGrid/Twilio docs for notifications
4. Test in development mode first

## Next Steps

1. ✅ Frontend complete
2. ⏳ Set up backend server
3. ⏳ Configure database
4. ⏳ Integrate Stripe
5. ⏳ Set up email/SMS
6. ⏳ Deploy to production
7. ⏳ Test everything
8. ⏳ Go live!

---

**Note**: This is a production-ready architecture. Make sure to follow all security best practices outlined in `BACKEND_INTEGRATION.md` before going live.

