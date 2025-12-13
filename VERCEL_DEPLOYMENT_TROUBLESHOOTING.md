# Vercel Deployment Troubleshooting Guide

## Issue: Site Not Accessible Through Domain or Vercel Links

If you cannot access your site through `photosbyzee.com` or any Vercel deployment links, follow these steps:

---

## Step 1: Check Vercel Build Status

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Deployments** tab
4. Check the **latest deployment**:
   - ✅ **Ready** = Build succeeded
   - ❌ **Error** = Build failed (check logs)
   - ⏳ **Building** = Still deploying

**If build failed:**
- Click on the failed deployment
- Check **Build Logs** for errors
- Common issues:
  - Missing environment variables
  - TypeScript errors
  - Missing dependencies
  - Database connection errors

---

## Step 2: Verify Environment Variables

Your site requires these environment variables in Vercel:

### Required Variables:

1. **DATABASE_URL** (CRITICAL)
   ```
   Format: postgresql://user:password@host:port/database?schema=public
   Example: postgresql://user:pass@db.vercel.com:5432/photosbyzee
   ```
   - **Where to get it**: Vercel Postgres dashboard → Connection String
   - **If missing**: Site will crash on any database operation

2. **JWT_SECRET** (CRITICAL)
   ```
   Format: Any long random string (minimum 32 characters)
   Example: your-super-secret-jwt-key-change-this-in-production-12345
   ```
   - **If missing**: Authentication will fail

### Optional Variables (for contact form):

3. **SMTP_HOST** (for contact form emails)
   ```
   Example: smtp.gmail.com
   ```

4. **SMTP_PORT**
   ```
   Example: 587
   ```

5. **SMTP_USER** (your email)
   ```
   Example: zeecox13@gmail.com
   ```

6. **SMTP_PASS** (your email password or app password)
   ```
   Example: your-app-password
   ```

### How to Add Environment Variables in Vercel:

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Your database connection string
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**
5. **Redeploy** your project (Vercel → Deployments → Click "..." → Redeploy)

---

## Step 3: Check Database Connection

### If using Vercel Postgres:

1. Go to Vercel Dashboard → Your Project → **Storage** tab
2. Create a Postgres database if you haven't
3. Copy the **Connection String**
4. Add it as `DATABASE_URL` environment variable
5. Run migrations:
   ```bash
   # In Vercel, you can use the CLI or add a build script
   npx prisma migrate deploy
   ```

### If using external database:

1. Ensure your database is accessible from the internet
2. Check firewall rules allow Vercel IPs
3. Verify connection string format is correct

---

## Step 4: Check Domain Configuration

### In Vercel:

1. Go to **Settings** → **Domains**
2. Verify `photosbyzee.com` is listed
3. Check status:
   - ✅ **Valid** = Domain is configured correctly
   - ⚠️ **Pending** = DNS propagation in progress (wait 24-48 hours)
   - ❌ **Invalid** = DNS misconfigured

### DNS Configuration:

Your domain should have these DNS records (in Cloudflare or your DNS provider):

**For photosbyzee.com:**
```
Type: A
Name: @
Content: 76.76.21.21 (or IP Vercel provides)
Proxy: ON (orange cloud)
```

**For www.photosbyzee.com:**
```
Type: CNAME
Name: www
Content: cname.vercel-dns.com (or what Vercel provides)
Proxy: ON (orange cloud)
```

### Verify DNS:

1. Go to [DNS Checker](https://dnschecker.org)
2. Enter `photosbyzee.com`
3. Check if A record points to Vercel's IP
4. Wait 24-48 hours for DNS propagation

---

## Step 5: Check Runtime Errors

Even if the build succeeds, runtime errors can prevent the site from loading:

### Common Runtime Errors:

1. **Missing DATABASE_URL**
   - Error: "PrismaClientInitializationError"
   - Fix: Add `DATABASE_URL` environment variable

2. **Missing JWT_SECRET**
   - Error: "JWT_SECRET is not defined"
   - Fix: Add `JWT_SECRET` environment variable

3. **Database Connection Failed**
   - Error: "Can't reach database server"
   - Fix: Check database URL, firewall, and network access

4. **Prisma Client Not Generated**
   - Error: "Cannot find module '@prisma/client'"
   - Fix: Ensure `postinstall` script runs: `"postinstall": "prisma generate"`

### How to Check Runtime Errors:

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on latest deployment → **Functions** tab
3. Check for any error logs
4. Or use Vercel CLI:
   ```bash
   vercel logs [deployment-url]
   ```

---

## Step 6: Test Deployment Locally

Before deploying, test your build locally:

```bash
# Install dependencies
npm install

# Set environment variables (create .env.local)
DATABASE_URL="your-database-url"
JWT_SECRET="your-jwt-secret"

# Build the project
npm run build

# Start production server
npm start
```

If local build fails, fix those issues first.

---

## Step 7: Force Redeploy

After fixing environment variables:

1. Go to Vercel Dashboard → **Deployments**
2. Click "..." on latest deployment
3. Select **Redeploy**
4. Or push a new commit to trigger auto-deploy

---

## Quick Checklist

- [ ] Build status is "Ready" (not "Error")
- [ ] `DATABASE_URL` environment variable is set
- [ ] `JWT_SECRET` environment variable is set
- [ ] Database is accessible and migrations are run
- [ ] Domain DNS records point to Vercel
- [ ] Domain status in Vercel is "Valid"
- [ ] No runtime errors in Vercel logs
- [ ] Local build succeeds (`npm run build`)

---

## Common Error Messages & Solutions

### "PrismaClientInitializationError: Can't reach database server"
**Solution**: 
- Check `DATABASE_URL` is set correctly
- Verify database is accessible from internet
- Check firewall rules

### "JWT_SECRET is not defined"
**Solution**: 
- Add `JWT_SECRET` environment variable in Vercel
- Use a long random string (32+ characters)

### "404 Not Found" on all routes
**Solution**: 
- Check build completed successfully
- Verify routes exist in `app/` directory
- Check for Route Segment Config errors
- Ensure no client/server component mismatches

### "Domain not configured"
**Solution**: 
- Add domain in Vercel Settings → Domains
- Configure DNS records correctly
- Wait for DNS propagation (24-48 hours)

### "Build failed: Module not found"
**Solution**: 
- Run `npm install` locally
- Check `package.json` has all dependencies
- Ensure `node_modules` is not in `.gitignore` incorrectly

---

## Still Not Working?

1. **Check Vercel Build Logs**: Look for specific error messages
2. **Check Browser Console**: Open DevTools → Console for client-side errors
3. **Check Network Tab**: See if requests are failing
4. **Contact Vercel Support**: If domain/DNS issues persist

---

## Next Steps After Site is Accessible

1. ✅ Test home page loads
2. ✅ Test navigation works
3. ✅ Test client login/registration
4. ✅ Test manager login
5. ✅ Test contact form (if email configured)
6. ✅ Test booking flow
7. ✅ Verify SSL certificate (HTTPS padlock)

