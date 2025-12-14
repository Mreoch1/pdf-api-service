# Quick Start Checklist

Use this checklist to track your setup progress. Check off each item as you complete it.

## Prerequisites
- [ ] GitHub repo created (✅ Already done!)
- [ ] Code committed and pushed (✅ Already done!)

## Step 1: Supabase Setup
- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL
- [ ] Copied anon public key
- [ ] Copied service_role key
- [ ] Ran migration `001_initial_schema.sql`
- [ ] Ran migration `002_increment_free_tier_function.sql`

## Step 2: Stripe Setup
- [ ] Created Stripe account
- [ ] Created "Pro Plan" product ($9/month)
- [ ] Copied Pro Plan Price ID
- [ ] Created "Enterprise Plan" product ($49/month)
- [ ] Copied Enterprise Plan Price ID
- [ ] Copied Publishable key
- [ ] Copied Secret key
- [ ] Created webhook endpoint (use placeholder URL for now)

## Step 3: Local Testing
- [ ] Created `.env.local` file
- [ ] Filled in all Supabase variables
- [ ] Filled in all Stripe variables
- [ ] Filled in Price IDs
- [ ] Ran `npm run dev`
- [ ] Tested signup
- [ ] Tested API key creation
- [ ] Tested PDF generation

## Step 4: Vercel Deployment
- [ ] Installed Vercel CLI (or use web interface)
- [ ] Deployed to Vercel
- [ ] Added all environment variables to Vercel
- [ ] Updated `NEXT_PUBLIC_APP_URL` in Vercel
- [ ] Updated Stripe webhook URL with Vercel URL
- [ ] Updated webhook secret in Vercel
- [ ] Tested production deployment

## Step 5: Go Live
- [ ] Switched Stripe to Live mode
- [ ] Updated Vercel with Live Stripe keys
- [ ] Created Live products in Stripe
- [ ] Updated Price IDs in Vercel
- [ ] Final production test

## Step 6: Launch
- [ ] Submitted to Product Hunt
- [ ] Posted on social media
- [ ] Submitted sitemap to Google
- [ ] Shared in developer communities

---

**Estimated Time**: 30-45 minutes total
**Current Status**: Code ready, waiting for Supabase & Stripe setup

