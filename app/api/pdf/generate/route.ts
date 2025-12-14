import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/utils/api-key'
import { generatePDF } from '@/lib/pdf/generator'
import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const requestSchema = z.object({
  html: z.string().min(1),
  format: z.enum(['A4', 'Letter', 'Legal']).optional(),
  margin: z.object({
    top: z.string().optional(),
    right: z.string().optional(),
    bottom: z.string().optional(),
    left: z.string().optional(),
  }).optional(),
  printBackground: z.boolean().optional(),
  scale: z.number().min(0.1).max(2).optional(),
})

const FREE_TIER_LIMIT = 10
const PAY_PER_USE_CENTS = 1 // $0.01 per PDF

async function checkUsageLimit(userId: string): Promise<{ allowed: boolean; isFree: boolean }> {
  const supabase = await createServiceClient()
  
  // Get user metadata
  const { data: metadata } = await supabase
    .from('user_metadata')
    .select('free_tier_used, free_tier_reset_at')
    .eq('user_id', userId)
    .single()

  if (!metadata) {
    // Initialize metadata if it doesn't exist
    await supabase.from('user_metadata').insert({ user_id: userId })
    return { allowed: true, isFree: true }
  }

  // Check if free tier reset is needed
  const resetAt = new Date(metadata.free_tier_reset_at)
  const now = new Date()
  
  if (now > resetAt) {
    // Reset free tier
    await supabase
      .from('user_metadata')
      .update({
        free_tier_used: 0,
        free_tier_reset_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .eq('user_id', userId)
    
    return { allowed: true, isFree: true }
  }

  // Check subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, stripe_price_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  if (subscription) {
    // User has active subscription, allow unlimited
    return { allowed: true, isFree: false }
  }

  // Check free tier usage
  if (metadata.free_tier_used < FREE_TIER_LIMIT) {
    return { allowed: true, isFree: true }
  }

  // User exceeded free tier, need to check if they can pay
  return { allowed: true, isFree: false }
}

async function logUsage(userId: string, apiKeyId: string | null, isFree: boolean) {
  const supabase = await createServiceClient()
  
  const costCents = isFree ? 0 : PAY_PER_USE_CENTS

  // Log usage
  await supabase.from('usage_logs').insert({
    user_id: userId,
    api_key_id: apiKeyId,
    pdf_generated: true,
    cost_cents: costCents,
  })

  // Update free tier usage if applicable
  if (isFree) {
    await supabase.rpc('increment_free_tier', { user_id: userId })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required. Provide it in X-API-Key header or Authorization: Bearer <key>' },
        { status: 401 }
      )
    }

    // Validate API key
    const { valid, userId } = await validateApiKey(apiKey)
    
    if (!valid || !userId) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }

    // Get API key details for logging
    const supabase = await createServiceClient()
    const { data: keyData } = await supabase
      .from('api_keys')
      .select('id')
      .eq('key', apiKey)
      .single()

    // Update last used timestamp
    if (keyData) {
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', keyData.id)
    }

    // Check usage limits
    const { allowed, isFree } = await checkUsageLimit(userId)
    
    if (!allowed) {
      return NextResponse.json(
        { error: 'Usage limit exceeded. Please upgrade your plan.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const validatedData = requestSchema.parse(body)

    // Generate PDF
    const pdfBuffer = await generatePDF(validatedData.html, {
      format: validatedData.format,
      margin: validatedData.margin,
      printBackground: validatedData.printBackground,
      scale: validatedData.scale,
    })

    // Log usage
    await logUsage(userId, keyData?.id || null, isFree)

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="generated.pdf"',
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

