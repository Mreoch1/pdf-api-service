#!/usr/bin/env node

/**
 * Setup Stripe Products using Stripe API
 */

const https = require('https');

// Get Stripe secret key from environment or .env.local
const fs = require('fs');
const path = require('path');

function getStripeKey() {
  // Try environment variable first
  if (process.env.STRIPE_SECRET_KEY) {
    return process.env.STRIPE_SECRET_KEY;
  }
  
  // Try reading from .env.local
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/STRIPE_SECRET_KEY=(.+)/);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  
  throw new Error('STRIPE_SECRET_KEY not found. Set it in .env.local or as environment variable.');
}

const STRIPE_SECRET_KEY = getStripeKey();

function makeStripeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams(data).toString();
    
    const options = {
      hostname: 'api.stripe.com',
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Stripe API error: ${json.error?.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function setupStripe() {
  console.log('🚀 Creating Stripe products...\n');

  try {
    // Create Pro Plan Product
    console.log('📦 Creating Pro Plan product...');
    const proProduct = await makeStripeRequest('/v1/products', {
      name: 'Pro Plan',
      description: '1,000 PDFs per month'
    });
    console.log(`✅ Created Pro Plan product: ${proProduct.id}`);

    // Create Pro Plan Price
    const proPrice = await makeStripeRequest('/v1/prices', {
      product: proProduct.id,
      unit_amount: '900',
      currency: 'usd',
      'recurring[interval]': 'month'
    });
    console.log(`✅ Created Pro Plan price: ${proPrice.id}\n`);

    // Create Enterprise Plan Product
    console.log('📦 Creating Enterprise Plan product...');
    const entProduct = await makeStripeRequest('/v1/products', {
      name: 'Enterprise Plan',
      description: '10,000 PDFs per month'
    });
    console.log(`✅ Created Enterprise Plan product: ${entProduct.id}`);

    // Create Enterprise Plan Price
    const entPrice = await makeStripeRequest('/v1/prices', {
      product: entProduct.id,
      unit_amount: '4900',
      currency: 'usd',
      'recurring[interval]': 'month'
    });
    console.log(`✅ Created Enterprise Plan price: ${entPrice.id}\n`);

    // Update .env.local
    const fs = require('fs');
    const path = require('path');
    const envPath = path.join(__dirname, '..', '.env.local');
    
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      // Update or add Pro Price ID
      if (envContent.includes('STRIPE_PRO_PRICE_ID=')) {
        envContent = envContent.replace(
          /STRIPE_PRO_PRICE_ID=.*/,
          `STRIPE_PRO_PRICE_ID=${proPrice.id}`
        );
      } else {
        envContent += `\nSTRIPE_PRO_PRICE_ID=${proPrice.id}\n`;
      }
      
      // Update or add Enterprise Price ID
      if (envContent.includes('STRIPE_ENTERPRISE_PRICE_ID=')) {
        envContent = envContent.replace(
          /STRIPE_ENTERPRISE_PRICE_ID=.*/,
          `STRIPE_ENTERPRISE_PRICE_ID=${entPrice.id}`
        );
      } else {
        envContent += `STRIPE_ENTERPRISE_PRICE_ID=${entPrice.id}\n`;
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env.local with Price IDs\n');
    } else {
      console.log('⚠️  .env.local not found. Add these manually:\n');
    }

    console.log('📋 Price IDs:');
    console.log(`   STRIPE_PRO_PRICE_ID=${proPrice.id}`);
    console.log(`   STRIPE_ENTERPRISE_PRICE_ID=${entPrice.id}\n`);
    console.log('✅ Stripe products created successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

setupStripe();

