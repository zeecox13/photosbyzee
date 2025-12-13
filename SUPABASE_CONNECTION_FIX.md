# Fix Supabase Connection for Vercel

## The Problem
Vercel serverless functions can't connect to Supabase using the direct connection string (port 5432). You need to use Supabase's **Connection Pooler**.

## Solution: Use Connection Pooler

### Step 1: Get Connection Pooler String from Supabase

1. Go to your Supabase Dashboard
2. Click on your project
3. Go to **Settings** → **Database**
4. Scroll down to **Connection Pooling**
5. Find the **Connection String** section
6. Select **Session mode** (or Transaction mode if Session doesn't work)
7. Copy the connection string - it should look like:
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   Notice it uses port **6543** (not 5432) and has `?pgbouncer=true`

### Step 2: Update in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `DATABASE_URL`
3. Click "..." → Edit
4. Replace the value with the **Connection Pooler** string from Supabase
5. Make sure to replace `[YOUR-PASSWORD]` with your actual database password
6. Click Save

### Step 3: Redeploy

1. Go to Deployments → Latest → "..." → Redeploy
2. Wait for deployment to complete
3. Try logging in again

## Alternative: Add SSL Parameters

If you want to keep using the direct connection, you can try adding SSL parameters:

```
postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

But the Connection Pooler is **strongly recommended** for Vercel/serverless functions.

## Why This Happens

- Vercel serverless functions have short-lived connections
- Supabase direct connections (port 5432) have connection limits
- Connection Pooler (port 6543) is designed for serverless/serverless-like environments
- It handles connection pooling automatically

