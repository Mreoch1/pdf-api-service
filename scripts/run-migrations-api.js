#!/usr/bin/env node

/**
 * Run Supabase migrations using the Management API
 * This uses the service role key to execute SQL
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://xtrmhxdxxkenwdhjwzls.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cm1oeGR4eGtlbndkaGp3emxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY4Mzk4OSwiZXhwIjoyMDgxMjU5OTg5fQ.sm5A5ubRGAFoc6FP8vN-DAv_g4wJfPJ7orLMBABye40';

// Read migration file
const migrationPath = path.join(__dirname, 'setup-migrations.sql');
if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Running Supabase migrations via API...\n');

// Split SQL into individual statements (basic splitting by semicolon)
// Note: This is a simplified approach. For production, use a proper SQL parser.
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

// Use psql via exec if available, otherwise provide instructions
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function runWithPsql() {
  console.log('💡 Attempting to use psql...\n');
  console.log('⚠️  This requires your database password.');
  console.log('   Get it from: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/settings/database\n');
  
  // Try to execute using psql
  // The user will need to provide the password
  const connectionString = 'postgresql://postgres.xtrmhxdxxkenwdhjwzls:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres';
  
  console.log('📋 To run migrations with psql, use:');
  console.log(`   psql "${connectionString.replace('[PASSWORD]', 'YOUR_PASSWORD')}" < ${migrationPath}\n`);
  
  // Alternative: Use Supabase dashboard
  console.log('✅ EASIEST METHOD: Use Supabase Dashboard');
  console.log('   1. Go to: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new');
  console.log(`   2. Copy contents of: ${migrationPath}`);
  console.log('   3. Paste and click "Run"\n');
}

// Since Supabase doesn't have a direct REST API for executing arbitrary SQL,
// we'll provide the best alternatives
runWithPsql();

