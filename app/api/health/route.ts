import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    logger.debug('Health check requested')
    
    // Check database connection
    const supabase = await createServiceClient()
    const { error: dbError } = await supabase.from('api_keys').select('id').limit(1)

    const status = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbError ? 'unhealthy' : 'healthy',
      },
    }

    const isHealthy = !dbError

    if (!isHealthy) {
      logger.warn('Health check failed - database unhealthy', { error: dbError })
    } else {
      logger.debug('Health check passed')
    }

    return NextResponse.json(status, {
      status: isHealthy ? 200 : 503,
    })
  } catch (error) {
    logger.error('Health check error', error as Error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Health check failed',
      },
      { status: 503 }
    )
  }
}

