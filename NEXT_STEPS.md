# Next Steps - Complete Your Setup

## ✅ Step 1: Run Database Migrations (2 minutes)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `scripts/setup-migrations.sql` in this project
5. Copy **ALL** the contents (it's a combined migration file)
6. Paste into the Supabase SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait for "Success. No rows returned" message

**Verify it worked:**
- Go to **Table Editor** in Supabase
- You should see these tables: `api_keys`, `usage_logs`, `subscriptions`, `user_metadata`

## ✅ Step 2: Create Stripe Products (5 minutes)

1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/products
2. Click **+ Add product**

### Create Pro Plan:
- **Name**: `Pro Plan`
- **Description**: `1,000 PDFs per month`
- **Pricing model**: `Standard pricing`
- **Price**: `$9.00`
- **Billing period**: `Monthly`
- Click **Save product**
- **IMPORTANT**: Copy the **Price ID** (starts with `price_` - looks like `price_1ABC...`)

### Create Enterprise Plan:
- Click **+ Add product** again
- **Name**: `Enterprise Plan`
- **Description**: `10,000 PDFs per month`
- **Pricing model**: `Standard pricing`
- **Price**: `$49.00`
- **Billing period**: `Monthly`
- Click **Save product**
- **IMPORTANT**: Copy the **Price ID** (starts with `price_`)

3. Update `.env.local` with the Price IDs:
```bash
STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id_here
```

## ✅ Step 3: Set Up Stripe Webhook (3 minutes)

**For local testing, we'll use Stripe CLI. For production, we'll set up a webhook endpoint.**

### Option A: Use Stripe CLI for Local Testing (Recommended)

1. Install Stripe CLI:
```bash
brew install stripe/stripe-cli/stripe
```

2. Login to Stripe CLI:
```bash
stripe login
```

3. Forward webhooks to localhost:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the webhook signing secret (starts with `whsec_`)
5. Add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

### Option B: Set Up Webhook in Stripe Dashboard (For Production)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **+ Add endpoint**
3. **Endpoint URL**: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - (We'll update this after Vercel deployment)
4. **Description**: `PDF API Service Webhooks`
5. Click **Select events** and add:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **Add endpoint**
7. Copy the **Signing secret** (starts with `whsec_`)
8. Add it to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
```

## ✅ Step 4: Test Locally

1. Start the dev server:
```bash
cd /Users/michaelreoch/pdf-api-service
npm run dev
```

2. Visit: http://localhost:3000

3. Test the flow:
   - Sign up for an account
   - Go to dashboard
   - Create an API key
   - Test PDF generation:
```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Test PDF</h1><p>This is a test!</p>"}' \
  --output test.pdf
```

## ✅ Step 5: Deploy to Vercel

Once local testing works:

1. Install Vercel CLI (if not already):
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd /Users/michaelreoch/pdf-api-service
vercel
```

3. Follow prompts (or use web interface at vercel.com)

4. Add all environment variables to Vercel:
   - Go to project → Settings → Environment Variables
   - Add all variables from `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel URL

5. Update Stripe webhook URL in Stripe dashboard to your Vercel URL

## 🎉 You're Done!

Your PDF API service is now live and ready to generate passive income!

