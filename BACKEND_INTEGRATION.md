# Backend Integration Guide - Photos by Zee

This document provides comprehensive instructions for implementing the secure backend infrastructure for the Photos by Zee website.

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Authentication & Security](#authentication--security)
5. [Stripe Integration](#stripe-integration)
6. [Email & SMS Integration](#email--sms-integration)
7. [Deployment](#deployment)

---

## System Architecture

### Recommended Stack
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL (recommended) or MySQL
- **Authentication**: JWT tokens with bcrypt for password hashing
- **Payment Processing**: Stripe API
- **Email Service**: SendGrid or AWS SES
- **SMS Service**: Twilio
- **File Storage**: AWS S3 or Cloudinary for photos
- **Hosting**: AWS, Heroku, or DigitalOcean

### Project Structure
```
backend/
├── config/
│   ├── database.js
│   ├── stripe.js
│   └── email.js
├── models/
│   ├── User.js
│   ├── Booking.js
│   ├── Gallery.js
│   ├── Client.js
│   └── Payment.js
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── bookings.js
│   ├── galleries.js
│   └── payments.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── controllers/
│   ├── adminController.js
│   ├── bookingController.js
│   └── galleryController.js
└── server.js
```

---

## Database Schema

### Users Table (Admin)
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Clients Table
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    service_type VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    location TEXT,
    notes TEXT,
    total_price DECIMAL(10, 2) NOT NULL,
    deposit_amount DECIMAL(10, 2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    stripe_payment_intent_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Galleries Table
```sql
CREATE TABLE galleries (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    booking_id INTEGER REFERENCES bookings(id),
    gallery_password VARCHAR(255) NOT NULL,
    gallery_url VARCHAR(255) UNIQUE NOT NULL,
    session_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gallery Photos Table
```sql
CREATE TABLE gallery_photos (
    id SERIAL PRIMARY KEY,
    gallery_id INTEGER REFERENCES galleries(id),
    photo_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    price DECIMAL(10, 2) DEFAULT 25.00,
    purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Availability Table
```sql
CREATE TABLE availability (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_day VARCHAR(20), -- 'Monday', 'Tuesday', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Payments Table
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id),
    client_id INTEGER REFERENCES clients(id),
    stripe_payment_intent_id VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_type VARCHAR(50), -- 'deposit', 'full', 'photo_purchase'
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Photo Purchases Table
```sql
CREATE TABLE photo_purchases (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    gallery_id INTEGER REFERENCES galleries(id),
    photo_id INTEGER REFERENCES gallery_photos(id),
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Endpoints

### Authentication Endpoints

#### POST /api/admin/login
Admin login
```json
Request:
{
  "email": "admin@photosbyzee.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "admin@photosbyzee.com",
    "role": "admin"
  }
}
```

#### POST /api/admin/verify
Verify admin token
```json
Response:
{
  "valid": true,
  "user": { ... }
}
```

#### POST /api/gallery/verify
Verify gallery password
```json
Request:
{
  "password": "gallery_password",
  "galleryId": "optional_gallery_id"
}

Response:
{
  "success": true,
  "token": "gallery_jwt_token",
  "galleryId": "gallery_id"
}
```

### Booking Endpoints

#### GET /api/availability
Get available dates for a month
```json
Query: ?year=2024&month=2

Response:
{
  "availableDates": [1, 2, 5, 8, 12, 15, ...]
}
```

#### GET /api/availability/times
Get available times for a date
```json
Query: ?date=2024-02-15

Response:
{
  "times": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
}
```

#### POST /api/bookings/create
Create new booking
```json
Request:
{
  "service": "family",
  "price": 350,
  "date": "2024-02-15",
  "time": "2:00 PM",
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "555-1234",
  "location": "Central Park",
  "notes": "Family of 4"
}

Response:
{
  "success": true,
  "bookingId": 123,
  "sessionId": "stripe_checkout_session_id",
  "stripePublishableKey": "pk_test_..."
}
```

### Gallery Endpoints

#### GET /api/gallery/:galleryId/photos
Get photos for a gallery (requires authentication)
```json
Response:
{
  "photos": [
    {
      "id": 1,
      "url": "https://...",
      "thumbnail": "https://...",
      "price": 25.00,
      "purchased": false
    }
  ]
}
```

#### POST /api/gallery/:galleryId/purchase
Purchase photos (creates Stripe checkout)
```json
Request:
{
  "photoIds": [1, 2, 3],
  "total": 75.00
}

Response:
{
  "success": true,
  "sessionId": "stripe_checkout_session_id"
}
```

### Admin Endpoints

#### GET /api/admin/stats
Get dashboard statistics
```json
Response:
{
  "upcomingBookings": 5,
  "pendingGalleries": 3,
  "monthRevenue": 2450.00,
  "activeClients": 12
}
```

#### GET /api/admin/bookings
Get all bookings
```json
Response:
{
  "bookings": [
    {
      "id": 1,
      "date": "2024-02-15",
      "time": "2:00 PM",
      "client": "Jane Smith",
      "service": "Family Session",
      "status": "Confirmed",
      "deposit": "$175"
    }
  ]
}
```

#### POST /api/admin/availability
Create/update availability
```json
Request:
{
  "date": "2024-02-15",
  "startTime": "9:00 AM",
  "endTime": "5:00 PM",
  "isRecurring": false,
  "recurringDay": null
}
```

---

## Authentication & Security

### Password Hashing
```javascript
const bcrypt = require('bcrypt');

// Hash password
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Token Generation
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

### Middleware for Protected Routes
```javascript
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};
```

### Security Best Practices
1. **HTTPS Only**: All API calls must use HTTPS
2. **Rate Limiting**: Implement rate limiting on login endpoints
3. **CORS**: Configure CORS to only allow your domain
4. **Input Validation**: Validate and sanitize all user inputs
5. **SQL Injection Prevention**: Use parameterized queries
6. **XSS Protection**: Sanitize outputs
7. **Environment Variables**: Store secrets in environment variables
8. **Regular Updates**: Keep dependencies updated

---

## Stripe Integration

### Setup
1. Create Stripe account at https://stripe.com
2. Get API keys from dashboard
3. Install Stripe SDK: `npm install stripe`

### Configuration
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
```

### Create Checkout Session for Booking Deposit
```javascript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: `${serviceType} - Deposit`,
      },
      unit_amount: depositAmount * 100, // Convert to cents
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${process.env.FRONTEND_URL}/booking.html?step=5&session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.FRONTEND_URL}/booking.html?step=4`,
  metadata: {
    bookingId: booking.id,
    type: 'deposit'
  }
});
```

### Webhook Handler for Payment Confirmation
```javascript
app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update booking status
    await updateBookingPayment(session.metadata.bookingId, session.payment_intent);
    
    // Send confirmation emails
    await sendBookingConfirmation(session.metadata.bookingId);
    await sendAdminNotification(session.metadata.bookingId);
  }

  res.json({received: true});
});
```

### Security for Stripe
- **Webhook Signing**: Always verify webhook signatures
- **Idempotency**: Use idempotency keys for payments
- **PCI Compliance**: Never store full card numbers
- **HTTPS**: All Stripe API calls must use HTTPS

---

## Email & SMS Integration

### Email Setup (SendGrid)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: clientEmail,
  from: 'zee@photosbyzee.com',
  subject: 'Booking Confirmed - Photos by Zee',
  html: emailTemplate
};

await sgMail.send(msg);
```

### SMS Setup (Twilio)
```javascript
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

await client.messages.create({
  body: `Your booking with Photos by Zee is confirmed for ${date} at ${time}. Confirmation #${bookingId}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: clientPhone
});
```

### Email Templates
Create templates for:
- Booking confirmation (client)
- Booking notification (admin)
- Gallery ready notification
- Payment receipt
- Password reset

---

## Deployment

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/photosbyzee

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
SENDGRID_API_KEY=SG....

# SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Frontend
FRONTEND_URL=https://photosbyzee.com

# File Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=photosbyzee-galleries
```

### Deployment Steps
1. Set up PostgreSQL database
2. Run migrations to create tables
3. Create admin user
4. Configure environment variables
5. Deploy backend to hosting service
6. Set up SSL certificate
7. Configure domain
8. Test all endpoints
9. Set up monitoring and backups

### Recommended Hosting
- **Backend**: Heroku, AWS Elastic Beanstalk, or DigitalOcean App Platform
- **Database**: AWS RDS, Heroku Postgres, or DigitalOcean Managed Database
- **File Storage**: AWS S3 or Cloudinary
- **CDN**: CloudFront or Cloudflare

---

## Testing Checklist

- [ ] Admin login/logout
- [ ] Gallery password authentication
- [ ] Booking creation with calendar
- [ ] Stripe payment processing
- [ ] Email confirmations
- [ ] SMS notifications
- [ ] Admin dashboard data loading
- [ ] Gallery photo viewing
- [ ] Photo purchase flow
- [ ] Availability management
- [ ] Client data security

---

## Support & Maintenance

### Regular Tasks
- Monitor Stripe webhook logs
- Review failed payment attempts
- Check email delivery rates
- Update dependencies monthly
- Review security logs
- Backup database daily
- Test booking flow weekly

### Security Monitoring
- Set up alerts for failed login attempts
- Monitor for unusual API activity
- Regular security audits
- Keep all dependencies updated
- Review access logs regularly

---

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Twilio Documentation](https://www.twilio.com/docs)
- [JWT Best Practices](https://jwt.io/introduction)
- [OWASP Security Guidelines](https://owasp.org/)

---

**Important**: This is a production-ready architecture. Make sure to:
1. Use environment variables for all secrets
2. Enable HTTPS everywhere
3. Implement proper error handling
4. Set up logging and monitoring
5. Regular security audits
6. Keep all dependencies updated

