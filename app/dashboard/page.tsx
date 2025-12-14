'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ApiKey {
  id: string
  name: string | null
  is_active: boolean
  created_at: string
  last_used_at: string | null
}

interface UsageStats {
  total: number
  thisMonth: number
  freeTierUsed: number
  freeTierLimit: number
}

interface Subscription {
  status: string
  stripe_price_id: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [creatingKey, setCreatingKey] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      if (!currentUser) {
        router.push('/auth/login')
        return
      }

      setUser(currentUser)

      // Load API keys
      const { data: keys } = await fetch('/api/auth/api-key').then(r => r.json())
      setApiKeys(keys || [])

      // Load usage stats
      const { data: metadata } = await supabase
        .from('user_metadata')
        .select('free_tier_used, free_tier_reset_at')
        .single()

      const { data: usage } = await supabase
        .from('usage_logs')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUser.id)

      const thisMonth = new Date()
      const { data: thisMonthUsage } = await supabase
        .from('usage_logs')
        .select('id', { count: 'exact' })
        .eq('user_id', currentUser.id)
        .gte('created_at', new Date(thisMonth.getFullYear(), thisMonth.getMonth(), 1).toISOString())

      setUsageStats({
        total: usage?.length || 0,
        thisMonth: thisMonthUsage?.length || 0,
        freeTierUsed: metadata?.free_tier_used || 0,
        freeTierLimit: 10,
      })

      // Load subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, stripe_price_id')
        .eq('user_id', currentUser.id)
        .single()

      setSubscription(sub)
    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  async function createApiKey() {
    if (!newKeyName.trim()) return

    setCreatingKey(true)
    try {
      const response = await fetch('/api/auth/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName }),
      })

      const data = await response.json()
      
      if (response.ok) {
        alert(`API Key created! Save it now - you won't be able to see it again:\n\n${data.key}`)
        setNewKeyName('')
        loadData()
      } else {
        alert('Error creating API key: ' + data.error)
      }
    } catch (error) {
      alert('Error creating API key')
    } finally {
      setCreatingKey(false)
    }
  }

  async function deleteApiKey(keyId: string) {
    if (!confirm('Are you sure you want to delete this API key?')) return

    try {
      const response = await fetch(`/api/auth/api-key?id=${keyId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadData()
      }
    } catch (error) {
      alert('Error deleting API key')
    }
  }

  async function handleBillingPortal() {
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
      })
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error opening billing portal:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        {/* Usage Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Total PDFs Generated</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{usageStats?.total || 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{usageStats?.thisMonth || 0}</p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500">Free Tier Usage</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {usageStats?.freeTierUsed || 0} / {usageStats?.freeTierLimit || 10}
            </p>
            <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-blue-600"
                style={{
                  width: `${((usageStats?.freeTierUsed || 0) / (usageStats?.freeTierLimit || 10)) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Subscription Status */}
        {subscription && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Status: <span className="font-medium text-gray-900">{subscription.status}</span>
                </p>
              </div>
              <button
                onClick={handleBillingPortal}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Manage Billing
              </button>
            </div>
          </div>
        )}

        {!subscription && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Upgrade Your Plan</h2>
            <p className="mt-2 text-sm text-gray-600">
              Get more PDFs and priority support with a subscription.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              View Pricing
            </Link>
          </div>
        )}

        {/* API Keys */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && createApiKey()}
              />
              <button
                onClick={createApiKey}
                disabled={creatingKey}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingKey ? 'Creating...' : 'Create Key'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            {apiKeys.length === 0 ? (
              <p className="text-sm text-gray-500">No API keys yet. Create one to get started.</p>
            ) : (
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between rounded-md border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{key.name || 'Unnamed Key'}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(key.created_at).toLocaleDateString()}
                        {key.last_used_at && (
                          <> • Last used: {new Date(key.last_used_at).toLocaleDateString()}</>
                        )}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Status: {key.is_active ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Quick Links</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/docs"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              API Documentation →
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View Pricing →
            </Link>
          </div>
        </div>

        {/* Sign Out */}
        <div className="mt-8">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

