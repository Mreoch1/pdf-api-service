#!/bin/bash

# Complete Setup Script for PDF API Service
# This script helps you complete the final setup steps

echo "🚀 PDF API Service - Complete Setup"
echo "===================================="
echo ""

# Check if Supabase migrations are needed
echo "📋 Step 1: Supabase Database Migrations"
echo "--------------------------------------"
echo ""
echo "To run migrations, you have 3 options:"
echo ""
echo "✅ EASIEST: Use Supabase Dashboard"
echo "   1. Open: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new"
echo "   2. Open file: scripts/setup-migrations.sql"
echo "   3. Copy ALL contents and paste into SQL Editor"
echo "   4. Click 'Run' button"
echo ""
echo "💻 Option 2: Use psql (requires database password)"
echo "   Get password from: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/settings/database"
echo "   Then run:"
echo "   psql \"postgresql://postgres.xtrmhxdxxkenwdhjwzls:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres\" < scripts/setup-migrations.sql"
echo ""
echo "🔧 Option 3: Use Supabase CLI"
echo "   Run: supabase db push"
echo "   (You'll be prompted for database password)"
echo ""
read -p "Press Enter after you've run the migrations..."

# Verify environment
echo ""
echo "📋 Step 2: Verify Environment Setup"
echo "--------------------------------------"
node scripts/verify-setup.js

# Start Stripe webhook forwarding
echo ""
echo "📋 Step 3: Start Stripe Webhook Forwarding (for local testing)"
echo "------------------------------------------------------------------"
echo ""
echo "In a NEW terminal window, run:"
echo "  stripe listen --forward-to localhost:3000/api/webhooks/stripe"
echo ""
echo "This will forward Stripe webhooks to your local server."
echo "Keep this running while testing locally."
echo ""
read -p "Press Enter to continue..."

# Start dev server
echo ""
echo "📋 Step 4: Start Development Server"
echo "--------------------------------------"
echo ""
echo "Starting dev server..."
echo "Visit: http://localhost:3000"
echo ""
npm run dev

