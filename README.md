# PDF Generation API Service

A fully automated PDF generation API service built with Next.js, Supabase, and Stripe. Generate passive income through pay-per-use billing.

## Features

- ✅ HTML to PDF conversion
- ✅ RESTful API with API key authentication
- ✅ Free tier (10 PDFs/month)
- ✅ Pay-per-use billing ($0.01 per PDF)
- ✅ Subscription tiers (Pro, Enterprise)
- ✅ User dashboard with usage tracking
- ✅ Automated billing via Stripe
- ✅ SEO-optimized landing page and documentation
- ✅ Health monitoring and analytics

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: Puppeteer
- **Payments**: Stripe
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Stripe account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pdf-api-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Fill in your environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `NEXT_PUBLIC_APP_URL`: Your app URL (e.g., http://localhost:3000)

4. Set up the database:
   - Create a Supabase project
   - Run the migrations in `supabase/migrations/` in order

5. Set up Stripe:
   - Create products and prices in Stripe dashboard
   - Set up webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
   - Add webhook secret to environment variables

6. Run the development server:
```bash
npm run dev
```

## Project Structure

```
/
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── docs/             # API documentation
│   ├── pricing/          # Pricing page
│   └── blog/             # Blog posts
├── lib/                  # Utility libraries
├── components/           # React components
└── supabase/            # Database migrations
```

## API Usage

### Generate PDF

```bash
curl -X POST https://your-domain.com/api/pdf/generate \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "html": "<h1>Hello World</h1>",
    "format": "A4"
  }' \
  --output document.pdf
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The app will automatically scale and handle traffic.

## Revenue Model

- **Free Tier**: 10 PDFs/month
- **Pay-as-you-go**: $0.01 per PDF
- **Pro**: $9/month for 1,000 PDFs
- **Enterprise**: $49/month for 10,000 PDFs

## License

MIT
