# Domain & Service Setup Guide - Photos by Zee

This guide will walk you through connecting your domain, Vercel, GitHub, and Stripe accounts.

## Overview
- **Domain**: photosbyzee.com (managed in Cloudflare)
- **Hosting**: Vercel (for frontend deployment)
- **Version Control**: GitHub (for code repository)
- **Payments**: Stripe (for payment processing)

---

## Step 1: GitHub Setup

### What You Need:
- GitHub account (create at https://github.com if you don't have one)
- Repository for your code

### Steps:
1. **Create GitHub Account** (if needed)
   - Go to https://github.com
   - Sign up for free account

2. **Create New Repository**
   - Click "+" in top right → "New repository"
   - Name: `photosbyzee` (or your preferred name)
   - Set to **Private** (recommended for business)
   - Don't initialize with README (we'll add files)
   - Click "Create repository"

3. **Get Repository URL**
   - Copy the repository URL (e.g., `https://github.com/yourusername/photosbyzee.git`)
   - You'll need this for Vercel

### Information to Save:
- ✅ GitHub username: `_________________`
- ✅ Repository name: `_________________`
- ✅ Repository URL: `_________________`

---

## Step 2: Stripe Setup

### What You Need:
- Stripe account
- API keys (test and live)

### Steps:
1. **Create Stripe Account**
   - Go to https://stripe.com
   - Click "Start now" or "Sign in"
   - Complete account setup
   - Verify email address

2. **Get Your API Keys**
   - In Stripe Dashboard, go to **Developers** → **API keys**
   - You'll see two sets of keys:
     - **Test mode keys** (for development)
     - **Live mode keys** (for production - activate after testing)

3. **Get Your Keys:**
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`)
   - Click "Reveal" to see secret key

4. **Set Up Webhook** (for payment confirmations)
   - Go to **Developers** → **Webhooks**
   - Click "Add endpoint"
   - Endpoint URL: `https://your-backend-url.com/api/webhooks/stripe`
   - Select events to listen to:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copy the **Webhook signing secret** (starts with `whsec_`)

### Information to Save:
- ✅ Stripe Account Email: `_________________`
- ✅ Test Publishable Key: `pk_test__________________`
- ✅ Test Secret Key: `sk_test__________________`
- ✅ Live Publishable Key: `pk_live__________________` (get after going live)
- ✅ Live Secret Key: `sk_live__________________` (get after going live)
- ✅ Webhook Signing Secret: `whsec__________________`

---

## Step 3: Cloudflare Domain Setup

### What You Need:
- Domain registered (photosbyzee.com)
- Cloudflare account
- Access to domain DNS settings

### Steps:
1. **Add Domain to Cloudflare**
   - Go to https://cloudflare.com
   - Sign up or log in
   - Click "Add a Site"
   - Enter: `photosbyzee.com`
   - Select plan (Free plan works fine)
   - Cloudflare will scan your DNS records

2. **Update Nameservers** (if needed)
   - Cloudflare will give you nameservers like:
     - `alice.ns.cloudflare.com`
     - `bob.ns.cloudflare.com`
   - Go to your domain registrar (where you bought the domain)
   - Update nameservers to Cloudflare's nameservers
   - Wait 24-48 hours for propagation

3. **Get Cloudflare Information**
   - **Zone ID**: Found in domain overview (right sidebar)
   - **API Token**: 
     - Go to **My Profile** → **API Tokens**
     - Click "Create Token"
     - Use "Edit zone DNS" template
     - Select your domain
     - Copy the token

### Information to Save:
- ✅ Cloudflare Account Email: `_________________`
- ✅ Zone ID: `_________________`
- ✅ API Token: `_________________`
- ✅ Current Nameservers: 
   - `_________________`
   - `_________________`

---

## Step 4: Vercel Setup

### What You Need:
- Vercel account
- GitHub repository connected
- Domain ready to connect

### Steps:
1. **Create Vercel Account**
   - Go to https://vercel.com
   - Click "Sign Up"
   - **Choose "Continue with GitHub"** (this links them automatically)
   - Authorize Vercel to access GitHub

2. **Import Your Project**
   - In Vercel dashboard, click "Add New" → "Project"
   - Select your GitHub repository (`photosbyzee`)
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other (or Static if available)
   - **Root Directory**: `./` (root)
   - **Build Command**: Leave empty (static site)
   - **Output Directory**: Leave empty
   - Click "Deploy"

4. **Get Vercel Information**
   - After deployment, you'll get a URL like: `photosbyzee.vercel.app`
   - **Project ID**: Found in project settings
   - **Deployment URL**: `_________________`

5. **Connect Custom Domain**
   - In project settings, go to **Domains**
   - Enter: `photosbyzee.com`
   - Click "Add"
   - Vercel will show DNS records to add

### Information to Save:
- ✅ Vercel Account Email: `_________________`
- ✅ Project Name: `_________________`
- ✅ Deployment URL: `photosbyzee.vercel.app`
- ✅ Project ID: `_________________`

---

## Step 5: Connect Domain to Vercel (DNS Configuration)

### What You Need:
- Cloudflare DNS access
- Vercel domain configuration

### Steps:
1. **In Vercel:**
   - Go to your project → **Settings** → **Domains**
   - Add `photosbyzee.com` and `www.photosbyzee.com`
   - Vercel will show DNS records needed

2. **In Cloudflare:**
   - Go to **DNS** → **Records**
   - Add these records (Vercel will tell you exact values):

   **For photosbyzee.com:**
   ```
   Type: A
   Name: @
   Content: 76.76.21.21 (or IP Vercel provides)
   Proxy: Proxied (orange cloud ON)
   ```

   **For www.photosbyzee.com:**
   ```
   Type: CNAME
   Name: www
   Content: cname.vercel-dns.com (or what Vercel provides)
   Proxy: Proxied (orange cloud ON)
   ```

3. **Wait for Propagation**
   - DNS changes can take 24-48 hours
   - Check status in Vercel dashboard
   - Once active, you'll see green checkmarks

### Information to Save:
- ✅ DNS Records Added: Yes / No
- ✅ Domain Status: Pending / Active

---

## Step 6: SSL Certificate (Automatic)

### What Happens:
- Vercel automatically provisions SSL certificates
- Cloudflare also provides SSL (use "Full" or "Full (strict)" mode)
- Your site will be HTTPS automatically

### Cloudflare SSL Settings:
1. Go to **SSL/TLS** in Cloudflare
2. Set encryption mode to **"Full"** or **"Full (strict)"**
3. This ensures secure connection between Cloudflare and Vercel

---

## Step 7: Environment Variables Setup

### In Vercel:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these variables (we'll use test keys first):

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### For Backend (when you set it up):
You'll need a backend service (separate from Vercel) for:
- Database connections
- API endpoints
- Stripe webhooks
- Email/SMS services

**Recommended Backend Hosting:**
- Railway.app
- Render.com
- Heroku
- AWS
- DigitalOcean

---

## Quick Reference: Where to Find Everything

### GitHub
- **URL**: https://github.com
- **Repository**: Your code repository
- **Settings**: Repository → Settings

### Stripe
- **URL**: https://dashboard.stripe.com
- **API Keys**: Developers → API keys
- **Webhooks**: Developers → Webhooks
- **Test Mode**: Toggle in top right

### Cloudflare
- **URL**: https://dash.cloudflare.com
- **DNS**: Select domain → DNS → Records
- **SSL**: Select domain → SSL/TLS
- **Zone ID**: Domain overview (right sidebar)

### Vercel
- **URL**: https://vercel.com/dashboard
- **Projects**: Your deployed projects
- **Domains**: Project → Settings → Domains
- **Environment Variables**: Project → Settings → Environment Variables
- **Deployments**: See all deployments and logs

---

## Security Checklist

Before going live:
- [ ] Use **Live** Stripe keys (not test)
- [ ] Set Cloudflare SSL to "Full (strict)"
- [ ] Enable Cloudflare security features
- [ ] Set up Vercel environment variables
- [ ] Use strong passwords for all accounts
- [ ] Enable 2FA on all accounts (GitHub, Vercel, Stripe, Cloudflare)
- [ ] Review Cloudflare firewall rules
- [ ] Set up Vercel password protection for staging (optional)

---

## Testing Your Setup

1. **Domain Connection:**
   - Visit `https://photosbyzee.com`
   - Should show your Vercel-deployed site
   - Check for SSL padlock in browser

2. **GitHub → Vercel:**
   - Make a small change in GitHub
   - Vercel should auto-deploy
   - Check Vercel dashboard for new deployment

3. **Stripe (Test Mode):**
   - Use test card: `4242 4242 4242 4242`
   - Any future date for expiry
   - Any 3 digits for CVC
   - Test a payment flow

---

## Common Issues & Solutions

### Domain Not Connecting
- **Issue**: Domain shows "Pending" in Vercel
- **Solution**: 
  - Check DNS records in Cloudflare match Vercel's requirements
  - Wait 24-48 hours for DNS propagation
  - Verify nameservers are set to Cloudflare

### SSL Certificate Issues
- **Issue**: "Not Secure" in browser
- **Solution**: 
  - Set Cloudflare SSL to "Full" mode
  - Wait for Vercel SSL to provision (automatic)
  - Clear browser cache

### Vercel Not Deploying
- **Issue**: Changes not showing up
- **Solution**:
  - Check GitHub repository is connected
  - Verify Vercel has access to repository
  - Check deployment logs in Vercel

### Stripe Webhook Not Working
- **Issue**: Payments not confirming
- **Solution**:
  - Verify webhook URL is correct
  - Check webhook signing secret matches
  - Use Stripe CLI for local testing first

---

## Next Steps After Setup

1. ✅ All accounts connected
2. ⏳ Deploy your code to GitHub
3. ⏳ Connect GitHub to Vercel
4. ⏳ Set up environment variables
5. ⏳ Test domain connection
6. ⏳ Set up backend service (for API)
7. ⏳ Configure Stripe webhooks
8. ⏳ Test payment flow
9. ⏳ Go live!

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Cloudflare Docs**: https://developers.cloudflare.com
- **Stripe Docs**: https://stripe.com/docs
- **GitHub Docs**: https://docs.github.com

---

**Important Notes:**
- Keep all API keys and secrets secure
- Never commit secrets to GitHub
- Use environment variables for all sensitive data
- Test everything in test/staging mode first
- Enable 2FA on all accounts

Once you have all this information, we can proceed with the actual integration and deployment!

