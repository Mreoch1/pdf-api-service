// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'
process.env.STRIPE_SECRET_KEY = 'sk_test_test'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_test'

// Mock Next.js server components
global.Request = class Request {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url
    this.method = init.method || 'GET'
    this.headers = new Headers(init.headers || {})
    this.body = init.body
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
  
  text() {
    return Promise.resolve(this.body || '')
  }
}

global.Headers = class Headers {
  constructor(init = {}) {
    this._headers = {}
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers[key.toLowerCase()] = value
      })
    }
  }
  
  get(name) {
    return this._headers[name.toLowerCase()] || null
  }
  
  set(name, value) {
    this._headers[name.toLowerCase()] = value
  }
  
  has(name) {
    return name.toLowerCase() in this._headers
  }
}

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body
    this.status = init.status || 200
    this.statusText = init.statusText || 'OK'
    this.headers = new Headers(init.headers || {})
  }
  
  async json() {
    return JSON.parse(this.body || '{}')
  }
  
  text() {
    return Promise.resolve(this.body || '')
  }
  
  static json(body, init) {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    })
  }
}

// Mock NextResponse
jest.mock('next/server', () => ({
  NextRequest: class NextRequest extends Request {},
  NextResponse: {
    json: (body, init) => {
      return new Response(JSON.stringify(body), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    },
  },
}))

