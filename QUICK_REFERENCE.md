# Quick Reference - Your Credentials

## Supabase
- **URL**: https://xtrmhxdxxkenwdhjwzls.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls
- **SQL Editor**: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new

## Stripe
- **Dashboard**: https://dashboard.stripe.com/test/dashboard
- **Products**: https://dashboard.stripe.com/test/products
- **Webhooks**: https://dashboard.stripe.com/test/webhooks
- **API Keys**: https://dashboard.stripe.com/test/apikeys

## Local Development
- **URL**: http://localhost:3000
- **Start**: `npm run dev`
- **Verify Setup**: `node scripts/verify-setup.js`

## Files to Know
- `.env.local` - Your environment variables (already configured!)
- `scripts/setup-migrations.sql` - Database migrations (run in Supabase)
- `NEXT_STEPS.md` - Detailed next steps

## Quick Commands

```bash
# Verify setup
node scripts/verify-setup.js

# Start dev server
npm run dev

# Test PDF generation (after getting API key)
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"html": "<h1>Test</h1>"}' \
  --output test.pdf

# Deploy to Vercel
vercel
```

