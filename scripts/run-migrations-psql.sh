#!/bin/bash

# Run Supabase migrations using psql
# This script will prompt for the database password

echo "🚀 Running Supabase migrations with psql..."
echo ""
echo "📋 You'll need your database password."
echo "   Get it from: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/settings/database"
echo ""

# Read password securely
read -sp "Enter database password: " DB_PASSWORD
echo ""

# Connection string
CONNECTION_STRING="postgresql://postgres.xtrmhxdxxkenwdhjwzls:${DB_PASSWORD}@aws-0-us-west-2.pooler.supabase.com:6543/postgres"

# Migration file
MIGRATION_FILE="scripts/setup-migrations.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "❌ Migration file not found: $MIGRATION_FILE"
  exit 1
fi

echo "📝 Running migrations..."
psql "$CONNECTION_STRING" < "$MIGRATION_FILE"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migrations completed successfully!"
else
  echo ""
  echo "❌ Migration failed. Please check the error above."
  echo ""
  echo "💡 Alternative: Use Supabase Dashboard"
  echo "   1. Go to: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new"
  echo "   2. Copy contents of: $MIGRATION_FILE"
  echo "   3. Paste and click 'Run'"
  exit 1
fi

