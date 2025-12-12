# Vercel Deployment Troubleshooting Checklist

## Current Status Check

### 1. Verify Vercel Project Connection
- [ ] Is your GitHub repository connected to Vercel?
- [ ] Can you see the project in Vercel dashboard?
- [ ] Are deployments showing up in Vercel?

**Check:** Go to https://vercel.com/dashboard and verify your project exists

### 2. Check Build Configuration
Your `package.json` has:
- ✅ Build command: `prisma generate && next build`
- ✅ Postinstall: `prisma generate`

**Potential Issue:** Vercel needs to know this is a Next.js project.

### 3. Environment Variables in Vercel
Required environment variables:
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `JWT_SECRET` - Secret key for JWT tokens
- [ ] `GMAIL_USER` - Email for contact form (optional, defaults to zeecox13@gmail.com)
- [ ] `GMAIL_APP_PASSWORD` or `GMAIL_PASSWORD` - Email password

**Action:** Go to Vercel → Your Project → Settings → Environment Variables

### 4. Database Setup
- [ ] Is your database accessible from Vercel?
- [ ] Is the DATABASE_URL correct for production?
- [ ] Have you run migrations? (`npx prisma migrate deploy`)

**Note:** Vercel Postgres is recommended for easy setup.

### 5. Domain Configuration
- [ ] Is `photosbyzee.com` added in Vercel project settings?
- [ ] Are DNS records correctly configured in Cloudflare?
- [ ] What's the domain status in Vercel? (Pending/Active/Error)

**Check DNS Records:**
- A record: `@` → Vercel IP (usually 76.76.21.21 or what Vercel provides)
- CNAME: `www` → `cname.vercel-dns.com` (or what Vercel provides)

### 6. Build Logs
Check Vercel deployment logs for errors:
- [ ] Go to Vercel → Your Project → Deployments → Click latest deployment
- [ ] Look for build errors
- [ ] Check if Prisma is generating correctly
- [ ] Verify Next.js build completes

## Common Issues & Solutions

### Issue 1: Build Fails - Prisma Error
**Error:** `EPERM: operation not permitted` or Prisma client generation fails

**Solution:**
1. Add to `package.json`:
```json
"postinstall": "prisma generate"
```
2. In Vercel, set build command to: `next build` (Vercel will run postinstall automatically)
3. Or use: `prisma generate && next build`

### Issue 2: Domain Not Resolving
**Symptoms:** Domain shows "Pending" or doesn't load

**Solutions:**
1. **Check DNS Records:**
   - Verify A record points to Vercel IP
   - Verify CNAME for www subdomain
   - Wait 24-48 hours for DNS propagation

2. **Check Cloudflare Settings:**
   - SSL/TLS mode should be "Full" or "Full (strict)"
   - Proxy status should be ON (orange cloud)

3. **Verify in Vercel:**
   - Go to Settings → Domains
   - Check domain status
   - Vercel will show what DNS records are needed

### Issue 3: 500 Errors / API Routes Not Working
**Symptoms:** Site loads but API calls fail

**Solutions:**
1. **Check Environment Variables:**
   - All required vars are set in Vercel
   - DATABASE_URL is correct
   - JWT_SECRET is set

2. **Check Database Connection:**
   - Database is accessible from Vercel
   - Firewall allows Vercel IPs
   - Connection string is correct

3. **Check Build Logs:**
   - Prisma client generated successfully
   - No TypeScript errors
   - All dependencies installed

### Issue 4: Vercel Deployment Not Triggering
**Symptoms:** Changes not deploying automatically

**Solutions:**
1. **Check GitHub Connection:**
   - Vercel has access to your GitHub repo
   - Repository is not private (or Vercel has access)
   - Branch is set correctly (usually `main` or `master`)

2. **Manual Deploy:**
   - Go to Vercel → Deployments → "Redeploy"
   - Or push a new commit to trigger deployment

## Step-by-Step Fix

### Step 1: Verify Vercel Project
1. Go to https://vercel.com/dashboard
2. Find your project (should be named `photosbyzee` or similar)
3. If not found, import from GitHub:
   - Click "Add New" → "Project"
   - Select your GitHub repository
   - Click "Import"

### Step 2: Configure Build Settings
1. Go to Project → Settings → General
2. Verify:
   - **Framework Preset:** Next.js (should auto-detect)
   - **Build Command:** `next build` (or `prisma generate && next build`)
   - **Output Directory:** (leave empty, Next.js handles this)
   - **Install Command:** `npm install` (or `npm ci`)

### Step 3: Set Environment Variables
1. Go to Project → Settings → Environment Variables
2. Add these variables (for Production, Preview, and Development):
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_jwt_secret_key
   GMAIL_USER=zeecox13@gmail.com
   GMAIL_APP_PASSWORD=your_app_password
   ```

### Step 4: Set Up Database
**Option A: Use Vercel Postgres (Recommended)**
1. In Vercel dashboard, go to Storage
2. Create a Postgres database
3. Copy the connection string
4. Add as `DATABASE_URL` environment variable

**Option B: Use External Database**
1. Ensure database is accessible from internet
2. Add connection string to environment variables
3. Run migrations: `npx prisma migrate deploy`

### Step 5: Configure Domain
1. Go to Project → Settings → Domains
2. Add `photosbyzee.com`
3. Add `www.photosbyzee.com`
4. Vercel will show DNS records needed
5. Add those records in Cloudflare DNS

### Step 6: Run Database Migrations
After first deployment, run:
```bash
npx prisma migrate deploy
```
Or use Vercel CLI:
```bash
vercel env pull .env.production
npx prisma migrate deploy
```

### Step 7: Test Deployment
1. Check deployment logs in Vercel
2. Visit your Vercel URL (e.g., `photosbyzee.vercel.app`)
3. Test domain (e.g., `photosbyzee.com`)
4. Test API routes
5. Check browser console for errors

## Quick Diagnostic Commands

### Check if code is pushed to GitHub:
```bash
git status
git log --oneline -5
```

### Check Vercel CLI (if installed):
```bash
vercel --version
vercel ls
vercel inspect
```

### Test build locally:
```bash
npm run build
```

## Next Steps After Fixing

1. ✅ Verify site loads on Vercel URL
2. ✅ Verify site loads on custom domain
3. ✅ Test API endpoints
4. ✅ Test database connections
5. ✅ Set up monitoring/alerts
6. ✅ Configure backups

## Getting Help

If still having issues:
1. Check Vercel deployment logs (most detailed)
2. Check browser console for client-side errors
3. Check Network tab for API errors
4. Review Vercel documentation: https://vercel.com/docs
5. Check Next.js deployment guide: https://nextjs.org/docs/deployment

