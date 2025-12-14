#!/bin/bash

# Setup Stripe products using Stripe API
# Get key from .env.local or environment variable
if [ -f .env.local ]; then
  STRIPE_SECRET_KEY=$(grep "STRIPE_SECRET_KEY=" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
else
  STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"
fi

if [ -z "$STRIPE_SECRET_KEY" ]; then
  echo "❌ STRIPE_SECRET_KEY not found. Set it in .env.local"
  exit 1
fi

echo "🚀 Creating Stripe products..."

# Create Pro Plan
echo "📦 Creating Pro Plan..."
PRO_RESPONSE=$(curl -s -X POST https://api.stripe.com/v1/products \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "name=Pro Plan" \
  -d "description=1,000 PDFs per month")

PRO_PRODUCT_ID=$(echo $PRO_RESPONSE | grep -o '"id":"prod_[^"]*' | cut -d'"' -f4)

if [ -z "$PRO_PRODUCT_ID" ]; then
    echo "❌ Failed to create Pro Plan product"
    exit 1
fi

echo "✅ Created Pro Plan product: $PRO_PRODUCT_ID"

# Create Pro Plan Price
PRO_PRICE_RESPONSE=$(curl -s -X POST https://api.stripe.com/v1/prices \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "product=${PRO_PRODUCT_ID}" \
  -d "unit_amount=900" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

PRO_PRICE_ID=$(echo $PRO_PRICE_RESPONSE | grep -o '"id":"price_[^"]*' | cut -d'"' -f4)

if [ -z "$PRO_PRICE_ID" ]; then
    echo "❌ Failed to create Pro Plan price"
    exit 1
fi

echo "✅ Created Pro Plan price: $PRO_PRICE_ID"

# Create Enterprise Plan
echo "📦 Creating Enterprise Plan..."
ENT_RESPONSE=$(curl -s -X POST https://api.stripe.com/v1/products \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "name=Enterprise Plan" \
  -d "description=10,000 PDFs per month")

ENT_PRODUCT_ID=$(echo $ENT_RESPONSE | grep -o '"id":"prod_[^"]*' | cut -d'"' -f4)

if [ -z "$ENT_PRODUCT_ID" ]; then
    echo "❌ Failed to create Enterprise Plan product"
    exit 1
fi

echo "✅ Created Enterprise Plan product: $ENT_PRODUCT_ID"

# Create Enterprise Plan Price
ENT_PRICE_RESPONSE=$(curl -s -X POST https://api.stripe.com/v1/prices \
  -u "${STRIPE_SECRET_KEY}:" \
  -d "product=${ENT_PRODUCT_ID}" \
  -d "unit_amount=4900" \
  -d "currency=usd" \
  -d "recurring[interval]=month")

ENT_PRICE_ID=$(echo $ENT_PRICE_RESPONSE | grep -o '"id":"price_[^"]*' | cut -d'"' -f4)

if [ -z "$ENT_PRICE_ID" ]; then
    echo "❌ Failed to create Enterprise Plan price"
    exit 1
fi

echo "✅ Created Enterprise Plan price: $ENT_PRICE_ID"

# Update .env.local
echo ""
echo "📝 Updating .env.local with Price IDs..."

ENV_FILE=".env.local"
if [ -f "$ENV_FILE" ]; then
    # Update Pro Price ID
    if grep -q "STRIPE_PRO_PRICE_ID=" "$ENV_FILE"; then
        sed -i '' "s|STRIPE_PRO_PRICE_ID=.*|STRIPE_PRO_PRICE_ID=${PRO_PRICE_ID}|" "$ENV_FILE"
    else
        echo "STRIPE_PRO_PRICE_ID=${PRO_PRICE_ID}" >> "$ENV_FILE"
    fi
    
    # Update Enterprise Price ID
    if grep -q "STRIPE_ENTERPRISE_PRICE_ID=" "$ENV_FILE"; then
        sed -i '' "s|STRIPE_ENTERPRISE_PRICE_ID=.*|STRIPE_ENTERPRISE_PRICE_ID=${ENT_PRICE_ID}|" "$ENV_FILE"
    else
        echo "STRIPE_ENTERPRISE_PRICE_ID=${ENT_PRICE_ID}" >> "$ENV_FILE"
    fi
    
    echo "✅ Updated .env.local"
    echo ""
    echo "📋 Price IDs:"
    echo "   Pro: $PRO_PRICE_ID"
    echo "   Enterprise: $ENT_PRICE_ID"
else
    echo "❌ .env.local not found"
    echo "📋 Add these to your .env.local:"
    echo "   STRIPE_PRO_PRICE_ID=${PRO_PRICE_ID}"
    echo "   STRIPE_ENTERPRISE_PRICE_ID=${ENT_PRICE_ID}"
fi

echo ""
echo "✅ Stripe products created successfully!"

