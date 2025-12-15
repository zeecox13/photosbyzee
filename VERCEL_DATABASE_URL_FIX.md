# Fix DATABASE_URL in Vercel - Step by Step

## The Problem
Your app is still trying to connect to the **direct connection** (`db.pkfbyvqbzkiqerblmjzd.supabase.co:5432`) instead of the **connection pooler** (`aws-0-us-west-2.pooler.supabase.com:6543`).

## The Solution
You MUST update the `DATABASE_URL` environment variable in Vercel to use the pooler connection string.

---

## Step 1: Get Your Pooler Connection String from Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **Database** → **Connection Pooling**
4. Select **"Transaction pooler"** tab
5. Copy the connection string shown

It should look like:
```
postgresql://postgres.pkfbyvqbzkiqerblmjzd:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres
```

**Key differences from direct connection:**
- ✅ Username: `postgres.pkfbyvqbzkiqerblmjzd` (includes project ID)
- ✅ Host: `aws-0-us-west-2.pooler.supabase.com` (pooler, NOT `db.xxxxx.supabase.co`)
- ✅ Port: `6543` (pooler port, NOT `5432`)

---

## Step 2: Add SSL Parameter

Add `?sslmode=require` at the end of the connection string:

```
postgresql://postgres.pkfbyvqbzkiqerblmjzd:[YOUR-PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
```

---

## Step 3: Replace [YOUR-PASSWORD]

1. Find your Supabase database password
   - If you don't remember it, go to **Settings** → **Database** → **Database Password**
   - You can reset it if needed
2. Replace `[YOUR-PASSWORD]` in the connection string with your actual password
3. **Important**: If your password has special characters, URL-encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `%` → `%25`
   - `&` → `%26`
   - `=` → `%3D`
   - `+` → `%2B`
   - ` ` (space) → `%20`

**Example:**
If your password is `my@pass#123`, the connection string becomes:
```
postgresql://postgres.pkfbyvqbzkiqerblmjzd:my%40pass%23123@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
```

---

## Step 4: Update DATABASE_URL in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (`photosbyzee`)
3. Go to **Settings** → **Environment Variables**
4. Find `DATABASE_URL` in the list
5. Click the **"..."** menu → **Edit**
6. **Delete the old value completely**
7. **Paste your new pooler connection string** (with password and `?sslmode=require`)
8. Make sure it's set for **Production**, **Preview**, and **Development** (or at least Production)
9. Click **Save**

---

## Step 5: Verify the Connection String

After saving, verify it shows:
- Host contains `pooler.supabase.com` (NOT `db.xxxxx.supabase.co`)
- Port is `6543` (NOT `5432`)
- Username contains your project ID (`postgres.xxxxx`)
- Ends with `?sslmode=require`

---

## Step 6: Redeploy

**IMPORTANT**: Environment variable changes require a redeploy!

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete (2-3 minutes)

---

## Step 7: Test

1. Visit: `https://photosbyzee.com/api/test-db`
2. Check the response:
   - ✅ **Success**: `{"status":"success",...}` → Connection works!
   - ❌ **Error**: Still shows `db.xxxxx.supabase.co:5432` → DATABASE_URL not updated correctly

---

## Troubleshooting

### Still seeing `db.xxxxx.supabase.co:5432`?

1. **Double-check Vercel environment variable:**
   - Go to Settings → Environment Variables
   - Click on `DATABASE_URL` to view it
   - Verify it has `pooler.supabase.com` and port `6543`

2. **Make sure you redeployed:**
   - Environment variables only take effect after redeploy
   - Check Deployments tab for a recent deployment

3. **Check for typos:**
   - Username should be `postgres.pkfbyvqbzkiqerblmjzd` (with project ID)
   - Host should be `aws-0-us-west-2.pooler.supabase.com`
   - Port should be `6543`
   - Should end with `?sslmode=require`

### Connection timeout errors?

- Make sure you're using the **Transaction pooler** (not Session pooler)
- Verify your Supabase project is active
- Check if your IP is blocked (unlikely for pooler)

### Password encoding issues?

- Use an online URL encoder: https://www.urlencoder.org/
- Encode only the password part, not the whole connection string

---

## Quick Checklist

- [ ] Got pooler connection string from Supabase
- [ ] Added `?sslmode=require` at the end
- [ ] Replaced `[YOUR-PASSWORD]` with actual password
- [ ] URL-encoded special characters in password
- [ ] Updated `DATABASE_URL` in Vercel
- [ ] Set for Production environment (at minimum)
- [ ] Redeployed the application
- [ ] Tested `/api/test-db` endpoint
- [ ] Connection shows `pooler.supabase.com:6543` (not `db.xxxxx:5432`)

---

## Example Correct Connection String

```
postgresql://postgres.pkfbyvqbzkiqerblmjzd:your_actual_password_here@aws-0-us-west-2.pooler.supabase.com:6543/postgres?sslmode=require
```

Replace `your_actual_password_here` with your real password (URL-encoded if needed).

