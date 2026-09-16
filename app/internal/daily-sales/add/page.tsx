'use client'

import { useState } from 'react'
import Link from 'next/link'

const initialForm = {
  branch: 'KMM01',
  saleDate: new Date().toISOString().slice(0, 10),
  model: '',
  customerName: '',
  division: '',
  paymentType: 'Cash',
  salesPerson: '',
  photoUrl: '',
  stockRemaining: '',
}

export default function AddDailySalePage() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/internal/daily-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const data = await response.json()
        setMessage(`❌ ${data.error || 'သိမ်းဆည်း၍ မရပါ'}`)
        return
      }

      setMessage('✅ Daily sale ထည့်ပြီးပါပြီ')
      setForm((current) => ({ ...initialForm, branch: current.branch, saleDate: current.saleDate }))
    } catch {
      setMessage('❌ တစ်ခုခု မှားယွင်းသွားပါသည်')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        <Link href="/daily-sales" className="text-sm text-gray-500 hover:text-red-600 mb-4 inline-block">
          ← Daily Sales Report သို့ ပြန်သွားရန်
        </Link>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-xl font-bold text-gray-900">Add Daily Sale</h1>
          <p className="text-sm text-gray-500 mt-1 mb-6">ရောင်းချပြီး စက်အချက်အလက် ဖြည့်ပါ</p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700">Branch
              <select value={form.branch} onChange={(e) => updateField('branch', e.target.value)} className="field" required>
                <option>KMM01</option><option>KMM02</option><option>KMM03</option>
              </select>
            </label>
            <label className="text-sm text-gray-700">Sale date
              <input type="date" value={form.saleDate} onChange={(e) => updateField('saleDate', e.target.value)} className="field" required />
            </label>
            <label className="text-sm text-gray-700">Model
              <input value={form.model} onChange={(e) => updateField('model', e.target.value)} className="field" placeholder="L4018" required />
            </label>
            <label className="text-sm text-gray-700">Customer name
              <input value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} className="field" required />
            </label>
            <label className="text-sm text-gray-700">Division
              <input value={form.division} onChange={(e) => updateField('division', e.target.value)} className="field" placeholder="Mawlamyine" required />
            </label>
            <label className="text-sm text-gray-700">Payment type
              <select value={form.paymentType} onChange={(e) => updateField('paymentType', e.target.value)} className="field" required>
                <option>Cash</option><option>Installment</option>
              </select>
            </label>
            <label className="text-sm text-gray-700">Sales person
              <input value={form.salesPerson} onChange={(e) => updateField('salesPerson', e.target.value)} className="field" required />
            </label>
            <label className="text-sm text-gray-700">Stock remaining (optional)
              <input type="number" min="0" step="1" value={form.stockRemaining} onChange={(e) => updateField('stockRemaining', e.target.value)} className="field" placeholder="ညနေမှ ဖြည့်နိုင်သည်" />
            </label>
            <label className="text-sm text-gray-700 sm:col-span-2">Photo URL (optional)
              <input type="url" value={form.photoUrl} onChange={(e) => updateField('photoUrl', e.target.value)} className="field" placeholder="https://..." />
            </label>

            {message && <p className="sm:col-span-2 text-sm">{message}</p>}
            <button type="submit" disabled={loading} className="sm:col-span-2 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-semibold rounded-lg text-sm">
              {loading ? 'သိမ်းနေသည်...' : 'Save Daily Sale'}
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`.field { display: block; width: 100%; margin-top: 0.35rem; border: 1px solid #d1d5db; border-radius: 0.5rem; padding: 0.55rem 0.75rem; font-size: 0.875rem; color: #111827; background: white; }`}</style>
    </main>
  )
}