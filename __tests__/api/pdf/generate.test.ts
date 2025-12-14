import { POST } from '@/app/api/pdf/generate/route'

// Mock dependencies
jest.mock('@/lib/utils/api-key')
jest.mock('@/lib/pdf/generator')
jest.mock('@/lib/supabase/server')
jest.mock('@/lib/logger')

describe('/api/pdf/generate', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return 401 if API key is missing', async () => {
    const request = new Request('http://localhost:3000/api/pdf/generate', {
      method: 'POST',
      body: JSON.stringify({ html: '<h1>Test</h1>' }),
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('API key required')
  })

  it('should return 401 if API key is invalid', async () => {
    const { validateApiKey } = require('@/lib/utils/api-key')
    validateApiKey.mockResolvedValue({ valid: false })

    const request = new Request('http://localhost:3000/api/pdf/generate', {
      method: 'POST',
      headers: {
        'x-api-key': 'invalid-key',
      },
      body: JSON.stringify({ html: '<h1>Test</h1>' }),
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('Invalid API key')
  })

  it('should generate PDF with valid API key', async () => {
    const { validateApiKey } = require('@/lib/utils/api-key')
    const { generatePDF } = require('@/lib/pdf/generator')
    const { createServiceClient } = require('@/lib/supabase/server')

    validateApiKey.mockResolvedValue({ valid: true, userId: 'test-user-id' })
    generatePDF.mockResolvedValue(Buffer.from('fake-pdf-content'))
    
    // Create a chainable mock for Supabase queries
    const createChainableMock = () => {
      const mock = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        rpc: jest.fn(),
      }
      return mock
    }

    const mockSupabase = createChainableMock()
    
    // Mock the single() calls with proper sequencing
    mockSupabase.single = jest.fn()
      .mockResolvedValueOnce({ 
        data: { id: 'key-id' }, 
        error: null 
      })
      .mockResolvedValueOnce({ 
        data: { 
          free_tier_used: 0, 
          free_tier_reset_at: new Date(Date.now() + 86400000).toISOString() 
        }, 
        error: null 
      })
      .mockResolvedValueOnce({ 
        data: null, 
        error: { code: 'PGRST116' } // No subscription found
      })

    // Mock update and insert to return chainable
    mockSupabase.update.mockResolvedValue({ error: null })
    mockSupabase.insert.mockResolvedValue({ error: null })
    mockSupabase.rpc.mockResolvedValue({ error: null })

    createServiceClient.mockResolvedValue(mockSupabase)

    const request = new Request('http://localhost:3000/api/pdf/generate', {
      method: 'POST',
      headers: {
        'x-api-key': 'valid-key',
      },
      body: JSON.stringify({ html: '<h1>Test</h1>' }),
    })

    const response = await POST(request as any)

    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toBe('application/pdf')
  })
})
