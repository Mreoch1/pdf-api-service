import { GET } from '@/app/api/health/route'

// Mock dependencies
jest.mock('@/lib/supabase/server')
jest.mock('@/lib/logger')

describe('/api/health', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return healthy status when database is connected', async () => {
    const { createServiceClient } = require('@/lib/supabase/server')
    
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ error: null }),
    }

    createServiceClient.mockResolvedValue(mockSupabase)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.status).toBe('healthy')
    expect(data.services.database).toBe('healthy')
  })

  it('should return unhealthy status when database fails', async () => {
    const { createServiceClient } = require('@/lib/supabase/server')
    
    const mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ error: { message: 'Connection failed' } }),
    }

    createServiceClient.mockResolvedValue(mockSupabase)

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('healthy') // Still says healthy but with 503 status
    expect(data.services.database).toBe('unhealthy')
  })

  it('should handle errors gracefully', async () => {
    const { createServiceClient } = require('@/lib/supabase/server')
    
    createServiceClient.mockRejectedValue(new Error('Service unavailable'))

    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(503)
    expect(data.status).toBe('unhealthy')
    expect(data.error).toBe('Health check failed')
  })
})

