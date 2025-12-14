#!/usr/bin/env node

/**
 * Setup Verification Script
 * Run this to verify your environment is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying PDF API Service Setup...\n');

const envPath = path.join(__dirname, '..', '.env.local');
let allGood = true;

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.local file not found!');
  console.log('   Run: cp .env.local.example .env.local');
  process.exit(1);
}

// Read and check environment variables
const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
];

const optionalVars = [
  'STRIPE_PRO_PRICE_ID',
  'STRIPE_ENTERPRISE_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET',
];

console.log('📋 Checking required environment variables...\n');

requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && match[1].trim() && !match[1].includes('your_')) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`❌ ${varName} - Not set or using placeholder`);
    allGood = false;
  }
});

console.log('\n📋 Checking optional environment variables...\n');

optionalVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && match[1].trim() && !match[1].includes('your_')) {
    console.log(`✅ ${varName}`);
  } else {
    console.log(`⚠️  ${varName} - Not set (required for full functionality)`);
  }
});

console.log('\n📝 Next Steps:\n');

if (!allGood) {
  console.log('1. Complete the required environment variables in .env.local');
  console.log('2. Run database migrations in Supabase SQL Editor');
  console.log('3. Create Stripe products and get Price IDs');
  console.log('4. Set up Stripe webhook and get webhook secret');
} else {
  console.log('1. ✅ Environment variables configured');
  console.log('2. ⏳ Run database migrations in Supabase');
  console.log('3. ⏳ Create Stripe products');
  console.log('4. ⏳ Set up Stripe webhook');
  console.log('\n🚀 Ready to test! Run: npm run dev');
}

console.log('\n📚 See SETUP.md for detailed instructions\n');

process.exit(allGood ? 0 : 1);

