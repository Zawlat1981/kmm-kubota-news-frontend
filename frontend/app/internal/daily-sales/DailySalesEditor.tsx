'use client'

import { useState } from 'react'

interface EditableSale {
  id: string
  branch: string
  saleDate: string
  model: string
  customerName: string
  division: string
  paymentType: string
  salesPerson: string
  photoUrl: string
  stockRemaining: number
}

type Field = Exclude<keyof EditableSale, 'id'>

export default function DailySalesEditor({ sales: initialSales }: { sales: EditableSale[] }) {
  const [sales, setSales] = useState(initialSales)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const updateField = (id: string, field: Field, value: string) => {
    setSales((current) => current.map((sale) => sale.id === id ? { ...sale, [field]: field === 'stockRemaining' ? Number(value) : value } : sale))
  }

  const saveSale = async (sale: EditableSale) => {
    setSavingId(sale.id)
    setMessage('')
    const response = await fetch('/api/internal/daily-sales', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sale),
    })
    setSavingId(null)
    if (response.ok) {
      setMessage('စာရင်းကို သိမ်းပြီးပါပြီ')
    } else {
      const data = await response.json().catch(() => ({}))
      setMessage(data.error || 'သိမ်း၍ မရပါ')
    }
  }

  if (sales.length === 0) {
    return <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-gray-500">စာရင်းမရှိသေးပါ။</div>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {message && <p className="border-b border-gray-100 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700">{message}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1250px] text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3">Branch</th>
              <th className="px-3 py-3">Model</th>
              <th className="px-3 py-3">Customer</th>
              <th className="px-3 py-3">Region</th>
              <th className="px-3 py-3">Payment</th>
              <th className="px-3 py-3">Sales person</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3">Photo URL</th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map((sale) => (
              <tr key={sale.id} className="align-top hover:bg-red-50/30">
                <td className="px-3 py-3"><input type="date" value={sale.saleDate} onChange={(event) => updateField(sale.id, 'saleDate', event.target.value)} className="edit-field w-36" /></td>
                <td className="px-3 py-3"><select value={sale.branch} onChange={(event) => updateField(sale.id, 'branch', event.target.value)} className="edit-field w-24"><option>KMM01</option><option>KMM02</option><option>KMM03</option></select></td>
                <td className="px-3 py-3"><input value={sale.model} onChange={(event) => updateField(sale.id, 'model', event.target.value)} className="edit-field w-36" /></td>
                <td className="px-3 py-3"><input value={sale.customerName} onChange={(event) => updateField(sale.id, 'customerName', event.target.value)} className="edit-field w-40" /></td>
                <td className="px-3 py-3"><input value={sale.division} onChange={(event) => updateField(sale.id, 'division', event.target.value)} className="edit-field w-36" /></td>
                <td className="px-3 py-3"><select value={sale.paymentType} onChange={(event) => updateField(sale.id, 'paymentType', event.target.value)} className="edit-field w-32"><option>Cash</option><option>Installment</option></select></td>
                <td className="px-3 py-3"><input value={sale.salesPerson} onChange={(event) => updateField(sale.id, 'salesPerson', event.target.value)} className="edit-field w-36" /></td>
                <td className="px-3 py-3"><input type="number" min="0" step="1" value={sale.stockRemaining} onChange={(event) => updateField(sale.id, 'stockRemaining', event.target.value)} className="edit-field w-20" /></td>
                <td className="px-3 py-3"><input type="url" value={sale.photoUrl} onChange={(event) => updateField(sale.id, 'photoUrl', event.target.value)} className="edit-field w-52" placeholder="https://..." /></td>
                <td className="px-3 py-3"><button type="button" onClick={() => saveSale(sale)} disabled={savingId === sale.id} className="whitespace-nowrap rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:bg-gray-300">{savingId === sale.id ? 'သိမ်းနေသည်...' : 'Save'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`.edit-field { border: 1px solid #d1d5db; border-radius: 0.45rem; padding: 0.45rem 0.55rem; color: #111827; background: white; }`}</style>
    </div>
  )
}