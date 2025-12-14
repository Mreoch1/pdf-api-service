import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
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

    return NextResponse.json(status, {
      status: isHealthy ? 200 : 503,
    })
  } catch (error) {
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

