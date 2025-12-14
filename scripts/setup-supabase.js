#!/usr/bin/env node

/**
 * Setup Supabase migrations using the REST API
 */

const https = require('https');

const SUPABASE_URL = 'https://xtrmhxdxxkenwdhjwzls.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0cm1oeGR4eGtlbndkaGp3emxzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTY4Mzk4OSwiZXhwIjoyMDgxMjU5OTg5fQ.sm5A5ubRGAFoc6FP8vN-DAv_g4wJfPJ7orLMBABye40';

const fs = require('fs');
const path = require('path');

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    // Use Supabase REST API to execute SQL
    // Note: This requires using the PostgREST API or Management API
    // For migrations, we'll use psql if available, otherwise provide instructions
    
    const postData = JSON.stringify({ query: sql });
    
    const options = {
      hostname: 'xtrmhxdxxkenwdhjwzls.supabase.co',
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(body);
        } else {
          // Try alternative: use psql
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

async function setupSupabase() {
  console.log('🚀 Setting up Supabase database...\n');

  // Read migration file
  const migrationPath = path.join(__dirname, 'setup-migrations.sql');
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Migration file not found:', migrationPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📝 Migration file loaded');
  console.log('⚠️  Supabase CLI requires database password for migrations');
  console.log('');
  console.log('📋 To run migrations, choose one:');
  console.log('');
  console.log('Option 1: Use Supabase Dashboard (Easiest)');
  console.log('   1. Go to: https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/sql/new');
  console.log('   2. Copy contents of: scripts/setup-migrations.sql');
  console.log('   3. Paste and click "Run"');
  console.log('');
  console.log('Option 2: Use psql (if you have database password)');
  console.log('   Run: psql "postgresql://postgres.xtrmhxdxxkenwdhjwzls:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres" < scripts/setup-migrations.sql');
  console.log('');
  console.log('Option 3: Use Supabase CLI');
  console.log('   Run: supabase db push');
  console.log('   (You\'ll be prompted for database password)');
  console.log('');
  
  // Try to use psql if available
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    await execAsync('which psql');
    console.log('💡 psql is available. You can run migrations with:');
    console.log('   psql "postgresql://postgres.xtrmhxdxxkenwdhjwzls:[PASSWORD]@aws-0-us-west-2.pooler.supabase.com:6543/postgres" < scripts/setup-migrations.sql');
    console.log('');
    console.log('   Get your database password from:');
    console.log('   https://supabase.com/dashboard/project/xtrmhxdxxkenwdhjwzls/settings/database');
  } catch (e) {
    console.log('💡 Install psql for command-line migrations, or use the dashboard method above.');
  }
  
  console.log('✅ Migration file ready at: scripts/setup-migrations.sql');
}

setupSupabase();

