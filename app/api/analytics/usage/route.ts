import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get usage data
    const { data: usage, error } = await supabase
      .from('usage_logs')
      .select('created_at, cost_cents')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch usage data' },
        { status: 500 }
      )
    }

    // Aggregate by day
    const dailyUsage: Record<string, { count: number; cost: number }> = {}
    
    usage?.forEach((log) => {
      const date = new Date(log.created_at).toISOString().split('T')[0]
      if (!dailyUsage[date]) {
        dailyUsage[date] = { count: 0, cost: 0 }
      }
      dailyUsage[date].count += 1
      dailyUsage[date].cost += log.cost_cents || 0
    })

    return NextResponse.json({
      period: { days, startDate: startDate.toISOString() },
      total: usage?.length || 0,
      totalCost: usage?.reduce((sum, log) => sum + (log.cost_cents || 0), 0) || 0,
      daily: dailyUsage,
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

