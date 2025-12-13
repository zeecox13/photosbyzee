# Set Environment Variables via Vercel CLI

If the UI isn't working, try using Vercel CLI:

## Install Vercel CLI (if not installed)
```bash
npm install -g vercel
```

## Login to Vercel
```bash
vercel login
```

## Link to your project (if not already linked)
```bash
vercel link
```

## Set Environment Variables
```bash
# Set DATABASE_URL for all environments
vercel env add DATABASE_URL production preview development

# Set JWT_SECRET for all environments  
vercel env add JWT_SECRET production preview development
```

When prompted, paste your values.

## Verify
```bash
vercel env ls
```

This should show both variables.

## Redeploy
After setting via CLI, go to Vercel Dashboard → Deployments → Latest → Redeploy

