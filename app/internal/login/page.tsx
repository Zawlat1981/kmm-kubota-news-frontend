'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function InternalLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/internal-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.push('/internal/stock')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Password မှားနေပါသည်')
      }
    } catch {
      setError('တစ်ခုခု မှားယွင်းသွားပါသည်။ ထပ်ကြိုးစားပါ။')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-1">KMM Internal Access</h1>
        <p className="text-sm text-gray-500 mb-6">
          Stock စာရင်းကို ကြည့်ရန် Password ထည့်ပါ
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm text-gray-900"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition text-sm"
          >
            {loading ? 'စစ်ဆေးနေသည်...' : 'ဝင်ရောက်ရန်'}
          </button>
        </form>
      </div>
    </main>
  )
}