# How to Check Vercel Function Logs for Errors

## Step-by-Step Instructions

### 1. Access Function Logs
1. Go to **Vercel Dashboard** → Your Project (`photosbyzee`)
2. Click **Deployments** tab
3. Click on the **latest deployment** (the one that just finished)
4. Click the **"Functions"** tab (next to "Deployment", "Logs", "Resources", etc.)

### 2. Trigger a Request
1. In another tab, try to access your site:
   - `https://photosbyzee-git-main-zyanya-s-projects.vercel.app/`
2. Go back to the Functions tab
3. You should see function invocations appear

### 3. Check for Errors
Look for:
- **Red error messages**
- **Stack traces**
- **"Error:" or "Failed:" messages**
- **Any text in red**

### 4. What to Look For
Common errors:
- `PrismaClientInitializationError`
- `JWT_SECRET is not defined`
- `Cannot find module`
- `localStorage is not defined` (SSR error)
- `window is not defined` (SSR error)

### 5. Alternative: Check Runtime Logs
1. In Vercel Dashboard → Your Project
2. Click **Logs** tab (in the top navigation)
3. Try accessing your site
4. Watch for errors in real-time

## What to Share

If you find errors, please share:
1. **The exact error message** (copy/paste)
2. **Which function** it occurred in (e.g., `GET /`)
3. **The full stack trace** if available

This will help identify the exact issue causing the 404 errors.

