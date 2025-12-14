'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (plan: 'pro' | 'enterprise') => {
    setLoading(plan)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })
      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that fits your needs. All plans include API access and documentation.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-y-6 sm:mt-20 lg:max-w-4xl lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
          {/* Free Tier */}
          <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-900/10 sm:p-10">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">Free</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900">$0</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                10 PDFs per month
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                API access
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Basic support
              </li>
            </ul>
            <Link
              href="/auth/signup"
              className="mt-8 block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800"
            >
              Get started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="flex flex-col rounded-3xl bg-blue-600 p-8 shadow-sm ring-1 ring-gray-900/10 sm:p-10 lg:z-10 lg:rounded-none">
            <h3 className="text-lg font-semibold leading-8 text-white">Pro</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-white">$9</span>
              <span className="text-sm font-semibold leading-6 text-blue-200">/month</span>
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-blue-200">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                1,000 PDFs per month
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Priority processing
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Email support
              </li>
            </ul>
            <button
              onClick={() => handleCheckout('pro')}
              disabled={loading === 'pro'}
              className="mt-8 block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold leading-6 text-blue-600 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loading === 'pro' ? 'Loading...' : 'Get started'}
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-900/10 sm:p-10">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">Enterprise</h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className="text-5xl font-bold tracking-tight text-gray-900">$49</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
            </p>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                10,000 PDFs per month
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Highest priority
              </li>
              <li className="flex gap-x-3">
                <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                Priority support
              </li>
            </ul>
            <button
              onClick={() => handleCheckout('enterprise')}
              disabled={loading === 'enterprise'}
              className="mt-8 block rounded-md bg-gray-900 px-3 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {loading === 'enterprise' ? 'Loading...' : 'Get started'}
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Pay-as-you-go</h2>
          <p className="mt-4 text-gray-600">
            Need more flexibility? After your free tier or subscription limit, pay just $0.01 per PDF.
            No hidden fees, no commitments.
          </p>
        </div>
      </div>
    </div>
  )
}

