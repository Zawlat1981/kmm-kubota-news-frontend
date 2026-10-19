'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AddStockItemPage() {
  const [branchCode, setBranchCode] = useState('')
  const [brand, setBrand] = useState('')
  const [modelNumber, setModelNumber] = useState('')
  const [serialNumber, setSerialNumber] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/internal/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchCode: branchCode.trim().toUpperCase(),
          brand: brand.trim() || undefined,
          modelNumber: modelNumber.trim(),
          serialNumber: serialNumber.trim() || undefined,
        }),
      })

      if (res.ok) {
        setMessage(`✅ ${modelNumber} ကို ${branchCode.toUpperCase()} အောက်မှာ ထည့်ပြီးပါပြီ`)
        // Keep branchCode and brand (usually entering several units in a row),
        // clear model/serial for the next entry.
        setModelNumber('')
        setSerialNumber('')
      } else {
        const data = await res.json()
        setMessage(`❌ ${data.error || 'မှားယွင်းသွားပါသည်'}`)
      }
    } catch {
      setMessage('❌ တစ်ခုခု မှားယွင်းသွားပါသည်')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <Link href="/internal/stock" className="text-sm text-gray-500 hover:text-red-600 mb-4 inline-block">
          ← Stock List သို့ ပြန်သွားရန်
        </Link>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-lg font-bold text-gray-900 mb-1">Add Stock Item</h1>
          <p className="text-sm text-gray-500 mb-6">
            Photo ထဲက Model Number ကို ကြည့်ပြီး တစ်ခုချင်း ဖြည့်ပါ
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Branch Code (ဥပမာ - KMM01)
              </label>
              <input
                type="text"
                value={branchCode}
                onChange={(e) => setBranchCode(e.target.value)}
                placeholder="KMM01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Brand (Optional)</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Kubota"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Model Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                placeholder="TC944-15100"
                required
                autoFocus
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Serial Number (Optional)
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="18348"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {message && <p className="text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading || !branchCode || !modelNumber}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold rounded-lg transition text-sm"
            >
              {loading ? 'ထည့်နေသည်...' : '+ ထည့်ပါ (ဆက်လက် ထည့်နိုင်သည်)'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}