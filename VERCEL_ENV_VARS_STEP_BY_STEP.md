# Step-by-Step Guide: Adding Environment Variables in Vercel

## Overview
Your login is failing because Vercel needs two environment variables:
1. **JWT_SECRET** - Used to encrypt/decrypt authentication tokens
2. **DATABASE_URL** - Connection to your database

---

## Step 1: Open Vercel Dashboard

1. Go to **https://vercel.com/dashboard** in your browser
2. Sign in if you're not already signed in
3. You should see a list of your projects

---

## Step 2: Open Your Project

1. Look for the project named **"photosbyzee"** in the list
2. **Click on it** to open the project dashboard

---

## Step 3: Navigate to Settings

1. Look at the **top navigation bar** (near the top of the page)
2. You should see tabs like: **Overview**, **Deployments**, **Analytics**, **Settings**, etc.
3. **Click on "Settings"**

---

## Step 4: Open Environment Variables

1. After clicking Settings, you'll see a **left sidebar menu**
2. Look for options like:
   - General
   - Domains
   - **Environment Variables** ← Click this one
   - Git
   - Integrations
   - etc.
3. **Click on "Environment Variables"**

---

## Step 5: Add JWT_SECRET

1. You should now see a page with a list of environment variables (might be empty)
2. Look for a button that says **"+ Add New"** or **"Add Another"** (usually at the top)
3. **Click that button**

4. A form will appear with three fields:
   - **Key** (this is the variable name)
   - **Value** (this is the secret value)
   - **Environments** (where to use this variable)

5. **In the "Key" field**, type exactly:
   ```
   JWT_SECRET
   ```
   (All caps, with underscore - must be exact)

6. **In the "Value" field**, type a long random string. For example:
   ```
   my-super-secret-jwt-key-2024-photosbyzee-abc123xyz789-random-string-here
   ```
   - Make it at least 32 characters long
   - Use a mix of letters, numbers, and dashes
   - **Important**: Don't share this value publicly!

7. **In the "Environments" dropdown**, click it and select:
   - ✅ **Production**
   - ✅ **Preview**  
   - ✅ **Development**
   
   (Select all three checkboxes)

8. **Click the "Save" button** (usually at the bottom of the form)

9. You should now see `JWT_SECRET` appear in the list of environment variables

---

## Step 6: Add DATABASE_URL

1. **Click "+ Add New"** again (same button as before)

2. **In the "Key" field**, type exactly:
   ```
   DATABASE_URL
   ```
   (All caps, with underscore - must be exact)

3. **In the "Value" field**, you have two options:

   **Option A: If you have a real database**
   - Paste your database connection string here
   - It usually looks like: `postgresql://user:password@host:port/database`

   **Option B: If you don't have a database yet (placeholder)**
   - Type this placeholder value:
   ```
   postgresql://placeholder:placeholder@localhost:5432/placeholder
   ```
   - This will let the site run, but login won't work until you set up a real database
   - You can update this later when you have a real database

4. **In the "Environments" dropdown**, select:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development**
   
   (Select all three checkboxes)

5. **Click the "Save" button**

6. You should now see both `JWT_SECRET` and `DATABASE_URL` in your list

---

## Step 7: Verify Your Variables

Before redeploying, double-check:

1. You should see **two rows** in the environment variables list:
   - Row 1: `JWT_SECRET` with a long value (partially hidden with dots)
   - Row 2: `DATABASE_URL` with a connection string

2. Both should show **"Production, Preview, Development"** in the Environments column

3. If anything looks wrong, you can:
   - Click the **"..."** (three dots) next to a variable
   - Click **"Edit"** to change it
   - Or click **"Remove"** to delete it and start over

---

## Step 8: Redeploy Your Application

**Important**: Environment variables only take effect after a new deployment!

1. **Click on the "Deployments" tab** (in the top navigation bar)

2. You'll see a list of deployments (most recent at the top)

3. Find the **latest deployment** (should be at the very top)

4. Look for **three dots "..."** on the right side of that deployment row

5. **Click the three dots**

6. A dropdown menu will appear

7. **Click "Redeploy"**

8. A confirmation dialog might appear - **click "Redeploy"** again to confirm

9. You'll see the deployment status change to "Building..." then "Deploying..."

10. **Wait 1-2 minutes** for it to complete

11. When it says **"Ready"** (with a green checkmark), the deployment is done!

---

## Step 9: Test Login

1. Go to **https://photosbyzee.com/client/login**

2. Try logging in with your credentials

3. If it works, you'll be redirected to the dashboard!

4. If it still shows an error:
   - Wait a few more minutes (sometimes it takes a moment)
   - Check the Vercel deployment logs for any errors
   - Make sure both environment variables are saved correctly

---

## Troubleshooting

### Problem: I don't see "Environment Variables" in the sidebar
**Solution**: 
- Make sure you clicked "Settings" first
- Make sure you're in the correct project
- Try refreshing the page

### Problem: I can't click "Save"
**Solution**:
- Make sure you filled in both "Key" and "Value" fields
- Make sure you selected at least one environment (Production, Preview, or Development)
- Try clicking in the "Value" field again to make sure it's active

### Problem: Login still doesn't work after redeploy
**Solution**:
- Double-check that both `JWT_SECRET` and `DATABASE_URL` are in the list
- Make sure the redeploy completed successfully (shows "Ready")
- Check the Vercel Function Logs for error messages:
  - Go to Deployments → Latest → Functions tab
  - Look for any red error messages

### Problem: I need to generate a secure JWT_SECRET
**Solution**: 
You can use this command in your terminal (or just make up a long random string):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or just use a long random string like:
```
photosbyzee-jwt-secret-2024-abc123xyz789-random-key-here-make-it-long
```

---

## What These Variables Do

- **JWT_SECRET**: This is like a password that encrypts your login tokens. Without it, the server can't create secure login tokens, which is why you're getting "Internal server error".

- **DATABASE_URL**: This tells your app where to find your database. Even if you use a placeholder, the app needs this variable to exist, otherwise it might crash when trying to connect.

---

## Next Steps

Once login is working:
1. Set up a real database (if you haven't already)
2. Update `DATABASE_URL` with your real database connection string
3. Redeploy again
4. Test creating a new account and logging in

---

## Quick Checklist

Before you finish, make sure:
- [ ] `JWT_SECRET` is added with a long random value
- [ ] `DATABASE_URL` is added (placeholder is fine for now)
- [ ] Both variables have Production, Preview, and Development selected
- [ ] You clicked "Save" for both variables
- [ ] You redeployed the latest deployment
- [ ] The redeploy shows "Ready" status
- [ ] You tested login again

If all checkboxes are checked, login should work! 🎉

