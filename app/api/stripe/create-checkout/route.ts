import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const PRICE_IDS = {
  pro: process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { priceId, plan } = body

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single()

    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      // Get user email
      const { data: { user: userData } } = await supabase.auth.getUser()
      
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: userData?.email,
        metadata: {
          user_id: user.id,
        },
      })

      customerId = customer.id

      // Store customer ID
      await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          stripe_customer_id: customerId,
          status: 'incomplete',
        })
    }

    // Determine price ID
    const finalPriceId = priceId || (plan === 'enterprise' ? PRICE_IDS.enterprise : PRICE_IDS.pro)

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        user_id: user.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

