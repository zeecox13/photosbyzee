# Setup Information Worksheet

Fill this out as you go through the setup process. Keep this file **PRIVATE** and never commit it to GitHub.

---

## GitHub Information

- [ ] Account created
- **Username**: `_________________`
- **Email**: `_________________`
- **Repository Name**: `_________________`
- **Repository URL**: `https://github.com/_________________/_________________`
- **Repository is**: [ ] Public [ ] Private

---

## Stripe Information

- [ ] Account created
- **Account Email**: `_________________`
- **Account Status**: [ ] Test Mode [ ] Live Mode

### Test Mode Keys (for development)
- **Publishable Key**: `pk_test__________________`
- **Secret Key**: `sk_test__________________`

### Live Mode Keys (for production - get when ready)
- **Publishable Key**: `pk_live__________________`
- **Secret Key**: `sk_live__________________`

### Webhook Setup
- [ ] Webhook endpoint created
- **Webhook URL**: `https://_________________/api/webhooks/stripe`
- **Webhook Signing Secret**: `whsec__________________`
- **Events Listening To**: 
  - [ ] checkout.session.completed
  - [ ] payment_intent.succeeded
  - [ ] payment_intent.payment_failed

---

## Cloudflare Information

- [ ] Account created
- **Account Email**: `_________________`
- **Domain Added**: `photosbyzee.com`

### Domain Details
- **Zone ID**: `_________________`
- **Status**: [ ] Active [ ] Pending

### Nameservers (if you updated them)
- **NS1**: `_________________`
- **NS2**: `_________________`
- **Updated**: [ ] Yes [ ] No
- **Date Updated**: `_________________`

### API Access
- [ ] API Token created
- **API Token**: `_________________`
- **Permissions**: Edit zone DNS

### DNS Records (for Vercel)
- [ ] A record added for `@` (root domain)
- **A Record IP**: `_________________`
- [ ] CNAME record added for `www`
- **CNAME Target**: `_________________`

### SSL Settings
- **SSL Mode**: [ ] Off [ ] Flexible [ ] Full [ ] Full (strict)
- **Recommended**: Full (strict)

---

## Vercel Information

- [ ] Account created
- **Account Email**: `_________________`
- **Connected to GitHub**: [ ] Yes [ ] No

### Project Details
- **Project Name**: `_________________`
- **Deployment URL**: `https://_________________.vercel.app`
- **Project ID**: `_________________`
- **GitHub Repo Connected**: [ ] Yes [ ] No

### Domain Configuration
- [ ] Custom domain added
- **Domain**: `photosbyzee.com`
- **Status**: [ ] Pending [ ] Active [ ] Error
- **www.photosbyzee.com**: [ ] Added [ ] Active

### Environment Variables (add these in Vercel)
- [ ] STRIPE_PUBLISHABLE_KEY added
- [ ] STRIPE_SECRET_KEY added (if needed for frontend)
- [ ] Other variables: `_________________`

---

## Connection Status Checklist

### GitHub → Vercel
- [ ] Vercel account connected to GitHub
- [ ] Repository imported to Vercel
- [ ] Auto-deployment enabled
- [ ] Tested: Made change in GitHub, Vercel auto-deployed

### Domain → Cloudflare
- [ ] Domain added to Cloudflare
- [ ] Nameservers updated (if needed)
- [ ] DNS records configured
- [ ] SSL certificate active

### Cloudflare → Vercel
- [ ] DNS records point to Vercel
- [ ] Domain verified in Vercel
- [ ] SSL working (green padlock in browser)
- [ ] Site accessible at photosbyzee.com

### Stripe Integration
- [ ] Stripe account created
- [ ] API keys obtained
- [ ] Webhook endpoint configured (when backend is ready)
- [ ] Test payment successful

---

## Testing Checklist

### Domain & Hosting
- [ ] Can access site at `https://photosbyzee.com`
- [ ] Can access site at `https://www.photosbyzee.com`
- [ ] SSL certificate active (green padlock)
- [ ] Site loads correctly
- [ ] No mixed content warnings

### GitHub Integration
- [ ] Code pushed to GitHub
- [ ] Vercel detects GitHub changes
- [ ] Auto-deployment works
- [ ] Can see deployment logs in Vercel

### Stripe (Test Mode)
- [ ] Can create test payment
- [ ] Payment processes successfully
- [ ] Webhook receives events (when backend ready)
- [ ] Test cards work:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`

---

## Security Checklist

- [ ] 2FA enabled on GitHub
- [ ] 2FA enabled on Vercel
- [ ] 2FA enabled on Stripe
- [ ] 2FA enabled on Cloudflare
- [ ] Strong passwords on all accounts
- [ ] API keys stored securely (not in code)
- [ ] Environment variables configured
- [ ] No secrets committed to GitHub

---

## Backend Service (Future - for API)

**Recommended Options:**
- [ ] Railway.app
- [ ] Render.com
- [ ] Heroku
- [ ] AWS
- [ ] DigitalOcean

**When ready, you'll need:**
- Backend hosting service
- Database (PostgreSQL)
- Environment variables for:
  - Database connection
  - Stripe keys
  - JWT secret
  - Email service
  - SMS service

---

## Notes & Issues

**Issues Encountered:**
```
1. 
2. 
3. 
```

**Questions:**
```
1. 
2. 
3. 
```

**Next Steps:**
```
1. 
2. 
3. 
```

---

## Quick Links

- **GitHub**: https://github.com/_________________
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Cloudflare Dashboard**: https://dash.cloudflare.com
- **Your Site**: https://photosbyzee.com

---

**Remember**: 
- Keep this file private
- Never commit secrets to GitHub
- Use environment variables for all sensitive data
- Test everything before going live

