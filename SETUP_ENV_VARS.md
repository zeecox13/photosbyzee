# How to Add Environment Variables in Vercel

## Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click on your project: **photosbyzee**

2. **Navigate to Environment Variables**
   - Click **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add DATABASE_URL**
   - Click the **"Key"** field
   - Type: `DATABASE_URL`
   - Click the **"Value"** field
   - For now, use a placeholder: `postgresql://placeholder:placeholder@localhost:5432/placeholder`
   - (We'll set up a real database later)
   - Click the **"Environments"** dropdown
   - Select: **Production, Preview, and Development** (all three)
   - Click **"Save"**

4. **Add JWT_SECRET**
   - Click **"+ Add Another"** button
   - In the **"Key"** field, type: `JWT_SECRET`
   - In the **"Value"** field, type any long random string, for example:
     ```
     your-super-secret-jwt-key-change-this-in-production-12345
     ```
   - Click the **"Environments"** dropdown
   - Select: **Production, Preview, and Development** (all three)
   - Click **"Save"**

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** (three dots) on the latest deployment
   - Click **"Redeploy"**
   - Wait for deployment to complete

## What These Variables Do

- **DATABASE_URL**: Connection string for your database (required for login, bookings, galleries)
- **JWT_SECRET**: Secret key for encrypting authentication tokens (required for login)

## Temporary Solution

If you don't have a database set up yet, you can use placeholder values just to get the site running. The static pages (home, portfolio, services, contact) should work even without a real database.

