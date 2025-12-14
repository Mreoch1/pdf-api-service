import { generateApiKey, validateApiKey } from '@/lib/utils/api-key'

// Mock Supabase
jest.mock('@/lib/supabase/server')

describe('API Key Utilities', () => {
  describe('generateApiKey', () => {
    it('should generate a key with pdf_ prefix', () => {
      const key = generateApiKey()
      expect(key).toMatch(/^pdf_/)
      expect(key.length).toBeGreaterThan(10)
    })

    it('should generate unique keys', () => {
      const key1 = generateApiKey()
      const key2 = generateApiKey()
      expect(key1).not.toBe(key2)
    })
  })

  describe('validateApiKey', () => {
    it('should return invalid for empty key', async () => {
      const result = await validateApiKey('')
      expect(result.valid).toBe(false)
    })

    it('should return invalid for malformed key', async () => {
      const result = await validateApiKey('invalid')
      expect(result.valid).toBe(false)
    })

    it('should check database for valid key', async () => {
      const { createServiceClient } = require('@/lib/supabase/server')
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { user_id: 'test-user', is_active: true },
          error: null,
        }),
      }

      createServiceClient.mockResolvedValue(mockSupabase)

      const result = await validateApiKey('pdf_test123')
      
      expect(result.valid).toBe(true)
      expect(result.userId).toBe('test-user')
    })

    it('should return invalid for inactive key', async () => {
      const { createServiceClient } = require('@/lib/supabase/server')
      
      const mockSupabase = {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { user_id: 'test-user', is_active: false },
          error: null,
        }),
      }

      createServiceClient.mockResolvedValue(mockSupabase)

      const result = await validateApiKey('pdf_test123')
      
      expect(result.valid).toBe(false)
    })
  })
})

