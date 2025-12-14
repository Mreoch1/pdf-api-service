import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/utils/api-key'
import { createServiceClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn('API key creation attempted without authentication')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const name = body.name || 'Default API Key'

    logger.info('Creating API key', { userId: user.id, name })

    const apiKey = generateApiKey()
    const serviceClient = await createServiceClient()

    const { data, error } = await serviceClient
      .from('api_keys')
      .insert({
        user_id: user.id,
        key: apiKey,
        name,
      })
      .select()
      .single()

    if (error) {
      logger.error('Error creating API key', error as Error, { userId: user.id, name })
      return NextResponse.json(
        { error: 'Failed to create API key' },
        { status: 500 }
      )
    }

    logger.info('API key created successfully', { userId: user.id, keyId: data.id, name })

    return NextResponse.json({
      id: data.id,
      key: apiKey, // Only return the key once
      name: data.name,
      created_at: data.created_at,
    })
  } catch (error) {
    logger.error('API key creation error', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn('API keys fetch attempted without authentication')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    logger.debug('Fetching API keys', { userId: user.id })

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, is_active, created_at, last_used_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching API keys', error as Error, { userId: user.id })
      return NextResponse.json(
        { error: 'Failed to fetch API keys' },
        { status: 500 }
      )
    }

    logger.debug('API keys fetched', { userId: user.id, count: data?.length || 0 })

    return NextResponse.json(data)
  } catch (error) {
    logger.error('API keys fetch error', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      logger.warn('API key deletion attempted without authentication')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      logger.warn('API key deletion attempted without key ID', { userId: user.id })
      return NextResponse.json(
        { error: 'API key ID required' },
        { status: 400 }
      )
    }

    logger.info('Deleting API key', { userId: user.id, keyId })

    const { error } = await supabase
      .from('api_keys')
      .update({ is_active: false })
      .eq('id', keyId)
      .eq('user_id', user.id)

    if (error) {
      logger.error('Error deleting API key', error as Error, { userId: user.id, keyId })
      return NextResponse.json(
        { error: 'Failed to delete API key' },
        { status: 500 }
      )
    }

    logger.info('API key deleted successfully', { userId: user.id, keyId })

    return NextResponse.json({ success: true })
  } catch (error) {
    logger.error('API key deletion error', error as Error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

