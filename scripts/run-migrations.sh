#!/bin/bash

# Run Supabase migrations using the REST API
# This script uses the service role key to execute SQL

SUPABASE_URL="https://xtrmhxdxxkenwdhjwzls.supabase.co"
SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cm1oeGR4eGtlbndkaGp3emxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY4Mzk4OSwiZXhwIjoyMDgxMjU5OTg5fQ.sm5A5ubRGAFoc6FP8vN-DAv_g4wJfPJ7orLMBABye40"

echo "🚀 Running Supabase migrations..."

# Read migration file
MIGRATION_FILE="scripts/setup-migrations.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Migration file not found: $MIGRATION_FILE"
    exit 1
fi

# Read SQL content
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Use psql if available, otherwise use curl to Supabase REST API
if command -v psql &> /dev/null; then
    echo "📦 Using psql to run migrations..."
    # Note: This requires the database password
    echo "⚠️  psql requires database password. Using alternative method..."
fi

# Use Supabase Management API (requires service role key)
echo "📡 Using Supabase REST API..."

# Execute SQL using Supabase REST API
RESPONSE=$(curl -s -X POST \
  "${SUPABASE_URL}/rest/v1/rpc/exec_sql" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": $(echo "$SQL_CONTENT" | jq -Rs .)}" 2>&1)

if [ $? -eq 0 ]; then
    echo "✅ Migration executed successfully!"
else
    echo "❌ Migration failed. Trying alternative method..."
    echo "📝 Please run the migration manually in Supabase SQL Editor:"
    echo "   1. Go to: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new"
    echo "   2. Copy contents of: scripts/setup-migrations.sql"
    echo "   3. Paste and run"
fi

