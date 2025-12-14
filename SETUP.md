# Setup Instructions - PDF API Service

Follow these steps to get your PDF API service running and generating passive income.

## Step 1: Set Up Supabase (5 minutes)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: `pdf-api-service`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

### 1.2 Get Supabase Credentials
1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### 1.3 Run Database Migrations
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. Wait for success message
7. Repeat for `supabase/migrations/002_increment_free_tier_function.sql`

**OR use Supabase CLI (if installed):**
```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Step 2: Set Up Stripe (10 minutes)

### 2.1 Create Stripe Account
1. Go to https://stripe.com
2. Sign up or log in
3. Complete account setup (verify email, add business details)
4. Switch to **Test mode** for development (toggle in top right)

### 2.2 Create Products and Prices
1. In Stripe dashboard, go to **Products**
2. Click "+ Add product"
3. Create **Pro Plan**:
   - **Name**: `Pro Plan`
   - **Description**: `1,000 PDFs per month`
   - **Pricing**: `Recurring` → `$9.00 USD` → `Monthly`
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_`) - you'll need this

4. Create **Enterprise Plan**:
   - **Name**: `Enterprise Plan`
   - **Description**: `10,000 PDFs per month`
   - **Pricing**: `Recurring` → `$49.00 USD` → `Monthly`
   - Click "Save product"
   - **Copy the Price ID** (starts with `price_`) - you'll need this

### 2.3 Get Stripe API Keys
1. In Stripe dashboard, go to **Developers** → **API keys**
2. Copy:
   - **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - **Secret key** (starts with `sk_test_` or `sk_live_`) - click "Reveal test key"

### 2.4 Set Up Webhook
1. In Stripe dashboard, go to **Developers** → **Webhooks**
2. Click "+ Add endpoint"
3. For now, use: `https://your-domain.vercel.app/api/webhooks/stripe`
   - (We'll update this after Vercel deployment)
4. Click "Select events" and add:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. **Copy the Signing secret** (starts with `whsec_`) - you'll need this

## Step 3: Configure Environment Variables

### 3.1 Create Local Environment File
```bash
cd /Users/michaelreoch/pdf-api-service
cp .env.local.example .env.local
```

### 3.2 Fill in Environment Variables
Open `.env.local` and replace with your actual values:

```bash
# Supabase (from Step 1.2)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Stripe (from Steps 2.3 and 2.2)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here

# Stripe Price IDs (from Step 2.2)
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_ENTERPRISE_PRICE_ID=price_your_enterprise_price_id

# App URL (update after Vercel deployment)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.3 Test Locally
```bash
npm run dev
```

Visit http://localhost:3000 and test:
- Sign up for an account
- Create an API key
- Generate a test PDF

## Step 4: Deploy to Vercel (5 minutes)

### 4.1 Install Vercel CLI (if needed)
```bash
npm install -g vercel
```

### 4.2 Deploy
```bash
cd /Users/michaelreoch/pdf-api-service
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `pdf-api-service` (or press Enter)
- **Directory?** → `./` (press Enter)
- **Override settings?** → No

### 4.3 Add Environment Variables to Vercel
1. Go to https://vercel.com/dashboard
2. Select your `pdf-api-service` project
3. Go to **Settings** → **Environment Variables**
4. Add all variables from your `.env.local`:
   - Click "Add New"
   - Add each variable (name and value)
   - Select **Production**, **Preview**, and **Development**
   - Click "Save"

### 4.4 Update Stripe Webhook URL
1. Get your Vercel URL (e.g., `https://pdf-api-service.vercel.app`)
2. Go to Stripe → **Developers** → **Webhooks**
3. Click on your webhook endpoint
4. Click "Update endpoint"
5. Change URL to: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
6. Click "Update endpoint"
7. Copy the new **Signing secret** and update it in Vercel environment variables

### 4.5 Update App URL
1. In Vercel, go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
3. Redeploy: Go to **Deployments** → Click "..." → **Redeploy**

## Step 5: Test Production Deployment

1. Visit your Vercel URL
2. Sign up for a new account
3. Create an API key
4. Test PDF generation:
```bash
curl -X POST https://your-vercel-url.vercel.app/api/pdf/generate \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Test PDF</h1>"}' \
  --output test.pdf
```

## Step 6: Go Live with Stripe

1. In Stripe dashboard, switch from **Test mode** to **Live mode**
2. Get your **Live** API keys (Publishable and Secret)
3. Update Vercel environment variables with live keys
4. Create live products and prices
5. Update price IDs in Vercel
6. Redeploy

## Step 7: Launch & Marketing

### 7.1 Submit to Product Hunt
- Prepare: Screenshot, description, tagline
- Submit on a Tuesday-Thursday
- Engage with comments

### 7.2 Share on Social Media
- Twitter/X: Tag #buildinpublic, #indiehackers
- Reddit: r/webdev, r/SaaS, r/indiebiz
- Hacker News: Post in "Show HN"

### 7.3 SEO Optimization
- The blog posts are already created
- Submit sitemap to Google Search Console
- Get backlinks from developer communities

## Troubleshooting

### Build Errors
- Make sure all environment variables are set in Vercel
- Check that Supabase migrations ran successfully
- Verify Stripe webhook URL is correct

### PDF Generation Fails
- Check Vercel function logs
- Verify Puppeteer is working (may need Vercel Pro for larger PDFs)
- Check API key is valid

### Stripe Webhooks Not Working
- Verify webhook URL in Stripe matches Vercel URL
- Check webhook secret is correct
- View webhook events in Stripe dashboard

## Next Steps

1. Monitor usage in dashboard
2. Set up alerts for errors
3. Add more features based on user feedback
4. Scale as needed (Vercel handles this automatically)

## Support

- Check logs in Vercel dashboard
- Supabase logs: Project → Logs
- Stripe events: Developers → Events

---

**You're all set!** Your PDF API service is now live and ready to generate passive income. 🚀

