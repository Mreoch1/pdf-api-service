import { createServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

const apiKeySchema = z.string().min(1)

export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    const key = apiKeySchema.parse(apiKey)
    const supabase = await createServiceClient()
    
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id, is_active')
      .eq('key', key)
      .single()

    if (error || !data || !data.is_active) {
      return { valid: false }
    }

    return { valid: true, userId: data.user_id }
  } catch {
    return { valid: false }
  }
}

export function generateApiKey(): string {
  const prefix = 'pdf_'
  const randomBytes = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return `${prefix}${randomBytes}`
}

