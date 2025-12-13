# How to Fix DATABASE_URL Connection String

## The Problem
If your Supabase password has special characters, they need to be URL-encoded in the connection string.

## Step-by-Step Fix

### 1. Get Your Supabase Connection String
From Supabase dashboard, copy the connection string:
```
postgresql://postgres:[YOUR_PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### 2. URL-Encode Special Characters in Password
If your password contains any of these characters, they need encoding:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| `:` | `%3A` |
| ` ` (space) | `%20` |

### 3. Example
If your password is: `my@pass#123`
- Encoded password: `my%40pass%23123`
- Full connection string: `postgresql://postgres:my%40pass%23123@db.xxxxx.supabase.co:5432/postgres`

### 4. Update in Vercel
1. Go to Vercel → Settings → Environment Variables
2. Find `DATABASE_URL`
3. Click "..." → Edit
4. Paste the connection string with the URL-encoded password
5. Make sure it's `DATABASE_URL` (uppercase) not `database_url`
6. Save

### 5. Redeploy
1. Go to Deployments → Latest
2. Click "..." → Redeploy
3. Wait for it to finish

### 6. Test
Visit: `https://photosbyzee.com/api/health`

You should see:
```json
{
  "status": "ok",
  "hasDatabase": true,
  "hasJwtSecret": true
}
```

If `hasDatabase` is still `false`, the variable isn't being read correctly.

## Alternative: Use Supabase Connection Pooler

If URL encoding is confusing, use Supabase's connection pooler instead:

1. In Supabase dashboard, go to **Settings** → **Database**
2. Find **Connection Pooling**
3. Copy the **Session mode** connection string (starts with `postgresql://`)
4. This connection string is already properly formatted
5. Use this in Vercel instead of the direct connection string

## Quick Check: Is the Variable Actually Set?

1. In Vercel → Settings → Environment Variables
2. Look for `DATABASE_URL` (uppercase, exactly)
3. Click "..." → Edit
4. The value should show (even if masked)
5. Make sure it's selected for **Production, Preview, and Development**

If you see `database_url` (lowercase) instead, that's the problem - rename it!

